import { NextRequest, NextResponse } from "next/server";
import { schemes } from "@/lib/schemes";

export async function POST(req: NextRequest) {
  try {
    const { sector, businessType, isWomanOwned, isStartup } = await req.json();

    const recommendations = schemes
      .map((scheme) => {
        let score = 40;
        let reasons: string[] = [];

        if (scheme.sector === sector || scheme.sector === "Any") {
          score += 25;
          reasons.push("Sector matches your business.");
        }

        if (scheme.businessType === businessType) {
          score += 20;
          reasons.push("Eligible for your business category.");
        }

        if (isWomanOwned && scheme.womenOnly) {
          score += 15;
          reasons.push("Extra benefits for women entrepreneurs.");
        }

        if (isStartup && scheme.startupOnly) {
          score += 15;
          reasons.push("Startup-specific government scheme.");
        }

        return {
          id: scheme.id,
          name: scheme.name,
          description: scheme.description,
          score,
          reason:
            reasons.length > 0
              ? reasons.join(" ")
              : "General MSME eligibility.",
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    return NextResponse.json({ recommendations }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate recommendations." },
      { status: 500 }
    );
  }
}