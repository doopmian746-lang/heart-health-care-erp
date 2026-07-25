import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';
import { DonorPayment } from '../../types';

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

export default function DonorSponsorships() {
  const token = useAppStore(s => s.token);
  const currentUser = useAppStore(s => s.currentUser);
  const [payments, setPayments] = useState<DonorPayment[]>([]);
  const [pendingPayments, setPendingPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('all');

  const canVerify = currentUser?.role === 'Admin' || currentUser?.role === 'Receptionist';

  const fetchData = () => {
    if (!token) return;
    fetch(`${API_BASE}/donor-payments`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (!r.ok) throw new Error('Failed'); return r.json(); })
      .then(d => setPayments(d))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));

    if (canVerify) {
      fetch(`${API_BASE}/donor-payments/pending`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.ok ? r.json() : [])
        .then(d => setPendingPayments(d))
        .catch(() => {});
    }
  };

  useEffect(() => { fetchData(); }, [token]);

  const handleVerify = async (id: string, status: 'Verified' | 'Rejected') => {
    try {
      const res = await fetch(`${API_BASE}/donor-payments/${id}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed');
      fetchData();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const filtered = payments.filter(p =>
    p.donorName.toLowerCase().includes(search.toLowerCase()) ||
    p.receiptNumber.toLowerCase().includes(search.toLowerCase()) ||
    p.projectSponsorship?.toLowerCase().includes(search.toLowerCase())
  );

  const totalAmount = payments.reduce((s, p) => s + p.amount, 0);
  const verifiedAmount = payments.filter(p => (p as any).payment_status === 'Verified').reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Donor Sponsorships</h2>
          <p className="text-xs text-slate-400 mt-0.5">Total: Rs. {totalAmount.toLocaleString()} · Verified: Rs. {verifiedAmount.toLocaleString()}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors cursor-pointer">
          + Record Donation
        </button>
      </div>

      {showForm && (
        <DonorForm onSaved={() => { setShowForm(false); fetchData(); }} onCancel={() => setShowForm(false)} />
      )}

      {/* Pending Verification Tab */}
      {canVerify && pendingPayments.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-sm text-amber-800 mb-3">⏳ Pending Verification ({pendingPayments.length})</h3>
          <div className="space-y-3">
            {pendingPayments.map((p: any) => (
              <div key={p.id} className="bg-white border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700">{p.donor_name?.charAt(0) || 'D'}</div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{p.donor_name}</p>
                      <p className="text-[10px] text-slate-400">{p.email || 'No email'} · {p.phone || 'No phone'}</p>
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div><span className="text-slate-400">Amount:</span> <span className="font-bold text-emerald-700">Rs. {p.amount?.toLocaleString()}</span></div>
                    <div><span className="text-slate-400">Method:</span> <span className="font-medium">{p.payment_method}</span></div>
                    <div><span className="text-slate-400">Project:</span> <span className="font-medium">{p.project_sponsorship}</span></div>
                    <div><span className="text-slate-400">Txn ID:</span> <span className="font-mono font-bold text-blue-700">{p.transaction_id || '—'}</span></div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleVerify(p.id, 'Verified')} className="px-3 py-2 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 cursor-pointer">✓ Verify</button>
                  <button onClick={() => handleVerify(p.id, 'Rejected')} className="px-3 py-2 bg-rose-600 text-white text-xs font-medium rounded-lg hover:bg-rose-700 cursor-pointer">✗ Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer transition-colors ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
          All ({payments.length})
        </button>
        {canVerify && (
          <button onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer transition-colors ${activeTab === 'pending' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            Pending ({pendingPayments.length})
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by donor name, receipt number..."
          className="w-full px-4 py-2.5 pl-10 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <svg className="absolute left-3 top-3 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {error && <div className="text-center py-6 text-sm text-rose-500">{error}</div>}
      {loading && <div className="text-center py-6 text-sm text-slate-400">Loading...</div>}

      {/* Donations Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="text-left px-4 py-3">Donor</th>
                <th className="text-right px-4 py-3">Amount</th>
                <th className="text-left px-4 py-3">Method</th>
                <th className="text-left px-4 py-3">Project</th>
                <th className="text-left px-4 py-3">Txn ID</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(p => {
                const ps = (p as any).payment_status || 'Verified';
                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center text-[10px] font-bold text-rose-700">{p.donorName?.charAt(0) || 'D'}</div>
                        <div>
                          <span className="font-medium text-slate-800 text-xs">{p.donorName}</span>
                          <div className="text-[10px] text-slate-400">{p.email || '—'} · {p.phone || '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-medium text-emerald-700">Rs. {p.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{p.paymentMethod}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{p.projectSponsorship || 'General'}</td>
                    <td className="px-4 py-3 font-mono text-xs text-blue-600">{(p as any).transaction_id || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${ps === 'Verified' ? 'bg-emerald-50 text-emerald-700' : ps === 'Rejected' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{ps}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">{new Date(p.paymentDate).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && !loading && (
          <div className="text-center py-10 text-sm text-slate-400">No donations found.</div>
        )}
      </div>
    </div>
  );
}

function DonorForm({ onSaved, onCancel }: { onSaved: () => void; onCancel: () => void }) {
  const token = useAppStore(s => s.token);
  const [form, setForm] = useState({
    donorName: '', email: '', phone: '', amount: 0,
    paymentMethod: 'Bank Transfer', projectSponsorship: 'General Cardiac Fund', notes: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/donor-payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed');
      onSaved();
    } catch { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-slate-900">Record Donation (Manual)</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Donor Name *</label>
          <input required value={form.donorName} onChange={e => setForm({ ...form, donorName: e.target.value })}
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Email</label>
          <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Phone</label>
          <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Amount (Rs.) *</label>
          <input type="number" required min="1" value={form.amount || ''} onChange={e => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Payment Method</label>
          <select value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })}
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {['Bank Transfer', 'Cash', 'Cheque', 'EasyPaisa', 'JazzCash', 'Online'].map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Project</label>
          <input value={form.projectSponsorship} onChange={e => setForm({ ...form, projectSponsorship: e.target.value })}
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="sm:col-span-3">
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Notes</label>
          <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2}
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <div className="flex items-center gap-2 pt-2">
        <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 cursor-pointer">{saving ? 'Saving...' : 'Save'}</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-200 cursor-pointer">Cancel</button>
      </div>
    </form>
  );
}
