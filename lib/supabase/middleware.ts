import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const isPlaceholderUrl = !supabaseUrl || supabaseUrl.includes("your-project.supabase.co");

  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/signup");

  const isDemoSession = request.cookies.get("landed_demo_session")?.value === "true";

  // If Supabase URL is placeholder or user activated demo session
  if (isPlaceholderUrl) {
    if (isDemoSession && isAuthPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/jobs";
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && !isDemoSession && !isAuthPage && request.nextUrl.pathname !== "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    if ((user || isDemoSession) && isAuthPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/jobs";
      return NextResponse.redirect(url);
    }
  } catch {
    // Graceful fallback
  }

  return supabaseResponse;
}
