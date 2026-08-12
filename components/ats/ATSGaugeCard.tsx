"use client";

import { Gauge, CheckCircle2, AlertTriangle, XCircle, Sparkles } from "lucide-react";

interface ATSGaugeCardProps {
  overallScore: number;
  keywordScore: number;
  skillsScore: number;
  readabilityScore: number;
  relevanceScore: number;
  company: string;
  jobTitle: string;
}

export default function ATSGaugeCard({
  overallScore,
  keywordScore,
  skillsScore,
  readabilityScore,
  relevanceScore,
  company,
  jobTitle,
}: ATSGaugeCardProps) {
  // Score color badge
  const scoreColor =
    overallScore >= 80
      ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
      : overallScore >= 60
      ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
      : "text-rose-400 border-rose-500/30 bg-rose-500/10";

  const scoreStatus =
    overallScore >= 80
      ? "Strong ATS Match — High Interview Likelihood"
      : overallScore >= 60
      ? "Moderate Match — Keyword Optimization Recommended"
      : "Low Match — Significant Skill Gaps Found";

  return (
    <div className="card p-6 border-[var(--accent-primary)] space-y-6">
      {/* Top Header & Gauge */}
      <div className="flex items-center justify-between gap-6 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Gauge size={20} className="text-[var(--accent-primary)]" />
            <h2 className="text-xl font-bold text-[var(--content-primary)]">
              ATS Match Analysis
            </h2>
          </div>
          <p className="text-xs text-[var(--content-secondary)]">
            Target Role: <span className="font-semibold text-[var(--content-primary)]">{jobTitle}</span> at{" "}
            <span className="font-semibold text-[var(--content-primary)]">{company}</span>
          </p>
        </div>

        {/* Big Circular/Badge Score */}
        <div className={`px-6 py-4 rounded-2xl border text-center ${scoreColor} shadow-lg shrink-0`}>
          <div className="text-4xl font-extrabold font-mono tracking-tight">{overallScore}%</div>
          <div className="text-[10px] font-mono uppercase tracking-widest font-semibold mt-0.5">
            Overall ATS Score
          </div>
        </div>
      </div>

      {/* Match Status Banner */}
      <div className="p-3 rounded-xl bg-[var(--surface-input)] border border-[var(--surface-border)] text-xs flex items-center gap-2">
        <Sparkles size={15} className="text-[var(--accent-primary)] shrink-0" />
        <span className="font-medium text-[var(--content-primary)]">{scoreStatus}</span>
      </div>

      {/* Sub-Metric Score Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Keyword Density", score: keywordScore },
          { label: "Tech Stack Match", score: skillsScore },
          { label: "Readability & Format", score: readabilityScore },
          { label: "Role Relevance", score: relevanceScore },
        ].map(({ label, score }) => (
          <div key={label} className="p-3.5 rounded-xl bg-[var(--surface-input)] border border-[var(--surface-border)] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] text-[var(--content-secondary)] leading-tight">{label}</span>
              <span className="font-mono font-bold text-[var(--content-primary)]">{score}%</span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 w-full bg-[var(--surface-card)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${score}%`,
                  background:
                    score >= 80
                      ? "var(--accent-primary)"
                      : score >= 60
                      ? "var(--status-interviewing)"
                      : "var(--status-rejected)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
