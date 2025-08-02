import { FileText } from 'lucide-react';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <FileText className="h-8 w-8 text-primary" />
      <h1 className="text-2xl font-bold text-primary">NTI COCHING APP</h1>
    </div>
  );
}
