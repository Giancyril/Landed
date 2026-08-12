import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateCompensation } from "@/lib/compensation/calculator";

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
      applicationId,
      company,
      jobTitle,
      baseSalary,
      bonus = 0,
      equityValue = 0,
      signingBonus = 0,
      remoteAllowance = 0,
      notes,
    } = body;

    if (!company || !jobTitle || !baseSalary) {
      return NextResponse.json(
        { error: "Missing required fields: company, jobTitle, baseSalary" },
        { status: 400 }
      );
    }

    const breakdown = calculateCompensation({
      baseSalary: Number(baseSalary),
      bonus: Number(bonus),
      equityValue: Number(equityValue),
      signingBonus: Number(signingBonus),
      remoteAllowance: Number(remoteAllowance),
    });

    const { data: savedEval, error: dbError } = await supabase
      .from("offer_evaluations")
      .insert({
        user_id: user.id,
        application_id: applicationId || null,
        company,
        job_title: jobTitle,
        base_salary: breakdown.baseSalary,
        bonus: breakdown.bonus,
        equity_value: breakdown.equityValue,
        signing_bonus: breakdown.signingBonus,
        remote_allowance: breakdown.remoteAllowance,
        total_compensation: breakdown.totalCompensation,
        notes: notes || null,
      })
      .select()
      .single();

    if (dbError) console.warn("[Postgres Save Warning]", dbError);

    return NextResponse.json({
      evaluation: {
        id: savedEval?.id || "temp-eval-id",
        userId: user.id,
        applicationId: applicationId || null,
        company,
        jobTitle,
        ...breakdown,
        notes: notes || null,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error("[api/negotiation/evaluate POST] Error:", err);
    return NextResponse.json({ error: err.message || "Failed to evaluate offer" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: evaluations, error } = await supabase
      .from("offer_evaluations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) throw error;

    return NextResponse.json({ evaluations: evaluations ?? [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
