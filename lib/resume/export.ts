import { TailoredBullet } from "@/types";

/**
 * Generates a Markdown-formatted tailored resume document.
 */
export function generateMarkdownResume(
  candidateName: string,
  jobTitle: string,
  company: string,
  tailoredSummary: string,
  tailoredBullets: TailoredBullet[],
  matchedKeywords: string[],
  missingKeywords: string[]
): string {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Group bullets by section
  const sectionMap: Record<string, TailoredBullet[]> = {};
  for (const bullet of tailoredBullets) {
    const section = bullet.section || "Experience";
    if (!sectionMap[section]) sectionMap[section] = [];
    sectionMap[section].push(bullet);
  }

  const sections = Object.entries(sectionMap)
    .map(([sectionName, bullets]) => {
      const bulletLines = bullets
        .map((b) => `- ${b.tailored}`)
        .join("\n");
      return `## ${sectionName}\n\n${bulletLines}`;
    })
    .join("\n\n---\n\n");

  return `# ${candidateName}
*Tailored for: ${jobTitle} at ${company}*
*Generated: ${today} via Landed AI Job Search Copilot*

---

## Professional Summary

${tailoredSummary}

---

${sections}

---

## Matched Keywords

${matchedKeywords.map((kw) => `\`${kw}\``).join(" · ")}

${missingKeywords.length > 0 ? `\n## Keywords to Add\n\n${missingKeywords.map((kw) => `\`${kw}\``).join(" · ")}` : ""}
`;
}

/**
 * Generates a plain-text version of the tailored resume.
 */
export function generatePlainTextResume(
  candidateName: string,
  jobTitle: string,
  company: string,
  tailoredSummary: string,
  tailoredBullets: TailoredBullet[]
): string {
  const sectionMap: Record<string, TailoredBullet[]> = {};
  for (const bullet of tailoredBullets) {
    const section = bullet.section || "Experience";
    if (!sectionMap[section]) sectionMap[section] = [];
    sectionMap[section].push(bullet);
  }

  const sections = Object.entries(sectionMap)
    .map(([sectionName, bullets]) => {
      const bulletLines = bullets.map((b) => `  • ${b.tailored}`).join("\n");
      return `${sectionName.toUpperCase()}\n${"─".repeat(40)}\n${bulletLines}`;
    })
    .join("\n\n");

  return `${candidateName.toUpperCase()}
Tailored for: ${jobTitle} at ${company}
${"═".repeat(50)}

PROFESSIONAL SUMMARY
${"─".repeat(40)}
${tailoredSummary}

${sections}
`;
}

/**
 * Triggers a browser download of a text/blob content.
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType: "text/plain" | "application/json" | "text/markdown"
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
