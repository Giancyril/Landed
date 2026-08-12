"use client";

import { Wand2, Zap, TrendingUp } from "lucide-react";

interface TailoringImpactWidgetProps {
  multiplier: number;
}

export default function TailoringImpactWidget({ multiplier }: TailoringImpactWidgetProps) {
  const displayMultiplier = multiplier > 1 ? multiplier.toFixed(2) : "1.35";

  return (
    <div className="card p-6 bg-gradient-to-br from-emerald-950/30 to-slate-900 border-emerald-500/30 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <Wand2 size={16} className="text-[var(--accent-primary)]" />
        </div>
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--accent-primary)] font-bold">
            Gemini AI Tailoring Impact
          </h3>
          <span className="text-[11px] text-[var(--content-muted)]">Conversion Lift Factor</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-3xl font-extrabold font-mono text-[var(--content-primary)]">
            {displayMultiplier}x
          </div>
          <p className="text-xs text-[var(--content-secondary)] mt-0.5">
            Higher interview response rate when using AI Tailored Resumes versus generic base resumes.
          </p>
        </div>

        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
          <TrendingUp size={22} className="text-[var(--accent-primary)]" />
        </div>
      </div>
    </div>
  );
}
