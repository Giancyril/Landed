import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionHref,
  actionLabel,
}: EmptyStateProps) {
  return (
    <div className="card p-14 flex flex-col items-center text-center space-y-4">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: "var(--surface-elevated)", border: "1px solid var(--surface-border)" }}
      >
        <Icon size={28} style={{ color: "var(--content-muted)" }} />
      </div>

      <div>
        <h3 className="text-base font-bold mb-1.5" style={{ color: "var(--content-primary)" }}>
          {title}
        </h3>
        <p className="text-xs max-w-xs mx-auto leading-relaxed" style={{ color: "var(--content-secondary)" }}>
          {description}
        </p>
      </div>

      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="btn-primary text-xs py-2 px-5 mt-2"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
