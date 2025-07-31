'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDocuments } from '@/contexts/DocumentContext';
import { getSummary } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle } from 'lucide-react';
import { useSubjects } from './SubjectSelector';

export function UploadPDF({ subject: preselectedSubject }: { subject?: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { addDocument } = useDocuments();
  const { toast } = useToast();
  const { subjects } = useSubjects();

  useEffect(() => {
    if (preselectedSubject) {
      setSelectedSubject(preselectedSubject);
    }
  }, [preselectedSubject]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select a PDF file to upload.',
        variant: 'destructive',
      });
      return;
    }
    if (!selectedSubject) {
      toast({
        title: 'No subject selected',
        description: 'Please select a subject for the document.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const dataUri = reader.result as string;
        const newDocument = await getSummary(
          crypto.randomUUID(),
          file.name,
          dataUri,
          selectedSubject
        );
        addDocument(newDocument);
        toast({
          title: 'Upload successful',
          description: `${file.name} has been uploaded and summarized.`,
        });
        setFile(null);
        if (!preselectedSubject) {
            setSelectedSubject('');
        }
        setIsOpen(false);
      } catch (error) {
        toast({
          title: 'Upload failed',
          description: 'Could not upload or summarize the file.',
          variant: 'destructive',
        });
      } finally {
        setIsUploading(false);
      }
    };
    reader.onerror = () => {
      toast({
        title: 'Error reading file',
        description: 'There was an error reading the selected file.',
        variant: 'destructive',
      });
      setIsUploading(false);
    };
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Import PDF
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import PDF</DialogTitle>
          <DialogDescription>
            Select a PDF file and a subject to import and summarize.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="pdf-file">PDF File</Label>
            <Input
              id="pdf-file"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
            />
          </div>
          {!preselectedSubject && (
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="subject">Subject</Label>
              <Select onValueChange={setSelectedSubject} value={selectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleUpload}
            disabled={isUploading || !file || !selectedSubject}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
