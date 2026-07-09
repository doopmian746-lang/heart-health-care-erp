import { getDatabase } from '../config/database.js';
import { User } from '../types/index.js';

const rowToUser = (row: any): User => ({
  id: row.id,
  username: row.username,
  name: row.name,
  role: row.role,
  passwordHash: row.password_hash,
  active: Boolean(row.active),
  createdAt: row.created_at,
});

export const userRepo = {
  findAll(): User[] {
    const db = getDatabase();
    return db.prepare('SELECT * FROM users ORDER BY name ASC').all().map(rowToUser);
  },

  findById(id: string): User | undefined {
    const db = getDatabase();
    const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as any;
    return row ? rowToUser(row) : undefined;
  },

  findByUsername(username: string): User | undefined {
    const db = getDatabase();
    const row = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any;
    return row ? rowToUser(row) : undefined;
  },

  create(user: User): void {
    const db = getDatabase();
    db.prepare(`
      INSERT INTO users (id, username, name, role, password_hash, active, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(user.id, user.username, user.name, user.role, user.passwordHash, user.active ? 1 : 0, user.createdAt);
  },

  update(id: string, data: Partial<User>): void {
    const db = getDatabase();
    const updates: string[] = [];
    const params: any[] = [];
    if (data.name !== undefined) { updates.push('name = ?'); params.push(data.name); }
    if (data.role !== undefined) { updates.push('role = ?'); params.push(data.role); }
    if (data.active !== undefined) { updates.push('active = ?'); params.push(data.active ? 1 : 0); }
    if (data.passwordHash !== undefined) { updates.push('password_hash = ?'); params.push(data.passwordHash); }
    if (updates.length === 0) return;
    params.push(id);
    db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  },

  delete(id: string): void {
    const db = getDatabase();
    db.prepare('DELETE FROM users WHERE id = ?').run(id);
  },

  count(): number {
    const db = getDatabase();
    const row = db.prepare('SELECT COUNT(*) as count FROM users').get() as any;
    return row.count;
  },
};
