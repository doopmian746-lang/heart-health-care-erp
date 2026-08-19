import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { generateAuditId } from "@/lib/id-generator";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const existing = await prisma.patient.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }
    const body = await request.json();
    const existingHistory = await prisma.medicalHistory.findUnique({ where: { patientId: id } });

    const historyData: Record<string, any> = { updatedBy: user.name };
    if (body.chronicConditions !== undefined) historyData.chronicConditions = JSON.stringify(body.chronicConditions);
    if (body.lifestyleFactors !== undefined) historyData.lifestyleFactors = JSON.stringify(body.lifestyleFactors);
    if (body.familyHistory !== undefined) historyData.familyHistory = JSON.stringify(body.familyHistory);
    if (body.allergies !== undefined) historyData.allergies = body.allergies;
    if (body.existingMedications !== undefined) historyData.existingMedications = body.existingMedications;
    if (body.priorCardiacProcedures !== undefined) historyData.priorCardiacProcedures = JSON.stringify(body.priorCardiacProcedures);

    if (existingHistory) {
      await prisma.medicalHistory.update({ where: { patientId: id }, data: historyData });
    } else {
      await prisma.medicalHistory.create({
        data: {
          patientId: id,
          chronicConditions: historyData.chronicConditions || "[]",
          lifestyleFactors: historyData.lifestyleFactors || "[]",
          familyHistory: historyData.familyHistory || "[]",
          allergies: historyData.allergies || "None",
          existingMedications: historyData.existingMedications || "None",
          priorCardiacProcedures: historyData.priorCardiacProcedures || "[]",
          updatedBy: user.name,
        },
      });
    }

    await prisma.auditLog.create({
      data: {
        id: generateAuditId(),
        userName: user.name,
        action: "Medical History Updated",
        entityType: "MedicalHistory",
        entityId: id,
        details: `Updated medical history for ${existing.fullName}`,
      },
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Failed to update medical history" }, { status: 500 });
  }
}
