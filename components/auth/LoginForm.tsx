"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Briefcase,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Gauge,
  Wand2,
  CheckCircle2,
} from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quick Demo Account Filler
  function handleFillDemo() {
    setEmail("demo@landed.ai");
    setPassword("Landed2026!Demo");
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      // If demo account doesn't exist yet, automatically attempt signup and retry
      if (email === "demo@landed.ai") {
        const { error: signupErr } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: "Executive Demo User" } },
        });

        if (!signupErr) {
          const { error: retryErr } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (!retryErr) {
            router.push("/jobs");
            router.refresh();
            return;
          }
        }
      }

      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/jobs");
    router.refresh();
  }

  return (
    <div className="min-h-screen w-full flex bg-[#070c19] text-[var(--content-primary)] font-sans antialiased overflow-hidden">
      {/* LEFT PANEL: Executive Hero Branding Showcase */}
      <div className="hidden lg:flex lg:w-7/12 relative flex-col justify-between p-12 bg-gradient-to-br from-[#0b1329] via-[#080e1f] to-[#040711] border-r border-[#1e293b]/60 overflow-hidden">
        {/* Ambient Grid Lines & Radial Blur */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Branding */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <span className="text-xl font-bold tracking-tight text-white block leading-none">
                Landed
              </span>
              <span className="text-[11px] font-mono text-emerald-400">
                AI Job Search Copilot
              </span>
            </div>
          </div>


        </div>

        {/* Hero Value Prop Content */}
        <div className="relative z-10 my-auto py-12 space-y-8 max-w-xl">


          <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Accelerate your career search with <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">AI Precision</span>.
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Tailor your resume bullet-by-bullet without fabrication, calculate ATS keyword match heatmaps, practice interview questions with real-time AI scoring, and manage applications in a 6-stage Kanban board.
          </p>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            {[
              { icon: Wand2, title: "Non-Fabrication Tailoring", desc: "No fake metrics or hallucinated titles" },
              { icon: Gauge, title: "ATS Heatmap Analyzer", desc: "Quantitative 0-100% match scoring" },
              { icon: Sparkles, title: "Anti-Boilerplate Cover Letters", desc: "Human tone with candidate note injection" },
              { icon: CheckCircle2, title: "Kanban Application Tracker", desc: "Optimistic status pipeline management" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm space-y-1">
                <Icon size={18} className="text-emerald-400 mb-1" />
                <div className="text-xs font-bold text-white">{title}</div>
                <div className="text-[11px] text-slate-400 leading-tight">{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Footer Quote */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Enterprise-grade executive career platform</span>
          <span className="text-emerald-400 font-semibold">v2.5.0 Production Ready</span>
        </div>
      </div>

      {/* RIGHT PANEL: Professional Authentication Form */}
      <div className="w-full lg:w-5/12 flex items-center justify-center p-6 sm:p-12 bg-[#070c19]">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Mobile Logo Header */}
          <div className="lg:hidden flex items-center gap-3 justify-center mb-6">
            <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Briefcase size={18} color="#fff" strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white block leading-none">
                Landed
              </span>
              <span className="text-[10px] font-mono text-emerald-400">
                AI Job Copilot
              </span>
            </div>
          </div>

          {/* Card Wrapper */}
          <div className="card p-8 sm:p-10 border-[#1e293b] bg-[#0b1329]/90 backdrop-blur-xl shadow-2xl space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Sign in to Landed
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Access your resumes, AI tailoring workspace, and Kanban tracker
              </p>
            </div>

            {/* Quick Demo Credentials Button */}
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="font-mono text-emerald-400 font-bold block">Quick Demo Account</span>
                <span className="text-[11px] text-slate-300">Click to fill test credentials instantly</span>
              </div>
              <button
                type="button"
                onClick={handleFillDemo}
                className="btn-primary text-[11px] py-1.5 px-3 rounded-lg font-mono flex items-center gap-1 shrink-0"
              >
                Auto-Fill Demo
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    autoComplete="email"
                    className="input-field pl-10 text-sm bg-[#070c19] border-[#1e293b] text-white focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    autoComplete="current-password"
                    className="input-field pl-10 pr-11 text-sm bg-[#070c19] border-[#1e293b] text-white focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In to Dashboard
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            {/* Signup Redirect Footer */}
            <div className="pt-4 border-t border-[#1e293b] text-center text-xs text-slate-400">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-semibold text-emerald-400 hover:underline">
                Create a free account
              </Link>
            </div>
          </div>

          {/* Security Sub-Footer */}
          <div className="text-center text-[11px] text-slate-500 font-mono">
            Protected by Supabase Auth & Row Level Security policies.
          </div>
        </div>
      </div>
    </div>
  );
}
