export type UserRole = 'Admin' | 'Doctor' | 'Receptionist' | 'Pharmacy Staff' | 'Lab Staff';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  active: boolean;
}

export type HousingStatus = 'Owned' | 'Rented' | 'With Family' | 'Shelter' | 'Other';
export type HouseType = 'House' | 'Apartment' | 'Room' | 'Katchi Abadi' | 'Other';
export type WaterSource = 'Tap' | 'Borewell' | 'Tank' | 'Community Tap' | 'Other';
export type ToiletType = 'Flush' | 'Pit Latrine' | 'Community' | 'None';
export type CookingFuel = 'Gas' | 'Electric' | 'Kerosene' | 'Wood' | 'Coal' | 'Other';
export type EmploymentStatus = 'Employed' | 'Self-Employed' | 'Unemployed' | 'Retired' | 'Homemaker' | 'Student' | 'Disabled';
export type EducationLevel = 'None' | 'Primary' | 'Middle' | 'Matric' | 'Intermediate' | 'Graduate' | 'Post Graduate' | 'Technical Diploma';

export interface PatientSocioEconomic {
  housingStatus: HousingStatus;
  houseType: HouseType;
  numberOfRooms: number;
  monthlyRent: number;
  ownsLand: boolean;
  landAcres: number;
  monthlyElectricityBill: number;
  waterSource: WaterSource;
  toiletType: ToiletType;
  cookingFuel: CookingFuel;
  monthlyHouseholdIncome: number;
  numberOfDependents: number;
  numberOfEarningMembers: number;
  educationLevel: EducationLevel;
  employmentStatus: EmploymentStatus;
  hasRefrigerator: boolean;
  hasTelevision: boolean;
  hasPersonalVehicle: boolean;
  hasComputer: boolean;
  hasInternet: boolean;
  notes: string;
}

export interface Patient {
  id: string;
  patientCode: string;
  fullName: string;
  fatherHusbandName: string;
  cnic: string;
  dob: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  maritalStatus: 'Single' | 'Married' | 'Widowed' | 'Divorced';
  occupation: string;
  mobile: string;
  alternateContact: string;
  address: string;
  bloodGroup: BloodGroup;
  photo: string;
  referredBy: string;
  registrationDate: string;
  createdBy: string;
  socioEconomic?: PatientSocioEconomic;
}

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Unknown';

export interface PatientMedicalHistory {
  patientId: string;
  chronicConditions: string[];
  lifestyleFactors: string[];
  familyHistory: string[];
  allergies: string;
  existingMedications: string;
  priorCardiacProcedures: string[];
  lastUpdated: string;
  updatedBy: string;
}

export interface Consultation {
  id: string;
  patientId: string;
  visitDate: string;
  vitals: Vitals;
  chiefComplaint: string;
  symptoms: string;
  examinationFindings: string;
  diagnosis: string;
  doctorNotes: string;
  investigations: string;
  procedures: string;
  referrals: string;
  foundationReferral: boolean;
  requirements: string;
  followUpDate: string;
  followUpInstructions: string;
  doctorName: string;
}

export interface Vitals {
  bpSystolic: number;
  bpDiastolic: number;
  pulse: number;
  weight: number;
  height: number;
  bmi: number;
  spo2: number;
}

export interface PrescriptionItem {
  medicineId: string;
  medicineName: string;
  strength: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface Prescription {
  id: string;
  consultationId: string;
  patientId: string;
  date: string;
  items: PrescriptionItem[];
  lifestyleRecommendations: string;
  doctorName: string;
  status: 'Pending' | 'Dispensed' | 'Partially Dispensed';
}

export interface InventoryItem {
  id: string;
  medicineName: string;
  category: string;
  supplier: string;
  batchNumber: string;
  purchaseDate: string;
  expiryDate: string;
  quantityAvailable: number;
  minimumStockLevel: number;
  unitPrice: number;
}

export interface FoundationAssistance {
  id: string;
  patientId: string;
  patientName: string;
  type?: string;
  estimatedCost: number;
  patientContribution: number;
  foundationContribution: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  justification: string;
  remarks: string;
  requestedBy: string;
  requestDate: string;
  approvedBy: string | null;
  approvalDate: string | null;
}

export interface MedicineIssueItem {
  medicineId: string;
  medicineName: string;
  batchNumber: string;
  quantityIssued: number;
}

export interface MedicineIssue {
  id: string;
  prescriptionId: string;
  patientId: string;
  issueDate: string;
  issuedBy: string;
  paymentStatus: 'Fully Paid' | 'Foundation Sponsored' | 'Partially Subsidized';
  sponsorshipId: string | null;
  items: MedicineIssueItem[];
}

export interface FileRequest {
  id: string;
  patientId: string;
  patientName: string;
  requestedBy: string;
  purpose: string;
  urgency: 'Low' | 'Medium' | 'High' | 'Emergency';
  status: 'Pending' | 'Fulfilled' | 'Rejected';
  requestDate: string;
  remarks?: string;
  fulfilledBy?: string;
  fulfillmentDate?: string;
}

export interface DonorPayment {
  id: string;
  donorName: string;
  email: string;
  phone: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  projectSponsorship?: string;
  receiptNumber: string;
  notes?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
}

export interface DashboardStats {
  totalPatients: number;
  todayConsultations: number;
  pendingAssistance: number;
  lowStockMedicines: number;
  totalFundsGranted: number;
  monthlyRegistrations: { month: string; count: number }[];
  recentConsultations: Consultation[];
  pendingRequests: FoundationAssistance[];
}

export interface PatientDetailResponse {
  patient: Patient;
  medicalHistory: PatientMedicalHistory | null;
  consultations: Consultation[];
  prescriptions: Prescription[];
  assistanceHistory: FoundationAssistance[];
}
