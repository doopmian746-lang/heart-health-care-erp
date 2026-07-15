import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, HandHeart, Shield, ArrowRight, Stethoscope, Pill, FileText } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

export default function HomePage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_BASE}/public/stats`)
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(() => {});
  }, []);

  return (
    <div>
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-rose-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <path d="M10 50 Q 25 25, 40 50 T 70 50 T 100 50" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M10 50 Q 25 35, 40 50 T 70 50 T 100 60" stroke="currentColor" strokeWidth="0.5" fill="none" />
            <path d="M10 50 Q 25 15, 40 50 T 70 50 T 100 40" stroke="currentColor" strokeWidth="0.5" fill="none" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
          <div className="max-w-2xl">
            <span className="px-3 py-1 bg-rose-500/20 text-rose-300 text-xs font-semibold uppercase tracking-widest rounded-full border border-rose-500/30">Saving Hearts Since 2020</span>
            <h1 className="text-4xl md:text-5xl font-bold mt-4 leading-tight">
              Quality Cardiac Care for <span className="text-rose-400">Everyone</span>
            </h1>
            <p className="text-lg text-slate-300 mt-6 leading-relaxed">
              The Heart Health Care Foundation provides free and subsidized cardiac healthcare 
              to underserved communities. No patient is turned away due to inability to pay.
            </p>
            <div className="flex items-center gap-4 mt-8">
              <Link to="/about" className="px-6 py-3 bg-rose-600 text-white font-medium rounded-xl hover:bg-rose-700 transition-colors flex items-center gap-2">
                Learn More <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/donations" className="px-6 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors border border-white/20">
                Donate Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {stats && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Patients Registered', value: stats.totalPatients, icon: Users, color: 'bg-blue-50 text-blue-600' },
                { label: 'Patients Assisted', value: stats.totalAssistance, icon: HandHeart, color: 'bg-emerald-50 text-emerald-600' },
                { label: 'Funds Granted', value: `Rs. ${(stats.fundsGranted / 1000).toFixed(0)}K`, icon: Shield, color: 'bg-amber-50 text-amber-600' },
                { label: 'Total Donations', value: stats.donationCount, icon: Heart, color: 'bg-rose-50 text-rose-600' },
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
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">How We Help Patients</h2>
            <p className="text-slate-500 mt-2 max-w-2xl mx-auto">Our comprehensive approach ensures every patient receives the care they need</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Stethoscope, title: 'Consultation & Diagnosis', desc: 'Expert cardiac consultations with thorough examination, diagnostics, and personalized treatment plans for every patient.' },
              { icon: Pill, title: 'Subsidized Medications', desc: 'Free and subsidized medicines from our pharmacy inventory. No patient goes without essential cardiac medications.' },
              { icon: HandHeart, title: 'Financial Assistance', desc: 'Foundation-sponsored procedures, surgeries, and treatments for patients who cannot afford the full cost of care.' },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl inline-flex mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">{s.title}</h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">Make a Difference Today</h2>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto">Your donation helps us provide life-saving cardiac care to those who need it most</p>
          <Link to="/donations" className="inline-flex items-center gap-2 mt-8 px-8 py-3 bg-rose-600 text-white font-medium rounded-xl hover:bg-rose-700 transition-colors">
            Donate Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
