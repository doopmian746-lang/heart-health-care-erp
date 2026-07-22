import React, { useEffect, useState } from 'react';
import { PatientDetailResponse, PatientSocioEconomic } from '../../types';
import { useAppStore } from '../../store/appStore';
import PatientSocioEconomicForm from './PatientSocioEconomic';

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

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
    fetch(`${API_BASE}/patients/${patientId}`, { headers: { 'Authorization': `Bearer ${token}` } })
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

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const conds = medicalHistory?.chronicConditions?.join(', ') || 'None';
    const allergies = medicalHistory?.allergies || 'None';
    const meds = medicalHistory?.existingMedications || 'None';
    const procs = medicalHistory?.priorCardiacProcedures?.join(', ') || 'None';
    const consultRows = consultations.slice(0, 10).map(c => `<tr><td>${new Date(c.visitDate).toLocaleDateString()}</td><td>${c.doctorName}</td><td>${c.diagnosis || '—'}</td><td>${c.chiefComplaint || '—'}</td></tr>`).join('');
    const rxRows = prescriptions.slice(0, 10).map(p => `<tr><td>${new Date(p.date).toLocaleDateString()}</td><td>${p.doctorName}</td><td>${p.items.map(i => i.medicineName).join(', ')}</td><td>${p.status}</td></tr>`).join('');
    printWindow.document.write(`<!DOCTYPE html><html><head><title>Patient Report - ${patient.fullName}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; color: #333; font-size: 12px; }
        .header { text-align: center; border-bottom: 2px solid #1e40af; padding-bottom: 10px; margin-bottom: 16px; }
        .header h1 { color: #1e40af; font-size: 16px; margin: 0; }
        .header p { color: #666; font-size: 11px; margin: 2px 0 0; }
        h3 { font-size: 12px; color: #1e40af; border-bottom: 1px solid #e5e7eb; padding-bottom: 3px; margin: 14px 0 6px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; }
        .field .label { color: #9ca3af; font-size: 9px; text-transform: uppercase; }
        .field .value { font-weight: 600; font-size: 11px; }
        table { width: 100%; border-collapse: collapse; font-size: 10px; }
        th, td { border: 1px solid #e5e7eb; padding: 4px 6px; text-align: left; }
        th { background: #f8fafc; font-weight: 600; }
        .footer { margin-top: 20px; border-top: 1px solid #e5e7eb; padding-top: 8px; font-size: 9px; color: #9ca3af; text-align: center; }
        @media print { body { padding: 10px; } }
      </style></head><body>
      <div class="header">
        <h1>Heart Health Care Foundation</h1>
        <p>Patient Report — ${patient.fullName}</p>
        <p>ID: ${patient.patientCode || patient.id} · Generated: ${new Date().toLocaleDateString()}</p>
      </div>
      <h3>Demographics</h3>
      <div class="grid">
        <div class="field"><div class="label">Name</div><div class="value">${patient.fullName}</div></div>
        <div class="field"><div class="label">Father/Husband</div><div class="value">${patient.fatherHusbandName || '-'}</div></div>
        <div class="field"><div class="label">CNIC</div><div class="value">${patient.cnic || '-'}</div></div>
        <div class="field"><div class="label">Age/Gender</div><div class="value">${patient.age} / ${patient.gender}</div></div>
        <div class="field"><div class="label">Mobile</div><div class="value">${patient.mobile || '-'}</div></div>
        <div class="field"><div class="label">Blood Group</div><div class="value">${patient.bloodGroup}</div></div>
        <div class="field"><div class="label">Occupation</div><div class="value">${patient.occupation || '-'}</div></div>
        <div class="field"><div class="label">Marital Status</div><div class="value">${patient.maritalStatus}</div></div>
        <div class="field"><div class="label">Address</div><div class="value">${patient.address || '-'}</div></div>
      </div>
      <h3>Medical History</h3>
      <div class="grid">
        <div class="field"><div class="label">Chronic Conditions</div><div class="value">${conds}</div></div>
        <div class="field"><div class="label">Allergies</div><div class="value">${allergies}</div></div>
        <div class="field"><div class="label">Existing Medications</div><div class="value">${meds}</div></div>
      </div>
      <div class="field" style="margin-top:6px"><div class="label">Prior Cardiac Procedures</div><div class="value">${procs}</div></div>
      ${consultations.length > 0 ? `<h3>Consultations (${consultations.length})</h3><table><thead><tr><th>Date</th><th>Doctor</th><th>Diagnosis</th><th>Complaint</th></tr></thead><tbody>${consultRows}</tbody></table>` : ''}
      ${prescriptions.length > 0 ? `<h3>Prescriptions (${prescriptions.length})</h3><table><thead><tr><th>Date</th><th>Doctor</th><th>Medicines</th><th>Status</th></tr></thead><tbody>${rxRows}</tbody></table>` : ''}
      <div class="footer">Heart Health Care Foundation — Patient Medical Record</div>
      <script>window.onload=function(){window.print();}</script>
      </body></html>`);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-sm rounded-lg hover:bg-slate-200 cursor-pointer">← Back</button>
        <h2 className="text-lg font-bold text-slate-900">{patient.fullName}</h2>
        <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{patient.patientCode}</span>
        <button onClick={handlePrint} className="ml-auto px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 cursor-pointer flex items-center gap-2">
          🖨️ Print
        </button>
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
