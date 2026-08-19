import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await requireAuth(request);
    const { passwordHash, ...safeUser } = user;
    return NextResponse.json(safeUser);
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
}
