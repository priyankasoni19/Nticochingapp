'use client';

import { useDocuments } from '@/contexts/DocumentContext';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FileText, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UploadPDF } from '@/components/UploadPDF';

export default function SubjectDetailsPage() {
  const { subjectName } = useParams();
  const { documents } = useDocuments();

  if (!subjectName) {
    notFound();
  }

  const decodedSubjectName = decodeURIComponent(subjectName as string);
  const subjectDocuments = documents.filter(
    (doc) => doc.subject === decodedSubjectName
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{decodedSubjectName}</h1>
            <p className="text-muted-foreground">
              {subjectDocuments.length} document(s) in this subject.
            </p>
          </div>
        </div>
        <UploadPDF subject={decodedSubjectName} />
      </div>
      {subjectDocuments.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {subjectDocuments.map((doc) => (
            <Card key={doc.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText />
                  <span className="truncate">{doc.name}</span>
                </CardTitle>
                <CardDescription>
                  Added on {new Date(doc.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 line-clamp-3 h-[60px] text-sm text-muted-foreground">
                  {doc.summary}
                </p>
                <Button asChild className="w-full">
                  <Link href={`/dashboard/document/${doc.id}`}>
                    View Document <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-4 p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-xl font-semibold">No Documents Yet</h3>
            <p className="text-muted-foreground">
              There are no documents in this subject.
              <br />
              Import a PDF to get started.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
