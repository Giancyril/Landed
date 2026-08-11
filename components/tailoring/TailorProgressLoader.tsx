"use client";

import { useEffect, useState } from "react";
import { Loader2, FileSearch, Sparkles, CheckCircle2 } from "lucide-react";

const STAGES = [
  { step: 1, label: "Reading & parsing base resume text...", icon: FileSearch },
  { step: 2, label: "Extracting target job keywords & stack requirements...", icon: Sparkles },
  { step: 3, label: "Rephrasing achievement bullets & building diff view...", icon: CheckCircle2 },
];

export default function TailorProgressLoader() {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(2), 2500);
    const timer2 = setTimeout(() => setCurrentStep(3), 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="card p-8 text-center max-w-md mx-auto space-y-6 animate-fade-in my-8">
      <div className="w-14 h-14 rounded-full bg-[var(--accent-subtle)] border border-[rgba(16,185,129,0.3)] flex items-center justify-center mx-auto text-[var(--accent-primary)]">
        <Loader2 size={28} className="animate-spin" />
      </div>

      <div>
        <h3 className="text-lg font-bold text-[var(--content-primary)]">
          AI Resume Tailoring in Progress
        </h3>
        <p className="text-xs text-[var(--content-secondary)] mt-1">
          Gemini is analyzing your resume against target job description requirements.
        </p>
      </div>

      <div className="space-y-3 text-left bg-[var(--surface-input)] p-4 rounded-xl border border-[var(--surface-border)]">
        {STAGES.map(({ step, label, icon: Icon }) => {
          const isActive = currentStep === step;
          const isDone = currentStep > step;

          return (
            <div
              key={step}
              className={`flex items-center gap-3 text-xs transition-all duration-200 ${
                isActive
                  ? "text-[var(--accent-primary)] font-semibold"
                  : isDone
                  ? "text-[var(--content-primary)] opacity-70"
                  : "text-[var(--content-muted)]"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-mono shrink-0 border ${
                  isActive
                    ? "bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]"
                    : isDone
                    ? "bg-emerald-500/20 text-[var(--accent-primary)] border-emerald-500/30"
                    : "bg-[var(--surface-card)] text-[var(--content-muted)] border-[var(--surface-border)]"
                }`}
              >
                {isDone ? "✓" : step}
              </div>
              <span className="flex-1 leading-snug">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
