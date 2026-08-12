/**
 * JSON Resume Schema transformer.
 * Converts Landed's TailoredResume + base Resume into the open JSON Resume standard.
 * Spec: https://jsonresume.org/schema/
 */

export interface JSONResumeBasics {
  name: string;
  email?: string;
  summary?: string;
}

export interface JSONResumeWorkItem {
  company: string;
  position?: string;
  highlights: string[];
}

export interface JSONResumeSchema {
  basics: JSONResumeBasics;
  work: JSONResumeWorkItem[];
  skills: Array<{ name: string; keywords: string[] }>;
  meta: {
    theme: string;
    lastModified: string;
    source: string;
  };
}

export function buildJSONResume(
  candidateName: string,
  candidateEmail: string,
  jobTitle: string,
  company: string,
  tailoredSummary: string,
  tailoredBullets: Array<{ section: string; tailored: string }>,
  matchedKeywords: string[]
): JSONResumeSchema {
  // Group bullets by section for work experience
  const sectionMap: Record<string, string[]> = {};
  for (const bullet of tailoredBullets) {
    const section = bullet.section || "Experience";
    if (!sectionMap[section]) sectionMap[section] = [];
    sectionMap[section].push(bullet.tailored);
  }

  const workItems: JSONResumeWorkItem[] = Object.entries(sectionMap).map(
    ([sectionName, bullets]) => ({
      company: sectionName,
      highlights: bullets,
    })
  );

  return {
    basics: {
      name: candidateName,
      email: candidateEmail,
      summary: tailoredSummary,
    },
    work: workItems,
    skills: [
      {
        name: `${jobTitle} at ${company} — Matched Skills`,
        keywords: matchedKeywords,
      },
    ],
    meta: {
      theme: "flat",
      lastModified: new Date().toISOString(),
      source: "Landed AI Job Search Copilot",
    },
  };
}

/**
 * Serializes a JSON Resume schema object to a pretty-printed JSON string.
 */
export function serializeJSONResume(schema: JSONResumeSchema): string {
  return JSON.stringify(schema, null, 2);
}
