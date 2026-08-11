import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getGeminiModel, parseGeminiJson } from "@/lib/ai/gemini";
import {
  RESUME_TAILOR_SYSTEM_PROMPT,
  buildTailorUserPrompt,
} from "@/lib/ai/prompts/tailor-prompt";

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
    const { resumeId, jobId, jobTitle, company, jobDescription } = body;

    if (!jobTitle || !company || !jobDescription) {
      return NextResponse.json(
        { error: "Missing required fields: jobTitle, company, jobDescription" },
        { status: 400 }
      );
    }

    // 1. Get Base Resume (specified resumeId or primary resume)
    let resumeQuery = supabase
      .from("resumes")
      .select("*")
      .eq("user_id", user.id);

    if (resumeId) {
      resumeQuery = resumeQuery.eq("id", resumeId);
    } else {
      resumeQuery = resumeQuery.eq("is_primary", true);
    }

    const { data: resumeList } = await resumeQuery;
    let baseResume = resumeList && resumeList.length > 0 ? resumeList[0] : null;

    // Fallback if no primary resume is flagged
    if (!baseResume) {
      const { data: fallbackList } = await supabase
        .from("resumes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (fallbackList && fallbackList.length > 0) {
        baseResume = fallbackList[0];
      }
    }

    if (!baseResume) {
      return NextResponse.json(
        {
          error:
            "No base resume found. Please upload a PDF or DOCX resume in the Resume Manager first.",
        },
        { status: 404 }
      );
    }

    // 2. Call Gemini 1.5 Flash to tailor resume
    const model = getGeminiModel();
    const prompt = buildTailorUserPrompt(
      baseResume.extracted_text,
      jobTitle,
      company,
      jobDescription
    );

    const result = await model.generateContent([
      { text: RESUME_TAILOR_SYSTEM_PROMPT },
      { text: prompt },
    ]);

    const responseText = result.response.text();
    const parsedData = parseGeminiJson<{
      tailoredSummary: string;
      diffBullets: Array<{
        section: string;
        original: string;
        tailored: string;
        reasoning: string;
      }>;
      matchedKeywords: string[];
      missingKeywords: string[];
    }>(responseText);

    // 3. Persist record to Supabase Postgres 'tailored_resumes' table
    const { data: savedTailored, error: dbError } = await supabase
      .from("tailored_resumes")
      .insert({
        user_id: user.id,
        resume_id: baseResume.id,
        job_id: jobId || null,
        job_title: jobTitle,
        company,
        job_description: jobDescription,
        tailored_summary: parsedData.tailoredSummary,
        diff_json: parsedData.diffBullets,
        matched_keywords: parsedData.matchedKeywords ?? [],
        missing_keywords: parsedData.missingKeywords ?? [],
      })
      .select()
      .single();

    if (dbError) {
      console.warn("[Postgres Save Warning]", dbError);
    }

    return NextResponse.json({
      tailoredResume: {
        id: savedTailored?.id || "temp-id",
        userId: user.id,
        resumeId: baseResume.id,
        jobId,
        jobTitle,
        company,
        jobDescription,
        tailoredSummary: parsedData.tailoredSummary,
        diffBullets: parsedData.diffBullets,
        matchedKeywords: parsedData.matchedKeywords ?? [],
        missingKeywords: parsedData.missingKeywords ?? [],
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error("[api/resume/tailor] Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to tailor resume" },
      { status: 500 }
    );
  }
}
