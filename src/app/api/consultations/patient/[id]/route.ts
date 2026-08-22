import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, requireRole } from "@/lib/auth";
import { createConsultationSchema } from "@/lib/validations";
import { generateConsultationId, generateAuditId } from "@/lib/id-generator";
import { transformConsultation } from "@/lib/transformers";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(request);
    const { id: patientId } = await params;
    const consultations = await prisma.consultation.findMany({
      where: { patientId },
      orderBy: { visitDate: "desc" },
    });
    return NextResponse.json(consultations.map(transformConsultation));
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Failed to fetch consultations" }, { status: 500 });
  }
}

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
    const parsed = createConsultationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.errors }, { status: 400 });
    }
    const conData = parsed.data;
    const count = await prisma.consultation.count();
    const consultation = await prisma.consultation.create({
      data: {
        id: generateConsultationId(count + 1),
        patientId,
        bpSystolic: conData.vitals?.bpSystolic || 120,
        bpDiastolic: conData.vitals?.bpDiastolic || 80,
        pulse: conData.vitals?.pulse || 72,
        weight: conData.vitals?.weight || 70,
        height: conData.vitals?.height || 170,
        bmi: conData.vitals?.bmi || 24.2,
        spo2: conData.vitals?.spo2 || 98,
        chiefComplaint: conData.chiefComplaint || "",
        symptoms: conData.symptoms || "",
        examinationFindings: conData.examinationFindings || "",
        diagnosis: conData.diagnosis || "",
        doctorNotes: conData.doctorNotes || "",
        investigations: conData.investigations || "",
        procedures: conData.procedures || "",
        referrals: conData.referrals || "",
        foundationReferral: conData.foundationReferral || false,
        requirements: conData.requirements || "",
        followUpDate: conData.followUpDate || "",
        followUpInstructions: conData.followUpInstructions || "",
        doctorName: user.name || "Unknown Doctor",
      },
    });
    await prisma.auditLog.create({
      data: {
        id: generateAuditId(),
        userName: user.name,
        action: "Consultation Created",
        entityType: "Consultation",
        entityId: consultation.id,
        details: `Created consultation for ${patient.fullName}`,
      },
    });
    return NextResponse.json(transformConsultation(consultation));
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Failed to create consultation" }, { status: 500 });
  }
}
