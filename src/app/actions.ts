'use server';

import { pdfSummarization } from '@/ai/flows/pdf-summarization';
import { extractContent } from '@/ai/flows/content-extraction';
import type { Document } from '@/lib/types';
import type { ContentExtractionOutput } from '@/ai/flows/content-extraction';

export async function getSummary(
  id: string,
  name: string,
  dataUri: string,
  subject: string
): Promise<Document> {
  try {
    const { summary } = await pdfSummarization({ pdfDataUri: dataUri });
    return {
      id,
      name,
      summary,
      dataUri,
      subject,
      createdAt: new Date(),
    };
  } catch (error) {
    console.error('Error in getSummary:', error);
    // Return a document with an error message in the summary
    return {
      id,
      name,
      summary: 'Could not generate summary for this document.',
      dataUri,
      subject,
      createdAt: new Date(),
    };
  }
}

export async function getExtractedContent(
  dataUri: string,
  query: string
): Promise<ContentExtractionOutput> {
  try {
    const result = await extractContent({ pdfDataUri: dataUri, query });
    return result;
  } catch (error) {
    console.error('Error in getExtractedContent:', error);
    return {
      extractedContent:
        'Sorry, I could not extract the content. Please try again.',
    };
  }
}
