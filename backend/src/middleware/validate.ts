import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

export function validate(schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const errors = result.error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      res.status(400).json({ error: 'Validation failed', details: errors });
      return;
    }
    req[source] = result.data;
    next();
  };
}

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const updatePatientSchema = z.object({
  fullName: z.string().min(1).optional(),
  fatherHusbandName: z.string().optional(),
  cnic: z.string().optional(),
  dob: z.string().optional(),
  age: z.number().int().min(0).max(150).optional(),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  maritalStatus: z.enum(['Single', 'Married', 'Widowed', 'Divorced']).optional(),
  occupation: z.string().optional(),
  mobile: z.string().optional(),
  alternateContact: z.string().optional(),
  address: z.string().optional(),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown']).optional(),
  photo: z.string().optional(),
  referredBy: z.string().optional(),
  socioEconomic: z.object({
    housingStatus: z.enum(['Owned', 'Rented', 'With Family', 'Shelter', 'Other']).optional(),
    houseType: z.enum(['House', 'Apartment', 'Room', 'Katchi Abadi', 'Other']).optional(),
    numberOfRooms: z.number().int().min(0).optional(),
    monthlyRent: z.number().min(0).optional(),
    ownsLand: z.boolean().optional(),
    landAcres: z.number().min(0).optional(),
    monthlyElectricityBill: z.number().min(0).optional(),
    waterSource: z.enum(['Tap', 'Borewell', 'Tank', 'Community Tap', 'Other']).optional(),
    toiletType: z.enum(['Flush', 'Pit Latrine', 'Community', 'None']).optional(),
    cookingFuel: z.enum(['Gas', 'Electric', 'Kerosene', 'Wood', 'Coal', 'Other']).optional(),
    monthlyHouseholdIncome: z.number().min(0).optional(),
    numberOfDependents: z.number().int().min(0).optional(),
    numberOfEarningMembers: z.number().int().min(0).optional(),
    educationLevel: z.enum(['None', 'Primary', 'Middle', 'Matric', 'Intermediate', 'Graduate', 'Post Graduate', 'Technical Diploma']).optional(),
    employmentStatus: z.enum(['Employed', 'Self-Employed', 'Unemployed', 'Retired', 'Homemaker', 'Student', 'Disabled']).optional(),
    hasRefrigerator: z.boolean().optional(),
    hasTelevision: z.boolean().optional(),
    hasPersonalVehicle: z.boolean().optional(),
    hasComputer: z.boolean().optional(),
    hasInternet: z.boolean().optional(),
    notes: z.string().optional(),
  }).optional(),
});

export const createPatientSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  fatherHusbandName: z.string().optional().default(''),
  cnic: z.string().optional().default(''),
  dob: z.string().optional().default(''),
  age: z.number().int().min(0).max(150).optional().default(0),
  gender: z.enum(['Male', 'Female', 'Other']).optional().default('Male'),
  maritalStatus: z.enum(['Single', 'Married', 'Widowed', 'Divorced']).optional().default('Single'),
  occupation: z.string().optional().default(''),
  mobile: z.string().optional().default(''),
  alternateContact: z.string().optional().default(''),
  address: z.string().optional().default(''),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown']).optional().default('Unknown'),
  photo: z.string().optional().default(''),
  referredBy: z.string().optional().default(''),
  socioEconomic: z.object({
    housingStatus: z.enum(['Owned', 'Rented', 'With Family', 'Shelter', 'Other']).optional().default('Owned'),
    houseType: z.enum(['House', 'Apartment', 'Room', 'Katchi Abadi', 'Other']).optional().default('House'),
    numberOfRooms: z.number().int().min(0).optional().default(0),
    monthlyRent: z.number().min(0).optional().default(0),
    ownsLand: z.boolean().optional().default(false),
    landAcres: z.number().min(0).optional().default(0),
    monthlyElectricityBill: z.number().min(0).optional().default(0),
    waterSource: z.enum(['Tap', 'Borewell', 'Tank', 'Community Tap', 'Other']).optional().default('Tap'),
    toiletType: z.enum(['Flush', 'Pit Latrine', 'Community', 'None']).optional().default('Flush'),
    cookingFuel: z.enum(['Gas', 'Electric', 'Kerosene', 'Wood', 'Coal', 'Other']).optional().default('Gas'),
    monthlyHouseholdIncome: z.number().min(0).optional().default(0),
    numberOfDependents: z.number().int().min(0).optional().default(0),
    numberOfEarningMembers: z.number().int().min(0).optional().default(0),
    educationLevel: z.enum(['None', 'Primary', 'Middle', 'Matric', 'Intermediate', 'Graduate', 'Post Graduate', 'Technical Diploma']).optional().default('None'),
    employmentStatus: z.enum(['Employed', 'Self-Employed', 'Unemployed', 'Retired', 'Homemaker', 'Student', 'Disabled']).optional().default('Unemployed'),
    hasRefrigerator: z.boolean().optional().default(false),
    hasTelevision: z.boolean().optional().default(false),
    hasPersonalVehicle: z.boolean().optional().default(false),
    hasComputer: z.boolean().optional().default(false),
    hasInternet: z.boolean().optional().default(false),
    notes: z.string().optional().default(''),
  }).optional(),
  medicalHistory: z.object({
    chronicConditions: z.array(z.string()).optional().default([]),
    lifestyleFactors: z.array(z.string()).optional().default([]),
    familyHistory: z.array(z.string()).optional().default([]),
    allergies: z.string().optional().default('None'),
    existingMedications: z.string().optional().default('None'),
    priorCardiacProcedures: z.array(z.string()).optional().default([]),
  }).optional(),
});

export const createConsultationSchema = z.object({
  vitals: z.object({
    bpSystolic: z.number().int().min(0).optional().default(120),
    bpDiastolic: z.number().int().min(0).optional().default(80),
    pulse: z.number().int().min(0).optional().default(72),
    weight: z.number().min(0).optional().default(70),
    height: z.number().min(0).optional().default(170),
    bmi: z.number().min(0).optional().default(24.2),
    spo2: z.number().int().min(0).max(100).optional().default(98),
  }).optional(),
  chiefComplaint: z.string().optional().default(''),
  symptoms: z.string().optional().default(''),
  examinationFindings: z.string().optional().default(''),
  diagnosis: z.string().optional().default(''),
  doctorNotes: z.string().optional().default(''),
  investigations: z.string().optional().default(''),
  procedures: z.string().optional().default(''),
  referrals: z.string().optional().default(''),
  foundationReferral: z.boolean().optional().default(false),
  requirements: z.string().optional().default(''),
  followUpDate: z.string().optional().default(''),
  followUpInstructions: z.string().optional().default(''),
});

export const createPrescriptionSchema = z.object({
  consultationId: z.string().optional().default(''),
  items: z.array(z.object({
    medicineId: z.string(),
    medicineName: z.string(),
    strength: z.string().optional().default(''),
    dosage: z.string().optional().default(''),
    frequency: z.string().optional().default(''),
    duration: z.string().optional().default(''),
    instructions: z.string().optional().default(''),
  })).optional().default([]),
  lifestyleRecommendations: z.string().optional().default(''),
});

export const createInventorySchema = z.object({
  medicineName: z.string().min(1, 'Medicine name is required'),
  category: z.string().optional().default(''),
  supplier: z.string().optional().default(''),
  batchNumber: z.string().min(1, 'Batch number is required'),
  purchaseDate: z.string().optional().default(''),
  expiryDate: z.string().optional().default(''),
  quantityAvailable: z.number().int().min(0).optional().default(0),
  minimumStockLevel: z.number().int().min(0).optional().default(50),
  unitPrice: z.number().min(0).optional().default(0),
});

export const createAssistanceSchema = z.object({
  patientId: z.string().min(1),
  type: z.string().optional(),
  estimatedCost: z.number().min(0),
  patientContribution: z.number().min(0).optional().default(0),
  foundationContribution: z.number().min(0).optional(),
  justification: z.string().optional().default(''),
});

export const createDonorSchema = z.object({
  donorName: z.string().min(1, 'Donor name is required'),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional().default(''),
  amount: z.number().min(1, 'Amount must be positive'),
  paymentMethod: z.string().optional().default('Bank Transfer'),
  projectSponsorship: z.string().optional().default('General Cardiac Fund'),
  notes: z.string().optional().default(''),
});

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  role: z.enum(['Admin', 'Doctor', 'Receptionist', 'Pharmacy Staff', 'Lab Staff']),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const createFileRequestSchema = z.object({
  patientId: z.string().min(1),
  purpose: z.string().min(1, 'Purpose is required'),
  urgency: z.enum(['Low', 'Medium', 'High', 'Emergency']).optional().default('Medium'),
});
