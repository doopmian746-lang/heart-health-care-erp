import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/auth";
import { createInventorySchema } from "@/lib/validations";
import { generateInventoryId, generateAuditId } from "@/lib/id-generator";

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    const items = await prisma.inventory.findMany({ orderBy: { medicineName: "asc" } });
    return NextResponse.json(items);
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireRole(request, "Admin", "Pharmacy Staff");
    const body = await request.json();
    const parsed = createInventorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.errors }, { status: 400 });
    }
    const med = parsed.data;
    const count = await prisma.inventory.count();
    const newItem = await prisma.inventory.create({
      data: {
        id: generateInventoryId(count + 1),
        medicineName: med.medicineName,
        category: med.category || "",
        supplier: med.supplier || "",
        batchNumber: med.batchNumber,
        purchaseDate: med.purchaseDate || new Date().toISOString().split("T")[0],
        expiryDate: med.expiryDate || "",
        quantityAvailable: med.quantityAvailable || 0,
        minimumStockLevel: med.minimumStockLevel || 50,
        unitPrice: med.unitPrice || 0,
      },
    });
    await prisma.auditLog.create({
      data: {
        id: generateAuditId(),
        userName: user.name,
        action: "Inventory Added",
        entityType: "Inventory",
        entityId: newItem.id,
        details: `Added ${newItem.medicineName} (${newItem.quantityAvailable} units)`,
      },
    });
    return NextResponse.json(newItem);
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Failed to create inventory item" }, { status: 500 });
  }
}
