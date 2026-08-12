"use client";

import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";

const BREADCRUMBS: Record<string, string> = {
  "/jobs": "Job Search & Openings",
  "/resumes": "Base Resume Manager",
  "/tailor": "AI Resume Tailoring Workspace",
  "/cover-letter": "AI Cover Letter Generator",
  "/tracker": "Kanban Application Tracker",
  "/ats": "ATS Resume Match Analyzer",
  "/interview": "AI Interview Prep Copilot",
  "/negotiate": "Offer & Salary Negotiation Advisor",
  "/analytics": "Career Pipeline & Velocity Analytics",
};

interface HeaderProps {
  userEmail?: string;
}

export default function Header({ userEmail }: HeaderProps) {
  const pathname = usePathname();
  const currentTitle = BREADCRUMBS[pathname] ?? "Dashboard";
  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : "U";

  return (
    <header
      className="h-14 px-8 flex items-center justify-between shrink-0"
      style={{
        background: "var(--surface-card)",
        borderBottom: "1px solid var(--surface-border)",
      }}
    >
      {/* Current Page Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono">
        <span className="text-[var(--content-muted)]">Landed</span>
        <span className="text-[var(--content-muted)]">/</span>
        <span className="font-semibold text-[var(--content-primary)]">{currentTitle}</span>
      </div>

      {/* User Badge & Security Tag */}
      <div className="flex items-center gap-4">

        {userEmail && (
          <div className="flex items-center gap-2.5 pl-3 border-l border-[var(--surface-border)]">
            <div className="w-7 h-7 rounded-full bg-[var(--surface-elevated)] border border-[var(--surface-border)] flex items-center justify-center font-mono font-bold text-xs text-[var(--accent-primary)] shadow-inner">
              {userInitial}
            </div>
            <span className="text-xs font-medium text-[var(--content-secondary)] hidden md:inline truncate max-w-[180px]">
              {userEmail}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
