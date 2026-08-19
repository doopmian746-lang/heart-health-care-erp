import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function buildReport(start: Date, end: Date, period: string) {
  const [patients, consultations, prescriptions, inventory, assistance, donations, fileRequests, users] = await Promise.all([
    prisma.patient.findMany(), prisma.consultation.findMany(), prisma.prescription.findMany({ include: { items: true } }),
    prisma.inventory.findMany(), prisma.assistanceRequest.findMany(), prisma.donorPayment.findMany(), prisma.fileRequest.findMany(), prisma.user.findMany(),
  ]);
  const filterByDate = <T extends Record<string, any>>(items: T[], df: string): T[] => items.filter((i) => { const d = i[df]; if (!d) return false; const dt = new Date(d); return dt >= start && dt <= end; });
  const pP = filterByDate(patients, "registrationDate"), cP = filterByDate(consultations, "visitDate"), prP = filterByDate(prescriptions, "date");
  const aP = filterByDate(assistance, "requestDate"), dP = filterByDate(donations, "paymentDate"), fP = filterByDate(fileRequests, "requestDate");
  const days: Record<string, any> = {}; const cur = new Date(start);
  while (cur <= end) { const k = cur.toISOString().split("T")[0]; days[k] = { consultations: 0, patients: 0, prescriptions: 0, donations: 0, assistance: 0 }; cur.setDate(cur.getDate() + 1); }
  cP.forEach((c) => { const k = c.visitDate.toISOString().split("T")[0]; if (days[k]) days[k].consultations++; });
  pP.forEach((p) => { const k = p.registrationDate.toISOString().split("T")[0]; if (days[k]) days[k].patients++; });
  prP.forEach((p) => { const k = p.date.toISOString().split("T")[0]; if (days[k]) days[k].prescriptions++; });
  dP.forEach((d) => { const k = d.paymentDate.toISOString().split("T")[0]; if (days[k]) days[k].donations++; });
  aP.forEach((a) => { const k = a.requestDate.toISOString().split("T")[0]; if (days[k]) days[k].assistance++; });
  const diagnosisCounts: Record<string, number> = {}; cP.forEach((c) => { const dx = c.diagnosis || "Unspecified"; diagnosisCounts[dx] = (diagnosisCounts[dx] || 0) + 1; });
  const medicineUsage: Record<string, number> = {}; prP.forEach((p) => { p.items.forEach((i) => { medicineUsage[i.medicineName] = (medicineUsage[i.medicineName] || 0) + 1; }); });
  const consultsByDoc: Record<string, number> = {}; cP.forEach((c) => { consultsByDoc[c.doctorName] = (consultsByDoc[c.doctorName] || 0) + 1; });
  return {
    period, dateRange: { start: start.toISOString().split("T")[0], end: end.toISOString().split("T")[0] },
    summary: { totalPatients: patients.length, newPatients: pP.length, totalConsultations: consultations.length, consultationsInPeriod: cP.length, totalPrescriptions: prescriptions.length, prescriptionsInPeriod: prP.length, totalDonations: donations.length, donationsInPeriod: dP.length, totalDonationAmount: dP.reduce((s, d) => s + d.amount, 0), totalAssistanceRequests: assistance.length, assistanceInPeriod: aP.length, assistanceGranted: aP.filter((a) => a.status === "Approved").reduce((s, a) => s + a.foundationContribution, 0), assistanceRequested: aP.reduce((s, a) => s + a.estimatedCost, 0), pendingAssistance: aP.filter((a) => a.status === "Pending").length, totalFileRequests: fileRequests.length, fileRequestsInPeriod: fP.length, lowStockCount: inventory.filter((m) => m.quantityAvailable <= m.minimumStockLevel).length, expiredCount: inventory.filter((m) => new Date(m.expiryDate) < new Date()).length, expiringSoonCount: 0 },
    dailyBreakdown: Object.entries(days).map(([date, data]) => ({ date, ...data })),
    topDiagnoses: Object.entries(diagnosisCounts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([diagnosis, count]) => ({ diagnosis, count })),
    topMedicines: Object.entries(medicineUsage).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([medicine, count]) => ({ medicine, count })),
    consultationsByDoctor: consultsByDoc,
    assistanceByType: aP.reduce((acc: Record<string, number>, a) => { acc[a.type || "Other"] = (acc[a.type || "Other"] || 0) + 1; return acc; }, {}),
    assistanceByStatus: { Pending: aP.filter((a) => a.status === "Pending").length, Approved: aP.filter((a) => a.status === "Approved").length, Rejected: aP.filter((a) => a.status === "Rejected").length },
    recentConsultations: cP.slice(-10).reverse(), recentDonations: dP.slice(-10).reverse(),
  };
}

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    const now = new Date(); const dow = now.getDay();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dow); start.setHours(0, 0, 0, 0);
    const end = new Date(start); end.setDate(end.getDate() + 6); end.setHours(23, 59, 59, 999);
    return NextResponse.json(await buildReport(start, end, "weekly"));
  } catch (err: any) { if (err instanceof NextResponse) return err; return NextResponse.json({ error: "Failed to generate weekly report" }, { status: 500 }); }
}
