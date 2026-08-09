import { Heart, Eye, Target, Users, Stethoscope, Pill, HandHeart, FileText, Shield, Activity, DollarSign, RotateCcw, Megaphone, HeartHandshake, Brain, UserCheck } from 'lucide-react';
import Logo from './Logo';

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-8">
          <Logo className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0" />
          <div>
            <h1 className="text-4xl font-bold">About Us</h1>
            <p className="text-blue-200 mt-2 text-lg">Every Heart Matters. Every Life Matters.</p>
            <p className="text-slate-400 mt-3 max-w-2xl">Learn about our mission, our work, and how we're making cardiac care accessible to everyone regardless of their financial circumstances.</p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Our Mission</h2>
              <div className="w-20 h-1 bg-rose-600 rounded-full mb-6" />
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  At Healing Hearts Foundation, we believe that a person's financial circumstances should never determine whether they receive lifesaving cardiac care. Every heart is precious, every heartbeat is valuable, and every patient deserves the opportunity to live a healthy life — regardless of whether they are rich or poor.
                </p>
                <p>
                  Heart disease does not discriminate by wealth, status, age, or background. A poor patient has the same heart, the same hopes, and the same right to quality healthcare as anyone else. We are committed to ensuring that no individual suffers or loses their life simply because they cannot afford treatment.
                </p>
                <p>
                  Our mission is to ensure that no individual is denied lifesaving cardiac care because of financial hardship. We are dedicated to delivering accessible, affordable, equitable, and compassionate cardiovascular healthcare to underserved and vulnerable communities in our era.
                </p>
                <p>
                  Through free and subsidized consultations, advanced diagnostic services, essential medications, lifesaving interventions, rehabilitation, financial assistance, preventive heart health education, and community outreach programs, we strive to eliminate the barriers that prevent patients from receiving timely, high-quality care.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-rose-50 to-white p-6 rounded-2xl border border-rose-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-rose-600 rounded-xl"><Eye className="w-5 h-5 text-white" /></div>
                  <h4 className="font-bold text-rose-700">Our Vision</h4>
                </div>
                <p className="text-sm text-slate-700">A future where no heart is lost because of poverty, and every person has equal access to lifesaving cardiac care.</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-700 rounded-xl"><Target className="w-5 h-5 text-white" /></div>
                  <h4 className="font-bold text-blue-700">Our Goal</h4>
                </div>
                <p className="text-sm text-slate-700">To save lives by delivering accessible, compassionate, and high-quality cardiac care to every patient in need.</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-2xl border border-emerald-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-emerald-600 rounded-xl"><Heart className="w-5 h-5 text-white" /></div>
                  <h4 className="font-bold text-emerald-700">Our Values</h4>
                </div>
                <p className="text-sm text-slate-700">Compassion, Equality, Excellence, Integrity, and Hope — we serve every patient with kindness, dignity, and the highest standards of care.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7-Step Process */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">How We Help Patients</h2>
          <p className="text-slate-500 text-center mb-12 max-w-2xl mx-auto">Our comprehensive 7-step approach ensures every patient receives the care they need from identification to recovery.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[
              { step: '01', icon: Users, title: 'Reach & Identify', desc: 'We reach underserved communities and identify poor patients suffering from heart disease.', color: 'bg-blue-600' },
              { step: '02', icon: Stethoscope, title: 'Care & Diagnose', desc: 'Free consultations, ECG, ECHO and other diagnostic services to detect heart problems early.', color: 'bg-rose-600' },
              { step: '03', icon: Activity, title: 'Treat & Intervene', desc: 'Provide essential medicines, advanced treatments, angioplasty, surgeries and life-saving interventions at low cost or free of cost.', color: 'bg-blue-700' },
              { step: '04', icon: DollarSign, title: 'Support Financially', desc: 'Offer financial assistance for treatments, procedures, medicines and hospital expenses.', color: 'bg-emerald-600' },
              { step: '05', icon: HeartHandshake, title: 'Rehabilitate & Empower', desc: 'Cardiac rehabilitation, counseling and support to help patients return to healthy, productive and dignified lives.', color: 'bg-rose-500' },
              { step: '06', icon: RotateCcw, title: 'Follow Up & Care', desc: 'Regular follow-up, monitoring and counseling to ensure recovery, prevent complications and improve quality of life.', color: 'bg-blue-500' },
              { step: '07', icon: Megaphone, title: 'Spread Awareness', desc: 'Create awareness about heart health, prevention and early treatment in communities.', color: 'bg-rose-700' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                  <div className={`absolute top-0 left-0 right-0 h-1 ${item.color}`} />
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-10 h-10 ${item.color} text-white rounded-xl flex items-center justify-center font-bold text-sm`}>
                      {item.step}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-4 h-4 text-slate-400" />
                        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">{item.title}</h3>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">How We Help Patients</h2>
          <p className="text-slate-500 text-center mb-12">We deliver accessible, affordable, and compassionate cardiovascular healthcare through:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Stethoscope, title: 'Free Cardiac Consultations', desc: 'Expert cardiac consultations at no cost for patients who cannot afford private healthcare.', color: 'bg-blue-50 text-blue-600' },
              { icon: Pill, title: 'Subsidized Medications', desc: 'Our pharmacy maintains essential cardiac medications at heavily subsidized rates or completely free.', color: 'bg-emerald-50 text-emerald-600' },
              { icon: FileText, title: 'Medical Records Management', desc: 'Complete digital record keeping ensures continuity of care. Patients can request their files anytime.', color: 'bg-amber-50 text-amber-600' },
              { icon: Shield, title: 'Surgery Sponsorship', desc: 'The foundation covers a significant portion or full cost of cardiac procedures through sponsorship.', color: 'bg-rose-50 text-rose-600' },
              { icon: HandHeart, title: 'Emergency Financial Aid', desc: 'Immediate financial assistance for cardiac emergencies. We work with partner hospitals for timely treatment.', color: 'bg-purple-50 text-purple-600' },
              { icon: Users, title: 'Follow-up Care', desc: 'Continuous monitoring and follow-up consultations to ensure patients maintain their cardiac health.', color: 'bg-teal-50 text-teal-600' },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="text-center p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
                  <div className={`inline-flex p-3 rounded-xl ${s.color} mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900">{s.title}</h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Our Core Values</h2>
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
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                  <div className="w-14 h-14 bg-blue-700 text-white rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm uppercase">{v.title}</h3>
                  <p className="text-xs text-slate-500 mt-1.5">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-rose-600">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold">Join Our Mission</h2>
          <p className="mt-4 text-rose-100 max-w-2xl mx-auto">
            Whether you donate, volunteer, partner with us, or simply help spread awareness, you become part of a movement that believes every heartbeat deserves a chance.
          </p>
          <p className="mt-4 font-semibold text-lg">Together, we can give hope, restore health, and save lives — one heart at a time.</p>
          <a href="/donations" className="inline-flex items-center gap-2 mt-8 px-8 py-3 bg-white text-rose-600 font-medium rounded-xl hover:bg-slate-50 transition-colors">
            Donate Now <Heart className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
