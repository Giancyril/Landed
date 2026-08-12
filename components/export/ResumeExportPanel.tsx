"use client";

import { useState } from "react";
import { TailoredResume } from "@/types";
import ResumeTemplateSelector, {
  ResumeTemplate,
} from "@/components/export/ResumeTemplateSelector";
import ResumePreview from "@/components/export/ResumePreview";
import {
  generateMarkdownResume,
  generatePlainTextResume,
  downloadFile,
} from "@/lib/resume/export";
import { buildJSONResume, serializeJSONResume } from "@/lib/resume/json-resume";
import { Download, FileText, Code, FileJson, Loader2, Package } from "lucide-react";

interface ResumeExportPanelProps {
  tailoredResume: TailoredResume;
  candidateName?: string;
}

export default function ResumeExportPanel({
  tailoredResume,
  candidateName = "Candidate",
}: ResumeExportPanelProps) {
  const [template, setTemplate] = useState<ResumeTemplate>("executive");
  const [downloading, setDownloading] = useState<string | null>(null);

  function sanitizeName(str: string) {
    return str.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "");
  }

  function handleMarkdownDownload() {
    setDownloading("md");
    try {
      const content = generateMarkdownResume(
        candidateName,
        tailoredResume.jobTitle,
        tailoredResume.company,
        tailoredResume.tailoredSummary,
        tailoredResume.diffBullets,
        tailoredResume.matchedKeywords,
        tailoredResume.missingKeywords
      );
      downloadFile(
        content,
        `${sanitizeName(candidateName)}_${sanitizeName(tailoredResume.jobTitle)}.md`,
        "text/markdown"
      );
    } finally {
      setDownloading(null);
    }
  }

  function handlePlainTextDownload() {
    setDownloading("txt");
    try {
      const content = generatePlainTextResume(
        candidateName,
        tailoredResume.jobTitle,
        tailoredResume.company,
        tailoredResume.tailoredSummary,
        tailoredResume.diffBullets
      );
      downloadFile(
        content,
        `${sanitizeName(candidateName)}_${sanitizeName(tailoredResume.jobTitle)}.txt`,
        "text/plain"
      );
    } finally {
      setDownloading(null);
    }
  }

  function handleJSONDownload() {
    setDownloading("json");
    try {
      const schema = buildJSONResume(
        candidateName,
        "",
        tailoredResume.jobTitle,
        tailoredResume.company,
        tailoredResume.tailoredSummary,
        tailoredResume.diffBullets.map((b) => ({
          section: b.section,
          tailored: b.tailored,
        })),
        tailoredResume.matchedKeywords
      );
      const content = serializeJSONResume(schema);
      downloadFile(
        content,
        `${sanitizeName(candidateName)}_${sanitizeName(tailoredResume.jobTitle)}_jsonresume.json`,
        "application/json"
      );
    } finally {
      setDownloading(null);
    }
  }

  return (
    <div className="space-y-5">
      <ResumeTemplateSelector selected={template} onSelect={setTemplate} />

      {/* Preview */}
      <ResumePreview
        candidateName={candidateName}
        jobTitle={tailoredResume.jobTitle}
        company={tailoredResume.company}
        tailoredSummary={tailoredResume.tailoredSummary}
        tailoredBullets={tailoredResume.diffBullets}
        matchedKeywords={tailoredResume.matchedKeywords}
        template={template}
      />

      {/* Export Buttons */}
      <div className="card p-4 space-y-3">
        <div className="text-xs font-mono uppercase tracking-wider text-[var(--content-muted)] font-semibold">
          Download Formats
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleMarkdownDownload}
            disabled={downloading === "md"}
            className="btn-ghost text-xs py-2 px-4 flex items-center gap-2"
          >
            {downloading === "md" ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
            Markdown (.md)
          </button>

          <button
            onClick={handlePlainTextDownload}
            disabled={downloading === "txt"}
            className="btn-ghost text-xs py-2 px-4 flex items-center gap-2"
          >
            {downloading === "txt" ? <Loader2 size={14} className="animate-spin" /> : <Code size={14} />}
            Plain Text (.txt)
          </button>

          <button
            onClick={handleJSONDownload}
            disabled={downloading === "json"}
            className="btn-ghost text-xs py-2 px-4 flex items-center gap-2"
          >
            {downloading === "json" ? <Loader2 size={14} className="animate-spin" /> : <FileJson size={14} />}
            JSON Resume (.json)
          </button>
        </div>
      </div>
    </div>
  );
}
