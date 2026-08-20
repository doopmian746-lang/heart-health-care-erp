import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import { FileRequest } from '../../types';

const API_BASE = '/api';

export default function FileRequestList() {
  const navigate = useNavigate();
  const token = useAppStore(s => s.token);
  const patients = useAppStore(s => s.patients);
  const [requests, setRequests] = useState<FileRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Fulfilled' | 'Rejected'>('All');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [actionItem, setActionItem] = useState<FileRequest | null>(null);
  const [actionRemarks, setActionRemarks] = useState('');

  const fetchData = () => {
    if (!token) return;
    fetch(`${API_BASE}/file-requests`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (!r.ok) throw new Error('Failed'); return r.json(); })
      .then(d => setRequests(d))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [token]);

  const filtered = requests
    .filter(r => filter === 'All' || r.status === filter)
    .filter(r =>
      r.patientName.toLowerCase().includes(search.toLowerCase()) ||
      r.patientId.toLowerCase().includes(search.toLowerCase()) ||
      r.purpose.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase())
    );

  const statusColor = (s: string) => {
    if (s === 'Fulfilled') return 'bg-emerald-50 text-emerald-700';
    if (s === 'Rejected') return 'bg-rose-50 text-rose-700';
    return 'bg-amber-50 text-amber-700';
  };

  const urgencyColor = (u: string) => {
    if (u === 'Emergency') return 'bg-rose-100 text-rose-700';
    if (u === 'High') return 'bg-orange-100 text-orange-700';
    if (u === 'Medium') return 'bg-amber-100 text-amber-700';
    return 'bg-slate-100 text-slate-600';
  };

  const handleCreate = async (data: { patientId: string; purpose: string; urgency: string }) => {
    try {
      const res = await fetch(`${API_BASE}/file-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed');
      setShowForm(false);
      fetchData();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleAction = async (id: string, action: 'Fulfilled' | 'Rejected') => {
    try {
      const res = await fetch(`${API_BASE}/file-requests/${id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action, remarks: actionRemarks }),
      });
      if (!res.ok) throw new Error('Failed');
      setActionItem(null);
      setActionRemarks('');
      fetchData();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const pendingCount = requests.filter(r => r.status === 'Pending').length;
  const fulfilledCount = requests.filter(r => r.status === 'Fulfilled').length;
  const emergencyCount = requests.filter(r => r.urgency === 'Emergency' && r.status === 'Pending').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">File Requests</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {pendingCount} pending · {fulfilledCount} fulfilled
            {emergencyCount > 0 && <span className="text-rose-600 font-medium"> · {emergencyCount} emergency</span>}
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors cursor-pointer">
          + New Request
        </button>
      </div>

      {showForm && (
        <FileRequestForm patients={patients} onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      )}

      {actionItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Review Request</h3>
            <div className="bg-slate-50 rounded-xl p-4 space-y-2">
              <p className="text-sm text-slate-700"><span className="text-slate-400">Patient:</span> <span className="font-medium">{actionItem.patientName}</span> <span className="font-mono text-[10px] text-slate-400">{actionItem.patientId}</span></p>
              <p className="text-sm text-slate-700"><span className="text-slate-400">Purpose:</span> <span className="font-medium">{actionItem.purpose}</span></p>
              <p className="text-sm text-slate-700"><span className="text-slate-400">Urgency:</span> <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${urgencyColor(actionItem.urgency)}`}>{actionItem.urgency}</span></p>
              <p className="text-sm text-slate-700"><span className="text-slate-400">Requested by:</span> <span className="font-medium">{actionItem.requestedBy}</span></p>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Remarks (optional)</label>
              <textarea value={actionRemarks} onChange={e => setActionRemarks(e.target.value)} rows={2}
                placeholder="Add any notes about this action..."
                className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button onClick={() => handleAction(actionItem.id, 'Fulfilled')}
                className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 cursor-pointer">✓ Fulfilled</button>
              <button onClick={() => handleAction(actionItem.id, 'Rejected')}
                className="px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-xl hover:bg-rose-700 cursor-pointer">✗ Rejected</button>
              <button onClick={() => { setActionItem(null); setActionRemarks(''); }} className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-200 cursor-pointer ml-auto">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Filters + Search */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          {(['All', 'Pending', 'Fulfilled', 'Rejected'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer transition-colors ${filter === f ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {f} {f === 'Pending' && pendingCount > 0 && <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-[9px]">{pendingCount}</span>}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by patient name, MR No, or purpose..."
            className="w-full px-4 py-2 pl-10 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {error && <div className="text-center py-6 text-sm text-rose-500">{error}</div>}
      {loading && <div className="text-center py-6 text-sm text-slate-400">Loading...</div>}

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="text-left px-4 py-3">Request ID</th>
                <th className="text-left px-4 py-3">Patient</th>
                <th className="text-left px-4 py-3">Purpose</th>
                <th className="text-left px-4 py-3">Urgency</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Requested By</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-right px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{r.id}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-slate-800 text-xs">{r.patientName}</span>
                    <div className="text-[10px] font-mono text-blue-600">{r.patientId}</div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-700 max-w-[200px] truncate">{r.purpose}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${urgencyColor(r.urgency)}`}>{r.urgency}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${statusColor(r.status)}`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{r.requestedBy}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">{new Date(r.requestDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => navigate(`/app/patients/${r.patientId}`)}
                        className="px-2 py-1.5 text-[10px] bg-slate-100 text-slate-600 font-medium rounded-lg hover:bg-slate-200 cursor-pointer">View Patient</button>
                      {r.status === 'Pending' && (
                        <button onClick={() => setActionItem(r)}
                          className="px-2.5 py-1.5 text-[10px] bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 cursor-pointer">Review</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && !loading && (
          <div className="text-center py-10 text-sm text-slate-400">
            {search ? 'No file requests match your search.' : 'No file requests found.'}
          </div>
        )}
      </div>
    </div>
  );
}

function FileRequestForm({ patients, onSubmit, onCancel }: { patients: any[]; onSubmit: (d: any) => void; onCancel: () => void }) {
  const [form, setForm] = useState({ patientId: '', purpose: '', urgency: 'Medium' });
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form); }} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-slate-900">New File Request</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Patient *</label>
          <select required value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })}
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select patient...</option>
            {patients.map(p => <option key={p.id} value={p.id}>{p.fullName} ({p.patientCode})</option>)}
          </select>
          <p className="text-[10px] text-slate-400 mt-1">Patient whose file is needed</p>
        </div>
        <div className="sm:col-span-2">
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Purpose *</label>
          <input required value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })}
            placeholder="e.g. Hospital transfer, Specialist referral, Insurance claim..."
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <p className="text-[10px] text-slate-400 mt-1">Reason the file is being requested</p>
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Urgency *</label>
          <select required value={form.urgency} onChange={e => setForm({ ...form, urgency: e.target.value })}
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {['Low', 'Medium', 'High', 'Emergency'].map(u => <option key={u} value={u}>{u}</option>)}
          </select>
          <p className="text-[10px] text-slate-400 mt-1">How quickly the file is needed</p>
        </div>
      </div>
      <div className="flex items-center gap-2 pt-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 cursor-pointer">Submit Request</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-200 cursor-pointer">Cancel</button>
      </div>
    </form>
  );
}
