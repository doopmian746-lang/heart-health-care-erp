import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';
import { AuditLog } from '../../types';

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

export default function AuditLogs() {
  const token = useAppStore(s => s.token);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/audit-logs`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (!r.ok) throw new Error('Failed to fetch audit logs'); return r.json(); })
      .then(d => setLogs(d))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  const filtered = logs.filter(l =>
    l.user.toLowerCase().includes(search.toLowerCase()) ||
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.entityType.toLowerCase().includes(search.toLowerCase()) ||
    l.entityId.toLowerCase().includes(search.toLowerCase())
  );

  const actionColor = (a: string) => {
    if (a.includes('Create') || a.includes('create')) return 'bg-emerald-50 text-emerald-700';
    if (a.includes('Update') || a.includes('update')) return 'bg-blue-50 text-blue-700';
    if (a.includes('Delete') || a.includes('delete')) return 'bg-rose-50 text-rose-700';
    if (a.includes('Approve') || a.includes('approve')) return 'bg-teal-50 text-teal-700';
    if (a.includes('Reject') || a.includes('reject')) return 'bg-orange-50 text-orange-700';
    return 'bg-slate-100 text-slate-600';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Audit Logs</h2>
        <span className="text-xs text-slate-400 font-mono">{logs.length} entries</span>
      </div>

      <div className="relative">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by user, action, entity..."
          className="w-full px-4 py-2.5 pl-10 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <svg className="absolute left-3 top-3 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {error && <div className="text-center py-6 text-sm text-rose-500">{error}</div>}
      {loading && <div className="text-center py-6 text-sm text-slate-400">Loading audit logs...</div>}

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="text-left px-4 py-3">Timestamp</th>
                <th className="text-left px-4 py-3">User</th>
                <th className="text-left px-4 py-3">Action</th>
                <th className="text-left px-4 py-3">Entity</th>
                <th className="text-left px-4 py-3">Entity ID</th>
                <th className="text-left px-4 py-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-xs text-slate-400 font-mono whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{log.user}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${actionColor(log.action)}`}>{log.action}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{log.entityType}</td>
                  <td className="px-4 py-3 font-mono text-xs text-blue-600">{log.entityId}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 max-w-[250px] truncate">{log.details || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && !loading && (
          <div className="text-center py-10 text-sm text-slate-400">No audit logs found.</div>
        )}
      </div>
    </div>
  );
}
