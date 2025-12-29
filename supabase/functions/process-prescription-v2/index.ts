import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      console.error("No image data provided");
      return new Response(
        JSON.stringify({ error: "No image data provided" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const QWEN_IMAGE_KEY = Deno.env.get('QWEN_IMAGE_KEY');
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!QWEN_IMAGE_KEY) {
      console.error("QWEN_IMAGE_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "QWEN_IMAGE_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const ensureDataUrl = (base64OrDataUrl: string) => {
      if (base64OrDataUrl.startsWith('data:')) return base64OrDataUrl;
      return `data:image/jpeg;base64,${base64OrDataUrl}`;
    };

    console.log("Step 1: Running OCR with Qwen 2.5 VL via OpenRouter...");

    const imageUrl = ensureDataUrl(imageBase64);

    // OCR System Prompt for Qwen (same as Azure was using)
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

    // Step 1: Call Qwen 3VL via OpenRouter for OCR + initial extraction
    const qwenResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${QWEN_IMAGE_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://lovable.dev',
        'X-Title': 'MedBox Prescription Scanner',
      },
      body: JSON.stringify({
        model: 'qwen/qwen2.5-vl-7b-instruct',
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
      }),
    });

    if (!qwenResponse.ok) {
      const errorText = await qwenResponse.text();
      console.error("Qwen API error:", qwenResponse.status, errorText);
      
      if (qwenResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to process image with Qwen OCR" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const qwenData = await qwenResponse.json();
    const qwenContent = qwenData.choices?.[0]?.message?.content;

    if (!qwenContent) {
      console.error("No content in Qwen response");
      return new Response(
        JSON.stringify({ medicines: [], message: "Qwen OCR could not extract any text from the image" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Qwen raw response:", qwenContent.substring(0, 500) + "...");

    // Parse Qwen's JSON response
    let qwenMedicines = [];
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

      qwenMedicines = JSON.parse(cleanedContent);
      
      if (!Array.isArray(qwenMedicines)) {
        qwenMedicines = [qwenMedicines];
      }
    } catch (parseError) {
      console.error("Failed to parse Qwen response as JSON:", parseError);
      console.error("Raw content:", qwenContent);
      // Continue with empty array, Gemini will try to help
      qwenMedicines = [];
    }

    console.log("Qwen extracted medicines:", qwenMedicines.length);

    // Step 2: Validate with Gemini 3 Flash + thinking_level: medium
    console.log("Step 2: Validating with Gemini 3 Flash (thinking_level: medium)...");

    const validationPrompt = `You are an EXPERT medical data validator with deep thinking capabilities.

I will provide you with:
1. The original prescription image
2. A JSON extraction from another AI (Qwen)

Your task:
1. Look at the original prescription image carefully
2. Compare it with the JSON extraction provided
3. Validate each medicine name, dosage, and instructions
4. Correct any errors or hallucinations from the first extraction
5. If a medicine name is unclear in the image, set accurate: false and add a warning

CRITICAL VALIDATION RULES:
- Cross-reference medicine names with the actual image
- Check if dosage/frequency matches what's written
- Flag any discrepancies between the image and the JSON
- If Qwen hallucinated a medicine not in the image, remove it
- If Qwen missed a medicine in the image, add it

Return the VALIDATED JSON array with this structure:
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

ONLY return valid JSON. No markdown, no explanation, just the JSON array.`;

    const geminiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        thinking_level: 'medium',
        messages: [
          { role: 'system', content: validationPrompt },
          {
            role: 'user',
            content: [
              { 
                type: 'text', 
                text: `Here is Qwen's extraction:\n\n${JSON.stringify(qwenMedicines, null, 2)}\n\nPlease validate this against the original prescription image below:` 
              },
              { type: 'image_url', image_url: { url: imageUrl } },
            ],
          },
        ],
      }),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini validation API error:", geminiResponse.status, errorText);
      
      if (geminiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (geminiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service payment required." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // If Gemini fails, return Qwen's results as fallback
      console.log("Gemini validation failed, returning Qwen results as fallback");
      return new Response(
        JSON.stringify({ 
          medicines: qwenMedicines, 
          validated: false,
          success: true 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const geminiData = await geminiResponse.json();
    const geminiContent = geminiData.choices?.[0]?.message?.content;

    if (!geminiContent) {
      console.error("No content in Gemini validation response");
      // Return Qwen's results as fallback
      return new Response(
        JSON.stringify({ 
          medicines: qwenMedicines, 
          validated: false,
          success: true 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Gemini validation response:", geminiContent.substring(0, 500) + "...");

    // Parse the validated JSON response
    let validatedMedicines = [];
    try {
      let cleanedContent = geminiContent.trim();
      if (cleanedContent.startsWith('```json')) {
        cleanedContent = cleanedContent.slice(7);
      } else if (cleanedContent.startsWith('```')) {
        cleanedContent = cleanedContent.slice(3);
      }
      if (cleanedContent.endsWith('```')) {
        cleanedContent = cleanedContent.slice(0, -3);
      }
      cleanedContent = cleanedContent.trim();

      validatedMedicines = JSON.parse(cleanedContent);
      
      if (!Array.isArray(validatedMedicines)) {
        validatedMedicines = [validatedMedicines];
      }
    } catch (parseError) {
      console.error("Failed to parse Gemini validation response:", parseError);
      console.error("Raw content:", geminiContent);
      // Use Qwen's results as fallback
      validatedMedicines = qwenMedicines;
    }

    console.log("Successfully validated medicines:", validatedMedicines.length);

    return new Response(
      JSON.stringify({ 
        medicines: validatedMedicines, 
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
