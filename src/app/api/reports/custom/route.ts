import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function buildReport(start: Date, end: Date, period: string) {
  const [patients, consultations, prescriptions, inventory, assistance, donations, fileRequests] = await Promise.all([
    prisma.patient.findMany(), prisma.consultation.findMany(), prisma.prescription.findMany({ include: { items: true } }),
    prisma.inventory.findMany(), prisma.assistanceRequest.findMany(), prisma.donorPayment.findMany(), prisma.fileRequest.findMany(),
  ]);
  const f = <T extends Record<string, any>>(items: T[], df: string): T[] => items.filter((i) => { const d = i[df]; if (!d) return false; const dt = new Date(d); return dt >= start && dt <= end; });
  const pP = f(patients, "registrationDate"), cP = f(consultations, "visitDate"), prP = f(prescriptions, "date"), aP = f(assistance, "requestDate"), dP = f(donations, "paymentDate"), fP = f(fileRequests, "requestDate");
  return {
    period, dateRange: { start: start.toISOString().split("T")[0], end: end.toISOString().split("T")[0] },
    summary: { totalPatients: patients.length, newPatients: pP.length, totalConsultations: consultations.length, consultationsInPeriod: cP.length, totalPrescriptions: prescriptions.length, prescriptionsInPeriod: prP.length, totalDonations: donations.length, donationsInPeriod: dP.length, totalDonationAmount: dP.reduce((s, d) => s + d.amount, 0), totalAssistanceRequests: assistance.length, assistanceInPeriod: aP.length, assistanceGranted: aP.filter((a) => a.status === "Approved").reduce((s, a) => s + a.foundationContribution, 0), assistanceRequested: aP.reduce((s, a) => s + a.estimatedCost, 0), pendingAssistance: aP.filter((a) => a.status === "Pending").length, totalFileRequests: fileRequests.length, fileRequestsInPeriod: fP.length, lowStockCount: inventory.filter((m) => m.quantityAvailable <= m.minimumStockLevel).length, expiredCount: inventory.filter((m) => new Date(m.expiryDate) < new Date()).length, expiringSoonCount: 0 },
    recentConsultations: cP.slice(-10).reverse(), recentDonations: dP.slice(-10).reverse(),
  };
}

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    if (!startDate || !endDate) {
      return NextResponse.json({ error: "startDate and endDate are required" }, { status: 400 });
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    return NextResponse.json(await buildReport(start, end, "custom"));
  } catch (err: any) { if (err instanceof NextResponse) return err; return NextResponse.json({ error: "Failed to generate custom report" }, { status: 500 }); }
}
