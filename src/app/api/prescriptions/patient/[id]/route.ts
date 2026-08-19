import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { createPrescriptionSchema } from "@/lib/validations";
import { generatePrescriptionId, generateAuditId } from "@/lib/id-generator";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireRole(request, "Admin", "Doctor");
    const { id: patientId } = await params;
    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }
    const body = await request.json();
    const parsed = createPrescriptionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.errors }, { status: 400 });
    }
    const prData = parsed.data;
    const count = await prisma.prescription.count();
    const prescription = await prisma.prescription.create({
      data: {
        id: generatePrescriptionId(count + 1),
        consultationId: prData.consultationId || "",
        patientId,
        lifestyleRecommendations: prData.lifestyleRecommendations || "",
        doctorName: user.name || "Unknown Doctor",
        status: "Pending",
        items: {
          create: (prData.items || []).map((item) => ({
            medicineId: item.medicineId,
            medicineName: item.medicineName,
            strength: item.strength || "",
            dosage: item.dosage || "",
            frequency: item.frequency || "",
            duration: item.duration || "",
            instructions: item.instructions || "",
          })),
        },
      },
      include: { items: true },
    });
    await prisma.auditLog.create({
      data: {
        id: generateAuditId(),
        userName: user.name,
        action: "Prescription Created",
        entityType: "Prescription",
        entityId: prescription.id,
        details: `Created prescription with ${prData.items?.length || 0} item(s) for ${patient.fullName}`,
      },
    });
    return NextResponse.json(prescription);
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Failed to create prescription" }, { status: 500 });
  }
}
