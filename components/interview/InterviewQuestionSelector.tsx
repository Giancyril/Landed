"use client";

import { InterviewQuestion } from "@/types";
import { HelpCircle, Code2, Users, AlertTriangle, CheckCircle2 } from "lucide-react";

interface InterviewQuestionSelectorProps {
  questions: InterviewQuestion[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  answeredIndices: Set<number>;
}

export default function InterviewQuestionSelector({
  questions,
  selectedIndex,
  onSelect,
  answeredIndices,
}: InterviewQuestionSelectorProps) {
  function getCategoryBadge(category: string) {
    switch (category) {
      case "Technical":
        return { icon: Code2, class: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" };
      case "Behavioral (STAR)":
        return { icon: Users, class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };
      default:
        return { icon: AlertTriangle, class: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
    }
  }

  return (
    <div className="card p-5 space-y-3">
      <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[var(--content-muted)] font-semibold pb-2 border-b border-[var(--surface-border)]">
        <span>Question Navigator</span>
        <span>{answeredIndices.size} / {questions.length} Answered</span>
      </div>

      <div className="space-y-2">
        {questions.map((q, idx) => {
          const isSelected = selectedIndex === idx;
          const isAnswered = answeredIndices.has(idx);
          const { icon: CategoryIcon, class: categoryClass } = getCategoryBadge(q.category);

          return (
            <div
              key={q.id || idx}
              onClick={() => onSelect(idx)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                isSelected
                  ? "bg-[var(--surface-elevated)] border-[var(--accent-primary)] shadow-md"
                  : "bg-[var(--surface-input)] border-[var(--surface-border)] hover:border-[var(--surface-border)]"
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-[var(--surface-card)] border border-[var(--surface-border)] font-mono text-[10px] font-bold flex items-center justify-center text-[var(--content-secondary)] shrink-0 mt-0.5">
                {idx + 1}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border flex items-center gap-1 ${categoryClass}`}>
                    <CategoryIcon size={11} />
                    {q.category}
                  </span>
                  {isAnswered && (
                    <span className="text-[10px] font-mono font-bold text-[var(--accent-primary)] flex items-center gap-0.5">
                      <CheckCircle2 size={11} /> Evaluated
                    </span>
                  )}
                </div>

                <p className="text-xs text-[var(--content-primary)] font-medium line-clamp-1">
                  {q.question}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
