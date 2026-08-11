"use client";

import { useState, useEffect } from "react";
import { Application, ApplicationStatus } from "@/types";
import { X, Briefcase, Building2, MapPin, DollarSign, Calendar, Edit3 } from "lucide-react";

interface ApplicationModalProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Application>) => void;
}

export default function ApplicationModal({
  application,
  isOpen,
  onClose,
  onSave,
}: ApplicationModalProps) {
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [salaryInfo, setSalaryInfo] = useState("");
  const [status, setStatus] = useState<ApplicationStatus>("saved");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (application) {
      setJobTitle(application.jobTitle);
      setCompany(application.company);
      setLocation(application.location ?? "");
      setSalaryInfo(application.salaryInfo ?? "");
      setStatus(application.status);
      setNotes(application.notes ?? "");
    } else {
      setJobTitle("");
      setCompany("");
      setLocation("");
      setSalaryInfo("");
      setStatus("saved");
      setNotes("");
    }
  }, [application, isOpen]);

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      id: application?.id,
      jobTitle,
      company,
      location: location.trim() || undefined,
      salaryInfo: salaryInfo.trim() || undefined,
      status,
      notes: notes.trim() || undefined,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="card w-full max-w-lg p-6 space-y-5 relative">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--surface-border)]">
          <h2 className="text-base font-bold text-[var(--content-primary)] flex items-center gap-2">
            <Briefcase size={18} className="text-[var(--accent-primary)]" />
            {application ? "Edit Tracked Application" : "Track New Application"}
          </h2>
          <button onClick={onClose} className="p-1 rounded text-[var(--content-muted)] hover:text-[var(--content-primary)]">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-[var(--content-muted)] uppercase mb-1">
                Job Title *
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                required
                className="input-field text-xs"
                placeholder="Senior Full Stack Engineer"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[var(--content-muted)] uppercase mb-1">
                Company *
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                className="input-field text-xs"
                placeholder="Vercel"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-[var(--content-muted)] uppercase mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="input-field text-xs"
                placeholder="New York, NY (or Remote)"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[var(--content-muted)] uppercase mb-1">
                Status Stage
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                className="input-field text-xs cursor-pointer"
              >
                <option value="saved">Saved</option>
                <option value="applied">Applied</option>
                <option value="interviewing">Interviewing</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[var(--content-muted)] uppercase mb-1">
              Personal Application Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="input-field text-xs font-mono"
              placeholder="e.g. Recruiter screen went great. Tech screen scheduled for Friday 2 PM."
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--surface-border)]">
            <button type="button" onClick={onClose} className="btn-ghost text-xs py-2 px-4">
              Cancel
            </button>
            <button type="submit" className="btn-primary text-xs py-2 px-5">
              {application ? "Save Changes" : "Track Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
