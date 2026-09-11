import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { evaluateRules } from "@/lib/rules/engine";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const business = await prisma.business.findUnique({
      where: { id },
    });

    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    const result = evaluateRules({
      name: business.name,
      sector: business.sector,
      district: business.district,
      state: business.state,
    });

    const requirements =
      await prisma.complianceRequirement.findMany({
        where: {
          code: {
            in: result.requirementCodes,
          },
        },
        include: {
          department: true,
        },
      });

    const checklist = await prisma.checklist.create({
      data: {
        businessId: business.id,
        items: {
          create: requirements.map((requirement) => ({
            requirementId: requirement.id,
          })),
        },
      },
      include: {
        items: {
          include: {
            requirement: {
              include: {
                department: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      checklistId: checklist.id,
      items: checklist.items.map((item) => ({
        id: item.id,
        requirementCode: item.requirement.code,
        name: item.requirement.name,
        department: item.requirement.department.name,
        status: item.status,
      })),
    });
  } catch (error) {
    console.error("Checklist generation error:", error);

    return NextResponse.json(
      { error: "Failed to generate checklist" },
      { status: 500 }
    );
  }
}