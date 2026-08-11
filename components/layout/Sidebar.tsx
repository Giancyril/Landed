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
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/jobs",         label: "Job Search",     icon: Search },
  { href: "/resumes",      label: "My Resumes",     icon: FileText },
  { href: "/tailor",       label: "Tailor Resume",  icon: Wand2 },
  { href: "/cover-letter", label: "Cover Letter",   icon: Mail },
  { href: "/tracker",      label: "Tracker",        icon: Kanban },
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
      className="w-64 h-screen flex flex-col shrink-0"
      style={{
        background: "var(--surface-card)",
        borderRight: "1px solid var(--surface-border)",
      }}
    >
      {/* Logo */}
      <div
        className="px-5 py-5 flex items-center gap-2.5"
        style={{ borderBottom: "1px solid var(--surface-border)" }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "var(--accent-primary)" }}
        >
          <Briefcase size={16} color="#fff" strokeWidth={2.5} />
        </div>
        <span className="text-base font-bold tracking-tight" style={{ color: "var(--content-primary)" }}>
          Landed
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                active
                  ? "text-white"
                  : "hover:bg-[var(--surface-elevated)]"
              )}
              style={
                active
                  ? { background: "var(--accent-primary)" }
                  : { color: "var(--content-secondary)" }
              }
            >
              <Icon size={17} className="shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={14} className="opacity-70" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4" style={{ borderTop: "1px solid var(--surface-border)" }}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-[var(--surface-elevated)]"
          style={{ color: "var(--content-secondary)" }}
        >
          <LogOut size={17} className="shrink-0" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
