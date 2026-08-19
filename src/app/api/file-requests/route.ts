import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { createFileRequestSchema } from "@/lib/validations";
import { generateFileRequestId, generateAuditId } from "@/lib/id-generator";

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    const requests = await prisma.fileRequest.findMany({ orderBy: { requestDate: "desc" } });
    return NextResponse.json(requests);
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Failed to fetch file requests" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const parsed = createFileRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.errors }, { status: 400 });
    }
    const { patientId, purpose, urgency } = parsed.data;
    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }
    const count = await prisma.fileRequest.count();
    const newRequest = await prisma.fileRequest.create({
      data: {
        id: generateFileRequestId(count + 1),
        patientId: patient.id,
        patientName: patient.fullName,
        requestedBy: user.name || "Staff",
        purpose: purpose || "",
        urgency: urgency || "Medium",
        status: "Pending",
      },
    });
    await prisma.auditLog.create({
      data: {
        id: generateAuditId(),
        userName: user.name,
        action: "File Request Submitted",
        entityType: "FileRequest",
        entityId: newRequest.id,
        details: `File request for ${patient.fullName}: ${purpose}`,
      },
    });
    return NextResponse.json(newRequest);
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Failed to create file request" }, { status: 500 });
  }
}
