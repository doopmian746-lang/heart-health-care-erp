import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const donations = await prisma.donorPayment.findMany({
      where: { paymentStatus: "Verified" },
      select: {
        donorName: true,
        amount: true,
        paymentDate: true,
        projectSponsorship: true,
        paymentStatus: true,
      },
      orderBy: { paymentDate: "desc" },
      take: 10,
    });
    return NextResponse.json(donations);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch donations" }, { status: 500 });
  }
}
