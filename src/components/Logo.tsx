
export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        <path
          d="M49.748 158.465V41.535H69.418V86.735L108.318 41.535H134.148L96.888 88.455L136.218 158.465H109.518L83.808 115.125L76.248 122.895V158.465H49.748Z"
          fill="currentColor"
        />
        <rect
          x="144.988"
          y="41.535"
          width="19.67"
          height="116.93"
          fill="currentColor"
        />
      </svg>
      <h1 className="text-2xl font-bold text-primary">NTI COCHING APP</h1>
    </div>
  );
}
