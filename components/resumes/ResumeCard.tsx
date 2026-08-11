"use client";

import { Resume } from "@/types";
import { formatDate } from "@/lib/utils";
import { FileText, Star, Trash2, Eye, Check } from "lucide-react";

interface ResumeCardProps {
  resume: Resume;
  onSetPrimary: (id: string) => void;
  onDelete: (id: string) => void;
  onViewText: (resume: Resume) => void;
}

export default function ResumeCard({
  resume,
  onSetPrimary,
  onDelete,
  onViewText,
}: ResumeCardProps) {
  const wordCount = resume.extractedText ? resume.extractedText.split(/\s+/).length : 0;
  const fileSizeMb = (resume.fileSize / (1024 * 1024)).toFixed(2);

  return (
    <div className="card p-5 flex flex-col justify-between gap-4 transition-all duration-200 hover:border-[var(--surface-border)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--surface-elevated)] border border-[var(--surface-border)] flex items-center justify-center text-[var(--accent-primary)] shrink-0">
            <FileText size={20} />
          </div>

          <div>
            <h3 className="font-bold text-sm text-[var(--content-primary)] line-clamp-1">
              {resume.title}
            </h3>
            <p className="text-xs text-[var(--content-secondary)] mt-0.5 font-mono">
              {resume.fileName} • {fileSizeMb} MB
            </p>
          </div>
        </div>

        {/* Primary Badge */}
        {resume.isPrimary ? (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--accent-subtle)] text-[var(--accent-primary)] border border-emerald-500/30 flex items-center gap-1 shrink-0">
            <Star size={11} className="fill-[var(--accent-primary)]" />
            Primary
          </span>
        ) : (
          <button
            onClick={() => onSetPrimary(resume.id)}
            className="text-[11px] text-[var(--content-muted)] hover:text-[var(--content-primary)] transition-colors font-mono underline shrink-0"
          >
            Set Primary
          </button>
        )}
      </div>

      {/* Excerpt */}
      <p className="text-xs text-[var(--content-secondary)] line-clamp-2 leading-relaxed bg-[var(--surface-input)] p-3 rounded-lg border border-[var(--surface-border)] font-mono">
        {resume.extractedText}
      </p>

      {/* Meta Footer */}
      <div className="flex items-center justify-between pt-2 text-xs text-[var(--content-muted)]">
        <span>Uploaded {formatDate(resume.createdAt)} ({wordCount} words)</span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewText(resume)}
            className="btn-ghost text-xs py-1 px-3 flex items-center gap-1"
          >
            <Eye size={13} />
            Extracted Text
          </button>

          <button
            onClick={() => onDelete(resume.id)}
            className="p-1.5 rounded-lg hover:bg-rose-500/10 text-[var(--content-muted)] hover:text-[var(--status-rejected)] transition-colors"
            title="Delete Resume"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
