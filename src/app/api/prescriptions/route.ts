import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    const prescriptions = await prisma.prescription.findMany({
      orderBy: { date: "desc" },
      include: { items: true },
    });
    const mapped = prescriptions.map((p) => ({
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
    return NextResponse.json(mapped);
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Failed to fetch prescriptions" }, { status: 500 });
  }
}
