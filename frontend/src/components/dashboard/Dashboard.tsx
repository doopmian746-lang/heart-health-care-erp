import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, HeartPulse, Sparkles, ShieldAlert, Heart, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { useApi } from '../../hooks/useApi';
import { DashboardStats } from '../../types';

const kpiColorClasses: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-600',
  teal: 'bg-teal-50 text-teal-600',
  amber: 'bg-amber-50 text-amber-600',
  rose: 'bg-rose-50 text-rose-600',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const currentUser = useAppStore(s => s.currentUser);
  const { data: stats, loading, error, execute } = useApi<DashboardStats>('/api/dashboard/stats');

  useEffect(() => { execute(); }, [execute]);

  if (error) {
    return <div className="flex items-center justify-center h-64 text-rose-500 text-sm">{error}</div>;
  }

  if (loading || !stats) {
    return <div className="flex items-center justify-center h-64 text-slate-400 text-sm">Loading dashboard...</div>;
  }

  const maxRegCount = Math.max(...stats.monthlyRegistrations.map(d => d.count), 1);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden shadow-lg">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none hidden md:block">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-rose-500">
            <path d="M10 50 Q 25 25, 40 50 T 70 50 T 100 50" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M10 50 Q 25 35, 40 50 T 70 50 T 100 60" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>
        </div>
        <div className="relative z-10">
          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 font-mono text-[10px] uppercase tracking-widest rounded-full border border-blue-500/35">Institutional Dashboard</span>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-3">Welcome Back, {currentUser?.name}</h1>
          <p className="text-xs text-slate-300 mt-1.5 max-w-xl">Role: <b className="text-teal-400 font-mono underline">{currentUser?.role}</b></p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Heart Patients', value: stats.totalPatients, icon: Users, color: 'blue', onClick: () => navigate('/app/patients') },
          { label: "Today's Visits", value: stats.todayConsultations, icon: HeartPulse, color: 'teal', onClick: () => navigate('/app/consultations') },
          { label: 'Pending Approvals', value: stats.pendingAssistance, icon: Sparkles, color: 'amber', onClick: () => navigate('/app/assistance') },
          { label: 'Low Stock Medicines', value: stats.lowStockMedicines, icon: ShieldAlert, color: 'rose', onClick: () => navigate('/app/pharmacy') },
        ].map((kpi, i) => {
          const IconComponent = kpi.icon;
          return (
            <div key={i} onClick={kpi.onClick}
              className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-start justify-between cursor-pointer hover:border-blue-500 hover:shadow transition-all">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{kpi.label}</span>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{kpi.value}</h3>
              </div>
              <div className={`p-3 ${kpiColorClasses[kpi.color]} rounded-xl`}>
                <IconComponent className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold text-sm text-slate-900">Monthly Patient Registrations</h4>
              <p className="text-[10px] text-slate-400">Last 6 months</p>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 relative">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[8px] text-slate-300 font-mono">
              <div className="border-b border-slate-100 pb-0.5 w-full text-right">Max: {maxRegCount}</div>
              <div className="border-b border-slate-100 pb-0.5 w-full text-right">{Math.round(maxRegCount * 0.66)}</div>
              <div className="border-b border-slate-100 pb-0.5 w-full text-right">{Math.round(maxRegCount * 0.33)}</div>
              <div className="w-full text-right pt-0.5">0</div>
            </div>
            {stats.monthlyRegistrations.map((d) => {
              const heightPct = `${(d.count / maxRegCount) * 80 + 5}%`;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center group relative z-10">
                  <div className="absolute bottom-full mb-1 bg-slate-900 text-white text-[9px] font-mono px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-20">{d.count} patients</div>
                  <div style={{ height: heightPct }} className="w-full max-w-[28px] bg-blue-600 group-hover:bg-blue-500 rounded-t-md transition-all duration-300 shadow-sm" />
                  <span className="text-[10px] font-semibold text-slate-500 mt-2 font-mono">{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2"><Heart className="w-4 h-4 text-rose-500" /> Recent Consultations</h4>
            <button onClick={() => navigate('/app/consultations')} className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-0.5 cursor-pointer">
              All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3.5">
            {stats.recentConsultations.slice(0, 4).map(con => (
              <div key={con.id} className="p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-100 rounded-xl flex items-start justify-between cursor-pointer transition-colors">
                <div>
                  <h5 className="font-semibold text-xs text-slate-800">{con.diagnosis}</h5>
                  <p className="text-[10px] text-slate-500 mt-0.5">{con.doctorName} · {new Date(con.visitDate).toLocaleDateString()}</p>
                </div>
                <span className="text-[10px] bg-blue-50 text-blue-700 px-2.5 py-0.5 font-mono font-medium rounded">{con.id}</span>
              </div>
            ))}
            {stats.recentConsultations.length === 0 && <p className="text-xs text-slate-400 text-center py-6">No recent consultations</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
