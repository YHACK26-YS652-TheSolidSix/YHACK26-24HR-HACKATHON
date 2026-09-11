import { prisma } from "./lib/prisma";

async function main() {
  const department = await prisma.department.upsert({
    where: { code: "MSME" },
    update: {},
    create: { code: "MSME", name: "MSME Department" },
  });

  const requirement = await prisma.complianceRequirement.upsert({
    where: { code: "udyam_registration" },
    update: {},
    create: {
      code: "udyam_registration",
      name: "Udyam Registration",
      departmentId: department.id,
    },
  });

  const business = await prisma.business.create({
    data: {
      name: "FreshBite Foods",
      sector: "Food Processing",
      district: "Coimbatore",
    },
  });

  const checklist = await prisma.checklist.create({
    data: { businessId: business.id },
  });

  const checklistItem = await prisma.checklistItem.create({
    data: {
      checklistId: checklist.id,
      requirementId: requirement.id,
    },
  });

  console.log("businessId:", business.id);
  console.log("checklistItemId:", checklistItem.id);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });