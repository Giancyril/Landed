"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Resume, TailoredResume } from "@/types";
import TailorProgressLoader from "@/components/tailoring/TailorProgressLoader";
import TailorDiffViewer from "@/components/tailoring/TailorDiffViewer";
import { Wand2, FileText, Building2, Briefcase, AlertCircle, Sparkles } from "lucide-react";

function TailorPageContent() {
  const searchParams = useSearchParams();
  const initialJobTitle = searchParams.get("title") ?? "";
  const initialCompany = searchParams.get("company") ?? "";

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [jobTitle, setJobTitle] = useState(initialJobTitle);
  const [company, setCompany] = useState(initialCompany);
  const [jobDescription, setJobDescription] = useState("");

  const [loadingResumes, setLoadingResumes] = useState(true);
  const [tailoring, setTailoring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tailoredResult, setTailoredResult] = useState<TailoredResume | null>(null);

  useEffect(() => {
    async function loadResumes() {
      try {
        const res = await fetch("/api/resume");
        const data = await res.json();
        if (res.ok && data.resumes) {
          setResumes(data.resumes);
          const primary = data.resumes.find((r: Resume) => r.isPrimary);
          if (primary) {
            setSelectedResumeId(primary.id);
          } else if (data.resumes.length > 0) {
            setSelectedResumeId(data.resumes[0].id);
          }
        }
      } catch (err) {
        console.error("[loadResumes] Error:", err);
      } finally {
        setLoadingResumes(false);
      }
    }
    loadResumes();
  }, []);

  async function handleTailor(e: React.FormEvent) {
    e.preventDefault();
    if (!jobTitle || !company || !jobDescription) {
      setError("Please fill out Job Title, Company, and Job Description.");
      return;
    }

    setTailoring(true);
    setError(null);
    setTailoredResult(null);

    try {
      const res = await fetch("/api/resume/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeId: selectedResumeId || undefined,
          jobTitle,
          company,
          jobDescription,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to tailor resume");
      }

      setTailoredResult(data.tailoredResume);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setTailoring(false);
    }
  }

  return (
    <div className="p-8 max-w-full mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2.5 text-[var(--content-primary)]">
          <Wand2 size={22} className="text-[var(--accent-primary)]" />
          AI Resume Tailoring Workspace
        </h1>
        <p className="text-xs text-[var(--content-secondary)] mt-1">
          Select a base resume, paste target job details, and receive non-fabricated keyword-tailored bullet points.
        </p>
      </div>

      {/* Input Form Card */}
      {!tailoring && !tailoredResult && (
        <form onSubmit={handleTailor} className="card p-6 space-y-5">
          {/* Resume Selector */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--content-muted)] font-semibold mb-2">
              1. Select Base Resume
            </label>

            {loadingResumes ? (
              <div className="input-field animate-pulse">Loading base resumes...</div>
            ) : resumes.length === 0 ? (
              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-[var(--status-interviewing)] flex items-center justify-between">
                <span>No base resumes found. Please upload a PDF/DOCX resume first.</span>
                <a href="/resumes" className="btn-primary text-xs py-1 px-3">
                  Upload Resume
                </a>
              </div>
            ) : (
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="input-field text-sm cursor-pointer"
              >
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title} ({r.fileName}) {r.isPrimary ? "★ Primary" : ""}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Job Info Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label font-medium">Target Job Title</label>
              <div className="input-icon-wrap">
                <Briefcase size={15} className="input-icon" />
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Senior Frontend Engineer"
                  required
                  className="input-field text-sm"
                />
              </div>
            </div>

            <div>
              <label className="form-label font-medium">Target Company</label>
              <div className="input-icon-wrap">
                <Building2 size={15} className="input-icon" />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Vercel"
                  required
                  className="input-field text-sm"
                />
              </div>
            </div>
          </div>

          {/* Job Description Textarea */}
          <div>
            <label className="form-label font-medium">Target Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste full job description responsibilities, requirements, and tech stack here..."
              rows={8}
              required
              className="textarea-field text-xs"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-[var(--status-rejected)] flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end pt-2 border-t border-[var(--surface-border)]">
            <button
              type="submit"
              disabled={resumes.length === 0}
              className="btn-primary text-xs py-2.5 px-6 flex items-center gap-2"
            >
              <Wand2 size={15} />
              Tailor Resume with Gemini AI
            </button>
          </div>
        </form>
      )}

      {/* Progress Loader */}
      {tailoring && <TailorProgressLoader />}

      {/* Tailored Result Workspace */}
      {tailoredResult && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setTailoredResult(null)}
              className="btn-ghost text-xs py-1.5 px-4"
            >
              ← Tailor Another Job
            </button>
          </div>

          <TailorDiffViewer tailored={tailoredResult} />
        </div>
      )}
    </div>
  );
}

export default function TailorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-[var(--content-muted)]">Loading workspace...</div>}>
      <TailorPageContent />
    </Suspense>
  );
}
