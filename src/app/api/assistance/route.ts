import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { createAssistanceSchema } from "@/lib/validations";
import { generateAssistanceId, generateAuditId } from "@/lib/id-generator";

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    const requests = await prisma.assistanceRequest.findMany({ orderBy: { requestDate: "desc" } });
    return NextResponse.json(requests);
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Failed to fetch assistance requests" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const parsed = createAssistanceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.errors }, { status: 400 });
    }
    const reqData = parsed.data;
    const patient = await prisma.patient.findUnique({ where: { id: reqData.patientId } });
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }
    const count = await prisma.assistanceRequest.count();
    const newRequest = await prisma.assistanceRequest.create({
      data: {
        id: generateAssistanceId(count + 1),
        patientId: patient.id,
        patientName: patient.fullName,
        type: reqData.type || "",
        estimatedCost: reqData.estimatedCost || 0,
        patientContribution: reqData.patientContribution || 0,
        foundationContribution: reqData.foundationContribution ?? reqData.estimatedCost ?? 0,
        status: "Pending",
        justification: reqData.justification || "",
        remarks: "",
        requestedBy: user.name || "Staff",
      },
    });
    await prisma.auditLog.create({
      data: {
        id: generateAuditId(),
        userName: user.name,
        action: "Assistance Request Submitted",
        entityType: "Assistance",
        entityId: newRequest.id,
        details: `Submitted ${newRequest.type} request for ${patient.fullName} (PKR ${newRequest.estimatedCost})`,
      },
    });
    return NextResponse.json(newRequest);
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Failed to create assistance request" }, { status: 500 });
  }
}
