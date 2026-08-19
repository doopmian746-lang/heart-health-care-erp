import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    const pending = await prisma.labOrder.count({ where: { status: "Pending" } });
    const inProgress = await prisma.labOrder.count({ where: { status: "In Progress" } });
    const completed = await prisma.labOrder.count({ where: { status: "Completed" } });
    const todayStr = new Date().toISOString().split("T")[0];
    const todayOrders = await prisma.labOrder.count({
      where: { orderDate: { gte: new Date(todayStr), lt: new Date(new Date(todayStr).getTime() + 86400000) } },
    });
    const totalTests = await prisma.labTest.count({ where: { isActive: true } });
    return NextResponse.json({ pending, inProgress, completed, todayOrders, totalTests });
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Failed to fetch lab stats" }, { status: 500 });
  }
}
