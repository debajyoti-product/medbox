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

    const AZURE_VISION_ENDPOINT = Deno.env.get('AZURE_VISION_ENDPOINT');
    const AZURE_VISION_KEY = Deno.env.get('AZURE_VISION_KEY');
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!AZURE_VISION_ENDPOINT || !AZURE_VISION_KEY) {
      console.error("Azure Vision credentials not configured");
      return new Response(
        JSON.stringify({ error: "Azure Vision credentials not configured" }),
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

    console.log("Step 1: Sending image to Azure Document Intelligence Read API...");

    // Step 1: Send image to Azure Document Intelligence Read API
    const imageBuffer = Uint8Array.from(atob(imageBase64), c => c.charCodeAt(0));
    
    const analyzeUrl = `${AZURE_VISION_ENDPOINT}/vision/v3.2/read/analyze`;
    
    const analyzeResponse = await fetch(analyzeUrl, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': AZURE_VISION_KEY,
        'Content-Type': 'application/octet-stream',
      },
      body: imageBuffer,
    });

    if (!analyzeResponse.ok) {
      const errorText = await analyzeResponse.text();
      console.error("Azure analyze error:", analyzeResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to analyze image with Azure", details: errorText }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the operation location to poll for results
    const operationLocation = analyzeResponse.headers.get('Operation-Location');
    if (!operationLocation) {
      console.error("No operation location returned from Azure");
      return new Response(
        JSON.stringify({ error: "No operation location returned from Azure" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Step 2: Polling Azure for OCR results...");

    // Step 2: Poll for results
    let ocrResult = null;
    let attempts = 0;
    const maxAttempts = 30;

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const resultResponse = await fetch(operationLocation, {
        headers: {
          'Ocp-Apim-Subscription-Key': AZURE_VISION_KEY,
        },
      });

      if (!resultResponse.ok) {
        const errorText = await resultResponse.text();
        console.error("Azure result poll error:", resultResponse.status, errorText);
        attempts++;
        continue;
      }

      const resultData = await resultResponse.json();
      
      if (resultData.status === 'succeeded') {
        ocrResult = resultData;
        break;
      } else if (resultData.status === 'failed') {
        console.error("Azure OCR failed:", resultData);
        return new Response(
          JSON.stringify({ error: "Azure OCR processing failed" }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      attempts++;
    }

    if (!ocrResult) {
      console.error("Azure OCR timed out");
      return new Response(
        JSON.stringify({ error: "Azure OCR timed out" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract raw text from OCR results
    let rawText = '';
    if (ocrResult.analyzeResult?.readResults) {
      for (const page of ocrResult.analyzeResult.readResults) {
        for (const line of page.lines || []) {
          rawText += line.text + '\n';
        }
      }
    }

    console.log("OCR raw text extracted:", rawText.substring(0, 500) + "...");

    if (!rawText.trim()) {
      console.log("No text found in image");
      return new Response(
        JSON.stringify({ 
          medicines: [],
          message: "No text found in the prescription image. Please try again with a clearer image."
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Step 3: Sending OCR text to Gemini for medicine extraction...");

    // Step 3: Send raw text to Gemini for medicine extraction
    const systemPrompt = `You are an EXPERT medical data validator. I will provide you with raw OCR text from a medical prescription.

Your goal:
1. Map the messy OCR text to real-world pharmaceutical names.
2. Extract dosage instructions (e.g., '1-0-1' or 'twice daily').
3. Format as JSON
4. CRITICAL: If a drug name looks like a dangerous misspelling or the OCR is too garbled to be at least 90% sure, set the accurate flag to false & append a warning.

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

    const geminiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Here is the raw OCR text from the prescription:\n\n${rawText}` }
        ],
      }),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini API error:", geminiResponse.status, errorText);
      
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
      
      return new Response(
        JSON.stringify({ error: "Failed to process with AI" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const geminiData = await geminiResponse.json();
    const aiContent = geminiData.choices?.[0]?.message?.content;

    if (!aiContent) {
      console.error("No content in Gemini response");
      return new Response(
        JSON.stringify({ medicines: [], message: "AI could not extract medicine information" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Gemini raw response:", aiContent);

    // Parse the JSON response
    let medicines = [];
    try {
      // Clean up the response - remove markdown code blocks if present
      let cleanedContent = aiContent.trim();
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
      console.error("Failed to parse Gemini response:", parseError);
      console.error("Raw content:", aiContent);
      return new Response(
        JSON.stringify({ 
          medicines: [], 
          message: "Failed to parse medicine data. Please try again or add manually.",
          rawText: rawText
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Successfully extracted medicines:", medicines.length);

    return new Response(
      JSON.stringify({ 
        medicines, 
        rawText,
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
