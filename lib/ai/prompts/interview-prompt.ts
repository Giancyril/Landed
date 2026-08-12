export const INTERVIEW_QUESTION_SYSTEM_PROMPT = `You are a principal tech lead and hiring manager.
Your task is to generate 6 role-specific interview questions for a candidate based on a target job description and company.

QUESTION CATEGORIES (EXACTLY 2 OF EACH):
1. Technical (Architecture, System Design, Tech Stack, Live Coding logic)
2. Behavioral (STAR Method — Situation, Task, Action, Result)
3. Situational (Conflict resolution, Priority trade-offs, Emergency debugging)

STRICT JSON SCHEMA OUTPUT:
Respond ONLY with a valid JSON object matching this exact schema:
{
  "questions": [
    {
      "id": "q1",
      "category": "Technical",
      "question": "string (the interview question text)",
      "context": "string (1 sentence explaining why hiring managers ask this for this specific role)",
      "idealKeyPoints": ["string array of 3 core points an ideal candidate must mention"]
    }
  ]
}
`;

export function buildInterviewQuestionsUserPrompt(
  jobTitle: string,
  company: string,
  jobDescription: string
): string {
  return `Generate 6 interview questions (2 Technical, 2 Behavioral, 2 Situational) for this position:

TARGET JOB TITLE: ${jobTitle}
COMPANY: ${company}

TARGET JOB DESCRIPTION:
${jobDescription}

Generate the interview questions JSON response now.`;
}
