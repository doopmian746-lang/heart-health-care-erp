import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const staff = await prisma.user.findMany({
      where: { active: true },
      select: { id: true, username: true, name: true, role: true },
      orderBy: [{ role: "asc" }, { name: "asc" }],
    });
    return NextResponse.json(staff);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch staff" }, { status: 500 });
  }
}
