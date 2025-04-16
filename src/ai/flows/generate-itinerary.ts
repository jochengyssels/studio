// The exported interface of the file, and the file's purpose.
// - generateItinerary - A function that handles the itinerary generation process.
// - GenerateItineraryInput - The input type for the generateItinerary function.
// - GenerateItineraryOutput - The return type for the generateItinerary function.
'use server';

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateItineraryInputSchema = z.object({
  destination: z.string().describe('The destination to generate an itinerary for.'),
  duration: z.number().describe('The duration of the trip in days.'),
  interests: z.string().describe('The interests of the traveler.'),
});
export type GenerateItineraryInput = z.infer<typeof GenerateItineraryInputSchema>;

const GenerateItineraryOutputSchema = z.object({
  itinerary: z.string().describe('The generated itinerary.'),
});
export type GenerateItineraryOutput = z.infer<typeof GenerateItineraryOutputSchema>;

export async function generateItinerary(input: GenerateItineraryInput): Promise<GenerateItineraryOutput> {
  return generateItineraryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateItineraryPrompt',
  input: {
    schema: z.object({
      destination: z.string().describe('The destination to generate an itinerary for.'),
      duration: z.number().describe('The duration of the trip in days.'),
      interests: z.string().describe('The interests of the traveler.'),
    }),
  },
  output: {
    schema: z.object({
      itinerary: z.string().describe('The generated itinerary.'),
    }),
  },
  prompt: `You are a travel expert. Generate a {{duration}}-day itinerary for {{destination}}, catering to the following interests: {{interests}}. Include specific activities, landmarks, and estimated time for each activity. Put the itinerary in markdown format.`,
});

const generateItineraryFlow = ai.defineFlow<
  typeof GenerateItineraryInputSchema,
  typeof GenerateItineraryOutputSchema
>(
  {
    name: 'generateItineraryFlow',
    inputSchema: GenerateItineraryInputSchema,
    outputSchema: GenerateItineraryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
