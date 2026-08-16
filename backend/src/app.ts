import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { env } from './config/env.js';
import { initializeDatabase } from './config/database.js';
import { seedDatabase } from './config/seed.js';
import authRoutes from './routes/auth.routes.js';
import patientRoutes from './routes/patient.routes.js';
import consultationRoutes from './routes/consultation.routes.js';
import prescriptionRoutes from './routes/prescription.routes.js';
import pharmacyRoutes from './routes/pharmacy.routes.js';
import assistanceRoutes from './routes/assistance.routes.js';
import donorRoutes from './routes/donor.routes.js';
import fileRequestRoutes from './routes/file-request.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import auditRoutes from './routes/audit.routes.js';
import publicRoutes from './routes/public.routes.js';
import reportsRoutes from './routes/reports.routes.js';
import donationRoutes from './routes/donation.routes.js';
import labRoutes from './routes/lab.routes.js';

let dbInitialized = false;

function ensureDb() {
  if (dbInitialized) return;
  try {
    const dbDir = path.dirname(env.DATABASE_PATH);
    if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
    console.log(`Database: ${env.DATABASE_PATH}`);
    initializeDatabase();
    seedDatabase();
    dbInitialized = true;
  } catch (err: any) {
    console.error('DATABASE INIT FAILED:', err.message);
    throw err;
  }
}

ensureDb();

const app = express();

app.use(helmet({
  contentSecurityPolicy: false,
}));

app.use(cors({
  origin: [
    'https://heart-health-care-erp.vercel.app',
    process.env.RENDER_EXTERNAL_URL || '',
    'http://localhost:5173',
    'http://localhost:3000',
  ].filter(Boolean),
  credentials: true,
}));

app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false }));
app.use('/api/auth/login', rateLimit({ windowMs: 5 * 60 * 1000, max: 50, skipSuccessfulRequests: true, message: { error: 'Too many login attempts' } }));
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/inventory', pharmacyRoutes);
app.use('/api/assistance', assistanceRoutes);
app.use('/api/donor-payments', donorRoutes);
app.use('/api/file-requests', fileRequestRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/lab', labRoutes);

app.get('/health', (_req, res) => { res.json({ status: 'ok' }); });

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

export default app;
