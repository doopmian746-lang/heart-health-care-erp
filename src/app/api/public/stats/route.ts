import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const totalPatients = await prisma.patient.count();
    const result = await prisma.donorPayment.aggregate({ _sum: { amount: true }, _count: true });
    const totalDonations = result._sum.amount || 0;
    const donationCount = result._count;
    const totalAssistance = await prisma.assistanceRequest.count({ where: { status: "Approved" } });
    const assistResult = await prisma.assistanceRequest.aggregate({ where: { status: "Approved" }, _sum: { foundationContribution: true } });
    const fundsGranted = assistResult._sum.foundationContribution || 0;

    return NextResponse.json({ totalPatients, totalDonations, donationCount, totalAssistance, fundsGranted });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
