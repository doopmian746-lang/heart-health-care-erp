import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ patientId: string }> }
) {
  try {
    await requireAuth(request);
    const { patientId } = await params;
    const orders = await prisma.labOrder.findMany({
      where: { patientId },
      orderBy: { orderDate: "desc" },
      include: { items: true },
    });
    return NextResponse.json(orders);
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Failed to fetch lab orders" }, { status: 500 });
  }
}
