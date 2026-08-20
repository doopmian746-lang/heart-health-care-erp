import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const url = process.env.DATABASE_URL;
    const pgPrismaUrl = process.env.POSTGRES_PRISMA_URL;
    return NextResponse.json({ 
      status: "ok", 
      DATABASE_URL: url ? "set (" + url.substring(0, 20) + "...)" : "MISSING",
      POSTGRES_PRISMA_URL: pgPrismaUrl ? "set" : "MISSING",
    });
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}
