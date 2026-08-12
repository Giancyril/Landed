import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getGeminiModel, parseGeminiJson } from "@/lib/ai/gemini";
import {
  NEGOTIATION_EMAIL_SYSTEM_PROMPT,
  buildNegotiationEmailUserPrompt,
} from "@/lib/ai/prompts/negotiation-prompt";

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
      evaluationId,
      jobTitle,
      company,
      baseSalary,
      totalCompensation,
      counterTarget,
      tone,
      candidateNotes,
    } = body;

    if (!jobTitle || !company || !baseSalary || !counterTarget || !tone) {
      return NextResponse.json(
        { error: "Missing required fields: jobTitle, company, baseSalary, counterTarget, tone" },
        { status: 400 }
      );
    }

    // Generate negotiation email via Gemini
    const model = getGeminiModel();
    const prompt = buildNegotiationEmailUserPrompt(
      jobTitle,
      company,
      Number(baseSalary),
      Number(totalCompensation),
      Number(counterTarget),
      tone,
      candidateNotes || ""
    );

    const result = await model.generateContent([
      { text: NEGOTIATION_EMAIL_SYSTEM_PROMPT },
      { text: prompt },
    ]);

    const responseText = result.response.text();
    const parsed = parseGeminiJson<{
      emailScript: string;
      justification: string;
    }>(responseText);

    // Persist to Supabase
    const { data: savedScript, error: dbError } = await supabase
      .from("negotiation_scripts")
      .insert({
        user_id: user.id,
        evaluation_id: evaluationId || null,
        tone,
        counter_target: Number(counterTarget),
        justification: parsed.justification,
        email_script: parsed.emailScript,
      })
      .select()
      .single();

    if (dbError) console.warn("[Postgres Save Warning]", dbError);

    return NextResponse.json({
      script: {
        id: savedScript?.id || "temp-script-id",
        userId: user.id,
        evaluationId: evaluationId || null,
        tone,
        counterTarget: Number(counterTarget),
        justification: parsed.justification,
        emailScript: parsed.emailScript,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error("[api/negotiation/script POST] Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate negotiation email" },
      { status: 500 }
    );
  }
}
