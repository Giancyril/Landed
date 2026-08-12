"use client";

import { useState } from "react";
import { InterviewAnswerFeedback } from "@/types";
import { CheckCircle2, AlertCircle, Sparkles, Copy, Check } from "lucide-react";

interface InterviewFeedbackCardProps {
  feedback: InterviewAnswerFeedback;
}

export default function InterviewFeedbackCard({ feedback }: InterviewFeedbackCardProps) {
  const [copied, setCopied] = useState(false);

  const scoreColor =
    feedback.score >= 80
      ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
      : feedback.score >= 60
      ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
      : "text-rose-400 border-rose-500/30 bg-rose-500/10";

  function handleCopySample() {
    navigator.clipboard.writeText(feedback.improvedAnswerSample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="card p-6 space-y-5 animate-fade-in border-emerald-500/40">
      {/* Top Score Banner */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-[var(--surface-border)]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent-primary)] font-bold">
            AI Interview Coach Feedback
          </span>
          <h4 className="text-base font-bold text-[var(--content-primary)] mt-0.5">
            Evaluation for {feedback.category} Response
          </h4>
        </div>

        <div className={`px-5 py-2.5 rounded-xl border font-mono text-center ${scoreColor}`}>
          <div className="text-2xl font-extrabold">{feedback.score} / 100</div>
          <div className="text-[9px] uppercase tracking-wider font-semibold">Answer Score</div>
        </div>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="card p-4 space-y-2 bg-[var(--surface-input)]">
          <div className="text-xs font-mono uppercase tracking-wider text-[var(--accent-primary)] font-semibold flex items-center gap-1.5">
            <CheckCircle2 size={14} /> Key Strengths
          </div>
          <ul className="space-y-1 text-xs text-[var(--content-primary)]">
            {feedback.strengths.map((st, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[var(--accent-primary)]">•</span>
                <span className="leading-snug">{st}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas to Improve */}
        <div className="card p-4 space-y-2 bg-[var(--surface-input)]">
          <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
            <AlertCircle size={14} /> Areas for Improvement
          </div>
          <ul className="space-y-1 text-xs text-[var(--content-primary)]">
            {feedback.areasToImprove.map((gap, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-400">•</span>
                <span className="leading-snug">{gap}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Exemplar Improved Sample Answer */}
      <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono uppercase tracking-wider text-[var(--accent-primary)] font-semibold flex items-center gap-1.5">
            <Sparkles size={14} />
            Exemplar Model Answer (Study & Practice)
          </div>

          <button
            onClick={handleCopySample}
            className="btn-ghost text-[11px] py-1 px-3 flex items-center gap-1"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied!" : "Copy Model Answer"}
          </button>
        </div>

        <p className="text-xs font-mono text-[var(--content-primary)] leading-relaxed whitespace-pre-wrap p-3 rounded-lg bg-[var(--surface-input)] border border-[var(--surface-border)]">
          {feedback.improvedAnswerSample}
        </p>
      </div>
    </div>
  );
}
