import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

interface DonationForm {
  donorName: string;
  email: string;
  phone: string;
  amount: number;
  currency: 'PKR' | 'USD';
  projectSponsorship: string;
  notes: string;
}

const PROJECTS = [
  'General Cardiac Fund',
  'Patient Treatment Fund',
  'Surgery Sponsorship',
  'Medicine Fund',
  'Children Heart Fund',
  'Emergency Medical Aid',
  'General Donation',
];

export default function DonationsPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<DonationForm>({
    donorName: '', email: '', phone: '',
    amount: 0, currency: 'PKR',
    projectSponsorship: 'General Cardiac Fund', notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ status: string; transactionId?: string; amount?: string; currency?: string } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    if (status) {
      setResult({
        status,
        transactionId: params.get('transactionId') || undefined,
        amount: params.get('amount') || undefined,
        currency: params.get('currency') || undefined,
      });
      window.history.replaceState({}, '', '/donate');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.donorName || !form.email || form.amount <= 0) return;
    setSubmitting(true);

    try {
      const payload = {
        ...form,
        payMethod: '',
        projectSponsorship: form.projectSponsorship,
      };

      const res = await fetch(`${API_BASE}/donations/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Failed to initiate donation');
        setSubmitting(false);
        return;
      }

      const html = await res.text();
      const newWindow = window.open('', '_self');
      if (newWindow) {
        newWindow.document.write(html);
        newWindow.document.close();
      }
    } catch {
      alert('Failed to connect to payment service');
      setSubmitting(false);
    }
  };

  if (result) {
    return <DonationResult result={result} onReset={() => { setResult(null); setStep(1); setForm({ donorName: '', email: '', phone: '', amount: 0, currency: 'PKR', projectSponsorship: 'General Cardiac Fund', notes: '' }); }} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/30 to-blue-50/20">
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-2xl mx-auto px-4 py-6 text-center">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-lg shadow-rose-500/30">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Make a Donation</h1>
              <p className="text-sm text-slate-500">Heart Health Care Foundation</p>
            </div>
          </div>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">Your generous donation helps us provide life-saving cardiac care to patients in need across Pakistan.</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= s ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-500'}`}>{s}</div>
              <span className={`text-xs font-medium ${step >= s ? 'text-rose-700' : 'text-slate-400'}`}>{s === 1 ? 'Your Details' : 'Payment'}</span>
              {s < 2 && <div className={`w-12 h-0.5 ${step > 1 ? 'bg-rose-600' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200/60 p-8 space-y-5">
              <h2 className="text-lg font-bold text-slate-900">Your Information</h2>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Full Name *</label>
                <input required value={form.donorName} onChange={e => setForm({ ...form, donorName: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Email *</label>
                  <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Phone</label>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="+92 3XX XXXXXXX"
                    className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent" />
                </div>
              </div>
              <button type="button" onClick={() => setStep(2)}
                className="w-full py-3 bg-rose-600 text-white font-semibold rounded-xl hover:bg-rose-700 transition-colors cursor-pointer text-sm">
                Continue to Payment →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200/60 p-8 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900">Donation Amount</h2>
                  <button type="button" onClick={() => setStep(1)} className="text-xs text-rose-600 hover:text-rose-700 cursor-pointer">← Edit Details</button>
                </div>

                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {[500, 1000, 2500, 5000, 10000, 25000, 50000, 100000].map(amt => (
                    <button key={amt} type="button" onClick={() => setForm({ ...form, amount: amt })}
                      className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${form.amount === amt ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/30' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                      Rs. {amt.toLocaleString()}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase">Amount ({form.currency}) *</label>
                    <input type="number" required min="1" value={form.amount || ''} onChange={e => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
                      placeholder="Enter amount"
                      className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase">Currency</label>
                    <div className="flex mt-1">
                      <button type="button" onClick={() => setForm({ ...form, currency: 'PKR' })}
                        className={`flex-1 py-3 text-xs font-bold rounded-l-xl border cursor-pointer transition-colors ${form.currency === 'PKR' ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-50 text-slate-600 border-slate-300'}`}>
                        PKR
                      </button>
                      <button type="button" onClick={() => setForm({ ...form, currency: 'USD' })}
                        className={`flex-1 py-3 text-xs font-bold rounded-r-xl border cursor-pointer transition-colors ${form.currency === 'USD' ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-50 text-slate-600 border-slate-300'}`}>
                        USD
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Sponsorship Project</label>
                  <select value={form.projectSponsorship} onChange={e => setForm({ ...form, projectSponsorship: e.target.value })}
                    className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent">
                    {PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Message (optional)</label>
                  <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2}
                    placeholder="Any special message or dedication..."
                    className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent" />
                </div>
              </div>

              {/* Payment Methods Info */}
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200/60 p-8">
                <h3 className="text-sm font-bold text-slate-900 mb-4">Available Payment Methods</h3>
                <p className="text-xs text-slate-500 mb-4">After clicking "Donate Now", you'll be redirected to our secure payment gateway where you can choose:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { name: 'JazzCash', icon: '📱', desc: 'Mobile Wallet' },
                    { name: 'EasyPaisa', icon: '💚', desc: 'Mobile Wallet' },
                    { name: 'Bank Transfer', icon: '🏦', desc: 'All Banks' },
                    { name: 'Debit Card', icon: '💳', desc: 'Visa/MasterCard' },
                    { name: 'Credit Card', icon: '💎', desc: 'Visa/MasterCard' },
                    { name: 'Raast', icon: '⚡', desc: 'Instant Transfer' },
                  ].map(m => (
                    <div key={m.name} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-lg">{m.icon}</span>
                      <div>
                        <p className="text-[10px] font-bold text-slate-800">{m.name}</p>
                        <p className="text-[9px] text-slate-400">{m.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Donate Button */}
              <button type="submit" disabled={submitting || form.amount <= 0}
                className="w-full py-4 bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold rounded-2xl hover:from-rose-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-rose-500/30 text-sm cursor-pointer">
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Redirecting to Payment...
                  </span>
                ) : (
                  `Donate ${form.currency} ${form.amount > 0 ? form.amount.toLocaleString() : '...'} →`
                )}
              </button>

              <p className="text-center text-[10px] text-slate-400 mt-2">
                🔒 Secure payment processed by CashMaal. Your card details are never stored on our servers.
              </p>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}

function DonationResult({ result, onReset }: { result: { status: string; transactionId?: string; amount?: string; currency?: string }; onReset: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/30 to-blue-50/20 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/60 p-10 max-w-md w-full text-center">
        {result.status === 'success' ? (
          <>
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Donation Successful!</h1>
            <p className="text-sm text-slate-600 mb-6">Thank you for your generous donation to Heart Health Care Foundation.</p>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-3 mb-6">
              {result.amount && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Amount</span>
                  <span className="font-bold text-emerald-700">{result.currency || 'PKR'} {parseFloat(result.amount).toLocaleString()}</span>
                </div>
              )}
              {result.transactionId && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Transaction ID</span>
                  <span className="font-mono font-bold text-slate-800">{result.transactionId}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Status</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Verified</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-6">A confirmation has been sent to your email. Your donation will be used for cardiac patient treatment.</p>
          </>
        ) : result.status === 'failed' ? (
          <>
            <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment Not Completed</h1>
            <p className="text-sm text-slate-600 mb-6">Your payment was not completed or was rejected. You can try again.</p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment Cancelled</h1>
            <p className="text-sm text-slate-600 mb-6">You cancelled the payment. No charges were made.</p>
          </>
        )}
        <button onClick={onReset}
          className="w-full py-3 bg-rose-600 text-white font-semibold rounded-xl hover:bg-rose-700 transition-colors cursor-pointer text-sm">
          {result.status === 'success' ? 'Make Another Donation' : 'Try Again'}
        </button>
      </div>
    </div>
  );
}
