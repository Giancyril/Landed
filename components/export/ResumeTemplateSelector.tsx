"use client";

import { FileText, Zap, Briefcase, Check } from "lucide-react";

export type ResumeTemplate = "minimalist" | "executive" | "tech";

const TEMPLATES: Array<{
  id: ResumeTemplate;
  name: string;
  desc: string;
  icon: typeof FileText;
  accent: string;
  preview: string;
}> = [
  {
    id: "minimalist",
    name: "Modern Minimalist",
    desc: "Clean white space, ATS-optimised, no decorative elements. Best for traditional industries.",
    icon: FileText,
    accent: "var(--content-primary)",
    preview: "bg-gradient-to-br from-slate-900 to-slate-800",
  },
  {
    id: "executive",
    name: "Executive Emerald",
    desc: "Dark navy header with emerald accents. Executive presence for senior and leadership roles.",
    icon: Briefcase,
    accent: "var(--accent-primary)",
    preview: "bg-gradient-to-br from-emerald-900 to-slate-900",
  },
  {
    id: "tech",
    name: "Tech Compact",
    desc: "High-density layout with monospaced code-style fonts. Ideal for engineering and technical roles.",
    icon: Zap,
    accent: "#6366f1",
    preview: "bg-gradient-to-br from-indigo-900 to-slate-900",
  },
];

interface ResumeTemplateSelectorProps {
  selected: ResumeTemplate;
  onSelect: (template: ResumeTemplate) => void;
}

export default function ResumeTemplateSelector({
  selected,
  onSelect,
}: ResumeTemplateSelectorProps) {
  return (
    <div className="card p-5 space-y-3">
      <div className="text-xs font-mono uppercase tracking-wider text-[var(--content-muted)] font-semibold pb-2 border-b border-[var(--surface-border)]">
        Export Template
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {TEMPLATES.map(({ id, name, desc, icon: Icon, accent, preview }) => {
          const isSelected = selected === id;
          return (
            <div
              key={id}
              onClick={() => onSelect(id)}
              className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-200 space-y-3 ${
                isSelected
                  ? "border-[var(--accent-primary)] shadow-md"
                  : "border-[var(--surface-border)] hover:border-[var(--accent-primary)]/50"
              }`}
              style={{
                background: isSelected ? "var(--surface-elevated)" : "var(--surface-input)",
              }}
            >
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[var(--accent-primary)] flex items-center justify-center">
                  <Check size={11} color="#fff" strokeWidth={2.5} />
                </div>
              )}

              {/* Mini Template Preview */}
              <div className={`h-20 rounded-lg ${preview} flex flex-col justify-end p-2.5 overflow-hidden`}>
                <div className="h-1.5 w-3/4 rounded bg-white/20 mb-1" />
                <div className="h-1 w-1/2 rounded bg-white/10 mb-2" />
                <div className="flex gap-1">
                  {[0.7, 0.85, 0.6].map((w, i) => (
                    <div key={i} className="h-1 rounded" style={{ width: `${w * 100}%`, maxWidth: "50px", background: "rgba(255,255,255,0.15)" }} />
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Icon size={15} style={{ color: accent }} className="mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-[var(--content-primary)] mb-0.5">{name}</div>
                  <div className="text-[10px] text-[var(--content-secondary)] leading-snug">{desc}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
