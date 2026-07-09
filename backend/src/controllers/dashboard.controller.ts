import { Request, Response } from 'express';
import { patientRepo } from '../repositories/patient.repo.js';
import { consultationRepo } from '../repositories/consultation.repo.js';
import { inventoryRepo } from '../repositories/inventory.repo.js';
import { assistanceRepo } from '../repositories/assistance.repo.js';
import { DashboardStats } from '../types/index.js';

export const dashboardController = {
  getStats(_req: Request, res: Response): void {
    const patients = patientRepo.findAll();
    const consultations = consultationRepo.findAll();
    const inventory = inventoryRepo.findAll();
    const assistance = assistanceRepo.findAll();

    const todayStr = new Date().toISOString().split('T')[0];
    const todayConsultations = consultations.filter(c => c.visitDate.startsWith(todayStr));

    const stats: DashboardStats = {
      totalPatients: patients.length,
      todayConsultations: todayConsultations.length,
      pendingAssistance: assistance.filter(r => r.status === 'Pending').length,
      lowStockMedicines: inventory.filter(m => m.quantityAvailable <= m.minimumStockLevel).length,
      totalFundsGranted: assistance.filter(r => r.status === 'Approved').reduce((s, r) => s + r.foundationContribution, 0),
      monthlyRegistrations: (() => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const counts = new Array(12).fill(0);
        patients.forEach(p => {
          const month = new Date(p.registrationDate).getMonth();
          counts[month]++;
        });
        return months.map((month, i) => ({ month, count: counts[i] }));
      })(),
      recentConsultations: consultations.slice(0, 5),
      pendingRequests: assistance.filter(r => r.status === 'Pending').slice(0, 5),
    };

    res.json(stats);
  },
};
