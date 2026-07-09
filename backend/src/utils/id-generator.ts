export function generatePatientId(nextNum: number): string {
  return `P-${nextNum}`;
}

export function generatePatientCode(nextNum: number): string {
  const year = new Date().getFullYear().toString().slice(-2);
  const suffix = String(nextNum).padStart(4, '0');
  return `HH-${year}-${suffix}`;
}

export function generateConsultationId(nextNum: number): string {
  return `C-${2000 + nextNum}`;
}

export function generatePrescriptionId(nextNum: number): string {
  return `PR-${3000 + nextNum}`;
}

export function generateMedicineIssueId(nextNum: number): string {
  return `DI-${4000 + nextNum}`;
}

export function generateAssistanceId(nextNum: number): string {
  return `FA-${5000 + nextNum}`;
}

export function generateFileRequestId(nextNum: number): string {
  return `FR-${6000 + nextNum}`;
}

export function generateDonorPaymentId(): string {
  return `DP-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function generateUserId(nextNum: number): string {
  return `u-${nextNum}`;
}

export function generateAuditId(): string {
  return `a-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function generateInventoryId(nextNum: number): string {
  return `m-${10 + nextNum}`;
}

export function generateReceiptNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(100 + Math.random() * 900);
  return `HHCF-REC-${year}-${rand}`;
}
