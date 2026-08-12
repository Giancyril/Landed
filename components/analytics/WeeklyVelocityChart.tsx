"use client";

import { BarChart2 } from "lucide-react";

interface WeeklyVelocityChartProps {
  weeklyVelocity: Array<{ week: string; count: number }>;
}

export default function WeeklyVelocityChart({ weeklyVelocity }: WeeklyVelocityChartProps) {
  const maxCount = Math.max(...weeklyVelocity.map((w) => w.count), 1);

  return (
    <div className="card p-6 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--surface-border)]">
        <div className="flex items-center gap-2">
          <BarChart2 size={18} className="text-[var(--accent-primary)]" />
          <h3 className="text-sm font-bold text-[var(--content-primary)]">
            Weekly Application Velocity
          </h3>
        </div>
        <span className="text-xs font-mono text-[var(--content-muted)]">Past 8 Weeks</span>
      </div>

      {/* Bar Chart Container */}
      <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2">
        {weeklyVelocity.map(({ week, count }) => {
          const heightPct = Math.max(((count / maxCount) * 100), 6).toFixed(0);

          return (
            <div key={week} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <span className="text-[10px] font-mono font-bold text-[var(--content-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                {count}
              </span>

              <div className="w-full bg-[var(--surface-input)] rounded-t-lg overflow-hidden flex items-end h-full">
                <div
                  className="w-full rounded-t-lg bg-[var(--accent-primary)] group-hover:brightness-125 transition-all duration-500"
                  style={{ height: `${heightPct}%` }}
                />
              </div>

              <span className="text-[10px] font-mono text-[var(--content-muted)] truncate max-w-[45px]">
                {week}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
