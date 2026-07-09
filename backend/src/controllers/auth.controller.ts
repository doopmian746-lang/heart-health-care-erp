import { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { userRepo } from '../repositories/user.repo.js';
import { createAuditLog } from '../services/audit.service.js';
import { AuthRequest } from '../middleware/auth.js';

export const authController = {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      const result = await authService.login(username, password);
      if (!result) {
        res.status(401).json({ success: false, error: 'Invalid username or password' });
        return;
      }
      res.json({ success: true, user: result.user, token: result.token });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },

  async createUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await authService.createUser(req.body);
      createAuditLog(req.user?.name || 'Admin', 'User Created', 'User', user.id, `Created user ${user.name} with role ${user.role}`);
      const { passwordHash, ...safeUser } = user;
      res.json(safeUser);
    } catch (err: any) {
      if (err.message?.includes('UNIQUE')) {
        res.status(400).json({ error: 'Username already exists' });
        return;
      }
      res.status(500).json({ error: 'Failed to create user' });
    }
  },

  getUsers(_req: Request, res: Response): void {
    const users = userRepo.findAll();
    res.json(users.map(({ passwordHash, ...u }) => u));
  },

  getProfile(req: AuthRequest, res: Response): void {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    const { passwordHash, ...safeUser } = req.user;
    res.json(safeUser);
  },
};
