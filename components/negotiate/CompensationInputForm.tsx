"use client";

import { DollarSign, TrendingUp, Briefcase, Gift, Laptop } from "lucide-react";
import { formatSalary } from "@/lib/compensation/calculator";

interface CompensationInputFormProps {
  jobTitle: string;
  setJobTitle: (v: string) => void;
  company: string;
  setCompany: (v: string) => void;
  baseSalary: string;
  setBaseSalary: (v: string) => void;
  bonus: string;
  setBonus: (v: string) => void;
  equityValue: string;
  setEquityValue: (v: string) => void;
  signingBonus: string;
  setSigningBonus: (v: string) => void;
  remoteAllowance: string;
  setRemoteAllowance: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export default function CompensationInputForm({
  jobTitle, setJobTitle,
  company, setCompany,
  baseSalary, setBaseSalary,
  bonus, setBonus,
  equityValue, setEquityValue,
  signingBonus, setSigningBonus,
  remoteAllowance, setRemoteAllowance,
  notes, setNotes,
  onSubmit,
  loading,
}: CompensationInputFormProps) {
  const totalPreview =
    (Number(baseSalary) || 0) +
    (Number(bonus) || 0) +
    (Number(equityValue) || 0) +
    (Number(signingBonus) || 0) +
    (Number(remoteAllowance) || 0);

  return (
    <form onSubmit={onSubmit} className="card p-6 space-y-6">
      {/* Role Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Job Title</label>
          <div className="input-icon-wrap">
            <Briefcase size={15} className="input-icon" />
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Senior Product Manager"
              required
              className="input-field text-sm"
            />
          </div>
        </div>

        <div>
          <label className="form-label">Company Name</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Shopify"
            required
            className="input-field text-sm"
          />
        </div>
      </div>

      {/* Compensation Fields */}
      <div>
        <div className="section-title">
          Compensation Breakdown
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Base Salary ($/yr)", val: baseSalary, set: setBaseSalary, icon: DollarSign },
            { label: "Annual Bonus ($/yr)", val: bonus, set: setBonus, icon: TrendingUp },
            { label: "Equity Grant ($/yr)", val: equityValue, set: setEquityValue, icon: Gift },
            { label: "Signing Bonus ($)", val: signingBonus, set: setSigningBonus, icon: Laptop },
          ].map(({ label, val, set, icon: Icon }) => (
            <div key={label}>
              <label className="form-label">{label}</label>
              <div className="input-icon-wrap">
                <Icon size={14} className="input-icon" />
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={val || ""}
                  onChange={(e) => set(e.target.value)}
                  placeholder="0"
                  className="input-field text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Total Preview */}
      {totalPreview > 0 && (
        <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--accent-subtle)] border border-emerald-500/20">
          <div className="flex items-center gap-2 text-xs text-[var(--content-secondary)]">
            <TrendingUp size={15} className="text-[var(--accent-primary)]" />
            <span>Total Compensation Preview</span>
          </div>
          <span className="text-xl font-bold font-mono text-[var(--accent-primary)]">
            {formatSalary(totalPreview)}
          </span>
        </div>
      )}

      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-[var(--content-muted)] font-semibold mb-1.5">
          Negotiation Notes (Optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="e.g. I have a competing offer from another company at $150K base. Willing to accept faster start date in exchange for higher base."
          className="input-field text-xs font-mono leading-relaxed"
        />
      </div>

      <div className="flex justify-end pt-2 border-t border-[var(--surface-border)]">
        <button type="submit" disabled={loading} className="btn-primary text-xs py-2.5 px-6 flex items-center gap-2">
          <TrendingUp size={15} />
          Evaluate Offer Package
        </button>
      </div>
    </form>
  );
}
