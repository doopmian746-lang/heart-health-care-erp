import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { transformConsultation } from "@/lib/transformers";

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    const patients = await prisma.patient.findMany();
    const consultations = await prisma.consultation.findMany();
    const inventory = await prisma.inventory.findMany();
    const assistance = await prisma.assistanceRequest.findMany();
    const labOrders = await prisma.labOrder.findMany();

    const todayStr = new Date().toISOString().split("T")[0];
    const todayConsultations = consultations.filter((c) => c.visitDate.toISOString().startsWith(todayStr));

    const pendingAssistance = assistance.filter((r) => r.status === "Pending");
    const lowStockMedicines = inventory.filter((m) => m.quantityAvailable <= m.minimumStockLevel);
    const totalFundsGranted = assistance
      .filter((r) => r.status === "Approved")
      .reduce((s, r) => s + r.foundationContribution, 0);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const counts = new Array(12).fill(0);
    patients.forEach((p) => {
      const month = new Date(p.registrationDate).getMonth();
      counts[month]++;
    });
    const monthlyRegistrations = months.map((month, i) => ({ month, count: counts[i] }));

    const labStats = {
      pending: labOrders.filter((o) => o.status === "Pending").length,
      inProgress: labOrders.filter((o) => o.status === "In Progress").length,
      completed: labOrders.filter((o) => o.status === "Completed").length,
      todayOrders: labOrders.filter((o) => o.orderDate.toISOString().startsWith(todayStr)).length,
      totalTests: await prisma.labTest.count({ where: { isActive: true } }),
    };

    return NextResponse.json({
      totalPatients: patients.length,
      todayConsultations: todayConsultations.length,
      pendingAssistance: pendingAssistance.length,
      lowStockMedicines: lowStockMedicines.length,
      totalFundsGranted,
      monthlyRegistrations,
      recentConsultations: consultations.slice(0, 5).map(transformConsultation),
      pendingRequests: pendingAssistance.slice(0, 5),
      lab: labStats,
    });
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 });
  }
}
