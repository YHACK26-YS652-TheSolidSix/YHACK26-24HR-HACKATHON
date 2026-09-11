import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const checklist = await prisma.checklist.findFirst({
      where: {
        businessId: id,
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

    if (!checklist) {
      return NextResponse.json(
        { error: "Checklist not found" },
        { status: 404 }
      );
    }

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
    console.error("Checklist fetch error:", error);

    return NextResponse.json(
      { error: "Failed to fetch checklist" },
      { status: 500 }
    );
  }
}