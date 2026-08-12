"use client";

import { useState } from "react";
import { NegotiationScript } from "@/types";
import { formatSalary, deriveTargetRange } from "@/lib/compensation/calculator";
import { Mail, Copy, Check, Loader2, Target } from "lucide-react";

const TONES = ["Collaborative", "Firm & Competitive", "Direct Executive"] as const;
type Tone = (typeof TONES)[number];

interface NegotiationScriptGeneratorProps {
  evaluationId: string;
  jobTitle: string;
  company: string;
  baseSalary: number;
  totalCompensation: number;
  notes: string;
  onGenerated: (script: NegotiationScript) => void;
}

export default function NegotiationScriptGenerator({
  evaluationId,
  jobTitle,
  company,
  baseSalary,
  totalCompensation,
  notes,
  onGenerated,
}: NegotiationScriptGeneratorProps) {
  const [tone, setTone] = useState<Tone>("Collaborative");
  const [counterTarget, setCounterTarget] = useState<string>(
    String(deriveTargetRange(baseSalary, "Collaborative").target)
  );
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [script, setScript] = useState<NegotiationScript | null>(null);
  const [copied, setCopied] = useState(false);

  const range = deriveTargetRange(baseSalary, tone);

  function handleToneChange(newTone: Tone) {
    setTone(newTone);
    setCounterTarget(String(deriveTargetRange(baseSalary, newTone).target));
    setScript(null);
  }

  async function handleGenerate() {
    setGenerating(true);
    setError(null);
    setScript(null);

    try {
      const res = await fetch("/api/negotiation/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          evaluationId,
          jobTitle,
          company,
          baseSalary,
          totalCompensation,
          counterTarget: Number(counterTarget),
          tone,
          candidateNotes: notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate email");

      setScript(data.script);
      onGenerated(data.script);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  function handleCopy() {
    if (script) {
      navigator.clipboard.writeText(script.emailScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="card p-6 space-y-5">
      <div className="flex items-center gap-2 pb-3 border-b border-[var(--surface-border)]">
        <Mail size={18} className="text-[var(--accent-primary)]" />
        <h3 className="text-sm font-bold text-[var(--content-primary)]">
          AI Negotiation Email Generator
        </h3>
      </div>

      {/* Tone Selector */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-[var(--content-muted)] font-semibold">
          Negotiation Tone
        </label>
        <div className="flex flex-wrap gap-2">
          {TONES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleToneChange(t)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold border transition-all ${
                tone === t
                  ? "bg-[var(--accent-primary)] border-transparent text-white shadow-md"
                  : "bg-[var(--surface-input)] border-[var(--surface-border)] text-[var(--content-secondary)] hover:border-[var(--accent-primary)]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Counter Target Amount */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-[var(--content-muted)] font-semibold flex items-center gap-2">
          <Target size={13} />
          Counter-Offer Target (Base Salary)
        </label>

        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--content-muted)] font-mono text-sm">$</span>
            <input
              type="number"
              value={counterTarget}
              onChange={(e) => setCounterTarget(e.target.value)}
              className="input-field pl-8 text-sm font-mono"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-[var(--content-muted)]">
          <span>Suggested range for <strong className="text-[var(--content-primary)]">{tone}</strong>:</span>
          <span className="text-[var(--accent-primary)]">
            {formatSalary(range.low)} – {formatSalary(range.high)}
          </span>
        </div>
      </div>

      {/* Generate Button */}
      {!script && (
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full btn-primary text-xs py-3 flex items-center justify-center gap-2"
        >
          {generating ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Generating Negotiation Email...
            </>
          ) : (
            <>
              <Mail size={15} />
              Generate Counter-Offer Email
            </>
          )}
        </button>
      )}

      {error && (
        <div className="p-3 rounded-xl text-xs bg-rose-500/10 border border-rose-500/20 text-[var(--status-rejected)]">
          {error}
        </div>
      )}

      {/* Generated Email */}
      {script && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono text-[var(--content-muted)]">
              <span className="font-semibold text-[var(--accent-primary)]">{tone}</span> counter-offer email
            </div>
            <div className="flex gap-2">
              <button onClick={handleCopy} className="btn-ghost text-xs py-1 px-3 flex items-center gap-1">
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Copied" : "Copy Email"}
              </button>
              <button onClick={() => setScript(null)} className="btn-ghost text-xs py-1 px-3">
                Regenerate
              </button>
            </div>
          </div>

          <pre className="text-xs font-mono text-[var(--content-primary)] leading-relaxed whitespace-pre-wrap p-4 bg-[var(--surface-input)] rounded-xl border border-[var(--surface-border)] max-h-72 overflow-y-auto">
            {script.emailScript}
          </pre>

          <p className="text-[11px] italic text-[var(--content-muted)] bg-[var(--surface-input)] px-3 py-2 rounded-lg border border-[var(--surface-border)]">
            💡 Strategy: {script.justification}
          </p>
        </div>
      )}
    </div>
  );
}
