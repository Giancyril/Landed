"use client";

import { Application, ApplicationStatus } from "@/types";
import { formatDate } from "@/lib/utils";
import { Building2, MapPin, ExternalLink, Trash2, Edit3, Calendar, FileText } from "lucide-react";

interface ApplicationCardProps {
  application: Application;
  onStatusChange: (id: string, newStatus: ApplicationStatus) => void;
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
}

const STATUS_OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: "saved", label: "Saved" },
  { value: "applied", label: "Applied" },
  { value: "interviewing", label: "Interviewing" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
  { value: "withdrawn", label: "Withdrawn" },
];

export default function ApplicationCard({
  application,
  onStatusChange,
  onEdit,
  onDelete,
}: ApplicationCardProps) {
  const companyInitial = application.company ? application.company.charAt(0).toUpperCase() : "J";

  return (
    <div className="card p-4 space-y-3 transition-all duration-200 hover:border-[var(--accent-primary)] group">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--surface-elevated)] border border-[var(--surface-border)] flex items-center justify-center font-bold text-xs shrink-0 text-[var(--accent-primary)]">
            {companyInitial}
          </div>
          <div>
            <h4 className="font-bold text-xs text-[var(--content-primary)] line-clamp-1">
              {application.jobTitle}
            </h4>
            <div className="flex items-center gap-1.5 text-[11px] text-[var(--content-secondary)] mt-0.5">
              <span className="flex items-center gap-1">
                <Building2 size={11} className="text-[var(--content-muted)]" />
                {application.company}
              </span>
            </div>
          </div>
        </div>

        {/* Delete */}
        <button
          onClick={() => onDelete(application.id)}
          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-500/10 text-[var(--content-muted)] hover:text-[var(--status-rejected)] transition-all"
          title="Delete application"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Location / Meta */}
      {application.location && (
        <div className="text-[11px] text-[var(--content-muted)] flex items-center gap-1">
          <MapPin size={11} />
          <span className="truncate">{application.location}</span>
        </div>
      )}

      {/* Notes Excerpt */}
      {application.notes && (
        <p className="text-[11px] text-[var(--content-secondary)] bg-[var(--surface-input)] p-2 rounded border border-[var(--surface-border)] line-clamp-2 italic">
          &quot;{application.notes}&quot;
        </p>
      )}

      {/* Footer & Status Dropdown Selector */}
      <div className="pt-2 border-t border-[var(--surface-border)] flex items-center justify-between gap-2 text-[11px]">
        {/* Status Dropdown */}
        <select
          value={application.status}
          onChange={(e) => onStatusChange(application.id, e.target.value as ApplicationStatus)}
          className="bg-[var(--surface-input)] border border-[var(--surface-border)] rounded px-2 py-1 text-[11px] font-medium text-[var(--content-primary)] cursor-pointer outline-none focus:border-[var(--accent-primary)]"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {application.sourceUrl && (
            <a
              href={application.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded hover:bg-[var(--surface-elevated)] text-[var(--content-muted)] hover:text-[var(--content-primary)] transition-colors"
              title="Open Source Link"
            >
              <ExternalLink size={12} />
            </a>
          )}

          <button
            onClick={() => onEdit(application)}
            className="p-1.5 rounded hover:bg-[var(--surface-elevated)] text-[var(--content-muted)] hover:text-[var(--content-primary)] transition-colors"
            title="Edit Details / Notes"
          >
            <Edit3 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
