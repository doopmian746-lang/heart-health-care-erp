import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;
const DEFAULT_PASSWORD = 'admin123';

async function main() {
  console.log('Seeding database...');

  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);

  // ─── Users ───────────────────────────────────────────────────────
  const users = [
    { id: 'u-1', username: 'admin', name: 'Dr. Bilal Ahmad', role: 'Admin', passwordHash: hashedPassword },
    { id: 'u-2', username: 'doctor', name: 'Dr. Sarah Chishti', role: 'Doctor', passwordHash: hashedPassword },
    { id: 'u-3', username: 'receptionist', name: 'Muhammad Ali', role: 'Receptionist', passwordHash: hashedPassword },
    { id: 'u-4', username: 'pharmacy', name: 'Fatima Noor', role: 'Pharmacy Staff', passwordHash: hashedPassword },
    { id: 'u-5', username: 'lab', name: 'Zainab Qazi', role: 'Lab Staff', passwordHash: hashedPassword },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: user,
    });
  }
  console.log('Seeded 5 users');

  // ─── Patients ────────────────────────────────────────────────────
  const patients = [
    {
      id: 'P-1001',
      patientCode: 'HH-26-0001',
      fullName: 'Abdul Karim',
      fatherHusbandName: 'Karim Khan',
      age: 62,
      gender: 'Male',
      maritalStatus: 'Married',
      occupation: 'Retired Clerk',
      mobile: '0300-1234567',
      address: 'Street 4, Sector G-9, Islamabad',
      bloodGroup: 'B+',
      housingStatus: 'Rented',
      houseType: 'Room',
      numberOfRooms: 1,
      monthlyRent: 15000,
      ownsLand: false,
      landAcres: 0,
      monthlyElectricityBill: 3500,
      waterSource: 'Tap',
      toiletType: 'Flush',
      cookingFuel: 'Gas',
      monthlyHouseholdIncome: 15000,
      numberOfDependents: 4,
      numberOfEarningMembers: 1,
      educationLevel: 'Matric',
      employmentStatus: 'Retired',
      hasRefrigerator: true,
      hasTelevision: true,
      hasPersonalVehicle: false,
      hasComputer: false,
      hasInternet: false,
      socioNotes: 'Low income household with multiple dependents. Requires financial assistance for cardiac treatment.',
    },
    {
      id: 'P-1002',
      patientCode: 'HH-26-0002',
      fullName: 'Razia Begum',
      fatherHusbandName: 'Ahmed Shah',
      age: 54,
      gender: 'Female',
      maritalStatus: 'Married',
      occupation: 'Housewife',
      mobile: '0311-9876543',
      address: 'Flat 3B, Gulshan-e-Iqbal, Karachi',
      bloodGroup: 'A+',
      housingStatus: 'Owned',
      houseType: 'Apartment',
      numberOfRooms: 3,
      monthlyRent: 0,
      ownsLand: false,
      landAcres: 0,
      monthlyElectricityBill: 5000,
      waterSource: 'Tap',
      toiletType: 'Flush',
      cookingFuel: 'Gas',
      monthlyHouseholdIncome: 45000,
      numberOfDependents: 5,
      numberOfEarningMembers: 2,
      educationLevel: 'Intermediate',
      employmentStatus: 'Unemployed',
      hasRefrigerator: true,
      hasTelevision: true,
      hasPersonalVehicle: true,
      hasComputer: true,
      hasInternet: true,
      socioNotes: 'Middle-income household. Husband is sole earner supporting 5 dependents.',
    },
    {
      id: 'P-1003',
      patientCode: 'HH-26-0003',
      fullName: 'Kamran Shah',
      fatherHusbandName: 'Shah Mehmood',
      age: 45,
      gender: 'Male',
      maritalStatus: 'Single',
      occupation: 'Auto Rickshaw Driver',
      mobile: '0322-5551234',
      address: 'Chowk Shiranwala, Lahore',
      bloodGroup: 'O+',
      housingStatus: 'Rented',
      houseType: 'Room',
      numberOfRooms: 1,
      monthlyRent: 8000,
      ownsLand: false,
      landAcres: 0,
      monthlyElectricityBill: 2000,
      waterSource: 'Hand Pump',
      toiletType: 'Squat',
      cookingFuel: 'LPG',
      monthlyHouseholdIncome: 12000,
      numberOfDependents: 0,
      numberOfEarningMembers: 1,
      educationLevel: 'Primary',
      employmentStatus: 'Self-Employed',
      hasRefrigerator: false,
      hasTelevision: false,
      hasPersonalVehicle: true,
      hasComputer: false,
      hasInternet: false,
      socioNotes: 'Low-income single patient. Auto rickshaw is primary source of income. Limited savings.',
    },
  ];

  for (const patient of patients) {
    await prisma.patient.upsert({
      where: { id: patient.id },
      update: {},
      create: patient,
    });
  }
  console.log('Seeded 3 patients');

  // ─── Medical Histories ──────────────────────────────────────────
  const medicalHistories = [
    {
      patientId: 'P-1001',
      chronicConditions: JSON.stringify(['Hypertension', 'Type 2 Diabetes', 'Coronary Artery Disease']),
      lifestyleFactors: JSON.stringify(['Smoker (20 years)', 'Sedentary lifestyle', 'High salt diet']),
      familyHistory: JSON.stringify(['Father - Heart attack at 60', 'Mother - Diabetes']),
      allergies: 'Penicillin',
      existingMedications: 'Amlodipine 5mg, Metformin 500mg, Atorvastatin 20mg',
      priorCardiacProcedures: JSON.stringify(['Angioplasty with stent placement (2022)']),
      updatedBy: 'Dr. Sarah Chishti',
    },
    {
      patientId: 'P-1002',
      chronicConditions: JSON.stringify(['Hypertension', 'Hyperlipidemia', 'Hypothyroidism']),
      lifestyleFactors: JSON.stringify(['Non-smoker', 'Light physical activity', 'Balanced diet']),
      familyHistory: JSON.stringify(['Father - Hypertension', 'Sister - Heart disease at 50']),
      allergies: 'None',
      existingMedications: 'Losartan 50mg, Atorvastatin 10mg, Levothyroxine 50mcg',
      priorCardiacProcedures: JSON.stringify(['None']),
      updatedBy: 'Dr. Sarah Chishti',
    },
    {
      patientId: 'P-1003',
      chronicConditions: JSON.stringify(['Hypertension']),
      lifestyleFactors: JSON.stringify(['Ex-smoker (quit 2 years ago)', 'Moderate physical activity', 'Irregular meals']),
      familyHistory: JSON.stringify(['Father - Hypertension', 'Mother - Stroke at 70']),
      allergies: 'Aspirin',
      existingMedications: 'Amlodipine 10mg',
      priorCardiacProcedures: JSON.stringify(['None']),
      updatedBy: 'Dr. Sarah Chishti',
    },
  ];

  for (const history of medicalHistories) {
    await prisma.medicalHistory.upsert({
      where: { patientId: history.patientId },
      update: history,
      create: history,
    });
  }
  console.log('Seeded 3 medical histories');

  // ─── Inventory (9 cardiac medicines) ────────────────────────────
  const inventoryItems = [
    {
      id: 'm-10',
      medicineName: 'Amlodipine',
      category: 'Antihypertensive',
      supplier: 'Searle Pakistan',
      batchNumber: 'AML-2026-001',
      purchaseDate: '2026-01-15',
      expiryDate: '2028-01-14',
      quantityAvailable: 500,
      minimumStockLevel: 100,
      unitPrice: 12.5,
    },
    {
      id: 'm-11',
      medicineName: 'Atorvastatin',
      category: 'Statin',
      supplier: 'Getz Pharma',
      batchNumber: 'ATV-2026-002',
      purchaseDate: '2026-02-01',
      expiryDate: '2028-01-31',
      quantityAvailable: 350,
      minimumStockLevel: 80,
      unitPrice: 18.0,
    },
    {
      id: 'm-12',
      medicineName: 'Metformin',
      category: 'Antidiabetic',
      supplier: 'Sami Pharmaceuticals',
      batchNumber: 'MET-2026-003',
      purchaseDate: '2026-01-20',
      expiryDate: '2027-12-31',
      quantityAvailable: 600,
      minimumStockLevel: 150,
      unitPrice: 8.5,
    },
    {
      id: 'm-13',
      medicineName: 'Losartan',
      category: 'ARB',
      supplier: 'Hilton Pharma',
      batchNumber: 'LOS-2026-004',
      purchaseDate: '2026-03-10',
      expiryDate: '2028-03-09',
      quantityAvailable: 400,
      minimumStockLevel: 100,
      unitPrice: 22.0,
    },
    {
      id: 'm-14',
      medicineName: 'Clopidogrel',
      category: 'Antiplatelet',
      supplier: 'Abbott Pakistan',
      batchNumber: 'CLP-2026-005',
      purchaseDate: '2026-02-15',
      expiryDate: '2028-02-14',
      quantityAvailable: 300,
      minimumStockLevel: 80,
      unitPrice: 35.0,
    },
    {
      id: 'm-15',
      medicineName: 'Aspirin',
      category: 'Antiplatelet',
      supplier: 'Bayer Pakistan',
      batchNumber: 'ASP-2026-006',
      purchaseDate: '2026-01-10',
      expiryDate: '2027-12-31',
      quantityAvailable: 800,
      minimumStockLevel: 200,
      unitPrice: 3.0,
    },
    {
      id: 'm-16',
      medicineName: 'Furosemide',
      category: 'Diuretic',
      supplier: 'Searle Pakistan',
      batchNumber: 'FUR-2026-007',
      purchaseDate: '2026-02-20',
      expiryDate: '2027-11-30',
      quantityAvailable: 250,
      minimumStockLevel: 60,
      unitPrice: 10.0,
    },
    {
      id: 'm-17',
      medicineName: 'Metoprolol',
      category: 'Beta Blocker',
      supplier: 'AstraZeneca Pakistan',
      batchNumber: 'MET-2026-008',
      purchaseDate: '2026-03-01',
      expiryDate: '2028-02-28',
      quantityAvailable: 450,
      minimumStockLevel: 100,
      unitPrice: 25.0,
    },
    {
      id: 'm-18',
      medicineName: 'Nitroglycerin',
      category: 'Anti-Anginal',
      supplier: 'GlaxoSmithKline Pakistan',
      batchNumber: 'NTG-2026-009',
      purchaseDate: '2026-03-05',
      expiryDate: '2027-09-30',
      quantityAvailable: 200,
      minimumStockLevel: 50,
      unitPrice: 45.0,
    },
  ];

  for (const item of inventoryItems) {
    await prisma.inventory.upsert({
      where: { id: item.id },
      update: {},
      create: item,
    });
  }
  console.log('Seeded 9 inventory items');

  // ─── Consultations ──────────────────────────────────────────────
  const consultations = [
    {
      id: 'C-2001',
      patientId: 'P-1001',
      visitDate: new Date('2026-03-15T10:00:00Z'),
      bpSystolic: 155,
      bpDiastolic: 95,
      pulse: 88,
      weight: 82,
      height: 170,
      bmi: 28.4,
      spo2: 96,
      chiefComplaint: 'Chest pain and shortness of breath',
      symptoms: 'Intermittent chest tightness, dyspnea on exertion, occasional palpitations',
      examinationFindings: 'Mild cardiomegaly on auscultation, bilateral pedal edema, S3 gallop present',
      diagnosis: 'Unstable Angina, Hypertension, Type 2 Diabetes',
      doctorNotes: 'Patient presenting with worsening angina symptoms. ECG shows ST depression in leads V4-V6. Start on increased dose of antiplatelet therapy. Refer for cardiac catheterization.',
      followUpDate: '2026-04-15',
      followUpInstructions: 'Continue all medications. Follow low-salt diet. Report any worsening symptoms immediately.',
      doctorName: 'Dr. Sarah Chishti',
      investigations: 'ECG, Echocardiogram, CBC, Lipid Profile, HbA1c',
      procedures: 'None',
      referrals: 'Cardiology consultation for possible catheterization',
      requirements: 'Financial assistance for catheterization procedure',
      foundationReferral: true,
    },
    {
      id: 'C-2002',
      patientId: 'P-1002',
      visitDate: new Date('2026-03-20T14:30:00Z'),
      bpSystolic: 142,
      bpDiastolic: 88,
      pulse: 76,
      weight: 68,
      height: 155,
      bmi: 28.3,
      spo2: 97,
      chiefComplaint: 'Routine cardiac follow-up',
      symptoms: 'Mild dizziness on standing, occasional headache',
      examinationFindings: 'No acute distress, mild systolic murmur at apex, lungs clear',
      diagnosis: 'Hypertension, Hyperlipidemia, well-controlled',
      doctorNotes: 'BP slightly elevated but under control. Continue current medications. Lipid profile shows improvement. Schedule stress test in 3 months.',
      followUpDate: '2026-06-20',
      followUpInstructions: 'Maintain current medication regimen. Regular exercise as tolerated. Monitor blood pressure at home.',
      doctorName: 'Dr. Sarah Chishti',
      investigations: 'Lipid Profile, ECG, Renal Function Tests',
      procedures: 'None',
      referrals: 'None',
      requirements: 'None',
      foundationReferral: false,
    },
  ];

  for (const consultation of consultations) {
    await prisma.consultation.upsert({
      where: { id: consultation.id },
      update: {},
      create: consultation,
    });
  }
  console.log('Seeded 2 consultations');

  // ─── Prescriptions with Items ──────────────────────────────────
  // Prescription 1
  await prisma.prescription.upsert({
    where: { id: 'PR-3001' },
    update: {},
    create: {
      id: 'PR-3001',
      consultationId: 'C-2001',
      patientId: 'P-1001',
      date: new Date('2026-03-15T11:00:00Z'),
      lifestyleRecommendations: 'Quit smoking immediately. Reduce salt intake to less than 2g/day. Walk 30 minutes daily if possible. Avoid heavy meals.',
      doctorName: 'Dr. Sarah Chishti',
      status: 'Dispensed',
      items: {
        create: [
          {
            medicineId: 'm-15',
            medicineName: 'Aspirin',
            strength: '75mg',
            dosage: '1 tablet',
            frequency: 'Once daily',
            duration: 'Ongoing',
            instructions: 'Take after breakfast. Do not skip doses.',
          },
          {
            medicineId: 'm-14',
            medicineName: 'Clopidogrel',
            strength: '75mg',
            dosage: '1 tablet',
            frequency: 'Once daily',
            duration: '6 months',
            instructions: 'Take at bedtime. Report any unusual bleeding.',
          },
          {
            medicineId: 'm-11',
            medicineName: 'Atorvastatin',
            strength: '20mg',
            dosage: '1 tablet',
            frequency: 'Once daily at night',
            duration: 'Ongoing',
            instructions: 'Take at bedtime. Avoid grapefruit juice.',
          },
          {
            medicineId: 'm-12',
            medicineName: 'Metformin',
            strength: '500mg',
            dosage: '1 tablet',
            frequency: 'Twice daily',
            duration: 'Ongoing',
            instructions: 'Take with meals to reduce stomach upset.',
          },
          {
            medicineId: 'm-10',
            medicineName: 'Amlodipine',
            strength: '5mg',
            dosage: '1 tablet',
            frequency: 'Once daily',
            duration: 'Ongoing',
            instructions: 'Take in the morning. Do not stop suddenly.',
          },
        ],
      },
    },
  });

  // Prescription 2
  await prisma.prescription.upsert({
    where: { id: 'PR-3002' },
    update: {},
    create: {
      id: 'PR-3002',
      consultationId: 'C-2002',
      patientId: 'P-1002',
      date: new Date('2026-03-20T15:00:00Z'),
      lifestyleRecommendations: 'Continue light exercise. Monitor blood pressure daily. Maintain balanced diet. Reduce caffeine intake.',
      doctorName: 'Dr. Sarah Chishti',
      status: 'Pending',
      items: {
        create: [
          {
            medicineId: 'm-13',
            medicineName: 'Losartan',
            strength: '50mg',
            dosage: '1 tablet',
            frequency: 'Once daily',
            duration: 'Ongoing',
            instructions: 'Take in the morning with water. Monitor BP regularly.',
          },
          {
            medicineId: 'm-11',
            medicineName: 'Atorvastatin',
            strength: '10mg',
            dosage: '1 tablet',
            frequency: 'Once daily at night',
            duration: 'Ongoing',
            instructions: 'Take at bedtime.',
          },
          {
            medicineId: 'm-17',
            medicineName: 'Metoprolol',
            strength: '25mg',
            dosage: '1 tablet',
            frequency: 'Twice daily',
            duration: '3 months',
            instructions: 'Take morning and evening. Do not stop abruptly.',
          },
        ],
      },
    },
  });
  console.log('Seeded 2 prescriptions with items');

  // ─── Assistance Requests ───────────────────────────────────────
  const assistanceRequests = [
    {
      id: 'FA-5001',
      patientId: 'P-1001',
      patientName: 'Abdul Karim',
      type: 'Cardiac Catheterization',
      estimatedCost: 150000,
      patientContribution: 20000,
      foundationContribution: 130000,
      status: 'Approved',
      justification: 'Patient is a low-income retired clerk with multiple dependents. Requires cardiac catheterization for diagnosis of unstable angina. Cannot afford procedure on own.',
      remarks: 'Patient approved under compassionate care policy. Funds allocated from General Cardiac Fund.',
      requestedBy: 'Dr. Sarah Chishti',
      requestDate: new Date('2026-03-16T09:00:00Z'),
      approvedBy: 'Dr. Bilal Ahmad',
      approvalDate: new Date('2026-03-18T11:30:00Z'),
    },
    {
      id: 'FA-5002',
      patientId: 'P-1002',
      patientName: 'Razia Begum',
      type: 'Stress Test',
      estimatedCost: 25000,
      patientContribution: 10000,
      foundationContribution: 15000,
      status: 'Pending',
      justification: 'Patient requires stress test for cardiac evaluation. Middle-income household with 5 dependents. Financial assistance requested to reduce burden.',
      remarks: 'Awaiting verification of financial documents.',
      requestedBy: 'Dr. Sarah Chishti',
      requestDate: new Date('2026-03-21T10:00:00Z'),
      approvedBy: null,
      approvalDate: null,
    },
    {
      id: 'FA-5003',
      patientId: 'P-1003',
      patientName: 'Kamran Shah',
      type: 'Medication Sponsorship',
      estimatedCost: 5000,
      patientContribution: 0,
      foundationContribution: 5000,
      status: 'Pending',
      justification: 'Patient is a low-income auto rickshaw driver with no dependents. Requires monthly medication for hypertension. Cannot afford regular treatment.',
      remarks: 'Initial application received. Pending income verification.',
      requestedBy: 'Receptionist',
      requestDate: new Date('2026-03-22T08:00:00Z'),
      approvedBy: null,
      approvalDate: null,
    },
  ];

  for (const request of assistanceRequests) {
    await prisma.assistanceRequest.upsert({
      where: { id: request.id },
      update: {},
      create: request,
    });
  }
  console.log('Seeded 3 assistance requests');

  // ─── File Requests ─────────────────────────────────────────────
  const fileRequests = [
    {
      id: 'FR-6001',
      patientId: 'P-1001',
      patientName: 'Abdul Karim',
      requestedBy: 'Dr. Sarah Chishti',
      purpose: 'Transfer patient records to cardiology specialist for catheterization review',
      urgency: 'High',
      status: 'Fulfilled',
      requestDate: new Date('2026-03-16T12:00:00Z'),
      remarks: 'Records include all consultation notes, lab results, and ECG reports.',
      fulfilledBy: 'Muhammad Ali',
      fulfillmentDate: new Date('2026-03-17T09:30:00Z'),
    },
    {
      id: 'FR-6002',
      patientId: 'P-1002',
      patientName: 'Razia Begum',
      requestedBy: 'Dr. Sarah Chishti',
      purpose: 'Copy of lipid profile and ECG for stress test preparation',
      urgency: 'Medium',
      status: 'Pending',
      requestDate: new Date('2026-03-22T14:00:00Z'),
      remarks: 'Required for upcoming stress test appointment.',
      fulfilledBy: null,
      fulfillmentDate: null,
    },
  ];

  for (const fileRequest of fileRequests) {
    await prisma.fileRequest.upsert({
      where: { id: fileRequest.id },
      update: {},
      create: fileRequest,
    });
  }
  console.log('Seeded 2 file requests');

  // ─── Donor Payments ────────────────────────────────────────────
  const donorPayments = [
    {
      id: 'DP-7001',
      donorName: 'Ahmed Foundation',
      email: 'info@ahmedfoundation.org',
      phone: '021-34567890',
      amount: 500000,
      paymentDate: new Date('2026-01-10T09:00:00Z'),
      paymentMethod: 'Bank Transfer',
      projectSponsorship: 'General Cardiac Fund',
      receiptNumber: 'AHMED-2026-001',
      notes: 'Annual donation for cardiac patient assistance program.',
      transactionId: 'TXN-HBL-001234',
      paymentStatus: 'Verified',
      verifiedBy: 'Dr. Bilal Ahmad',
      verificationDate: new Date('2026-01-12T10:00:00Z'),
    },
    {
      id: 'DP-7002',
      donorName: 'Fatima Trust',
      email: 'donate@fatimatrust.com',
      phone: '042-39876543',
      amount: 250000,
      paymentDate: new Date('2026-02-20T11:30:00Z'),
      paymentMethod: 'Online Transfer',
      projectSponsorship: 'Pediatric Cardiac Unit',
      receiptNumber: 'FT-2026-045',
      notes: 'Donation specifically for pediatric cardiac care equipment.',
      transactionId: 'TXN-MCB-005678',
      paymentStatus: 'Verified',
      verifiedBy: 'Dr. Bilal Ahmad',
      verificationDate: new Date('2026-02-22T09:00:00Z'),
    },
    {
      id: 'DP-7003',
      donorName: 'Dr. Kamran Ali',
      email: 'kamran.ali@hospital.pk',
      phone: '0300-1112233',
      amount: 75000,
      paymentDate: new Date('2026-03-05T15:00:00Z'),
      paymentMethod: 'EasyPaisa',
      projectSponsorship: 'General Cardiac Fund',
      receiptNumber: 'KA-2026-012',
      notes: 'Personal donation from retired cardiologist.',
      transactionId: 'EP-9876543210',
      paymentStatus: 'Verified',
      verifiedBy: 'Muhammad Ali',
      verificationDate: new Date('2026-03-06T10:00:00Z'),
    },
  ];

  for (const payment of donorPayments) {
    await prisma.donorPayment.upsert({
      where: { id: payment.id },
      update: {},
      create: payment,
    });
  }
  console.log('Seeded 3 donor payments');

  // ─── Foundation Accounts ───────────────────────────────────────
  const foundationAccounts = [
    {
      id: 'FA-ACC-001',
      type: 'Bank',
      bankName: 'Habib Bank Limited (HBL)',
      accountTitle: 'Heart Health Care Foundation',
      accountNumber: '0123-4567-8901-2345',
      iban: 'PK32HABB0001234567890123',
      branchCode: '0123',
      phoneNumber: '',
      isActive: true,
      displayOrder: 1,
    },
    {
      id: 'FA-ACC-002',
      type: 'Bank',
      bankName: 'MCB Bank Limited',
      accountTitle: 'Heart Health Care Foundation',
      accountNumber: '9876-5432-1098-7654',
      iban: 'PK45MCB9876543210987654',
      branchCode: '0567',
      phoneNumber: '',
      isActive: true,
      displayOrder: 2,
    },
    {
      id: 'FA-ACC-003',
      type: 'Mobile Wallet',
      bankName: 'EasyPaisa',
      accountTitle: 'Heart Health Care Foundation',
      accountNumber: '',
      iban: '',
      branchCode: '',
      phoneNumber: '0300-1234567',
      isActive: true,
      displayOrder: 3,
    },
    {
      id: 'FA-ACC-004',
      type: 'Mobile Wallet',
      bankName: 'JazzCash',
      accountTitle: 'Heart Health Care Foundation',
      accountNumber: '',
      iban: '',
      branchCode: '',
      phoneNumber: '0311-9876543',
      isActive: true,
      displayOrder: 4,
    },
  ];

  for (const account of foundationAccounts) {
    await prisma.foundationAccount.upsert({
      where: { id: account.id },
      update: {},
      create: account,
    });
  }
  console.log('Seeded 4 foundation accounts');

  // ─── Lab Tests (20 cardiac tests) ──────────────────────────────
  const labTests = [
    {
      id: 'LT-001',
      testName: 'Complete Blood Count (CBC)',
      category: 'Hematology',
      description: 'Measures red blood cells, white blood cells, hemoglobin, hematocrit, and platelets',
      normalRange: 'WBC: 4,000-11,000/μL, RBC: 4.5-5.5 million/μL, Hb: 12-16 g/dL',
      unit: 'Various',
      cost: 800,
    },
    {
      id: 'LT-002',
      testName: 'Lipid Profile',
      category: 'Cardiology',
      description: 'Measures total cholesterol, LDL, HDL, and triglycerides',
      normalRange: 'Total Cholesterol: <200 mg/dL, LDL: <100 mg/dL, HDL: >40 mg/dL',
      unit: 'mg/dL',
      cost: 1200,
    },
    {
      id: 'LT-003',
      testName: 'HbA1c',
      category: 'Endocrinology',
      description: 'Glycated hemoglobin for diabetes monitoring',
      normalRange: '<5.7% (Normal), 5.7-6.4% (Pre-diabetes), ≥6.5% (Diabetes)',
      unit: '%',
      cost: 1500,
    },
    {
      id: 'LT-004',
      testName: 'Fasting Blood Glucose',
      category: 'Endocrinology',
      description: 'Blood sugar level after 8-12 hours of fasting',
      normalRange: '70-100 mg/dL',
      unit: 'mg/dL',
      cost: 500,
    },
    {
      id: 'LT-005',
      testName: 'Electrolytes Panel',
      category: 'Chemistry',
      description: 'Measures sodium, potassium, chloride, and bicarbonate levels',
      normalRange: 'Na: 135-145 mEq/L, K: 3.5-5.0 mEq/L',
      unit: 'mEq/L',
      cost: 900,
    },
    {
      id: 'LT-006',
      testName: 'Renal Function Tests (RFT)',
      category: 'Chemistry',
      description: 'Measures BUN, creatinine, and eGFR for kidney function',
      normalRange: 'Creatinine: 0.6-1.2 mg/dL, BUN: 7-20 mg/dL',
      unit: 'mg/dL',
      cost: 1000,
    },
    {
      id: 'LT-007',
      testName: 'Liver Function Tests (LFT)',
      category: 'Chemistry',
      description: 'Measures ALT, AST, ALP, bilirubin, and albumin',
      normalRange: 'ALT: 7-56 U/L, AST: 10-40 U/L',
      unit: 'U/L',
      cost: 1100,
    },
    {
      id: 'LT-008',
      testName: 'Thyroid Profile (TSH, T3, T4)',
      category: 'Endocrinology',
      description: 'Measures thyroid stimulating hormone and thyroid hormones',
      normalRange: 'TSH: 0.4-4.0 mIU/L, T3: 80-200 ng/dL, T4: 5-12 μg/dL',
      unit: 'Various',
      cost: 1800,
    },
    {
      id: 'LT-009',
      testName: 'Coagulation Profile',
      category: 'Hematology',
      description: 'Measures PT, INR, and aPTT for blood clotting',
      normalRange: 'PT: 11-13.5 seconds, INR: 0.8-1.2',
      unit: 'seconds',
      cost: 1300,
    },
    {
      id: 'LT-010',
      testName: 'Troponin I',
      category: 'Cardiology',
      description: 'Cardiac biomarker for myocardial infarction',
      normalRange: '<0.04 ng/mL',
      unit: 'ng/mL',
      cost: 2000,
    },
    {
      id: 'LT-011',
      testName: 'CK-MB',
      category: 'Cardiology',
      description: 'Creatine kinase isoenzyme for heart muscle damage',
      normalRange: '<25 U/L',
      unit: 'U/L',
      cost: 1500,
    },
    {
      id: 'LT-012',
      testName: 'BNP (Brain Natriuretic Peptide)',
      category: 'Cardiology',
      description: 'Marker for heart failure',
      normalRange: '<100 pg/mL',
      unit: 'pg/mL',
      cost: 2500,
    },
    {
      id: 'LT-013',
      testName: 'CRP (C-Reactive Protein)',
      category: 'Inflammation',
      description: 'Marker for systemic inflammation',
      normalRange: '<3.0 mg/L',
      unit: 'mg/L',
      cost: 1000,
    },
    {
      id: 'LT-014',
      testName: 'Homocysteine',
      category: 'Cardiology',
      description: 'Amino acid linked to cardiovascular risk',
      normalRange: '5-15 μmol/L',
      unit: 'μmol/L',
      cost: 1800,
    },
    {
      id: 'LT-015',
      testName: 'ECG (12-Lead)',
      category: 'Cardiology',
      description: 'Electrocardiogram to measure heart electrical activity',
      normalRange: 'Normal sinus rhythm',
      unit: 'N/A',
      cost: 1500,
    },
    {
      id: 'LT-016',
      testName: 'Echocardiogram',
      category: 'Cardiology',
      description: 'Ultrasound imaging of the heart structure and function',
      normalRange: 'EF: 55-70%, Normal valve function',
      unit: 'N/A',
      cost: 5000,
    },
    {
      id: 'LT-017',
      testName: 'Stress Test (Treadmill)',
      category: 'Cardiology',
      description: 'Exercise test to evaluate heart function under stress',
      normalRange: 'Normal exercise tolerance, no ST changes',
      unit: 'N/A',
      cost: 8000,
    },
    {
      id: 'LT-018',
      testName: 'Chest X-Ray',
      category: 'Radiology',
      description: 'Imaging of chest to evaluate heart size and lung condition',
      normalRange: 'Normal heart size, clear lung fields',
      unit: 'N/A',
      cost: 600,
    },
    {
      id: 'LT-019',
      testName: 'Urine Routine',
      category: 'Pathology',
      description: 'Routine urinalysis for kidney function and infection',
      normalRange: 'Clear, specific gravity 1.005-1.030',
      unit: 'N/A',
      cost: 400,
    },
    {
      id: 'LT-020',
      testName: 'Iron Studies',
      category: 'Hematology',
      description: 'Measures serum iron, ferritin, TIBC, and transferrin saturation',
      normalRange: 'Iron: 60-170 μg/dL, Ferritin: 12-300 ng/mL',
      unit: 'Various',
      cost: 1500,
    },
  ];

  for (const test of labTests) {
    await prisma.labTest.upsert({
      where: { id: test.id },
      update: {},
      create: test,
    });
  }
  console.log('Seeded 20 lab tests');

  // ─── Audit Logs (15) ──────────────────────────────────────────
  const auditLogs = [
    {
      id: 'AL-001',
      timestamp: new Date('2026-03-15T08:00:00Z'),
      userName: 'admin',
      action: 'User Login',
      entityType: 'User',
      entityId: 'u-1',
      details: 'Admin logged in successfully',
    },
    {
      id: 'AL-002',
      timestamp: new Date('2026-03-15T08:15:00Z'),
      userName: 'doctor',
      action: 'User Login',
      entityType: 'User',
      entityId: 'u-2',
      details: 'Doctor logged in successfully',
    },
    {
      id: 'AL-003',
      timestamp: new Date('2026-03-15T10:00:00Z'),
      userName: 'doctor',
      action: 'Patient Registration',
      entityType: 'Patient',
      entityId: 'P-1001',
      details: 'New patient Abdul Karim registered with code HH-26-0001',
    },
    {
      id: 'AL-004',
      timestamp: new Date('2026-03-15T10:30:00Z'),
      userName: 'doctor',
      action: 'Consultation Created',
      entityType: 'Consultation',
      entityId: 'C-2001',
      details: 'Consultation created for patient Abdul Karim',
    },
    {
      id: 'AL-005',
      timestamp: new Date('2026-03-15T11:00:00Z'),
      userName: 'doctor',
      action: 'Prescription Created',
      entityType: 'Prescription',
      entityId: 'PR-3001',
      details: 'Prescription issued for patient Abdul Karim with 5 medications',
    },
    {
      id: 'AL-006',
      timestamp: new Date('2026-03-16T09:00:00Z'),
      userName: 'doctor',
      action: 'Assistance Request Created',
      entityType: 'AssistanceRequest',
      entityId: 'FA-5001',
      details: 'Financial assistance request for cardiac catheterization - Rs. 150,000',
    },
    {
      id: 'AL-007',
      timestamp: new Date('2026-03-17T09:30:00Z'),
      userName: 'receptionist',
      action: 'File Request Fulfilled',
      entityType: 'FileRequest',
      entityId: 'FR-6001',
      details: 'Patient file for Abdul Karim prepared and transferred to cardiology',
    },
    {
      id: 'AL-008',
      timestamp: new Date('2026-03-18T11:30:00Z'),
      userName: 'admin',
      action: 'Assistance Request Approved',
      entityType: 'AssistanceRequest',
      entityId: 'FA-5001',
      details: 'Financial assistance approved for Abdul Karim - Rs. 130,000',
    },
    {
      id: 'AL-009',
      timestamp: new Date('2026-03-20T08:00:00Z'),
      userName: 'receptionist',
      action: 'Patient Registration',
      entityType: 'Patient',
      entityId: 'P-1002',
      details: 'New patient Razia Begum registered with code HH-26-0002',
    },
    {
      id: 'AL-010',
      timestamp: new Date('2026-03-20T14:30:00Z'),
      userName: 'doctor',
      action: 'Consultation Created',
      entityType: 'Consultation',
      entityId: 'C-2002',
      details: 'Consultation created for patient Razia Begum',
    },
    {
      id: 'AL-011',
      timestamp: new Date('2026-03-20T15:00:00Z'),
      userName: 'doctor',
      action: 'Prescription Created',
      entityType: 'Prescription',
      entityId: 'PR-3002',
      details: 'Prescription issued for patient Razia Begum with 3 medications',
    },
    {
      id: 'AL-012',
      timestamp: new Date('2026-03-21T10:00:00Z'),
      userName: 'doctor',
      action: 'Assistance Request Created',
      entityType: 'AssistanceRequest',
      entityId: 'FA-5002',
      details: 'Financial assistance request for stress test - Rs. 25,000',
    },
    {
      id: 'AL-013',
      timestamp: new Date('2026-03-22T08:00:00Z'),
      userName: 'receptionist',
      action: 'Patient Registration',
      entityType: 'Patient',
      entityId: 'P-1003',
      details: 'New patient Kamran Shah registered with code HH-26-0003',
    },
    {
      id: 'AL-014',
      timestamp: new Date('2026-03-22T08:15:00Z'),
      userName: 'receptionist',
      action: 'Assistance Request Created',
      entityType: 'AssistanceRequest',
      entityId: 'FA-5003',
      details: 'Medication sponsorship request for Kamran Shah - Rs. 5,000',
    },
    {
      id: 'AL-015',
      timestamp: new Date('2026-03-22T14:00:00Z'),
      userName: 'doctor',
      action: 'File Request Created',
      entityType: 'FileRequest',
      entityId: 'FR-6002',
      details: 'File request for patient Razia Begum - stress test records',
    },
  ];

  for (const log of auditLogs) {
    await prisma.auditLog.upsert({
      where: { id: log.id },
      update: {},
      create: log,
    });
  }
  console.log('Seeded 15 audit logs');

  console.log('Database seeding completed successfully!');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
