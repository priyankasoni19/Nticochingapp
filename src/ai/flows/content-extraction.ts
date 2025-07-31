'use server';

/**
 * @fileOverview This file defines a Genkit flow for extracting content from PDF documents based on user requests.
 *
 * - extractContent - A function that takes a PDF data URI and a user query, and returns the extracted content.
 * - ContentExtractionInput - The input type for the extractContent function.
 * - ContentExtractionOutput - The return type for the extractContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContentExtractionInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "A PDF document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  query: z.string().describe('The specific information to extract from the PDF.'),
});
export type ContentExtractionInput = z.infer<typeof ContentExtractionInputSchema>;

const ContentExtractionOutputSchema = z.object({
  extractedContent: z
    .string()
    .describe('The content extracted from the PDF based on the user query.'),
});
export type ContentExtractionOutput = z.infer<typeof ContentExtractionOutputSchema>;

export async function extractContent(input: ContentExtractionInput): Promise<ContentExtractionOutput> {
  return contentExtractionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contentExtractionPrompt',
  input: {schema: ContentExtractionInputSchema},
  output: {schema: ContentExtractionOutputSchema},
  prompt: `You are an AI assistant designed to extract specific information from PDF documents.

  A user will provide you with a PDF document and a query specifying what information they want to extract.
  Your task is to analyze the PDF and extract the relevant content that answers the user's query.
  If the PDF doesn't contain any useful answer to the query, respond with 'no answer'.

  PDF Document: {{media url=pdfDataUri}}
  User Query: {{{query}}}`,
});

const contentExtractionFlow = ai.defineFlow(
  {
    name: 'contentExtractionFlow',
    inputSchema: ContentExtractionInputSchema,
    outputSchema: ContentExtractionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
