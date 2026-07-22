import { Request, Response } from 'express';
import { patientRepo } from '../repositories/patient.repo.js';
import { consultationRepo } from '../repositories/consultation.repo.js';
import { prescriptionRepo } from '../repositories/prescription.repo.js';
import { inventoryRepo } from '../repositories/inventory.repo.js';
import { assistanceRepo } from '../repositories/assistance.repo.js';
import { donorRepo } from '../repositories/donor.repo.js';
import { fileRequestRepo } from '../repositories/file-request.repo.js';
import { userRepo } from '../repositories/user.repo.js';

function getDateRange(period: string, startDate?: string, endDate?: string) {
  const now = new Date();
  let start: Date, end: Date;

  if (startDate && endDate) {
    start = new Date(startDate);
    end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
  } else {
    switch (period) {
      case 'daily':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        break;
      case 'weekly':
        const dayOfWeek = now.getDay();
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setDate(end.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        break;
      case 'monthly':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        break;
      case 'yearly':
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        break;
      default:
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    }
  }

  return { start, end };
}

function filterByDate<T extends { date?: string; visitDate?: string; registrationDate?: string; paymentDate?: string; requestDate?: string; createdAt?: string }>(
  items: T[],
  start: Date,
  end: Date,
  dateField: keyof T = 'date'
): T[] {
  return items.filter(item => {
    const dateStr = item[dateField] || item.visitDate || item.registrationDate || item.paymentDate || item.requestDate || item.createdAt;
    if (!dateStr) return false;
    const itemDate = new Date(dateStr);
    return itemDate >= start && itemDate <= end;
  });
}

export const reportsController = {
  getReport(req: Request, res: Response): void {
    const { period = 'daily', startDate, endDate } = req.query;
    const { start, end } = getDateRange(period as string, startDate as string, endDate as string);

    const patients = patientRepo.findAll();
    const consultations = consultationRepo.findAll();
    const prescriptions = prescriptionRepo.findAll();
    const inventory = inventoryRepo.findAll();
    const assistance = assistanceRepo.findAll();
    const donations = donorRepo.findAll();
    const fileRequests = fileRequestRepo.findAll();
    const users = userRepo.findAll();

    const patientsInPeriod = filterByDate(patients, start, end, 'registrationDate');
    const consultationsInPeriod = filterByDate(consultations, start, end, 'visitDate');
    const prescriptionsInPeriod = filterByDate(prescriptions, start, end, 'date');
    const assistanceInPeriod = filterByDate(assistance, start, end, 'requestDate');
    const donationsInPeriod = filterByDate(donations, start, end, 'paymentDate');
    const fileRequestsInPeriod = filterByDate(fileRequests, start, end, 'requestDate');

    const doctors = users.filter(u => u.role === 'Doctor');
    const doctorStats = doctors.map(doc => {
      const docConsultations = consultationsInPeriod.filter(c => c.doctorName === doc.name);
      const docPrescriptions = prescriptionsInPeriod.filter(p => p.doctorName === doc.name);
      return {
        id: doc.id,
        name: doc.name,
        consultations: docConsultations.length,
        prescriptions: docPrescriptions.length,
        patients: new Set(docConsultations.map(c => c.patientId)).size,
      };
    });

    const dailyBreakdown = (() => {
      const days: Record<string, { consultations: number; patients: number; prescriptions: number; donations: number; assistance: number }> = {};
      const current = new Date(start);
      while (current <= end) {
        const key = current.toISOString().split('T')[0];
        days[key] = { consultations: 0, patients: 0, prescriptions: 0, donations: 0, assistance: 0 };
        current.setDate(current.getDate() + 1);
      }

      consultationsInPeriod.forEach(c => {
        const key = c.visitDate.split('T')[0];
        if (days[key]) days[key].consultations++;
      });
      patientsInPeriod.forEach(p => {
        const key = p.registrationDate.split('T')[0];
        if (days[key]) days[key].patients++;
      });
      prescriptionsInPeriod.forEach(p => {
        const key = p.date.split('T')[0];
        if (days[key]) days[key].prescriptions++;
      });
      donationsInPeriod.forEach(d => {
        const key = d.paymentDate.split('T')[0];
        if (days[key]) days[key].donations++;
      });
      assistanceInPeriod.forEach(a => {
        const key = a.requestDate.split('T')[0];
        if (days[key]) days[key].assistance++;
      });

      return Object.entries(days).map(([date, data]) => ({ date, ...data }));
    })();

    const totalDonations = donationsInPeriod.reduce((sum, d) => sum + d.amount, 0);
    const totalAssistanceGranted = assistanceInPeriod.filter(a => a.status === 'Approved').reduce((sum, a) => sum + a.foundationContribution, 0);
    const totalAssistanceRequested = assistanceInPeriod.reduce((sum, a) => sum + a.estimatedCost, 0);
    const pendingAssistance = assistanceInPeriod.filter(a => a.status === 'Pending').length;

    const diagnosisCounts: Record<string, number> = {};
    consultationsInPeriod.forEach(c => {
      const dx = c.diagnosis || 'Unspecified';
      diagnosisCounts[dx] = (diagnosisCounts[dx] || 0) + 1;
    });
    const topDiagnoses = Object.entries(diagnosisCounts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([diagnosis, count]) => ({ diagnosis, count }));

    const medicineUsage: Record<string, number> = {};
    prescriptionsInPeriod.forEach(p => {
      p.items.forEach(item => {
        medicineUsage[item.medicineName] = (medicineUsage[item.medicineName] || 0) + 1;
      });
    });
    const topMedicines = Object.entries(medicineUsage).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([medicine, count]) => ({ medicine, count }));

    const assistanceByType: Record<string, number> = {};
    assistanceInPeriod.forEach(a => {
      assistanceByType[a.type || 'Other'] = (assistanceByType[a.type || 'Other'] || 0) + 1;
    });

    const assistanceByStatus = {
      Pending: assistanceInPeriod.filter(a => a.status === 'Pending').length,
      Approved: assistanceInPeriod.filter(a => a.status === 'Approved').length,
      Rejected: assistanceInPeriod.filter(a => a.status === 'Rejected').length,
    };

    const fileRequestsByStatus = {
      Pending: fileRequestsInPeriod.filter(f => f.status === 'Pending').length,
      Fulfilled: fileRequestsInPeriod.filter(f => f.status === 'Fulfilled').length,
      Rejected: fileRequestsInPeriod.filter(f => f.status === 'Rejected').length,
    };

    const fileRequestsByUrgency: Record<string, number> = {};
    fileRequestsInPeriod.forEach(f => {
      fileRequestsByUrgency[f.urgency] = (fileRequestsByUrgency[f.urgency] || 0) + 1;
    });

    const newPatientsByGender: Record<string, number> = {};
    patientsInPeriod.forEach(p => {
      newPatientsByGender[p.gender] = (newPatientsByGender[p.gender] || 0) + 1;
    });

    const newPatientsByAgeGroup: Record<string, number> = {};
    patientsInPeriod.forEach(p => {
      const age = p.age;
      let group = '';
      if (age < 18) group = '0-17';
      else if (age < 30) group = '18-29';
      else if (age < 45) group = '30-44';
      else if (age < 60) group = '45-59';
      else if (age < 75) group = '60-74';
      else group = '75+';
      newPatientsByAgeGroup[group] = (newPatientsByAgeGroup[group] || 0) + 1;
    });

    const lowStockItems = inventory.filter(m => m.quantityAvailable <= m.minimumStockLevel);
    const expiredItems = inventory.filter(m => new Date(m.expiryDate) < new Date());
    const expiringSoon = inventory.filter(m => {
      const expiry = new Date(m.expiryDate);
      const thirtyDays = new Date();
      thirtyDays.setDate(thirtyDays.getDate() + 30);
      return expiry <= thirtyDays && expiry >= new Date();
    });

    const consultationsByDoctor: Record<string, number> = {};
    consultationsInPeriod.forEach(c => {
      consultationsByDoctor[c.doctorName] = (consultationsByDoctor[c.doctorName] || 0) + 1;
    });

    res.json({
      period,
      dateRange: { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] },
      summary: {
        totalPatients: patients.length,
        newPatients: patientsInPeriod.length,
        totalConsultations: consultations.length,
        consultationsInPeriod: consultationsInPeriod.length,
        totalPrescriptions: prescriptions.length,
        prescriptionsInPeriod: prescriptionsInPeriod.length,
        totalDonations: donations.length,
        donationsInPeriod: donationsInPeriod.length,
        totalDonationAmount: totalDonations,
        totalAssistanceRequests: assistance.length,
        assistanceInPeriod: assistanceInPeriod.length,
        assistanceGranted: totalAssistanceGranted,
        assistanceRequested: totalAssistanceRequested,
        pendingAssistance,
        totalFileRequests: fileRequests.length,
        fileRequestsInPeriod: fileRequestsInPeriod.length,
        lowStockCount: lowStockItems.length,
        expiredCount: expiredItems.length,
        expiringSoonCount: expiringSoon.length,
      },
      dailyBreakdown,
      topDiagnoses,
      topMedicines,
      doctorPerformance: doctorStats,
      consultationsByDoctor,
      assistanceByType,
      assistanceByStatus,
      fileRequestsByStatus,
      fileRequestsByUrgency,
      newPatientsByGender,
      newPatientsByAgeGroup,
      lowStockItems: lowStockItems.map(m => ({ id: m.id, name: m.medicineName, available: m.quantityAvailable, minimum: m.minimumStockLevel, unitPrice: m.unitPrice })),
      expiredItems: expiredItems.map(m => ({ id: m.id, name: m.medicineName, expiryDate: m.expiryDate })),
      expiringSoonItems: expiringSoon.map(m => ({ id: m.id, name: m.medicineName, expiryDate: m.expiryDate, available: m.quantityAvailable })),
      recentConsultations: consultationsInPeriod.slice(-10).reverse(),
      recentDonations: donationsInPeriod.slice(-10).reverse(),
      recentAssistance: assistanceInPeriod.slice(-10).reverse(),
    });
  },

  getDailyReport(req: Request, res: Response): void {
    req.query.period = 'daily';
    reportsController.getReport(req, res);
  },

  getWeeklyReport(req: Request, res: Response): void {
    req.query.period = 'weekly';
    reportsController.getReport(req, res);
  },

  getMonthlyReport(req: Request, res: Response): void {
    req.query.period = 'monthly';
    reportsController.getReport(req, res);
  },

  getYearlyReport(req: Request, res: Response): void {
    req.query.period = 'yearly';
    reportsController.getReport(req, res);
  },

  getCustomReport(req: Request, res: Response): void {
    reportsController.getReport(req, res);
  },
};