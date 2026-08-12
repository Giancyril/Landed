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

// ── ADVANCED FEATURE TYPES ────────────────────────────────────────────────

// 1. ATS Analysis
export interface ATSAnalysis {
  id: string;
  userId: string;
  resumeId?: string;
  jobTitle: string;
  company: string;
  jobDescription: string;
  overallScore: number; // 0-100
  keywordScore: number; // 0-100
  skillsScore: number;  // 0-100
  readabilityScore: number; // 0-100
  relevanceScore: number;   // 0-100
  breakdown: {
    keywordDensity: string;
    techStackCoverage: string;
    formattingNotes: string;
    relevanceSummary: string;
  };
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
  createdAt: string;
}

// 2. Interview Prep Copilot
export interface InterviewQuestion {
  id: string;
  category: "Technical" | "Behavioral (STAR)" | "Situational";
  question: string;
  context: string;
  idealKeyPoints: string[];
}

export interface InterviewSession {
  id: string;
  userId: string;
  applicationId?: string;
  jobTitle: string;
  company: string;
  jobDescription: string;
  questions: InterviewQuestion[];
  createdAt: string;
}

export interface InterviewAnswerFeedback {
  id?: string;
  sessionId: string;
  question: string;
  category: string;
  userAnswer: string;
  score: number; // 0-100
  strengths: string[];
  areasToImprove: string[];
  improvedAnswerSample: string;
  createdAt?: string;
}

// 3. Offer & Negotiation Advisor
export interface OfferEvaluation {
  id: string;
  userId: string;
  applicationId?: string;
  company: string;
  jobTitle: string;
  baseSalary: number;
  bonus: number;
  equityValue: number;
  signingBonus: number;
  remoteAllowance: number;
  totalCompensation: number;
  notes?: string;
  createdAt: string;
}

export interface NegotiationScript {
  id: string;
  userId: string;
  evaluationId: string;
  tone: "Collaborative" | "Firm & Competitive" | "Direct Executive";
  counterTarget: number;
  justification: string;
  emailScript: string;
  createdAt: string;
}

// 4. Career Pipeline Analytics
export interface AnalyticsMetrics {
  totalApplications: number;
  stageCounts: Record<ApplicationStatus, number>;
  responseRate: number;     // % of (interviewing + offer + rejected) / total
  interviewRate: number;    // % of interviewing / applied
  offerRate: number;        // % of offer / applied
  tailoringImpactMultiplier: number; // e.g., 1.45x boost
  weeklyVelocity: Array<{ week: string; count: number }>;
}
