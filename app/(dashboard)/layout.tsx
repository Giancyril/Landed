import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isPlaceholderUrl = !supabaseUrl || supabaseUrl.includes("your-project.supabase.co");

  const cookieStore = await cookies();
  const isDemoSession = cookieStore.get("landed_demo_session")?.value === "true";

  let userEmail = "demo@landed.ai";

  if (!isPlaceholderUrl) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        userEmail = user.email || "user@landed.ai";
      } else if (!isDemoSession) {
        redirect("/login");
      }
    } catch {
      // Fallback on network/fetch error
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header userEmail={userEmail} />
        <main
          className="flex-1 overflow-y-auto"
          style={{ background: "var(--surface-page)" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
