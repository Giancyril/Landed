import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getGeminiModel, parseGeminiJson } from "@/lib/ai/gemini";
import {
  INTERVIEW_QUESTION_SYSTEM_PROMPT,
  buildInterviewQuestionsUserPrompt,
} from "@/lib/ai/prompts/interview-prompt";
import { InterviewQuestion } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { applicationId, jobTitle, company, jobDescription } = body;

    if (!jobTitle || !company || !jobDescription) {
      return NextResponse.json(
        { error: "Missing required fields: jobTitle, company, jobDescription" },
        { status: 400 }
      );
    }

    // 1. Call Gemini to generate interview questions
    const model = getGeminiModel();
    const prompt = buildInterviewQuestionsUserPrompt(jobTitle, company, jobDescription);

    const result = await model.generateContent([
      { text: INTERVIEW_QUESTION_SYSTEM_PROMPT },
      { text: prompt },
    ]);

    const responseText = result.response.text();
    const parsed = parseGeminiJson<{ questions: InterviewQuestion[] }>(responseText);

    // 2. Persist session to Supabase Postgres 'interview_sessions' table
    const { data: savedSession, error: dbError } = await supabase
      .from("interview_sessions")
      .insert({
        user_id: user.id,
        application_id: applicationId || null,
        job_title: jobTitle,
        company,
        job_description: jobDescription,
        questions_json: parsed.questions,
      })
      .select()
      .single();

    if (dbError) {
      console.warn("[Postgres Save Warning]", dbError);
    }

    return NextResponse.json({
      session: {
        id: savedSession?.id || "temp-session-id",
        userId: user.id,
        applicationId,
        jobTitle,
        company,
        jobDescription,
        questions: parsed.questions,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error("[api/interview/generate] Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate interview questions" },
      { status: 500 }
    );
  }
}
