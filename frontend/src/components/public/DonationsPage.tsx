import { useEffect, useState } from 'react';
import { Heart, TrendingUp, Users, HandHeart } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

export default function DonationsPage() {
  const [stats, setStats] = useState<any>(null);
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/public/stats`).then(r => r.json()),
      fetch(`${API_BASE}/public/donations/recent`).then(r => r.json()),
    ]).then(([s, d]) => { setStats(s); setRecent(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      </section>

      <section className="py-16 bg-gradient-to-br from-rose-600 to-rose-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl font-bold">Every Donation Saves a Life</h2>
          <p className="text-rose-100 mt-3 max-w-xl mx-auto">
            Your contribution directly funds cardiac consultations, medications, and surgeries 
            for patients who cannot afford them. No amount is too small.
          </p>
          <div className="mt-8 p-6 bg-white/10 rounded-2xl border border-white/20 max-w-md mx-auto">
            <p className="text-sm text-rose-100 mb-2">To donate, please contact us:</p>
            <p className="font-bold text-lg">info@heartfoundation.org</p>
            <p className="text-sm text-rose-200 mt-1">Bank Transfer / Cash / Online</p>
          </div>
        </div>
      </section>
    </div>
  );
}
