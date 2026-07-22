import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../../store/appStore';

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface ReportData {
  period: string;
  dateRange: { start: string; end: string };
  summary: {
    totalPatients: number;
    newPatients: number;
    totalConsultations: number;
    consultationsInPeriod: number;
    totalPrescriptions: number;
    prescriptionsInPeriod: number;
    totalDonations: number;
    donationsInPeriod: number;
    totalDonationAmount: number;
    totalAssistanceRequests: number;
    assistanceInPeriod: number;
    assistanceGranted: number;
    assistanceRequested: number;
    pendingAssistance: number;
    totalFileRequests: number;
    fileRequestsInPeriod: number;
    lowStockCount: number;
    expiredCount: number;
    expiringSoonCount: number;
  };
  dailyBreakdown: { date: string; consultations: number; patients: number; prescriptions: number; donations: number; assistance: number }[];
  topDiagnoses: { diagnosis: string; count: number }[];
  topMedicines: { medicine: string; count: number }[];
  doctorPerformance: { id: string; name: string; consultations: number; prescriptions: number; patients: number }[];
  consultationsByDoctor: Record<string, number>;
  assistanceByType: Record<string, number>;
  assistanceByStatus: { Pending: number; Approved: number; Rejected: number };
  fileRequestsByStatus: { Pending: number; Fulfilled: number; Rejected: number };
  fileRequestsByUrgency: Record<string, number>;
  newPatientsByGender: Record<string, number>;
  newPatientsByAgeGroup: Record<string, number>;
  lowStockItems: { id: string; name: string; available: number; minimum: number; unitPrice: number }[];
  expiredItems: { id: string; name: string; expiryDate: string }[];
  expiringSoonItems: { id: string; name: string; expiryDate: string; available: number }[];
  recentConsultations: any[];
  recentDonations: any[];
  recentAssistance: any[];
}

const inputClass = "w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

export default function ReportsAnalytics() {
  const token = useAppStore(s => s.token);
  const [period, setPeriod] = useState<Period>('daily');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'patients' | 'clinical' | 'financial' | 'inventory' | 'doctors'>('overview');

  const fetchReport = useCallback(() => {
    if (!token) return;
    setLoading(true);
    let url = `${API_BASE}/reports?period=${period}`;
    if (useCustom && customStart && customEnd) {
      url += `&startDate=${customStart}&endDate=${customEnd}`;
    }
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (!r.ok) throw new Error('Failed'); return r.json(); })
      .then(d => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, period, useCustom, customStart, customEnd]);

  useEffect(() => { fetchReport(); }, [fetchReport]);

  const periods: { key: Period; label: string; icon: string }[] = [
    { key: 'daily', label: 'Daily', icon: '📅' },
    { key: 'weekly', label: 'Weekly', icon: '📆' },
    { key: 'monthly', label: 'Monthly', icon: '🗓️' },
    { key: 'yearly', label: 'Yearly', icon: '📊' },
  ];

  const tabs = [
    { key: 'overview' as const, label: 'Overview', icon: '📈' },
    { key: 'patients' as const, label: 'Patients', icon: '👥' },
    { key: 'clinical' as const, label: 'Clinical', icon: '🩺' },
    { key: 'financial' as const, label: 'Financial', icon: '💰' },
    { key: 'inventory' as const, label: 'Inventory', icon: '💊' },
    { key: 'doctors' as const, label: 'Doctors', icon: '👨‍⚕️' },
  ];

  const handleExport = () => {
    if (!data) return;
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${data.period}-${data.dateRange.start}-to-${data.dateRange.end}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading && !data) {
    return <div className="flex items-center justify-center h-64 text-slate-400 text-sm">Loading reports...</div>;
  }

  const s = data?.summary;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Reports & Analytics</h2>
          {data && (
            <p className="text-xs text-slate-400 mt-0.5">
              {data.dateRange.start} to {data.dateRange.end} · {data.period.charAt(0).toUpperCase() + data.period.slice(1)} Report
            </p>
          )}
        </div>
        <button onClick={handleExport} className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 cursor-pointer">
          Export JSON
        </button>
      </div>

      {/* Period Selector */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            {periods.map(p => (
              <button key={p.key} onClick={() => { setPeriod(p.key); setUseCustom(false); }}
                className={`px-4 py-2 text-sm font-medium rounded-xl cursor-pointer transition-colors ${period === p.key && !useCustom ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {p.icon} {p.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input type="checkbox" checked={useCustom} onChange={e => setUseCustom(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
              Custom Range
            </label>
            {useCustom && (
              <>
                <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)} className={inputClass + ' w-auto'} />
                <span className="text-slate-400">to</span>
                <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)} className={inputClass + ' w-auto'} />
                <button onClick={fetchReport} className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 cursor-pointer">Go</button>
              </>
            )}
          </div>
        </div>
      </div>

      {loading && <div className="text-center text-xs text-slate-400">Refreshing...</div>}

      {data && (
        <>
          {/* Tab Selector */}
          <div className="flex items-center gap-1 flex-wrap">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${activeTab === t.key ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { label: 'New Patients', value: s?.newPatients || 0, sub: `Total: ${s?.totalPatients || 0}`, color: 'bg-blue-50 text-blue-700 border-blue-200' },
                  { label: 'Consultations', value: s?.consultationsInPeriod || 0, sub: `Total: ${s?.totalConsultations || 0}`, color: 'bg-teal-50 text-teal-700 border-teal-200' },
                  { label: 'Prescriptions', value: s?.prescriptionsInPeriod || 0, sub: `Total: ${s?.totalPrescriptions || 0}`, color: 'bg-purple-50 text-purple-700 border-purple-200' },
                  { label: 'Donations', value: s?.donationsInPeriod || 0, sub: `Rs. ${(s?.totalDonationAmount || 0).toLocaleString()}`, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                  { label: 'Assistance', value: s?.assistanceInPeriod || 0, sub: `Granted: Rs. ${(s?.assistanceGranted || 0).toLocaleString()}`, color: 'bg-amber-50 text-amber-700 border-amber-200' },
                  { label: 'File Requests', value: s?.fileRequestsInPeriod || 0, sub: `Pending: ${s?.pendingAssistance || 0}`, color: 'bg-rose-50 text-rose-700 border-rose-200' },
                ].map((kpi, i) => (
                  <div key={i} className={`border p-4 rounded-2xl shadow-sm ${kpi.color}`}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider opacity-70">{kpi.label}</p>
                    <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                    <p className="text-[10px] mt-1 opacity-60">{kpi.sub}</p>
                  </div>
                ))}
              </div>

              {/* Daily Breakdown Chart */}
              {data.dailyBreakdown.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <h4 className="font-bold text-sm text-slate-900 mb-4">Daily Breakdown</h4>
                  <div className="overflow-x-auto">
                    <div className="min-w-[600px]">
                      <div className="flex items-end gap-1 h-40">
                        {data.dailyBreakdown.map((d, i) => {
                          const maxVal = Math.max(...data.dailyBreakdown.map(x => x.consultations + x.patients + x.prescriptions), 1);
                          const total = d.consultations + d.patients + d.prescriptions;
                          const height = (total / maxVal) * 100;
                          return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1" title={`${d.date}: ${d.consultations} consultations, ${d.patients} patients, ${d.prescriptions} prescriptions`}>
                              <span className="text-[9px] text-slate-400">{total}</span>
                              <div className="w-full flex flex-col gap-0.5" style={{ height: `${Math.max(height, 4)}%` }}>
                                {d.consultations > 0 && <div className="bg-teal-400 rounded-t" style={{ flex: d.consultations }} />}
                                {d.patients > 0 && <div className="bg-blue-400" style={{ flex: d.patients }} />}
                                {d.prescriptions > 0 && <div className="bg-purple-400 rounded-b" style={{ flex: d.prescriptions }} />}
                              </div>
                              <span className="text-[8px] text-slate-400 truncate w-full text-center">{d.date.slice(5)}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex items-center gap-4 mt-3 justify-center">
                        <span className="flex items-center gap-1 text-[10px] text-slate-500"><span className="w-3 h-3 bg-teal-400 rounded-sm"></span>Consultations</span>
                        <span className="flex items-center gap-1 text-[10px] text-slate-500"><span className="w-3 h-3 bg-blue-400 rounded-sm"></span>New Patients</span>
                        <span className="flex items-center gap-1 text-[10px] text-slate-500"><span className="w-3 h-3 bg-purple-400 rounded-sm"></span>Prescriptions</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Two columns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Diagnoses */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <h4 className="font-bold text-sm text-slate-900 mb-4">Top Diagnoses</h4>
                  <div className="space-y-2">
                    {data.topDiagnoses.length === 0 && <p className="text-xs text-slate-400">No data</p>}
                    {data.topDiagnoses.map((d, i) => {
                      const maxCount = data.topDiagnoses[0]?.count || 1;
                      return (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-[10px] font-mono text-slate-400 w-4">{i + 1}</span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="text-xs text-slate-700 truncate max-w-[200px]">{d.diagnosis}</span>
                              <span className="text-[10px] font-mono text-slate-500">{d.count}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5">
                              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${(d.count / maxCount) * 100}%` }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Top Medicines */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <h4 className="font-bold text-sm text-slate-900 mb-4">Most Prescribed Medicines</h4>
                  <div className="space-y-2">
                    {data.topMedicines.length === 0 && <p className="text-xs text-slate-400">No data</p>}
                    {data.topMedicines.map((m, i) => {
                      const maxCount = data.topMedicines[0]?.count || 1;
                      return (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-[10px] font-mono text-slate-400 w-4">{i + 1}</span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="text-xs text-slate-700 truncate max-w-[200px]">{m.medicine}</span>
                              <span className="text-[10px] font-mono text-slate-500">{m.count}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5">
                              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${(m.count / maxCount) * 100}%` }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PATIENTS TAB */}
          {activeTab === 'patients' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gender Distribution */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <h4 className="font-bold text-sm text-slate-900 mb-4">New Patients by Gender</h4>
                  <div className="space-y-3">
                    {Object.entries(data.newPatientsByGender).map(([gender, count]) => {
                      const total = Object.values(data.newPatientsByGender).reduce((a, b) => a + b, 0) || 1;
                      return (
                        <div key={gender} className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">{gender}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-32 bg-slate-100 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(count / total) * 100}%` }} />
                            </div>
                            <span className="text-xs font-mono text-slate-500 w-8 text-right">{count}</span>
                          </div>
                        </div>
                      );
                    })}
                    {Object.keys(data.newPatientsByGender).length === 0 && <p className="text-xs text-slate-400">No new patients</p>}
                  </div>
                </div>

                {/* Age Distribution */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <h4 className="font-bold text-sm text-slate-900 mb-4">New Patients by Age Group</h4>
                  <div className="space-y-3">
                    {['0-17', '18-29', '30-44', '45-59', '60-74', '75+'].map(age => {
                      const count = data.newPatientsByAgeGroup[age] || 0;
                      const maxCount = Math.max(...Object.values(data.newPatientsByAgeGroup), 1);
                      return (
                        <div key={age} className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">{age} years</span>
                          <div className="flex items-center gap-3">
                            <div className="w-32 bg-slate-100 rounded-full h-2">
                              <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(count / maxCount) * 100}%` }} />
                            </div>
                            <span className="text-xs font-mono text-slate-500 w-8 text-right">{count}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Patient Registration Table */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <h4 className="font-bold text-sm text-slate-900 mb-4">Patient Registration Trend</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
                        <th className="text-left px-4 py-2">Date</th>
                        <th className="text-right px-4 py-2">New Patients</th>
                        <th className="text-right px-4 py-2">Consultations</th>
                        <th className="text-right px-4 py-2">Prescriptions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.dailyBreakdown.map((d, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="px-4 py-2 text-xs font-mono">{d.date}</td>
                          <td className="px-4 py-2 text-right text-xs font-medium text-blue-600">{d.patients}</td>
                          <td className="px-4 py-2 text-right text-xs font-medium text-teal-600">{d.consultations}</td>
                          <td className="px-4 py-2 text-right text-xs font-medium text-purple-600">{d.prescriptions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* CLINICAL TAB */}
          {activeTab === 'clinical' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Diagnoses Full */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <h4 className="font-bold text-sm text-slate-900 mb-4">All Diagnoses This Period</h4>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {data.topDiagnoses.length === 0 && <p className="text-xs text-slate-400">No diagnoses recorded</p>}
                    {data.topDiagnoses.map((d, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                        <span className="text-xs text-slate-700 truncate max-w-[280px]">{d.diagnosis}</span>
                        <span className="text-xs font-bold text-slate-900 bg-slate-200 px-2 py-0.5 rounded-full">{d.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Medicines Full */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <h4 className="font-bold text-sm text-slate-900 mb-4">All Medicines Prescribed</h4>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {data.topMedicines.length === 0 && <p className="text-xs text-slate-400">No medicines prescribed</p>}
                    {data.topMedicines.map((m, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                        <span className="text-xs text-slate-700 truncate max-w-[280px]">{m.medicine}</span>
                        <span className="text-xs font-bold text-slate-900 bg-slate-200 px-2 py-0.5 rounded-full">{m.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Consultations */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <h4 className="font-bold text-sm text-slate-900 mb-4">Recent Consultations</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
                        <th className="text-left px-4 py-2">ID</th>
                        <th className="text-left px-4 py-2">Patient</th>
                        <th className="text-left px-4 py-2">Doctor</th>
                        <th className="text-left px-4 py-2">Diagnosis</th>
                        <th className="text-left px-4 py-2">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.recentConsultations.map((c: any) => (
                        <tr key={c.id} className="hover:bg-slate-50">
                          <td className="px-4 py-2 font-mono text-xs text-slate-500">{c.id}</td>
                          <td className="px-4 py-2 font-mono text-xs text-blue-600">{c.patientId}</td>
                          <td className="px-4 py-2 text-xs text-slate-700">{c.doctorName}</td>
                          <td className="px-4 py-2 text-xs text-slate-700 max-w-[200px] truncate">{c.diagnosis || '—'}</td>
                          <td className="px-4 py-2 text-xs text-slate-400">{new Date(c.visitDate).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {data.recentConsultations.length === 0 && <p className="text-center text-xs text-slate-400 py-4">No consultations this period</p>}
                </div>
              </div>
            </div>
          )}

          {/* FINANCIAL TAB */}
          {activeTab === 'financial' && (
            <div className="space-y-6">
              {/* Financial KPIs */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                  <p className="text-[10px] font-semibold text-emerald-600 uppercase">Donations Received</p>
                  <p className="text-2xl font-bold text-emerald-800 mt-1">Rs. {(s?.totalDonationAmount || 0).toLocaleString()}</p>
                  <p className="text-[10px] text-emerald-500 mt-1">{s?.donationsInPeriod || 0} donations</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                  <p className="text-[10px] font-semibold text-blue-600 uppercase">Assistance Requested</p>
                  <p className="text-2xl font-bold text-blue-800 mt-1">Rs. {(s?.assistanceRequested || 0).toLocaleString()}</p>
                  <p className="text-[10px] text-blue-500 mt-1">{s?.assistanceInPeriod || 0} requests</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                  <p className="text-[10px] font-semibold text-amber-600 uppercase">Assistance Granted</p>
                  <p className="text-2xl font-bold text-amber-800 mt-1">Rs. {(s?.assistanceGranted || 0).toLocaleString()}</p>
                  <p className="text-[10px] text-amber-500 mt-1">{data?.assistanceByStatus?.Approved || 0} approved</p>
                </div>
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4">
                  <p className="text-[10px] font-semibold text-rose-600 uppercase">Pending Assistance</p>
                  <p className="text-2xl font-bold text-rose-800 mt-1">{s?.pendingAssistance || 0}</p>
                  <p className="text-[10px] text-rose-500 mt-1">Awaiting review</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Assistance by Type */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <h4 className="font-bold text-sm text-slate-900 mb-4">Assistance by Type</h4>
                  <div className="space-y-3">
                    {Object.entries(data.assistanceByType).sort((a, b) => b[1] - a[1]).map(([type, count]) => {
                      const maxCount = Math.max(...Object.values(data.assistanceByType), 1);
                      return (
                        <div key={type} className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">{type}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-32 bg-slate-100 rounded-full h-2">
                              <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${(count / maxCount) * 100}%` }} />
                            </div>
                            <span className="text-xs font-mono text-slate-500 w-8 text-right">{count}</span>
                          </div>
                        </div>
                      );
                    })}
                    {Object.keys(data.assistanceByType).length === 0 && <p className="text-xs text-slate-400">No assistance requests</p>}
                  </div>
                </div>

                {/* Assistance Status */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <h4 className="font-bold text-sm text-slate-900 mb-4">Assistance Status</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {(['Pending', 'Approved', 'Rejected'] as const).map(status => {
                      const count = data.assistanceByStatus[status] || 0;
                      const colors = { Pending: 'bg-amber-50 border-amber-200 text-amber-800', Approved: 'bg-emerald-50 border-emerald-200 text-emerald-800', Rejected: 'bg-rose-50 border-rose-200 text-rose-800' };
                      return (
                        <div key={status} className={`p-4 rounded-xl border text-center ${colors[status]}`}>
                          <p className="text-2xl font-bold">{count}</p>
                          <p className="text-xs font-medium mt-1">{status}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Recent Donations */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <h4 className="font-bold text-sm text-slate-900 mb-4">Recent Donations</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
                        <th className="text-left px-4 py-2">Donor</th>
                        <th className="text-right px-4 py-2">Amount</th>
                        <th className="text-left px-4 py-2">Method</th>
                        <th className="text-left px-4 py-2">Project</th>
                        <th className="text-left px-4 py-2">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.recentDonations.map((d: any) => (
                        <tr key={d.id} className="hover:bg-slate-50">
                          <td className="px-4 py-2 text-xs font-medium text-slate-700">{d.donorName}</td>
                          <td className="px-4 py-2 text-right text-xs font-bold text-emerald-700">Rs. {d.amount.toLocaleString()}</td>
                          <td className="px-4 py-2 text-xs text-slate-500">{d.paymentMethod}</td>
                          <td className="px-4 py-2 text-xs text-slate-500">{d.projectSponsorship || 'General'}</td>
                          <td className="px-4 py-2 text-xs text-slate-400">{new Date(d.paymentDate).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {data.recentDonations.length === 0 && <p className="text-center text-xs text-slate-400 py-4">No donations this period</p>}
                </div>
              </div>
            </div>
          )}

          {/* INVENTORY TAB */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4">
                  <p className="text-[10px] font-semibold text-rose-600 uppercase">Low Stock Items</p>
                  <p className="text-2xl font-bold text-rose-800 mt-1">{s?.lowStockCount || 0}</p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
                  <p className="text-[10px] font-semibold text-orange-600 uppercase">Expired Items</p>
                  <p className="text-2xl font-bold text-orange-800 mt-1">{s?.expiredCount || 0}</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                  <p className="text-[10px] font-semibold text-amber-600 uppercase">Expiring Soon</p>
                  <p className="text-2xl font-bold text-amber-800 mt-1">{s?.expiringSoonCount || 0}</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                  <p className="text-[10px] font-semibold text-blue-600 uppercase">File Requests</p>
                  <p className="text-2xl font-bold text-blue-800 mt-1">{s?.fileRequestsInPeriod || 0}</p>
                </div>
              </div>

              {/* Low Stock Items */}
              {data.lowStockItems.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <h4 className="font-bold text-sm text-slate-900 mb-4">Low Stock Items</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
                          <th className="text-left px-4 py-2">Medicine</th>
                          <th className="text-right px-4 py-2">Available</th>
                          <th className="text-right px-4 py-2">Minimum</th>
                          <th className="text-right px-4 py-2">Shortage</th>
                          <th className="text-right px-4 py-2">Unit Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {data.lowStockItems.map(item => (
                          <tr key={item.id} className="hover:bg-rose-50">
                            <td className="px-4 py-2 text-xs font-medium text-slate-700">{item.name}</td>
                            <td className="px-4 py-2 text-right text-xs font-bold text-rose-600">{item.available}</td>
                            <td className="px-4 py-2 text-right text-xs text-slate-500">{item.minimum}</td>
                            <td className="px-4 py-2 text-right text-xs font-bold text-rose-700">{item.minimum - item.available}</td>
                            <td className="px-4 py-2 text-right text-xs text-slate-500">Rs. {item.unitPrice}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Expired Items */}
              {data.expiredItems.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <h4 className="font-bold text-sm text-slate-900 mb-4">Expired Items</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
                          <th className="text-left px-4 py-2">Medicine</th>
                          <th className="text-left px-4 py-2">Expiry Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {data.expiredItems.map(item => (
                          <tr key={item.id} className="hover:bg-orange-50">
                            <td className="px-4 py-2 text-xs font-medium text-slate-700">{item.name}</td>
                            <td className="px-4 py-2 text-xs text-orange-600">{new Date(item.expiryDate).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Expiring Soon */}
              {data.expiringSoonItems.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <h4 className="font-bold text-sm text-slate-900 mb-4">Expiring Soon (within 30 days)</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
                          <th className="text-left px-4 py-2">Medicine</th>
                          <th className="text-left px-4 py-2">Expiry Date</th>
                          <th className="text-right px-4 py-2">Available</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {data.expiringSoonItems.map(item => (
                          <tr key={item.id} className="hover:bg-amber-50">
                            <td className="px-4 py-2 text-xs font-medium text-slate-700">{item.name}</td>
                            <td className="px-4 py-2 text-xs text-amber-600">{new Date(item.expiryDate).toLocaleDateString()}</td>
                            <td className="px-4 py-2 text-right text-xs text-slate-500">{item.available}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* File Requests */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <h4 className="font-bold text-sm text-slate-900 mb-4">File Requests</h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-2">By Status</p>
                    <div className="space-y-1">
                      {Object.entries(data.fileRequestsByStatus).map(([status, count]) => (
                        <div key={status} className="flex items-center justify-between text-xs">
                          <span className="text-slate-600">{status}</span>
                          <span className="font-mono font-bold">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-2">By Urgency</p>
                    <div className="space-y-1">
                      {Object.entries(data.fileRequestsByUrgency).map(([urgency, count]) => (
                        <div key={urgency} className="flex items-center justify-between text-xs">
                          <span className="text-slate-600">{urgency}</span>
                          <span className="font-mono font-bold">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DOCTORS TAB */}
          {activeTab === 'doctors' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <h4 className="font-bold text-sm text-slate-900 mb-4">Doctor Performance</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
                        <th className="text-left px-4 py-2">Doctor</th>
                        <th className="text-right px-4 py-2">Consultations</th>
                        <th className="text-right px-4 py-2">Prescriptions</th>
                        <th className="text-right px-4 py-2">Unique Patients</th>
                        <th className="text-left px-4 py-2">Performance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.doctorPerformance.sort((a, b) => b.consultations - a.consultations).map(doc => {
                        const maxCons = Math.max(...data.doctorPerformance.map(d => d.consultations), 1);
                        return (
                          <tr key={doc.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center font-bold text-sm text-blue-600 border border-blue-200">
                                  {doc.name?.charAt(0) || 'D'}
                                </div>
                                <span className="font-medium text-slate-800">{doc.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right font-mono text-xs font-medium text-teal-600">{doc.consultations}</td>
                            <td className="px-4 py-3 text-right font-mono text-xs font-medium text-purple-600">{doc.prescriptions}</td>
                            <td className="px-4 py-3 text-right font-mono text-xs font-medium text-blue-600">{doc.patients}</td>
                            <td className="px-4 py-3">
                              <div className="w-full bg-slate-100 rounded-full h-2">
                                <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${(doc.consultations / maxCons) * 100}%` }} />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {data.doctorPerformance.length === 0 && <p className="text-center text-xs text-slate-400 py-4">No doctor data</p>}
                </div>
              </div>

              {/* Consultations by Doctor Chart */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <h4 className="font-bold text-sm text-slate-900 mb-4">Consultations by Doctor</h4>
                <div className="space-y-3">
                  {Object.entries(data.consultationsByDoctor).sort((a, b) => b[1] - a[1]).map(([name, count]) => {
                    const maxCount = Math.max(...Object.values(data.consultationsByDoctor), 1);
                    return (
                      <div key={name} className="flex items-center gap-3">
                        <span className="text-xs text-slate-600 w-32 truncate">{name}</span>
                        <div className="flex-1 bg-slate-100 rounded-full h-4">
                          <div className="bg-teal-500 h-4 rounded-full flex items-center justify-end pr-2" style={{ width: `${Math.max((count / maxCount) * 100, 8)}%` }}>
                            <span className="text-[10px] font-bold text-white">{count}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {Object.keys(data.consultationsByDoctor).length === 0 && <p className="text-xs text-slate-400">No consultations</p>}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
