import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';
import { Prescription } from '../../types';

export default function PrescriptionList() {
  const token = useAppStore(s => s.token);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Prescription | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch(`${import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api'}/prescriptions`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => { if (!r.ok) throw new Error('Failed'); return r.json(); })
      .then(d => setPrescriptions(d))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

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
    return <PrescriptionDetail prescription={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Prescriptions</h2>
        <span className="text-xs text-slate-400 font-mono">{prescriptions.length} total</span>
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
                    <button onClick={() => setSelected(p)} className="px-2.5 py-1.5 text-[10px] bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 cursor-pointer">View</button>
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

function PrescriptionDetail({ prescription: p, onBack }: { prescription: Prescription; onBack: () => void }) {
  return (
    <div className="space-y-4">
      <button onClick={onBack} className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer">&larr; Back to list</button>
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Prescription {p.id}</h3>
            <p className="text-xs text-slate-400 mt-1">Patient: <span className="font-mono text-blue-600">{p.patientId}</span> · {new Date(p.date).toLocaleDateString()}</p>
            <p className="text-xs text-slate-400">Doctor: {p.doctorName || '—'}</p>
          </div>
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${p.status === 'Dispensed' ? 'bg-emerald-50 text-emerald-700' : p.status === 'Partially Dispensed' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{p.status}</span>
        </div>

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
