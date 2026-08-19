import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { generateAuditId } from "@/lib/id-generator";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireRole(request, "Admin", "Doctor");
    const { id } = await params;
    const { status, remarks, patientContribution, foundationContribution } = await request.json();
    const existing = await prisma.assistanceRequest.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Assistance request not found" }, { status: 404 });
    }

    const updateData: Record<string, any> = {};
    if (status !== undefined) updateData.status = status;
    if (remarks !== undefined) updateData.remarks = remarks;
    if (patientContribution !== undefined) updateData.patientContribution = Number(patientContribution);
    if (foundationContribution !== undefined) updateData.foundationContribution = Number(foundationContribution);
    if (status === "Approved") {
      updateData.approvedBy = user.name || "Admin";
      updateData.approvalDate = new Date();
    }

    const updated = await prisma.assistanceRequest.update({ where: { id }, data: updateData });
    const action = status === "Approved" ? "Assistance Approved" : "Assistance Rejected";
    const detail =
      status === "Approved"
        ? `Approved ${existing.type} for ${existing.patientName}. Foundation covers ${foundationContribution || existing.foundationContribution}`
        : `Rejected assistance for ${existing.patientName}: "${remarks}"`;
    await prisma.auditLog.create({
      data: { id: generateAuditId(), userName: user.name, action, entityType: "Assistance", entityId: id, details: detail },
    });
    return NextResponse.json(updated);
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Failed to update assistance request" }, { status: 500 });
  }
}
