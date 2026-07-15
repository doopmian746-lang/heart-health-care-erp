import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';
import { DashboardStats, Patient, FoundationAssistance, InventoryItem } from '../../types';
import { Users, HeartPulse, HandHeart, Pill, TrendingUp, DollarSign } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

export default function ReportsAnalytics() {
  const token = useAppStore(s => s.token);
  const patients = useAppStore(s => s.patients);
  const assistance = useAppStore(s => s.assistanceRequests);
  const inventory = useAppStore(s => s.inventory);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/dashboard/stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="flex items-center justify-center h-64 text-slate-400 text-sm">Loading reports...</div>;

  const genderDistribution = patients.reduce((acc, p) => { acc[p.gender] = (acc[p.gender] || 0) + 1; return acc; }, {} as Record<string, number>);
  const bloodGroupDistribution = patients.reduce((acc, p) => { acc[p.bloodGroup] = (acc[p.bloodGroup] || 0) + 1; return acc; }, {} as Record<string, number>);
  const assistanceByType = assistance.reduce((acc, a) => { const t = a.type || 'Other'; acc[t] = (acc[t] || 0) + 1; return acc; }, {} as Record<string, number>);
  const lowStockItems = inventory.filter(i => i.quantityAvailable <= i.minimumStockLevel);
  const expiredItems = inventory.filter(i => i.expiryDate && new Date(i.expiryDate) < new Date());
  const totalInventoryValue = inventory.reduce((s, i) => s + (i.quantityAvailable * i.unitPrice), 0);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-900">Reports & Analytics</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Patients', value: patients.length, icon: Users, color: 'bg-blue-50 text-blue-600' },
          { label: 'Total Consultations', value: stats?.recentConsultations.length || 0, icon: HeartPulse, color: 'bg-teal-50 text-teal-600' },
          { label: 'Assistance Requests', value: assistance.length, icon: HandHeart, color: 'bg-amber-50 text-amber-600' },
          { label: 'Inventory Items', value: inventory.length, icon: Pill, color: 'bg-rose-50 text-rose-600' },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-start justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{kpi.label}</span>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{kpi.value}</h3>
              </div>
              <div className={`p-3 ${kpi.color} rounded-xl`}><Icon className="w-5 h-5" /></div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h4 className="font-bold text-sm text-slate-900 mb-4">Gender Distribution</h4>
          <div className="space-y-3">
            {Object.entries(genderDistribution).map(([gender, count]) => (
              <div key={gender} className="flex items-center justify-between">
                <span className="text-sm text-slate-600">{gender}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-slate-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(count / patients.length) * 100}%` }} />
                  </div>
                  <span className="text-xs font-mono text-slate-500 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h4 className="font-bold text-sm text-slate-900 mb-4">Blood Group Distribution</h4>
          <div className="space-y-3">
            {Object.entries(bloodGroupDistribution).sort((a, b) => b[1] - a[1]).map(([bg, count]) => (
              <div key={bg} className="flex items-center justify-between">
                <span className="text-sm text-slate-600">{bg}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-slate-100 rounded-full h-2">
                    <div className="bg-rose-500 h-2 rounded-full" style={{ width: `${(count / patients.length) * 100}%` }} />
                  </div>
                  <span className="text-xs font-mono text-slate-500 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h4 className="font-bold text-sm text-slate-900 mb-4">Assistance by Type</h4>
          <div className="space-y-3">
            {Object.entries(assistanceByType).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm text-slate-600">{type}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-slate-100 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${(count / assistance.length) * 100}%` }} />
                  </div>
                  <span className="text-xs font-mono text-slate-500 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h4 className="font-bold text-sm text-slate-900 mb-4">Inventory Summary</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="text-sm text-slate-600">Total Items</span>
              <span className="font-bold text-slate-800">{inventory.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="text-sm text-slate-600">Total Value</span>
              <span className="font-bold text-slate-800">Rs. {totalInventoryValue.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-rose-50 rounded-xl">
              <span className="text-sm text-rose-600">Low Stock</span>
              <span className="font-bold text-rose-700">{lowStockItems.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
              <span className="text-sm text-orange-600">Expired</span>
              <span className="font-bold text-orange-700">{expiredItems.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h4 className="font-bold text-sm text-slate-900 mb-4">Assistance Status Breakdown</h4>
        <div className="grid grid-cols-3 gap-4">
          {(['Pending', 'Approved', 'Rejected'] as const).map(status => {
            const count = assistance.filter(a => a.status === status).length;
            const total = assistance.filter(a => a.status === status).reduce((s, a) => s + a.foundationContribution, 0);
            const colors = { Pending: 'bg-amber-50 border-amber-200 text-amber-800', Approved: 'bg-emerald-50 border-emerald-200 text-emerald-800', Rejected: 'bg-rose-50 border-rose-200 text-rose-800' };
            return (
              <div key={status} className={`p-4 rounded-xl border ${colors[status]}`}>
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs font-medium mt-1">{status}</p>
                <p className="text-xs mt-1 opacity-75">Rs. {total.toLocaleString()}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
