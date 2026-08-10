import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, HandHeart, Shield, ArrowRight, Stethoscope, Pill, FileText, Target, Eye, HeartHandshake, Activity, Brain, Megaphone, DollarSign, RotateCcw } from 'lucide-react';
import Logo from './Logo';

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

const processSteps = [
  { num: 1, title: 'Reach & Identify', desc: 'We reach underserved communities and identify poor patients suffering from heart disease.', icon: Users },
  { num: 2, title: 'Care & Diagnose', desc: 'Free consultations, ECG, ECHO and other diagnostic services to detect heart problems early.', icon: Stethoscope },
  { num: 3, title: 'Treat & Intervene', desc: 'Provide essential medicines, advanced treatments, angioplasty, surgeries and life-saving interventions at low cost or free of cost.', icon: Activity },
  { num: 4, title: 'Support Financially', desc: 'Offer financial assistance for treatments, procedures, medicines and hospital expenses.', icon: DollarSign },
  { num: 5, title: 'Rehabilitate & Empower', desc: 'Cardiac rehabilitation, counseling and support to help patients return to healthy, productive and dignified lives.', icon: HeartHandshake },
  { num: 6, title: 'Follow Up & Care', desc: 'Regular follow-up, monitoring and counseling to ensure recovery, prevent complications and improve quality of life.', icon: RotateCcw },
  { num: 7, title: 'Spread Awareness', desc: 'Create awareness about heart health, prevention and early treatment in communities.', icon: Megaphone },
];

const services = [
  { icon: Stethoscope, title: 'Free & Subsidized Consultations' },
  { icon: Activity, title: 'Advanced Diagnostic Services' },
  { icon: Pill, title: 'Essential Medications' },
  { icon: Heart, title: 'Lifesaving Interventions' },
  { icon: RotateCcw, title: 'Rehabilitation Support' },
  { icon: DollarSign, title: 'Financial Assistance' },
  { icon: Megaphone, title: 'Heart Health Education & Outreach' },
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
    <div className="bg-white">
      {/* ===== HERO SECTION ===== */}
      <section className="bg-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <Logo className="w-48 h-48 md:w-56 md:h-56 mx-auto lg:mx-0 mb-6" />
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1e3a5f] leading-tight">
                Healing <span className="text-[#c41e3a]">Hearts</span> Foundation
              </h1>
              <div className="flex items-center gap-2 mt-3 justify-center lg:justify-start">
                <div className="w-12 h-0.5 bg-[#c41e3a]" />
                <span className="text-xs text-[#1e3a5f] font-semibold uppercase tracking-widest">Foundation</span>
                <div className="w-12 h-0.5 bg-[#1e3a5f]" />
              </div>
              <p className="text-lg md:text-xl text-[#1e3a5f] mt-4 font-medium">
                Every <span className="text-[#c41e3a] font-bold">Heart</span> Matters. Every <span className="text-[#c41e3a] font-bold">Life</span> Matters.
              </p>
              <div className="flex items-center gap-4 mt-8 justify-center lg:justify-start">
                <Link to="/about" className="px-6 py-3 bg-[#c41e3a] text-white font-medium rounded-lg hover:bg-[#a01830] transition-colors flex items-center gap-2">
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/donations" className="px-6 py-3 bg-[#1e3a5f] text-white font-medium rounded-lg hover:bg-[#152d4a] transition-colors flex items-center gap-2">
                  Donate Now <Heart className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="flex-1 lg:text-right">
              <div className="bg-gradient-to-br from-[#fef2f2] to-[#eff6ff] p-8 rounded-3xl border border-[#e5e7eb]">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a5f] mb-4">Our Mission</h2>
                <div className="w-16 h-1 bg-[#c41e3a] rounded-full mb-4" />
                <p className="text-sm text-[#475569] leading-relaxed mb-3">
                  At Healing Hearts Foundation, we believe that a person's financial circumstances should never determine whether they receive lifesaving cardiac care.
                </p>
                <p className="text-sm text-[#475569] leading-relaxed mb-3">
                  We are committed to ensuring that no individual suffers or loses their life simply because they cannot afford treatment.
                </p>
                <p className="text-sm text-[#c41e3a] font-semibold">
                  Our mission is to ensure that no individual is denied lifesaving cardiac care because of financial hardship.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES STRIP ===== */}
      <section className="py-10 bg-[#f8fafc] border-y border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold text-[#1e3a5f] mb-8 uppercase tracking-wide">
            We deliver accessible, affordable, and compassionate cardiovascular healthcare through:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="bg-white p-4 rounded-xl border border-[#e5e7eb] shadow-sm text-center hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-[#c41e3a]/10 text-[#c41e3a] rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-[#1e3a5f] text-xs leading-tight">{s.title}</h3>
                </div>
              );
            })}
          </div>
          <div className="mt-6 bg-white border border-[#e5e7eb] rounded-xl p-4 flex items-center gap-3 justify-center">
            <Heart className="w-4 h-4 text-[#c41e3a]" />
            <p className="text-xs text-[#475569] font-medium">We strive to eliminate the barriers that prevent patients from receiving timely, high-quality care.</p>
          </div>
        </div>
      </section>

      {/* ===== 7-STEP PROCESS (HELPING HEARTS) ===== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f]">
              Helping <span className="text-[#c41e3a]">Hearts</span>
            </h2>
            <p className="text-[#c41e3a] mt-2 font-medium">Every Heart Matters. Every Life Matters.</p>
            <div className="w-16 h-0.5 bg-[#c41e3a] mx-auto mt-3" />
            <p className="text-sm text-[#475569] mt-4 max-w-md mx-auto">
              Helping poor people with cardiac diseases to live longer, healthier and better lives.
            </p>
          </div>

          {/* Circular process layout */}
          <div className="relative max-w-5xl mx-auto">
            {/* Center logo */}
            <div className="hidden lg:flex absolute inset-0 items-center justify-center pointer-events-none">
              <div className="w-48 h-48 rounded-full border-2 border-dashed border-[#1e3a5f]/20 flex items-center justify-center">
                <Logo className="w-32 h-32" />
              </div>
            </div>

            {/* Steps grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
              {processSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.num} className="bg-white p-5 rounded-2xl border border-[#e5e7eb] shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-[#1e3a5f] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                        {step.num}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Icon className="w-4 h-4 text-[#c41e3a]" />
                          <h3 className="font-bold text-[#1e3a5f] text-sm uppercase tracking-wide">{step.title}</h3>
                        </div>
                        <p className="text-xs text-[#64748b] leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* CTA card */}
              <div className="bg-gradient-to-br from-[#c41e3a] to-[#1e3a5f] p-6 rounded-2xl shadow-lg text-white flex flex-col items-center justify-center text-center">
                <Logo className="w-16 h-16 mb-2 brightness-0 invert" />
                <p className="font-bold text-sm">BE A HELPING HEART.</p>
                <p className="font-bold text-lg mt-1">CHANGE A LIFE.</p>
                <Link to="/donations" className="mt-3 px-5 py-2 bg-white text-[#c41e3a] font-medium rounded-lg text-sm hover:bg-slate-50 transition-colors">
                  Donate Now
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom info banners */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
            <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl p-5 flex items-start gap-3">
              <Heart className="w-5 h-5 text-[#c41e3a] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#475569]">Heart disease does not discriminate by wealth, status or background.</p>
            </div>
            <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl p-5 flex items-start gap-3">
              <HandHeart className="w-5 h-5 text-[#1e3a5f] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#475569]">Your support can save a life, bring hope and give someone a second chance.</p>
            </div>
            <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-5 flex items-start gap-3">
              <Users className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#475569]">Together, we can build a healthier tomorrow for every heart.</p>
            </div>
          </div>

          {/* Tagline bar */}
          <div className="mt-8 bg-[#1e3a5f] rounded-xl p-4 flex items-center justify-center gap-6 flex-wrap">
            <span className="text-white font-medium text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#c41e3a]" /> WE CARE
            </span>
            <span className="text-[#475569]">|</span>
            <span className="text-white font-medium text-sm flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-[#c41e3a]" /> WE TREAT
            </span>
            <span className="text-[#475569]">|</span>
            <span className="text-white font-medium text-sm flex items-center gap-2">
              <HandHeart className="w-4 h-4 text-[#c41e3a]" /> WE SUPPORT
            </span>
            <span className="text-[#475569]">|</span>
            <span className="text-white font-medium text-sm flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#c41e3a]" /> WE SAVE LIVES
            </span>
          </div>
        </div>
      </section>

      {/* ===== OUR MISSION (detailed) ===== */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="flex-shrink-0 hidden lg:block">
              <Logo className="w-44 h-44" />
              <p className="text-center text-xs text-[#1e3a5f] font-semibold mt-2">Healing Hearts<br />Foundation</p>
              <p className="text-center text-[10px] text-[#c41e3a] font-medium mt-1">Every Heart Matters.<br />Every Life Matters.</p>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-2xl md:text-3xl font-bold text-[#c41e3a]">OUR MISSION</h2>
                <div className="flex-1 h-px bg-[#c41e3a]" />
                <Heart className="w-5 h-5 text-[#c41e3a]" />
              </div>
              <div className="space-y-4 text-sm text-[#475569] leading-relaxed">
                <p>
                  At Healing Hearts Foundation, we believe that a person's financial circumstances should never determine whether they receive lifesaving cardiac care.
                </p>
                <p>
                  We are committed to ensuring that no individual suffers or loses their life simply because they cannot afford treatment.
                </p>
                <p className="font-semibold text-[#1e3a5f]">
                  Our mission is to ensure that no individual is denied lifesaving cardiac care because of financial hardship.
                </p>
                <p>
                  We are dedicated to delivering accessible, affordable, equitable, and compassionate cardiovascular healthcare to underserved and vulnerable communities in our era. Through free and subsidized consultations, advanced diagnostic services, essential medications, lifesaving interventions, rehabilitation, financial assistance, preventive heart health education, and community outreach programs, we strive to eliminate the barriers that prevent patients from receiving timely, high-quality care.
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

      {/* ===== PROMISE / VISION / GOAL ===== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Our Promise */}
            <div className="bg-[#fef2f2] border border-[#fecaca] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="px-4 py-1.5 bg-[#c41e3a] text-white rounded-full text-sm font-bold">OUR PROMISE</div>
              </div>
              <ul className="space-y-2.5">
                {promises.map((p, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-[#c41e3a] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#334155]">{p}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex justify-center">
                <HeartHandshake className="w-12 h-12 text-[#c41e3a]/30" />
              </div>
            </div>

            {/* Our Vision */}
            <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="px-4 py-1.5 bg-[#1e3a5f] text-white rounded-full text-sm font-bold">OUR VISION</div>
              </div>
              <div className="flex justify-center mb-5">
                <Eye className="w-14 h-14 text-[#1e3a5f]" />
              </div>
              <p className="text-sm text-[#334155] leading-relaxed text-center">
                A future where no heart is lost because of poverty, and every person has equal access to lifesaving cardiac care.
              </p>
            </div>

            {/* Our Goal */}
            <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="px-4 py-1.5 bg-[#16a34a] text-white rounded-full text-sm font-bold">OUR GOAL</div>
              </div>
              <div className="flex justify-center mb-5">
                <Target className="w-14 h-14 text-[#16a34a]" />
              </div>
              <p className="text-sm text-[#334155] leading-relaxed text-center">
                To save lives by delivering accessible, compassionate, and high-quality cardiac care to every patient in need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CORE VALUES ===== */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a5f]">OUR CORE VALUES</h2>
            <div className="w-16 h-0.5 bg-[#c41e3a] mx-auto mt-3" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
            {coreValues.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="bg-white p-5 rounded-2xl border border-[#e5e7eb] shadow-sm text-center hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 bg-[#1e3a5f] text-white rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-[#1e3a5f] text-xs uppercase tracking-wide">{v.title}</h3>
                  <p className="text-[10px] text-[#64748b] mt-1.5 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== JOIN OUR MISSION ===== */}
      <section className="py-16 bg-white border-t border-[#e5e7eb]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#c41e3a]">JOIN OUR MISSION</h2>
          <div className="w-16 h-0.5 bg-[#c41e3a] mx-auto mt-3 mb-6" />
          <p className="text-[#475569] text-sm leading-relaxed max-w-2xl mx-auto">
            Whether you donate, volunteer, partner with us, or simply help spread awareness, you become part of a movement that believes every heartbeat deserves a chance.
          </p>
          <p className="text-[#1e3a5f] font-semibold text-base mt-4">
            Together, we can give hope, restore health, and save lives — one heart at a time.
          </p>
          <div className="flex items-center gap-4 mt-8 justify-center">
            <Link to="/donations" className="px-6 py-3 bg-[#c41e3a] text-white font-medium rounded-lg hover:bg-[#a01830] transition-colors flex items-center gap-2 shadow-md">
              Donate Now <Heart className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="px-6 py-3 bg-[#1e3a5f] text-white font-medium rounded-lg hover:bg-[#152d4a] transition-colors">
              Get In Touch
            </Link>
          </div>
        </div>
      </section>

      {/* ===== BOTTOM TAGLINE ===== */}
      <section className="py-6 bg-[#1e3a5f]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-white font-bold text-base flex items-center justify-center gap-2">
            <Heart className="w-4 h-4 text-[#c41e3a]" /> Every Heart Matters. Every Life Matters. <Heart className="w-4 h-4 text-[#c41e3a]" />
          </p>
        </div>
      </section>
    </div>
  );
}
