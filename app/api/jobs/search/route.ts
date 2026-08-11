import { NextRequest, NextResponse } from "next/server";
import { searchJobs } from "@/lib/jobs/adzuna";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") ?? undefined;
    const location = searchParams.get("location") ?? undefined;
    const remoteOnly = searchParams.get("remote") === "true";
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const country = searchParams.get("country") ?? "us";

    const result = await searchJobs({ query, location, remoteOnly, page, country });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[api/jobs/search] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch job postings" },
      { status: 500 }
    );
  }
}
