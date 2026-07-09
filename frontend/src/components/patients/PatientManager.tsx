import React, { useState } from 'react';
import { usePatients } from '../../hooks/usePatients';
import { Patient } from '../../types';
import PatientForm from './PatientForm';

interface Props {
  onSelectPatient: (id: string) => void;
  onCreateConsultation: (patient: Patient) => void;
  onRequestAssistance: (patient: Patient) => void;
}

export default function PatientManager({ onSelectPatient, onCreateConsultation, onRequestAssistance }: Props) {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const { data: patients, loading, error } = usePatients(search);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Patient Database</h2>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors cursor-pointer">
          + Register New Patient
        </button>
      </div>

      {showForm ? (
        <PatientForm onComplete={() => { setShowForm(false); }} />
      ) : (
        <>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, ID, CNIC, or mobile..."
              className="w-full px-4 py-2.5 pl-10 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg className="absolute left-3 top-3 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {error && <div className="text-center py-6 text-sm text-rose-500">{error}</div>}

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="text-left px-4 py-3">Patient</th>
                    <th className="text-left px-4 py-3">Code</th>
                    <th className="text-left px-4 py-3">CNIC</th>
                    <th className="text-left px-4 py-3">Mobile</th>
                    <th className="text-left px-4 py-3">Age/Gender</th>
                    <th className="text-left px-4 py-3">Registered</th>
                    <th className="text-right px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {patients.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <button onClick={() => onSelectPatient(p.id)} className="font-medium text-blue-600 hover:text-blue-800 text-left cursor-pointer">
                          {p.fullName}
                        </button>
                        <div className="text-[10px] text-slate-400">{p.fatherHusbandName}</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">{p.patientCode}</td>
                      <td className="px-4 py-3 text-slate-600">{p.cnic}</td>
                      <td className="px-4 py-3 text-slate-600">{p.mobile}</td>
                      <td className="px-4 py-3">
                        <span className="text-slate-700">{p.age}</span>
                        <span className="text-slate-400 mx-1">/</span>
                        <span className="text-slate-500">{p.gender}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400">{new Date(p.registrationDate).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => onCreateConsultation(p)} className="px-2.5 py-1.5 text-[10px] bg-teal-50 text-teal-700 font-medium rounded-lg hover:bg-teal-100 cursor-pointer">Consult</button>
                          <button onClick={() => onRequestAssistance(p)} className="px-2.5 py-1.5 text-[10px] bg-amber-50 text-amber-700 font-medium rounded-lg hover:bg-amber-100 cursor-pointer">Sponsor</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {patients.length === 0 && !loading && (
              <div className="text-center py-10 text-sm text-slate-400">No patients found. Register a new patient to begin.</div>
            )}
            {loading && <div className="text-center py-6 text-sm text-slate-400">Loading...</div>}
          </div>
        </>
      )}
    </div>
  );
}
