"use client";

import { JobPosting } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { X, Building2, MapPin, DollarSign, Calendar, ExternalLink, Wand2, Kanban, Globe } from "lucide-react";
import Link from "next/link";

interface JobDetailsModalProps {
  job: JobPosting | null;
  onClose: () => void;
  onTrack: (job: JobPosting) => void;
}

export default function JobDetailsModal({ job, onClose, onTrack }: JobDetailsModalProps) {
  if (!job) return null;

  const salaryDisplay =
    job.salaryMin || job.salaryMax
      ? `${formatCurrency(job.salaryMin, job.currency)}${
          job.salaryMax ? ` – ${formatCurrency(job.salaryMax, job.currency)}` : "+"
        }`
      : "Undisclosed";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="card w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden relative"
        style={{ background: "var(--surface-card)", border: "1px solid var(--surface-border)" }}
      >
        {/* Header */}
        <div className="p-6 border-b border-[var(--surface-border)] flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-primary)]">
                {job.provider} Posting
              </span>
              {job.isRemote && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[var(--accent-subtle)] text-[var(--accent-primary)] border border-[rgba(16,185,129,0.25)] flex items-center gap-1">
                  <Globe size={10} /> Remote
                </span>
              )}
            </div>

            <h2 className="text-xl font-bold text-[var(--content-primary)] mb-1">
              {job.title}
            </h2>

            <div className="flex items-center gap-3 text-xs text-[var(--content-secondary)]">
              <span className="flex items-center gap-1">
                <Building2 size={14} className="text-[var(--content-muted)]" />
                {job.company}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin size={14} className="text-[var(--content-muted)]" />
                {job.location}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--surface-elevated)] text-[var(--content-muted)] hover:text-[var(--content-primary)] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Meta Bar */}
        <div className="px-6 py-3 bg-[var(--surface-input)] border-b border-[var(--surface-border)] flex items-center gap-6 text-xs text-[var(--content-secondary)]">
          <div className="flex items-center gap-1.5">
            <DollarSign size={14} className="text-[var(--accent-primary)]" />
            <span className="font-semibold text-[var(--content-primary)]">{salaryDisplay}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-[var(--content-muted)]" />
            <span>Posted {formatDate(job.postedAt)}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-sm text-[var(--content-primary)] leading-relaxed">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--content-muted)] font-semibold">
            Job Description
          </h3>
          <div className="whitespace-pre-line text-xs text-[var(--content-secondary)] leading-relaxed">
            {job.description}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[var(--surface-border)] bg-[var(--surface-card)] flex items-center justify-between gap-3">
          <a
            href={job.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-xs py-2 px-4 flex items-center gap-1.5"
          >
            <ExternalLink size={14} />
            Original Posting
          </a>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onTrack(job);
                onClose();
              }}
              className="btn-ghost text-xs py-2 px-4 flex items-center gap-1.5"
            >
              <Kanban size={14} />
              Track Application
            </button>

            <Link
              href={`/tailor?jobId=${encodeURIComponent(job.id)}&title=${encodeURIComponent(
                job.title
              )}&company=${encodeURIComponent(job.company)}`}
              onClick={onClose}
              className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
            >
              <Wand2 size={14} />
              Tailor Resume
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
