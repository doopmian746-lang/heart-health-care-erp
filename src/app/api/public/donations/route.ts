import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { donorName, email, phone, amount, paymentMethod, projectSponsorship, notes, transactionId } = await request.json();

    if (!donorName || !donorName.trim()) {
      return NextResponse.json({ error: "Donor name is required" }, { status: 400 });
    }
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Valid donation amount is required" }, { status: 400 });
    }
    if (!transactionId || !transactionId.trim()) {
      return NextResponse.json({ error: "Transaction ID is required as payment proof" }, { status: 400 });
    }

    const id = `DON-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const receiptNumber = `RCT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`;

    await prisma.donorPayment.create({
      data: {
        id,
        donorName: donorName.trim(),
        email: email || "",
        phone: phone || "",
        amount,
        paymentMethod: paymentMethod || "Bank Transfer",
        projectSponsorship: projectSponsorship || "General Cardiac Fund",
        receiptNumber,
        notes: notes || "",
        transactionId: transactionId.trim(),
        paymentStatus: "Pending",
      },
    });

    return NextResponse.json({
      success: true,
      id,
      receiptNumber,
      paymentStatus: "Pending",
      message: `Thank you ${donorName}! Your donation of Rs. ${amount.toLocaleString()} has been submitted. Receipt: ${receiptNumber}. Your donation will be verified by our team shortly.`,
    });
  } catch (err) {
    console.error("Donation error:", err);
    return NextResponse.json({ error: "Failed to process donation" }, { status: 500 });
  }
}
