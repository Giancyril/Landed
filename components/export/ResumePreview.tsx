"use client";

import { TailoredBullet } from "@/types";
import { ResumeTemplate } from "@/components/export/ResumeTemplateSelector";

interface ResumePreviewProps {
  candidateName: string;
  jobTitle: string;
  company: string;
  tailoredSummary: string;
  tailoredBullets: TailoredBullet[];
  matchedKeywords: string[];
  template: ResumeTemplate;
}

const STYLES: Record<ResumeTemplate, {
  container: string;
  header: string;
  nameClass: string;
  sectionHeader: string;
  bulletClass: string;
  keywordClass: string;
}> = {
  minimalist: {
    container: "bg-white text-gray-900 font-sans",
    header: "border-b-2 border-gray-900 pb-3 mb-4",
    nameClass: "text-2xl font-bold text-gray-900 tracking-tight",
    sectionHeader: "text-xs font-bold uppercase tracking-widest text-gray-500 border-b border-gray-200 pb-1 mb-2 mt-4",
    bulletClass: "text-xs text-gray-700 leading-relaxed",
    keywordClass: "text-[10px] font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200",
  },
  executive: {
    container: "bg-[#0b1329] text-gray-100 font-sans",
    header: "border-b border-emerald-500/40 pb-3 mb-4",
    nameClass: "text-2xl font-bold text-white tracking-tight",
    sectionHeader: "text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 border-b border-emerald-500/20 pb-1 mb-2 mt-4",
    bulletClass: "text-xs text-gray-300 leading-relaxed",
    keywordClass: "text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20",
  },
  tech: {
    container: "bg-[#0f172a] text-green-300 font-mono",
    header: "border-b border-green-500/30 pb-3 mb-4",
    nameClass: "text-xl font-bold text-green-400 tracking-widest uppercase font-mono",
    sectionHeader: "text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-400 border-b border-indigo-500/20 pb-1 mb-2 mt-4",
    bulletClass: "text-[11px] text-green-300/80 leading-relaxed font-mono",
    keywordClass: "text-[10px] font-mono bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20",
  },
};

export default function ResumePreview({
  candidateName,
  jobTitle,
  company,
  tailoredSummary,
  tailoredBullets,
  matchedKeywords,
  template,
}: ResumePreviewProps) {
  const s = STYLES[template];

  const sectionMap: Record<string, TailoredBullet[]> = {};
  for (const bullet of tailoredBullets) {
    const section = bullet.section || "Experience";
    if (!sectionMap[section]) sectionMap[section] = [];
    sectionMap[section].push(bullet);
  }

  return (
    <div
      className={`${s.container} rounded-xl p-6 text-left max-h-[520px] overflow-y-auto shadow-inner border border-[var(--surface-border)]`}
      id="resume-preview-printable"
    >
      {/* Header */}
      <div className={s.header}>
        <h1 className={s.nameClass}>{candidateName || "Your Name"}</h1>
        <p className={`text-xs mt-0.5 opacity-70`}>
          Tailored for: {jobTitle} at {company}
        </p>
      </div>

      {/* Summary */}
      <div className={s.sectionHeader}>Professional Summary</div>
      <p className={`${s.bulletClass} mb-2`}>{tailoredSummary}</p>

      {/* Sections */}
      {Object.entries(sectionMap).map(([sectionName, bullets]) => (
        <div key={sectionName}>
          <div className={s.sectionHeader}>{sectionName}</div>
          <ul className="space-y-1 pl-3">
            {bullets.map((b, i) => (
              <li key={i} className={`${s.bulletClass} flex items-start gap-1.5`}>
                <span className="opacity-50 mt-0.5">•</span>
                <span>{b.tailored}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* Keywords */}
      {matchedKeywords.length > 0 && (
        <>
          <div className={s.sectionHeader}>Key Skills</div>
          <div className="flex flex-wrap gap-1.5">
            {matchedKeywords.map((kw, i) => (
              <span key={i} className={s.keywordClass}>{kw}</span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
