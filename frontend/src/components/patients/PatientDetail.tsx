import React, { useEffect, useState } from 'react';
import { PatientDetailResponse, PatientSocioEconomic } from '../../types';
import { useAppStore } from '../../store/appStore';
import PatientSocioEconomicForm from './PatientSocioEconomic';

interface Props {
  patientId: string;
  onBack: () => void;
}

export default function PatientDetail({ patientId, onBack }: Props) {
  const token = useAppStore(s => s.token);
  const [data, setData] = useState<PatientDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !patientId) return;
    setLoading(true);
    setFetchError(null);
    fetch(`/api/patients/${patientId}`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => { if (!r.ok) throw new Error('Failed to load patient'); return r.json(); })
      .then(setData)
      .catch(err => setFetchError(err.message))
      .finally(() => setLoading(false));
  }, [patientId, token]);

  if (loading) return <div className="text-center py-10 text-slate-400">Loading patient details...</div>;
  if (fetchError) return <div className="text-center py-10 text-rose-500">{fetchError}</div>;
  if (!data) return <div className="text-center py-10 text-rose-500">Patient not found</div>;

  const { patient, medicalHistory, consultations, prescriptions, assistanceHistory } = data;
  const se = patient.socioEconomic;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-sm rounded-lg hover:bg-slate-200 cursor-pointer">← Back</button>
        <h2 className="text-lg font-bold text-slate-900">{patient.fullName}</h2>
        <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{patient.patientCode}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2 mb-4">Demographics</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {[
                ['Father/Husband', patient.fatherHusbandName],
                ['CNIC', patient.cnic],
                ['DOB', patient.dob ? new Date(patient.dob).toLocaleDateString() : '-'],
                ['Age', String(patient.age)],
                ['Gender', patient.gender],
                ['Marital Status', patient.maritalStatus],
                ['Occupation', patient.occupation || '-'],
                ['Mobile', patient.mobile],
                ['Blood Group', patient.bloodGroup],
                ['Address', patient.address],
                ['Referred By', patient.referredBy || '-'],
                ['Registered', new Date(patient.registrationDate).toLocaleDateString()],
              ].map(([label, value]) => (
                <div key={label}>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wide">{label}</span>
                  <p className="font-medium text-slate-800 mt-0.5">{value || '-'}</p>
                </div>
              ))}
            </div>
          </div>

          {se && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <PatientSocioEconomicForm data={se} onChange={() => {}} readOnly />
            </div>
          )}

          {medicalHistory && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2 mb-4">Medical History</h3>
              <div className="space-y-3 text-sm">
                <div><span className="text-[10px] text-slate-400">Chronic Conditions</span><p className="font-medium">{medicalHistory.chronicConditions.join(', ') || 'None'}</p></div>
                <div><span className="text-[10px] text-slate-400">Allergies</span><p className="font-medium">{medicalHistory.allergies}</p></div>
                <div><span className="text-[10px] text-slate-400">Existing Medications</span><p className="font-medium">{medicalHistory.existingMedications}</p></div>
                <div><span className="text-[10px] text-slate-400">Prior Cardiac Procedures</span><p className="font-medium">{medicalHistory.priorCardiacProcedures.join(', ') || 'None'}</p></div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2 mb-4">Consultations ({consultations.length})</h3>
            <div className="space-y-2">
              {consultations.slice(0, 5).map(c => (
                <div key={c.id} className="p-3 bg-slate-50 rounded-xl text-xs">
                  <div className="flex justify-between"><span className="font-medium text-slate-700">{c.diagnosis}</span><span className="text-slate-400">{new Date(c.visitDate).toLocaleDateString()}</span></div>
                  <p className="text-slate-500 mt-1">{c.doctorName}</p>
                </div>
              ))}
              {consultations.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No consultations</p>}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2 mb-4">Assistance ({assistanceHistory.length})</h3>
            <div className="space-y-2">
              {assistanceHistory.slice(0, 5).map(a => (
                <div key={a.id} className="p-3 bg-slate-50 rounded-xl text-xs flex justify-between items-center">
                  <div><span className="font-medium text-slate-700">{a.type}</span><p className="text-slate-400 mt-0.5">PKR {a.estimatedCost}</p></div>
                  <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                    a.status === 'Approved' ? 'bg-teal-100 text-teal-800' : a.status === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>{a.status}</span>
                </div>
              ))}
              {assistanceHistory.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No assistance requests</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
