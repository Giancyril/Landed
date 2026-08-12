"use client";

import { useState, useEffect } from "react";
import { Search, FileText, Wand2, Mail, Kanban, TrendingUp, BarChart3, ArrowRight } from "lucide-react";
import Link from "next/link";

const QUICK_LINKS = [
  {
    href: "/jobs",
    label: "Search Jobs",
    icon: Search,
    desc: "Browse live postings via Adzuna API",
    gradient: "from-emerald-500/20 to-emerald-500/5",
    accent: "var(--accent-primary)",
  },
  {
    href: "/resumes",
    label: "Upload Resume",
    icon: FileText,
    desc: "Upload your base PDF or DOCX resume",
    gradient: "from-indigo-500/20 to-indigo-500/5",
    accent: "#6366f1",
  },
  {
    href: "/tailor",
    label: "Tailor Resume",
    icon: Wand2,
    desc: "Gemini AI-powered bullet rewriting",
    gradient: "from-purple-500/20 to-purple-500/5",
    accent: "#a855f7",
  },
  {
    href: "/cover-letter",
    label: "Cover Letter",
    icon: Mail,
    desc: "Generate a human, non-boilerplate letter",
    gradient: "from-sky-500/20 to-sky-500/5",
    accent: "#38bdf8",
  },
  {
    href: "/tracker",
    label: "Tracker Board",
    icon: Kanban,
    desc: "Manage your application pipeline",
    gradient: "from-amber-500/20 to-amber-500/5",
    accent: "#f59e0b",
  },
];

interface TrackerStats {
  total: number;
  saved: number;
  applied: number;
  interviewing: number;
  offer: number;
}

export default function JobsHomePage() {
  const [stats, setStats] = useState<TrackerStats | null>(null);
  const [resumeCount, setResumeCount] = useState<number>(0);

  useEffect(() => {
    async function loadStats() {
      try {
        const [appsRes, resumesRes] = await Promise.all([
          fetch("/api/applications"),
          fetch("/api/resume"),
        ]);

        if (appsRes.ok) {
          const { applications } = await appsRes.json();
          const list = applications ?? [];
          setStats({
            total: list.length,
            saved: list.filter((a: any) => a.status === "saved").length,
            applied: list.filter((a: any) => a.status === "applied").length,
            interviewing: list.filter((a: any) => a.status === "interviewing").length,
            offer: list.filter((a: any) => a.status === "offer").length,
          });
        }

        if (resumesRes.ok) {
          const { resumes } = await resumesRes.json();
          setResumeCount((resumes ?? []).length);
        }
      } catch {
        // Silently fail — stats are cosmetic on homepage
      }
    }

    loadStats();
  }, []);

  return (
    <div className="p-8 max-w-full mx-auto space-y-8 animate-fade-in">
      {/* Hero Header */}
      <div className="page-header">
        <h1>Your AI Job Search Copilot</h1>
        <p>
          Search active roles, tailor your resume with AI, generate personalized cover letters, and manage your pipeline.
        </p>
      </div>

      {/* Live Stats Bar */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Tracked", value: stats.total, color: "var(--content-primary)" },
            { label: "Applied",       value: stats.applied, color: "var(--status-applied)" },
            { label: "Interviewing",  value: stats.interviewing, color: "var(--status-interviewing)" },
            { label: "Offers",        value: stats.offer, color: "var(--status-offer)" },
          ].map(({ label, value, color }) => (
            <div key={label} className="stat-card">
              <span className="stat-value" style={{ color }}>
                {value}
              </span>
              <span className="stat-label">{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Feature Cards */}
      <div>
        <div className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "var(--content-muted)" }}>
          Core Features
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUICK_LINKS.map(({ href, label, icon: Icon, desc, gradient, accent }) => (
            <Link
              key={href}
              href={href}
              className="card p-5 flex flex-col gap-3 group transition-all duration-200 hover:-translate-y-0.5"
              style={{ ["--card-accent" as string]: accent }}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${gradient}`}
              >
                <Icon size={19} style={{ color: accent }} />
              </div>
              <div>
                <div className="font-semibold text-sm flex items-center gap-1.5 mb-1" style={{ color: "var(--content-primary)" }}>
                  {label}
                  <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" style={{ color: accent }} />
                </div>
                <div className="text-xs leading-relaxed" style={{ color: "var(--content-secondary)" }}>
                  {desc}
                </div>
              </div>
            </Link>
          ))}

          {/* Resume count card */}
          <div className="card p-5 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest mb-3" style={{ color: "var(--content-muted)" }}>
              <BarChart3 size={14} style={{ color: "var(--accent-primary)" }} />
              Base Resumes Stored
            </div>
            <div className="text-4xl font-bold font-mono" style={{ color: "var(--content-primary)" }}>
              {resumeCount}
            </div>
            <Link href="/resumes" className="mt-3 btn-ghost text-xs py-1.5 px-3 self-start">
              Manage Resumes →
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Strip */}
      <div
        className="rounded-2xl p-6 flex items-center justify-between gap-4 flex-wrap"
        style={{ background: "var(--surface-card)", border: "1px solid var(--surface-border)" }}
      >
        <div>
          <div className="text-sm font-bold mb-1" style={{ color: "var(--content-primary)" }}>
            Start your job search now
          </div>
          <p className="text-xs" style={{ color: "var(--content-secondary)" }}>
            Browse live postings from Adzuna, paste a job description into the tailoring workspace, and generate a cover letter in under 60 seconds.
          </p>
        </div>

        <Link
          href="/jobs"
          className="btn-primary text-xs py-2.5 px-5 flex items-center gap-2 shrink-0"
        >
          <TrendingUp size={14} />
          Browse Live Jobs
        </Link>
      </div>
    </div>
  );
}
