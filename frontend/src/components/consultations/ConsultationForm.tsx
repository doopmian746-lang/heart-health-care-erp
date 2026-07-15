import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';
import { Patient, InventoryItem } from '../../types';

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

interface Props {
  patientId: string;
  patientName: string;
  onSaved: () => void;
  onCancel: () => void;
}

const inputClass = "w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
const labelClass = "block text-xs font-semibold text-slate-600 mb-1";
const requiredDot = <span className="text-rose-500 ml-0.5">*</span>;
const hintClass = "text-[10px] text-slate-400 mt-0.5";

interface MedicineItem {
  medicineName: string;
  strength: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export default function ConsultationForm({ patientId, patientName, onSaved, onCancel }: Props) {
  const token = useAppStore(s => s.token);
  const currentUser = useAppStore(s => s.currentUser);
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [vitals, setVitals] = useState({
    bpSystolic: 120, bpDiastolic: 80, pulse: 72, weight: 70, height: 170, spo2: 98,
  });

  const [clinical, setClinical] = useState({
    chiefComplaint: '', symptoms: '', examinationFindings: '', diagnosis: '', doctorNotes: '',
  });

  const [prescription, setPrescription] = useState<MedicineItem[]>([]);
  const [lifestyle, setLifestyle] = useState('');
  const [followUp, setFollowUp] = useState({ date: '', instructions: '' });

  const bmi = vitals.weight && vitals.height
    ? (vitals.weight / ((vitals.height / 100) ** 2)).toFixed(1)
    : '0.0';

  const addMedicine = () => {
    setPrescription([...prescription, { medicineName: '', strength: '', dosage: '', frequency: 'Once daily', duration: '', instructions: '' }]);
  };

  const updateMedicine = (i: number, field: keyof MedicineItem, value: string) => {
    const updated = [...prescription];
    updated[i] = { ...updated[i], [field]: value };
    setPrescription(updated);
  };

  const removeMedicine = (i: number) => {
    setPrescription(prescription.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async () => {
    if (!clinical.chiefComplaint.trim()) {
      setError('Chief complaint is required');
      setStep(2);
      return;
    }
    if (!clinical.diagnosis.trim()) {
      setError('Diagnosis is required');
      setStep(3);
      return;
    }

    setSaving(true);
    setError('');

    try {
      const conRes = await fetch(`${API_BASE}/consultations/patient/${patientId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          vitals: { ...vitals, bmi: parseFloat(bmi) },
          chiefComplaint: clinical.chiefComplaint,
          symptoms: clinical.symptoms,
          examinationFindings: clinical.examinationFindings,
          diagnosis: clinical.diagnosis,
          doctorNotes: clinical.doctorNotes,
          followUpDate: followUp.date,
          followUpInstructions: followUp.instructions,
        }),
      });

      if (!conRes.ok) throw new Error('Failed to save consultation');
      const consultation = await conRes.json();

      if (prescription.length > 0) {
        const presRes = await fetch(`${API_BASE}/prescriptions/patient/${patientId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            consultationId: consultation.id,
            items: prescription.filter(m => m.medicineName.trim()),
            lifestyleRecommendations: lifestyle,
          }),
        });
        if (!presRes.ok) throw new Error('Failed to save prescription');
      }

      onSaved();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const steps = [
    { n: 1, label: 'Vitals' },
    { n: 2, label: 'Complaint & Symptoms' },
    { n: 3, label: 'Diagnosis' },
    { n: 4, label: 'Prescription' },
    { n: 5, label: 'Follow-up' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm max-w-4xl mx-auto">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Doctor Checkup</h2>
            <p className="text-xs text-slate-400 mt-0.5">Patient: <span className="font-mono text-blue-600">{patientId}</span> — {patientName}</p>
          </div>
          <span className="text-xs text-slate-400">Dr. {currentUser?.name}</span>
        </div>

        <div className="flex items-center gap-1 flex-wrap">
          {steps.map((s, i) => (
            <button key={s.n} onClick={() => setStep(s.n)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${step === s.n ? 'bg-blue-600 text-white' : step > s.n ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
              {step > s.n ? '✓' : ''} {s.label}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg">{error}</div>}

      <div className="p-6">
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-800">Record Vitals</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className={labelClass}>BP Systolic (mmHg) {requiredDot}</label>
                <input type="number" value={vitals.bpSystolic} onChange={e => setVitals({ ...vitals, bpSystolic: parseInt(e.target.value) || 0 })} className={inputClass} />
                <p className={hintClass}>Normal: 90-120</p>
              </div>
              <div>
                <label className={labelClass}>BP Diastolic (mmHg) {requiredDot}</label>
                <input type="number" value={vitals.bpDiastolic} onChange={e => setVitals({ ...vitals, bpDiastolic: parseInt(e.target.value) || 0 })} className={inputClass} />
                <p className={hintClass}>Normal: 60-80</p>
              </div>
              <div>
                <label className={labelClass}>Pulse (bpm) {requiredDot}</label>
                <input type="number" value={vitals.pulse} onChange={e => setVitals({ ...vitals, pulse: parseInt(e.target.value) || 0 })} className={inputClass} />
                <p className={hintClass}>Normal: 60-100</p>
              </div>
              <div>
                <label className={labelClass}>SpO2 (%) {requiredDot}</label>
                <input type="number" value={vitals.spo2} onChange={e => setVitals({ ...vitals, spo2: parseInt(e.target.value) || 0 })} className={inputClass} />
                <p className={hintClass}>Normal: 95-100</p>
              </div>
              <div>
                <label className={labelClass}>Weight (kg) {requiredDot}</label>
                <input type="number" step="0.1" value={vitals.weight} onChange={e => setVitals({ ...vitals, weight: parseFloat(e.target.value) || 0 })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Height (cm) {requiredDot}</label>
                <input type="number" value={vitals.height} onChange={e => setVitals({ ...vitals, height: parseFloat(e.target.value) || 0 })} className={inputClass} />
              </div>
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                <label className={labelClass}>BMI (auto-calculated)</label>
                <p className="text-xl font-bold text-slate-800">{bmi}</p>
                <p className={hintClass}>{parseFloat(bmi) < 18.5 ? 'Underweight' : parseFloat(bmi) < 25 ? 'Normal' : parseFloat(bmi) < 30 ? 'Overweight' : 'Obese'}</p>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-800">Chief Complaint & Symptoms</h3>
            <div>
              <label className={labelClass}>Chief Complaint {requiredDot}</label>
              <input required value={clinical.chiefComplaint} onChange={e => setClinical({ ...clinical, chiefComplaint: e.target.value })}
                placeholder="e.g. Chest pain, shortness of breath, palpitations"
                className={inputClass} />
              <p className={hintClass}>What brings the patient in today? Main reason for visit.</p>
            </div>
            <div>
              <label className={labelClass}>Symptoms {requiredDot}</label>
              <textarea required value={clinical.symptoms} onChange={e => setClinical({ ...clinical, symptoms: e.target.value })}
                rows={3} placeholder="e.g. Chest pain radiating to left arm, sweating, nausea, dizziness for 2 days"
                className={inputClass} />
              <p className={hintClass}>Detailed description of symptoms, onset, duration, severity, and triggers.</p>
            </div>
            <div>
              <label className={labelClass}>Examination Findings</label>
              <textarea value={clinical.examinationFindings} onChange={e => setClinical({ ...clinical, examinationFindings: e.target.value })}
                rows={3} placeholder="e.g. Heart sounds: S1 S2 normal, no murmurs. Lungs: clear bilaterally. Edema: mild bilateral pedal."
                className={inputClass} />
              <p className={hintClass}>Physical examination observations, auscultation, palpation findings.</p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-800">Diagnosis & Treatment Plan</h3>
            <div>
              <label className={labelClass}>Diagnosis {requiredDot}</label>
              <textarea required value={clinical.diagnosis} onChange={e => setClinical({ ...clinical, diagnosis: e.target.value })}
                rows={2} placeholder="e.g. Stable Angina, Hypertension Stage 2, Dyslipidemia"
                className={inputClass} />
              <p className={hintClass}>Primary and differential diagnoses. Use ICD codes if applicable.</p>
            </div>
            <div>
              <label className={labelClass}>Doctor Notes / Treatment Plan</label>
              <textarea value={clinical.doctorNotes} onChange={e => setClinical({ ...clinical, doctorNotes: e.target.value })}
                rows={4} placeholder="e.g. Start dual antiplatelet therapy. Low salt diet. Restrict physical activity. Review in 2 weeks."
                className={inputClass} />
              <p className={hintClass}>Detailed treatment plan, investigations ordered, referrals, activity restrictions.</p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-800">Prescription</h3>
              <button onClick={addMedicine} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg hover:bg-blue-100 cursor-pointer">+ Add Medicine</button>
            </div>

            {prescription.length === 0 && (
              <div className="text-center py-8 text-sm text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                No medicines added yet. Click "+ Add Medicine" to prescribe.
              </div>
            )}

            {prescription.map((med, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Medicine {i + 1}</span>
                  <button onClick={() => removeMedicine(i)} className="text-xs text-rose-500 hover:text-rose-700 cursor-pointer">Remove</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className={labelClass}>Medicine Name {requiredDot}</label>
                    <input required value={med.medicineName} onChange={e => updateMedicine(i, 'medicineName', e.target.value)}
                      placeholder="e.g. Aspirin, Metoprolol, Atorvastatin"
                      className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Strength</label>
                    <input value={med.strength} onChange={e => updateMedicine(i, 'strength', e.target.value)}
                      placeholder="e.g. 75mg, 50mg" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Dosage {requiredDot}</label>
                    <input required value={med.dosage} onChange={e => updateMedicine(i, 'dosage', e.target.value)}
                      placeholder="e.g. 1 tablet" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Frequency {requiredDot}</label>
                    <select required value={med.frequency} onChange={e => updateMedicine(i, 'frequency', e.target.value)} className={inputClass}>
                      {['Once daily', 'Twice daily', 'Three times daily', 'Four times daily', 'Every 4 hours', 'Every 6 hours', 'Every 8 hours', 'At bedtime', 'As needed', 'Weekly'].map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Duration {requiredDot}</label>
                    <input required value={med.duration} onChange={e => updateMedicine(i, 'duration', e.target.value)}
                      placeholder="e.g. 7 days, 30 days, lifelong" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Special Instructions</label>
                  <input value={med.instructions} onChange={e => updateMedicine(i, 'instructions', e.target.value)}
                    placeholder="e.g. Take after food, Avoid grapefruit, Monitor BP" className={inputClass} />
                </div>
              </div>
            ))}

            <div>
              <label className={labelClass}>Lifestyle Recommendations</label>
              <textarea value={lifestyle} onChange={e => setLifestyle(e.target.value)}
                rows={3} placeholder="e.g. Low salt diet, 30 min walking daily, quit smoking, reduce weight, avoid stress"
                className={inputClass} />
              <p className={hintClass}>Diet, exercise, lifestyle modifications advised to the patient.</p>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-800">Follow-up & Summary</h3>
            <div>
              <label className={labelClass}>Follow-up Date</label>
              <input type="date" value={followUp.date} onChange={e => setFollowUp({ ...followUp, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className={inputClass} />
              <p className={hintClass}>When should the patient return for next visit?</p>
            </div>
            <div>
              <label className={labelClass}>Follow-up Instructions</label>
              <textarea value={followUp.instructions} onChange={e => setFollowUp({ ...followUp, instructions: e.target.value })}
                rows={3} placeholder="e.g. Bring latest blood reports. Continue current medications. Return immediately if chest pain recurs."
                className={inputClass} />
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-4">
              <h4 className="text-xs font-bold text-slate-600 mb-3">CONSULTATION SUMMARY</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><span className="text-slate-400">Patient:</span> <span className="font-medium">{patientName}</span></div>
                <div><span className="text-slate-400">Doctor:</span> <span className="font-medium">Dr. {currentUser?.name}</span></div>
                <div><span className="text-slate-400">BP:</span> <span className="font-medium">{vitals.bpSystolic}/{vitals.bpDiastolic} mmHg</span></div>
                <div><span className="text-slate-400">Pulse:</span> <span className="font-medium">{vitals.pulse} bpm</span></div>
                <div><span className="text-slate-400">BMI:</span> <span className="font-medium">{bmi}</span></div>
                <div><span className="text-slate-400">SpO2:</span> <span className="font-medium">{vitals.spo2}%</span></div>
                <div className="col-span-2"><span className="text-slate-400">Complaint:</span> <span className="font-medium">{clinical.chiefComplaint || '—'}</span></div>
                <div className="col-span-2"><span className="text-slate-400">Diagnosis:</span> <span className="font-medium">{clinical.diagnosis || '—'}</span></div>
                <div className="col-span-2"><span className="text-slate-400">Medicines:</span> <span className="font-medium">{prescription.filter(m => m.medicineName).length} prescribed</span></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 cursor-pointer">
              ← Back
            </button>
          )}
          <button onClick={onCancel} className="px-4 py-2 text-slate-400 text-sm hover:text-slate-600 cursor-pointer">Cancel</button>
        </div>
        <div className="flex items-center gap-2">
          {step < 5 ? (
            <button onClick={() => { setError(''); setStep(step + 1); }}
              className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 cursor-pointer">
              Next →
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={saving}
              className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 disabled:opacity-50 cursor-pointer">
              {saving ? 'Saving...' : 'Save Consultation & Prescription'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
