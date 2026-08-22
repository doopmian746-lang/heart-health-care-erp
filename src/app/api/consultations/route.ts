import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { transformConsultation } from "@/lib/transformers";

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    const consultations = await prisma.consultation.findMany({ orderBy: { visitDate: "desc" } });
    return NextResponse.json(consultations.map(transformConsultation));
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Failed to fetch consultations" }, { status: 500 });
  }
}
