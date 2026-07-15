import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';
import { Patient, PatientMedicalHistory, Consultation, Prescription, InventoryItem } from '../../types';

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
  category: string;
  quantity: number;
  unitPrice: number;
}

export default function ConsultationForm({ patientId, patientName, onSaved, onCancel }: Props) {
  const token = useAppStore(s => s.token);
  const currentUser = useAppStore(s => s.currentUser);
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Patient data
  const [patient, setPatient] = useState<Patient | null>(null);
  const [medicalHistory, setMedicalHistory] = useState<PatientMedicalHistory | null>(null);
  const [prevConsultations, setPrevConsultations] = useState<Consultation[]>([]);
  const [prevPrescriptions, setPrevPrescriptions] = useState<Prescription[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  // Form state
  const [vitals, setVitals] = useState({
    bpSystolic: 120, bpDiastolic: 80, pulse: 72, weight: 70, height: 170, spo2: 98,
  });

  const [clinical, setClinical] = useState({
    chiefComplaint: '', symptoms: '', examinationFindings: '', diagnosis: '', doctorNotes: '',
  });

  const [treatment, setTreatment] = useState({
    investigations: '', procedures: '', referrals: '', foundationReferral: false, requirements: '',
  });

  const [prescription, setPrescription] = useState<MedicineItem[]>([]);
  const [lifestyle, setLifestyle] = useState('');
  const [followUp, setFollowUp] = useState({ date: '', instructions: '' });

  // Fetch patient data
  useEffect(() => {
    if (!token || !patientId) return;

    // Fetch patient detail
    fetch(`${API_BASE}/patients/${patientId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) { setPatient(d.patient); setMedicalHistory(d.medicalHistory); setPrevConsultations(d.consultations || []); setPrevPrescriptions(d.prescriptions || []); } })
      .catch(() => {});

    // Fetch inventory for medicine suggestions
    fetch(`${API_BASE}/inventory`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : [])
      .then(d => setInventory(d))
      .catch(() => {});
  }, [token, patientId]);

  const bmi = vitals.weight && vitals.height
    ? (vitals.weight / ((vitals.height / 100) ** 2)).toFixed(1)
    : '0.0';

  const addMedicine = () => {
    setPrescription([...prescription, { medicineName: '', strength: '', dosage: '1 tablet', frequency: 'Once daily', duration: '', instructions: '', category: '', quantity: 1, unitPrice: 0 }]);
  };

  const updateMedicine = (i: number, field: keyof MedicineItem, value: string | number) => {
    const updated = [...prescription];
    updated[i] = { ...updated[i], [field]: value };
    setPrescription(updated);
  };

  const removeMedicine = (i: number) => {
    setPrescription(prescription.filter((_, idx) => idx !== i));
  };

  const autoFillFromInventory = (i: number, medicineName: string) => {
    const item = inventory.find(inv => inv.medicineName.toLowerCase() === medicineName.toLowerCase());
    if (item) {
      updateMedicine(i, 'strength', item.medicineName.includes('mg') ? item.medicineName : '');
      updateMedicine(i, 'unitPrice', item.unitPrice);
      updateMedicine(i, 'category', item.category);
    }
  };

  const handleSubmit = async () => {
    if (!clinical.chiefComplaint.trim()) {
      setError('Chief complaint is required');
      setStep(3);
      return;
    }
    if (!clinical.diagnosis.trim()) {
      setError('Diagnosis is required');
      setStep(4);
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
          investigations: treatment.investigations,
          procedures: treatment.procedures,
          referrals: treatment.referrals,
          foundationReferral: treatment.foundationReferral,
          requirements: treatment.requirements,
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
            items: prescription.filter(m => m.medicineName.trim()).map(m => ({
              medicineId: '',
              medicineName: m.medicineName,
              strength: m.strength,
              dosage: m.dosage,
              frequency: m.frequency,
              duration: m.duration,
              instructions: m.instructions,
            })),
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
    { n: 1, label: 'Patient History', icon: '📋' },
    { n: 2, label: 'Vitals', icon: '💓' },
    { n: 3, label: 'Complaint', icon: '🩺' },
    { n: 4, label: 'Diagnosis', icon: '🔍' },
    { n: 5, label: 'Prescription', icon: '💊' },
    { n: 6, label: 'Requirements', icon: '📋' },
    { n: 7, label: 'Summary', icon: '✅' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm max-w-5xl mx-auto">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Doctor Checkup</h2>
            <p className="text-xs text-slate-400 mt-0.5">Patient: <span className="font-mono text-blue-600">{patientId}</span> — {patientName}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400">Dr. {currentUser?.name}</span>
            <p className="text-[10px] text-slate-300">{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-wrap">
          {steps.map((s, i) => (
            <button key={s.n} onClick={() => setStep(s.n)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${step === s.n ? 'bg-blue-600 text-white' : step > s.n ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
              {step > s.n ? '✓' : s.icon} {s.label}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg">{error}</div>}

      <div className="p-6 min-h-[400px]">
        {/* Step 1: Patient History */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">📋 Patient History & Background</h3>

            {/* Basic Info */}
            {patient && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="text-xs font-bold text-blue-800 mb-3">PATIENT INFORMATION</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div><span className="text-blue-600">Name:</span> <span className="font-medium">{patient.fullName}</span></div>
                  <div><span className="text-blue-600">Age:</span> <span className="font-medium">{patient.age} years</span></div>
                  <div><span className="text-blue-600">Gender:</span> <span className="font-medium">{patient.gender}</span></div>
                  <div><span className="text-blue-600">Blood Group:</span> <span className="font-medium">{patient.bloodGroup}</span></div>
                  <div><span className="text-blue-600">Mobile:</span> <span className="font-medium">{patient.mobile || '—'}</span></div>
                  <div><span className="text-blue-600">CNIC:</span> <span className="font-medium">{patient.cnic || '—'}</span></div>
                  <div><span className="text-blue-600">Occupation:</span> <span className="font-medium">{patient.occupation || '—'}</span></div>
                  <div><span className="text-blue-600">Referred By:</span> <span className="font-medium">{patient.referredBy || '—'}</span></div>
                </div>
              </div>
            )}

            {/* Medical History */}
            {medicalHistory && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h4 className="text-xs font-bold text-amber-800 mb-3">MEDICAL HISTORY</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="font-semibold text-amber-700 mb-1">Chronic Conditions</p>
                    {medicalHistory.chronicConditions.length > 0 ? (
                      <div className="flex flex-wrap gap-1">{medicalHistory.chronicConditions.map((c, i) => <span key={i} className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">{c}</span>)}</div>
                    ) : <p className="text-slate-400">None reported</p>}
                  </div>
                  <div>
                    <p className="font-semibold text-amber-700 mb-1">Allergies</p>
                    <p className="text-slate-700">{medicalHistory.allergies || 'None known'}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-amber-700 mb-1">Current Medications</p>
                    <p className="text-slate-700">{medicalHistory.existingMedications || 'None'}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-amber-700 mb-1">Prior Cardiac Procedures</p>
                    {medicalHistory.priorCardiacProcedures.length > 0 ? (
                      <div className="flex flex-wrap gap-1">{medicalHistory.priorCardiacProcedures.map((p, i) => <span key={i} className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">{p}</span>)}</div>
                    ) : <p className="text-slate-400">None</p>}
                  </div>
                  <div>
                    <p className="font-semibold text-amber-700 mb-1">Family History</p>
                    {medicalHistory.familyHistory.length > 0 ? (
                      <div className="flex flex-wrap gap-1">{medicalHistory.familyHistory.map((f, i) => <span key={i} className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">{f}</span>)}</div>
                    ) : <p className="text-slate-400">None reported</p>}
                  </div>
                  <div>
                    <p className="font-semibold text-amber-700 mb-1">Lifestyle Factors</p>
                    {medicalHistory.lifestyleFactors.length > 0 ? (
                      <div className="flex flex-wrap gap-1">{medicalHistory.lifestyleFactors.map((l, i) => <span key={i} className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">{l}</span>)}</div>
                    ) : <p className="text-slate-400">None reported</p>}
                  </div>
                </div>
              </div>
            )}

            {!medicalHistory && !patient && (
              <div className="text-center py-8 text-sm text-slate-400">Loading patient data...</div>
            )}

            {/* Previous Consultations */}
            {prevConsultations.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="text-xs font-bold text-slate-600 mb-3">PREVIOUS CONSULTATIONS ({prevConsultations.length})</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {prevConsultations.slice(0, 5).map(c => (
                    <div key={c.id} className="bg-white border border-slate-200 rounded-lg p-3 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-slate-400">{c.id}</span>
                        <span className="text-slate-400">{new Date(c.visitDate).toLocaleDateString()}</span>
                      </div>
                      <p className="font-medium text-slate-700">{c.diagnosis || 'No diagnosis'}</p>
                      <p className="text-slate-500 mt-0.5">{c.chiefComplaint}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Previous Prescriptions */}
            {prevPrescriptions.length > 0 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <h4 className="text-xs font-bold text-emerald-800 mb-3">CURRENT MEDICATIONS (from last prescription)</h4>
                <div className="space-y-1">
                  {prevPrescriptions[0]?.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span className="font-medium text-emerald-800">{item.medicineName}</span>
                      <span className="text-emerald-600">{item.strength}</span>
                      <span className="text-emerald-500">· {item.dosage} · {item.frequency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Vitals */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-800">💓 Record Vitals</h3>
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

        {/* Step 3: Complaint & Examination */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-800">🩺 Chief Complaint & Examination</h3>
            <div>
              <label className={labelClass}>Chief Complaint {requiredDot}</label>
              <input required value={clinical.chiefComplaint} onChange={e => setClinical({ ...clinical, chiefComplaint: e.target.value })}
                placeholder="e.g. Chest pain, shortness of breath, palpitations"
                className={inputClass} />
              <p className={hintClass}>What brings the patient in today? Main reason for visit.</p>
            </div>
            <div>
              <label className={labelClass}>Symptoms & History {requiredDot}</label>
              <textarea required value={clinical.symptoms} onChange={e => setClinical({ ...clinical, symptoms: e.target.value })}
                rows={3} placeholder="e.g. Chest pain radiating to left arm, sweating, nausea, dizziness for 2 days. Pain worsens with exertion, relieved by rest."
                className={inputClass} />
              <p className={hintClass}>Detailed description: onset, duration, severity, location, triggers, relieving factors.</p>
            </div>
            <div>
              <label className={labelClass}>Physical Examination Findings</label>
              <textarea value={clinical.examinationFindings} onChange={e => setClinical({ ...clinical, examinationFindings: e.target.value })}
                rows={4} placeholder="e.g. General: Alert, oriented, mild distress.&#10;CVS: S1 S2 normal, no murmurs, no gallop.&#10;Lungs: Clear bilaterally, no crackles.&#10;Edema: Mild bilateral pedal.&#10;Abdomen: Soft, non-tender."
                className={inputClass} />
              <p className={hintClass}>Systematic examination: General, CVS, Respiratory, Abdomen, Neurological, etc.</p>
            </div>
          </div>
        )}

        {/* Step 4: Diagnosis & Treatment Plan */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-800">🔍 Diagnosis & Treatment Plan</h3>
            <div>
              <label className={labelClass}>Diagnosis {requiredDot}</label>
              <textarea required value={clinical.diagnosis} onChange={e => setClinical({ ...clinical, diagnosis: e.target.value })}
                rows={2} placeholder="e.g. 1. Stable Angina - ICD: I20.9&#10;2. Hypertension Stage 2 - ICD: I10&#10;3. Dyslipidemia - ICD: E78.5"
                className={inputClass} />
              <p className={hintClass}>Primary and differential diagnoses. Include ICD codes if available.</p>
            </div>
            <div>
              <label className={labelClass}>Investigations Ordered</label>
              <textarea value={treatment.investigations} onChange={e => setTreatment({ ...treatment, investigations: e.target.value })}
                rows={3} placeholder="e.g.&#10;- CBC, Fasting Lipid Profile, HbA1c, Renal Function Tests&#10;- ECG (12-lead)&#10;- Chest X-Ray PA view&#10;- Echocardiography&#10;- Treadmill Test (if indicated)"
                className={inputClass} />
              <p className={hintClass}>Lab tests, imaging, ECG, echo, stress test, etc. ordered for this visit.</p>
            </div>
            <div>
              <label className={labelClass}>Procedures Performed / Planned</label>
              <textarea value={treatment.procedures} onChange={e => setTreatment({ ...treatment, procedures: e.target.value })}
                rows={2} placeholder="e.g. ECG performed in clinic. Referral for Coronary Angiography if TMT positive."
                className={inputClass} />
              <p className={hintClass}>Any procedures done today or planned for the future.</p>
            </div>
            <div>
              <label className={labelClass}>Specialist Referrals</label>
              <textarea value={treatment.referrals} onChange={e => setTreatment({ ...treatment, referrals: e.target.value })}
                rows={2} placeholder="e.g. Refer to Cardiologist for echocardiography. Refer to Dietitian for dietary counseling."
                className={inputClass} />
              <p className={hintClass}>Referrals to specialists, departments, or external facilities.</p>
            </div>
            <div>
              <label className={labelClass}>Doctor Notes / Treatment Plan</label>
              <textarea value={clinical.doctorNotes} onChange={e => setClinical({ ...clinical, doctorNotes: e.target.value })}
                rows={4} placeholder="e.g. Start dual antiplatelet therapy (Aspirin 75mg + Clopidogrel 75mg). Low salt diet. Restrict physical activity. Review in 2 weeks with lipid profile results."
                className={inputClass} />
              <p className={hintClass}>Overall treatment strategy, activity restrictions, diet instructions.</p>
            </div>
          </div>
        )}

        {/* Step 5: Prescription */}
        {step === 5 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-800">💊 Prescription</h3>
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="md:col-span-2">
                    <label className={labelClass}>Medicine Name {requiredDot}</label>
                    <input required value={med.medicineName} onChange={e => { updateMedicine(i, 'medicineName', e.target.value); autoFillFromInventory(i, e.target.value); }}
                      placeholder="e.g. Aspirin, Metoprolol, Atorvastatin"
                      list={`med-list-${i}`}
                      className={inputClass} />
                    <datalist id={`med-list-${i}`}>
                      {inventory.map(inv => <option key={inv.id} value={inv.medicineName} />)}
                    </datalist>
                    <p className={hintClass}>Type to search from inventory or enter manually</p>
                  </div>
                  <div>
                    <label className={labelClass}>Strength</label>
                    <input value={med.strength} onChange={e => updateMedicine(i, 'strength', e.target.value)}
                      placeholder="e.g. 75mg, 50mg" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Category</label>
                    <input value={med.category} onChange={e => updateMedicine(i, 'category', e.target.value)}
                      placeholder="e.g. Antiplatelet, Beta-blocker" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Dosage {requiredDot}</label>
                    <input required value={med.dosage} onChange={e => updateMedicine(i, 'dosage', e.target.value)}
                      placeholder="e.g. 1 tablet" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Frequency {requiredDot}</label>
                    <select required value={med.frequency} onChange={e => updateMedicine(i, 'frequency', e.target.value)} className={inputClass}>
                      {['Once daily', 'Twice daily', 'Three times daily', 'Four times daily', 'Every 4 hours', 'Every 6 hours', 'Every 8 hours', 'At bedtime', 'As needed', 'Weekly', 'Monthly'].map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Duration {requiredDot}</label>
                    <input required value={med.duration} onChange={e => updateMedicine(i, 'duration', e.target.value)}
                      placeholder="e.g. 7 days, 30 days, lifelong" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Quantity</label>
                    <input type="number" min="1" value={med.quantity || ''} onChange={e => updateMedicine(i, 'quantity', parseInt(e.target.value) || 1)}
                      className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Special Instructions</label>
                    <input value={med.instructions} onChange={e => updateMedicine(i, 'instructions', e.target.value)}
                      placeholder="e.g. Take after food, Avoid grapefruit, Monitor BP" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Unit Price (Rs.)</label>
                    <input type="number" min="0" value={med.unitPrice || ''} onChange={e => updateMedicine(i, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className={inputClass} />
                  </div>
                </div>
              </div>
            ))}

            <div>
              <label className={labelClass}>Lifestyle & Diet Recommendations</label>
              <textarea value={lifestyle} onChange={e => setLifestyle(e.target.value)}
                rows={3} placeholder="e.g. Low salt diet (avoid pickles, processed food). 30 min walking daily. Quit smoking. Reduce weight. Avoid stress. Limit caffeine."
                className={inputClass} />
              <p className={hintClass}>Diet, exercise, lifestyle modifications advised to the patient.</p>
            </div>
          </div>
        )}

        {/* Step 6: Requirements */}
        {step === 6 && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-800">📋 Requirements & Follow-up</h3>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={treatment.foundationReferral} onChange={e => setTreatment({ ...treatment, foundationReferral: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded" />
                <div>
                  <p className="text-sm font-bold text-amber-800">Refer to Foundation Assistance</p>
                  <p className="text-[10px] text-amber-600">Check this if the patient needs financial assistance from the foundation for treatment, surgery, or medication.</p>
                </div>
              </label>
            </div>

            <div>
              <label className={labelClass}>Special Requirements / Notes</label>
              <textarea value={treatment.requirements} onChange={e => setTreatment({ ...treatment, requirements: e.target.value })}
                rows={3} placeholder="e.g. Patient needs wheelchair access. Requires Urdu-speaking interpreter. Needs accommodation near hospital for family member during surgery."
                className={inputClass} />
              <p className={hintClass}>Any special needs, accommodations, or logistical requirements for the patient.</p>
            </div>

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
                rows={3} placeholder="e.g. Bring latest blood reports. Continue current medications. Return immediately if chest pain recurs. Bring ECG results from external lab."
                className={inputClass} />
              <p className={hintClass}>What the patient should bring or do before the next visit.</p>
            </div>
          </div>
        )}

        {/* Step 7: Summary */}
        {step === 7 && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-800">✅ Consultation Summary</h3>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div><span className="text-slate-400">Patient:</span> <span className="font-medium">{patientName}</span></div>
                <div><span className="text-slate-400">Doctor:</span> <span className="font-medium">Dr. {currentUser?.name}</span></div>
                <div><span className="text-slate-400">Date:</span> <span className="font-medium">{new Date().toLocaleDateString()}</span></div>
                <div><span className="text-slate-400">BP:</span> <span className="font-medium">{vitals.bpSystolic}/{vitals.bpDiastolic} mmHg</span></div>
                <div><span className="text-slate-400">Pulse:</span> <span className="font-medium">{vitals.pulse} bpm</span></div>
                <div><span className="text-slate-400">SpO2:</span> <span className="font-medium">{vitals.spo2}%</span></div>
                <div><span className="text-slate-400">BMI:</span> <span className="font-medium">{bmi}</span></div>
                <div><span className="text-slate-400">Weight:</span> <span className="font-medium">{vitals.weight} kg</span></div>
              </div>

              <div className="border-t border-slate-200 pt-3 space-y-2">
                <div><span className="text-[10px] font-semibold text-slate-400 uppercase">Chief Complaint:</span> <span className="text-sm font-medium">{clinical.chiefComplaint || '—'}</span></div>
                <div><span className="text-[10px] font-semibold text-slate-400 uppercase">Diagnosis:</span> <span className="text-sm font-medium">{clinical.diagnosis || '—'}</span></div>
                {treatment.investigations && <div><span className="text-[10px] font-semibold text-slate-400 uppercase">Investigations:</span> <span className="text-sm">{treatment.investigations}</span></div>}
                {treatment.procedures && <div><span className="text-[10px] font-semibold text-slate-400 uppercase">Procedures:</span> <span className="text-sm">{treatment.procedures}</span></div>}
                {treatment.referrals && <div><span className="text-[10px] font-semibold text-slate-400 uppercase">Referrals:</span> <span className="text-sm">{treatment.referrals}</span></div>}
              </div>

              {prescription.filter(m => m.medicineName).length > 0 && (
                <div className="border-t border-slate-200 pt-3">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">Prescription ({prescription.filter(m => m.medicineName).length} medicines):</span>
                  <div className="mt-2 space-y-1">
                    {prescription.filter(m => m.medicineName).map((m, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                        <span className="font-medium">{m.medicineName}</span>
                        <span className="text-slate-500">{m.strength} · {m.dosage} · {m.frequency} · {m.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {treatment.foundationReferral && (
                <div className="border-t border-slate-200 pt-3">
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">Foundation Assistance Referred</span>
                </div>
              )}

              {followUp.date && (
                <div className="border-t border-slate-200 pt-3">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">Follow-up:</span> <span className="text-sm font-medium">{new Date(followUp.date).toLocaleDateString()}</span>
                  {followUp.instructions && <p className="text-xs text-slate-500 mt-1">{followUp.instructions}</p>}
                </div>
              )}
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
          {step < 7 ? (
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
