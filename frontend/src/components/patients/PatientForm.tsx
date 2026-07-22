import React, { useState } from 'react';
import { Patient, PatientSocioEconomic, BloodGroup } from '../../types';
import { useAppStore } from '../../store/appStore';
import PatientSocioEconomicForm, { emptySocioEconomic } from './PatientSocioEconomic';

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

interface Props {
  onComplete: () => void;
  editPatient?: Patient;
}

const inputClass = "w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
const labelClass = "block text-xs font-medium text-slate-600 mb-1";
const selectClass = inputClass;

export default function PatientForm({ onComplete, editPatient }: Props) {
  const token = useAppStore(s => s.token);
  const [step, setStep] = useState<'basic' | 'socio' | 'medical'>('basic');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    fullName: editPatient?.fullName || '',
    fatherHusbandName: editPatient?.fatherHusbandName || '',
    cnic: editPatient?.cnic || '',
    dob: editPatient?.dob || '',
    age: editPatient?.age || 0,
    gender: editPatient?.gender || 'Male' as const,
    maritalStatus: editPatient?.maritalStatus || 'Single' as const,
    occupation: editPatient?.occupation || '',
    mobile: editPatient?.mobile || '',
    alternateContact: editPatient?.alternateContact || '',
    address: editPatient?.address || '',
    bloodGroup: editPatient?.bloodGroup || 'Unknown' as BloodGroup,
    referredBy: editPatient?.referredBy || '',
  });

  const [socio, setSocio] = useState<PatientSocioEconomic>(editPatient?.socioEconomic || emptySocioEconomic());

  const [medical, setMedical] = useState({
    chronicConditions: '' as string,
    lifestyleFactors: '' as string,
    familyHistory: '' as string,
    allergies: '' as string,
    existingMedications: '' as string,
    priorCardiacProcedures: '' as string,
  });

  const [submitted, setSubmitted] = useState(false);
  const [savedId, setSavedId] = useState('');

  const handleSubmit = async () => {
    if (!form.fullName.trim()) {
      setError('Full name is required');
      return;
    }
    setSubmitting(true);
    setError('');

    try {
      const body = { ...form, socioEconomic: socio };
      const url = editPatient ? `${API_BASE}/patients/${editPatient.id}` : `${API_BASE}/patients`;
      const method = editPatient ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || err.details?.[0]?.message || 'Failed to save');
      }

      const savedPatient = editPatient ? editPatient : await res.json();
      const patientId = editPatient?.id || savedPatient.id;
      setSavedId(patientId);

      const hasMedicalData = medical.chronicConditions || medical.lifestyleFactors || medical.familyHistory ||
        medical.allergies || medical.existingMedications || medical.priorCardiacProcedures;

      if (hasMedicalData && patientId) {
        const parseList = (s: string) => s.split(',').map(i => i.trim()).filter(Boolean);
        await fetch(`${API_BASE}/patients/${patientId}/medical-history`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            chronicConditions: parseList(medical.chronicConditions),
            lifestyleFactors: parseList(medical.lifestyleFactors),
            familyHistory: parseList(medical.familyHistory),
            allergies: medical.allergies || 'None',
            existingMedications: medical.existingMedications || 'None',
            priorCardiacProcedures: parseList(medical.priorCardiacProcedures),
          }),
        });
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`<!DOCTYPE html><html><head><title>Patient Registration - ${form.fullName}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #1e40af; padding-bottom: 10px; margin-bottom: 20px; }
        .header h1 { color: #1e40af; font-size: 18px; margin: 0; }
        .header p { color: #666; font-size: 12px; margin: 4px 0 0; }
        .section { margin-bottom: 16px; }
        .section h3 { font-size: 13px; color: #1e40af; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-bottom: 8px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
        .field { font-size: 12px; }
        .field .label { color: #9ca3af; font-size: 10px; text-transform: uppercase; }
        .field .value { font-weight: 600; margin-top: 2px; }
        .footer { margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 10px; font-size: 10px; color: #9ca3af; text-align: center; }
        @media print { body { padding: 10px; } }
      </style></head><body>
      <div class="header">
        <h1>Heart Health Care Foundation</h1>
        <p>Patient Registration Card</p>
        <p>Date: ${new Date().toLocaleDateString()}</p>
      </div>
      <div class="section">
        <h3>Basic Information</h3>
        <div class="grid">
          <div class="field"><div class="label">Patient ID</div><div class="value">${savedId}</div></div>
          <div class="field"><div class="label">Full Name</div><div class="value">${form.fullName}</div></div>
          <div class="field"><div class="label">Father/Husband</div><div class="value">${form.fatherHusbandName || '-'}</div></div>
          <div class="field"><div class="label">CNIC</div><div class="value">${form.cnic || '-'}</div></div>
          <div class="field"><div class="label">Date of Birth</div><div class="value">${form.dob || '-'}</div></div>
          <div class="field"><div class="label">Age</div><div class="value">${form.age}</div></div>
          <div class="field"><div class="label">Gender</div><div class="value">${form.gender}</div></div>
          <div class="field"><div class="label">Marital Status</div><div class="value">${form.maritalStatus}</div></div>
          <div class="field"><div class="label">Occupation</div><div class="value">${form.occupation || '-'}</div></div>
          <div class="field"><div class="label">Mobile</div><div class="value">${form.mobile || '-'}</div></div>
          <div class="field"><div class="label">Blood Group</div><div class="value">${form.bloodGroup}</div></div>
          <div class="field"><div class="label">Referred By</div><div class="value">${form.referredBy || '-'}</div></div>
        </div>
        <div class="field" style="margin-top:8px"><div class="label">Address</div><div class="value">${form.address || '-'}</div></div>
      </div>
      <div class="footer">Heart Health Care Foundation — Patient Registration Record</div>
      <script>window.onload=function(){window.print();}</script>
      </body></html>`);
    printWindow.document.close();
  };

  const update = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }));
  const updateMedical = (field: string, value: any) => setMedical(m => ({ ...m, [field]: value }));

  const steps = [
    { id: 'basic', label: 'Step 1: Basic Info' },
    { id: 'socio', label: 'Step 2: Socio-Economic' },
    { id: 'medical', label: 'Step 3: Medical History' },
  ];

  if (submitted) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm max-w-lg mx-auto text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="text-lg font-bold text-slate-900">{editPatient ? 'Patient Updated' : 'Patient Registered'} Successfully</h3>
        <p className="text-sm text-slate-500">Patient ID: <span className="font-mono text-blue-600">{savedId}</span></p>
        <div className="flex items-center justify-center gap-3 pt-4">
          <button onClick={handlePrint} className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 cursor-pointer flex items-center gap-2">
            🖨️ Print Registration Card
          </button>
          <button onClick={onComplete} className="px-6 py-2.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 cursor-pointer">
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {steps.map((s, i) => (
          <React.Fragment key={s.id}>
            {i > 0 && <div className="text-slate-300">→</div>}
            <button onClick={() => setStep(s.id as any)}
              className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${step === s.id ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>
              {s.label}
            </button>
          </React.Fragment>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg">{error}</div>
      )}

      {step === 'basic' && (
        <div className="space-y-6">
          <h3 className="font-bold text-sm text-slate-800 border-b border-slate-200 pb-2">Patient Demographics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="md:col-span-2 lg:col-span-1">
              <label className={labelClass}>Full Name *</label>
              <input className={inputClass} value={form.fullName} onChange={e => update('fullName', e.target.value)} placeholder="e.g. Abdul Karim" />
            </div>
            <div>
              <label className={labelClass}>Father / Husband Name</label>
              <input className={inputClass} value={form.fatherHusbandName} onChange={e => update('fatherHusbandName', e.target.value)} placeholder="e.g. Bashir Ahmed" />
            </div>
            <div>
              <label className={labelClass}>CNIC / National ID</label>
              <input className={inputClass} value={form.cnic} onChange={e => update('cnic', e.target.value)} placeholder="42101-1234567-1" />
            </div>
            <div>
              <label className={labelClass}>Date of Birth</label>
              <input type="date" className={inputClass} value={form.dob} onChange={e => update('dob', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Age</label>
              <input type="number" min="0" max="150" className={inputClass} value={form.age} onChange={e => update('age', parseInt(e.target.value) || 0)} />
            </div>
            <div>
              <label className={labelClass}>Gender</label>
              <select className={selectClass} value={form.gender} onChange={e => update('gender', e.target.value)}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Marital Status</label>
              <select className={selectClass} value={form.maritalStatus} onChange={e => update('maritalStatus', e.target.value)}>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Widowed">Widowed</option>
                <option value="Divorced">Divorced</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Occupation</label>
              <input className={inputClass} value={form.occupation} onChange={e => update('occupation', e.target.value)} placeholder="e.g. Retired Clerk" />
            </div>
            <div>
              <label className={labelClass}>Mobile Number</label>
              <input className={inputClass} value={form.mobile} onChange={e => update('mobile', e.target.value)} placeholder="0300-1234567" />
            </div>
            <div>
              <label className={labelClass}>Alternate Contact</label>
              <input className={inputClass} value={form.alternateContact} onChange={e => update('alternateContact', e.target.value)} placeholder="e.g. 0321-7654321 (Son)" />
            </div>
            <div>
              <label className={labelClass}>Blood Group</label>
              <select className={selectClass} value={form.bloodGroup} onChange={e => update('bloodGroup', e.target.value)}>
                {(['A+','A-','B+','B-','AB+','AB-','O+','O-','Unknown'] as const).map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Address</label>
              <input className={inputClass} value={form.address} onChange={e => update('address', e.target.value)} placeholder="Full residential address" />
            </div>
            <div>
              <label className={labelClass}>Referred By</label>
              <input className={inputClass} value={form.referredBy} onChange={e => update('referredBy', e.target.value)} placeholder="e.g. Chiniot General Hospital" />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button onClick={() => setStep('socio')} className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors cursor-pointer">
              Next: Socio-Economic Info →
            </button>
          </div>
        </div>
      )}

      {step === 'socio' && (
        <div>
          <PatientSocioEconomicForm data={socio} onChange={setSocio} />
          <div className="flex justify-between pt-6 border-t border-slate-100 mt-6">
            <button onClick={() => setStep('basic')} className="px-4 py-2.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 transition-colors cursor-pointer">
              ← Back to Basic Info
            </button>
            <button onClick={() => setStep('medical')} className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors cursor-pointer">
              Next: Medical History →
            </button>
          </div>
        </div>
      )}

      {step === 'medical' && (
        <div className="space-y-6">
          <h3 className="font-bold text-sm text-slate-800 border-b border-slate-200 pb-2">Medical History</h3>
          <p className="text-xs text-slate-400">Separate multiple items with commas (e.g. "Hypertension, Diabetes")</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={labelClass}>Chronic Conditions</label>
              <input className={inputClass} value={medical.chronicConditions}
                onChange={e => updateMedical('chronicConditions', e.target.value)}
                placeholder="e.g. Hypertension, Diabetes Type 2" />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Lifestyle Factors</label>
              <input className={inputClass} value={medical.lifestyleFactors}
                onChange={e => updateMedical('lifestyleFactors', e.target.value)}
                placeholder="e.g. Smoking, Sedentary, High salt diet" />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Family History</label>
              <input className={inputClass} value={medical.familyHistory}
                onChange={e => updateMedical('familyHistory', e.target.value)}
                placeholder="e.g. Heart Disease, Diabetes" />
            </div>
            <div>
              <label className={labelClass}>Allergies</label>
              <input className={inputClass} value={medical.allergies}
                onChange={e => updateMedical('allergies', e.target.value)}
                placeholder="e.g. Penicillin, None" />
            </div>
            <div>
              <label className={labelClass}>Existing Medications</label>
              <input className={inputClass} value={medical.existingMedications}
                onChange={e => updateMedical('existingMedications', e.target.value)}
                placeholder="e.g. Aspirin 75mg daily" />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Prior Cardiac Procedures</label>
              <input className={inputClass} value={medical.priorCardiacProcedures}
                onChange={e => updateMedical('priorCardiacProcedures', e.target.value)}
                placeholder="e.g. Angiography, Angioplasty, Bypass Surgery" />
            </div>
          </div>

          <div className="flex justify-between pt-6 border-t border-slate-100">
            <button onClick={() => setStep('socio')} className="px-4 py-2.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 transition-colors cursor-pointer">
              ← Back to Socio-Economic
            </button>
            <button onClick={handleSubmit} disabled={submitting} className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2">
              {submitting ? 'Saving...' : editPatient ? 'Update Patient' : 'Register Patient'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
