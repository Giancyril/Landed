import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ApplicationStatus, AnalyticsMetrics } from "@/types";

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
      .select("status, tailored_resume_id, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) throw error;

    const list = applications ?? [];
    const total = list.length;

    // Stage counts
    const stageCounts: Record<ApplicationStatus, number> = {
      saved: 0,
      applied: 0,
      interviewing: 0,
      offer: 0,
      rejected: 0,
      withdrawn: 0,
    };
    for (const app of list) {
      const s = app.status as ApplicationStatus;
      if (stageCounts[s] !== undefined) stageCounts[s]++;
    }

    // Response rate = (interviewing + offer + rejected) / applied×100
    const applied = stageCounts.applied + stageCounts.interviewing + stageCounts.offer + stageCounts.rejected;
    const responded = stageCounts.interviewing + stageCounts.offer + stageCounts.rejected;
    const responseRate = applied > 0 ? parseFloat(((responded / applied) * 100).toFixed(1)) : 0;

    // Interview rate
    const interviewRate = applied > 0 ? parseFloat(((stageCounts.interviewing + stageCounts.offer) / applied * 100).toFixed(1)) : 0;

    // Offer rate
    const offerRate = applied > 0 ? parseFloat((stageCounts.offer / applied * 100).toFixed(1)) : 0;

    // Tailoring impact: compare response rate for tailored vs non-tailored
    const tailoredApps = list.filter((a) =>
      a.tailored_resume_id &&
      ["interviewing", "offer", "rejected"].includes(a.status)
    ).length;
    const tailoredTotal = list.filter((a) => a.tailored_resume_id).length;
    const untailoredRespondedTotal = responded - tailoredApps;
    const untailoredTotal = applied - tailoredTotal;

    const tailoredResponseRate = tailoredTotal > 0 ? tailoredApps / tailoredTotal : 0;
    const untailoredResponseRate = untailoredTotal > 0 ? untailoredRespondedTotal / untailoredTotal : 0;
    const tailoringImpactMultiplier =
      untailoredResponseRate > 0
        ? parseFloat((tailoredResponseRate / untailoredResponseRate).toFixed(2))
        : 1.0;

    // Weekly velocity (last 8 weeks)
    const weeklyVelocity: Array<{ week: string; count: number }> = [];
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - i * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      const label = weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const count = list.filter((a) => {
        const d = new Date(a.created_at);
        return d >= weekStart && d < weekEnd;
      }).length;

      weeklyVelocity.push({ week: label, count });
    }

    const metrics: AnalyticsMetrics = {
      totalApplications: total,
      stageCounts,
      responseRate,
      interviewRate,
      offerRate,
      tailoringImpactMultiplier,
      weeklyVelocity,
    };

    return NextResponse.json({ metrics });
  } catch (err: any) {
    console.error("[api/analytics/metrics] Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
