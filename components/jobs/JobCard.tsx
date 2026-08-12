"use client";

import { JobPosting } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { MapPin, DollarSign, ExternalLink, Wand2, Kanban, Globe, Building2 } from "lucide-react";
import Link from "next/link";

interface JobCardProps {
  job: JobPosting;
  onSelect: (job: JobPosting) => void;
  onTrack: (job: JobPosting) => void;
  isTracking?: boolean;
}

export default function JobCard({ job, onSelect, onTrack, isTracking }: JobCardProps) {
  const companyInitial = job.company ? job.company.charAt(0).toUpperCase() : "J";

  const salaryDisplay =
    job.salaryMin || job.salaryMax
      ? `${formatCurrency(job.salaryMin, job.currency)}${
          job.salaryMax ? ` – ${formatCurrency(job.salaryMax, job.currency)}` : "+"
        }`
      : null;

  return (
    <div className="card card-lift p-5 flex flex-col justify-between gap-4 group">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3.5">
          {/* Company Logo Avatar */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base shrink-0 mt-0.5 shadow-sm"
            style={{
              background: "linear-gradient(135deg, var(--surface-elevated), var(--surface-card))",
              border: "1px solid var(--surface-border)",
              color: "var(--accent-primary)",
            }}
          >
            {companyInitial}
          </div>

          <div>
            <h3
              onClick={() => onSelect(job)}
              className="font-bold text-base leading-snug cursor-pointer hover:text-[var(--accent-primary)] transition-colors line-clamp-1"
              style={{ color: "var(--content-primary)" }}
            >
              {job.title}
            </h3>

            <div className="flex items-center gap-2 mt-1 text-xs font-medium" style={{ color: "var(--content-secondary)" }}>
              <span className="flex items-center gap-1">
                <Building2 size={13} className="text-[var(--content-muted)]" />
                {job.company}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin size={13} className="text-[var(--content-muted)]" />
                {job.location}
              </span>
            </div>
          </div>
        </div>

        {/* Remote Badge */}
        {job.isRemote && (
          <span
            className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 flex items-center gap-1"
            style={{
              background: "var(--accent-subtle)",
              color: "var(--accent-primary)",
              border: "1px solid rgba(16, 185, 129, 0.25)",
            }}
          >
            <Globe size={11} />
            Remote
          </span>
        )}
      </div>

      {/* Description Snippet */}
      <p
        onClick={() => onSelect(job)}
        className="text-xs leading-relaxed line-clamp-2 cursor-pointer"
        style={{ color: "var(--content-secondary)" }}
      >
        {job.description}
      </p>

      {/* Footer Info & Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--surface-border)] gap-2 flex-wrap">
        {/* Meta badges (Salary / Date) */}
        <div className="flex items-center gap-3 text-xs font-medium text-[var(--content-secondary)]">
          {salaryDisplay ? (
            <span className="flex items-center gap-1 text-[var(--accent-primary)] font-semibold">
              <DollarSign size={13} />
              {salaryDisplay}
            </span>
          ) : (
            <span className="text-[11px] text-[var(--content-muted)] font-mono">Salary undisclosed</span>
          )}

          <span className="text-[11px] text-[var(--content-muted)]">
            {formatDate(job.postedAt)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* External Source Link */}
          <a
            href={job.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg hover:bg-[var(--surface-elevated)] transition-colors text-[var(--content-muted)] hover:text-[var(--content-primary)]"
            title="View Original Posting"
          >
            <ExternalLink size={15} />
          </a>

          {/* Quick Track Application Button */}
          <button
            onClick={() => onTrack(job)}
            disabled={isTracking}
            className="btn-ghost text-xs py-1.5 px-3 flex items-center gap-1.5"
            title="Add to Kanban Application Tracker"
          >
            <Kanban size={13} />
            {isTracking ? "Added!" : "Track"}
          </button>

          {/* Tailor Resume Button */}
          <Link
            href={`/tailor?jobId=${encodeURIComponent(job.id)}&title=${encodeURIComponent(
              job.title
            )}&company=${encodeURIComponent(job.company)}`}
            className="btn-primary text-xs py-1.5 px-3.5 flex items-center gap-1.5"
          >
            <Wand2 size={13} />
            Tailor Resume
          </Link>
        </div>
      </div>
    </div>
  );
}
