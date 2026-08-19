import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { generateAuditId } from "@/lib/id-generator";

export async function POST(request: Request) {
  try {
    const user = await requireRole(request, "Admin", "Pharmacy Staff");
    const { id, ...data } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    const existing = await prisma.inventory.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Medicine not found" }, { status: 404 });
    }
    const updateData: Record<string, any> = {};
    if (data.medicineName !== undefined) updateData.medicineName = data.medicineName;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.supplier !== undefined) updateData.supplier = data.supplier;
    if (data.batchNumber !== undefined) updateData.batchNumber = data.batchNumber;
    if (data.expiryDate !== undefined) updateData.expiryDate = data.expiryDate;
    if (data.quantityAvailable !== undefined) updateData.quantityAvailable = data.quantityAvailable;
    if (data.minimumStockLevel !== undefined) updateData.minimumStockLevel = data.minimumStockLevel;
    if (data.unitPrice !== undefined) updateData.unitPrice = data.unitPrice;

    await prisma.inventory.update({ where: { id }, data: updateData });
    await prisma.auditLog.create({
      data: {
        id: generateAuditId(),
        userName: user.name,
        action: "Inventory Updated",
        entityType: "Inventory",
        entityId: id,
        details: `Updated ${data.medicineName || existing.medicineName}`,
      },
    });
    const updated = await prisma.inventory.findUnique({ where: { id } });
    return NextResponse.json(updated);
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Failed to update inventory" }, { status: 500 });
  }
}
