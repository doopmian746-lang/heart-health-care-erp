import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

const isProd = process.env.NODE_ENV === 'production';

const defaultDbPath = isProd
  ? '/tmp/data/heart_erp.db'
  : path.resolve(process.cwd(), '../data/heart_erp.db');

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  JWT_SECRET: isProd ? requireEnv('JWT_SECRET') : (process.env.JWT_SECRET || 'dev-secret-change-in-production'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '8h',
  DATABASE_PATH: process.env.DATABASE_PATH || defaultDbPath,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@heartfoundation.org',
};
