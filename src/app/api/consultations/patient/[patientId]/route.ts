import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ patientId: string }> }
) {
  try {
    await requireAuth(request);
    const { patientId } = await params;
    const consultations = await prisma.consultation.findMany({
      where: { patientId },
      orderBy: { visitDate: "desc" },
    });
    return NextResponse.json(consultations);
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Failed to fetch consultations" }, { status: 500 });
  }
}
