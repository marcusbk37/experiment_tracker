import OpenAI from 'openai';
import { ExtractedProtocol } from '../types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for demo purposes
});

export async function extractProtocolSteps(protocolText: string): Promise<ExtractedProtocol> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a laboratory assistant that extracts experimental protocols into structured steps. 
          Parse the protocol into a title, description, and a series of steps with estimated durations in minutes.
          Focus on laboratory procedures, especially those involving cell cultures and biological experiments.
          For each step, try to estimate a realistic duration based on common lab practices.`
        },
        {
          role: "user",
          content: protocolText
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = response.choices[0].message.content;
    if (!result) {
      throw new Error('No response from OpenAI');
    }

    const parsed = JSON.parse(result);
    
    // Ensure the response matches our expected format
    if (!parsed.title || !parsed.description || !Array.isArray(parsed.steps)) {
      throw new Error('Invalid response format from OpenAI');
    }

    return {
      title: parsed.title,
      description: parsed.description,
      steps: parsed.steps.map(step => ({
        description: step.description,
        estimatedDuration: step.estimatedDuration
      }))
    };
  } catch (error: any) {
    console.error('Error calling OpenAI API:', error);
    
    // Provide more specific error messages
    if (error.response?.status === 401) {
      throw new Error('Invalid OpenAI API key. Please check your configuration.');
    } else if (error.response?.status === 429) {
      throw new Error('OpenAI API rate limit exceeded. Please try again later.');
    } else if (error.message.includes('JSON')) {
      throw new Error('Failed to parse OpenAI response. Please try again.');
    }
    
    throw new Error('Failed to extract protocol steps: ' + error.message);
  }
}