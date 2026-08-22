import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { updatePatientSchema } from "@/lib/validations";
import { generateAuditId } from "@/lib/id-generator";
import { transformConsultation } from "@/lib/transformers";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(request);
    const { id } = await params;
    const patient = await prisma.patient.findUnique({ where: { id } });
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }
    const medicalHistory = await prisma.medicalHistory.findUnique({ where: { patientId: id } });
    const consultations = await prisma.consultation.findMany({ where: { patientId: id }, orderBy: { visitDate: "desc" } });
    const prescriptions = await prisma.prescription.findMany({ where: { patientId: id }, orderBy: { date: "desc" }, include: { items: true } });
    const assistanceHistory = await prisma.assistanceRequest.findMany({ where: { patientId: id }, orderBy: { requestDate: "desc" } });
    const labOrders = await prisma.labOrder.findMany({ where: { patientId: id }, orderBy: { orderDate: "desc" }, include: { items: true } });

    const mappedPrescriptions = prescriptions.map((p) => ({
      ...p,
      items: p.items.map((i) => ({
        medicineId: i.medicineId,
        medicineName: i.medicineName,
        strength: i.strength,
        dosage: i.dosage,
        frequency: i.frequency,
        duration: i.duration,
        instructions: i.instructions,
      })),
    }));

    return NextResponse.json({
      patient,
      medicalHistory: medicalHistory
        ? {
            ...medicalHistory,
            chronicConditions: JSON.parse(medicalHistory.chronicConditions),
            lifestyleFactors: JSON.parse(medicalHistory.lifestyleFactors),
            familyHistory: JSON.parse(medicalHistory.familyHistory),
            priorCardiacProcedures: JSON.parse(medicalHistory.priorCardiacProcedures),
          }
        : null,
      consultations: consultations.map(transformConsultation),
      prescriptions: mappedPrescriptions,
      assistanceHistory,
      labOrders,
    });
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Failed to fetch patient" }, { status: 500 });
  }
}

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
    const parsed = updatePatientSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.errors }, { status: 400 });
    }
    const data = parsed.data;
    const updateData: Record<string, any> = {};
    if (data.fullName !== undefined) updateData.fullName = data.fullName;
    if (data.fatherHusbandName !== undefined) updateData.fatherHusbandName = data.fatherHusbandName;
    if (data.cnic !== undefined) updateData.cnic = data.cnic;
    if (data.dob !== undefined) updateData.dob = data.dob;
    if (data.age !== undefined) updateData.age = data.age;
    if (data.gender !== undefined) updateData.gender = data.gender;
    if (data.maritalStatus !== undefined) updateData.maritalStatus = data.maritalStatus;
    if (data.occupation !== undefined) updateData.occupation = data.occupation;
    if (data.mobile !== undefined) updateData.mobile = data.mobile;
    if (data.alternateContact !== undefined) updateData.alternateContact = data.alternateContact;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.bloodGroup !== undefined) updateData.bloodGroup = data.bloodGroup;
    if (data.photo !== undefined) updateData.photo = data.photo;
    if (data.referredBy !== undefined) updateData.referredBy = data.referredBy;

    if (data.socioEconomic) {
      const se = data.socioEconomic;
      if (se.housingStatus !== undefined) updateData.housingStatus = se.housingStatus;
      if (se.houseType !== undefined) updateData.houseType = se.houseType;
      if (se.numberOfRooms !== undefined) updateData.numberOfRooms = se.numberOfRooms;
      if (se.monthlyRent !== undefined) updateData.monthlyRent = se.monthlyRent;
      if (se.ownsLand !== undefined) updateData.ownsLand = se.ownsLand;
      if (se.landAcres !== undefined) updateData.landAcres = se.landAcres;
      if (se.monthlyElectricityBill !== undefined) updateData.monthlyElectricityBill = se.monthlyElectricityBill;
      if (se.waterSource !== undefined) updateData.waterSource = se.waterSource;
      if (se.toiletType !== undefined) updateData.toiletType = se.toiletType;
      if (se.cookingFuel !== undefined) updateData.cookingFuel = se.cookingFuel;
      if (se.monthlyHouseholdIncome !== undefined) updateData.monthlyHouseholdIncome = se.monthlyHouseholdIncome;
      if (se.numberOfDependents !== undefined) updateData.numberOfDependents = se.numberOfDependents;
      if (se.numberOfEarningMembers !== undefined) updateData.numberOfEarningMembers = se.numberOfEarningMembers;
      if (se.educationLevel !== undefined) updateData.educationLevel = se.educationLevel;
      if (se.employmentStatus !== undefined) updateData.employmentStatus = se.employmentStatus;
      if (se.hasRefrigerator !== undefined) updateData.hasRefrigerator = se.hasRefrigerator;
      if (se.hasTelevision !== undefined) updateData.hasTelevision = se.hasTelevision;
      if (se.hasPersonalVehicle !== undefined) updateData.hasPersonalVehicle = se.hasPersonalVehicle;
      if (se.hasComputer !== undefined) updateData.hasComputer = se.hasComputer;
      if (se.hasInternet !== undefined) updateData.hasInternet = se.hasInternet;
      if (se.notes !== undefined) updateData.socioNotes = se.notes;
    }

    const updated = await prisma.patient.update({ where: { id }, data: updateData });
    await prisma.auditLog.create({
      data: {
        id: generateAuditId(),
        userName: user.name,
        action: "Patient Updated",
        entityType: "Patient",
        entityId: id,
        details: `Updated patient record for ${existing.fullName}`,
      },
    });
    return NextResponse.json(updated);
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Failed to update patient" }, { status: 500 });
  }
}

export async function DELETE(
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
    await prisma.patient.delete({ where: { id } });
    await prisma.auditLog.create({
      data: {
        id: generateAuditId(),
        userName: user.name,
        action: "Patient Deleted",
        entityType: "Patient",
        entityId: id,
        details: `Deleted patient ${existing.fullName}`,
      },
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Failed to delete patient" }, { status: 500 });
  }
}
