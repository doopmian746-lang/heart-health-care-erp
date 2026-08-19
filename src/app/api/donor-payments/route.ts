import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { createDonorSchema } from "@/lib/validations";
import { generateDonorPaymentId, generateReceiptNumber, generateAuditId } from "@/lib/id-generator";

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    const payments = await prisma.donorPayment.findMany({ orderBy: { paymentDate: "desc" } });
    return NextResponse.json(payments);
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Failed to fetch donor payments" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const parsed = createDonorSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.errors }, { status: 400 });
    }
    const data = parsed.data;
    const newPayment = await prisma.donorPayment.create({
      data: {
        id: generateDonorPaymentId(),
        donorName: data.donorName,
        email: data.email || "",
        phone: data.phone || "",
        amount: Number(data.amount),
        paymentMethod: data.paymentMethod || "Bank Transfer",
        projectSponsorship: data.projectSponsorship || "General Cardiac Fund",
        receiptNumber: generateReceiptNumber(),
        notes: data.notes || "",
      },
    });
    await prisma.auditLog.create({
      data: {
        id: generateAuditId(),
        userName: user.name,
        action: "Donor Payment Registered",
        entityType: "Donor",
        entityId: newPayment.id,
        details: `Registered donation of PKR ${newPayment.amount} from ${data.donorName}`,
      },
    });
    return NextResponse.json(newPayment);
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Failed to create donor payment" }, { status: 500 });
  }
}
