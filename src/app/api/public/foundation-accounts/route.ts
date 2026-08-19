import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const accounts = await prisma.foundationAccount.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json(accounts);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 });
  }
}
