import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await requireRole(request, "Admin");
    const logs = await prisma.auditLog.findMany({ orderBy: { timestamp: "desc" }, take: 100 });
    const transformed = logs.map(l => ({
      id: l.id,
      timestamp: l.timestamp,
      user: l.userName,
      action: l.action,
      entityType: l.entityType,
      entityId: l.entityId,
      details: l.details,
    }));
    return NextResponse.json(transformed);
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 });
  }
}
