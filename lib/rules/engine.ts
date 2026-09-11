export type BusinessProfile = {
  name: string;
  sector: string;
  district: string;
  state?: string;
};

export type RuleResult = {
  requirementCodes: string[];
};

export function evaluateRules(
  business: BusinessProfile
): RuleResult {
  const requirements = new Set<string>();

  // Common requirements
  requirements.add("UDYAM");
  requirements.add("GST");

  // Food-related businesses
  if (
    business.sector.toLowerCase().includes("food") ||
    business.sector.toLowerCase().includes("food processing")
  ) {
    requirements.add("FSSAI");
  }

  // Manufacturing-related businesses
  if (
    business.sector.toLowerCase().includes("manufacturing")
  ) {
    requirements.add("FACTORY_LICENSE");
  }

  return {
    requirementCodes: Array.from(requirements),
  };
}