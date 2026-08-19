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
    const requests = await prisma.fileRequest.findMany({
      where: { patientId },
      orderBy: { requestDate: "desc" },
    });
    return NextResponse.json(requests);
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Failed to fetch file requests" }, { status: 500 });
  }
}
