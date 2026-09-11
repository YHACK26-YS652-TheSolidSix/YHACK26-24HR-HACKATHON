import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);

    if (!payload.businessId) {
      return NextResponse.json(
        {
          error:
            "No business is connected to this account yet",
        },
        { status: 400 }
      );
    }

    let checklist = await prisma.checklist.findFirst({
      where: {
        businessId: payload.businessId,
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
      const requirements =
        await prisma.complianceRequirement.findMany({
          include: {
            department: true,
          },
          orderBy: {
            code: "asc",
          },
        });

      checklist = await prisma.checklist.create({
        data: {
          businessId: payload.businessId,
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
    }

    return NextResponse.json({
      checklist,
    });
  } catch (error) {
    console.error("Checklist error:", error);

    return NextResponse.json(
      {
        error: "Failed to load compliance checklist",
      },
      {
        status: 500,
      }
    );
  }
}