import { prisma } from "@/lib/prisma";

const departments = [
	{
		code: "MSME",
		name: "MSME Development",
	},
	{
		code: "TAX",
		name: "Commercial Taxes",
	},
	{
		code: "FSSAI",
		name: "Food Safety Department",
	},
	{
		code: "FACTORY",
		name: "Factories and Boilers Department",
	},
];

const requirements = [
	{
		code: "UDYAM",
		name: "Udyam Registration",
		departmentCode: "MSME",
	},
	{
		code: "GST",
		name: "GST Registration",
		departmentCode: "TAX",
	},
	{
		code: "FSSAI",
		name: "FSSAI License",
		departmentCode: "FSSAI",
	},
	{
		code: "FACTORY_LICENSE",
		name: "Factory License",
		departmentCode: "FACTORY",
	},
];

async function main() {
	for (const department of departments) {
		await prisma.department.upsert({
			where: {
				code: department.code,
			},
			update: {
				name: department.name,
			},
			create: department,
		});
	}

	for (const requirement of requirements) {
		const department = await prisma.department.findUnique({
			where: {
				code: requirement.departmentCode,
			},
		});

		if (!department) {
			throw new Error(`Department ${requirement.departmentCode} not found`);
		}

		await prisma.complianceRequirement.upsert({
			where: {
				code: requirement.code,
			},
			update: {
				name: requirement.name,
				departmentId: department.id,
			},
			create: {
				code: requirement.code,
				name: requirement.name,
				departmentId: department.id,
			},
		});
	}

	console.log("Departments and requirements seeded successfully");
}

main()
	.catch((error) => {
		console.error(error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
