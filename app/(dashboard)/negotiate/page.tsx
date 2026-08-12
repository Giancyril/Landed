"use client";

import { useState } from "react";
import CompensationInputForm from "@/components/negotiate/CompensationInputForm";
import CompensationBreakdownCard from "@/components/negotiate/CompensationBreakdownCard";
import NegotiationScriptGenerator from "@/components/negotiate/NegotiationScriptGenerator";
import { calculateCompensation, CompensationBreakdown } from "@/lib/compensation/calculator";
import { NegotiationScript } from "@/types";
import { DollarSign, AlertCircle, RefreshCw } from "lucide-react";

interface EvaluationResult {
  id: string;
  breakdown: CompensationBreakdown;
  jobTitle: string;
  company: string;
  notes: string;
}

export default function NegotiatePage() {
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [baseSalary, setBaseSalary] = useState("");
  const [bonus, setBonus] = useState("0");
  const [equityValue, setEquityValue] = useState("0");
  const [signingBonus, setSigningBonus] = useState("0");
  const [remoteAllowance, setRemoteAllowance] = useState("0");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/negotiation/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle,
          company,
          baseSalary: Number(baseSalary),
          bonus: Number(bonus || 0),
          equityValue: Number(equityValue || 0),
          signingBonus: Number(signingBonus || 0),
          remoteAllowance: Number(remoteAllowance || 0),
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to evaluate offer");

      const breakdown = calculateCompensation({
        baseSalary: Number(baseSalary),
        bonus: Number(bonus || 0),
        equityValue: Number(equityValue || 0),
        signingBonus: Number(signingBonus || 0),
        remoteAllowance: Number(remoteAllowance || 0),
      });

      setEvaluationResult({
        id: data.evaluation.id,
        breakdown,
        jobTitle,
        company,
        notes,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-full mx-auto space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2.5 text-[var(--content-primary)]">
          <DollarSign size={22} className="text-[var(--accent-primary)]" />
          Offer & Salary Negotiation Advisor
        </h1>
        <p className="text-xs text-[var(--content-secondary)] mt-1">
          Evaluate your total compensation package, benchmark each component, and generate a professional counter-offer email.
        </p>
      </div>

      {/* Form Phase */}
      {!evaluationResult && (
        <>
          <CompensationInputForm
            jobTitle={jobTitle} setJobTitle={setJobTitle}
            company={company} setCompany={setCompany}
            baseSalary={baseSalary} setBaseSalary={setBaseSalary}
            bonus={bonus} setBonus={setBonus}
            equityValue={equityValue} setEquityValue={setEquityValue}
            signingBonus={signingBonus} setSigningBonus={setSigningBonus}
            remoteAllowance={remoteAllowance} setRemoteAllowance={setRemoteAllowance}
            notes={notes} setNotes={setNotes}
            onSubmit={handleSubmit}
            loading={loading}
          />

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-[var(--status-rejected)] flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
        </>
      )}

      {/* Results Phase */}
      {evaluationResult && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => setEvaluationResult(null)}
              className="btn-ghost text-xs py-1.5 px-4 flex items-center gap-1.5"
            >
              <RefreshCw size={13} />
              Evaluate Another Offer
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CompensationBreakdownCard
              breakdown={evaluationResult.breakdown}
              jobTitle={evaluationResult.jobTitle}
              company={evaluationResult.company}
            />

            <NegotiationScriptGenerator
              evaluationId={evaluationResult.id}
              jobTitle={evaluationResult.jobTitle}
              company={evaluationResult.company}
              baseSalary={evaluationResult.breakdown.baseSalary}
              totalCompensation={evaluationResult.breakdown.totalCompensation}
              notes={evaluationResult.notes}
              onGenerated={(_script: NegotiationScript) => {}}
            />
          </div>
        </div>
      )}
    </div>
  );
}
