"use client";

import { useState, useEffect, useCallback } from "react";
import { JobPosting } from "@/types";
import JobFilters from "@/components/jobs/JobFilters";
import JobCard from "@/components/jobs/JobCard";
import JobDetailsModal from "@/components/jobs/JobDetailsModal";
import { Briefcase, ChevronLeft, ChevronRight, Loader2, Sparkles } from "lucide-react";

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentFilters, setCurrentFilters] = useState({
    query: "Developer",
    location: "",
    remoteOnly: false,
    country: "us",
  });

  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [trackingJobId, setTrackingJobId] = useState<string | null>(null);
  const [trackedIds, setTrackedIds] = useState<Set<string>>(new Set());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchJobs = useCallback(async (filters = currentFilters, pageNum = page) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters.query) params.set("q", filters.query);
      if (filters.location) params.set("location", filters.location);
      if (filters.remoteOnly) params.set("remote", "true");
      params.set("country", filters.country);
      params.set("page", pageNum.toString());

      const res = await fetch(`/api/jobs/search?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch jobs");
      }

      setJobs(data.jobs ?? []);
      setTotal(data.total ?? 0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentFilters, page]);

  useEffect(() => {
    fetchJobs(currentFilters, 1);
  }, []);

  function handleFilterSearch(filters: {
    query: string;
    location: string;
    remoteOnly: boolean;
    country: string;
  }) {
    setCurrentFilters(filters);
    setPage(1);
    fetchJobs(filters, 1);
  }

  function handlePageChange(newPage: number) {
    setPage(newPage);
    fetchJobs(currentFilters, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleTrackJob(job: JobPosting) {
    setTrackingJobId(job.id);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: job.title,
          company: job.company,
          location: job.location,
          salaryInfo: job.salaryMin || job.salaryMax ? `${job.salaryMin ?? ""}-${job.salaryMax ?? ""}` : null,
          sourceUrl: job.sourceUrl,
          status: "saved",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to track application");
      }

      setTrackedIds((prev) => new Set(prev).add(job.id));
      showToast(`Tracked "${job.title}" at ${job.company}`);
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    } finally {
      setTrackingJobId(null);
    }
  }

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-xl card text-xs font-semibold flex items-center gap-2 border-[var(--accent-primary)] text-[var(--accent-primary)] animate-fade-in">
          <Sparkles size={14} />
          {toastMessage}
        </div>
      )}

      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2.5 text-[var(--content-primary)]">
          <Briefcase size={22} className="text-[var(--accent-primary)]" />
          Job Search & Listings
        </h1>
        <p className="text-xs text-[var(--content-secondary)] mt-1">
          Explore real-time postings, tailor your resume for any role, or add positions to your tracker.
        </p>
      </div>

      {/* Filters Form */}
      <JobFilters onSearch={handleFilterSearch} loading={loading} />

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-mono text-[var(--content-muted)] uppercase tracking-wider">
        <span>
          {loading ? "Searching postings..." : `Found ${total.toLocaleString()} Job Openings`}
        </span>
        <span>Page {page}</span>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="card p-4 border-[var(--status-rejected)] text-xs text-[var(--status-rejected)] bg-rose-500/10">
          {error}
        </div>
      )}

      {/* Skeleton Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card p-5 space-y-3 shimmer">
              <div className="h-4 w-2/3 bg-[var(--surface-border)] rounded" />
              <div className="h-3 w-1/3 bg-[var(--surface-border)] rounded" />
              <div className="h-8 w-full bg-[var(--surface-border)] rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && jobs.length === 0 && (
        <div className="card p-12 text-center space-y-3">
          <Briefcase size={40} className="mx-auto text-[var(--content-muted)]" />
          <h3 className="text-base font-bold text-[var(--content-primary)]">No jobs found</h3>
          <p className="text-xs text-[var(--content-secondary)] max-w-sm mx-auto">
            Try broadening your search query, removing location restrictions, or selecting a different country.
          </p>
        </div>
      )}

      {/* Job Cards Grid */}
      {!loading && jobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onSelect={(j) => setSelectedJob(j)}
              onTrack={handleTrackJob}
              isTracking={trackingJobId === job.id || trackedIds.has(job.id)}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && jobs.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-[var(--surface-border)]">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="btn-ghost text-xs py-2 px-4 flex items-center gap-1 disabled:opacity-40"
          >
            <ChevronLeft size={14} />
            Previous
          </button>

          <span className="text-xs text-[var(--content-secondary)] font-mono">
            Page {page}
          </span>

          <button
            onClick={() => handlePageChange(page + 1)}
            className="btn-ghost text-xs py-2 px-4 flex items-center gap-1"
          >
            Next
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Detailed View Modal */}
      <JobDetailsModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onTrack={handleTrackJob}
      />
    </div>
  );
}
