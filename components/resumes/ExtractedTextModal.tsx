"use client";

import { useState } from "react";
import { Resume } from "@/types";
import { X, Copy, Check, FileText } from "lucide-react";

interface ExtractedTextModalProps {
  resume: Resume | null;
  onClose: () => void;
}

export default function ExtractedTextModal({ resume, onClose }: ExtractedTextModalProps) {
  const [copied, setCopied] = useState(false);
  if (!resume) return null;

  function handleCopy() {
    if (!resume) return;
    navigator.clipboard.writeText(resume.extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const wordCount = resume.extractedText ? resume.extractedText.split(/\s+/).length : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="card w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden relative">
        {/* Header */}
        <div className="p-5 border-b border-[var(--surface-border)] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <FileText size={18} className="text-[var(--accent-primary)]" />
            <div>
              <h2 className="text-base font-bold text-[var(--content-primary)]">
                Extracted Text: {resume.title}
              </h2>
              <p className="text-xs text-[var(--content-secondary)]">
                {wordCount} words • Cleaned for Gemini AI prompt input
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--surface-elevated)] text-[var(--content-muted)] hover:text-[var(--content-primary)] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Text Area */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs text-[var(--content-secondary)] whitespace-pre-wrap leading-relaxed bg-[var(--surface-input)]">
          {resume.extractedText}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--surface-border)] flex items-center justify-between">
          <span className="text-xs text-[var(--content-muted)] font-mono">
            PDF/DOCX Extracted Stream
          </span>

          <button
            onClick={handleCopy}
            className="btn-primary text-xs py-1.5 px-4 flex items-center gap-1.5"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy Extracted Text"}
          </button>
        </div>
      </div>
    </div>
  );
}
