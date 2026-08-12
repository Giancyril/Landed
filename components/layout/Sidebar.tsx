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
  Gauge,
  Mic,
  DollarSign,
  BarChart3,
  LogOut,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const CORE_ITEMS = [
  { href: "/jobs", label: "Job Search", icon: Search },
  { href: "/resumes", label: "My Resumes", icon: FileText },
  { href: "/tailor", label: "Tailor Resume", icon: Wand2 },
  { href: "/cover-letter", label: "Cover Letter", icon: Mail },
  { href: "/tracker", label: "Tracker", icon: Kanban },
];

const ADVANCED_ITEMS = [
  { href: "/ats", label: "ATS Analyzer", icon: Gauge },
  { href: "/interview", label: "Interview Prep", icon: Mic },
  { href: "/negotiate", label: "Offer Advisor", icon: DollarSign },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    document.cookie = "landed_demo_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }
    router.push("/login");
    router.refresh();
  }

  return (
    <aside
      className="w-60 h-screen flex flex-col shrink-0 select-none"
      style={{
        background: "var(--surface-card)",
        borderRight: "1px solid var(--surface-border)",
      }}
    >
      {/* Brand Logo */}
      <div
        className="h-14 px-5 flex items-center gap-3 shrink-0"
        style={{ borderBottom: "1px solid var(--surface-border)" }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-md"
          style={{ background: "var(--accent-primary)" }}
        >
          <Briefcase size={15} color="#fff" strokeWidth={2.5} />
        </div>
        <div>
          <span className="text-sm font-bold tracking-tight block leading-none" style={{ color: "var(--content-primary)" }}>
            Landed
          </span>
          <span className="text-[10px] font-mono flex items-center gap-1 mt-0.5" style={{ color: "var(--accent-primary)" }}>
            AI Job Copilot
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {/* Core Suite */}
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest px-3 mb-2 font-semibold text-[var(--content-muted)]">
            Core Suite
          </div>
          <div className="space-y-1">
            {CORE_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 relative ${active
                      ? "bg-[var(--accent-primary)] text-white font-semibold shadow-sm"
                      : "text-[var(--content-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--content-primary)]"
                    }`}
                >
                  <Icon size={15} className={`shrink-0 ${active ? "text-white" : "text-[var(--content-muted)]"}`} />
                  <span className="flex-1">{label}</span>
                  {active && <ChevronRight size={13} className="opacity-80" />}
                </Link>
              );
            })}
          </div>
        </div>

        {/* AI Copilot Intelligence */}
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest px-3 mb-2 font-semibold text-[var(--content-muted)]">
            AI Intelligence
          </div>
          <div className="space-y-1">
            {ADVANCED_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 relative ${active
                      ? "bg-[var(--accent-primary)] text-white font-semibold shadow-sm"
                      : "text-[var(--content-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--content-primary)]"
                    }`}
                >
                  <Icon size={15} className={`shrink-0 ${active ? "text-white" : "text-[var(--content-muted)]"}`} />
                  <span className="flex-1">{label}</span>
                  {active && <ChevronRight size={13} className="opacity-80" />}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Bottom Signout */}
      <div className="px-3 py-3 shrink-0" style={{ borderTop: "1px solid var(--surface-border)" }}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[var(--content-muted)] hover:bg-[var(--surface-elevated)] hover:text-rose-400 transition-all duration-150"
        >
          <LogOut size={15} className="shrink-0" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}

