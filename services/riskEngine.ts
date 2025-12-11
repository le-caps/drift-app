import { Deal, UserProfile } from "../types";

// Helper: normalize a value between 0 and 1
const normalize = (value: number, max: number) => {
  return Math.min(value / max, 1);
};

export const computeRiskScore = (deal: Deal, profile: UserProfile) => {
  const factors: string[] = [];

  // 1) Inactivity (0–1)
  const inactivityRisk = normalize(deal.daysInactive, profile.stalledThresholdDays * 2);
  if (deal.daysInactive > profile.stalledThresholdDays) {
    factors.push(`Inactive for ${deal.daysInactive} days`);
  }

  // 2) Stage (0–1)
  const riskyStages = ["Contract Sent", "Legal Review", "Negotiation", "Procurement"];
  const stageRisk = riskyStages.includes(deal.stage) ? 1 : 0.3;
  if (stageRisk > 0.5) {
    factors.push(`Deal is currently in a high-friction stage (${deal.stage})`);
  }

  // 3) Amount (0–1)
  const amountRisk = normalize(deal.amount, 100000); // normalize vs 100k for MVP
  if (deal.amount > 50000) {
    factors.push(`High-value deal ($${deal.amount.toLocaleString()})`);
  }

  // 4) Notes (0–1)
  const notes = deal.notes?.toLowerCase() || "";
  let notesRisk = 0;
  const riskKeywords = ["budget", "legal", "blocked", "delay", "stalled", "no response"];

  riskKeywords.forEach((k) => {
    if (notes.includes(k)) {
      notesRisk = 1;
      factors.push(`Notes mention a risk factor ("${k}")`);
    }
  });

  // --- WEIGHTED SCORE (0–100) ---
  const score =
    (inactivityRisk * profile.riskWeightInactivity +
      stageRisk * profile.riskWeightStage +
      amountRisk * profile.riskWeightAmount +
      notesRisk * profile.riskWeightNotes) *
    100;

  let riskLevel: "low" | "medium" | "high" = "low";
  if (score > 70) riskLevel = "high";
  else if (score > 40) riskLevel = "medium";

  return {
    score: Math.round(score),
    riskLevel,
    riskFactors: factors,
  };
};