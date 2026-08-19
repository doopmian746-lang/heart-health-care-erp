import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/auth";
import { generateLabTestId, generateAuditId } from "@/lib/id-generator";

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    const tests = await prisma.labTest.findMany({ where: { isActive: true }, orderBy: [{ category: "asc" }, { testName: "asc" }] });
    return NextResponse.json(tests);
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Failed to fetch lab tests" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireRole(request, "Admin", "Lab Staff");
    const { testName, category, description, normalRange, unit, cost } = await request.json();
    if (!testName) {
      return NextResponse.json({ error: "Test name is required" }, { status: 400 });
    }
    const count = await prisma.labTest.count();
    const test = await prisma.labTest.create({
      data: {
        id: generateLabTestId(count),
        testName,
        category: category || "General",
        description: description || "",
        normalRange: normalRange || "",
        unit: unit || "",
        cost: Number(cost) || 0,
        isActive: true,
      },
    });
    await prisma.auditLog.create({
      data: { id: generateAuditId(), userName: user.name, action: "Lab Test Created", entityType: "LabTest", entityId: test.id, details: `Created test: ${testName}` },
    });
    return NextResponse.json(test);
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Failed to create lab test" }, { status: 500 });
  }
}
