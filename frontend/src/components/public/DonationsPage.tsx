import { useEffect, useState } from 'react';
import { Heart, TrendingUp, Users, HandHeart, CheckCircle, Copy, CreditCard, Smartphone, Building2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

interface Account {
  id: string;
  type: string;
  bank_name: string;
  account_title: string;
  account_number: string;
  iban: string;
  branch_code: string;
  phone_number: string;
}

export default function DonationsPage() {
  const [stats, setStats] = useState<any>(null);
  const [recent, setRecent] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'form' | 'payment' | 'submitted'>('form');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState('');

  const [form, setForm] = useState({
    donorName: '',
    email: '',
    phone: '',
    amount: '',
    paymentMethod: 'Bank Transfer',
    projectSponsorship: 'General Cardiac Fund',
    notes: '',
  });
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/public/stats`).then(r => r.json()),
      fetch(`${API_BASE}/public/donations/recent`).then(r => r.json()),
      fetch(`${API_BASE}/public/foundation-accounts`).then(r => r.json()),
    ]).then(([s, d, a]) => { setStats(s); setRecent(d); setAccounts(a); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(field);
      setTimeout(() => setCopied(''), 2000);
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.donorName.trim() || !form.amount || parseFloat(form.amount) <= 0) {
      setError('Please fill in your name and a valid donation amount.');
      return;
    }
    setError('');
    setStep('payment');
  };

  const handleFinalSubmit = async () => {
    if (!transactionId.trim()) {
      setError('Please enter the Transaction ID / Reference Number from your payment.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/public/donations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, amount: parseFloat(form.amount), transactionId: transactionId.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to process donation');
      setResult(data);
      setStep('submitted');
      fetch(`${API_BASE}/public/donations/recent`).then(r => r.json()).then(setRecent).catch(() => {});
      fetch(`${API_BASE}/public/stats`).then(r => r.json()).then(setStats).catch(() => {});
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const getAccountsByType = (type: string) => accounts.filter(a => a.type === type);

  const selectedAccount = accounts.find(a =>
    (form.paymentMethod === 'Bank Transfer' && a.type === 'Bank') ||
    (form.paymentMethod === 'EasyPaisa' && a.type === 'EasyPaisa') ||
    (form.paymentMethod === 'JazzCash' && a.type === 'JazzCash')
  );

  return (
    <div>
      <section className="bg-gradient-to-br from-slate-900 to-rose-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Donations & Sponsorships</h1>
          <p className="text-slate-400 mt-3 max-w-2xl">Your generosity helps us save lives. Transfer directly to our bank, EasyPaisa, or JazzCash account.</p>
        </div>
      </section>

      {loading && <div className="text-center py-20 text-slate-400">Loading...</div>}

      {stats && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Donors', value: stats.donationCount, icon: Users, color: 'bg-blue-50 text-blue-600' },
                { label: 'Total Donated', value: `Rs. ${stats.totalDonations.toLocaleString()}`, icon: TrendingUp, color: 'bg-emerald-50 text-emerald-600' },
                { label: 'Patients Assisted', value: stats.totalAssistance, icon: HandHeart, color: 'bg-amber-50 text-amber-600' },
                { label: 'Funds Granted', value: `Rs. ${stats.fundsGranted.toLocaleString()}`, icon: Heart, color: 'bg-rose-50 text-rose-600' },
              ].map((kpi, i) => {
                const Icon = kpi.icon;
                return (
                  <div key={i} className="text-center p-5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className={`inline-flex p-2.5 rounded-xl ${kpi.color} mb-2`}><Icon className="w-5 h-5" /></div>
                    <p className="text-xl font-bold text-slate-900">{kpi.value}</p>
                    <p className="text-[10px] text-slate-500 mt-1 font-medium">{kpi.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left: Recent Donations */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Donations</h2>
              {recent.length > 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
                          <th className="text-left px-5 py-3">Donor</th>
                          <th className="text-right px-5 py-3">Amount</th>
                          <th className="text-left px-5 py-3">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {recent.map((d, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center text-[10px] font-bold text-rose-700">{d.donor_name?.charAt(0) || 'D'}</div>
                                <span className="font-medium text-slate-800 text-xs">{d.donor_name}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3 text-right font-mono font-medium text-emerald-700 text-xs">Rs. {d.amount.toLocaleString()}</td>
                            <td className="px-5 py-3 text-xs text-slate-400">{new Date(d.payment_date).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400 text-sm">No donations yet.</div>
              )}
            </div>

            {/* Right: Donation Flow */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-6">Make a Donation</h2>

              {/* Step Indicator */}
              <div className="flex items-center gap-2 mb-6">
                {[
                  { n: 1, label: 'Your Details' },
                  { n: 2, label: 'Payment' },
                  { n: 3, label: 'Done' },
                ].map((s, i) => (
                  <div key={s.n} className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === 'form' && s.n === 1 || step === 'payment' && s.n === 2 || step === 'submitted' && s.n === 3 ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-500'}`}>{s.n}</div>
                    <span className="text-xs text-slate-500 hidden sm:inline">{s.label}</span>
                    {i < 2 && <div className="w-8 h-px bg-slate-300" />}
                  </div>
                ))}
              </div>

              {error && <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">{error}</div>}

              {/* STEP 1: Donor Info */}
              {step === 'form' && (
                <form onSubmit={handleFormSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Your Name *</label>
                    <input required value={form.donorName} onChange={e => setForm({ ...form, donorName: e.target.value })}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
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
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Payment Method *</label>
                      <select value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500">
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="EasyPaisa">EasyPaisa</option>
                        <option value="JazzCash">JazzCash</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Project</label>
                      <select value={form.projectSponsorship} onChange={e => setForm({ ...form, projectSponsorship: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500">
                        {['General Cardiac Fund', 'Patient Sponsorship', 'Surgery Fund', 'Medication Fund', 'Equipment Fund'].map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Notes (optional)</label>
                    <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                      rows={2} placeholder="Any special instructions..."
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" />
                  </div>
                  <button type="submit"
                    className="w-full py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 cursor-pointer transition-colors">
                    Continue to Payment →
                  </button>
                </form>
              )}

              {/* STEP 2: Payment Instructions */}
              {step === 'payment' && (
                <div className="space-y-4">
                  {/* Foundation Account Details */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      {form.paymentMethod === 'Bank Transfer' && <Building2 className="w-5 h-5 text-blue-600" />}
                      {form.paymentMethod === 'EasyPaisa' && <Smartphone className="w-5 h-5 text-emerald-600" />}
                      {form.paymentMethod === 'JazzCash' && <CreditCard className="w-5 h-5 text-red-600" />}
                      <h3 className="font-bold text-sm text-slate-900">Transfer to Foundation {form.paymentMethod === 'Bank Transfer' ? 'Bank Account' : form.paymentMethod}</h3>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                      <p className="text-xs font-bold text-amber-800">Transfer Amount: <span className="text-lg">Rs. {form.amount ? parseInt(form.amount).toLocaleString() : '0'}</span></p>
                    </div>

                    {selectedAccount ? (
                      <div className="space-y-3">
                        {selectedAccount.bank_name && (
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div><p className="text-[10px] text-slate-400 uppercase">Bank</p><p className="text-sm font-medium">{selectedAccount.bank_name}</p></div>
                          </div>
                        )}
                        {selectedAccount.account_title && (
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div><p className="text-[10px] text-slate-400 uppercase">Account Title</p><p className="text-sm font-medium">{selectedAccount.account_title}</p></div>
                            <button onClick={() => copyToClipboard(selectedAccount.account_title, 'title')} className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer">{copied === 'title' ? 'Copied!' : 'Copy'}</button>
                          </div>
                        )}
                        {selectedAccount.account_number && (
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div><p className="text-[10px] text-slate-400 uppercase">Account Number</p><p className="text-sm font-mono font-bold">{selectedAccount.account_number}</p></div>
                            <button onClick={() => copyToClipboard(selectedAccount.account_number, 'acc')} className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer">{copied === 'acc' ? 'Copied!' : 'Copy'}</button>
                          </div>
                        )}
                        {selectedAccount.iban && (
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div><p className="text-[10px] text-slate-400 uppercase">IBAN</p><p className="text-sm font-mono font-bold">{selectedAccount.iban}</p></div>
                            <button onClick={() => copyToClipboard(selectedAccount.iban, 'iban')} className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer">{copied === 'iban' ? 'Copied!' : 'Copy'}</button>
                          </div>
                        )}
                        {selectedAccount.branch_code && (
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div><p className="text-[10px] text-slate-400 uppercase">Branch Code</p><p className="text-sm font-mono">{selectedAccount.branch_code}</p></div>
                          </div>
                        )}
                        {selectedAccount.phone_number && (
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div><p className="text-[10px] text-slate-400 uppercase">{selectedAccount.type} Number</p><p className="text-sm font-mono font-bold">{selectedAccount.phone_number}</p></div>
                            <button onClick={() => copyToClipboard(selectedAccount.phone_number, 'phone')} className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer">{copied === 'phone' ? 'Copied!' : 'Copy'}</button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">Account details not configured. Please contact us.</p>
                    )}

                    <div className="mt-4 p-3 bg-blue-50 rounded-xl">
                      <p className="text-[10px] text-blue-600 font-semibold uppercase mb-1">Payment Instructions</p>
                      <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                        <li>Open your {form.paymentMethod} app or visit branch</li>
                        <li>Transfer <strong>Rs. {form.amount ? parseInt(form.amount).toLocaleString() : '0'}</strong> to the account above</li>
                        <li>Copy the <strong>Transaction ID / Reference Number</strong></li>
                        <li>Paste it below and click Submit</li>
                      </ol>
                    </div>
                  </div>

                  {/* Transaction ID Input */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Transaction ID / Reference Number *</label>
                      <input value={transactionId} onChange={e => setTransactionId(e.target.value)}
                        placeholder="e.g. 202607251234567890 (from your payment receipt)"
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono" />
                      <p className="text-[10px] text-slate-400 mt-1">This is the reference number shown after you complete the transfer. Required for verification.</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button onClick={() => { setStep('form'); setError(''); }}
                        className="px-4 py-2.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 cursor-pointer">
                        ← Back
                      </button>
                      <button onClick={handleFinalSubmit} disabled={saving}
                        className="flex-1 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 disabled:opacity-50 cursor-pointer transition-colors">
                        {saving ? 'Submitting...' : 'Submit Donation'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Success */}
              {step === 'submitted' && result && (
                <div className="bg-white border border-emerald-200 rounded-2xl p-8 shadow-sm text-center space-y-4">
                  <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
                  <h3 className="text-xl font-bold text-slate-900">Donation Submitted!</h3>
                  <p className="text-sm text-slate-600">{result.message}</p>
                  <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-xs"><span className="text-slate-400">Receipt Number</span><span className="font-mono font-bold text-slate-800">{result.receiptNumber}</span></div>
                    <div className="flex justify-between text-xs"><span className="text-slate-400">Amount</span><span className="font-bold text-emerald-700">Rs. {form.amount ? parseInt(form.amount).toLocaleString() : '0'}</span></div>
                    <div className="flex justify-between text-xs"><span className="text-slate-400">Status</span><span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-medium">Pending Verification</span></div>
                  </div>
                  <p className="text-[10px] text-slate-400">Our team will verify your donation within 24 hours. You will receive confirmation via email/phone.</p>
                  <button onClick={() => { setStep('form'); setForm({ donorName: '', email: '', phone: '', amount: '', paymentMethod: 'Bank Transfer', projectSponsorship: 'General Cardiac Fund', notes: '' }); setTransactionId(''); setResult(null); }}
                    className="mt-4 px-6 py-2 bg-rose-600 text-white text-sm font-medium rounded-xl hover:bg-rose-700 cursor-pointer">
                    Make Another Donation
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 bg-gradient-to-br from-rose-600 to-rose-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-10 h-10 mx-auto mb-3 opacity-80" />
          <h2 className="text-2xl font-bold">Every Donation Saves a Life</h2>
          <p className="text-rose-100 mt-2 max-w-xl mx-auto text-sm">
            Your contribution directly funds cardiac consultations, medications, and surgeries for patients who cannot afford them.
          </p>
        </div>
      </section>
    </div>
  );
}
