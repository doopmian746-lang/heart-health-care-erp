import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(request, "Admin", "Lab Staff");
    const { id } = await params;
    const body = await request.json();
    const updateData: Record<string, any> = {};
    if (body.testName !== undefined) updateData.testName = body.testName;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.normalRange !== undefined) updateData.normalRange = body.normalRange;
    if (body.unit !== undefined) updateData.unit = body.unit;
    if (body.cost !== undefined) updateData.cost = body.cost;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const updated = await prisma.labTest.update({ where: { id }, data: updateData });
    return NextResponse.json(updated);
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Failed to update lab test" }, { status: 500 });
  }
}
