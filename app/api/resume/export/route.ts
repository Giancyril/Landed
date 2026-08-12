import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  generateMarkdownResume,
  generatePlainTextResume,
} from "@/lib/resume/export";
import { buildJSONResume, serializeJSONResume } from "@/lib/resume/json-resume";

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
    const {
      tailoredResumeId,
      format,   // "markdown" | "plaintext" | "json"
      candidateName,
    } = body;

    if (!tailoredResumeId || !format) {
      return NextResponse.json(
        { error: "Missing required fields: tailoredResumeId, format" },
        { status: 400 }
      );
    }

    // Fetch tailored resume from DB
    const { data: tailored, error: fetchError } = await supabase
      .from("tailored_resumes")
      .select("*")
      .eq("id", tailoredResumeId)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !tailored) {
      return NextResponse.json(
        { error: "Tailored resume not found." },
        { status: 404 }
      );
    }

    // Fetch profile for candidate email
    const { data: profile } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", user.id)
      .single();

    const name = candidateName || profile?.full_name || "Candidate";
    const email = profile?.email || user.email || "";
    const bullets: Array<{ section: string; original: string; tailored: string }> =
      Array.isArray(tailored.diff_json) ? tailored.diff_json : [];

    let content = "";
    let mimeType = "text/plain";
    let extension = "txt";

    if (format === "markdown") {
      content = generateMarkdownResume(
        name,
        tailored.job_title,
        tailored.company,
        tailored.tailored_summary,
        bullets as any,
        tailored.matched_keywords ?? [],
        tailored.missing_keywords ?? []
      );
      mimeType = "text/markdown";
      extension = "md";
    } else if (format === "plaintext") {
      content = generatePlainTextResume(
        name,
        tailored.job_title,
        tailored.company,
        tailored.tailored_summary,
        bullets as any
      );
      mimeType = "text/plain";
      extension = "txt";
    } else if (format === "json") {
      const schema = buildJSONResume(
        name,
        email,
        tailored.job_title,
        tailored.company,
        tailored.tailored_summary,
        bullets.map((b) => ({ section: b.section, tailored: b.tailored })),
        tailored.matched_keywords ?? []
      );
      content = serializeJSONResume(schema);
      mimeType = "application/json";
      extension = "json";
    } else {
      return NextResponse.json({ error: "Unsupported export format." }, { status: 400 });
    }

    const filename = `${name.replace(/\s+/g, "_")}_${tailored.job_title.replace(/\s+/g, "_")}_tailored.${extension}`;

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": `${mimeType}; charset=utf-8`,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err: any) {
    console.error("[api/resume/export POST] Error:", err);
    return NextResponse.json({ error: err.message || "Export failed" }, { status: 500 });
  }
}
