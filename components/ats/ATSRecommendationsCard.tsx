"use client";

import { Lightbulb, ArrowRight, Wand2 } from "lucide-react";
import Link from "next/link";

interface ATSRecommendationsCardProps {
  recommendations: string[];
  breakdown: {
    keywordDensity: string;
    techStackCoverage: string;
    formattingNotes: string;
    relevanceSummary: string;
  };
  jobTitle: string;
  company: string;
}

export default function ATSRecommendationsCard({
  recommendations,
  breakdown,
  jobTitle,
  company,
}: ATSRecommendationsCardProps) {
  return (
    <div className="card p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-3 border-b border-[var(--surface-border)]">
        <div className="flex items-center gap-2">
          <Lightbulb size={18} className="text-amber-400" />
          <h3 className="text-sm font-bold text-[var(--content-primary)]">
            Actionable ATS Optimization Tips
          </h3>
        </div>

        <Link
          href={`/tailor?title=${encodeURIComponent(jobTitle)}&company=${encodeURIComponent(company)}`}
          className="btn-primary text-xs py-1.5 px-4 flex items-center gap-1.5"
        >
          <Wand2 size={13} />
          Auto-Tailor Resume Now
        </Link>
      </div>

      {/* Recommendations List */}
      <div className="space-y-2.5">
        {recommendations.map((rec, i) => (
          <div
            key={i}
            className="p-3 rounded-xl bg-[var(--surface-input)] border border-[var(--surface-border)] text-xs text-[var(--content-primary)] flex items-start gap-2.5"
          >
            <div className="w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5">
              {i + 1}
            </div>
            <p className="leading-relaxed flex-1">{rec}</p>
          </div>
        ))}
      </div>

      {/* Analysis Qualitative Breakdown Notes */}
      <div className="pt-3 border-t border-[var(--surface-border)] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-[var(--surface-card)] border border-[var(--surface-border)] space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--content-muted)] font-semibold">
            Keyword Density Analysis
          </div>
          <p className="text-[11px] text-[var(--content-secondary)] leading-snug">
            {breakdown.keywordDensity}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-[var(--surface-card)] border border-[var(--surface-border)] space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--content-muted)] font-semibold">
            Tech Stack Coverage
          </div>
          <p className="text-[11px] text-[var(--content-secondary)] leading-snug">
            {breakdown.techStackCoverage}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-[var(--surface-card)] border border-[var(--surface-border)] space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--content-muted)] font-semibold">
            Formatting & Structure
          </div>
          <p className="text-[11px] text-[var(--content-secondary)] leading-snug">
            {breakdown.formattingNotes}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-[var(--surface-card)] border border-[var(--surface-border)] space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--content-muted)] font-semibold">
            Experience Alignment
          </div>
          <p className="text-[11px] text-[var(--content-secondary)] leading-snug">
            {breakdown.relevanceSummary}
          </p>
        </div>
      </div>
    </div>
  );
}
