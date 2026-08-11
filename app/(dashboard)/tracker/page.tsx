"use client";

import { useState, useEffect } from "react";
import { Application, ApplicationStatus } from "@/types";
import KanbanColumn from "@/components/tracker/KanbanColumn";
import ApplicationModal from "@/components/tracker/ApplicationModal";
import { Kanban, List, Plus, Search, Sparkles, Building2, MapPin, Trash2, Edit3 } from "lucide-react";

const COLUMNS: { status: ApplicationStatus; label: string; badgeClass: string }[] = [
  { status: "saved",        label: "Saved",        badgeClass: "badge-saved" },
  { status: "applied",      label: "Applied",      badgeClass: "badge-applied" },
  { status: "interviewing", label: "Interviewing", badgeClass: "badge-interviewing" },
  { status: "offer",        label: "Offer",        badgeClass: "badge-offer" },
  { status: "rejected",     label: "Rejected",     badgeClass: "badge-rejected" },
  { status: "withdrawn",    label: "Withdrawn",    badgeClass: "badge-withdrawn" },
];

export default function TrackerPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [searchQuery, setSearchQuery] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  async function fetchApplications() {
    try {
      const res = await fetch("/api/applications");
      const data = await res.json();
      if (res.ok && data.applications) {
        setApplications(data.applications);
      }
    } catch (err) {
      console.error("[fetchApplications] Error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchApplications();
  }, []);

  async function handleStatusChange(id: string, newStatus: ApplicationStatus) {
    // Optimistic update
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );

    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      showToast("Application stage updated!");
    } catch (err: any) {
      fetchApplications(); // Revert on error
      showToast(`Error: ${err.message}`);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to remove this tracked application?")) return;
    setApplications((prev) => prev.filter((app) => app.id !== id));

    try {
      const res = await fetch(`/api/applications/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete application");
      showToast("Application deleted.");
    } catch (err: any) {
      fetchApplications();
      showToast(`Error: ${err.message}`);
    }
  }

  async function handleSaveModal(data: Partial<Application>) {
    if (data.id) {
      // Update existing
      try {
        const res = await fetch(`/api/applications/${data.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          fetchApplications();
          showToast("Application updated!");
        }
      } catch (err: any) {
        showToast(`Error: ${err.message}`);
      }
    } else {
      // Create new
      try {
        const res = await fetch("/api/applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          fetchApplications();
          showToast("New application tracked!");
        }
      } catch (err: any) {
        showToast(`Error: ${err.message}`);
      }
    }
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  const filteredApplications = applications.filter((app) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      app.jobTitle.toLowerCase().includes(q) ||
      app.company.toLowerCase().includes(q) ||
      (app.location && app.location.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-8 max-w-full mx-auto space-y-6 animate-fade-in flex flex-col h-full">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-xl card text-xs font-semibold flex items-center gap-2 border-[var(--accent-primary)] text-[var(--accent-primary)] animate-fade-in">
          <Sparkles size={14} />
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2.5 text-[var(--content-primary)]">
            <Kanban size={22} className="text-[var(--accent-primary)]" />
            Application Tracker Board
          </h1>
          <p className="text-xs text-[var(--content-secondary)] mt-1">
            Track your job application stages from Saved to Offer in an interactive Kanban board.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center p-1 rounded-lg bg-[var(--surface-input)] border border-[var(--surface-border)]">
            <button
              onClick={() => setViewMode("kanban")}
              className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
                viewMode === "kanban"
                  ? "bg-[var(--accent-primary)] text-white"
                  : "text-[var(--content-muted)] hover:text-[var(--content-primary)]"
              }`}
            >
              <Kanban size={13} />
              Kanban
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
                viewMode === "table"
                  ? "bg-[var(--accent-primary)] text-white"
                  : "text-[var(--content-muted)] hover:text-[var(--content-primary)]"
              }`}
            >
              <List size={13} />
              Table
            </button>
          </div>

          <button
            onClick={() => {
              setEditingApp(null);
              setModalOpen(true);
            }}
            className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
          >
            <Plus size={14} />
            Track Job
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xs">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--content-muted)]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter tracked jobs..."
          className="input-field pl-9 text-xs"
        />
      </div>

      {/* Kanban Board View */}
      {viewMode === "kanban" && (
        <div className="flex-1 overflow-x-auto pb-4">
          <div className="flex gap-4 h-[calc(100vh-250px)] min-w-max">
            {COLUMNS.map(({ status, label, badgeClass }) => {
              const columnApps = filteredApplications.filter((app) => app.status === status);
              return (
                <KanbanColumn
                  key={status}
                  status={status}
                  label={label}
                  badgeClass={badgeClass}
                  applications={columnApps}
                  onStatusChange={handleStatusChange}
                  onEdit={(app) => {
                    setEditingApp(app);
                    setModalOpen(true);
                  }}
                  onDelete={handleDelete}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Tabular List View */}
      {viewMode === "table" && (
        <div className="card overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--surface-input)] border-b border-[var(--surface-border)] font-mono text-[11px] text-[var(--content-muted)] uppercase">
              <tr>
                <th className="p-3.5">Company & Role</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">Stage Status</th>
                <th className="p-3.5">Notes</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--surface-border)]">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[var(--content-muted)] font-mono">
                    No applications tracked yet. Click &quot;Track Job&quot; above to add one.
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-[var(--surface-elevated)] transition-colors">
                    <td className="p-3.5 font-medium">
                      <div className="font-bold text-[var(--content-primary)]">{app.jobTitle}</div>
                      <div className="text-[var(--content-secondary)] text-[11px] flex items-center gap-1 mt-0.5">
                        <Building2 size={11} /> {app.company}
                      </div>
                    </td>
                    <td className="p-3.5 text-[var(--content-secondary)]">
                      {app.location ?? "—"}
                    </td>
                    <td className="p-3.5">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                        className="bg-[var(--surface-input)] border border-[var(--surface-border)] rounded px-2 py-1 text-xs font-semibold cursor-pointer"
                      >
                        {COLUMNS.map((c) => (
                          <option key={c.status} value={c.status}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3.5 text-[var(--content-secondary)] max-w-xs truncate font-mono">
                      {app.notes ?? "—"}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => {
                          setEditingApp(app);
                          setModalOpen(true);
                        }}
                        className="p-1.5 rounded hover:bg-[var(--surface-elevated)] text-[var(--content-muted)] hover:text-[var(--content-primary)] transition-colors"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="p-1.5 rounded hover:bg-rose-500/10 text-[var(--content-muted)] hover:text-[var(--status-rejected)] transition-colors ml-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit / Create Modal */}
      <ApplicationModal
        application={editingApp}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingApp(null);
        }}
        onSave={handleSaveModal}
      />
    </div>
  );
}
