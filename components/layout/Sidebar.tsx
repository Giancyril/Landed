"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Briefcase,
  Search,
  FileText,
  Wand2,
  Mail,
  Kanban,
  LogOut,
  ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/jobs",         label: "Job Search",     icon: Search,   desc: "Browse live postings" },
  { href: "/resumes",      label: "My Resumes",     icon: FileText, desc: "Upload & manage base resumes" },
  { href: "/tailor",       label: "Tailor Resume",  icon: Wand2,    desc: "AI resume keyword matching" },
  { href: "/cover-letter", label: "Cover Letter",   icon: Mail,     desc: "Generate human-tone letters" },
  { href: "/tracker",      label: "Tracker",        icon: Kanban,   desc: "Kanban application board" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside
      className="w-60 h-screen flex flex-col shrink-0"
      style={{
        background: "var(--surface-card)",
        borderRight: "1px solid var(--surface-border)",
      }}
    >
      {/* Logo */}
      <div
        className="px-5 py-5 flex items-center gap-3"
        style={{ borderBottom: "1px solid var(--surface-border)" }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "var(--accent-primary)" }}
        >
          <Briefcase size={15} color="#fff" strokeWidth={2.5} />
        </div>
        <div>
          <span className="text-sm font-bold tracking-tight block leading-none" style={{ color: "var(--content-primary)" }}>
            Landed
          </span>
          <span className="text-[10px] font-mono" style={{ color: "var(--accent-primary)" }}>
            AI Job Copilot
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-mono uppercase tracking-widest px-3 mb-2" style={{ color: "var(--content-muted)" }}>
          Workspace
        </div>

        {NAV_ITEMS.map(({ href, label, icon: Icon, desc }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group"
              style={
                active
                  ? {
                      background: "var(--accent-primary)",
                      color: "#fff",
                      boxShadow: "0 2px 10px rgba(16,185,129,0.3)",
                    }
                  : { color: "var(--content-secondary)" }
              }
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "var(--surface-elevated)";
                  (e.currentTarget as HTMLElement).style.color = "var(--content-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "";
                  (e.currentTarget as HTMLElement).style.color = "var(--content-secondary)";
                }
              }}
            >
              <Icon size={16} className="shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={13} className="opacity-70" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Divider + Logout */}
      <div className="px-3 pb-5 pt-3" style={{ borderTop: "1px solid var(--surface-border)" }}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200"
          style={{ color: "var(--content-muted)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "var(--surface-elevated)";
            (e.currentTarget as HTMLElement).style.color = "var(--status-rejected)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "";
            (e.currentTarget as HTMLElement).style.color = "var(--content-muted)";
          }}
        >
          <LogOut size={16} className="shrink-0" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
