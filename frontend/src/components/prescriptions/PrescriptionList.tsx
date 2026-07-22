import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';
import { Prescription } from '../../types';

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

export default function PrescriptionList() {
  const token = useAppStore(s => s.token);
  const currentUser = useAppStore(s => s.currentUser);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Prescription | null>(null);

  const canApprove = currentUser?.role === 'Admin' || currentUser?.role === 'Pharmacy Staff';

  const fetchPrescriptions = () => {
    if (!token) return;
    fetch(`${API_BASE}/prescriptions`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => { if (!r.ok) throw new Error('Failed'); return r.json(); })
      .then(d => setPrescriptions(d))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPrescriptions(); }, [token]);

  const handleApprove = async (id: string, newStatus: 'Dispensed' | 'Partially Dispensed') => {
    try {
      const res = await fetch(`${API_BASE}/prescriptions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update');
      fetchPrescriptions();
      if (selected?.id === id) {
        setSelected({ ...selected!, status: newStatus });
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  const filtered = prescriptions.filter(p =>
    p.patientId.toLowerCase().includes(search.toLowerCase()) ||
    p.doctorName.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.items.some(i => i.medicineName.toLowerCase().includes(search.toLowerCase()))
  );

  const statusColor = (s: string) => {
    if (s === 'Dispensed') return 'bg-emerald-50 text-emerald-700';
    if (s === 'Partially Dispensed') return 'bg-amber-50 text-amber-700';
    return 'bg-slate-100 text-slate-600';
  };

  if (selected) {
    return <PrescriptionDetail prescription={selected} onBack={() => setSelected(null)} onApprove={handleApprove} canApprove={canApprove} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Prescriptions</h2>
        <div className="flex items-center gap-3">
          {canApprove && <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Pharmacy Access</span>}
          <span className="text-xs text-slate-400 font-mono">{prescriptions.length} total</span>
        </div>
      </div>

      <div className="relative">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by prescription ID, patient, doctor, medicine..."
          className="w-full px-4 py-2.5 pl-10 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <svg className="absolute left-3 top-3 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {error && <div className="text-center py-6 text-sm text-rose-500">{error}</div>}
      {loading && <div className="text-center py-6 text-sm text-slate-400">Loading prescriptions...</div>}

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="text-left px-4 py-3">ID</th>
                <th className="text-left px-4 py-3">Patient</th>
                <th className="text-left px-4 py-3">Doctor</th>
                <th className="text-left px-4 py-3">Medicines</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-right px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{p.id}</td>
                  <td className="px-4 py-3 font-mono text-xs text-blue-600">{p.patientId}</td>
                  <td className="px-4 py-3 text-slate-700">{p.doctorName || '—'}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{p.items.length} medicine(s)</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${statusColor(p.status)}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">{new Date(p.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {canApprove && p.status === 'Pending' && (
                        <button onClick={() => handleApprove(p.id, 'Dispensed')}
                          className="px-2 py-1 text-[10px] bg-emerald-50 text-emerald-700 font-medium rounded-lg hover:bg-emerald-100 cursor-pointer">Approve</button>
                      )}
                      <button onClick={() => setSelected(p)} className="px-2.5 py-1.5 text-[10px] bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 cursor-pointer">View</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && !loading && (
          <div className="text-center py-10 text-sm text-slate-400">No prescriptions found.</div>
        )}
      </div>
    </div>
  );
}

function PrescriptionDetail({ prescription: p, onBack, onApprove, canApprove }: {
  prescription: Prescription;
  onBack: () => void;
  onApprove: (id: string, status: 'Dispensed' | 'Partially Dispensed') => void;
  canApprove: boolean;
}) {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const medRows = p.items.map(item => `<tr><td>${item.medicineName}</td><td>${item.strength}</td><td>${item.dosage}</td><td>${item.frequency}</td><td>${item.duration}</td><td>${item.instructions || '—'}</td></tr>`).join('');
    printWindow.document.write(`<!DOCTYPE html><html><head><title>Prescription ${p.id}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; color: #333; font-size: 12px; }
        .header { text-align: center; border-bottom: 2px solid #1e40af; padding-bottom: 10px; margin-bottom: 16px; }
        .header h1 { color: #1e40af; font-size: 16px; margin: 0; }
        .header p { color: #666; font-size: 11px; margin: 2px 0 0; }
        h3 { font-size: 12px; color: #1e40af; border-bottom: 1px solid #e5e7eb; padding-bottom: 3px; margin: 14px 0 6px; }
        table { width: 100%; border-collapse: collapse; font-size: 10px; }
        th, td { border: 1px solid #e5e7eb; padding: 4px 6px; text-align: left; }
        th { background: #f8fafc; font-weight: 600; }
        .footer { margin-top: 20px; border-top: 1px solid #e5e7eb; padding-top: 8px; font-size: 9px; color: #9ca3af; text-align: center; }
        @media print { body { padding: 10px; } }
      </style></head><body>
      <div class="header">
        <h1>Heart Health Care Foundation</h1>
        <p>Prescription — ${p.id}</p>
        <p>Patient: ${p.patientId} · Doctor: ${p.doctorName || '—'} · Date: ${new Date(p.date).toLocaleDateString()}</p>
      </div>
      <h3>Medicines</h3>
      <table>
        <thead><tr><th>Medicine</th><th>Strength</th><th>Dosage</th><th>Frequency</th><th>Duration</th><th>Instructions</th></tr></thead>
        <tbody>${medRows}</tbody>
      </table>
      ${p.lifestyleRecommendations ? `<h3>Lifestyle Recommendations</h3><p style="font-size:11px">${p.lifestyleRecommendations}</p>` : ''}
      <h3>Status</h3><p style="font-size:11px;font-weight:600">${p.status}</p>
      <div class="footer">Heart Health Care Foundation — Prescription Record</div>
      <script>window.onload=function(){window.print();}</script>
      </body></html>`);
    printWindow.document.close();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer">&larr; Back to list</button>
        <button onClick={handlePrint} className="ml-auto px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 cursor-pointer flex items-center gap-2">
          🖨️ Print Prescription
        </button>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Prescription {p.id}</h3>
            <p className="text-xs text-slate-400 mt-1">Patient: <span className="font-mono text-blue-600">{p.patientId}</span> · {new Date(p.date).toLocaleDateString()}</p>
            <p className="text-xs text-slate-400">Doctor: {p.doctorName || '—'}</p>
          </div>
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${p.status === 'Dispensed' ? 'bg-emerald-50 text-emerald-700' : p.status === 'Partially Dispensed' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{p.status}</span>
        </div>

        {canApprove && p.status === 'Pending' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-amber-800">Pending Approval</p>
              <p className="text-xs text-amber-600">Review the prescription and mark as dispensed.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => onApprove(p.id, 'Partially Dispensed')} className="px-3 py-2 bg-amber-500 text-white text-xs font-medium rounded-lg hover:bg-amber-600 cursor-pointer">Partially Dispensed</button>
              <button onClick={() => onApprove(p.id, 'Dispensed')} className="px-3 py-2 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 cursor-pointer">Fully Dispensed</button>
            </div>
          </div>
        )}

        <div>
          <h4 className="text-sm font-bold text-slate-800 mb-3">Medicines</h4>
          <div className="space-y-2">
            {p.items.map((item, i) => (
              <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-800">{item.medicineName}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{item.strength} · {item.dosage} · {item.frequency} · {item.duration}</p>
                </div>
                {item.instructions && <p className="text-[10px] text-slate-500 max-w-[200px] text-right">{item.instructions}</p>}
              </div>
            ))}
          </div>
        </div>

        {p.lifestyleRecommendations && (
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase">Lifestyle Recommendations</p>
            <p className="text-sm text-slate-700 mt-1">{p.lifestyleRecommendations}</p>
          </div>
        )}
      </div>
    </div>
  );
}
