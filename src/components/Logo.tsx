
export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <h1 className="text-2xl font-bold text-primary">NTI COCHING APP</h1>
    </div>
  );
}
