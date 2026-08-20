import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const url = process.env.DATABASE_URL;
    return NextResponse.json({ 
      status: "ok",
      DATABASE_URL: url ? "set" : "MISSING",
      node: process.version,
    });
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}
