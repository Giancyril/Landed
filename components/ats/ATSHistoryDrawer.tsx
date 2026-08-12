"use client";

import { ATSAnalysis } from "@/types";
import { formatDate } from "@/lib/utils";
import { History, Gauge, ChevronRight } from "lucide-react";

interface ATSHistoryDrawerProps {
  history: ATSAnalysis[];
  onSelect: (analysis: ATSAnalysis) => void;
}

export default function ATSHistoryDrawer({ history, onSelect }: ATSHistoryDrawerProps) {
  if (!history || history.length === 0) return null;

  return (
    <div className="card p-5 space-y-3">
      <div className="flex items-center gap-2 pb-2 border-b border-[var(--surface-border)] text-xs font-mono uppercase tracking-wider text-[var(--content-muted)] font-semibold">
        <History size={14} className="text-[var(--accent-primary)]" />
        <span>Recent ATS Analyses ({history.length})</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {history.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelect(item)}
            className="p-3.5 rounded-xl bg-[var(--surface-input)] border border-[var(--surface-border)] hover:border-[var(--accent-primary)] transition-all cursor-pointer flex items-center justify-between group"
          >
            <div>
              <div className="font-bold text-xs text-[var(--content-primary)] line-clamp-1">
                {item.jobTitle}
              </div>
              <div className="text-[11px] text-[var(--content-secondary)] mt-0.5">
                {item.company} • {formatDate(item.createdAt)}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
                  item.overallScore >= 80
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : item.overallScore >= 60
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                }`}
              >
                {item.overallScore}%
              </span>
              <ChevronRight size={14} className="text-[var(--content-muted)] group-hover:text-[var(--accent-primary)] transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
