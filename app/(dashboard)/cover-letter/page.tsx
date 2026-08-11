"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Resume, CoverLetter } from "@/types";
import CoverLetterEditor from "@/components/cover-letter/CoverLetterEditor";
import { Mail, Briefcase, Building2, Wand2, Loader2, AlertCircle, MessageSquare } from "lucide-react";

function CoverLetterContent() {
  const searchParams = useSearchParams();
  const initialJobTitle = searchParams.get("title") ?? "";
  const initialCompany = searchParams.get("company") ?? "";

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [jobTitle, setJobTitle] = useState(initialJobTitle);
  const [company, setCompany] = useState(initialCompany);
  const [jobDescription, setJobDescription] = useState("");
  const [customNotes, setCustomNotes] = useState("");

  const [loadingResumes, setLoadingResumes] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedLetter, setGeneratedLetter] = useState<CoverLetter | null>(null);

  useEffect(() => {
    async function loadResumes() {
      try {
        const res = await fetch("/api/resume");
        const data = await res.json();
        if (res.ok && data.resumes) {
          setResumes(data.resumes);
          const primary = data.resumes.find((r: Resume) => r.isPrimary);
          if (primary) setSelectedResumeId(primary.id);
          else if (data.resumes.length > 0) setSelectedResumeId(data.resumes[0].id);
        }
      } catch (err) {
        console.error("[loadResumes] Error:", err);
      } finally {
        setLoadingResumes(false);
      }
    }
    loadResumes();
  }, []);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!jobTitle || !company || !jobDescription) {
      setError("Please fill out Job Title, Company, and Job Description.");
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/cover-letter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeId: selectedResumeId || undefined,
          jobTitle,
          company,
          jobDescription,
          customNotes: customNotes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate cover letter");
      }

      setGeneratedLetter(data.coverLetter);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2.5 text-[var(--content-primary)]">
          <Mail size={22} className="text-[var(--accent-primary)]" />
          AI Cover Letter Generator
        </h1>
        <p className="text-xs text-[var(--content-secondary)] mt-1">
          Generate a concise, human-sounding cover letter that avoids generic AI boilerplate.
        </p>
      </div>

      {/* Input Form */}
      {!generating && !generatedLetter && (
        <form onSubmit={handleGenerate} className="card p-6 space-y-5">
          {/* Base Resume Selector */}
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
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--content-muted)] font-semibold mb-1.5">
                2. Target Job Title
              </label>
              <div className="relative">
                <Briefcase size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--content-muted)]" />
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Full Stack Developer"
                  required
                  className="input-field pl-10 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--content-muted)] font-semibold mb-1.5">
                Target Company
              </label>
              <div className="relative">
                <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--content-muted)]" />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Acme Corp"
                  required
                  className="input-field pl-10 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Custom Candidate Instructions */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--content-muted)] font-semibold mb-1.5 flex items-center gap-1.5">
              <MessageSquare size={13} className="text-[var(--accent-primary)]" />
              Custom Candidate Notes / Instructions (Optional)
            </label>
            <input
              type="text"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="e.g. 'Mention my open-source contribution to Next.js', 'Note that I am relocating to NYC in June'"
              className="input-field text-xs"
            />
          </div>

          {/* Job Description Textarea */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--content-muted)] font-semibold mb-1.5">
              3. Target Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste full job description requirements and responsibilities here..."
              rows={7}
              required
              className="input-field text-xs font-mono leading-relaxed"
            />
          </div>

          {/* Error Alert */}
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
              Generate Cover Letter
            </button>
          </div>
        </form>
      )}

      {/* Loading Spinner */}
      {generating && (
        <div className="card p-12 text-center max-w-md mx-auto space-y-4 my-8">
          <Loader2 size={32} className="animate-spin mx-auto text-[var(--accent-primary)]" />
          <h3 className="text-base font-bold text-[var(--content-primary)]">
            Crafting Human Cover Letter...
          </h3>
          <p className="text-xs text-[var(--content-secondary)]">
            Applying anti-boilerplate filter and injecting resume achievements for {jobTitle} at {company}.
          </p>
        </div>
      )}

      {/* Generated Editor View */}
      {generatedLetter && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setGeneratedLetter(null)}
              className="btn-ghost text-xs py-1.5 px-4"
            >
              ← Generate Another Letter
            </button>
          </div>

          <CoverLetterEditor
            coverLetter={generatedLetter}
            onRegenerate={() => setGeneratedLetter(null)}
          />
        </div>
      )}
    </div>
  );
}

export default function CoverLetterPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-[var(--content-muted)]">Loading generator...</div>}>
      <CoverLetterContent />
    </Suspense>
  );
}
