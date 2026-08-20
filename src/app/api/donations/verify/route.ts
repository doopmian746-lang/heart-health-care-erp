import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateAuditId } from "@/lib/id-generator";

const CASHMAAL_VERIFY_URL = "https://api.cmaal.com/verify_v2";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const CM_TID = searchParams.get("CM_TID");
    const siteUrl = process.env.SITE_URL || "https://heart-health-care-erp.vercel.app";
    const cashmaalWebId = process.env.CASHMAAL_WEB_ID;

    if (!CM_TID) {
      return NextResponse.redirect(`${siteUrl}/donate?status=error&message=Missing+transaction+ID`);
    }

    try {
      const url = `${CASHMAAL_VERIFY_URL}?CM_TID=${encodeURIComponent(CM_TID)}&web_id=${encodeURIComponent(cashmaalWebId || "")}`;
      const response = await fetch(url);
      if (!response.ok) {
        return NextResponse.redirect(`${siteUrl}/donate?status=failed&message=Payment+verification+failed`);
      }
      const result = await response.json();
      if (result.status !== "1") {
        return NextResponse.redirect(`${siteUrl}/donate?status=failed&message=Payment+verification+failed`);
      }

      const orderId = result.order_id;
      const existing = await prisma.donorPayment.findUnique({ where: { id: orderId } });
      if (existing) {
        await prisma.donorPayment.update({
          where: { id: orderId },
          data: {
            transactionId: result.transaction_id,
            paymentStatus: "Verified",
            verificationDate: new Date(),
            notes: `${existing.notes || ""} | CashMaal TID: ${result.transaction_id}`,
          },
        });
        await prisma.auditLog.create({
          data: {
            id: generateAuditId(),
            userName: "System",
            action: "Donation Verified via CashMaal",
            entityType: "Donor",
            entityId: orderId,
            details: `Payment of ${result.PKR_amount || result.USD_amount} verified. CashMaal TID: ${result.transaction_id}`,
          },
        });
      }

      return NextResponse.redirect(`${siteUrl}/donate?status=success&transactionId=${result.transaction_id}&amount=${result.PKR_amount || result.USD_amount}&currency=${result.currency || "PKR"}`);
    } catch {
      return NextResponse.redirect(`${siteUrl}/donate?status=error&message=Verification+service+unavailable`);
    }
  } catch (err: any) {
    const siteUrl = process.env.SITE_URL || "https://heart-health-care-erp.vercel.app";
    return NextResponse.redirect(`${siteUrl}/donate?status=error&message=Internal+error`);
  }
}
