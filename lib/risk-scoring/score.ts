// lib/risk-scoring/score.ts
// TEMPORARY STUB — Member 5 will replace this with the real formula.
// Signature must NOT change when they do.

type RiskInput = {
  sectorHazard: number;
  historyPenalty: number;
  docQualityScore: number;
  locationSensitivity: number;
  complexity: number;
};

export function computeRiskScore(input: RiskInput): number {
  return 50;
}