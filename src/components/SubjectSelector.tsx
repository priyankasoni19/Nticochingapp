'use client';

import { useState } from 'react';
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

export function SubjectSelector() {
  const [subjects, setSubjects] = useState(initialSubjects);
  const [newSubject, setNewSubject] = useState('');
  const [editing, setEditing] = useState(false);

  const addSubject = () => {
    if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
      setSubjects([...subjects, newSubject.trim()]);
      setNewSubject('');
    }
  };

  const removeSubject = (subjectToRemove: string) => {
    setSubjects(subjects.filter((subject) => subject !== subjectToRemove));
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Subjects</h3>
            <Button variant="outline" onClick={() => setEditing(!editing)}>
                {editing ? 'Done' : 'Edit Subjects'}
            </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {subjects.map((subject) => (
            <div key={subject} className="relative">
                <Button variant="secondary" className="w-full h-24 text-lg">
                    {subject}
                </Button>
                {editing && (
                    <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={() => removeSubject(subject)}
                    >
                    <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>
          ))}
            {editing && (
              <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-full h-24 border-dashed border-2">
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
                        <Button onClick={addSubject}>Add Subject</Button>
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
