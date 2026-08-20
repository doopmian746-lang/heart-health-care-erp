import { useEffect, useState, useRef, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, HandHeart, Shield, ArrowRight, Stethoscope, Pill, Activity, Eye, Target, HeartHandshake, Brain, Megaphone, DollarSign, RotateCcw, Phone, ChevronRight, ArrowUp } from 'lucide-react';
import Logo from './Logo';

const API_BASE = '/api';

function useInView(ref: React.RefObject<HTMLElement | null>, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

function FadeSection({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);
  return (
    <div ref={ref} className={`${className}`} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: `all 0.7s cubic-bezier(0.4,0,0.2,1) ${delay}s` }}>
      {children}
    </div>
  );
}

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
  { icon: Stethoscope, title: 'Free & Subsidized Consultations', desc: 'Accessible cardiovascular consultations for patients who cannot afford private healthcare.' },
  { icon: Activity, title: 'Advanced Diagnostic Services', desc: 'ECG, ECHO and other diagnostic services to detect heart problems early.' },
  { icon: Pill, title: 'Essential Medications', desc: 'Help patients access essential cardiac medications at no or reduced cost.' },
  { icon: Heart, title: 'Lifesaving Interventions', desc: 'Advanced treatments, angioplasty, surgeries and other lifesaving interventions.' },
  { icon: RotateCcw, title: 'Rehabilitation Support', desc: 'Cardiac rehabilitation, counseling and recovery support for patients.' },
  { icon: DollarSign, title: 'Financial Assistance', desc: 'Financial assistance for treatments, procedures, medicines and hospital expenses.' },
  { icon: Megaphone, title: 'Heart Health Education & Outreach', desc: 'Awareness, prevention and early treatment of cardiovascular diseases.' },
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
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/public/stats`).then(r => r.json()).then(d => setStats(d)).catch(() => {});
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="bg-white">
      {/* ===== HERO ===== */}
      <section className="relative bg-[#F7F9FC] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg viewBox="0 0 1400 700" fill="none" className="w-full h-full">
            <path d="M0 350 Q 175 175, 350 350 T 700 350 T 1050 350 T 1400 350" stroke="#D71920" strokeWidth="2" fill="none" />
            <path d="M0 350 Q 175 250, 350 350 T 700 350 T 1050 350 T 1400 350" stroke="#0B2A4A" strokeWidth="1" fill="none" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#D71920]/10 rounded-full mb-6">
                <Heart className="w-3.5 h-3.5 text-[#D71920] animate-heartbeat" />
                <span className="text-xs font-semibold text-[#D71920] uppercase tracking-wider">Every Heart Matters</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0B2A4A] leading-[1.1]">
                Every Heart Matters.<br />
                <span className="text-[#D71920]">Every Life Matters.</span>
              </h1>
              <p className="text-lg text-[#475569] mt-6 max-w-xl leading-relaxed mx-auto lg:mx-0">
                We believe that a person's financial circumstances should never determine whether they receive lifesaving cardiac care. We are committed to ensuring that no individual suffers or loses their life simply because they cannot afford treatment.
              </p>
              <div className="flex items-center gap-4 mt-8 justify-center lg:justify-start">
                <Link to="/contact" className="px-8 py-3.5 bg-[#D71920] text-white font-semibold rounded-lg hover:bg-[#b8141a] transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[#D71920]/25 hover:shadow-xl hover:shadow-[#D71920]/30 hover:-translate-y-0.5">
                  Get Help <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/donations" className="px-8 py-3.5 bg-[#0B2A4A] text-white font-semibold rounded-lg hover:bg-[#091f38] transition-all duration-300 flex items-center gap-2 shadow-lg hover:-translate-y-0.5">
                  Support Our Mission <HandHeart className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="flex-shrink-0 relative">
              <div className="absolute -inset-8 bg-[#D71920]/5 rounded-full blur-3xl" />
              <Logo className="w-72 h-72 md:w-96 md:h-96 relative z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      {stats && (
        <section className="py-14 bg-[#0B2A4A]">
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
                  <div key={i} className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <div className="inline-flex p-3 rounded-xl bg-[#D71920]/20 mb-3">
                      <Icon className="w-6 h-6 text-[#D71920]" />
                    </div>
                    <p className="text-3xl font-bold text-white">{kpi.value}</p>
                    <p className="text-xs text-blue-200 mt-1 font-medium">{kpi.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== OUR MISSION ===== */}
      <FadeSection>
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-3xl md:text-4xl font-bold text-[#D71920]">Our Mission</h2>
                  <div className="flex-1 h-px bg-[#D71920]/30" />
                  <Heart className="w-6 h-6 text-[#D71920]" />
                </div>
                <div className="space-y-5 text-[#475569] leading-relaxed">
                  <p>
                    At Healing Hearts Foundation, we believe that a person's financial circumstances should never determine whether they receive lifesaving cardiac care.
                  </p>
                  <p>
                    We are committed to ensuring that no individual suffers or loses their life simply because they cannot afford treatment.
                  </p>
                  <p className="text-[#0B2A4A] font-semibold text-lg border-l-4 border-[#D71920] pl-4">
                    Our mission is to ensure that no individual is denied <span className="text-[#D71920]">lifesaving cardiac care</span> because of financial hardship.
                  </p>
                  <p>
                    We are dedicated to delivering accessible, affordable, equitable, and compassionate cardiovascular healthcare to underserved and vulnerable communities. Through free and subsidized consultations, advanced diagnostic services, essential medications, lifesaving interventions, rehabilitation, financial assistance, preventive heart health education, and community outreach programs, we strive to eliminate the barriers that prevent patients from receiving timely, high-quality care.
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="bg-[#F7F9FC] p-10 rounded-3xl border border-[#0B2A4A]/10 relative">
                  <Logo className="w-52 h-52" />
                  <p className="text-center text-sm text-[#0B2A4A] font-bold mt-3">Healing Hearts Foundation</p>
                  <p className="text-center text-xs text-[#D71920] font-medium mt-1">Every Heart Matters. Every Life Matters.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeSection>

      {/* ===== SERVICES ===== */}
      <FadeSection>
        <section className="py-20 bg-[#F7F9FC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B2A4A]">Our Services</h2>
              <p className="text-[#475569] mt-3 max-w-2xl mx-auto text-lg">
                We deliver accessible, affordable, and compassionate cardiovascular healthcare through:
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-5">
              {services.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="bg-white p-5 rounded-2xl border border-[#0B2A4A]/10 shadow-sm text-center card-hover cursor-default group">
                    <div className="w-14 h-14 bg-[#D71920]/10 text-[#D71920] rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-[#D71920] group-hover:text-white transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-[#0B2A4A] text-xs leading-tight">{s.title}</h3>
                    <p className="text-[10px] text-[#64748b] mt-1.5 leading-relaxed hidden md:block">{s.desc}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 bg-white border border-[#0B2A4A]/10 rounded-2xl p-5 flex items-center gap-3 justify-center shadow-sm">
              <Heart className="w-4 h-4 text-[#D71920]" />
              <p className="text-sm text-[#475569] font-medium">We strive to eliminate the barriers that prevent patients from receiving timely, high-quality care.</p>
            </div>
          </div>
        </section>
      </FadeSection>

      {/* ===== OUR PROMISE / VISION / GOAL ===== */}
      <FadeSection>
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Promise */}
              <div className="bg-[#FDF2F2] border border-[#D71920]/20 rounded-3xl p-8">
                <div className="px-5 py-2 bg-[#D71920] text-white rounded-full text-sm font-bold inline-block mb-6">OUR PROMISE</div>
                <ul className="space-y-3">
                  {promises.map((p, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Heart className="w-4 h-4 text-[#D71920] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-[#334155] font-medium">{p}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex justify-center opacity-20">
                  <HandHeart className="w-16 h-16 text-[#D71920]" />
                </div>
              </div>

              {/* Vision */}
              <div className="bg-[#EFF6FF] border border-[#0B2A4A]/15 rounded-3xl p-8">
                <div className="px-5 py-2 bg-[#0B2A4A] text-white rounded-full text-sm font-bold inline-block mb-6">OUR VISION</div>
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-[#0B2A4A]/10 rounded-full flex items-center justify-center">
                    <Eye className="w-10 h-10 text-[#0B2A4A]" />
                  </div>
                </div>
                <p className="text-sm text-[#334155] leading-relaxed text-center font-medium">
                  A future where no heart is lost because of poverty, and every person has equal access to lifesaving cardiac care.
                </p>
              </div>

              {/* Goal */}
              <div className="bg-[#F0FDF4] border border-[#16a34a]/20 rounded-3xl p-8">
                <div className="px-5 py-2 bg-[#16a34a] text-white rounded-full text-sm font-bold inline-block mb-6">OUR GOAL</div>
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-[#16a34a]/10 rounded-full flex items-center justify-center">
                    <Target className="w-10 h-10 text-[#16a34a]" />
                  </div>
                </div>
                <p className="text-sm text-[#334155] leading-relaxed text-center font-medium">
                  To save lives by delivering accessible, compassionate, and high-quality cardiac care to every patient in need.
                </p>
              </div>
            </div>
          </div>
        </section>
      </FadeSection>

      {/* ===== CORE VALUES ===== */}
      <FadeSection>
        <section className="py-20 bg-[#F7F9FC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B2A4A]">Our Core Values</h2>
              <div className="w-20 h-1 bg-[#D71920] mx-auto mt-4 rounded-full" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {coreValues.map((v, i) => {
                const Icon = v.icon;
                return (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-[#0B2A4A]/10 shadow-sm text-center card-hover">
                    <div className="w-16 h-16 bg-[#0B2A4A] text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-[#0B2A4A] text-sm uppercase tracking-wide">{v.title}</h3>
                    <p className="text-xs text-[#64748b] mt-2 leading-relaxed">{v.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </FadeSection>

      {/* ===== HOW WE HELP (7-Step) ===== */}
      <FadeSection>
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B2A4A]">
                How We <span className="text-[#D71920]">Help</span>
              </h2>
              <p className="text-[#D71920] mt-2 font-medium">Every Heart Matters. Every Life Matters.</p>
              <div className="w-16 h-0.5 bg-[#D71920] mx-auto mt-3" />
              <p className="text-sm text-[#475569] mt-4 max-w-lg mx-auto">
                Helping poor people with cardiac diseases to live longer, healthier and better lives.
              </p>
            </div>

            <div className="relative max-w-6xl mx-auto">
              <div className="hidden lg:flex absolute inset-0 items-center justify-center pointer-events-none">
                <div className="w-56 h-56 rounded-full border-2 border-dashed border-[#0B2A4A]/15 flex items-center justify-center">
                  <Logo className="w-36 h-36" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                {processSteps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.num} className="bg-white p-6 rounded-2xl border border-[#0B2A4A]/10 shadow-sm hover:shadow-lg transition-all duration-300 group">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-[#0B2A4A] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md group-hover:bg-[#D71920] transition-colors duration-300">
                          {step.num}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <Icon className="w-4 h-4 text-[#D71920]" />
                            <h3 className="font-bold text-[#0B2A4A] text-sm uppercase tracking-wide">{step.title}</h3>
                          </div>
                          <p className="text-xs text-[#64748b] leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="bg-gradient-to-br from-[#D71920] to-[#0B2A4A] p-6 rounded-2xl shadow-xl text-white flex flex-col items-center justify-center text-center">
                  <Logo className="w-16 h-16 mb-2 brightness-0 invert" />
                  <p className="font-bold text-sm">BE A HELPING HEART.</p>
                  <p className="font-bold text-lg mt-1">CHANGE A LIFE.</p>
                  <Link to="/donations" className="mt-4 px-6 py-2 bg-white text-[#D71920] font-semibold rounded-lg text-sm hover:bg-slate-50 transition-colors">
                    Donate Now
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
              <div className="bg-[#FDF2F2] border border-[#D71920]/20 rounded-xl p-5 flex items-start gap-3">
                <Heart className="w-5 h-5 text-[#D71920] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[#475569]">Heart disease does not discriminate by wealth, status or background.</p>
              </div>
              <div className="bg-[#EFF6FF] border border-[#0B2A4A]/15 rounded-xl p-5 flex items-start gap-3">
                <HandHeart className="w-5 h-5 text-[#0B2A4A] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[#475569]">Your support can save a life, bring hope and give someone a second chance.</p>
              </div>
              <div className="bg-[#F0FDF4] border border-[#16a34a]/20 rounded-xl p-5 flex items-start gap-3">
                <Users className="w-5 h-5 text-[#16a34a] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[#475569]">Together, we can build a healthier tomorrow for every heart.</p>
              </div>
            </div>

            <div className="mt-8 bg-[#0B2A4A] rounded-xl p-4 flex items-center justify-center gap-6 flex-wrap">
              <span className="text-white font-semibold text-sm flex items-center gap-2"><Activity className="w-4 h-4 text-[#D71920]" /> WE CARE</span>
              <span className="text-white/30">|</span>
              <span className="text-white font-semibold text-sm flex items-center gap-2"><Stethoscope className="w-4 h-4 text-[#D71920]" /> WE TREAT</span>
              <span className="text-white/30">|</span>
              <span className="text-white font-semibold text-sm flex items-center gap-2"><HandHeart className="w-4 h-4 text-[#D71920]" /> WE SUPPORT</span>
              <span className="text-white/30">|</span>
              <span className="text-white font-semibold text-sm flex items-center gap-2"><Heart className="w-4 h-4 text-[#D71920]" /> WE SAVE LIVES</span>
            </div>
          </div>
        </section>
      </FadeSection>

      {/* ===== CALL TO ACTION ===== */}
      <FadeSection>
        <section className="py-20 bg-[#0B2A4A] relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <svg viewBox="0 0 1400 500" fill="none" className="w-full h-full">
              <path d="M0 250 Q 175 125, 350 250 T 700 250 T 1050 250 T 1400 250" stroke="white" strokeWidth="1" fill="none" />
            </svg>
          </div>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Be a <span className="text-[#D71920]">Helping Heart</span>.<br />Change a Life.
            </h2>
            <div className="w-20 h-1 bg-[#D71920] mx-auto mt-6 rounded-full" />
            <p className="text-slate-300 text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
              Your support can save a life, bring hope and give someone a second chance.
            </p>
            <p className="text-white font-semibold text-xl mt-4">
              Together, we can build a healthier tomorrow for every heart.
            </p>
            <div className="flex items-center gap-4 mt-10 justify-center flex-wrap">
              <Link to="/donations" className="px-8 py-3.5 bg-[#D71920] text-white font-semibold rounded-lg hover:bg-[#b8141a] transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[#D71920]/30">
                Donate Now <Heart className="w-4 h-4" />
              </Link>
              <Link to="/contact" className="px-8 py-3.5 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20">
                Get Help
              </Link>
              <Link to="/contact" className="px-8 py-3.5 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20">
                Volunteer
              </Link>
              <Link to="/contact" className="px-8 py-3.5 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20">
                Partner With Us
              </Link>
            </div>
          </div>
        </section>
      </FadeSection>

      {/* ===== DONATION SECTION ===== */}
      <FadeSection>
        <section className="py-20 bg-[#F7F9FC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-bold text-[#0B2A4A]">
                  Help Us Save More <span className="text-[#D71920]">Hearts</span>
                </h2>
                <div className="w-20 h-1 bg-[#D71920] rounded-full mt-4 mb-6" />
                <p className="text-[#475569] leading-relaxed">
                  Your contribution can help provide consultations, diagnostic services, medicines, treatment, rehabilitation and financial assistance to patients in need. Every donation, no matter the size, makes a difference in someone's life.
                </p>
                <div className="flex items-center gap-4 mt-8">
                  <Link to="/donations" className="px-8 py-3.5 bg-[#D71920] text-white font-semibold rounded-lg hover:bg-[#b8141a] transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[#D71920]/25">
                    Donate Now <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to="/about" className="px-8 py-3.5 bg-[#0B2A4A] text-white font-semibold rounded-lg hover:bg-[#091f38] transition-all duration-300">
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="flex-shrink-0 grid grid-cols-2 gap-4">
                {[
                  { title: 'Consultations', desc: 'Fund free cardiac checkups' },
                  { title: 'Medications', desc: 'Provide essential medicines' },
                  { title: 'Surgeries', desc: 'Support lifesaving procedures' },
                  { title: 'Rehabilitation', desc: 'Enable recovery programs' },
                ].map((item, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl border border-[#0B2A4A]/10 shadow-sm card-hover text-center">
                    <Heart className="w-6 h-6 text-[#D71920] mx-auto mb-2" />
                    <h4 className="font-bold text-[#0B2A4A] text-sm">{item.title}</h4>
                    <p className="text-[10px] text-[#64748b] mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </FadeSection>

      {/* ===== BOTTOM TAGLINE ===== */}
      <section className="py-8 bg-[#D71920]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-white font-bold text-lg flex items-center justify-center gap-3">
            <Heart className="w-5 h-5" /> Every Heart Matters. Every Life Matters. <Heart className="w-5 h-5" />
          </p>
        </div>
      </section>

      {/* Scroll to top */}
      {showTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-[#0B2A4A] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#D71920] transition-colors duration-300">
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
