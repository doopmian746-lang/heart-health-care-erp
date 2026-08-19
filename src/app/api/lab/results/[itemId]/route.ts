import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { generateAuditId } from "@/lib/id-generator";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const user = await requireRole(request, "Admin", "Lab Staff");
    const { itemId } = await params;
    const { result, resultValue, status, technician } = await request.json();
    const id = Number(itemId);

    await prisma.labOrderItem.update({
      where: { id },
      data: {
        result: result || "",
        resultValue: resultValue || "",
        status: status || "Completed",
        completedDate: new Date(),
        technician: technician || user.name || "Lab Tech",
      },
    });

    const item = await prisma.labOrderItem.findUnique({ where: { id } });
    if (item) {
      const allItems = await prisma.labOrderItem.findMany({ where: { orderId: item.orderId }, select: { status: true } });
      const allDone = allItems.every((i) => i.status !== "Pending");
      if (allDone) {
        await prisma.labOrder.update({ where: { id: item.orderId }, data: { status: "Completed" } });
      }
    }

    await prisma.auditLog.create({
      data: { id: generateAuditId(), userName: user.name, action: "Lab Result Entered", entityType: "LabOrder", entityId: itemId, details: `Test result entered for item ${itemId}` },
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Failed to update result" }, { status: 500 });
  }
}
