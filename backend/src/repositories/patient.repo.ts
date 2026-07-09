import { getDatabase } from '../config/database.js';
import { Patient, PatientSocioEconomic } from '../types/index.js';

const rowToPatient = (row: any): Patient => ({
  id: row.id,
  patientCode: row.patient_code,
  fullName: row.full_name,
  fatherHusbandName: row.father_husband_name,
  cnic: row.cnic,
  dob: row.dob,
  age: row.age,
  gender: row.gender,
  maritalStatus: row.marital_status,
  occupation: row.occupation,
  mobile: row.mobile,
  alternateContact: row.alternate_contact,
  address: row.address,
  bloodGroup: row.blood_group,
  photo: row.photo,
  referredBy: row.referred_by,
  registrationDate: row.registration_date,
  createdBy: row.created_by,
  socioEconomic: {
    housingStatus: row.housing_status,
    houseType: row.house_type,
    numberOfRooms: row.number_of_rooms,
    monthlyRent: row.monthly_rent,
    ownsLand: Boolean(row.owns_land),
    landAcres: row.land_acres,
    monthlyElectricityBill: row.monthly_electricity_bill,
    waterSource: row.water_source,
    toiletType: row.toilet_type,
    cookingFuel: row.cooking_fuel,
    monthlyHouseholdIncome: row.monthly_household_income,
    numberOfDependents: row.number_of_dependents,
    numberOfEarningMembers: row.number_of_earning_members,
    educationLevel: row.education_level,
    employmentStatus: row.employment_status,
    hasRefrigerator: Boolean(row.has_refrigerator),
    hasTelevision: Boolean(row.has_television),
    hasPersonalVehicle: Boolean(row.has_personal_vehicle),
    hasComputer: Boolean(row.has_computer),
    hasInternet: Boolean(row.has_internet),
    notes: row.socio_notes,
  },
});

export const patientRepo = {
  findAll(search?: string): Patient[] {
    const db = getDatabase();
    if (!search) {
      return db.prepare('SELECT * FROM patients ORDER BY registration_date DESC').all().map(rowToPatient);
    }
    const q = `%${search}%`;
    return db.prepare(`
      SELECT * FROM patients
      WHERE full_name LIKE ? OR id LIKE ? OR patient_code LIKE ? OR cnic LIKE ? OR mobile LIKE ?
      ORDER BY registration_date DESC
    `).all(q, q, q, q, q).map(rowToPatient);
  },

  findById(id: string): Patient | undefined {
    const db = getDatabase();
    const row = db.prepare('SELECT * FROM patients WHERE id = ?').get(id) as any;
    return row ? rowToPatient(row) : undefined;
  },

  create(patient: Patient): void {
    const db = getDatabase();
    const se = patient.socioEconomic || {} as PatientSocioEconomic;
    db.prepare(`
      INSERT INTO patients (
        id, patient_code, full_name, father_husband_name, cnic, dob, age,
        gender, marital_status, occupation, mobile, alternate_contact,
        address, blood_group, photo, referred_by, registration_date, created_by,
        housing_status, house_type, number_of_rooms, monthly_rent,
        owns_land, land_acres, monthly_electricity_bill, water_source,
        toilet_type, cooking_fuel, monthly_household_income,
        number_of_dependents, number_of_earning_members, education_level,
        employment_status, has_refrigerator, has_television,
        has_personal_vehicle, has_computer, has_internet, socio_notes
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `).run(
      patient.id, patient.patientCode, patient.fullName, patient.fatherHusbandName,
      patient.cnic, patient.dob, patient.age, patient.gender, patient.maritalStatus,
      patient.occupation, patient.mobile, patient.alternateContact, patient.address,
      patient.bloodGroup, patient.photo, patient.referredBy, patient.registrationDate,
      patient.createdBy,
      se.housingStatus || 'Owned', se.houseType || 'House', se.numberOfRooms || 0,
      se.monthlyRent || 0, se.ownsLand ? 1 : 0, se.landAcres || 0,
      se.monthlyElectricityBill || 0, se.waterSource || 'Tap', se.toiletType || 'Flush',
      se.cookingFuel || 'Gas', se.monthlyHouseholdIncome || 0, se.numberOfDependents || 0,
      se.numberOfEarningMembers || 0, se.educationLevel || 'None',
      se.employmentStatus || 'Unemployed', se.hasRefrigerator ? 1 : 0,
      se.hasTelevision ? 1 : 0, se.hasPersonalVehicle ? 1 : 0,
      se.hasComputer ? 1 : 0, se.hasInternet ? 1 : 0, se.notes || ''
    );
  },

  update(id: string, data: Partial<Patient>): void {
    const db = getDatabase();
    const se = data.socioEconomic;
    const updates: string[] = [];
    const params: any[] = [];

    if (data.fullName !== undefined) { updates.push('full_name = ?'); params.push(data.fullName); }
    if (data.fatherHusbandName !== undefined) { updates.push('father_husband_name = ?'); params.push(data.fatherHusbandName); }
    if (data.cnic !== undefined) { updates.push('cnic = ?'); params.push(data.cnic); }
    if (data.dob !== undefined) { updates.push('dob = ?'); params.push(data.dob); }
    if (data.age !== undefined) { updates.push('age = ?'); params.push(data.age); }
    if (data.gender !== undefined) { updates.push('gender = ?'); params.push(data.gender); }
    if (data.maritalStatus !== undefined) { updates.push('marital_status = ?'); params.push(data.maritalStatus); }
    if (data.occupation !== undefined) { updates.push('occupation = ?'); params.push(data.occupation); }
    if (data.mobile !== undefined) { updates.push('mobile = ?'); params.push(data.mobile); }
    if (data.alternateContact !== undefined) { updates.push('alternate_contact = ?'); params.push(data.alternateContact); }
    if (data.address !== undefined) { updates.push('address = ?'); params.push(data.address); }
    if (data.bloodGroup !== undefined) { updates.push('blood_group = ?'); params.push(data.bloodGroup); }
    if (data.photo !== undefined) { updates.push('photo = ?'); params.push(data.photo); }
    if (data.referredBy !== undefined) { updates.push('referred_by = ?'); params.push(data.referredBy); }

    if (se) {
      if (se.housingStatus !== undefined) { updates.push('housing_status = ?'); params.push(se.housingStatus); }
      if (se.houseType !== undefined) { updates.push('house_type = ?'); params.push(se.houseType); }
      if (se.numberOfRooms !== undefined) { updates.push('number_of_rooms = ?'); params.push(se.numberOfRooms); }
      if (se.monthlyRent !== undefined) { updates.push('monthly_rent = ?'); params.push(se.monthlyRent); }
      if (se.ownsLand !== undefined) { updates.push('owns_land = ?'); params.push(se.ownsLand ? 1 : 0); }
      if (se.landAcres !== undefined) { updates.push('land_acres = ?'); params.push(se.landAcres); }
      if (se.monthlyElectricityBill !== undefined) { updates.push('monthly_electricity_bill = ?'); params.push(se.monthlyElectricityBill); }
      if (se.waterSource !== undefined) { updates.push('water_source = ?'); params.push(se.waterSource); }
      if (se.toiletType !== undefined) { updates.push('toilet_type = ?'); params.push(se.toiletType); }
      if (se.cookingFuel !== undefined) { updates.push('cooking_fuel = ?'); params.push(se.cookingFuel); }
      if (se.monthlyHouseholdIncome !== undefined) { updates.push('monthly_household_income = ?'); params.push(se.monthlyHouseholdIncome); }
      if (se.numberOfDependents !== undefined) { updates.push('number_of_dependents = ?'); params.push(se.numberOfDependents); }
      if (se.numberOfEarningMembers !== undefined) { updates.push('number_of_earning_members = ?'); params.push(se.numberOfEarningMembers); }
      if (se.educationLevel !== undefined) { updates.push('education_level = ?'); params.push(se.educationLevel); }
      if (se.employmentStatus !== undefined) { updates.push('employment_status = ?'); params.push(se.employmentStatus); }
      if (se.hasRefrigerator !== undefined) { updates.push('has_refrigerator = ?'); params.push(se.hasRefrigerator ? 1 : 0); }
      if (se.hasTelevision !== undefined) { updates.push('has_television = ?'); params.push(se.hasTelevision ? 1 : 0); }
      if (se.hasPersonalVehicle !== undefined) { updates.push('has_personal_vehicle = ?'); params.push(se.hasPersonalVehicle ? 1 : 0); }
      if (se.hasComputer !== undefined) { updates.push('has_computer = ?'); params.push(se.hasComputer ? 1 : 0); }
      if (se.hasInternet !== undefined) { updates.push('has_internet = ?'); params.push(se.hasInternet ? 1 : 0); }
      if (se.notes !== undefined) { updates.push('socio_notes = ?'); params.push(se.notes); }
    }

    if (updates.length === 0) return;
    params.push(id);
    db.prepare(`UPDATE patients SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  },

  count(): number {
    const db = getDatabase();
    const row = db.prepare('SELECT COUNT(*) as count FROM patients').get() as any;
    return row.count;
  },

  delete(id: string): void {
    const db = getDatabase();
    db.prepare('DELETE FROM patients WHERE id = ?').run(id);
  },
};
