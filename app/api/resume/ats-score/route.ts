import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getGeminiModel, parseGeminiJson } from "@/lib/ai/gemini";
import {
  ATS_ANALYZER_SYSTEM_PROMPT,
  buildATSUserPrompt,
} from "@/lib/ai/prompts/ats-prompt";

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
    const { resumeId, jobTitle, company, jobDescription } = body;

    if (!jobTitle || !company || !jobDescription) {
      return NextResponse.json(
        { error: "Missing required fields: jobTitle, company, jobDescription" },
        { status: 400 }
      );
    }

    // 1. Retrieve resume text
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

    // 2. Execute Gemini ATS score analysis
    const model = getGeminiModel();
    const prompt = buildATSUserPrompt(
      baseResume.extracted_text,
      jobTitle,
      company,
      jobDescription
    );

    const result = await model.generateContent([
      { text: ATS_ANALYZER_SYSTEM_PROMPT },
      { text: prompt },
    ]);

    const responseText = result.response.text();
    const parsed = parseGeminiJson<{
      overallScore: number;
      keywordScore: number;
      skillsScore: number;
      readabilityScore: number;
      relevanceScore: number;
      breakdown: {
        keywordDensity: string;
        techStackCoverage: string;
        formattingNotes: string;
        relevanceSummary: string;
      };
      matchedKeywords: string[];
      missingKeywords: string[];
      recommendations: string[];
    }>(responseText);

    // 3. Persist record to Supabase Postgres 'ats_analyses' table
    const { data: savedAnalysis, error: dbError } = await supabase
      .from("ats_analyses")
      .insert({
        user_id: user.id,
        resume_id: baseResume.id,
        job_title: jobTitle,
        company,
        job_description: jobDescription,
        overall_score: parsed.overallScore,
        keyword_score: parsed.keywordScore,
        skills_score: parsed.skillsScore,
        readability_score: parsed.readabilityScore,
        relevance_score: parsed.relevanceScore,
        breakdown_json: parsed.breakdown,
        matched_keywords: parsed.matchedKeywords ?? [],
        missing_keywords: parsed.missingKeywords ?? [],
        recommendations: parsed.recommendations ?? [],
      })
      .select()
      .single();

    if (dbError) {
      console.warn("[Postgres Save Warning]", dbError);
    }

    return NextResponse.json({
      analysis: {
        id: savedAnalysis?.id || "temp-id",
        userId: user.id,
        resumeId: baseResume.id,
        jobTitle,
        company,
        jobDescription,
        overallScore: parsed.overallScore,
        keywordScore: parsed.keywordScore,
        skillsScore: parsed.skillsScore,
        readabilityScore: parsed.readabilityScore,
        relevanceScore: parsed.relevanceScore,
        breakdown: parsed.breakdown,
        matchedKeywords: parsed.matchedKeywords ?? [],
        missingKeywords: parsed.missingKeywords ?? [],
        recommendations: parsed.recommendations ?? [],
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error("[api/resume/ats-score] Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to calculate ATS score" },
      { status: 500 }
    );
  }
}
