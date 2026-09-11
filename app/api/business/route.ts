import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, sector, district } = body;

    if (!name || !sector || !district) {
      return NextResponse.json(
        {
          error: "Name, sector and district are required",
        },
        { status: 400 }
      );
    }

    const business = await prisma.business.create({
      data: {
        name,
        sector,
        district,
      },
    });

    return NextResponse.json(business, { status: 201 });
  } catch (error) {
    console.error("Error creating business:", error);

    return NextResponse.json(
      {
        error: "Failed to create business",
      },
      { status: 500 }
    );
  }
}