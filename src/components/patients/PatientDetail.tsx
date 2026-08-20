import React, { useEffect, useState } from 'react';
import { PatientDetailResponse, PatientSocioEconomic, FileRequest } from '../../types';
import { useAppStore } from '../../store/appStore';
import PatientSocioEconomicForm from './PatientSocioEconomic';

const API_BASE = '/api';

interface Props {
  patientId: string;
  onBack: () => void;
}

type Tab = 'overview' | 'consultations' | 'prescriptions' | 'lab-orders' | 'assistance' | 'files';

export default function PatientDetail({ patientId, onBack }: Props) {
  const token = useAppStore(s => s.token);
  const [data, setData] = useState<PatientDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [fileRequests, setFileRequests] = useState<FileRequest[]>([]);

  useEffect(() => {
    if (!token || !patientId) return;
    setLoading(true);
    setFetchError(null);
    fetch(`${API_BASE}/patients/${patientId}`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => { if (!r.ok) throw new Error('Failed to load patient'); return r.json(); })
      .then(d => {
        setData(d);
        return fetch(`${API_BASE}/file-requests/patient/${patientId}`, { headers: { 'Authorization': `Bearer ${token}` } });
      })
      .then(r => r.ok ? r.json() : [])
      .then(fr => setFileRequests(fr))
      .catch(err => setFetchError(err.message))
      .finally(() => setLoading(false));
  }, [patientId, token]);

  if (loading) return <div className="text-center py-10 text-slate-400">Loading patient file...</div>;
  if (fetchError) return <div className="text-center py-10 text-rose-500">{fetchError}</div>;
  if (!data) return <div className="text-center py-10 text-rose-500">Patient not found</div>;

  const { patient, medicalHistory, consultations, prescriptions, assistanceHistory, labOrders } = data;
  const se = patient.socioEconomic;

  const approvedAssistance = assistanceHistory.filter(a => a.status === 'Approved');
  const totalFoundation = approvedAssistance.reduce((s, a) => s + (a.foundationContribution || 0), 0);
  const totalPatient = approvedAssistance.reduce((s, a) => s + (a.patientContribution || 0), 0);
  const pendingAssistance = assistanceHistory.filter(a => a.status === 'Pending');

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'overview', label: 'Overview', count: 0 },
    { id: 'consultations', label: 'Consultations', count: consultations.length },
    { id: 'prescriptions', label: 'Prescriptions', count: prescriptions.length },
    { id: 'lab-orders', label: 'Lab Orders', count: labOrders?.length || 0 },
    { id: 'assistance', label: 'Foundation Aid', count: assistanceHistory.length },
    { id: 'files', label: 'File Requests', count: fileRequests.length },
  ];

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const conds = medicalHistory?.chronicConditions?.join(', ') || 'None';
    const allergies = medicalHistory?.allergies || 'None';
    const meds = medicalHistory?.existingMedications || 'None';
    const procs = medicalHistory?.priorCardiacProcedures?.join(', ') || 'None';
    const consultRows = consultations.slice(0, 10).map(c => `<tr><td>${new Date(c.visitDate).toLocaleDateString()}</td><td>${c.doctorName}</td><td>${c.diagnosis || '—'}</td><td>${c.chiefComplaint || '—'}</td></tr>`).join('');
    const rxRows = prescriptions.slice(0, 10).map(p => `<tr><td>${new Date(p.date).toLocaleDateString()}</td><td>${p.doctorName}</td><td>${p.items.map(i => i.medicineName).join(', ')}</td><td>${p.status}</td></tr>`).join('');
    const assistRows = assistanceHistory.slice(0, 10).map(a => `<tr><td>${new Date(a.requestDate).toLocaleDateString()}</td><td>${a.type}</td><td>PKR ${a.estimatedCost.toLocaleString()}</td><td>PKR ${(a.foundationContribution || 0).toLocaleString()}</td><td>${a.status}</td></tr>`).join('');
    printWindow.document.write(`<!DOCTYPE html><html><head><title>Patient File - ${patient.fullName}</title>
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
        <h1>Healing Hearts Foundation</h1>
        <p>Patient Medical File — ${patient.fullName}</p>
        <p>MR No: ${patient.patientCode || patient.id} · Generated: ${new Date().toLocaleDateString()}</p>
      </div>
      <h3>Demographics</h3>
      <div class="grid">
        <div class="field"><div class="label">MR No</div><div class="value">${patient.patientCode || patient.id}</div></div>
        <div class="field"><div class="label">Name</div><div class="value">${patient.fullName}</div></div>
        <div class="field"><div class="label">Father/Husband</div><div class="value">${patient.fatherHusbandName || '-'}</div></div>
        <div class="field"><div class="label">CNIC</div><div class="value">${patient.cnic || '-'}</div></div>
        <div class="field"><div class="label">Age/Gender</div><div class="value">${patient.age} / ${patient.gender}</div></div>
        <div class="field"><div class="label">Mobile</div><div class="value">${patient.mobile || '-'}</div></div>
        <div class="field"><div class="label">Blood Group</div><div class="value">${patient.bloodGroup}</div></div>
        <div class="field"><div class="label">Occupation</div><div class="value">${patient.occupation || '-'}</div></div>
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
      ${assistanceHistory.length > 0 ? `<h3>Foundation Assistance (${assistanceHistory.length})</h3><table><thead><tr><th>Date</th><th>Type</th><th>Estimated</th><th>Foundation</th><th>Status</th></tr></thead><tbody>${assistRows}</tbody></table>` : ''}
      <div class="footer">Healing Hearts Foundation — Patient Medical Record</div>
      <script>window.onload=function(){window.print();}</script>
      </body></html>`);
    printWindow.document.close();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={onBack} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-sm rounded-lg hover:bg-slate-200 cursor-pointer">← Back</button>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-slate-900">{patient.fullName}</h2>
          <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">MR No: {patient.patientCode}</span>
        </div>
        <span className="text-xs text-slate-400">{patient.age}y / {patient.gender}</span>
        <button onClick={handlePrint} className="ml-auto px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 cursor-pointer flex items-center gap-2">
          Print Full File
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${activeTab === t.id ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {t.label} {t.count > 0 && <span className="ml-1 px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded-full text-[9px]">{t.count}</span>}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2 mb-4">Demographics</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                {[
                  ['MR No', patient.patientCode],
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
            {/* Quick Stats */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2 mb-4">Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs text-slate-500">Consultations</span>
                  <span className="font-bold text-slate-800">{consultations.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs text-slate-500">Prescriptions</span>
                  <span className="font-bold text-slate-800">{prescriptions.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs text-slate-500">Assistance Requests</span>
                  <span className="font-bold text-slate-800">{assistanceHistory.length}</span>
                </div>
                {approvedAssistance.length > 0 && (
                  <>
                    <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl">
                      <span className="text-xs text-emerald-600">Foundation Contributed</span>
                      <span className="font-bold text-emerald-700">Rs. {totalFoundation.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                      <span className="text-xs text-blue-600">Patient Contributed</span>
                      <span className="font-bold text-blue-700">Rs. {totalPatient.toLocaleString()}</span>
                    </div>
                  </>
                )}
                {pendingAssistance.length > 0 && (
                  <div className="flex justify-between items-center p-3 bg-amber-50 rounded-xl">
                    <span className="text-xs text-amber-600">Pending Requests</span>
                    <span className="font-bold text-amber-700">{pendingAssistance.length}</span>
                  </div>
                )}
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs text-slate-500">File Requests</span>
                  <span className="font-bold text-slate-800">{fileRequests.length}</span>
                </div>
              </div>
            </div>

            {/* Recent Consultations */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2 mb-4">Recent Consultations</h3>
              <div className="space-y-2">
                {consultations.slice(0, 3).map(c => (
                  <div key={c.id} className="p-3 bg-slate-50 rounded-xl text-xs">
                    <div className="flex justify-between"><span className="font-medium text-slate-700">{c.diagnosis}</span><span className="text-slate-400">{new Date(c.visitDate).toLocaleDateString()}</span></div>
                    <p className="text-slate-500 mt-1">{c.doctorName}</p>
                  </div>
                ))}
                {consultations.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No consultations</p>}
              </div>
            </div>

            {/* Recent Assistance */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2 mb-4">Recent Foundation Aid</h3>
              <div className="space-y-2">
                {assistanceHistory.slice(0, 3).map(a => (
                  <div key={a.id} className="p-3 bg-slate-50 rounded-xl text-xs flex justify-between items-center">
                    <div>
                      <span className="font-medium text-slate-700">{a.type}</span>
                      <p className="text-slate-400 mt-0.5">Foundation: Rs. {(a.foundationContribution || 0).toLocaleString()}</p>
                    </div>
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${a.status === 'Approved' ? 'bg-teal-100 text-teal-800' : a.status === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>{a.status}</span>
                  </div>
                ))}
                {assistanceHistory.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No assistance requests</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'consultations' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-left px-4 py-3">Doctor</th>
                  <th className="text-left px-4 py-3">Diagnosis</th>
                  <th className="text-left px-4 py-3">Complaint</th>
                  <th className="text-left px-4 py-3">Vitals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {consultations.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-xs text-slate-500">{new Date(c.visitDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-xs font-medium text-slate-700">{c.doctorName}</td>
                    <td className="px-4 py-3 text-xs text-slate-700">{c.diagnosis || '—'}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{c.chiefComplaint || '—'}</td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {c.vitals?.bpSystolic ? `${c.vitals.bpSystolic}/${c.vitals.bpDiastolic}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {consultations.length === 0 && <div className="text-center py-10 text-sm text-slate-400">No consultations recorded.</div>}
        </div>
      )}

      {activeTab === 'prescriptions' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-left px-4 py-3">Doctor</th>
                  <th className="text-left px-4 py-3">Medicines</th>
                  <th className="text-left px-4 py-3">Diagnosis</th>
                  <th className="text-left px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {prescriptions.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-xs text-slate-500">{new Date(p.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-xs font-medium text-slate-700">{p.doctorName}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{p.items.map(i => i.medicineName).join(', ') || '—'}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">—</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${p.status === 'Dispensed' ? 'bg-emerald-100 text-emerald-800' : p.status === 'Partially Dispensed' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>{p.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {prescriptions.length === 0 && <div className="text-center py-10 text-sm text-slate-400">No prescriptions found.</div>}
        </div>
      )}

      {activeTab === 'lab-orders' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="text-left px-4 py-3">Order ID</th>
                  <th className="text-left px-4 py-3">Doctor</th>
                  <th className="text-center px-4 py-3">Tests</th>
                  <th className="text-left px-4 py-3">Priority</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(labOrders || []).map(o => (
                  <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{o.id}</td>
                    <td className="px-4 py-3 text-xs font-medium text-slate-700">{o.doctorName || '—'}</td>
                    <td className="px-4 py-3 text-center text-xs text-slate-600">{o.items?.length || 0}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${o.priority === 'STAT' ? 'bg-rose-100 text-rose-700' : o.priority === 'Urgent' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{o.priority}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${o.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : o.status === 'In Progress' ? 'bg-purple-100 text-purple-700' : o.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{o.status}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">{new Date(o.orderDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(!labOrders || labOrders.length === 0) && <div className="text-center py-10 text-sm text-slate-400">No lab orders.</div>}
        </div>
      )}

      {activeTab === 'assistance' && (
        <div className="space-y-4">
          {/* Summary Cards */}
          {approvedAssistance.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-sm">
                <p className="text-[10px] text-slate-400 uppercase">Total Requests</p>
                <p className="text-xl font-bold text-slate-800 mt-1">{assistanceHistory.length}</p>
              </div>
              <div className="bg-white border border-emerald-200 rounded-xl p-4 text-center shadow-sm">
                <p className="text-[10px] text-emerald-600 uppercase">Approved</p>
                <p className="text-xl font-bold text-emerald-700 mt-1">{approvedAssistance.length}</p>
              </div>
              <div className="bg-white border border-blue-200 rounded-xl p-4 text-center shadow-sm">
                <p className="text-[10px] text-blue-600 uppercase">Foundation Total</p>
                <p className="text-xl font-bold text-blue-700 mt-1">Rs. {totalFoundation.toLocaleString()}</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-sm">
                <p className="text-[10px] text-slate-400 uppercase">Patient Total</p>
                <p className="text-xl font-bold text-slate-700 mt-1">Rs. {totalPatient.toLocaleString()}</p>
              </div>
            </div>
          )}

          {/* Assistance Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="text-left px-4 py-3">Date</th>
                    <th className="text-left px-4 py-3">Type</th>
                    <th className="text-right px-4 py-3">Estimated</th>
                    <th className="text-right px-4 py-3">Patient</th>
                    <th className="text-right px-4 py-3">Foundation</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Justification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {assistanceHistory.map(a => (
                    <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-xs text-slate-500">{new Date(a.requestDate).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-xs font-medium text-slate-700">{a.type}</td>
                      <td className="px-4 py-3 text-xs text-right text-slate-600">Rs. {a.estimatedCost.toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs text-right text-slate-600">Rs. {(a.patientContribution || 0).toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs text-right font-medium text-blue-700">Rs. {(a.foundationContribution || 0).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${a.status === 'Approved' ? 'bg-teal-100 text-teal-800' : a.status === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>{a.status}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 max-w-[200px] truncate">{a.justification || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {assistanceHistory.length === 0 && <div className="text-center py-10 text-sm text-slate-400">No foundation assistance requests.</div>}
          </div>
        </div>
      )}

      {activeTab === 'files' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="text-left px-4 py-3">Request ID</th>
                  <th className="text-left px-4 py-3">Requested By</th>
                  <th className="text-left px-4 py-3">Purpose</th>
                  <th className="text-left px-4 py-3">Urgency</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-left px-4 py-3">Fulfilled By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fileRequests.map(f => (
                  <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{f.id}</td>
                    <td className="px-4 py-3 text-xs font-medium text-slate-700">{f.requestedBy}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{f.purpose}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${f.urgency === 'Emergency' ? 'bg-rose-100 text-rose-800' : f.urgency === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>{f.urgency}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${f.status === 'Fulfilled' ? 'bg-emerald-100 text-emerald-800' : f.status === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>{f.status}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">{new Date(f.requestDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{f.fulfilledBy || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {fileRequests.length === 0 && <div className="text-center py-10 text-sm text-slate-400">No file requests for this patient.</div>}
        </div>
      )}
    </div>
  );
}
