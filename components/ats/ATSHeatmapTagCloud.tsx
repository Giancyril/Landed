"use client";

import { CheckCircle2, AlertCircle } from "lucide-react";

interface ATSHeatmapTagCloudProps {
  matchedKeywords: string[];
  missingKeywords: string[];
}

export default function ATSHeatmapTagCloud({
  matchedKeywords,
  missingKeywords,
}: ATSHeatmapTagCloudProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Matched Keywords Cloud */}
      <div className="card p-5 space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[var(--accent-primary)]" />
          <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--accent-primary)] font-semibold">
            Matched Skills & Keywords ({matchedKeywords.length})
          </h3>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {matchedKeywords.length === 0 ? (
            <span className="text-xs text-[var(--content-muted)] italic font-mono">
              No matching keywords detected.
            </span>
          ) : (
            matchedKeywords.map((kw, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg text-xs font-mono bg-emerald-500/10 text-[var(--accent-primary)] border border-emerald-500/20 flex items-center gap-1"
              >
                <span>✓</span> {kw}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Missing Keywords Cloud */}
      <div className="card p-5 space-y-3">
        <div className="flex items-center gap-2">
          <AlertCircle size={16} className="text-[var(--status-rejected)]" />
          <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--status-rejected)] font-semibold">
            Missing ATS Skills ({missingKeywords.length})
          </h3>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {missingKeywords.length === 0 ? (
            <span className="text-xs text-[var(--content-muted)] italic font-mono">
              All core keywords found! Outstanding match.
            </span>
          ) : (
            missingKeywords.map((kw, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg text-xs font-mono bg-rose-500/10 text-[var(--status-rejected)] border border-rose-500/20 flex items-center gap-1"
              >
                <span>✕</span> {kw}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
