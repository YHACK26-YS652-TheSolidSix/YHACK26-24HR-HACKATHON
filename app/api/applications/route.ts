// app/api/applications/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeRiskScore } from "@/lib/risk-scoring/score";

// POST /api/applications
// body: { checklistItemId: string }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { checklistItemId } = body;

    if (!checklistItemId) {
      return NextResponse.json(
        { error: "checklistItemId is required" },
        { status: 400 }
      );
    }

    // The Application model needs businessId too, but the client only
    // sends checklistItemId — so we look it up via the checklist relation.
    const checklistItem = await prisma.checklistItem.findUnique({
      where: { id: checklistItemId },
      include: { checklist: true },
    });

    if (!checklistItem) {
      return NextResponse.json(
        { error: "Checklist item not found" },
        { status: 404 }
      );
    }

    const businessId = checklistItem.checklist.businessId;

    // Stub for now — Member 5 will replace the real formula later.
    const riskScore = computeRiskScore({
      sectorHazard: 50,
      historyPenalty: 50,
      docQualityScore: 100,
      locationSensitivity: 50,
      complexity: 50,
    });

    const application = await prisma.application.create({
      data: {
        businessId,
        checklistItemId,
        riskScore,
      },
    });

    // Flip the checklist item's status to "applied"
    await prisma.checklistItem.update({
      where: { id: checklistItemId },
      data: { status: "applied" },
    });

    return NextResponse.json(application);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}

// GET /api/applications?businessId=xxx
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId");

    if (!businessId) {
      return NextResponse.json(
        { error: "businessId query param is required" },
        { status: 400 }
      );
    }

    const applications = await prisma.application.findMany({
      where: { businessId },
      include: { checklistItem: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(applications);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}