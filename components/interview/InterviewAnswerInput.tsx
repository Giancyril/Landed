"use client";

import { useState } from "react";
import { InterviewQuestion } from "@/types";
import { Send, Loader2, Sparkles, HelpCircle, CheckCircle2 } from "lucide-react";

interface InterviewAnswerInputProps {
  question: InterviewQuestion;
  onSubmit: (userAnswer: string) => void;
  loading: boolean;
}

export default function InterviewAnswerInput({
  question,
  onSubmit,
  loading,
}: InterviewAnswerInputProps) {
  const [answer, setAnswer] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!answer.trim() || answer.trim().length < 20) return;
    onSubmit(answer);
  }

  return (
    <div className="card p-6 space-y-5 border-[var(--accent-primary)]">
      {/* Question Banner */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[var(--accent-subtle)] text-[var(--accent-primary)] border border-emerald-500/20">
            {question.category}
          </span>
          <span className="text-[11px] text-[var(--content-muted)] font-mono">
            {question.category === "Behavioral (STAR)" ? "Format: Situation, Task, Action, Result" : "Technical Deep-Dive"}
          </span>
        </div>

        <h3 className="text-lg font-bold text-[var(--content-primary)] leading-snug">
          {question.question}
        </h3>

        {question.context && (
          <p className="text-xs text-[var(--content-secondary)] bg-[var(--surface-input)] p-3 rounded-xl border border-[var(--surface-border)] leading-relaxed">
            <span className="font-mono text-[var(--accent-primary)] font-semibold">Why this question: </span>
            {question.context}
          </p>
        )}
      </div>

      {/* Ideal Key Points Checklist */}
      {question.idealKeyPoints && question.idealKeyPoints.length > 0 && (
        <div className="space-y-1.5 bg-[var(--surface-input)] p-3.5 rounded-xl border border-[var(--surface-border)]">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--content-muted)] font-semibold flex items-center gap-1">
            <Sparkles size={12} className="text-[var(--accent-primary)]" />
            Key points recruiters look for:
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {question.idealKeyPoints.map((pt, i) => (
              <span key={i} className="text-[11px] font-mono text-[var(--content-secondary)] bg-[var(--surface-card)] px-2.5 py-1 rounded-lg border border-[var(--surface-border)]">
                • {pt}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Answer Practice Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[var(--content-muted)] font-semibold mb-1.5">
            Your Practice Answer (Type or outline your response)
          </label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={7}
            placeholder={
              question.category === "Behavioral (STAR)"
                ? "Situation: At my previous company...\nTask: I was tasked with...\nAction: I implemented...\nResult: Reduced latency by 40%..."
                : "Type your technical approach, code architecture, or solution rationale here..."
            }
            className="input-field text-xs font-mono leading-relaxed p-4"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-[var(--content-muted)] font-mono">
            {answer.trim().length} chars (min 20)
          </span>

          <button
            type="submit"
            disabled={loading || answer.trim().length < 20}
            className="btn-primary text-xs py-2 px-5 flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Evaluating Answer...
              </>
            ) : (
              <>
                <Send size={14} />
                Submit Answer for AI Feedback
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
