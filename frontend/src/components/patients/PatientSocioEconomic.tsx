import React from 'react';
import { PatientSocioEconomic } from '../../types';

interface Props {
  data: PatientSocioEconomic;
  onChange: (data: PatientSocioEconomic) => void;
  readOnly?: boolean;
}

const inputClass = "w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
const labelClass = "block text-xs font-medium text-slate-600 mb-1";
const selectClass = inputClass;
const fieldRow = "flex items-center gap-2";

export default function PatientSocioEconomicForm({ data, onChange, readOnly }: Props) {
  const update = (field: keyof PatientSocioEconomic, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <h3 className="font-bold text-sm text-slate-800">Socio-Economic Assessment</h3>
        <span className="text-[10px] text-slate-400">For sponsorship eligibility evaluation</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Housing Status</label>
          <select className={selectClass} value={data.housingStatus} onChange={e => update('housingStatus', e.target.value)} disabled={readOnly}>
            <option value="Owned">Owned</option>
            <option value="Rented">Rented</option>
            <option value="With Family">With Family</option>
            <option value="Shelter">Shelter</option>
            <option value="Other">Other</option>
          </select>
          <p className="text-[10px] text-slate-400 mt-1">Current housing arrangement</p>
        </div>
        <div>
          <label className={labelClass}>House Type</label>
          <select className={selectClass} value={data.houseType} onChange={e => update('houseType', e.target.value)} disabled={readOnly}>
            <option value="House">House</option>
            <option value="Apartment">Apartment</option>
            <option value="Room">Room</option>
            <option value="Katchi Abadi">Katchi Abadi</option>
            <option value="Other">Other</option>
          </select>
          <p className="text-[10px] text-slate-400 mt-1">Type of dwelling unit</p>
        </div>
        <div>
          <label className={labelClass}>Number of Rooms *</label>
          <input type="number" min="0" required className={inputClass} value={data.numberOfRooms || ''} onChange={e => update('numberOfRooms', parseInt(e.target.value) || 0)} disabled={readOnly} />
          <p className="text-[10px] text-slate-400 mt-1">Total rooms in the house</p>
        </div>
        <div>
          <label className={labelClass}>Monthly Rent (PKR)</label>
          <input type="number" min="0" step="100" className={inputClass} value={data.monthlyRent || ''} onChange={e => update('monthlyRent', parseFloat(e.target.value) || 0)} disabled={readOnly} />
          <p className="text-[10px] text-slate-400 mt-1">0 if owned or free housing</p>
        </div>
        <div className={fieldRow}>
          <div className="flex-1">
            <label className={labelClass}>Owns Land?</label>
            <div className="flex gap-3 mt-1">
              <label className="flex items-center gap-1.5 text-sm">
                <input type="radio" checked={data.ownsLand} onChange={() => update('ownsLand', true)} disabled={readOnly} /> Yes
              </label>
              <label className="flex items-center gap-1.5 text-sm">
                <input type="radio" checked={!data.ownsLand} onChange={() => { update('ownsLand', false); update('landAcres', 0); }} disabled={readOnly} /> No
              </label>
            </div>
          </div>
          {data.ownsLand && (
            <div className="w-32">
              <label className={labelClass}>Acres</label>
              <input type="number" min="0" step="0.5" className={inputClass} value={data.landAcres} onChange={e => update('landAcres', parseFloat(e.target.value) || 0)} disabled={readOnly} />
            </div>
          )}
        </div>
        <div>
          <label className={labelClass}>Monthly Electricity Bill (PKR)</label>
          <input type="number" min="0" className={inputClass} value={data.monthlyElectricityBill} onChange={e => update('monthlyElectricityBill', parseFloat(e.target.value) || 0)} disabled={readOnly} />
        </div>
        <div>
          <label className={labelClass}>Water Source</label>
          <select className={selectClass} value={data.waterSource} onChange={e => update('waterSource', e.target.value)} disabled={readOnly}>
            <option value="Tap">Tap</option>
            <option value="Borewell">Borewell</option>
            <option value="Tank">Tank</option>
            <option value="Community Tap">Community Tap</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Toilet Type</label>
          <select className={selectClass} value={data.toiletType} onChange={e => update('toiletType', e.target.value)} disabled={readOnly}>
            <option value="Flush">Flush</option>
            <option value="Pit Latrine">Pit Latrine</option>
            <option value="Community">Community</option>
            <option value="None">None</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Cooking Fuel</label>
          <select className={selectClass} value={data.cookingFuel} onChange={e => update('cookingFuel', e.target.value)} disabled={readOnly}>
            <option value="Gas">Gas</option>
            <option value="Electric">Electric</option>
            <option value="Kerosene">Kerosene</option>
            <option value="Wood">Wood</option>
            <option value="Coal">Coal</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-4">
        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">Household Economics</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className={labelClass}>Monthly Household Income (PKR) *</label>
            <input type="number" min="0" required className={inputClass} value={data.monthlyHouseholdIncome || ''} onChange={e => update('monthlyHouseholdIncome', parseFloat(e.target.value) || 0)} disabled={readOnly} />
            <p className="text-[10px] text-slate-400 mt-1">Combined income of all earners</p>
          </div>
          <div>
            <label className={labelClass}>Number of Dependents *</label>
            <input type="number" min="0" required className={inputClass} value={data.numberOfDependents || ''} onChange={e => update('numberOfDependents', parseInt(e.target.value) || 0)} disabled={readOnly} />
            <p className="text-[10px] text-slate-400 mt-1">Non-earning family members</p>
          </div>
          <div>
            <label className={labelClass}>Earning Members *</label>
            <input type="number" min="0" required className={inputClass} value={data.numberOfEarningMembers || ''} onChange={e => update('numberOfEarningMembers', parseInt(e.target.value) || 0)} disabled={readOnly} />
            <p className="text-[10px] text-slate-400 mt-1">People contributing to household income</p>
          </div>
          <div>
            <label className={labelClass}>Education Level</label>
            <select className={selectClass} value={data.educationLevel} onChange={e => update('educationLevel', e.target.value)} disabled={readOnly}>
              <option value="None">None</option>
              <option value="Primary">Primary</option>
              <option value="Middle">Middle</option>
              <option value="Matric">Matric</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Graduate">Graduate</option>
              <option value="Post Graduate">Post Graduate</option>
              <option value="Technical Diploma">Technical Diploma</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Employment Status</label>
            <select className={selectClass} value={data.employmentStatus} onChange={e => update('employmentStatus', e.target.value)} disabled={readOnly}>
              <option value="Employed">Employed</option>
              <option value="Self-Employed">Self-Employed</option>
              <option value="Unemployed">Unemployed</option>
              <option value="Retired">Retired</option>
              <option value="Homemaker">Homemaker</option>
              <option value="Student">Student</option>
              <option value="Disabled">Disabled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-4">
        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">Household Assets</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {([
            ['hasRefrigerator', 'Refrigerator'],
            ['hasTelevision', 'Television'],
            ['hasPersonalVehicle', 'Personal Vehicle'],
            ['hasComputer', 'Computer'],
            ['hasInternet', 'Internet'],
          ] as const).map(([field, label]) => (
            <label key={field} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
              <input type="checkbox" checked={(data as any)[field]} onChange={e => update(field, e.target.checked)} disabled={readOnly} className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm text-slate-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>Additional Socio-Economic Notes</label>
        <textarea className={`${inputClass} min-h-[80px]`} value={data.notes} onChange={e => update('notes', e.target.value)} disabled={readOnly} placeholder="Any additional context about the patient's living situation, hardships, or family circumstances..." />
      </div>
    </div>
  );
}

export function emptySocioEconomic(): PatientSocioEconomic {
  return {
    housingStatus: 'Owned',
    houseType: 'House',
    numberOfRooms: 0,
    monthlyRent: 0,
    ownsLand: false,
    landAcres: 0,
    monthlyElectricityBill: 0,
    waterSource: 'Tap',
    toiletType: 'Flush',
    cookingFuel: 'Gas',
    monthlyHouseholdIncome: 0,
    numberOfDependents: 0,
    numberOfEarningMembers: 1,
    educationLevel: 'None',
    employmentStatus: 'Unemployed',
    hasRefrigerator: false,
    hasTelevision: false,
    hasPersonalVehicle: false,
    hasComputer: false,
    hasInternet: false,
    notes: '',
  };
}
