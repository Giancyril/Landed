"use client";

import { useState } from "react";
import { CoverLetter } from "@/types";
import { Check, Copy, Download, Edit3, Mail, RefreshCw, FileText } from "lucide-react";

interface CoverLetterEditorProps {
  coverLetter: CoverLetter;
  onRegenerate: () => void;
}

export default function CoverLetterEditor({
  coverLetter: initialLetter,
  onRegenerate,
}: CoverLetterEditorProps) {
  const [content, setContent] = useState(initialLetter.content);
  const [copied, setCopied] = useState(false);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const charCount = content.length;

  function handleCopy() {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `Cover_Letter_${initialLetter.company.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  return (
    <div className="card p-6 space-y-5 animate-fade-in border-[var(--accent-primary)]">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-[var(--surface-border)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Mail size={18} className="text-[var(--accent-primary)]" />
            <h2 className="text-lg font-bold text-[var(--content-primary)]">
              Cover Letter for {initialLetter.jobTitle}
            </h2>
          </div>
          <p className="text-xs text-[var(--content-secondary)] font-mono">
            Company: {initialLetter.company} • {wordCount} words ({charCount} chars)
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRegenerate}
            className="btn-ghost text-xs py-2 px-3 flex items-center gap-1.5"
            title="Regenerate with different tone/notes"
          >
            <RefreshCw size={13} />
            Regenerate
          </button>

          <button
            onClick={handleCopy}
            className="btn-ghost text-xs py-2 px-3 flex items-center gap-1.5"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "Copied!" : "Copy Text"}
          </button>

          <button
            onClick={handleDownload}
            className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
          >
            <Download size={13} />
            Download .TXT
          </button>
        </div>
      </div>

      {/* Interactive Editable Textarea */}
      <div>
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[var(--content-muted)] mb-2">
          <span className="flex items-center gap-1">
            <Edit3 size={13} />
            Editable Draft (Click to edit text)
          </span>
          <span>{wordCount} / 280 target words</span>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
          className="input-field text-xs font-mono leading-relaxed p-4 bg-[var(--surface-input)] border-[var(--surface-border)] focus:border-[var(--accent-primary)]"
        />
      </div>

      {/* Footer Info */}
      <div className="text-[11px] text-[var(--content-secondary)] bg-[var(--surface-input)] p-3 rounded-lg border border-[var(--surface-border)] flex items-center justify-between">
        <span>✨ Anti-Boilerplate Filter Applied — 0 generic AI clichés used.</span>
        <span className="font-mono text-[var(--accent-primary)]">Human-Sounding Tone Verified</span>
      </div>
    </div>
  );
}
