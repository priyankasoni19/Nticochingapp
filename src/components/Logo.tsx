
export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M25.8 135.9V43.1H49.5V85.9L92.1 43.1H120.4L78.1 88.4L122.8 135.9H94.1L66.7 101.9L58.5 110.1V135.9H25.8Z"
          fill="hsl(var(--primary))"
        />
        <rect
          x="131.7"
          y="43.1"
          width="23.7"
          height="92.8"
          fill="hsl(var(--primary))"
        />
        <path
          d="M152.9 40.1C102.5 40.1 85.7 70.3 75.8 91.3C104.2 84.6 132.6 77.9 161 71.2C165.7 85.9 160.8 103.1 149.3 113.8C127.3 134.1 90.9 125.7 75.8 110.6C95.9 127.5 125.9 143.6 161.8 143.6C206.8 143.6 226.5 109.8 226.5 86.9C226.5 58.6 193.3 40.1 152.9 40.1Z"
          fill="#E51937"
        />
      </svg>
      <h1 className="text-2xl font-bold text-primary">NTI COCHING APP</h1>
    </div>
  );
}
