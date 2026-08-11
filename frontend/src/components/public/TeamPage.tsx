import { useEffect, useState } from 'react';
import { Heart, Mail } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

interface StaffMember {
  id: string;
  username: string;
  name: string;
  role: string;
}

const roleColors: Record<string, string> = {
  'Admin': 'bg-[#0B2A4A]/10 text-[#0B2A4A] border-[#0B2A4A]/20',
  'Doctor': 'bg-[#D71920]/10 text-[#D71920] border-[#D71920]/20',
  'Receptionist': 'bg-amber-50 text-amber-700 border-amber-200',
  'Pharmacy Staff': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Lab Staff': 'bg-teal-50 text-teal-700 border-teal-200',
};

const roleDescriptions: Record<string, string> = {
  'Admin': 'Oversees foundation operations and ensures quality healthcare delivery.',
  'Doctor': 'Expert cardiac specialist providing consultations and treatment.',
  'Receptionist': 'Manages patient registration and appointment coordination.',
  'Pharmacy Staff': 'Manages medicine inventory and dispenses prescriptions.',
  'Lab Staff': 'Conducts diagnostic tests and maintains lab equipment.',
};

export default function TeamPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/public/staff`)
      .then(r => r.json())
      .then(d => setStaff(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const doctors = staff.filter(s => s.role === 'Doctor');
  const others = staff.filter(s => s.role !== 'Doctor');

  return (
    <div>
      <section className="bg-[#0B2A4A] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold">Our Team</h1>
          <p className="text-[#D71920] mt-2 font-medium">Every Heart Matters. Every Life Matters.</p>
          <p className="text-slate-300 mt-3 max-w-2xl">Meet the dedicated professionals who make our mission possible.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && <div className="text-center py-12 text-[#475569]">Loading team...</div>}

          {!loading && doctors.length > 0 && (
            <>
              <h2 className="text-2xl font-bold text-[#0B2A4A] mb-8">Our Doctors</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {doctors.map(doc => (
                  <div key={doc.id} className="bg-white p-6 rounded-2xl border border-[#0B2A4A]/10 shadow-sm card-hover">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full bg-[#D71920]/10 flex items-center justify-center text-xl font-bold text-[#D71920] border-2 border-[#D71920]/20">
                        {doc.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <h3 className="font-bold text-[#0B2A4A]">{doc.name}</h3>
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-full border ${roleColors[doc.role] || 'bg-slate-100 text-slate-600'}`}>{doc.role}</span>
                      </div>
                    </div>
                    <p className="text-sm text-[#475569]">{roleDescriptions[doc.role] || 'Dedicated healthcare professional.'}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {!loading && others.length > 0 && (
            <>
              <h2 className="text-2xl font-bold text-[#0B2A4A] mb-8">Support Staff</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {others.map(member => (
                  <div key={member.id} className="bg-white p-6 rounded-2xl border border-[#0B2A4A]/10 shadow-sm card-hover">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-[#0B2A4A]/10 flex items-center justify-center text-lg font-bold text-[#0B2A4A] border border-[#0B2A4A]/20">
                        {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <h3 className="font-bold text-[#0B2A4A] text-sm">{member.name}</h3>
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-full border ${roleColors[member.role] || 'bg-slate-100 text-slate-600'}`}>{member.role}</span>
                      </div>
                    </div>
                    <p className="text-sm text-[#475569]">{roleDescriptions[member.role] || 'Valued team member.'}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {!loading && staff.length === 0 && (
            <div className="text-center py-12 text-[#475569]">No team members found.</div>
          )}
        </div>
      </section>

      <section className="py-16 bg-[#F7F9FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-[#0B2A4A] mb-4">Want to Join Our Team?</h2>
          <p className="text-[#475569] max-w-lg mx-auto mb-6">We're always looking for dedicated healthcare professionals who share our mission of providing quality cardiac care to underserved communities.</p>
          <a href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-[#D71920] text-white font-semibold rounded-lg hover:bg-[#b8141a] transition-colors shadow-md shadow-[#D71920]/20">
            <Mail className="w-4 h-4" /> Contact Us
          </a>
        </div>
      </section>
    </div>
  );
}
