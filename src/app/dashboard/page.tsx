'use client';

import { UploadPDF } from '@/components/UploadPDF';
import { SubjectSelector } from '@/components/SubjectSelector';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Subjects</h1>
          <p className="text-muted-foreground">Select a subject to start.</p>
        </div>
        {user?.role === 'admin' && <UploadPDF />}
      </div>

      <SubjectSelector />
    </div>
  );
}
