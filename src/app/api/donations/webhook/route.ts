import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateAuditId } from "@/lib/id-generator";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const params = new URLSearchParams(body);
    const ipnKey = params.get("ipn_key");
    const cashmaalIpnKey = process.env.CASHMAAL_IPN_KEY;

    if (ipnKey !== cashmaalIpnKey) {
      return new NextResponse("Invalid IPN key", { status: 403 });
    }

    const status = params.get("status");
    const CM_TID = params.get("CM_TID");
    const Amount = params.get("Amount");
    const order_id = params.get("order_id");

    if (status === "1" && order_id) {
      const existing = await prisma.donorPayment.findUnique({ where: { id: order_id } });
      if (existing) {
        await prisma.donorPayment.update({
          where: { id: order_id },
          data: {
            transactionId: CM_TID || "",
            paymentStatus: "Verified",
            verificationDate: new Date(),
          },
        });
        await prisma.auditLog.create({
          data: {
            id: generateAuditId(),
            userName: "System",
            action: "Donation Verified via IPN",
            entityType: "Donor",
            entityId: order_id,
            details: `IPN confirmed: PKR ${Amount}. CashMaal TID: ${CM_TID}`,
          },
        });
      }
    }

    return new NextResponse("**OK**", { status: 200 });
  } catch (err: any) {
    console.error("Webhook error:", err);
    return new NextResponse("**OK**", { status: 200 });
  }
}
