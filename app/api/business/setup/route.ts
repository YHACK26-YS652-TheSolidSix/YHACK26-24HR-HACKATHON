import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(request: Request) {
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

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.role !== "BUSINESS") {
      return NextResponse.json(
        { error: "Only business accounts can create a business profile" },
        { status: 403 }
      );
    }

    if (user.businessId) {
      const existingBusiness = await prisma.business.findUnique({
        where: {
          id: user.businessId,
        },
      });

      return NextResponse.json({
        message: "Business is already connected",
        business: existingBusiness,
      });
    }

    const body = await request.json().catch(() => ({}));

    const businessName =
      body.businessName?.trim() || `${user.name}'s Business`;

    const sector =
      body.sector?.trim() || "Manufacturing";

    const district =
      body.district?.trim() || "Coimbatore";

    const business = await prisma.business.create({
      data: {
        name: businessName,
        sector,
        district,
        state: "Tamil Nadu",
      },
    });

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        businessId: business.id,
      },
    });

    return NextResponse.json({
      message: "Business created and connected successfully",
      business,
    });
  } catch (error) {
    console.error("Business setup error:", error);

    return NextResponse.json(
      {
        error: "Failed to setup business",
      },
      {
        status: 500,
      }
    );
  }
}