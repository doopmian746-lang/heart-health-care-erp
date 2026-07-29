import bcrypt from 'bcrypt';
import { getDatabase } from './database.js';
import { generatePatientId, generatePatientCode, generateConsultationId, generatePrescriptionId, generateMedicineIssueId, generateAssistanceId, generateFileRequestId, generateAuditId, generateInventoryId } from '../utils/id-generator.js';

export function seedDatabase(): void {
  const db = getDatabase();

  const userCount = (db.prepare('SELECT COUNT(*) as count FROM users').get() as any).count;
  if (userCount > 0) {
    console.log('Database already seeded, skipping.');
    return;
  }

  const passwordHash = bcrypt.hashSync('admin123', 10);

  const users = [
    { id: 'u-1', username: 'admin', name: 'Dr. Bilal Ahmad', role: 'Admin', passwordHash, active: 1 },
    { id: 'u-2', username: 'doctor', name: 'Dr. Sarah Chishti', role: 'Doctor', passwordHash, active: 1 },
    { id: 'u-3', username: 'receptionist', name: 'Muhammad Ali', role: 'Receptionist', passwordHash, active: 1 },
    { id: 'u-4', username: 'pharmacy', name: 'Fatima Noor', role: 'Pharmacy Staff', passwordHash, active: 1 },
    { id: 'u-5', username: 'lab', name: 'Zainab Qazi', role: 'Lab Staff', passwordHash, active: 1 },
  ];

  const insertUser = db.prepare(`
    INSERT INTO users (id, username, name, role, password_hash, active, created_at)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
  `);

  for (const u of users) {
    insertUser.run(u.id, u.username, u.name, u.role, u.passwordHash, u.active);
  }

  const patients = [
    {
      id: 'P-1001', patientCode: 'HH-26-0001', fullName: 'Abdul Karim', fatherHusbandName: 'Bashir Ahmed',
      cnic: '42101-1234567-1', dob: '1964-08-14', age: 62, gender: 'Male', maritalStatus: 'Married',
      occupation: 'Retired Clerk', mobile: '0300-1234567', alternateContact: '0321-7654321 (Son)',
      address: 'House 42, Gali 3, Sector 11-G, Orangi Town, Karachi', bloodGroup: 'B+',
      referredBy: 'Chiniot General Hospital', registrationDate: '2026-05-12T10:30:00.000Z', createdBy: 'u-3',
      housingStatus: 'Rented', houseType: 'Room', numberOfRooms: 2, monthlyRent: 8000, ownsLand: 0,
      landAcres: 0, monthlyElectricityBill: 1500, waterSource: 'Tap', toiletType: 'Flush',
      cookingFuel: 'Gas', monthlyHouseholdIncome: 15000, numberOfDependents: 4, numberOfEarningMembers: 1,
      educationLevel: 'Matric', employmentStatus: 'Retired', hasRefrigerator: 1, hasTelevision: 1,
      hasPersonalVehicle: 0, hasComputer: 0, hasInternet: 0, socioNotes: 'Lives in rented room in Orangi. Son is daily wage laborer.'
    },
    {
      id: 'P-1002', patientCode: 'HH-26-0002', fullName: 'Razia Begum', fatherHusbandName: 'Sajid Mehmood',
      cnic: '42201-9876543-2', dob: '1972-04-25', age: 54, gender: 'Female', maritalStatus: 'Married',
      occupation: 'Housewife', mobile: '0333-2345678', alternateContact: '0315-9876543 (Husband)',
      address: 'Flat C-12, Al-Azhar Heights, Gulshan-e-Iqbal, Karachi', bloodGroup: 'O+',
      referredBy: 'Clinc walk-in', registrationDate: '2026-06-01T14:15:00.000Z', createdBy: 'u-3',
      housingStatus: 'Rented', houseType: 'Apartment', numberOfRooms: 3, monthlyRent: 25000, ownsLand: 0,
      landAcres: 0, monthlyElectricityBill: 3500, waterSource: 'Tap', toiletType: 'Flush',
      cookingFuel: 'Gas', monthlyHouseholdIncome: 45000, numberOfDependents: 5, numberOfEarningMembers: 2,
      educationLevel: 'Middle', employmentStatus: 'Homemaker', hasRefrigerator: 1, hasTelevision: 1,
      hasPersonalVehicle: 0, hasComputer: 0, hasInternet: 0, socioNotes: 'Husband drives a taxi. Son works in a shop.'
    },
    {
      id: 'P-1003', patientCode: 'HH-26-0003', fullName: 'Kamran Shah', fatherHusbandName: 'Zafar Shah',
      cnic: '37405-5555555-5', dob: '1981-11-30', age: 45, gender: 'Male', maritalStatus: 'Single',
      occupation: 'Auto Rickshaw Driver', mobile: '0345-5678901', alternateContact: 'None',
      address: 'Shanti Nagar near Railway Track, Karachi East', bloodGroup: 'A+',
      referredBy: 'Syed Welfare Clinic', registrationDate: '2026-06-18T09:00:00.000Z', createdBy: 'u-3',
      housingStatus: 'Rented', houseType: 'Room', numberOfRooms: 1, monthlyRent: 5000, ownsLand: 0,
      landAcres: 0, monthlyElectricityBill: 800, waterSource: 'Community Tap', toiletType: 'Pit Latrine',
      cookingFuel: 'Kerosene', monthlyHouseholdIncome: 12000, numberOfDependents: 0, numberOfEarningMembers: 1,
      educationLevel: 'Primary', employmentStatus: 'Self-Employed', hasRefrigerator: 0, hasTelevision: 0,
      hasPersonalVehicle: 1, hasComputer: 0, hasInternet: 0, socioNotes: 'Lives alone. Auto rickshaw is his only asset and source of income.'
    },
  ];

  const insertPatient = db.prepare(`
    INSERT INTO patients (id, patient_code, full_name, father_husband_name, cnic, dob, age, gender, marital_status,
      occupation, mobile, alternate_contact, address, blood_group, referred_by, registration_date, created_by,
      housing_status, house_type, number_of_rooms, monthly_rent, owns_land, land_acres, monthly_electricity_bill,
      water_source, toilet_type, cooking_fuel, monthly_household_income, number_of_dependents, number_of_earning_members,
      education_level, employment_status, has_refrigerator, has_television, has_personal_vehicle, has_computer, has_internet, socio_notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const p of patients) {
    insertPatient.run(p.id, p.patientCode, p.fullName, p.fatherHusbandName, p.cnic, p.dob, p.age, p.gender, p.maritalStatus,
      p.occupation, p.mobile, p.alternateContact, p.address, p.bloodGroup, p.referredBy, p.registrationDate, p.createdBy,
      p.housingStatus, p.houseType, p.numberOfRooms, p.monthlyRent, p.ownsLand, p.landAcres, p.monthlyElectricityBill,
      p.waterSource, p.toiletType, p.cookingFuel, p.monthlyHouseholdIncome, p.numberOfDependents, p.numberOfEarningMembers,
      p.educationLevel, p.employmentStatus, p.hasRefrigerator, p.hasTelevision, p.hasPersonalVehicle, p.hasComputer, p.hasInternet, p.socioNotes);
  }

  db.prepare(`
    INSERT INTO medical_histories (patient_id, chronic_conditions, lifestyle_factors, family_history, allergies, existing_medications, prior_cardiac_procedures, last_updated, updated_by)
    VALUES ('P-1001', '["Hypertension","Coronary Artery Disease","Previous Heart Attack"]', '["Smoking","Sedentary"]', '["Heart Disease"]', 'Penicillin', 'Aspirin 75mg once daily', '["Angiography","Angioplasty"]', '2026-05-12T10:45:00.000Z', 'Dr. Sarah Chishti')
  `).run();
  db.prepare(`
    INSERT INTO medical_histories (patient_id, chronic_conditions, lifestyle_factors, family_history, allergies, existing_medications, prior_cardiac_procedures, last_updated, updated_by)
    VALUES ('P-1002', '["Diabetes","Heart Failure","Kidney Disease"]', '["Regular Physical Activity"]', '["Diabetes","Hypertension"]', 'None known', 'Metformin 500mg twice daily, Enalapril 5mg once daily', '[]', '2026-06-01T14:30:00.000Z', 'Dr. Sarah Chishti')
  `).run();
  db.prepare(`
    INSERT INTO medical_histories (patient_id, chronic_conditions, lifestyle_factors, family_history, allergies, existing_medications, prior_cardiac_procedures, last_updated, updated_by)
    VALUES ('P-1003', '["Hypertension","Coronary Artery Disease"]', '["Tobacco Use"]', '["Hypertension"]', 'Sulfa drugs', 'Dilated 6.25mg twice daily', '[]', '2026-06-18T09:20:00.000Z', 'Dr. Sarah Chishti')
  `).run();

  const inventory = [
    { medicineName: 'Aspirin', category: 'Antiplatelet', supplier: 'Zacta Pharma', batchNumber: 'ASP8810', purchaseDate: '2026-01-15', expiryDate: '2027-12-30', quantityAvailable: 1250, minimumStockLevel: 200, unitPrice: 2 },
    { medicineName: 'Clopidogrel 75mg', category: 'Antiplatelet', supplier: 'Sami Labs Ltd', batchNumber: 'CLP2209', purchaseDate: '2026-02-10', expiryDate: '2028-01-15', quantityAvailable: 800, minimumStockLevel: 150, unitPrice: 12 },
    { medicineName: 'Atorvastatin 20mg', category: 'Statin', supplier: 'Getz Pharma', batchNumber: 'ATR9901', purchaseDate: '2026-03-01', expiryDate: '2027-09-18', quantityAvailable: 1500, minimumStockLevel: 300, unitPrice: 18 },
    { medicineName: 'Atorvastatin 40mg', category: 'Statin', supplier: 'Getz Pharma', batchNumber: 'ATR4012', purchaseDate: '2026-03-05', expiryDate: '2027-10-22', quantityAvailable: 450, minimumStockLevel: 100, unitPrice: 30 },
    { medicineName: 'Lisinopril 10mg', category: 'ACE Inhibitor', supplier: 'Abbott Pakistan', batchNumber: 'LIS0015', purchaseDate: '2026-01-20', expiryDate: '2027-04-12', quantityAvailable: 30, minimumStockLevel: 50, unitPrice: 8 },
    { medicineName: 'Carvedilol 6.25mg', category: 'Beta Blocker', supplier: 'GSK Care', batchNumber: 'CRV3381', purchaseDate: '2026-02-18', expiryDate: '2027-11-05', quantityAvailable: 620, minimumStockLevel: 100, unitPrice: 15 },
    { medicineName: 'Carvedilol 12.5mg', category: 'Beta Blocker', supplier: 'GSK Care', batchNumber: 'CRV1299', purchaseDate: '2026-02-20', expiryDate: '2028-03-12', quantityAvailable: 410, minimumStockLevel: 100, unitPrice: 22 },
    { medicineName: 'Furosemide 40mg', category: 'Loop Diuretic', supplier: 'Searle Pakistan', batchNumber: 'FUR7765', purchaseDate: '2026-01-10', expiryDate: '2027-08-30', quantityAvailable: 2000, minimumStockLevel: 250, unitPrice: 5 },
    { medicineName: 'Spironolactone 25mg', category: 'Aldosterone Antagonist', supplier: 'Pfizer Local', batchNumber: 'SPI9900', purchaseDate: '2026-03-10', expiryDate: '2026-07-15', quantityAvailable: 180, minimumStockLevel: 100, unitPrice: 14 },
  ];

  const insertInventory = db.prepare(`
    INSERT INTO inventory (id, medicine_name, category, supplier, batch_number, purchase_date, expiry_date, quantity_available, minimum_stock_level, unit_price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  inventory.forEach((item, i) => {
    insertInventory.run(generateInventoryId(i), item.medicineName, item.category, item.supplier, item.batchNumber, item.purchaseDate, item.expiryDate, item.quantityAvailable, item.minimumStockLevel, item.unitPrice);
  });

  db.prepare(`
    INSERT INTO consultations (id, patient_id, visit_date, bp_systolic, bp_diastolic, pulse, weight, height, bmi, spo2, chief_complaint, symptoms, examination_findings, diagnosis, doctor_notes, follow_up_date, follow_up_instructions, doctor_name)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run('C-2001', 'P-1001', '2026-05-12T11:00:00.000Z', 145, 92, 78, 76, 172, 25.7, 97,
    'Aching chest distress on physical exertion for 2 weeks, radiating left arm',
    'Angina walk-exerted, shortness of breath NYHA Class II',
    'Lungs clear, S1 S2 normal, apex regular beat, no lower edema',
    'Coronary Artery Disease, Stable Exertional Angina, Uncontrolled Hypertension',
    'Patient has high risks with chronic smoking. Immediate medical therapy adjustment prescribed.',
    '2026-06-12', 'Return in 4 weeks with complete lipid profile, blood sugar fasting, and ECG.', 'Dr. Sarah Chishti');

  db.prepare(`
    INSERT INTO consultations (id, patient_id, visit_date, bp_systolic, bp_diastolic, pulse, weight, height, bmi, spo2, chief_complaint, symptoms, examination_findings, diagnosis, doctor_notes, follow_up_date, follow_up_instructions, doctor_name)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run('C-2002', 'P-1002', '2026-06-01T14:45:00.000Z', 128, 78, 84, 68, 158, 27.2, 94,
    'Bilateral ankle swelling increasing in evening, worsening dynamic dyspnea',
    'Orthopnea (requires 2 pillows), severe ankle swelling, chronic dry cough',
    'Bilateral basal lung crackles, elevated JVP 4cm, substantial bilateral pedal edema ++',
    'Decompensated Congestive Heart Failure, Chronic Kidney Disease Stage II, Type 2 Diabetes',
    'Worsening systemic overload. Strict salt intake control advised. Escalate diuretic and heart failure medication.',
    '2026-06-15', 'Assess safety of higher diuretic doses. Urgent Serum Electrolytes, Creatinine, and Echocardiography requested.', 'Dr. Sarah Chishti');

  db.prepare(`
    INSERT INTO prescriptions (id, consultation_id, patient_id, date, lifestyle_recommendations, doctor_name, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run('PR-3001', 'C-2001', 'P-1001', '2026-05-12T11:10:00.000Z',
    'Complete smoking cessation is non-negotiable. Walking 20 mins daily on flat surface as tolerated.',
    'Dr. Sarah Chishti', 'Dispensed');

  const insertItem = db.prepare(`
    INSERT INTO prescription_items (prescription_id, medicine_id, medicine_name, strength, dosage, frequency, duration, instructions)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertItem.run('PR-3001', 'm-1', 'Aspirin', '75mg', '1-0-0', 'Once Daily', '3 months', 'Take with lunch');
  insertItem.run('PR-3001', 'm-2', 'Clopidogrel 75mg', '75mg', '1-0-0', 'Once Daily', '3 months', 'Take and swallow whole');
  insertItem.run('PR-3001', 'm-3', 'Atorvastatin 20mg', '20mg', '0-0-1', 'At Bedtime', '3 months', 'Avoid grapefruit juice');
  insertItem.run('PR-3001', 'm-6', 'Carvedilol 6.25mg', '6.25mg', '1-0-1', 'Twice Daily', '1 month', 'Take after food');

  db.prepare(`
    INSERT INTO prescriptions (id, consultation_id, patient_id, date, lifestyle_recommendations, doctor_name, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run('PR-3002', 'C-2002', 'P-1002', '2026-06-01T15:00:00.000Z',
    'Restricted total fluid intake to max 1.2 litres per day. Absolute low-salt diet.',
    'Dr. Sarah Chishti', 'Pending');

  insertItem.run('PR-3002', 'm-8', 'Furosemide 40mg', '40mg', '1-1-0', 'Twice Daily', '15 days', 'Take morning and afternoon');
  insertItem.run('PR-3002', 'm-9', 'Spironolactone 25mg', '25mg', '1-0-0', 'Once Daily', '30 days', 'Take with food');

  db.prepare(`
    INSERT INTO assistance_requests (id, patient_id, patient_name, type, estimated_cost, patient_contribution, foundation_contribution, status, justification, remarks, requested_by, request_date, approved_by, approval_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run('FA-5001', 'P-1001', 'Abdul Karim', 'Free Medicines', 3500, 0, 3500, 'Approved',
    'Retired clerk living on a very minimal local pension. Unable to afford crucial dual-antiplatelet post-discharge medical therapy.',
    'Approved full sponsorship of life-saving cardiac medicines for 3 months.',
    'Dr. Sarah Chishti', '2026-05-12T10:50:00.000Z', 'Dr. Bilal Ahmad', '2026-05-12T11:05:00.000Z');

  db.prepare(`
    INSERT INTO assistance_requests (id, patient_id, patient_name, type, estimated_cost, patient_contribution, foundation_contribution, status, justification, remarks, requested_by, request_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run('FA-5002', 'P-1002', 'Razia Begum', 'Surgery Sponsorship', 180000, 20000, 160000, 'Pending',
    'Patient requires Urgent mitral valve replacement. Family income from sewing is under PKR 25,000/month.',
    '', 'Dr. Sarah Chishti', '2026-06-02T11:40:00.000Z');

  db.prepare(`
    INSERT INTO assistance_requests (id, patient_id, patient_name, type, estimated_cost, patient_contribution, foundation_contribution, status, justification, remarks, requested_by, request_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run('FA-5003', 'P-1003', 'Kamran Shah', 'Free Echo', 4000, 0, 4000, 'Pending',
    'Auto rickshaw driver with high daily rental fee. Experiencing exertional angina, diagnostic evaluation required.',
    '', 'Muhammad Ali', '2026-06-18T09:30:00.000Z');

  db.prepare(`
    INSERT INTO medicine_issues (id, prescription_id, patient_id, issue_date, issued_by, payment_status, sponsorship_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run('DI-4001', 'PR-3001', 'P-1001', '2026-05-12T11:20:00.000Z', 'Fatima Noor', 'Foundation Sponsored', 'FA-5001');

  db.prepare(`
    INSERT INTO medicine_issue_items (issue_id, medicine_id, medicine_name, batch_number, quantity_issued)
    VALUES (?, ?, ?, ?, ?)
  `).run('DI-4001', 'm-1', 'Aspirin', 'ASP8810', 90);
  db.prepare(`INSERT INTO medicine_issue_items (issue_id, medicine_id, medicine_name, batch_number, quantity_issued) VALUES (?, ?, ?, ?, ?)`).run('DI-4001', 'm-2', 'Clopidogrel 75mg', 'CLP2209', 90);
  db.prepare(`INSERT INTO medicine_issue_items (issue_id, medicine_id, medicine_name, batch_number, quantity_issued) VALUES (?, ?, ?, ?, ?)`).run('DI-4001', 'm-3', 'Atorvastatin 20mg', 'ATR9901', 90);
  db.prepare(`INSERT INTO medicine_issue_items (issue_id, medicine_id, medicine_name, batch_number, quantity_issued) VALUES (?, ?, ?, ?, ?)`).run('DI-4001', 'm-6', 'Carvedilol 6.25mg', 'CRV3381', 60);

  const audits = [
    { user: 'Muhammad Ali', action: 'Patient Registered', entityType: 'Patient', entityId: 'P-1001', details: 'Registered new cardiac patient Abdul Karim.' },
    { user: 'Dr. Sarah Chishti', action: 'Record Clinical History', entityType: 'MedicalHistory', entityId: 'P-1001', details: 'Added medical background including pre-existing CAD and prior coronary angiography.' },
    { user: 'Dr. Sarah Chishti', action: 'Assistance Request Submitted', entityType: 'Assistance', entityId: 'FA-5001', details: 'Requested Free Medicines sponsorship for patient Abdul Karim.' },
    { user: 'Dr. Bilal Ahmad', action: 'Assistance Request Approved', entityType: 'Assistance', entityId: 'FA-5001', details: 'Approved complete medicines financial coverage for Abdul Karim.' },
    { user: 'Dr. Sarah Chishti', action: 'Doctor Consultation Saved', entityType: 'Consultation', entityId: 'C-2001', details: 'Recorded vitals and diagnostic details for Abdul Karim.' },
    { user: 'Dr. Sarah Chishti', action: 'Prescription Created', entityType: 'Prescription', entityId: 'PR-3001', details: 'Prescribed Aspirin, Clopidogrel, Atorvastatin, and Carvedilol.' },
    { user: 'Fatima Noor', action: 'Medicines Dispensed', entityType: 'Dispensing', entityId: 'DI-4001', details: 'Dispensed 3-month medical supply to Abdul Karim sponsored by the Foundation.' },
    { user: 'Muhammad Ali', action: 'Patient Registered', entityType: 'Patient', entityId: 'P-1002', details: 'Registered new cardiac patient Razia Begum.' },
    { user: 'Dr. Sarah Chishti', action: 'Record Clinical History', entityType: 'MedicalHistory', entityId: 'P-1002', details: 'Added heart failure, type 2 diabetes and CKD background for Razia Begum.' },
    { user: 'Dr. Sarah Chishti', action: 'Doctor Consultation Saved', entityType: 'Consultation', entityId: 'C-2002', details: 'Consultation made for decompensated clinical volume overload.' },
    { user: 'Dr. Sarah Chishti', action: 'Prescription Created', entityType: 'Prescription', entityId: 'PR-3002', details: 'Prescribed crucial dose diuretics (Furosemide and Spironolactone) for congestive load.' },
    { user: 'Dr. Sarah Chishti', action: 'Assistance Request Submitted', entityType: 'Assistance', entityId: 'FA-5002', details: 'Submitted Surgery Sponsorship estimate request (PKR 180,000) for Razia Begum.' },
    { user: 'Muhammad Ali', action: 'Patient Registered', entityType: 'Patient', entityId: 'P-1003', details: 'Registered new patient Kamran Shah.' },
    { user: 'Dr. Sarah Chishti', action: 'Record Clinical History', entityType: 'MedicalHistory', entityId: 'P-1003', details: 'Recorded history for Kamran Shah.' },
    { user: 'Muhammad Ali', action: 'Assistance Request Submitted', entityType: 'Assistance', entityId: 'FA-5003', details: 'Requested urgent Free Echocardiography test for patient Kamran Shah.' },
  ];

  const insertAudit = db.prepare(`
    INSERT INTO audit_logs (id, timestamp, user_name, action, entity_type, entity_id, details)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  audits.forEach((a, i) => {
    const timestamps = [
      '2026-05-12T10:30:00.000Z', '2026-05-12T10:45:00.000Z', '2026-05-12T10:50:00.000Z',
      '2026-05-12T11:05:00.000Z', '2026-05-12T11:00:00.000Z', '2026-05-12T11:10:00.000Z',
      '2026-05-12T11:20:00.000Z', '2026-06-01T14:15:00.000Z', '2026-06-01T14:30:00.000Z',
      '2026-06-01T14:45:00.000Z', '2026-06-01T15:00:00.000Z', '2026-06-02T11:40:00.000Z',
      '2026-06-18T09:00:00.000Z', '2026-06-18T09:20:00.000Z', '2026-06-18T09:30:00.000Z',
    ];
    insertAudit.run(`a-${i + 100}`, timestamps[i], a.user, a.action, a.entityType, a.entityId, a.details);
  });

  const fileRequests = [
    { id: 'FR-6001', patientId: 'P-1001', patientName: 'Abdul Karim', requestedBy: 'Dr. Sarah Chishti', purpose: 'Discharge Summary Review', urgency: 'Medium', status: 'Pending', requestDate: '2026-06-19T11:20:00.000Z' },
    { id: 'FR-6002', patientId: 'P-1002', patientName: 'Razia Begum', requestedBy: 'Muhammad Ali', purpose: 'Sponsorship Verification', urgency: 'High', status: 'Fulfilled', requestDate: '2026-06-18T14:30:00.000Z', remarks: 'Dispatched physical medical card folder.', fulfilledBy: 'Dr. Bilal Ahmad', fulfillmentDate: '2026-06-18T15:00:00.000Z' },
  ];

  const insertFR = db.prepare(`
    INSERT INTO file_requests (id, patient_id, patient_name, requested_by, purpose, urgency, status, request_date, remarks, fulfilled_by, fulfillment_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const fr of fileRequests) {
    insertFR.run(fr.id, fr.patientId, fr.patientName, fr.requestedBy, fr.purpose, fr.urgency, fr.status, fr.requestDate, fr.remarks || null, fr.fulfilledBy || null, fr.fulfillmentDate || null);
  }

  const donors = [
    { id: 'DP-9001', donorName: 'Farhan Ali Chaudhry', email: 'farhan.ali@gmail.com', phone: '0300-1234567', amount: 500000, paymentDate: '2026-06-15T10:00:00.000Z', paymentMethod: 'Bank Transfer', projectSponsorship: 'General Cardiac Fund', receiptNumber: 'HHCF-REC-2026-011', notes: 'In Memory of Haji Abdul Ghafoor.' },
    { id: 'DP-9002', donorName: 'Anjum Karim Malik', email: 'anjum.malik@outlook.com', phone: '0321-7654321', amount: 150000, paymentDate: '2026-06-17T11:45:00.000Z', paymentMethod: 'Online card', projectSponsorship: 'Medicine Subsidy', receiptNumber: 'HHCF-REC-2026-012', notes: 'Support for high cost blood thinner pills.' },
    { id: 'DP-9003', donorName: 'Pakistan Welfare Society UK', email: 'info@pwsuk.org', phone: '+44-207-946-0192', amount: 1200000, paymentDate: '2026-06-19T15:30:00.000Z', paymentMethod: 'Bank Transfer', projectSponsorship: 'Surgical Wing', receiptNumber: 'HHCF-REC-2026-013', notes: 'Annual medical equipment support fund.' },
  ];

  const insertDonor = db.prepare(`
    INSERT INTO donor_payments (id, donor_name, email, phone, amount, payment_date, payment_method, project_sponsorship, receipt_number, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const d of donors) {
    insertDonor.run(d.id, d.donorName, d.email, d.phone, d.amount, d.paymentDate, d.paymentMethod, d.projectSponsorship, d.receiptNumber, d.notes);
  }

  console.log('Database seeded with initial data successfully');

  // Seed lab tests if empty
  try {
    const labCount = (db.prepare('SELECT COUNT(*) as c FROM lab_tests').get() as any).c;
    if (labCount === 0) {
      const insertLab = db.prepare('INSERT INTO lab_tests (id, test_name, category, description, normal_range, unit, cost, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
      const labTests = [
        ['LT-001', 'Complete Blood Count (CBC)', 'Hematology', 'Measures RBC, WBC, platelets, hemoglobin', 'WBC: 4-11, Hb: 12-16, Platelets: 150-400', '/μL, g/dL', 800],
        ['LT-002', 'Fasting Lipid Profile', 'Biochemistry', 'Total cholesterol, LDL, HDL, triglycerides', 'TC: <200, LDL: <100, HDL: >40', 'mg/dL', 1200],
        ['LT-003', 'HbA1c (Glycated Hemoglobin)', 'Biochemistry', 'Average blood sugar over 3 months', '<5.7%', '%', 1000],
        ['LT-004', 'Renal Function Tests (RFT)', 'Biochemistry', 'Creatinine, BUN, electrolytes', 'Creatinine: 0.6-1.2, BUN: 7-20', 'mg/dL', 900],
        ['LT-005', 'Liver Function Tests (LFT)', 'Biochemistry', 'ALT, AST, bilirubin, albumin', 'ALT: 7-56, AST: 10-40', 'U/L', 900],
        ['LT-006', 'Thyroid Profile (TSH, T3, T4)', 'Endocrinology', 'Thyroid stimulating hormone and thyroid hormones', 'TSH: 0.4-4.0', 'mIU/L', 1500],
        ['LT-007', 'Fasting Blood Glucose', 'Biochemistry', 'Blood sugar level after fasting', '70-100', 'mg/dL', 400],
        ['LT-008', 'ECG (12-Lead)', 'Cardiology', 'Electrocardiogram - heart electrical activity', 'Normal sinus rhythm', '-', 1500],
        ['LT-009', 'Echocardiography', 'Cardiology', 'Ultrasound of the heart', 'Normal LV function, EF >55%', '-', 5000],
        ['LT-010', 'Chest X-Ray (PA View)', 'Radiology', 'X-ray of chest', 'Normal', '-', 2000],
        ['LT-011', 'Urinalysis', 'Pathology', 'Routine urine examination', 'Normal', '-', 400],
        ['LT-012', 'Troponin I', 'Cardiology', 'Cardiac biomarker for heart attack', '<0.04', 'ng/mL', 2500],
        ['LT-013', 'BNP (B-type Natriuretic Peptide)', 'Cardiology', 'Heart failure marker', '<100', 'pg/mL', 3000],
        ['LT-014', 'PT/INR (Coagulation)', 'Hematology', 'Blood clotting time', 'INR: 0.8-1.2', '-', 800],
        ['LT-015', 'Serum Electrolytes', 'Biochemistry', 'Sodium, Potassium, Chloride', 'Na: 136-145, K: 3.5-5.0', 'mEq/L', 600],
        ['LT-016', 'Treadmill Test (TMT)', 'Cardiology', 'Exercise stress test', 'Negative for ischemia', '-', 4000],
        ['LT-017', 'Holter Monitoring', 'Cardiology', '24-hour heart rhythm monitoring', 'No significant arrhythmia', '-', 6000],
        ['LT-018', 'Coronary Angiography', 'Cardiology', 'Imaging of coronary arteries', 'No significant stenosis', '-', 25000],
        ['LT-019', 'CBC with Differential', 'Hematology', 'Detailed white blood cell count', 'Neutrophils: 40-70%, Lymphocytes: 20-40%', '%', 1000],
        ['LT-020', 'CRP (C-Reactive Protein)', 'Pathology', 'Inflammation marker', '<3.0', 'mg/L', 700],
      ];
      for (const t of labTests) {
        insertLab.run(t[0], t[1], t[2], t[3], t[4], t[5], t[6], 1);
      }
    }
  } catch (e) {}
}
