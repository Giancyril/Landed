import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: applications, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ applications });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

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
    const { jobTitle, company, location, salaryInfo, sourceUrl, status = "saved", notes } = body;

    if (!jobTitle || !company) {
      return NextResponse.json(
        { error: "Missing required fields: jobTitle, company" },
        { status: 400 }
      );
    }

    const { data: application, error } = await supabase
      .from("applications")
      .insert({
        user_id: user.id,
        job_title: jobTitle,
        company,
        location,
        salary_info: salaryInfo,
        source_url: sourceUrl,
        status,
        notes,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ application }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
