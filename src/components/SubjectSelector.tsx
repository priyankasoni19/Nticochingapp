'use client';

import React, {
  useState,
  createContext,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

const initialSubjects = [
  'Maths',
  'Science',
  'English',
  'Marketing',
  'Software Development',
];

interface SubjectContextType {
  subjects: string[];
  addSubject: (subject: string) => void;
  removeSubject: (subject: string) => void;
}

const SubjectContext = createContext<SubjectContextType | undefined>(undefined);

export function SubjectProvider({ children }: { children: ReactNode }) {
  const [subjects, setSubjects] = useState<string[]>([]);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem('subjects');
      setSubjects(item ? JSON.parse(item) : initialSubjects);
    } catch (error) {
      console.error('Failed to load subjects from local storage', error);
      setSubjects(initialSubjects);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem('subjects', JSON.stringify(subjects));
    } catch (error) {
      console.error('Failed to save subjects to local storage', error);
    }
  }, [subjects]);

  const addSubject = (subject: string) => {
    if (subject.trim() && !subjects.includes(subject.trim())) {
      setSubjects((prev) => [...prev, subject.trim()]);
    }
  };

  const removeSubject = (subjectToRemove: string) => {
    setSubjects((prev) =>
      prev.filter((subject) => subject !== subjectToRemove)
    );
  };

  return (
    <SubjectContext.Provider value={{ subjects, addSubject, removeSubject }}>
      {children}
    </SubjectContext.Provider>
  );
}

export function useSubjects() {
  const context = useContext(SubjectContext);
  if (context === undefined) {
    throw new Error('useSubjects must be used within a SubjectProvider');
  }
  return context;
}

export function SubjectSelector() {
  const { subjects, addSubject, removeSubject } = useSubjects();
  const [newSubject, setNewSubject] = useState('');
  const [editing, setEditing] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAddSubject = () => {
    addSubject(newSubject);
    setNewSubject('');
  };
  
  if (!isClient) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold">Subjects</h3>
          <Button variant="outline" onClick={() => setEditing(!editing)}>
            {editing ? 'Done' : 'Edit Subjects'}
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {subjects.map((subject) => (
            <div key={subject} className="relative">
              <Button
                variant="secondary"
                className="h-24 w-full text-lg"
                asChild
              >
                <Link href={`/dashboard/subjects/${encodeURIComponent(subject)}`}>
                  {subject}
                </Link>
              </Button>
              {editing && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeSubject(subject);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          {editing && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-24 w-full border-2 border-dashed"
                >
                  <PlusCircle className="h-8 w-8 text-muted-foreground" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Subject</DialogTitle>
                  <DialogDescription>
                    Enter the name for the new subject.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Input
                    placeholder="Subject Name"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button onClick={handleAddSubject}>Add Subject</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
