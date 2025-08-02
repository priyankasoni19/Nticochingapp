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
import { SubjectProvider, useSubjects } from '@/components/SubjectSelector';
import { useAuth } from './AuthContext';

interface DocumentContextType {
  documents: Document[];
  addDocument: (document: Document) => void;
  deleteDocument: (id: string) => void;
  findDocument: (id: string) => Document | undefined;
}

const DocumentContext = createContext<DocumentContextType | undefined>(
  undefined
);

function DocumentProviderInternal({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const { user } = useAuth();
  const { subjects: allSubjects, addSubject } = useSubjects();

  const getLocalStorageKey = () => `documents_${user?.email || 'guest'}`;

  useEffect(() => {
    if (user) {
      try {
        const item = window.localStorage.getItem(getLocalStorageKey());
        if (item) {
          const parsedDocuments = JSON.parse(item);
          // Ensure createdAt is a Date object
          const docsWithDates = parsedDocuments.map((doc: any) => ({
            ...doc,
            createdAt: new Date(doc.createdAt),
          }));
          setDocuments(docsWithDates);

          // Sync subjects
          const docSubjects = new Set(docsWithDates.map((d: Document) => d.subject));
          docSubjects.forEach(subject => {
            if (!allSubjects.includes(subject)) {
              addSubject(subject);
            }
          });

        } else {
           setDocuments([]);
        }
      } catch (error) {
        console.error('Failed to load documents from local storage', error);
        setDocuments([]);
      }
    } else {
      setDocuments([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      try {
        window.localStorage.setItem(getLocalStorageKey(), JSON.stringify(documents));
      } catch (error) {
        console.error('Failed to save documents to local storage', error);
      }
    }
  }, [documents, user]);

  const addDocument = useCallback((document: Document) => {
    setDocuments((prev) => [document, ...prev]);
     if (!allSubjects.includes(document.subject)) {
        addSubject(document.subject);
      }
  }, [addSubject, allSubjects]);

  const deleteDocument = useCallback((id: string) => {
    setDocuments((prev) => {
      const newDocs = prev.filter((doc) => doc.id !== id);
      if (newDocs.length === 0) {
        window.localStorage.removeItem(getLocalStorageKey());
      }
      return newDocs;
    });
  }, [user]);

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
      {children}
    </DocumentContext.Provider>
  );
}


export function DocumentProvider({ children }: { children: ReactNode }) {
    return (
        <SubjectProvider>
            <DocumentProviderInternal>
                {children}
            </DocumentProviderInternal>
        </SubjectProvider>
    )
}

export function useDocuments() {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
}
