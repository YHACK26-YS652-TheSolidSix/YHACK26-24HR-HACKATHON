import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const departments = [
  {
    code: "LABOUR",
    name: "Labour Department",
  },
  {
    code: "FIRE",
    name: "Fire & Rescue Services",
  },
  {
    code: "POLLUTION",
    name: "Tamil Nadu Pollution Control Board",
  },
  {
    code: "TAX",
    name: "Commercial Taxes / GST",
  },
];

const requirements = [
  {
    code: "LABOUR_REG",
    name: "Labour registration / establishment compliance",
    departmentCode: "LABOUR",
  },
  {
    code: "LABOUR_WAGES",
    name: "Employee wage and working-condition compliance",
    departmentCode: "LABOUR",
  },
  {
    code: "FIRE_SAFETY",
    name: "Fire safety compliance and required certification",
    departmentCode: "FIRE",
  },
  {
    code: "FIRE_EQUIPMENT",
    name: "Fire prevention equipment and safety measures",
    departmentCode: "FIRE",
  },
  {
    code: "POLLUTION_CONSENT",
    name: "Pollution control consent / environmental compliance",
    departmentCode: "POLLUTION",
  },
  {
    code: "WASTE_MANAGEMENT",
    name: "Waste management and disposal compliance",
    departmentCode: "POLLUTION",
  },
  {
    code: "GST_REG",
    name: "GST registration and tax compliance",
    departmentCode: "TAX",
  },
  {
    code: "GST_RETURNS",
    name: "GST return filing and record maintenance",
    departmentCode: "TAX",
  },
];

export async function GET() {
  try {
    const departmentMap = new Map<string, string>();

    for (const department of departments) {
      const createdDepartment = await prisma.department.upsert({
        where: {
          code: department.code,
        },
        update: {
          name: department.name,
        },
        create: {
          code: department.code,
          name: department.name,
        },
      });

      departmentMap.set(department.code, createdDepartment.id);
    }

    const createdRequirements = [];

    for (const requirement of requirements) {
      const departmentId = departmentMap.get(
        requirement.departmentCode
      );

      if (!departmentId) {
        throw new Error(
          `Department not found: ${requirement.departmentCode}`
        );
      }

      const createdRequirement =
        await prisma.complianceRequirement.upsert({
          where: {
            code: requirement.code,
          },
          update: {
            name: requirement.name,
            departmentId,
          },
          create: {
            code: requirement.code,
            name: requirement.name,
            departmentId,
          },
        });

      createdRequirements.push(createdRequirement);
    }

    return NextResponse.json({
      message: "Demo compliance requirements seeded successfully",
      departmentsCreated: departments.length,
      requirementsCreated: createdRequirements.length,
    });
  } catch (error) {
    console.error("Seed requirements error:", error);

    return NextResponse.json(
      {
        error: "Failed to seed compliance requirements",
      },
      {
        status: 500,
      }
    );
  }
}