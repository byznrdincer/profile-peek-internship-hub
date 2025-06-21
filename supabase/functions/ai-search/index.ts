
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    const { query, availableSkills, availableProjectTechnologies } = await req.json();

    const systemPrompt = `You are an AI assistant that converts natural language recruitment queries into structured search criteria. 

Available skills: ${JSON.stringify(availableSkills.slice(0, 100))}
Available project technologies: ${JSON.stringify(availableProjectTechnologies.slice(0, 100))}

Convert the user's query into a JSON object with these fields:
{
  "skills": string[] - array of relevant skills from the available skills list,
  "projectTechnologies": string[] - array of relevant technologies from the available technologies list,
  "major": string - field of study if mentioned (e.g., "Computer Science", "Data Science"),
  "graduationYear": string - graduation year if mentioned (e.g., "2024", "2025"),
  "minProjects": string - minimum number of projects if mentioned (default: "0"),
  "searchTerm": string - general search terms for name/bio,
  "projectSearchTerm": string - specific project-related search terms
}

Instructions:
- Only include skills/technologies that exist in the provided lists or are very close matches
- If no specific criteria are mentioned, leave fields as empty strings or empty arrays
- For skills/technologies, try to match the user's intent even if they use different terminology
- Extract graduation years as strings like "2024", "2025", etc.
- Be flexible with matching (e.g., "JS" -> "JavaScript", "ML" -> "Machine Learning")

Return only valid JSON, no explanations.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content.trim();
    
    // Parse the JSON response
    let searchCriteria;
    try {
      searchCriteria = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      // Fallback to basic search
      searchCriteria = {
        skills: [],
        projectTechnologies: [],
        major: "",
        graduationYear: "",
        minProjects: "0",
        searchTerm: query,
        projectSearchTerm: ""
      };
    }

    return new Response(JSON.stringify(searchCriteria), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-search function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      // Fallback response
      skills: [],
      projectTechnologies: [],
      major: "",
      graduationYear: "",
      minProjects: "0",
      searchTerm: "",
      projectSearchTerm: ""
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
