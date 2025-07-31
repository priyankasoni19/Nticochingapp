'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadPDF } from '@/components/UploadPDF';
import Link from 'next/link';
import { FileText, ArrowRight } from 'lucide-react';
import { SubjectSelector } from '@/components/SubjectSelector';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Subjects</h1>
          <p className="text-muted-foreground">Select a subject to start.</p>
        </div>
        <UploadPDF />
      </div>

      <SubjectSelector />

    </div>
  );
}
