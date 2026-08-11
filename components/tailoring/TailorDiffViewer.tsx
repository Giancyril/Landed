"use client";

import { useState } from "react";
import { TailoredResume } from "@/types";
import { Wand2, Check, Copy, Download, ArrowRight, ShieldCheck, AlertCircle, Sparkles } from "lucide-react";

interface TailorDiffViewerProps {
  tailored: TailoredResume;
}

export default function TailorDiffViewer({ tailored }: TailorDiffViewerProps) {
  const [copied, setCopied] = useState(false);

  function generateMarkdownText(): string {
    let md = `# Tailored Resume — ${tailored.jobTitle} at ${tailored.company}\n\n`;
    md += `## Executive Summary\n${tailored.tailoredSummary}\n\n`;
    md += `## Key Highlighted Achievements\n\n`;

    tailored.diffBullets.forEach((bullet) => {
      md += `### ${bullet.section}\n`;
      md += `- **Original**: ${bullet.original}\n`;
      md += `- **Tailored**: ${bullet.tailored}\n`;
      md += `  *Strategy*: ${bullet.reasoning}\n\n`;
    });

    if (tailored.matchedKeywords.length > 0) {
      md += `## Matched Keywords\n${tailored.matchedKeywords.join(", ")}\n\n`;
    }

    if (tailored.missingKeywords.length > 0) {
      md += `## Recommended Additions (Missing Keywords)\n${tailored.missingKeywords.join(", ")}\n`;
    }

    return md;
  }

  function handleCopy() {
    navigator.clipboard.writeText(generateMarkdownText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const element = document.createElement("a");
    const file = new Blob([generateMarkdownText()], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = `Tailored_Resume_${tailored.company.replace(/\s+/g, "_")}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="card p-6 border-[var(--accent-primary)] bg-[var(--surface-card)] relative overflow-hidden">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--accent-subtle)] text-[var(--accent-primary)] border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck size={12} />
                Non-Fabrication Verified
              </span>
            </div>

            <h2 className="text-xl font-bold text-[var(--content-primary)]">
              Tailored for {tailored.jobTitle}
            </h2>
            <p className="text-xs text-[var(--content-secondary)] mt-0.5">
              Target Company: <span className="font-semibold text-[var(--content-primary)]">{tailored.company}</span>
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="btn-ghost text-xs py-2 px-4 flex items-center gap-1.5"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied!" : "Copy Markdown"}
            </button>

            <button
              onClick={handleDownload}
              className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
            >
              <Download size={14} />
              Export .MD
            </button>
          </div>
        </div>

        {/* Executive Summary Box */}
        <div className="mt-5 p-4 rounded-xl bg-[var(--surface-input)] border border-[var(--surface-border)]">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--content-muted)] font-semibold mb-1.5 flex items-center gap-1.5">
            <Sparkles size={13} className="text-[var(--accent-primary)]" />
            Tailored Executive Summary
          </h3>
          <p className="text-xs text-[var(--content-primary)] leading-relaxed">
            {tailored.tailoredSummary}
          </p>
        </div>
      </div>

      {/* Keywords Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Matched Keywords */}
        <div className="card p-5">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--accent-primary)] font-semibold mb-3 flex items-center gap-1.5">
            <Check size={14} />
            Emphasized Job Keywords ({tailored.matchedKeywords.length})
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {tailored.matchedKeywords.map((kw, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-md text-xs font-mono bg-emerald-500/10 text-[var(--accent-primary)] border border-emerald-500/20"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Missing Keywords */}
        <div className="card p-5">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--status-interviewing)] font-semibold mb-3 flex items-center gap-1.5">
            <AlertCircle size={14} />
            Missing Keywords ({tailored.missingKeywords.length})
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {tailored.missingKeywords.length > 0 ? (
              tailored.missingKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-md text-xs font-mono bg-amber-500/10 text-[var(--status-interviewing)] border border-amber-500/20"
                >
                  {kw}
                </span>
              ))
            ) : (
              <span className="text-xs text-[var(--content-muted)] font-mono">
                No missing keywords identified! Excellent match.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Side-by-Side Diff Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--content-muted)] font-semibold">
          Side-by-Side Bullet Comparison ({tailored.diffBullets.length} revisions)
        </h3>

        {tailored.diffBullets.map((bullet, idx) => (
          <div key={idx} className="card p-5 space-y-4">
            <div className="text-xs font-mono font-bold text-[var(--accent-primary)]">
              {bullet.section}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left: Original */}
              <div className="p-4 rounded-xl bg-[var(--surface-input)] border border-[var(--surface-border)] space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--content-muted)] font-semibold">
                  Original Base Resume
                </div>
                <p className="text-xs text-[var(--content-secondary)] leading-relaxed">
                  {bullet.original}
                </p>
              </div>

              {/* Right: Tailored */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent-primary)] font-semibold flex items-center gap-1">
                  <Wand2 size={12} />
                  Tailored for Job Match
                </div>
                <p className="text-xs text-[var(--content-primary)] font-medium leading-relaxed">
                  {bullet.tailored}
                </p>
              </div>
            </div>

            {/* Strategy Reasoning */}
            <div className="text-[11px] text-[var(--content-secondary)] bg-[var(--surface-card)] p-2.5 rounded-lg border border-[var(--surface-border)] flex items-center gap-2">
              <span className="font-mono uppercase font-bold text-[var(--accent-primary)] shrink-0">Strategy:</span>
              <span className="leading-normal">{bullet.reasoning}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
