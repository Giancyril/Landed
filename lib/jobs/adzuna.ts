import { JobPosting, JobSearchResponse } from "@/types";

interface AdzunaJob {
  id: string | number;
  title: string;
  company: { display_name: string };
  location: { display_name: string };
  description: string;
  salary_min?: number;
  salary_max?: number;
  redirect_url: string;
  created: string;
}

interface ArbeitnowJob {
  slug: string;
  company_name: string;
  title: string;
  description: string;
  remote: boolean;
  location: string;
  url: string;
  created_at: number;
}

/**
 * Strips HTML tags from text for clean text display
 */
function cleanHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

/**
 * Searches job postings using Adzuna REST API (or Arbeitnow zero-config fallback)
 */
export async function searchJobs(options: {
  query?: string;
  location?: string;
  remoteOnly?: boolean;
  page?: number;
  country?: string; // 'us', 'gb', 'ca', etc. Default 'us'
}): Promise<JobSearchResponse> {
  const { query = "", location = "", remoteOnly = false, page = 1, country = "us" } = options;

  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  // Use Adzuna if credentials exist
  if (appId && appKey) {
    try {
      const resultsPerPage = 20;
      let url = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}?app_id=${appId}&app_key=${appKey}&results_per_page=${resultsPerPage}`;

      if (query) url += `&what=${encodeURIComponent(query)}`;
      if (location) url += `&where=${encodeURIComponent(location)}`;
      if (remoteOnly) url += `&what_and=${encodeURIComponent("remote")}`;

      const res = await fetch(url, { next: { revalidate: 300 } }); // Cache for 5 mins
      if (!res.ok) {
        throw new Error(`Adzuna API returned status ${res.status}`);
      }

      const data = await res.json();
      const rawJobs: AdzunaJob[] = data.results ?? [];

      const jobs: JobPosting[] = rawJobs.map((job) => ({
        id: `adzuna-${job.id}`,
        title: cleanHtml(job.title),
        company: job.company?.display_name ?? "Unknown Company",
        location: job.location?.display_name ?? "Location unspecified",
        isRemote:
          job.title.toLowerCase().includes("remote") ||
          job.description.toLowerCase().includes("remote"),
        description: cleanHtml(job.description),
        salaryMin: job.salary_min ? Math.round(job.salary_min) : undefined,
        salaryMax: job.salary_max ? Math.round(job.salary_max) : undefined,
        currency: country === "gb" ? "GBP" : country === "ca" ? "CAD" : "USD",
        sourceUrl: job.redirect_url,
        postedAt: job.created,
        provider: "adzuna",
      }));

      return {
        jobs,
        total: data.count ?? jobs.length,
        page,
      };
    } catch (err) {
      console.warn("[Adzuna] Search failed, falling back to Arbeitnow:", err);
    }
  }

  // Zero-config Fallback: Arbeitnow API (Free, no key required)
  try {
    const res = await fetch(`https://www.arbeitnow.com/api/job-board-api?page=${page}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      throw new Error(`Arbeitnow API returned status ${res.status}`);
    }

    const data = await res.json();
    const rawJobs: ArbeitnowJob[] = data.data ?? [];

    let filtered = rawJobs;
    if (query) {
      const qLower = query.toLowerCase();
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(qLower) ||
          j.company_name.toLowerCase().includes(qLower) ||
          j.description.toLowerCase().includes(qLower)
      );
    }

    if (location) {
      const locLower = location.toLowerCase();
      filtered = filtered.filter((j) => j.location.toLowerCase().includes(locLower));
    }

    if (remoteOnly) {
      filtered = filtered.filter((j) => j.remote);
    }

    const jobs: JobPosting[] = filtered.map((job) => ({
      id: `arbeitnow-${job.slug}`,
      title: cleanHtml(job.title),
      company: job.company_name,
      location: job.location || (job.remote ? "Remote" : "Global"),
      isRemote: job.remote,
      description: cleanHtml(job.description),
      sourceUrl: job.url,
      postedAt: new Date(job.created_at * 1000).toISOString(),
      provider: "arbeitnow",
    }));

    return {
      jobs,
      total: data.meta?.total ?? jobs.length,
      page,
    };
  } catch (err) {
    console.error("[Arbeitnow] Search failed:", err);
    return { jobs: [], total: 0, page: 1 };
  }
}
