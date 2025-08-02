'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
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

  useEffect(() => {
    try {
      const item = window.localStorage.getItem('documents');
      if (item) {
        const parsedDocuments = JSON.parse(item);
        // Ensure createdAt is a Date object
        const docsWithDates = parsedDocuments.map((doc: any) => ({
          ...doc,
          createdAt: new Date(doc.createdAt),
        }));
        setDocuments(docsWithDates);
      }
    } catch (error) {
      console.error('Failed to load documents from local storage', error);
      setDocuments([]);
    }
  }, []);

  useEffect(() => {
    try {
      if (documents.length > 0) {
        window.localStorage.setItem('documents', JSON.stringify(documents));
      }
    } catch (error) {
      console.error('Failed to save documents to local storage', error);
    }
  }, [documents]);

  const addDocument = useCallback((document: Document) => {
    setDocuments((prev) => [document, ...prev]);
  }, []);

  const deleteDocument = useCallback((id: string) => {
    setDocuments((prev) => {
      const newDocs = prev.filter((doc) => doc.id !== id);
      if (newDocs.length === 0) {
        window.localStorage.removeItem('documents');
      }
      return newDocs;
    });
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
