import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { prisma } = await import("@/lib/db");
    const count = await prisma.user.count();
    return NextResponse.json({ status: "ok", userCount: count, dbUrl: process.env.POSTGRES_PRISMA_URL ? "set" : "missing" });
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message, stack: err.stack?.substring(0, 500) }, { status: 500 });
  }
}
