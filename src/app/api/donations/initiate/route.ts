import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateDonorPaymentId, generateReceiptNumber, generateAuditId } from "@/lib/id-generator";

const CASHMAAL_PAY_URL = "https://cmaal.com/Pay/";

export async function POST(request: Request) {
  try {
    const { donorName, email, phone, amount, currency, projectSponsorship, payMethod, notes } = await request.json();
    if (!donorName || !email || !amount || amount <= 0) {
      return NextResponse.json({ error: "Donor name, email, and valid amount are required" }, { status: 400 });
    }
    const cashmaalWebId = process.env.CASHMAAL_WEB_ID;
    if (!cashmaalWebId) {
      return NextResponse.json({ error: "Payment system not configured. Please contact administrator." }, { status: 500 });
    }

    const donationId = generateDonorPaymentId();
    const receiptNumber = generateReceiptNumber();

    await prisma.donorPayment.create({
      data: {
        id: donationId,
        donorName,
        email: email || "",
        phone: phone || "",
        amount: Number(amount),
        paymentMethod: payMethod || "Online",
        projectSponsorship: projectSponsorship || "General Cardiac Fund",
        receiptNumber,
        notes: notes || "",
        paymentStatus: "Pending",
      },
    });

    const successUrl = `${process.env.BACKEND_URL || ""}/api/donations/verify`;
    const cancelUrl = `${process.env.SITE_URL || ""}/donate`;
    const formData = new URLSearchParams();
    formData.append("pay_method", payMethod || "");
    formData.append("amount", amount.toString());
    formData.append("currency", currency === "USD" ? "USD" : "PKR");
    formData.append("succes_url", successUrl);
    formData.append("cancel_url", cancelUrl);
    formData.append("client_email", email);
    formData.append("web_id", cashmaalWebId);
    formData.append("order_id", donationId);
    formData.append("addi_info", `Donation: ${donorName} - ${projectSponsorship || "General"}`);

    const redirectHtml = `<!DOCTYPE html><html><head><title>Redirecting to Payment...</title></head><body><form id="cashmaal-form" action="${CASHMAAL_PAY_URL}" method="POST"><input type="hidden" name="pay_method" value="${payMethod || ""}" /><input type="hidden" name="amount" value="${amount}" /><input type="hidden" name="currency" value="${currency === "USD" ? "USD" : "PKR"}" /><input type="hidden" name="succes_url" value="${successUrl}" /><input type="hidden" name="cancel_url" value="${cancelUrl}" /><input type="hidden" name="client_email" value="${email}" /><input type="hidden" name="web_id" value="${cashmaalWebId}" /><input type="hidden" name="order_id" value="${donationId}" /><input type="hidden" name="addi_info" value="Donation: ${donorName} - ${projectSponsorship || "General"}" /><noscript><button type="submit">Click here to pay</button></noscript></form><script>document.getElementById('cashmaal-form').submit();</script></body></html>`;

    await prisma.auditLog.create({
      data: {
        id: generateAuditId(),
        userName: "Public",
        action: "Donation Initiated",
        entityType: "Donor",
        entityId: donationId,
        details: `Online donation of ${currency || "PKR"} ${amount} from ${donorName}`,
      },
    });

    return new NextResponse(redirectHtml, { headers: { "Content-Type": "text/html" } });
  } catch (err: any) {
    console.error("Donation initiation error:", err);
    return NextResponse.json({ error: "Failed to initiate donation" }, { status: 500 });
  }
}
