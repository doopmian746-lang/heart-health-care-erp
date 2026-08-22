import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { createPatientSchema } from "@/lib/validations";
import { generatePatientId, generatePatientCode, generateAuditId } from "@/lib/id-generator";
import { transformPatient } from "@/lib/transformers";

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;

    let patients;
    if (!search) {
      patients = await prisma.patient.findMany({
        orderBy: { registrationDate: "desc" },
      });
    } else {
      patients = await prisma.patient.findMany({
        where: {
          OR: [
            { fullName: { contains: search, mode: "insensitive" } },
            { id: { contains: search, mode: "insensitive" } },
            { patientCode: { contains: search, mode: "insensitive" } },
            { cnic: { contains: search, mode: "insensitive" } },
            { mobile: { contains: search, mode: "insensitive" } },
          ],
        },
        orderBy: { registrationDate: "desc" },
      });
    }

    return NextResponse.json(patients.map(transformPatient));
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authUser = await requireAuth(request);
    const body = await request.json();
    const parsed = createPatientSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.errors },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const count = await prisma.patient.count();
    const nextNum = count + 1;
    const id = generatePatientId(1000 + nextNum);
    const patientCode = generatePatientCode(nextNum);

    const se: Record<string, any> = data.socioEconomic || {};
    const patient = await prisma.patient.create({
      data: {
        id,
        patientCode,
        fullName: data.fullName,
        fatherHusbandName: data.fatherHusbandName || "",
        cnic: data.cnic || "",
        dob: data.dob || "",
        age: data.age || 0,
        gender: data.gender || "Male",
        maritalStatus: data.maritalStatus || "Single",
        occupation: data.occupation || "",
        mobile: data.mobile || "",
        alternateContact: data.alternateContact || "",
        address: data.address || "",
        bloodGroup: data.bloodGroup || "Unknown",
        photo: data.photo || "",
        referredBy: data.referredBy || "",
        createdBy: authUser.id,
        housingStatus: se.housingStatus || "Owned",
        houseType: se.houseType || "House",
        numberOfRooms: se.numberOfRooms || 0,
        monthlyRent: se.monthlyRent || 0,
        ownsLand: se.ownsLand || false,
        landAcres: se.landAcres || 0,
        monthlyElectricityBill: se.monthlyElectricityBill || 0,
        waterSource: se.waterSource || "Tap",
        toiletType: se.toiletType || "Flush",
        cookingFuel: se.cookingFuel || "Gas",
        monthlyHouseholdIncome: se.monthlyHouseholdIncome || 0,
        numberOfDependents: se.numberOfDependents || 0,
        numberOfEarningMembers: se.numberOfEarningMembers || 0,
        educationLevel: se.educationLevel || "None",
        employmentStatus: se.employmentStatus || "Unemployed",
        hasRefrigerator: se.hasRefrigerator || false,
        hasTelevision: se.hasTelevision || false,
        hasPersonalVehicle: se.hasPersonalVehicle || false,
        hasComputer: se.hasComputer || false,
        hasInternet: se.hasInternet || false,
        socioNotes: se.notes || "",
      },
    });

    if (data.medicalHistory) {
      await prisma.medicalHistory.create({
        data: {
          patientId: patient.id,
          chronicConditions: JSON.stringify(data.medicalHistory.chronicConditions || []),
          lifestyleFactors: JSON.stringify(data.medicalHistory.lifestyleFactors || []),
          familyHistory: JSON.stringify(data.medicalHistory.familyHistory || []),
          allergies: data.medicalHistory.allergies || "None",
          existingMedications: data.medicalHistory.existingMedications || "None",
          priorCardiacProcedures: JSON.stringify(data.medicalHistory.priorCardiacProcedures || []),
          updatedBy: authUser.name,
        },
      });
    }

    await prisma.auditLog.create({
      data: {
        id: generateAuditId(),
        userName: authUser.name,
        action: "Patient Registered",
        entityType: "Patient",
        entityId: patient.id,
        details: `Registered patient ${patient.fullName} (${patient.id})`,
      },
    });

    return NextResponse.json(transformPatient(patient));
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    console.error("Create patient error:", err);
    return NextResponse.json({ error: "Failed to create patient" }, { status: 500 });
  }
}
