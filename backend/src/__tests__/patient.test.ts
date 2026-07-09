import { describe, it, expect, beforeAll } from 'vitest';
import { initializeDatabase, getDatabase } from '../config/database.js';
import { patientRepo } from '../repositories/patient.repo.js';
import { userRepo } from '../repositories/user.repo.js';
import { Patient } from '../types/index.js';

beforeAll(() => {
  initializeDatabase();
});

describe('Patient Repository', () => {
  it('should create and retrieve a patient with socio-economic data', () => {
    const patient: Patient = {
      id: 'P-TEST-001',
      patientCode: 'HH-99-0001',
      fullName: 'Test Patient',
      fatherHusbandName: 'Test Father',
      cnic: '12345-6789012-3',
      dob: '1980-01-01',
      age: 44,
      gender: 'Male',
      maritalStatus: 'Married',
      occupation: 'Tester',
      mobile: '0300-0000000',
      alternateContact: '',
      address: 'Test Address',
      bloodGroup: 'O+',
      photo: '',
      referredBy: 'Test',
      registrationDate: new Date().toISOString(),
      createdBy: 'u-1',
      socioEconomic: {
        housingStatus: 'Rented',
        houseType: 'Room',
        numberOfRooms: 1,
        monthlyRent: 5000,
        ownsLand: false,
        landAcres: 0,
        monthlyElectricityBill: 1000,
        waterSource: 'Tap',
        toiletType: 'Flush',
        cookingFuel: 'Gas',
        monthlyHouseholdIncome: 15000,
        numberOfDependents: 3,
        numberOfEarningMembers: 1,
        educationLevel: 'Matric',
        employmentStatus: 'Self-Employed',
        hasRefrigerator: true,
        hasTelevision: true,
        hasPersonalVehicle: false,
        hasComputer: false,
        hasInternet: false,
        notes: 'Test socio-economic data',
      },
    };

    patientRepo.create(patient);

    const retrieved = patientRepo.findById('P-TEST-001');
    expect(retrieved).toBeDefined();
    expect(retrieved!.fullName).toBe('Test Patient');
    expect(retrieved!.socioEconomic).toBeDefined();
    expect(retrieved!.socioEconomic!.housingStatus).toBe('Rented');
    expect(retrieved!.socioEconomic!.monthlyRent).toBe(5000);
    expect(retrieved!.socioEconomic!.monthlyHouseholdIncome).toBe(15000);
    expect(retrieved!.socioEconomic!.hasRefrigerator).toBe(true);
    expect(retrieved!.socioEconomic!.cookingFuel).toBe('Gas');
    expect(retrieved!.socioEconomic!.educationLevel).toBe('Matric');

    // Cleanup
    patientRepo.delete('P-TEST-001');
  });

  it('should search patients by name', () => {
    const results = patientRepo.findAll('Abdul');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].fullName).toContain('Abdul');
  });

  it('should count patients correctly', () => {
    const count = patientRepo.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });
});

describe('User Repository', () => {
  it('should find admin user', () => {
    const admin = userRepo.findByUsername('admin');
    expect(admin).toBeDefined();
    expect(admin!.name).toBe('Dr. Bilal Ahmad');
    expect(admin!.role).toBe('Admin');
    expect(admin!.active).toBe(true);
  });

  it('should authenticate with bcrypt hash', () => {
    const admin = userRepo.findByUsername('admin');
    expect(admin!.passwordHash).not.toBe('');
    expect(admin!.passwordHash).not.toBe('admin123');
  });
});
