import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/auth";
import { generateLabOrderId, generateAuditId } from "@/lib/id-generator";

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    const orders = await prisma.labOrder.findMany({ orderBy: { orderDate: "desc" }, include: { items: true } });
    return NextResponse.json(orders);
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Failed to fetch lab orders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireRole(request, "Admin", "Doctor", "Lab Staff");
    const { patientId, consultationId, doctorName, priority, notes, testIds } = await request.json();
    if (!patientId || !testIds || testIds.length === 0) {
      return NextResponse.json({ error: "Patient and at least one test are required" }, { status: 400 });
    }
    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }
    const count = await prisma.labOrder.count();
    const order = await prisma.labOrder.create({
      data: {
        id: generateLabOrderId(count),
        patientId,
        patientName: patient.fullName,
        consultationId: consultationId || "",
        doctorName: doctorName || "",
        status: "Pending",
        priority: priority || "Routine",
        notes: notes || "",
        items: {
          create: await Promise.all(
            testIds.map(async (testId: string) => {
              const test = await prisma.labTest.findUnique({ where: { id: testId } });
              return test
                ? {
                    testId: test.id,
                    testName: test.testName,
                    result: "",
                    resultValue: "",
                    unit: test.unit,
                    normalRange: test.normalRange,
                    status: "Pending",
                    technician: "",
                  }
                : null;
            })
          ).then((items) => items.filter(Boolean)),
        },
      },
      include: { items: true },
    });
    await prisma.auditLog.create({
      data: { id: generateAuditId(), userName: user.name, action: "Lab Order Created", entityType: "LabOrder", entityId: order.id, details: `Lab order for ${patient.fullName}: ${testIds.length} tests` },
    });
    return NextResponse.json(order);
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Failed to create lab order" }, { status: 500 });
  }
}
