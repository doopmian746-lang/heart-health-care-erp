import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { generateAuditId } from "@/lib/id-generator";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireRole(request, "Admin", "Pharmacy Staff");
    const { id } = await params;
    const { status } = await request.json();

    if (!status || !["Dispensed", "Partially Dispensed", "Pending"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be: Pending, Dispensed, or Partially Dispensed" },
        { status: 400 }
      );
    }

    const existing = await prisma.prescription.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Prescription not found" }, { status: 404 });
    }

    const updated = await prisma.prescription.update({ where: { id }, data: { status } });
    await prisma.auditLog.create({
      data: {
        id: generateAuditId(),
        userName: user.name,
        action: "Prescription Status Updated",
        entityType: "Prescription",
        entityId: id,
        details: `Status changed from ${existing.status} to ${status} for patient ${existing.patientId}`,
      },
    });
    return NextResponse.json(updated);
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Failed to update prescription status" }, { status: 500 });
  }
}
