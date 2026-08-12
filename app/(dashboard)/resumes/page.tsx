"use client";

import { useState, useEffect } from "react";
import { Resume } from "@/types";
import ResumeUploadZone from "@/components/resumes/ResumeUploadZone";
import ResumeCard from "@/components/resumes/ResumeCard";
import ExtractedTextModal from "@/components/resumes/ExtractedTextModal";
import { FileText, Loader2, Plus, Sparkles } from "lucide-react";

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTextResume, setSelectedTextResume] = useState<Resume | null>(null);
  const [showUpload, setShowUpload] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  async function fetchResumes() {
    try {
      const res = await fetch("/api/resume");
      const data = await res.json();
      if (res.ok) {
        setResumes(data.resumes ?? []);
      }
    } catch (err) {
      console.error("[fetchResumes] Error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchResumes();
  }, []);

  async function handleSetPrimary(id: string) {
    try {
      const res = await fetch(`/api/resume/${id}`, { method: "PATCH" });
      if (res.ok) {
        fetchResumes();
        showToastMessage("Primary resume updated!");
      }
    } catch (err: any) {
      showToastMessage(`Error: ${err.message}`);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this resume?")) return;
    try {
      const res = await fetch(`/api/resume/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchResumes();
        showToastMessage("Resume deleted.");
      }
    } catch (err: any) {
      showToastMessage(`Error: ${err.message}`);
    }
  }

  function showToastMessage(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <div className="p-8 max-w-full mx-auto space-y-6 animate-fade-in">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-xl card text-xs font-semibold flex items-center gap-2 border-[var(--accent-primary)] text-[var(--accent-primary)] animate-fade-in">
          <Sparkles size={14} />
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2.5 text-[var(--content-primary)]">
            <FileText size={22} className="text-[var(--accent-primary)]" />
            Resume Manager
          </h1>
          <p className="text-xs text-[var(--content-secondary)] mt-1">
            Upload your base resume documents (PDF or DOCX). AI text extraction runs automatically.
          </p>
        </div>

        <button
          onClick={() => setShowUpload(!showUpload)}
          className="btn-ghost text-xs py-2 px-4 flex items-center gap-1.5"
        >
          <Plus size={14} />
          {showUpload ? "Hide Upload" : "Upload Resume"}
        </button>
      </div>

      {/* Upload Zone */}
      {showUpload && <ResumeUploadZone onUploadSuccess={fetchResumes} />}

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="card p-5 space-y-3 shimmer">
              <div className="h-4 w-1/2 bg-[var(--surface-border)] rounded" />
              <div className="h-12 w-full bg-[var(--surface-border)] rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && resumes.length === 0 && (
        <div className="card p-12 text-center space-y-3">
          <FileText size={40} className="mx-auto text-[var(--content-muted)]" />
          <h3 className="text-base font-bold text-[var(--content-primary)]">No resumes uploaded yet</h3>
          <p className="text-xs text-[var(--content-secondary)] max-w-sm mx-auto">
            Upload your base PDF or Word resume above to begin tailoring it for target job descriptions.
          </p>
        </div>
      )}

      {/* Resume Cards Grid */}
      {!loading && resumes.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-wider text-[var(--content-muted)] font-semibold">
            Your Base Resumes ({resumes.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                onSetPrimary={handleSetPrimary}
                onDelete={handleDelete}
                onViewText={(r) => setSelectedTextResume(r)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Extracted Text Modal */}
      <ExtractedTextModal
        resume={selectedTextResume}
        onClose={() => setSelectedTextResume(null)}
      />
    </div>
  );
}
