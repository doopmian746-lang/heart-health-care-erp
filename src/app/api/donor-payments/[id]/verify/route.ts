import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { generateAuditId } from "@/lib/id-generator";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireRole(request, "Admin", "Receptionist");
    const { id } = await params;
    const { status } = await request.json();
    if (!status || !["Verified", "Rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status. Must be: Verified or Rejected" }, { status: 400 });
    }
    const existing = await prisma.donorPayment.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Donation not found" }, { status: 404 });
    }
    await prisma.donorPayment.update({
      where: { id },
      data: {
        paymentStatus: status,
        verifiedBy: user.name || "Admin",
        verificationDate: new Date(),
      },
    });
    await prisma.auditLog.create({
      data: {
        id: generateAuditId(),
        userName: user.name,
        action: `Donation ${status}`,
        entityType: "Donor",
        entityId: id,
        details: `Donation of PKR ${existing.amount} from ${existing.donorName} ${status.toLowerCase()} by ${user.name || "Admin"}`,
      },
    });
    return NextResponse.json({ success: true, message: `Donation ${status.toLowerCase()} successfully` });
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Failed to verify donation" }, { status: 500 });
  }
}
