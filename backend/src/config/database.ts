import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { env } from './env.js';

let db: Database.Database;

export function getDatabase(): Database.Database {
  if (!db) {
    const dbPath = env.DATABASE_PATH;
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

export function initializeDatabase(): void {
  const conn = getDatabase();

  conn.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('Admin','Doctor','Receptionist','Pharmacy Staff','Lab Staff')),
      password_hash TEXT NOT NULL,
      active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS patients (
      id TEXT PRIMARY KEY,
      patient_code TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      father_husband_name TEXT DEFAULT '',
      cnic TEXT DEFAULT '',
      dob TEXT DEFAULT '',
      age INTEGER DEFAULT 0,
      gender TEXT DEFAULT 'Male' CHECK(gender IN ('Male','Female','Other')),
      marital_status TEXT DEFAULT 'Single' CHECK(marital_status IN ('Single','Married','Widowed','Divorced')),
      occupation TEXT DEFAULT '',
      mobile TEXT DEFAULT '',
      alternate_contact TEXT DEFAULT '',
      address TEXT DEFAULT '',
      blood_group TEXT DEFAULT 'Unknown' CHECK(blood_group IN ('A+','A-','B+','B-','AB+','AB-','O+','O-','Unknown')),
      photo TEXT DEFAULT '',
      referred_by TEXT DEFAULT '',
      registration_date TEXT DEFAULT (datetime('now')),
      created_by TEXT REFERENCES users(id),

      housing_status TEXT DEFAULT 'Owned' CHECK(housing_status IN ('Owned','Rented','With Family','Shelter','Other')),
      house_type TEXT DEFAULT 'House' CHECK(house_type IN ('House','Apartment','Room','Katchi Abadi','Other')),
      number_of_rooms INTEGER DEFAULT 0,
      monthly_rent REAL DEFAULT 0,
      owns_land INTEGER DEFAULT 0,
      land_acres REAL DEFAULT 0,
      monthly_electricity_bill REAL DEFAULT 0,
      water_source TEXT DEFAULT 'Tap' CHECK(water_source IN ('Tap','Borewell','Tank','Community Tap','Other')),
      toilet_type TEXT DEFAULT 'Flush' CHECK(toilet_type IN ('Flush','Pit Latrine','Community','None')),
      cooking_fuel TEXT DEFAULT 'Gas' CHECK(cooking_fuel IN ('Gas','Electric','Kerosene','Wood','Coal','Other')),
      monthly_household_income REAL DEFAULT 0,
      number_of_dependents INTEGER DEFAULT 0,
      number_of_earning_members INTEGER DEFAULT 0,
      education_level TEXT DEFAULT 'None' CHECK(education_level IN ('None','Primary','Middle','Matric','Intermediate','Graduate','Post Graduate','Technical Diploma')),
      employment_status TEXT DEFAULT 'Unemployed' CHECK(employment_status IN ('Employed','Self-Employed','Unemployed','Retired','Homemaker','Student','Disabled')),
      has_refrigerator INTEGER DEFAULT 0,
      has_television INTEGER DEFAULT 0,
      has_personal_vehicle INTEGER DEFAULT 0,
      has_computer INTEGER DEFAULT 0,
      has_internet INTEGER DEFAULT 0,
      socio_notes TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS medical_histories (
      patient_id TEXT PRIMARY KEY REFERENCES patients(id) ON DELETE CASCADE,
      chronic_conditions TEXT DEFAULT '[]',
      lifestyle_factors TEXT DEFAULT '[]',
      family_history TEXT DEFAULT '[]',
      allergies TEXT DEFAULT 'None',
      existing_medications TEXT DEFAULT 'None',
      prior_cardiac_procedures TEXT DEFAULT '[]',
      last_updated TEXT DEFAULT (datetime('now')),
      updated_by TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS consultations (
      id TEXT PRIMARY KEY,
      patient_id TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
      visit_date TEXT DEFAULT (datetime('now')),
      bp_systolic INTEGER DEFAULT 120,
      bp_diastolic INTEGER DEFAULT 80,
      pulse INTEGER DEFAULT 72,
      weight REAL DEFAULT 70,
      height REAL DEFAULT 170,
      bmi REAL DEFAULT 24.2,
      spo2 INTEGER DEFAULT 98,
      chief_complaint TEXT DEFAULT '',
      symptoms TEXT DEFAULT '',
      examination_findings TEXT DEFAULT '',
      diagnosis TEXT DEFAULT '',
      doctor_notes TEXT DEFAULT '',
      follow_up_date TEXT DEFAULT '',
      follow_up_instructions TEXT DEFAULT '',
      doctor_name TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS prescriptions (
      id TEXT PRIMARY KEY,
      consultation_id TEXT REFERENCES consultations(id),
      patient_id TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
      date TEXT DEFAULT (datetime('now')),
      lifestyle_recommendations TEXT DEFAULT '',
      doctor_name TEXT DEFAULT '',
      status TEXT DEFAULT 'Pending' CHECK(status IN ('Pending','Dispensed','Partially Dispensed'))
    );

    CREATE TABLE IF NOT EXISTS prescription_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      prescription_id TEXT NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
      medicine_id TEXT DEFAULT '',
      medicine_name TEXT DEFAULT '',
      strength TEXT DEFAULT '',
      dosage TEXT DEFAULT '',
      frequency TEXT DEFAULT '',
      duration TEXT DEFAULT '',
      instructions TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS inventory (
      id TEXT PRIMARY KEY,
      medicine_name TEXT NOT NULL,
      category TEXT DEFAULT '',
      supplier TEXT DEFAULT '',
      batch_number TEXT DEFAULT '',
      purchase_date TEXT DEFAULT '',
      expiry_date TEXT DEFAULT '',
      quantity_available INTEGER DEFAULT 0,
      minimum_stock_level INTEGER DEFAULT 50,
      unit_price REAL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS medicine_issues (
      id TEXT PRIMARY KEY,
      prescription_id TEXT REFERENCES prescriptions(id),
      patient_id TEXT REFERENCES patients(id),
      issue_date TEXT DEFAULT (datetime('now')),
      issued_by TEXT DEFAULT '',
      payment_status TEXT DEFAULT 'Fully Paid' CHECK(payment_status IN ('Fully Paid','Foundation Sponsored','Partially Subsidized')),
      sponsorship_id TEXT REFERENCES assistance_requests(id)
    );

    CREATE TABLE IF NOT EXISTS medicine_issue_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      issue_id TEXT NOT NULL REFERENCES medicine_issues(id) ON DELETE CASCADE,
      medicine_id TEXT DEFAULT '',
      medicine_name TEXT DEFAULT '',
      batch_number TEXT DEFAULT '',
      quantity_issued INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS assistance_requests (
      id TEXT PRIMARY KEY,
      patient_id TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
      patient_name TEXT DEFAULT '',
      type TEXT DEFAULT '',
      estimated_cost REAL DEFAULT 0,
      patient_contribution REAL DEFAULT 0,
      foundation_contribution REAL DEFAULT 0,
      status TEXT DEFAULT 'Pending' CHECK(status IN ('Pending','Approved','Rejected')),
      justification TEXT DEFAULT '',
      remarks TEXT DEFAULT '',
      requested_by TEXT DEFAULT '',
      request_date TEXT DEFAULT (datetime('now')),
      approved_by TEXT DEFAULT NULL,
      approval_date TEXT DEFAULT NULL
    );

    CREATE TABLE IF NOT EXISTS file_requests (
      id TEXT PRIMARY KEY,
      patient_id TEXT REFERENCES patients(id),
      patient_name TEXT DEFAULT '',
      requested_by TEXT DEFAULT '',
      purpose TEXT DEFAULT '',
      urgency TEXT DEFAULT 'Medium' CHECK(urgency IN ('Low','Medium','High','Emergency')),
      status TEXT DEFAULT 'Pending' CHECK(status IN ('Pending','Fulfilled','Rejected')),
      request_date TEXT DEFAULT (datetime('now')),
      remarks TEXT DEFAULT '',
      fulfilled_by TEXT DEFAULT NULL,
      fulfillment_date TEXT DEFAULT NULL
    );

    CREATE TABLE IF NOT EXISTS donor_payments (
      id TEXT PRIMARY KEY,
      donor_name TEXT NOT NULL,
      email TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      amount REAL NOT NULL,
      payment_date TEXT DEFAULT (datetime('now')),
      payment_method TEXT DEFAULT 'Bank Transfer',
      project_sponsorship TEXT DEFAULT 'General Cardiac Fund',
      receipt_number TEXT DEFAULT '',
      notes TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      timestamp TEXT DEFAULT (datetime('now')),
      user_name TEXT DEFAULT '',
      action TEXT DEFAULT '',
      entity_type TEXT DEFAULT '',
      entity_id TEXT DEFAULT '',
      details TEXT DEFAULT ''
    );
  `);

  console.log('Database initialized successfully');
}
