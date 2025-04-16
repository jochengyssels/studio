'use server';

/**
 * @fileOverview Recommends destinations based on user travel preferences.
 *
 * - recommendDestinations - A function that recommends destinations based on user preferences.
 * - RecommendDestinationsInput - The input type for the recommendDestinations function.
 * - RecommendDestinationsOutput - The return type for the recommendDestinations function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const RecommendDestinationsInputSchema = z.object({
  interests: z
    .string()
    .describe('The users interests, such as hiking, swimming, or historical monuments.'),
  budget: z.string().describe('The users budget, such as cheap, moderate, or expensive.'),
  timeOfYear: z.string().describe('The time of year the user wants to travel, such as summer or winter.'),
});
export type RecommendDestinationsInput = z.infer<typeof RecommendDestinationsInputSchema>;

const RecommendDestinationsOutputSchema = z.object({
  destinations: z
    .array(z.string())
    .describe('An array of destinations that match the users preferences.'),
});
export type RecommendDestinationsOutput = z.infer<typeof RecommendDestinationsOutputSchema>;

export async function recommendDestinations(
  input: RecommendDestinationsInput
): Promise<RecommendDestinationsOutput> {
  return recommendDestinationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendDestinationsPrompt',
  input: {
    schema: z.object({
      interests: z
        .string()
        .describe('The users interests, such as hiking, swimming, or historical monuments.'),
      budget: z.string().describe('The users budget, such as cheap, moderate, or expensive.'),
      timeOfYear: z.string().describe('The time of year the user wants to travel, such as summer or winter.'),
    }),
  },
  output: {
    schema: z.object({
      destinations: z
        .array(z.string())
        .describe('An array of destinations that match the users preferences.'),
    }),
  },
  prompt: `Based on the users travel preferences, recommend a few destinations.

  Interests: {{{interests}}}
  Budget: {{{budget}}}
  Time of Year: {{{timeOfYear}}}

  Destinations:`,
});

const recommendDestinationsFlow = ai.defineFlow<
  typeof RecommendDestinationsInputSchema,
  typeof RecommendDestinationsOutputSchema
>(
  {
    name: 'recommendDestinationsFlow',
    inputSchema: RecommendDestinationsInputSchema,
    outputSchema: RecommendDestinationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
