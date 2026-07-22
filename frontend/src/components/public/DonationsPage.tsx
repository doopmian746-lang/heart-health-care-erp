import { useEffect, useState } from 'react';
import { Heart, TrendingUp, Users, HandHeart, CheckCircle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

export default function DonationsPage() {
  const [stats, setStats] = useState<any>(null);
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    donorName: '',
    email: '',
    phone: '',
    amount: '',
    paymentMethod: 'Online',
    projectSponsorship: 'General Cardiac Fund',
    notes: '',
  });

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/public/stats`).then(r => r.json()),
      fetch(`${API_BASE}/public/donations/recent`).then(r => r.json()),
    ]).then(([s, d]) => { setStats(s); setRecent(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.donorName.trim() || !form.amount || parseFloat(form.amount) <= 0) {
      setError('Please fill in your name and a valid donation amount.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/public/donations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, amount: parseFloat(form.amount) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to process donation');
      setSubmitted(data);
      // Refresh recent donations
      fetch(`${API_BASE}/public/donations/recent`).then(r => r.json()).then(setRecent).catch(() => {});
      fetch(`${API_BASE}/public/stats`).then(r => r.json()).then(setStats).catch(() => {});
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <section className="bg-gradient-to-br from-slate-900 to-rose-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Donations & Sponsorships</h1>
          <p className="text-slate-400 mt-3 max-w-2xl">Your generosity helps us save lives. See how your donations make a difference.</p>
        </div>
      </section>

      {loading && <div className="text-center py-20 text-slate-400">Loading...</div>}

      {stats && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Donors', value: stats.donationCount, icon: Users, color: 'bg-blue-50 text-blue-600' },
                { label: 'Total Donated', value: `Rs. ${stats.totalDonations.toLocaleString()}`, icon: TrendingUp, color: 'bg-emerald-50 text-emerald-600' },
                { label: 'Patients Assisted', value: stats.totalAssistance, icon: HandHeart, color: 'bg-amber-50 text-amber-600' },
                { label: 'Funds Granted', value: `Rs. ${stats.fundsGranted.toLocaleString()}`, icon: Heart, color: 'bg-rose-50 text-rose-600' },
              ].map((kpi, i) => {
                const Icon = kpi.icon;
                return (
                  <div key={i} className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className={`inline-flex p-3 rounded-xl ${kpi.color} mb-3`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">{kpi.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Donation Form Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Recent Donations */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Recent Donations</h2>
              {recent.length > 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          <th className="text-left px-6 py-4">Donor</th>
                          <th className="text-right px-6 py-4">Amount</th>
                          <th className="text-left px-6 py-4">Project</th>
                          <th className="text-left px-6 py-4">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {recent.map((d, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-xs font-bold text-rose-700">
                                  {d.donor_name?.charAt(0) || 'D'}
                                </div>
                                <span className="font-medium text-slate-800">{d.donor_name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right font-mono font-medium text-emerald-700">Rs. {d.amount.toLocaleString()}</td>
                            <td className="px-6 py-4 text-xs text-slate-500">{d.project_sponsorship || 'General'}</td>
                            <td className="px-6 py-4 text-xs text-slate-400">{new Date(d.payment_date).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400">No donations recorded yet.</div>
              )}
            </div>

            {/* Donation Form */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Make a Donation</h2>
              {submitted ? (
                <div className="bg-white border border-emerald-200 rounded-2xl p-8 shadow-sm text-center space-y-4">
                  <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
                  <h3 className="text-xl font-bold text-slate-900">Thank You!</h3>
                  <p className="text-sm text-slate-600">{submitted.message}</p>
                  <div className="bg-slate-50 rounded-xl p-4 mt-4">
                    <p className="text-xs text-slate-400">Receipt Number</p>
                    <p className="text-lg font-mono font-bold text-slate-800">{submitted.receiptNumber}</p>
                  </div>
                  <button onClick={() => { setSubmitted(null); setForm({ donorName: '', email: '', phone: '', amount: '', paymentMethod: 'Online', projectSponsorship: 'General Cardiac Fund', notes: '' }); setShowForm(false); }}
                    className="px-6 py-2 bg-rose-600 text-white text-sm font-medium rounded-xl hover:bg-rose-700 cursor-pointer mt-4">
                    Make Another Donation
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Your Name *</label>
                    <input required value={form.donorName} onChange={e => setForm({ ...form, donorName: e.target.value })}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
                      <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Phone</label>
                      <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                        placeholder="0300-1234567"
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Donation Amount (Rs.) *</label>
                    <input type="number" required min="1" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
                      placeholder="Enter amount"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Payment Method</label>
                      <select value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500">
                        {['Online', 'Bank Transfer', 'Cash', 'Cheque'].map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Project</label>
                      <select value={form.projectSponsorship} onChange={e => setForm({ ...form, projectSponsorship: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500">
                        {['General Cardiac Fund', 'Patient Sponsorship', 'Surgery Fund', 'Medication Fund', 'Equipment Fund', 'General'].map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Notes (optional)</label>
                    <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                      rows={2} placeholder="Any special instructions or dedication..."
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" />
                  </div>
                  {error && <p className="text-xs text-rose-600 bg-rose-50 px-3 py-2 rounded-lg">{error}</p>}
                  <button type="submit" disabled={saving}
                    className="w-full py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 disabled:opacity-50 cursor-pointer transition-colors">
                    {saving ? 'Processing...' : `Donate Rs. ${form.amount ? parseInt(form.amount).toLocaleString() : '0'}`}
                  </button>
                  <p className="text-[10px] text-slate-400 text-center">Your donation will appear in the ERP dashboard and on this page.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-rose-600 to-rose-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl font-bold">Every Donation Saves a Life</h2>
          <p className="text-rose-100 mt-3 max-w-xl mx-auto">
            Your contribution directly funds cardiac consultations, medications, and surgeries 
            for patients who cannot afford them. No amount is too small.
          </p>
        </div>
      </section>
    </div>
  );
}
