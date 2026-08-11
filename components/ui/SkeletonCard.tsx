interface SkeletonCardProps {
  lines?: number;
  className?: string;
}

export default function SkeletonCard({ lines = 3, className = "" }: SkeletonCardProps) {
  return (
    <div className={`card p-5 space-y-3 shimmer ${className}`}>
      <div className="h-4 rounded" style={{ width: "65%", background: "var(--surface-border)" }} />
      {lines >= 2 && <div className="h-3 rounded" style={{ width: "45%", background: "var(--surface-border)" }} />}
      {lines >= 3 && <div className="h-8 rounded" style={{ width: "100%", background: "var(--surface-border)" }} />}
      {lines >= 4 && <div className="h-3 rounded" style={{ width: "80%", background: "var(--surface-border)" }} />}
    </div>
  );
}
