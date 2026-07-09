import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { userRepo } from '../repositories/user.repo.js';
import { User } from '../types/index.js';

export const authService = {
  async login(username: string, password: string): Promise<{ user: Omit<User, 'passwordHash'>; token: string } | null> {
    const user = userRepo.findByUsername(username);
    if (!user || !user.active) return null;

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return null;

    const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions);

    const { passwordHash, ...safeUser } = user;
    return { user: safeUser, token };
  },

  async createUser(data: { name: string; username: string; role: User['role']; password: string }): Promise<User> {
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user: User = {
      id: `u-${Date.now()}`,
      username: data.username,
      name: data.name,
      role: data.role,
      passwordHash,
      active: true,
      createdAt: new Date().toISOString(),
    };
    userRepo.create(user);
    return user;
  },
};
