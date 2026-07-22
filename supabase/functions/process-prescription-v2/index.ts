import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Please log in to scan prescriptions' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const token = authHeader.replace('Bearer ', '');
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('Authentication failed:', authError?.message);
      return new Response(
        JSON.stringify({ error: 'Please log in again to scan prescriptions' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Authenticated user:', user.id);
    
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      console.error("No image data provided");
      return new Response(
        JSON.stringify({ error: "No image data provided" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Using the user-provided Groq key for Qwen 3.6 27B
    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');
    
    if (!GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "GROQ_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const ensureDataUrl = (base64OrDataUrl: string) => {
      if (base64OrDataUrl.startsWith('data:')) return base64OrDataUrl;
      return `data:image/jpeg;base64,${base64OrDataUrl}`;
    };

    console.log("Running OCR with Groq qwen/qwen3.6-27b...");
    const imageUrl = ensureDataUrl(imageBase64);

    const ocrSystemPrompt = `You are an EXPERT medical data validator. I will provide you with a medical prescription image.

Your goal:
1. Extract ALL readable text from this prescription image.
2. Map the messy OCR text to real-world pharmaceutical names.
3. Extract dosage instructions (e.g., '1-0-1' or 'twice daily').
4. Format as JSON
5. CRITICAL: If a drug name looks like a dangerous misspelling or the text is too garbled to be at least 90% sure, set the accurate flag to false & append a warning.

Return a JSON array of medicines with this exact structure:
[
  {
    "name": "Medicine Name",
    "strength": "500mg or unknown",
    "type": "tablet|capsule|syrup|injection|cream|drops|inhaler|other",
    "dosage": "1-0-1 or twice daily",
    "frequency": "after meals|before meals|with meals|as needed",
    "duration": "7 days or as prescribed",
    "accurate": true,
    "warning": null
  }
]

If you cannot identify a medicine or if the text is too unclear:
- Set "accurate": false
- Add a "warning" field explaining the issue (e.g., "Cannot identify, please search & add manually")

ONLY return valid JSON. No markdown, no explanation, just the JSON array.`;

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen/qwen3.6-27b',
        messages: [
          { role: 'system', content: ocrSystemPrompt },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Extract medicine information from this prescription image.' },
              { type: 'image_url', image_url: { url: imageUrl } },
            ],
          },
        ],
        temperature: 0.1,
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error("Groq API error:", groqResponse.status, errorText);
      
      if (groqResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
       return new Response(
         JSON.stringify({ 
           error: "Failed to process image with Qwen OCR via Groq",
           details: errorText,
           status: groqResponse.status,
         }),
         { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
       );
    }

    const groqData = await groqResponse.json();
    const qwenContent = groqData.choices?.[0]?.message?.content;

    if (!qwenContent) {
      console.error("No content in Groq response");
      return new Response(
        JSON.stringify({ medicines: [], message: "Qwen OCR could not extract any text from the image" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Qwen raw response:", qwenContent.substring(0, 500) + "...");

    let medicines = [];
    try {
      let cleanedContent = qwenContent.trim();
      if (cleanedContent.startsWith('```json')) {
        cleanedContent = cleanedContent.slice(7);
      } else if (cleanedContent.startsWith('```')) {
        cleanedContent = cleanedContent.slice(3);
      }
      if (cleanedContent.endsWith('```')) {
        cleanedContent = cleanedContent.slice(0, -3);
      }
      cleanedContent = cleanedContent.trim();

      medicines = JSON.parse(cleanedContent);
      
      if (!Array.isArray(medicines)) {
        medicines = [medicines];
      }
    } catch (parseError) {
      console.error("Failed to parse Qwen response as JSON:", parseError);
      console.error("Raw content:", qwenContent);
      medicines = [];
    }

    console.log("Successfully extracted medicines:", medicines.length);

    return new Response(
      JSON.stringify({ 
        medicines, 
        validated: true,
        success: true 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error("Error in process-prescription-v2:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
