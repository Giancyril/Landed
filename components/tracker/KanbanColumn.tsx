"use client";

import { Application, ApplicationStatus } from "@/types";
import ApplicationCard from "./ApplicationCard";

interface KanbanColumnProps {
  status: ApplicationStatus;
  label: string;
  badgeClass: string;
  applications: Application[];
  onStatusChange: (id: string, newStatus: ApplicationStatus) => void;
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
}

export default function KanbanColumn({
  status,
  label,
  badgeClass,
  applications,
  onStatusChange,
  onEdit,
  onDelete,
}: KanbanColumnProps) {
  return (
    <div className="flex flex-col h-full min-w-[260px] max-w-[300px] flex-1 card p-3 border-[var(--surface-border)] bg-[var(--surface-card)]">
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--surface-border)]">
        <span className={`badge ${badgeClass}`}>{label}</span>
        <span className="w-5 h-5 rounded-full bg-[var(--surface-input)] border border-[var(--surface-border)] text-[10px] font-mono flex items-center justify-center font-bold text-[var(--content-secondary)]">
          {applications.length}
        </span>
      </div>

      {/* Cards List */}
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {applications.length === 0 ? (
          <div className="p-4 text-center border border-dashed border-[var(--surface-border)] rounded-xl text-[11px] text-[var(--content-muted)] font-mono">
            No applications
          </div>
        ) : (
          applications.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onStatusChange={onStatusChange}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
