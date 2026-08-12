"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { InterviewQuestion, InterviewSession, InterviewAnswerFeedback } from "@/types";
import InterviewQuestionSelector from "@/components/interview/InterviewQuestionSelector";
import InterviewAnswerInput from "@/components/interview/InterviewAnswerInput";
import InterviewFeedbackCard from "@/components/interview/InterviewFeedbackCard";
import { Mic, Briefcase, Building2, Loader2, AlertCircle, RefreshCw, Wand2 } from "lucide-react";

function InterviewPageContent() {
  const searchParams = useSearchParams();
  const initialJobTitle = searchParams.get("title") ?? "";
  const initialCompany = searchParams.get("company") ?? "";

  const [jobTitle, setJobTitle] = useState(initialJobTitle);
  const [company, setCompany] = useState(initialCompany);
  const [jobDescription, setJobDescription] = useState("");

  const [generating, setGenerating] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [session, setSession] = useState<InterviewSession | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [feedbacks, setFeedbacks] = useState<Record<number, InterviewAnswerFeedback>>({});
  const [answeredIndices, setAnsweredIndices] = useState<Set<number>>(new Set());

  async function handleGenerateQuestions(e: React.FormEvent) {
    e.preventDefault();
    if (!jobTitle || !company || !jobDescription) {
      setError("Please fill out Job Title, Company, and Job Description.");
      return;
    }

    setGenerating(true);
    setError(null);
    setSession(null);
    setFeedbacks({});
    setAnsweredIndices(new Set());
    setSelectedIndex(0);

    try {
      const res = await fetch("/api/interview/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, company, jobDescription }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate interview questions");
      }

      setSession(data.session);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  async function handleSubmitAnswer(userAnswer: string) {
    if (!session) return;
    const activeQuestion = session.questions[selectedIndex];
    setEvaluating(true);
    setError(null);

    try {
      const res = await fetch("/api/interview/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.id,
          jobTitle: session.jobTitle,
          company: session.company,
          question: activeQuestion.question,
          category: activeQuestion.category,
          userAnswer,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to evaluate answer");
      }

      setFeedbacks((prev) => ({ ...prev, [selectedIndex]: data.feedback }));
      setAnsweredIndices((prev) => new Set(prev).add(selectedIndex));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setEvaluating(false);
    }
  }

  const activeQuestion = session?.questions[selectedIndex];
  const activeFeedback = feedbacks[selectedIndex];

  return (
    <div className="p-8 max-w-full mx-auto space-y-6 animate-fade-in">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2.5 text-[var(--content-primary)]">
          <Mic size={22} className="text-[var(--accent-primary)]" />
          AI Interview Prep Copilot
        </h1>
        <p className="text-xs text-[var(--content-secondary)] mt-1">
          Generate role-specific Technical, Behavioral (STAR), and Situational questions with real-time AI evaluation and model answers.
        </p>
      </div>

      {/* Input Form */}
      {!generating && !session && (
        <form onSubmit={handleGenerateQuestions} className="card p-6 space-y-5">
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
                  placeholder="Staff Backend Engineer"
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
                  placeholder="OpenAI"
                  required
                  className="input-field text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="form-label font-medium">Target Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste full job description requirements and duties..."
              rows={8}
              required
              className="textarea-field text-xs"
            />
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-[var(--status-rejected)] flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="flex justify-end pt-2 border-t border-[var(--surface-border)]">
            <button type="submit" className="btn-primary text-xs py-2.5 px-6 flex items-center gap-2">
              <Wand2 size={15} />
              Generate Question Bank
            </button>
          </div>
        </form>
      )}

      {/* Loading Loader */}
      {generating && (
        <div className="card p-12 text-center max-w-md mx-auto space-y-4 my-8">
          <Loader2 size={32} className="animate-spin mx-auto text-[var(--accent-primary)]" />
          <h3 className="text-base font-bold text-[var(--content-primary)]">
            Generating Tailored Question Bank...
          </h3>
          <p className="text-xs text-[var(--content-secondary)]">
            Creating Technical, STAR Behavioral, and Situational questions for {jobTitle} at {company}.
          </p>
        </div>
      )}

      {/* Practice Session Workspace */}
      {session && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="text-xs text-[var(--content-secondary)]">
              Session for <span className="font-bold text-[var(--content-primary)]">{session.jobTitle}</span> at{" "}
              <span className="font-bold text-[var(--content-primary)]">{session.company}</span>
            </div>

            <button
              onClick={() => setSession(null)}
              className="btn-ghost text-xs py-1.5 px-4 flex items-center gap-1.5"
            >
              <RefreshCw size={13} />
              New Interview Session
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Navigator */}
            <div className="lg:col-span-4">
              <InterviewQuestionSelector
                questions={session.questions}
                selectedIndex={selectedIndex}
                onSelect={(idx) => setSelectedIndex(idx)}
                answeredIndices={answeredIndices}
              />
            </div>

            {/* Right: Active Question & Input/Feedback Workspace */}
            <div className="lg:col-span-8 space-y-6">
              {activeQuestion && (
                <InterviewAnswerInput
                  question={activeQuestion}
                  onSubmit={handleSubmitAnswer}
                  loading={evaluating}
                />
              )}

              {activeFeedback && (
                <InterviewFeedbackCard feedback={activeFeedback} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InterviewPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs font-mono text-[var(--content-muted)]">Loading Interview Copilot...</div>}>
      <InterviewPageContent />
    </Suspense>
  );
}
