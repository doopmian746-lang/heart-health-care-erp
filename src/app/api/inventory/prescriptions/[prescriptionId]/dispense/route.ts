import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { generateMedicineIssueId, generateAuditId } from "@/lib/id-generator";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ prescriptionId: string }> }
) {
  try {
    const user = await requireRole(request, "Admin", "Pharmacy Staff");
    const { prescriptionId } = await params;
    const prescription = await prisma.prescription.findUnique({ where: { id: prescriptionId } });
    if (!prescription) {
      return NextResponse.json({ error: "Prescription not found" }, { status: 404 });
    }

    const { items, paymentStatus, sponsorshipId } = await request.json();
    if (!items || !items.length) {
      return NextResponse.json({ error: "No medicines specified" }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const issueItems: Array<{
        medicineId: string;
        medicineName: string;
        batchNumber: string;
        quantityIssued: number;
      }> = [];

      for (const issueReq of items) {
        const medItem = await tx.inventory.findUnique({ where: { id: issueReq.medicineId } });
        if (medItem) {
          const qtyToDeduct = Math.min(medItem.quantityAvailable, parseInt(issueReq.quantityIssued) || 0);
          await tx.inventory.update({
            where: { id: medItem.id },
            data: { quantityAvailable: { decrement: qtyToDeduct } },
          });
          issueItems.push({
            medicineId: medItem.id,
            medicineName: medItem.medicineName,
            batchNumber: medItem.batchNumber,
            quantityIssued: qtyToDeduct,
          });
        }
      }

      const count = await tx.medicineIssue.count();
      const newIssue = await tx.medicineIssue.create({
        data: {
          id: generateMedicineIssueId(count + 1),
          prescriptionId,
          patientId: prescription.patientId,
          issuedBy: user.name || "Pharmacist",
          paymentStatus: paymentStatus || "Fully Paid",
          sponsorshipId: sponsorshipId || null,
          items: {
            create: issueItems.map((item) => ({
              medicineId: item.medicineId,
              medicineName: item.medicineName,
              batchNumber: item.batchNumber,
              quantityIssued: item.quantityIssued,
            })),
          },
        },
        include: { items: true },
      });

      await tx.prescription.update({
        where: { id: prescriptionId },
        data: { status: "Dispensed" },
      });

      return newIssue;
    });

    await prisma.auditLog.create({
      data: {
        id: generateAuditId(),
        userName: user.name,
        action: "Medicines Dispensed",
        entityType: "Dispensing",
        entityId: result.id,
        details: `Dispensed against Rx ${prescriptionId}`,
      },
    });
    return NextResponse.json(result);
  } catch (err: any) {
    if (err instanceof NextResponse) return err;
    return NextResponse.json({ error: "Failed to dispense medicines" }, { status: 500 });
  }
}
