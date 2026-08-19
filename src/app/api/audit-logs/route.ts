import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await requireRole(request, "Admin");
    const logs = await prisma.auditLog.findMany({ orderBy: { timestamp: "desc" }, take: 100 });
    return NextResponse.json(logs);
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 });
  }
}
