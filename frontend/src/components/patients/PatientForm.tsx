import React, { useState } from 'react';
import { Patient, PatientSocioEconomic, BloodGroup } from '../../types';
import { useAppStore } from '../../store/appStore';
import PatientSocioEconomicForm, { emptySocioEconomic } from './PatientSocioEconomic';

interface Props {
  onComplete: () => void;
  editPatient?: Patient;
}

const inputClass = "w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
const labelClass = "block text-xs font-medium text-slate-600 mb-1";
const selectClass = inputClass;

export default function PatientForm({ onComplete, editPatient }: Props) {
  const token = useAppStore(s => s.token);
  const [step, setStep] = useState<'basic' | 'socio'>('basic');
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

  const handleSubmit = async () => {
    if (!form.fullName.trim()) {
      setError('Full name is required');
      return;
    }
    setSubmitting(true);
    setError('');

    try {
      const body = { ...form, socioEconomic: socio };
      const url = editPatient ? `/api/patients/${editPatient.id}` : '/api/patients';
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
      onComplete();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const update = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }));

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${step === 'basic' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-400'}`}>Step 1: Basic Info</div>
        <div className="text-slate-300">→</div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${step === 'socio' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-400'}`}>Step 2: Socio-Economic</div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg">{error}</div>
      )}

      {step === 'basic' ? (
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
      ) : (
        <div>
          <PatientSocioEconomicForm data={socio} onChange={setSocio} />
          <div className="flex justify-between pt-6 border-t border-slate-100 mt-6">
            <button onClick={() => setStep('basic')} className="px-4 py-2.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 transition-colors cursor-pointer">
              ← Back to Basic Info
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
