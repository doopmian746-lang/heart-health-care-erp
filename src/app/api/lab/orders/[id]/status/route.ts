import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { generateAuditId } from "@/lib/id-generator";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireRole(request, "Admin", "Doctor", "Lab Staff");
    const { id } = await params;
    const { status } = await request.json();
    if (!["Pending", "In Progress", "Completed", "Cancelled"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    await prisma.labOrder.update({ where: { id }, data: { status } });
    const order = await prisma.labOrder.findUnique({ where: { id }, include: { items: true } });
    await prisma.auditLog.create({
      data: { id: generateAuditId(), userName: user.name, action: `Lab Order ${status}`, entityType: "LabOrder", entityId: id, details: `Order ${id} status changed to ${status}` },
    });
    return NextResponse.json(order);
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
  }
}
