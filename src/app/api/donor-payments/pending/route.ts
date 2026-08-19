import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await requireRole(request, "Admin", "Receptionist");
    const pending = await prisma.donorPayment.findMany({
      where: { paymentStatus: "Pending" },
      orderBy: { paymentDate: "desc" },
    });
    return NextResponse.json(pending);
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Failed to fetch pending donations" }, { status: 500 });
  }
}
