export type ProviderType = "adzuna" | "arbeitnow";

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  isRemote: boolean;
  description: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  sourceUrl: string;
  postedAt: string;
  provider: ProviderType;
}

export interface JobSearchResponse {
  jobs: JobPosting[];
  total: number;
  page: number;
}

export interface Resume {
  id: string;
  userId: string;
  title: string;
  fileName: string;
  fileSize: number;
  storagePath: string;
  extractedText: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TailoredBullet {
  section: string;
  original: string;
  tailored: string;
  reasoning: string;
}

export interface TailoredResume {
  id: string;
  userId: string;
  resumeId: string;
  jobId?: string;
  jobTitle: string;
  company: string;
  jobDescription: string;
  tailoredSummary: string;
  diffBullets: TailoredBullet[];
  matchedKeywords: string[];
  missingKeywords: string[];
  createdAt: string;
}

export interface CoverLetter {
  id: string;
  userId: string;
  resumeId?: string;
  jobId?: string;
  jobTitle: string;
  company: string;
  customNotes?: string;
  content: string;
  createdAt: string;
}

export type ApplicationStatus =
  | "saved"
  | "applied"
  | "interviewing"
  | "offer"
  | "rejected"
  | "withdrawn";

export interface Application {
  id: string;
  userId: string;
  jobId?: string;
  jobTitle: string;
  company: string;
  location?: string;
  salaryInfo?: string;
  sourceUrl?: string;
  status: ApplicationStatus;
  tailoredResumeId?: string;
  coverLetterId?: string;
  appliedDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
