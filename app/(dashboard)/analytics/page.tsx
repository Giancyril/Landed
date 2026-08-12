"use client";

import { useState, useEffect } from "react";
import { AnalyticsMetrics } from "@/types";
import PipelineFunnelCard from "@/components/analytics/PipelineFunnelCard";
import WeeklyVelocityChart from "@/components/analytics/WeeklyVelocityChart";
import TailoringImpactWidget from "@/components/analytics/TailoringImpactWidget";
import { BarChart3, Loader2, Download, Briefcase } from "lucide-react";
import { downloadFile } from "@/lib/resume/export";

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const res = await fetch("/api/analytics/metrics");
        const data = await res.json();
        if (res.ok && data.metrics) {
          setMetrics(data.metrics);
        }
      } catch (err) {
        console.error("[loadMetrics] Error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadMetrics();
  }, []);

  function handleExportCSV() {
    if (!metrics) return;
    const rows = [
      ["Metric", "Value"],
      ["Total Applications", metrics.totalApplications],
      ["Response Rate (%)", `${metrics.responseRate}%`],
      ["Interview Rate (%)", `${metrics.interviewRate}%`],
      ["Offer Rate (%)", `${metrics.offerRate}%`],
      ["Tailoring Impact Multiplier", `${metrics.tailoringImpactMultiplier}x`],
      ["Saved Applications", metrics.stageCounts.saved],
      ["Applied Applications", metrics.stageCounts.applied],
      ["Interviewing Applications", metrics.stageCounts.interviewing],
      ["Offer Applications", metrics.stageCounts.offer],
      ["Rejected Applications", metrics.stageCounts.rejected],
    ];

    const csvContent = rows.map((r) => r.join(",")).join("\n");
    downloadFile(csvContent, "landed_career_analytics.csv", "text/plain");
  }

  if (loading) {
    return (
      <div className="p-12 text-center max-w-md mx-auto space-y-4 my-8">
        <Loader2 size={32} className="animate-spin mx-auto text-[var(--accent-primary)]" />
        <h3 className="text-base font-bold text-[var(--content-primary)]">Loading Career Analytics...</h3>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2.5 text-[var(--content-primary)]">
            <BarChart3 size={22} className="text-[var(--accent-primary)]" />
            Career Pipeline & Velocity Analytics
          </h1>
          <p className="text-xs text-[var(--content-secondary)] mt-1">
            Real-time pipeline conversion rates, application velocity over time, and Gemini AI tailoring impact diagnostics.
          </p>
        </div>

        {metrics && (
          <button
            onClick={handleExportCSV}
            className="btn-ghost text-xs py-2 px-4 flex items-center gap-1.5"
          >
            <Download size={14} />
            Export Analytics CSV
          </button>
        )}
      </div>

      {metrics && (
        <div className="space-y-6">
          {/* Top Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Applications", val: metrics.totalApplications, color: "var(--content-primary)" },
              { label: "Employer Responses", val: `${metrics.responseRate}%`, color: "var(--accent-primary)" },
              { label: "Interview Conversion", val: `${metrics.interviewRate}%`, color: "var(--status-interviewing)" },
              { label: "Offer Conversion", val: `${metrics.offerRate}%`, color: "var(--status-offer)" },
            ].map(({ label, val, color }) => (
              <div key={label} className="card p-4 space-y-1">
                <div className="text-2xl font-bold font-mono" style={{ color }}>{val}</div>
                <div className="text-xs text-[var(--content-muted)]">{label}</div>
              </div>
            ))}
          </div>

          {/* Main Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PipelineFunnelCard
              stageCounts={metrics.stageCounts}
              responseRate={metrics.responseRate}
              interviewRate={metrics.interviewRate}
              offerRate={metrics.offerRate}
            />

            <div className="space-y-6">
              <WeeklyVelocityChart weeklyVelocity={metrics.weeklyVelocity} />
              <TailoringImpactWidget multiplier={metrics.tailoringImpactMultiplier} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
