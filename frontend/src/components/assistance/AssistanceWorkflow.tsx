import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';
import { FoundationAssistance } from '../../types';

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

export default function AssistanceWorkflow() {
  const token = useAppStore(s => s.token);
  const [requests, setRequests] = useState<FoundationAssistance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [showForm, setShowForm] = useState(false);
  const [actionItem, setActionItem] = useState<FoundationAssistance | null>(null);

  const fetchData = () => {
    if (!token) return;
    fetch(`${API_BASE}/assistance`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (!r.ok) throw new Error('Failed'); return r.json(); })
      .then(d => setRequests(d))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [token]);

  const filtered = filter === 'All' ? requests : requests.filter(r => r.status === filter as any);
  const totalGranted = requests.filter(r => r.status === 'Approved').reduce((s, r) => s + r.foundationContribution, 0);

  const statusColor = (s: string) => {
    if (s === 'Approved') return 'bg-emerald-50 text-emerald-700';
    if (s === 'Rejected') return 'bg-rose-50 text-rose-700';
    return 'bg-amber-50 text-amber-700';
  };

  const handleAction = async (id: string, status: 'Approved' | 'Rejected', remarks: string) => {
    try {
      const res = await fetch(`${API_BASE}/assistance/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status, remarks }),
      });
      if (!res.ok) throw new Error('Action failed');
      setActionItem(null);
      fetchData();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Assistance Workflow</h2>
          <p className="text-xs text-slate-400 mt-0.5">Total Granted: Rs. {totalGranted.toLocaleString()}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors cursor-pointer">
          + New Request
        </button>
      </div>

      {showForm && (
        <AssistanceForm onSaved={() => { setShowForm(false); fetchData(); }} onCancel={() => setShowForm(false)} />
      )}

      {actionItem && (
        <ActionModal item={actionItem} onAction={handleAction} onClose={() => setActionItem(null)} />
      )}

      <div className="flex items-center gap-2">
        {(['All', 'Pending', 'Approved', 'Rejected'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer transition-colors ${filter === f ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {f} {f !== 'All' && `(${requests.filter(r => r.status === f).length})`}
          </button>
        ))}
      </div>

      {error && <div className="text-center py-6 text-sm text-rose-500">{error}</div>}
      {loading && <div className="text-center py-6 text-sm text-slate-400">Loading...</div>}

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="text-left px-4 py-3">ID</th>
                <th className="text-left px-4 py-3">Patient</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-right px-4 py-3">Est. Cost</th>
                <th className="text-right px-4 py-3">Foundation</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-right px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{r.id}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-slate-800">{r.patientName}</span>
                    <div className="text-[10px] font-mono text-blue-600">{r.patientId}</div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{r.type || '—'}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs">Rs. {r.estimatedCost.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs font-medium">Rs. {r.foundationContribution.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${statusColor(r.status)}`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">{new Date(r.requestDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    {r.status === 'Pending' && (
                      <button onClick={() => setActionItem(r)}
                        className="px-2.5 py-1.5 text-[10px] bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 cursor-pointer">Review</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && !loading && (
          <div className="text-center py-10 text-sm text-slate-400">No assistance requests found.</div>
        )}
      </div>
    </div>
  );
}

function AssistanceForm({ onSaved, onCancel }: { onSaved: () => void; onCancel: () => void }) {
  const token = useAppStore(s => s.token);
  const patients = useAppStore(s => s.patients);
  const [form, setForm] = useState({
    patientId: '',
    type: '',
    estimatedCost: 0,
    patientContribution: 0,
    foundationContribution: 0,
    justification: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const patient = patients.find(p => p.id === form.patientId);
      const res = await fetch(`${API_BASE}/assistance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, patientName: patient?.fullName || '' }),
      });
      if (!res.ok) throw new Error('Failed');
      onSaved();
    } catch { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-slate-900">New Assistance Request</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Patient *</label>
          <select required value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })}
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select patient...</option>
            {patients.map(p => <option key={p.id} value={p.id}>{p.fullName} ({p.id})</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Type</label>
          <input value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
            placeholder="e.g. Surgery, Medication, Procedure"
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Estimated Cost (Rs.)</label>
          <input type="number" value={form.estimatedCost} onChange={e => setForm({ ...form, estimatedCost: parseFloat(e.target.value) || 0 })}
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Patient Contribution (Rs.)</label>
          <input type="number" value={form.patientContribution} onChange={e => setForm({ ...form, patientContribution: parseFloat(e.target.value) || 0 })}
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Foundation Contribution (Rs.)</label>
          <input type="number" value={form.foundationContribution} onChange={e => setForm({ ...form, foundationContribution: parseFloat(e.target.value) || 0 })}
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Justification</label>
          <textarea value={form.justification} onChange={e => setForm({ ...form, justification: e.target.value })}
            rows={3} className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <div className="flex items-center gap-2 pt-2">
        <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 cursor-pointer">{saving ? 'Saving...' : 'Submit'}</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-200 cursor-pointer">Cancel</button>
      </div>
    </form>
  );
}

function ActionModal({ item, onAction, onClose }: { item: FoundationAssistance; onAction: (id: string, status: 'Approved' | 'Rejected', remarks: string) => void; onClose: () => void }) {
  const [remarks, setRemarks] = useState('');
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Review Assistance Request</h3>
        <div className="space-y-2 text-sm">
          <p><span className="text-slate-400">Patient:</span> {item.patientName} ({item.patientId})</p>
          <p><span className="text-slate-400">Type:</span> {item.type || '—'}</p>
          <p><span className="text-slate-400">Estimated Cost:</span> Rs. {item.estimatedCost.toLocaleString()}</p>
          <p><span className="text-slate-400">Foundation Contribution:</span> Rs. {item.foundationContribution.toLocaleString()}</p>
          <p><span className="text-slate-400">Justification:</span> {item.justification || '—'}</p>
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Remarks</label>
          <textarea value={remarks} onChange={e => setRemarks(e.target.value)} rows={3}
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex items-center gap-2 pt-2">
          <button onClick={() => onAction(item.id, 'Approved', remarks)} className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 cursor-pointer">Approve</button>
          <button onClick={() => onAction(item.id, 'Rejected', remarks)} className="px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-xl hover:bg-rose-700 cursor-pointer">Reject</button>
          <button onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-200 cursor-pointer ml-auto">Cancel</button>
        </div>
      </div>
    </div>
  );
}
