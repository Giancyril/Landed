import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getGeminiModel, parseGeminiJson } from "@/lib/ai/gemini";
import {
  INTERVIEW_FEEDBACK_SYSTEM_PROMPT,
  buildInterviewFeedbackUserPrompt,
} from "@/lib/ai/prompts/interview-feedback-prompt";

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
    const { sessionId, jobTitle, company, question, category, userAnswer } = body;

    if (!question || !userAnswer || userAnswer.trim().length < 20) {
      return NextResponse.json(
        { error: "Please provide a substantial practice answer (at least 20 characters)." },
        { status: 400 }
      );
    }

    // 1. Evaluate practice answer via Gemini 1.5 Flash
    const model = getGeminiModel();
    const prompt = buildInterviewFeedbackUserPrompt(
      jobTitle || "Candidate",
      company || "Target Company",
      question,
      category || "General",
      userAnswer
    );

    const result = await model.generateContent([
      { text: INTERVIEW_FEEDBACK_SYSTEM_PROMPT },
      { text: prompt },
    ]);

    const responseText = result.response.text();
    const parsed = parseGeminiJson<{
      score: number;
      strengths: string[];
      areasToImprove: string[];
      improvedAnswerSample: string;
    }>(responseText);

    // 2. Persist answer and feedback to Supabase Postgres 'interview_answers' table if sessionId exists
    if (sessionId && sessionId !== "temp-session-id") {
      const { error: dbError } = await supabase.from("interview_answers").insert({
        session_id: sessionId,
        user_id: user.id,
        question,
        category: category || "General",
        user_answer: userAnswer,
        feedback_json: parsed,
        score: parsed.score,
      });

      if (dbError) {
        console.warn("[Postgres Save Warning]", dbError);
      }
    }

    return NextResponse.json({
      feedback: {
        sessionId,
        question,
        category,
        userAnswer,
        score: parsed.score,
        strengths: parsed.strengths ?? [],
        areasToImprove: parsed.areasToImprove ?? [],
        improvedAnswerSample: parsed.improvedAnswerSample,
      },
    });
  } catch (err: any) {
    console.error("[api/interview/feedback] Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to evaluate answer" },
      { status: 500 }
    );
  }
}
