import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';
import { User, UserRole } from '../../types';

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

export default function SystemStaff() {
  const token = useAppStore(s => s.token);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchUsers = () => {
    if (!token) return;
    fetch(`${API_BASE}/auth/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (!r.ok) throw new Error('Failed'); return r.json(); })
      .then(d => setUsers(d))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [token]);

  const roleColor = (r: string) => {
    if (r === 'Admin') return 'bg-purple-50 text-purple-700';
    if (r === 'Doctor') return 'bg-blue-50 text-blue-700';
    if (r === 'Pharmacy Staff') return 'bg-emerald-50 text-emerald-700';
    if (r === 'Receptionist') return 'bg-amber-50 text-amber-700';
    return 'bg-slate-100 text-slate-600';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">System Staff</h2>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors cursor-pointer">
          + Add Staff
        </button>
      </div>

      {showForm && (
        <UserForm onSaved={() => { setShowForm(false); fetchUsers(); }} onCancel={() => setShowForm(false)} />
      )}

      {error && <div className="text-center py-6 text-sm text-rose-500">{error}</div>}
      {loading && <div className="text-center py-6 text-sm text-slate-400">Loading staff...</div>}

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Username</th>
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm text-blue-600 border border-slate-200">
                        {u.name?.charAt(0) || 'U'}
                      </div>
                      <span className="font-medium text-slate-800">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{u.username}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${roleColor(u.role)}`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${u.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {u.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && !loading && (
          <div className="text-center py-10 text-sm text-slate-400">No staff found.</div>
        )}
      </div>
    </div>
  );
}

function UserForm({ onSaved, onCancel }: { onSaved: () => void; onCancel: () => void }) {
  const token = useAppStore(s => s.token);
  const [form, setForm] = useState({ name: '', username: '', password: '', role: 'Receptionist' as UserRole });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/auth/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Failed' }));
        throw new Error(err.error || 'Failed');
      }
      onSaved();
    } catch (e: any) {
      setError(e.message);
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-slate-900">Add New Staff Member</h3>
      {error && <div className="text-xs text-rose-500 bg-rose-50 px-3 py-2 rounded-lg">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Full Name *</label>
          <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Dr. Ahmed Khan"
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <p className="text-[10px] text-slate-400 mt-1">Staff member's full display name</p>
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Username *</label>
          <input required value={form.username} onChange={e => setForm({ ...form, username: e.target.value })}
            placeholder="e.g. ahmed.khan"
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <p className="text-[10px] text-slate-400 mt-1">Used to log in to the system</p>
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Password *</label>
          <input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
            placeholder="Min. 6 characters"
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <p className="text-[10px] text-slate-400 mt-1">Minimum 6 characters required</p>
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Role *</label>
          <select required value={form.role} onChange={e => setForm({ ...form, role: e.target.value as UserRole })}
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {['Admin', 'Doctor', 'Receptionist', 'Pharmacy Staff', 'Lab Staff'].map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <p className="text-[10px] text-slate-400 mt-1">Determines system access permissions</p>
        </div>
      </div>
      <div className="flex items-center gap-2 pt-2">
        <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 cursor-pointer">{saving ? 'Creating...' : 'Create'}</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-200 cursor-pointer">Cancel</button>
      </div>
    </form>
  );
}
