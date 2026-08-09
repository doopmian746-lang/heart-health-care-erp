import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, HandHeart, Shield, ArrowRight, Stethoscope, Pill, FileText, Target, Eye, HeartHandshake, Activity, Brain, Megaphone, UserCheck, DollarSign, RotateCcw } from 'lucide-react';
import Logo from './Logo';

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

const processSteps = [
  { num: 1, title: 'Reach & Identify', desc: 'We reach underserved communities and identify poor patients suffering from heart disease.', icon: Users, color: 'bg-blue-600' },
  { num: 2, title: 'Care & Diagnose', desc: 'Free consultations, ECG, ECHO and other diagnostic services to detect heart problems early.', icon: Stethoscope, color: 'bg-rose-600' },
  { num: 3, title: 'Treat & Intervene', desc: 'Provide essential medicines, advanced treatments, angioplasty, surgeries and life-saving interventions at low cost or free of cost.', icon: Activity, color: 'bg-blue-700' },
  { num: 4, title: 'Support Financially', desc: 'Offer financial assistance for treatments, procedures, medicines and hospital expenses.', icon: DollarSign, color: 'bg-emerald-600' },
  { num: 5, title: 'Rehabilitate & Empower', desc: 'Cardiac rehabilitation, counseling and support to help patients return to healthy, productive and dignified lives.', icon: HeartHandshake, color: 'bg-rose-500' },
  { num: 6, title: 'Follow Up & Care', desc: 'Regular follow-up, monitoring and counseling to ensure recovery, prevent complications and improve quality of life.', icon: RotateCcw, color: 'bg-blue-500' },
  { num: 7, title: 'Spread Awareness', desc: 'Create awareness about heart health, prevention and early treatment in communities.', icon: Megaphone, color: 'bg-rose-700' },
];

const services = [
  { icon: Stethoscope, title: 'Free & Subsidized Consultations', desc: 'Expert cardiac consultations at no cost for those in need.' },
  { icon: Activity, title: 'Advanced Diagnostic Services', desc: 'ECG, ECHO, Blood Work and comprehensive cardiac diagnostics.' },
  { icon: Pill, title: 'Essential Medications', desc: 'Free and subsidized cardiac medications from our pharmacy.' },
  { icon: Heart, title: 'Lifesaving Interventions', desc: 'Angioplasty, surgeries and emergency cardiac procedures.' },
  { icon: RotateCcw, title: 'Rehabilitation Support', desc: 'Cardiac rehab, lifestyle counseling and recovery programs.' },
  { icon: DollarSign, title: 'Financial Assistance', desc: 'Foundation-sponsored treatments for patients in financial hardship.' },
  { icon: Megaphone, title: 'Heart Health Education & Outreach', desc: 'Community awareness programs on prevention and early detection.' },
];

const coreValues = [
  { icon: HeartHandshake, title: 'Compassion', desc: 'Caring for every patient with kindness, empathy, and dignity.' },
  { icon: Users, title: 'Equality', desc: 'Every heart matters, regardless of wealth or social status.' },
  { icon: Target, title: 'Excellence', desc: 'Delivering the highest standards of cardiovascular care.' },
  { icon: Shield, title: 'Integrity', desc: 'Serving with honesty, transparency, and accountability.' },
  { icon: Brain, title: 'Hope', desc: 'Restoring lives through healing, support, and opportunity.' },
];

const promises = [
  'Every Heart Matters.',
  'Every Patient Deserves Hope.',
  'Every Life Has Equal Value.',
  'Compassion Before Circumstances.',
  'Healthcare Without Discrimination.',
  'No Heart Should Be Left Behind.',
];

export default function HomePage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_BASE}/public/stats`)
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg viewBox="0 0 1200 600" fill="none" className="w-full h-full">
            <path d="M0 300 Q 150 150, 300 300 T 600 300 T 900 300 T 1200 300" stroke="#c41e3a" strokeWidth="2" fill="none" />
            <path d="M0 300 Q 150 200, 300 300 T 600 300 T 900 300 T 1200 300" stroke="#1e3a5f" strokeWidth="1" fill="none" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Healing <span className="text-rose-600">Hearts</span> Foundation
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 mt-4 font-medium">
                Every <span className="text-rose-600 font-semibold">Heart</span> Matters. Every <span className="text-blue-700 font-semibold">Life</span> Matters.
              </p>
              <p className="text-slate-500 mt-6 leading-relaxed max-w-xl mx-auto lg:mx-0">
                At Healing Hearts Foundation, we believe that a person's financial circumstances should never determine whether they receive lifesaving cardiac care. Every heart is precious, every heartbeat is valuable.
              </p>
              <div className="flex items-center gap-4 mt-8 justify-center lg:justify-start">
                <Link to="/about" className="px-8 py-3 bg-rose-600 text-white font-medium rounded-xl hover:bg-rose-700 transition-colors flex items-center gap-2 shadow-lg shadow-rose-200">
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/donations" className="px-8 py-3 bg-blue-700 text-white font-medium rounded-xl hover:bg-blue-800 transition-colors flex items-center gap-2 shadow-lg shadow-blue-200">
                  Donate Now <Heart className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Logo className="w-64 h-64 md:w-80 md:h-80" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      {stats && (
        <section className="py-12 bg-gradient-to-r from-blue-700 to-blue-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Patients Registered', value: stats.totalPatients, icon: Users },
                { label: 'Patients Assisted', value: stats.totalAssistance, icon: HandHeart },
                { label: 'Funds Granted', value: `Rs. ${(stats.fundsGranted / 1000).toFixed(0)}K`, icon: Shield },
                { label: 'Total Donations', value: stats.donationCount, icon: Heart },
              ].map((kpi, i) => {
                const Icon = kpi.icon;
                return (
                  <div key={i} className="text-center p-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                    <div className="inline-flex p-3 rounded-xl bg-white/15 mb-3">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-white">{kpi.value}</p>
                    <p className="text-xs text-blue-200 mt-1 font-medium">{kpi.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== 7-STEP PROCESS ===== */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Helping <span className="text-rose-600">Hearts</span>
            </h2>
            <p className="text-slate-500 mt-3 max-w-2xl mx-auto text-lg">
              Every Heart Matters. Every Life Matters.
            </p>
            <p className="text-slate-600 mt-2 max-w-2xl mx-auto">
              Helping poor people with cardiac diseases to live longer, healthier and better lives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {processSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group relative overflow-hidden">
                  <div className={`absolute top-0 left-0 right-0 h-1 ${step.color}`} />
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 ${step.color} text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-md`}>
                      {step.num}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-4 h-4 text-slate-400" />
                        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">{step.title}</h3>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Center CTA card */}
            <div className="bg-gradient-to-br from-rose-600 to-blue-700 p-6 rounded-2xl shadow-lg text-white flex flex-col items-center justify-center text-center">
              <Logo className="w-20 h-20 mb-3" />
              <p className="font-bold text-sm">BE A HELPING HEART.</p>
              <p className="font-bold text-lg mt-1">CHANGE A LIFE.</p>
              <Link to="/donations" className="mt-4 px-6 py-2 bg-white text-rose-600 font-medium rounded-lg text-sm hover:bg-slate-50 transition-colors">
                Donate Now
              </Link>
            </div>
          </div>

          {/* Bottom info banners */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
            <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-start gap-3">
              <div className="p-2 bg-rose-50 rounded-lg flex-shrink-0">
                <Heart className="w-5 h-5 text-rose-600" />
              </div>
              <p className="text-sm text-slate-600">Heart disease does not discriminate by wealth, status or background.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                <HandHeart className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm text-slate-600">Your support can save a life, bring hope and give someone a second chance.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-start gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg flex-shrink-0">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-sm text-slate-600">Together, we can build a healthier tomorrow for every heart.</p>
            </div>
          </div>

          {/* Tagline bar */}
          <div className="mt-8 bg-slate-900 rounded-2xl p-4 flex items-center justify-center gap-4 flex-wrap">
            <span className="text-white font-medium text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-400" /> WE CARE
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-white font-medium text-sm flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-rose-400" /> WE TREAT
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-white font-medium text-sm flex items-center gap-2">
              <HandHeart className="w-4 h-4 text-rose-400" /> WE SUPPORT
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-white font-medium text-sm flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" /> WE SAVE LIVES
            </span>
          </div>
        </div>
      </section>

      {/* ===== OUR MISSION ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="flex-shrink-0 hidden lg:block">
              <Logo className="w-48 h-48" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Our Mission</h2>
              <div className="w-20 h-1 bg-rose-600 rounded-full mb-6" />
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  At Healing Hearts Foundation, we believe that a person's financial circumstances should never determine whether they receive lifesaving cardiac care. Every heart is precious, every heartbeat is valuable, and every patient deserves the opportunity to live a healthy life — regardless of whether they are rich or poor.
                </p>
                <p>
                  Heart disease does not discriminate by wealth, status, age, or background. A poor patient has the same heart, the same hopes, and the same right to quality healthcare as anyone else. We are committed to ensuring that no individual suffers or loses their life simply because they cannot afford treatment.
                </p>
                <p>
                  Our mission is to ensure that no individual is denied lifesaving cardiac care because of financial hardship. We are dedicated to delivering accessible, affordable, equitable, and compassionate cardiovascular healthcare to underserved and vulnerable communities.
                </p>
                <p>
                  Through free and subsidized consultations, advanced diagnostic services, essential medications, lifesaving interventions, rehabilitation, financial assistance, preventive heart health education, and community outreach programs, we strive to eliminate the barriers that prevent patients from receiving timely, high-quality care.
                </p>
                <p>
                  We believe that healthcare is a fundamental human right — not a privilege reserved for those who can afford it. Every heartbeat represents a life filled with dreams, responsibilities, and loved ones. Every heart deserves the same chance to heal, regardless of wealth, social status, ethnicity, or background.
                </p>
                <p>
                  Beyond treating cardiovascular disease, we are committed to restoring hope, preserving dignity, and transforming lives. We care for every patient with compassion, respect, empathy, and unwavering dedication, recognizing that behind every diagnosis is a human being deserving of kindness and support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">We Deliver Accessible, Affordable, and Compassionate Cardiovascular Healthcare Through:</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center hover:shadow-md transition-shadow group">
                  <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-xs leading-tight">{s.title}</h3>
                  <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed hidden md:block">{s.desc}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-3 justify-center">
            <div className="p-2 bg-rose-50 rounded-full">
              <Heart className="w-5 h-5 text-rose-600" />
            </div>
            <p className="text-sm text-slate-700 font-medium">We strive to eliminate the barriers that prevent patients from receiving timely, high-quality care.</p>
          </div>
        </div>
      </section>

      {/* ===== PROMISE / VISION / GOAL ===== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Our Promise */}
            <div className="bg-gradient-to-b from-rose-50 to-white border border-rose-200 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-rose-600 rounded-xl">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-rose-700">Our Promise</h3>
              </div>
              <ul className="space-y-3">
                {promises.map((p, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700">{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Our Vision */}
            <div className="bg-gradient-to-b from-blue-50 to-white border border-blue-200 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-700 rounded-xl">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-blue-700">Our Vision</h3>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed mb-6">
                A future where no heart is lost because of poverty, and every person has equal access to lifesaving cardiac care.
              </p>
              <div className="bg-blue-50 rounded-xl p-4 mt-4">
                <p className="text-xs text-blue-700 font-medium text-center italic">
                  "Our purpose extends far beyond medicine. We aim to build a future where poverty is never a barrier to lifesaving treatment."
                </p>
              </div>
            </div>

            {/* Our Goal */}
            <div className="bg-gradient-to-b from-emerald-50 to-white border border-emerald-200 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-600 rounded-xl">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-emerald-700">Our Goal</h3>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed mb-6">
                To save lives by delivering accessible, compassionate, and high-quality cardiac care to every patient in need.
              </p>
              <div className="bg-emerald-50 rounded-xl p-4 mt-4">
                <p className="text-xs text-emerald-700 font-medium text-center italic">
                  "No family loses a loved one because of financial constraints, and no heart is left behind."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CORE VALUES ===== */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {coreValues.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 bg-blue-700 text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">{v.title}</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== JOIN OUR MISSION ===== */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-rose-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg viewBox="0 0 1200 400" fill="none" className="w-full h-full">
            <path d="M0 200 Q 150 100, 300 200 T 600 200 T 900 200 T 1200 200" stroke="white" strokeWidth="1" fill="none" />
          </svg>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold">Join Our Mission</h2>
          <div className="w-20 h-1 bg-rose-500 rounded-full mx-auto mt-4 mb-6" />
          <p className="text-slate-300 text-lg leading-relaxed">
            Whether you donate, volunteer, partner with us, or simply help spread awareness, you become part of a movement that believes every heartbeat deserves a chance.
          </p>
          <p className="text-white font-semibold text-xl mt-6">
            Together, we can give hope, restore health, and save lives — one heart at a time.
          </p>
          <div className="flex items-center gap-4 mt-10 justify-center">
            <Link to="/donations" className="px-8 py-3 bg-rose-600 text-white font-medium rounded-xl hover:bg-rose-700 transition-colors flex items-center gap-2 shadow-lg">
              Donate Now <Heart className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="px-8 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors border border-white/20">
              Get In Touch
            </Link>
          </div>
        </div>
      </section>

      {/* ===== BOTTOM TAGLINE ===== */}
      <section className="py-8 bg-rose-600">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-white font-bold text-lg flex items-center justify-center gap-3">
            <Heart className="w-5 h-5" /> Every Heart Matters. Every Life Matters. <Heart className="w-5 h-5" />
          </p>
        </div>
      </section>
    </div>
  );
}
