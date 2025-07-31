'use server';

/**
 * @fileOverview This file defines a Genkit flow for summarizing PDF content.
 *
 * - pdfSummarization - A function that takes PDF content as input and returns a summary.
 * - PdfSummarizationInput - The input type for the pdfSummarization function.
 * - PdfSummarizationOutput - The return type for the pdfSummarization function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PdfSummarizationInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      'The PDF document content as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});
export type PdfSummarizationInput = z.infer<typeof PdfSummarizationInputSchema>;

const PdfSummarizationOutputSchema = z.object({
  summary: z.string().describe('A summary of the PDF document content.'),
});
export type PdfSummarizationOutput = z.infer<typeof PdfSummarizationOutputSchema>;

export async function pdfSummarization(input: PdfSummarizationInput): Promise<PdfSummarizationOutput> {
  return pdfSummarizationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'pdfSummarizationPrompt',
  input: {schema: PdfSummarizationInputSchema},
  output: {schema: PdfSummarizationOutputSchema},
  prompt: `You are an AI expert in document summarization.  Summarize the PDF document provided.  

PDF Document: {{media url=pdfDataUri}}`,
});

const pdfSummarizationFlow = ai.defineFlow(
  {
    name: 'pdfSummarizationFlow',
    inputSchema: PdfSummarizationInputSchema,
    outputSchema: PdfSummarizationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
