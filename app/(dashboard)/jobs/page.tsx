import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Search, FileText, Wand2, Mail, Kanban } from "lucide-react";
import Link from "next/link";

const QUICK_LINKS = [
  { href: "/jobs",         label: "Search Jobs",     icon: Search,       desc: "Find roles matching your skills" },
  { href: "/resumes",      label: "Upload Resume",   icon: FileText,     desc: "Upload your base resume PDF or DOCX" },
  { href: "/tailor",       label: "Tailor Resume",   icon: Wand2,        desc: "AI-tailored bullets for any job" },
  { href: "/cover-letter", label: "Cover Letter",    icon: Mail,         desc: "Generate a human-sounding letter" },
  { href: "/tracker",      label: "Tracker Board",   icon: Kanban,       desc: "Manage your applications" },
];

export default async function JobsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const firstName = profile?.full_name?.split(" ")[0] ?? "there";

  return (
    <div className="p-8 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--content-primary)" }}>
          Welcome back, {firstName} 👋
        </h1>
        <p className="text-base" style={{ color: "var(--content-secondary)" }}>
          Your AI-powered job search copilot is ready. What would you like to do today?
        </p>
      </div>

      {/* Quick action cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {QUICK_LINKS.map(({ href, label, icon: Icon, desc }) => (
          <Link
            key={href}
            href={href}
            className="card p-5 flex flex-col gap-3 group transition-all duration-200 hover:border-[var(--accent-primary)] hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: "var(--accent-subtle)" }}
            >
              <Icon size={20} style={{ color: "var(--accent-primary)" }} />
            </div>
            <div>
              <div className="font-semibold text-sm mb-1" style={{ color: "var(--content-primary)" }}>
                {label}
              </div>
              <div className="text-xs leading-relaxed" style={{ color: "var(--content-secondary)" }}>
                {desc}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
