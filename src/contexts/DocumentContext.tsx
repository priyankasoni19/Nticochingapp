'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import type { Document } from '@/lib/types';
import { SubjectProvider } from '@/components/SubjectSelector';

interface DocumentContextType {
  documents: Document[];
  addDocument: (document: Document) => void;
  deleteDocument: (id: string) => void;
  findDocument: (id: string) => Document | undefined;
}

const DocumentContext = createContext<DocumentContextType | undefined>(
  undefined
);

export function DocumentProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>([]);

  const addDocument = useCallback((document: Document) => {
    setDocuments((prev) => [document, ...prev]);
  }, []);

  const deleteDocument = useCallback((id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  }, []);

  const findDocument = useCallback(
    (id: string) => {
      return documents.find((doc) => doc.id === id);
    },
    [documents]
  );

  return (
    <DocumentContext.Provider
      value={{ documents, addDocument, deleteDocument, findDocument }}
    >
      <SubjectProvider>{children}</SubjectProvider>
    </DocumentContext.Provider>
  );
}

export function useDocuments() {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
}
