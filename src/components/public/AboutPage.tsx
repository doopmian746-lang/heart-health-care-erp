import { Heart, Eye, Target, Users, Stethoscope, Pill, HandHeart, Shield, Activity, DollarSign, RotateCcw, Megaphone, HeartHandshake, Brain } from 'lucide-react';
import Logo from './Logo';

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0B2A4A] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-10">
          <Logo className="w-36 h-36 md:w-44 md:h-44 flex-shrink-0 brightness-0 invert" />
          <div>
            <h1 className="text-4xl md:text-5xl font-bold">About Us</h1>
            <p className="text-[#D71920] mt-2 text-lg font-medium">Every Heart Matters. Every Life Matters.</p>
            <p className="text-slate-300 mt-3 max-w-2xl">Learn about our mission, our work, and how we're making cardiac care accessible to everyone regardless of their financial circumstances.</p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-start">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-3xl font-bold text-[#D71920]">Our Mission</h2>
                <div className="flex-1 h-px bg-[#D71920]/30" />
              </div>
              <div className="space-y-4 text-[#475569] leading-relaxed">
                <p>At Healing Hearts Foundation, we believe that a person's financial circumstances should never determine whether they receive lifesaving cardiac care.</p>
                <p>Heart disease does not discriminate by wealth, status, age, or background. A poor patient has the same heart, the same hopes, and the same right to quality healthcare as anyone else.</p>
                <p className="text-[#0B2A4A] font-semibold border-l-4 border-[#D71920] pl-4">
                  Our mission is to ensure that no individual is denied <span className="text-[#D71920]">lifesaving cardiac care</span> because of financial hardship.
                </p>
                <p>We are dedicated to delivering accessible, affordable, equitable, and compassionate cardiovascular healthcare to underserved and vulnerable communities.</p>
              </div>
            </div>
            <div className="space-y-5">
              {[
                { icon: Eye, title: 'Our Vision', desc: 'A future where no heart is lost because of poverty, and every person has equal access to lifesaving cardiac care.', color: 'bg-[#0B2A4A]' },
                { icon: Target, title: 'Our Goal', desc: 'To save lives by delivering accessible, compassionate, and high-quality cardiac care to every patient in need.', color: 'bg-[#16a34a]' },
                { icon: Heart, title: 'Our Values', desc: 'Compassion, Equality, Excellence, Integrity, and Hope in every aspect of patient care.', color: 'bg-[#D71920]' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="bg-[#F7F9FC] p-6 rounded-2xl border border-[#0B2A4A]/10 flex items-start gap-4">
                    <div className={`${item.color} p-2.5 rounded-xl`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0B2A4A]">{item.title}</h4>
                      <p className="text-sm text-[#475569] mt-1">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 7-Step Process */}
      <section className="py-20 bg-[#F7F9FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0B2A4A] text-center mb-4">How We Help Patients</h2>
          <p className="text-[#475569] text-center mb-12 max-w-2xl mx-auto">Our comprehensive 7-step approach ensures every patient receives the care they need.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[
              { step: '01', icon: Users, title: 'Reach & Identify', desc: 'We reach underserved communities and identify poor patients suffering from heart disease.' },
              { step: '02', icon: Stethoscope, title: 'Care & Diagnose', desc: 'Free consultations, ECG, ECHO and other diagnostic services to detect heart problems early.' },
              { step: '03', icon: Activity, title: 'Treat & Intervene', desc: 'Provide essential medicines, advanced treatments, angioplasty, surgeries and life-saving interventions.' },
              { step: '04', icon: DollarSign, title: 'Support Financially', desc: 'Offer financial assistance for treatments, procedures, medicines and hospital expenses.' },
              { step: '05', icon: HeartHandshake, title: 'Rehabilitate & Empower', desc: 'Cardiac rehabilitation, counseling and support to help patients return to healthy lives.' },
              { step: '06', icon: RotateCcw, title: 'Follow Up & Care', desc: 'Regular follow-up, monitoring and counseling to ensure recovery and improve quality of life.' },
              { step: '07', icon: Megaphone, title: 'Spread Awareness', desc: 'Create awareness about heart health, prevention and early treatment in communities.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="bg-white p-6 rounded-2xl border border-[#0B2A4A]/10 shadow-sm relative overflow-hidden card-hover">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#0B2A4A]" />
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#0B2A4A] text-white rounded-full flex items-center justify-center font-bold text-sm">{item.step}</div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-4 h-4 text-[#D71920]" />
                        <h3 className="font-bold text-[#0B2A4A] text-sm uppercase tracking-wide">{item.title}</h3>
                      </div>
                      <p className="text-xs text-[#64748b] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0B2A4A] text-center mb-4">Our Services</h2>
          <p className="text-[#475569] text-center mb-12">We deliver accessible, affordable, and compassionate cardiovascular healthcare through:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Stethoscope, title: 'Free Cardiac Consultations', desc: 'Expert cardiac consultations at no cost for patients who cannot afford private healthcare.', color: 'bg-[#D71920]/10 text-[#D71920]' },
              { icon: Activity, title: 'Advanced Diagnostic Services', desc: 'ECG, ECHO, Blood Work and comprehensive cardiac diagnostics.', color: 'bg-[#0B2A4A]/10 text-[#0B2A4A]' },
              { icon: Pill, title: 'Essential Medications', desc: 'Our pharmacy maintains essential cardiac medications at no or reduced cost.', color: 'bg-[#16a34a]/10 text-[#16a34a]' },
              { icon: Shield, title: 'Surgery Sponsorship', desc: 'The foundation covers a significant portion or full cost of cardiac procedures.', color: 'bg-[#D71920]/10 text-[#D71920]' },
              { icon: HandHeart, title: 'Emergency Financial Aid', desc: 'Immediate financial assistance for cardiac emergencies.', color: 'bg-[#0B2A4A]/10 text-[#0B2A4A]' },
              { icon: Users, title: 'Follow-up Care', desc: 'Continuous monitoring and follow-up consultations to ensure cardiac health.', color: 'bg-[#16a34a]/10 text-[#16a34a]' },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="text-center p-6 rounded-2xl border border-[#0B2A4A]/10 card-hover">
                  <div className={`inline-flex p-3 rounded-xl ${s.color} mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-[#0B2A4A]">{s.title}</h3>
                  <p className="text-sm text-[#475569] mt-2 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-[#F7F9FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0B2A4A] text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { icon: HeartHandshake, title: 'Compassion', desc: 'Caring for every patient with kindness, empathy, and dignity.' },
              { icon: Users, title: 'Equality', desc: 'Every heart matters, regardless of wealth or social status.' },
              { icon: Target, title: 'Excellence', desc: 'Delivering the highest standards of cardiovascular care.' },
              { icon: Shield, title: 'Integrity', desc: 'Serving with honesty, transparency, and accountability.' },
              { icon: Brain, title: 'Hope', desc: 'Restoring lives through healing, support, and opportunity.' },
            ].map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="bg-white p-5 rounded-2xl border border-[#0B2A4A]/10 shadow-sm text-center card-hover">
                  <div className="w-14 h-14 bg-[#0B2A4A] text-white rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-[#0B2A4A] text-xs uppercase">{v.title}</h3>
                  <p className="text-[10px] text-[#64748b] mt-1.5">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#D71920]">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold">Join Our Mission</h2>
          <p className="mt-4 text-white/80 max-w-2xl mx-auto">Whether you donate, volunteer, partner with us, or simply help spread awareness, you become part of a movement that believes every heartbeat deserves a chance.</p>
          <p className="mt-4 font-semibold text-lg">Together, we can give hope, restore health, and save lives — one heart at a time.</p>
          <a href="/donations" className="inline-flex items-center gap-2 mt-8 px-8 py-3 bg-white text-[#D71920] font-semibold rounded-lg hover:bg-slate-50 transition-colors shadow-lg">
            Donate Now <Heart className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
