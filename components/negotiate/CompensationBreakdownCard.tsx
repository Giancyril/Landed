"use client";

import { CompensationBreakdown, formatSalary } from "@/lib/compensation/calculator";
import { TrendingUp, PieChart, DollarSign, Gift, Laptop, Star } from "lucide-react";

interface CompensationBreakdownCardProps {
  breakdown: CompensationBreakdown;
  jobTitle: string;
  company: string;
}

export default function CompensationBreakdownCard({
  breakdown,
  jobTitle,
  company,
}: CompensationBreakdownCardProps) {
  const items = [
    { label: "Base Salary", value: breakdown.baseSalary, icon: DollarSign, color: "var(--accent-primary)", pct: ((breakdown.baseSalary / breakdown.totalCompensation) * 100).toFixed(0) },
    { label: "Annual Bonus", value: breakdown.bonus, icon: TrendingUp, color: "var(--status-interviewing)", pct: breakdown.bonusPercent.toFixed(0) + "% of base" },
    { label: "Equity Value", value: breakdown.equityValue, icon: Star, color: "#a855f7", pct: breakdown.equityPercent.toFixed(0) + "% of base" },
    { label: "Signing Bonus", value: breakdown.signingBonus, icon: Gift, color: "#f59e0b", pct: null },
    { label: "Remote Allowance", value: breakdown.remoteAllowance, icon: Laptop, color: "#38bdf8", pct: null },
  ].filter((item) => item.value > 0);

  return (
    <div className="card p-6 space-y-5">
      {/* Header */}
      <div className="pb-3 border-b border-[var(--surface-border)]">
        <div className="flex items-center gap-2 mb-1">
          <PieChart size={18} className="text-[var(--accent-primary)]" />
          <h3 className="text-sm font-bold text-[var(--content-primary)]">
            Total Compensation Breakdown
          </h3>
        </div>
        <p className="text-xs text-[var(--content-secondary)]">
          {jobTitle} at {company}
        </p>
      </div>

      {/* Big Total */}
      <div className="text-center py-4">
        <div className="text-xs font-mono uppercase tracking-widest text-[var(--content-muted)] mb-1">
          Total Annual Compensation
        </div>
        <div className="text-4xl font-extrabold font-mono text-[var(--accent-primary)]">
          {formatSalary(breakdown.totalCompensation)}
        </div>
        {breakdown.nonCashPercent > 0 && (
          <div className="text-xs text-[var(--content-secondary)] mt-1 font-mono">
            {breakdown.nonCashPercent}% non-cash components
          </div>
        )}
      </div>

      {/* Breakdown Bars */}
      <div className="space-y-2.5">
        {items.map(({ label, value, icon: Icon, color, pct }) => {
          const barWidth = ((value / breakdown.totalCompensation) * 100).toFixed(0);

          return (
            <div key={label} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Icon size={13} style={{ color }} />
                  <span className="text-[var(--content-secondary)]">{label}</span>
                  {pct && (
                    <span className="text-[10px] font-mono text-[var(--content-muted)]">({pct})</span>
                  )}
                </div>
                <span className="font-mono font-bold text-[var(--content-primary)]">
                  {formatSalary(value)}
                </span>
              </div>

              <div className="h-2 w-full bg-[var(--surface-card)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${barWidth}%`, background: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
