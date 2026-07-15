import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';
import { Consultation, Patient } from '../../types';
import ConsultationForm from './ConsultationForm';

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

export default function ConsultationList() {
  const token = useAppStore(s => s.token);
  const patients = useAppStore(s => s.patients);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Consultation | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/consultations`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (!r.ok) throw new Error('Failed'); return r.json(); })
      .then(d => setConsultations(d))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  const filtered = consultations.filter(c =>
    c.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
    c.patientId.toLowerCase().includes(search.toLowerCase()) ||
    c.doctorName.toLowerCase().includes(search.toLowerCase()) ||
    c.chiefComplaint.toLowerCase().includes(search.toLowerCase())
  );

  if (showForm && selectedPatient) {
    return (
      <ConsultationForm
        patientId={selectedPatient.id}
        patientName={selectedPatient.name}
        onSaved={() => { setShowForm(false); setSelectedPatient(null); }}
        onCancel={() => { setShowForm(false); setSelectedPatient(null); }}
      />
    );
  }

  if (selected) {
    return <ConsultationDetail consultation={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Consultations</h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-mono">{consultations.length} total</span>
          <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors cursor-pointer">
            + New Consultation
          </button>
        </div>
      </div>

      {showForm && !selectedPatient && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Select Patient for Checkup</h3>
          <div className="relative">
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search patient by name, ID, mobile..."
              className="w-full px-4 py-2.5 pl-10 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <svg className="absolute left-3 top-3 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden max-h-80 overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase sticky top-0">
                  <th className="text-left px-4 py-2">Patient</th>
                  <th className="text-left px-4 py-2">ID</th>
                  <th className="text-left px-4 py-2">Mobile</th>
                  <th className="text-right px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.filter(p =>
                  p.fullName.toLowerCase().includes(search.toLowerCase()) ||
                  p.id.toLowerCase().includes(search.toLowerCase()) ||
                  p.mobile.includes(search)
                ).map(p => (
                  <tr key={p.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-2 font-medium text-slate-800">{p.fullName}</td>
                    <td className="px-4 py-2 font-mono text-xs text-slate-500">{p.id}</td>
                    <td className="px-4 py-2 text-xs text-slate-500">{p.mobile || '—'}</td>
                    <td className="px-4 py-2 text-right">
                      <button onClick={() => { setSelectedPatient({ id: p.id, name: p.fullName }); }}
                        className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 cursor-pointer">
                        Start Checkup
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {patients.length === 0 && <div className="text-center py-6 text-sm text-slate-400">No patients found.</div>}
          </div>
          <button onClick={() => setShowForm(false)} className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer">Cancel</button>
        </div>
      )}

      {error && <div className="text-center py-6 text-sm text-rose-500">{error}</div>}
      {loading && <div className="text-center py-6 text-sm text-slate-400">Loading consultations...</div>}

      {!showForm && (
        <>
          <div className="relative">
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by diagnosis, patient ID, doctor..."
              className="w-full px-4 py-2.5 pl-10 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <svg className="absolute left-3 top-3 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="text-left px-4 py-3">ID</th>
                    <th className="text-left px-4 py-3">Patient</th>
                    <th className="text-left px-4 py-3">Doctor</th>
                    <th className="text-left px-4 py-3">Diagnosis</th>
                    <th className="text-left px-4 py-3">Date</th>
                    <th className="text-left px-4 py-3">Vitals</th>
                    <th className="text-right px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">{c.id}</td>
                      <td className="px-4 py-3 font-mono text-xs text-blue-600">{c.patientId}</td>
                      <td className="px-4 py-3 text-slate-700">{c.doctorName || '—'}</td>
                      <td className="px-4 py-3 text-slate-800 font-medium max-w-[200px] truncate">{c.diagnosis || '—'}</td>
                      <td className="px-4 py-3 text-xs text-slate-400">{new Date(c.visitDate).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{c.vitals.bpSystolic}/{c.vitals.bpDiastolic} · {c.vitals.pulse}bpm</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => setSelected(c)} className="px-2.5 py-1.5 text-[10px] bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 cursor-pointer">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && !loading && (
              <div className="text-center py-10 text-sm text-slate-400">No consultations found.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function ConsultationDetail({ consultation: c, onBack }: { consultation: Consultation; onBack: () => void }) {
  return (
    <div className="space-y-4">
      <button onClick={onBack} className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer">&larr; Back to list</button>
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Consultation {c.id}</h3>
            <p className="text-xs text-slate-400 mt-1">Patient: <span className="font-mono text-blue-600">{c.patientId}</span> · {new Date(c.visitDate).toLocaleString()}</p>
            <p className="text-xs text-slate-400">Doctor: {c.doctorName}</p>
          </div>
          {c.foundationReferral && (
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">Foundation Referral</span>
          )}
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Vitals</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'BP', value: `${c.vitals.bpSystolic}/${c.vitals.bpDiastolic} mmHg` },
              { label: 'Pulse', value: `${c.vitals.pulse} bpm` },
              { label: 'SpO2', value: `${c.vitals.spo2}%` },
              { label: 'BMI', value: c.vitals.bmi.toFixed(1) },
              { label: 'Weight', value: `${c.vitals.weight} kg` },
              { label: 'Height', value: `${c.vitals.height} cm` },
            ].map(v => (
              <div key={v.label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-[10px] font-semibold text-slate-400 uppercase">{v.label}</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{v.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {[
            { label: 'Chief Complaint', value: c.chiefComplaint },
            { label: 'Symptoms', value: c.symptoms },
            { label: 'Examination Findings', value: c.examinationFindings },
            { label: 'Diagnosis', value: c.diagnosis },
            { label: 'Investigations Ordered', value: c.investigations },
            { label: 'Procedures', value: c.procedures },
            { label: 'Referrals', value: c.referrals },
            { label: 'Doctor Notes / Treatment Plan', value: c.doctorNotes },
            { label: 'Special Requirements', value: c.requirements },
            { label: 'Follow-up Instructions', value: c.followUpInstructions },
          ].filter(f => f.value).map(f => (
            <div key={f.label}>
              <p className="text-[10px] font-semibold text-slate-400 uppercase">{f.label}</p>
              <p className="text-sm text-slate-700 mt-0.5 whitespace-pre-wrap">{f.value}</p>
            </div>
          ))}
          {c.followUpDate && (
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase">Follow-up Date</p>
              <p className="text-sm text-slate-700 mt-0.5">{new Date(c.followUpDate).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
