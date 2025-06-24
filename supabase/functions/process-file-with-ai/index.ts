import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import Anthropic from 'npm:@anthropic-ai/sdk@^0.24.2';

// Initialize the Anthropic client
const anthropic = new Anthropic({
  apiKey: Deno.env.get('ANTHROPIC_API_KEY'),
});

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { fileContent, fileType, mediaType } = await req.json();

    if (!fileContent) {
      return new Response(JSON.stringify({ error: 'Missing file content' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    let structuredData;

    // We'll decide whether to call the vision or text model based on file type
    if (fileType === 'image' && mediaType) {
      structuredData = await analyzeImageContent(fileContent, mediaType);
    } else {
      structuredData = await analyzeTextContent(fileContent);
    }

    return new Response(JSON.stringify(structuredData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error processing file:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

async function analyzeImageContent(base64Image: string, mediaType: "image/jpeg" | "image/png" | "image/gif" | "image/webp") {
  // First, extract text from the image
  const visionResponse = await anthropic.messages.create({
    model: "claude-3-sonnet-20240229",
    max_tokens: 4000,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mediaType, data: base64Image },
          },
          {
            type: "text",
            text: "Extract all cybersecurity-related text from this image. This includes vulnerability scans, penetration test results, security assessments, network diagrams, asset inventories, etc. Provide only the extracted text."
          }
        ]
      }
    ]
  });

  const extractedText = visionResponse.content[0].type === 'text' ? visionResponse.content[0].text : '';
  
  if (!extractedText) {
    throw new Error("Could not extract any text from the image.");
  }
  
  // Now, analyze the extracted text
  return analyzeTextContent(extractedText);
}

async function analyzeTextContent(content: string) {
  const prompt = `
Analyze the following cybersecurity content and return a valid JSON object. The JSON object should have the following structure:
{
  "assets": [{"name": "...", "type": "...", "ip_address": "...", "hostname": "...", "ports": [], "services": [], "operating_system": "...", "criticality": 1-5, "exposure_score": 0-100}],
  "vulnerabilities": [{"cve_id": "...", "title": "...", "description": "...", "severity": "...", "cvss_score": 0.0-10.0, "status": "...", "solution": "..."}],
  "pentestFindings": [{"finding_id": "...", "title": "...", "description": "...", "severity": "...", "affected_assets": [], "recommendation": "...", "status": "..."}],
  "summary": {"assetsFound": 0, "vulnerabilitiesFound": 0, "pentestFindingsFound": 0, "criticalVulns": 0, "highVulns": 0, "confidence": 0-100}
}
Content to analyze:
<document>
${content}
</document>
Important:
- Your response MUST be a single, valid JSON object. Do not include any text, explanation, or markdown formatting before or after the JSON object.
- If no relevant data is found, return empty arrays.
- Populate all fields with realistic data based on the content. For missing specific data, generate plausible placeholders.
- Set the 'confidence' score (0-100) based on how clear and complete the source data is.
`;

  const response = await anthropic.messages.create({
    model: "claude-3-sonnet-20240229",
    max_tokens: 4000,
    system: "You are a cybersecurity expert that converts unstructured text into a structured JSON format. Return only the JSON object.",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.1,
  });

  const responseContent = response.content[0].type === 'text' ? response.content[0].text : '{}';
  
  try {
    const jsonStart = responseContent.indexOf('{');
    const jsonEnd = responseContent.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("No JSON object found in AI response.");
    }
    const jsonString = responseContent.substring(jsonStart, jsonEnd + 1);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing AI JSON response:', error, 'Raw response:', responseContent);
    throw new Error('Failed to parse structured data from the AI.');
  }
} 