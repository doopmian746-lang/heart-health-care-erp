import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';
import { DonorPayment } from '../../types';

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

export default function DonorSponsorships() {
  const token = useAppStore(s => s.token);
  const [payments, setPayments] = useState<DonorPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const fetchData = () => {
    if (!token) return;
    fetch(`${API_BASE}/donor-payments`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (!r.ok) throw new Error('Failed'); return r.json(); })
      .then(d => setPayments(d))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [token]);

  const filtered = payments.filter(p =>
    p.donorName.toLowerCase().includes(search.toLowerCase()) ||
    p.receiptNumber.toLowerCase().includes(search.toLowerCase()) ||
    p.projectSponsorship?.toLowerCase().includes(search.toLowerCase())
  );

  const totalAmount = payments.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Donor Sponsorships</h2>
          <p className="text-xs text-slate-400 mt-0.5">Total: Rs. {totalAmount.toLocaleString()} from {payments.length} donations</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors cursor-pointer">
          + Record Donation
        </button>
      </div>

      {showForm && (
        <DonorForm onSaved={() => { setShowForm(false); fetchData(); }} onCancel={() => setShowForm(false)} />
      )}

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

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="text-left px-4 py-3">Donor</th>
                <th className="text-left px-4 py-3">Contact</th>
                <th className="text-right px-4 py-3">Amount</th>
                <th className="text-left px-4 py-3">Method</th>
                <th className="text-left px-4 py-3">Project</th>
                <th className="text-left px-4 py-3">Receipt</th>
                <th className="text-left px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-800">{p.donorName}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {p.email && <div>{p.email}</div>}
                    {p.phone && <div>{p.phone}</div>}
                    {!p.email && !p.phone && '—'}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-medium text-emerald-700">Rs. {p.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{p.paymentMethod}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{p.projectSponsorship || 'General'}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{p.receiptNumber}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">{new Date(p.paymentDate).toLocaleDateString()}</td>
                </tr>
              ))}
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
      <h3 className="text-sm font-bold text-slate-900">Record Donation</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Donor Name *</label>
          <input required value={form.donorName} onChange={e => setForm({ ...form, donorName: e.target.value })}
            placeholder="Full name of the donor"
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <p className="text-[10px] text-slate-400 mt-1">As it appears on the receipt</p>
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Email</label>
          <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="donor@example.com"
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <p className="text-[10px] text-slate-400 mt-1">For thank-you correspondence</p>
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Phone</label>
          <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
            placeholder="0300-1234567"
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <p className="text-[10px] text-slate-400 mt-1">Optional contact number</p>
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Amount (Rs.) *</label>
          <input type="number" required min="1" value={form.amount || ''} onChange={e => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <p className="text-[10px] text-slate-400 mt-1">Total donation amount in PKR</p>
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Payment Method *</label>
          <select required value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })}
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {['Bank Transfer', 'Cash', 'Cheque', 'Online', 'Other'].map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <p className="text-[10px] text-slate-400 mt-1">How the donation was received</p>
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Project *</label>
          <input required value={form.projectSponsorship} onChange={e => setForm({ ...form, projectSponsorship: e.target.value })}
            placeholder="e.g. General Cardiac Fund"
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <p className="text-[10px] text-slate-400 mt-1">Which fund or project the donation supports</p>
        </div>
        <div className="sm:col-span-3">
          <label className="text-[10px] font-semibold text-slate-400 uppercase">Receipt Number *</label>
          <input required value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
            placeholder="e.g. RCPT-2024-001"
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <p className="text-[10px] text-slate-400 mt-1">Official receipt or transaction reference number</p>
        </div>
      </div>
      <div className="flex items-center gap-2 pt-2">
        <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 cursor-pointer">{saving ? 'Saving...' : 'Save'}</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-200 cursor-pointer">Cancel</button>
      </div>
    </form>
  );
}
