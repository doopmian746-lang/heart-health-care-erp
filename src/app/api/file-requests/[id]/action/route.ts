import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { generateAuditId } from "@/lib/id-generator";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireRole(request, "Admin", "Doctor");
    const { id } = await params;
    const { action, remarks } = await request.json();
    const fileRequest = await prisma.fileRequest.findUnique({ where: { id } });
    if (!fileRequest) {
      return NextResponse.json({ error: "File request not found" }, { status: 404 });
    }
    const newStatus = action === "Fulfilled" ? "Fulfilled" : "Rejected";
    const updated = await prisma.fileRequest.update({
      where: { id },
      data: {
        status: newStatus,
        remarks: remarks || "",
        fulfilledBy: user.name || "Admin",
        fulfillmentDate: new Date(),
      },
    });
    await prisma.auditLog.create({
      data: {
        id: generateAuditId(),
        userName: user.name,
        action: `File Request ${newStatus}`,
        entityType: "FileRequest",
        entityId: id,
        details: `File request ${newStatus} for ${fileRequest.patientName}`,
      },
    });
    return NextResponse.json(updated);
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Failed to process file request" }, { status: 500 });
  }
}
