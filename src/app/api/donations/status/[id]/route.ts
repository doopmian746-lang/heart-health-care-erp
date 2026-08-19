import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const donation = await prisma.donorPayment.findUnique({
      where: { id },
      select: {
        id: true,
        donorName: true,
        amount: true,
        paymentStatus: true,
        transactionId: true,
        paymentDate: true,
      },
    });
    if (!donation) {
      return NextResponse.json({ error: "Donation not found" }, { status: 404 });
    }
    return NextResponse.json(donation);
  } catch (err) {
    return NextResponse.json({ error: "Failed to get donation status" }, { status: 500 });
  }
}
