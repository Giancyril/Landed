import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getGeminiModel, parseGeminiJson } from "@/lib/ai/gemini";
import {
  COVER_LETTER_SYSTEM_PROMPT,
  buildCoverLetterUserPrompt,
} from "@/lib/ai/prompts/cover-letter-prompt";

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
    const { resumeId, jobId, jobTitle, company, jobDescription, customNotes } = body;

    if (!jobTitle || !company || !jobDescription) {
      return NextResponse.json(
        { error: "Missing required fields: jobTitle, company, jobDescription" },
        { status: 400 }
      );
    }

    // 1. Fetch base resume text
    let resumeQuery = supabase.from("resumes").select("*").eq("user_id", user.id);
    if (resumeId) {
      resumeQuery = resumeQuery.eq("id", resumeId);
    } else {
      resumeQuery = resumeQuery.eq("is_primary", true);
    }

    const { data: resumeList } = await resumeQuery;
    let baseResume = resumeList && resumeList.length > 0 ? resumeList[0] : null;

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
        { error: "No base resume found. Please upload a PDF/DOCX resume first." },
        { status: 404 }
      );
    }

    // 2. Call Gemini 1.5 Flash for anti-boilerplate cover letter
    const model = getGeminiModel();
    const prompt = buildCoverLetterUserPrompt(
      baseResume.extracted_text,
      jobTitle,
      company,
      jobDescription,
      customNotes
    );

    const result = await model.generateContent([
      { text: COVER_LETTER_SYSTEM_PROMPT },
      { text: prompt },
    ]);

    const responseText = result.response.text();
    const parsed = parseGeminiJson<{
      content: string;
      wordCount: number;
      keyHighlights: string[];
    }>(responseText);

    // 3. Persist record to Supabase Postgres 'cover_letters' table
    const { data: savedLetter, error: dbError } = await supabase
      .from("cover_letters")
      .insert({
        user_id: user.id,
        resume_id: baseResume.id,
        job_id: jobId || null,
        job_title: jobTitle,
        company,
        custom_notes: customNotes || null,
        content: parsed.content,
      })
      .select()
      .single();

    if (dbError) {
      console.warn("[Postgres Save Warning]", dbError);
    }

    return NextResponse.json({
      coverLetter: {
        id: savedLetter?.id || "temp-id",
        userId: user.id,
        resumeId: baseResume.id,
        jobId,
        jobTitle,
        company,
        customNotes,
        content: parsed.content,
        wordCount: parsed.wordCount ?? parsed.content.split(/\s+/).length,
        keyHighlights: parsed.keyHighlights ?? [],
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error("[api/cover-letter/generate] Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate cover letter" },
      { status: 500 }
    );
  }
}
