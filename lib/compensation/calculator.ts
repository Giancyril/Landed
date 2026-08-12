/**
 * Compensation calculator utilities for the Offer & Negotiation Advisor.
 */

export interface CompensationInputs {
  baseSalary: number;
  bonus: number;          // annual bonus (flat amount)
  equityValue: number;    // annual vesting value
  signingBonus: number;
  remoteAllowance: number; // annual remote/equipment stipend
}

export interface CompensationBreakdown {
  totalCompensation: number;
  baseSalary: number;
  bonus: number;
  equityValue: number;
  signingBonus: number;
  remoteAllowance: number;
  bonusPercent: number;      // bonus as % of base
  equityPercent: number;     // equity as % of base
  nonCashTotal: number;      // everything except base
  nonCashPercent: number;    // non-cash as % of total comp
}

/**
 * Calculates total compensation breakdown from offer inputs.
 */
export function calculateCompensation(
  inputs: CompensationInputs
): CompensationBreakdown {
  const {
    baseSalary,
    bonus,
    equityValue,
    signingBonus,
    remoteAllowance,
  } = inputs;

  const totalCompensation = baseSalary + bonus + equityValue + signingBonus + remoteAllowance;
  const nonCashTotal = bonus + equityValue + signingBonus + remoteAllowance;

  return {
    totalCompensation,
    baseSalary,
    bonus,
    equityValue,
    signingBonus,
    remoteAllowance,
    bonusPercent: baseSalary > 0 ? parseFloat(((bonus / baseSalary) * 100).toFixed(1)) : 0,
    equityPercent: baseSalary > 0 ? parseFloat(((equityValue / baseSalary) * 100).toFixed(1)) : 0,
    nonCashTotal,
    nonCashPercent: totalCompensation > 0 ? parseFloat(((nonCashTotal / totalCompensation) * 100).toFixed(1)) : 0,
  };
}

/**
 * Formats a dollar amount in compact notation (e.g. $135,000 → $135K).
 */
export function formatSalary(amount: number): string {
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(0)}K`;
  }
  return `$${amount.toFixed(0)}`;
}

/**
 * Derives a suggested market range based on job title keywords and seniority.
 * Simple heuristic; the real benchmarking is done server-side via Gemini.
 */
export function deriveTargetRange(
  baseSalary: number,
  tone: string
): { low: number; target: number; high: number } {
  const multipliers = {
    "Collaborative": { low: 1.05, target: 1.10, high: 1.15 },
    "Firm & Competitive": { low: 1.10, target: 1.18, high: 1.25 },
    "Direct Executive": { low: 1.15, target: 1.22, high: 1.30 },
  };

  const m = multipliers[tone as keyof typeof multipliers] ?? multipliers["Collaborative"];

  return {
    low: Math.round(baseSalary * m.low),
    target: Math.round(baseSalary * m.target),
    high: Math.round(baseSalary * m.high),
  };
}
