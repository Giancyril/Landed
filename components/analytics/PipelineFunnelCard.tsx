"use client";

import { ApplicationStatus } from "@/types";
import { Filter, ArrowRight, CheckCircle2, Award, XCircle } from "lucide-react";

interface PipelineFunnelCardProps {
  stageCounts: Record<ApplicationStatus, number>;
  responseRate: number;
  interviewRate: number;
  offerRate: number;
}

export default function PipelineFunnelCard({
  stageCounts,
  responseRate,
  interviewRate,
  offerRate,
}: PipelineFunnelCardProps) {
  const funnelSteps = [
    { label: "Tracked / Saved", count: stageCounts.saved + stageCounts.applied + stageCounts.interviewing + stageCounts.offer, color: "var(--content-primary)" },
    { label: "Applications Sent", count: stageCounts.applied + stageCounts.interviewing + stageCounts.offer + stageCounts.rejected, color: "var(--status-applied)" },
    { label: "Interviews Stage", count: stageCounts.interviewing + stageCounts.offer, color: "var(--status-interviewing)" },
    { label: "Offers Received", count: stageCounts.offer, color: "var(--status-offer)" },
  ];

  return (
    <div className="card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--surface-border)]">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-[var(--accent-primary)]" />
          <h3 className="text-sm font-bold text-[var(--content-primary)]">
            Application Pipeline Conversion Funnel
          </h3>
        </div>
        <span className="text-xs font-mono text-[var(--accent-primary)] font-semibold">
          {responseRate}% Employer Response Rate
        </span>
      </div>

      {/* Visual Funnel Bar Progression */}
      <div className="space-y-3">
        {funnelSteps.map((step, index) => {
          const maxCount = Math.max(funnelSteps[0].count, 1);
          const widthPct = Math.max(((step.count / maxCount) * 100), 8).toFixed(0);

          return (
            <div key={step.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--content-secondary)] flex items-center gap-1.5">
                  <span className="w-4 font-mono text-[10px] text-[var(--content-muted)]">{index + 1}.</span>
                  {step.label}
                </span>
                <span className="font-mono font-bold" style={{ color: step.color }}>
                  {step.count}
                </span>
              </div>

              <div className="h-3 w-full bg-[var(--surface-card)] rounded-full overflow-hidden p-0.5 border border-[var(--surface-border)]">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${widthPct}%`, background: step.color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Conversion Metric Cards */}
      <div className="grid grid-cols-3 gap-3 pt-2">
        <div className="p-3 rounded-xl bg-[var(--surface-input)] border border-[var(--surface-border)] text-center space-y-0.5">
          <div className="text-[10px] font-mono uppercase text-[var(--content-muted)]">Response Rate</div>
          <div className="text-lg font-bold font-mono text-[var(--content-primary)]">{responseRate}%</div>
        </div>

        <div className="p-3 rounded-xl bg-[var(--surface-input)] border border-[var(--surface-border)] text-center space-y-0.5">
          <div className="text-[10px] font-mono uppercase text-[var(--content-muted)]">Interview Rate</div>
          <div className="text-lg font-bold font-mono text-[var(--status-interviewing)]">{interviewRate}%</div>
        </div>

        <div className="p-3 rounded-xl bg-[var(--surface-input)] border border-[var(--surface-border)] text-center space-y-0.5">
          <div className="text-[10px] font-mono uppercase text-[var(--content-muted)]">Offer Rate</div>
          <div className="text-lg font-bold font-mono text-[var(--status-offer)]">{offerRate}%</div>
        </div>
      </div>
    </div>
  );
}
