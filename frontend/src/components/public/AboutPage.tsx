import { Heart, Eye, Target, Users, Stethoscope, Pill, HandHeart, FileText, Shield } from 'lucide-react';

export default function AboutPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">About Us</h1>
          <p className="text-slate-400 mt-3 max-w-2xl">Learn about our mission, our work, and how we're making cardiac care accessible to everyone</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Our Mission</h2>
              <p className="text-slate-600 mt-4 leading-relaxed">
                The Heart Health Care Foundation is committed to providing accessible, affordable, 
                and high-quality cardiac healthcare to underserved communities across Pakistan. 
                We believe that no one should suffer or lose their life simply because they cannot 
                afford heart treatment.
              </p>
              <p className="text-slate-600 mt-4 leading-relaxed">
                Founded in Chiniot, we serve patients from across the region who come to us with 
                complex cardiac conditions. Our team of dedicated doctors, nurses, and support staff 
                work tirelessly to ensure every patient receives personalized, compassionate care.
              </p>
            </div>
            <div className="bg-gradient-to-br from-rose-50 to-blue-50 p-8 rounded-2xl border border-slate-100">
              <div className="space-y-6">
                {[
                  { icon: Eye, title: 'Our Vision', desc: 'A world where quality cardiac care is accessible to everyone, regardless of financial status.' },
                  { icon: Target, title: 'Our Goal', desc: 'To reduce cardiac mortality in underserved communities through prevention, treatment, and education.' },
                  { icon: Heart, title: 'Our Values', desc: 'Compassion, integrity, excellence, and equality in every aspect of patient care.' },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-start gap-4">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Icon className="w-5 h-5 text-rose-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Our Work Method</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', icon: Users, title: 'Patient Registration', desc: 'Patients register at our facility or through referral. We collect comprehensive demographic and socio-economic data.' },
              { step: '02', icon: Stethoscope, title: 'Consultation & Diagnosis', desc: 'Expert cardiologists conduct thorough examinations, order diagnostics, and develop personalized treatment plans.' },
              { step: '03', icon: Pill, title: 'Treatment & Medication', desc: 'Patients receive subsidized medications and treatments. Our pharmacy ensures essential drugs are always available.' },
              { step: '04', icon: HandHeart, title: 'Financial Assistance', desc: 'For patients who cannot afford treatment, the foundation provides financial assistance for procedures and surgeries.' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
                  <span className="absolute top-4 right-4 text-4xl font-bold text-slate-100">{item.step}</span>
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg inline-flex mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900">{item.title}</h3>
                  <p className="text-sm text-slate-500 mt-2">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">How We Help Patients</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Stethoscope, title: 'Free Cardiac Consultations', desc: 'Expert cardiac consultations at no cost for patients who cannot afford private healthcare. Our doctors volunteer their time to serve the community.', color: 'bg-blue-50 text-blue-600' },
              { icon: Pill, title: 'Subsidized Medications', desc: 'Our pharmacy maintains a stock of essential cardiac medications. Patients receive medicines at heavily subsidized rates or completely free based on financial need.', color: 'bg-emerald-50 text-emerald-600' },
              { icon: FileText, title: 'Medical Records Management', desc: 'Complete digital record keeping ensures continuity of care. Patients can request their medical files anytime for follow-up treatments.', color: 'bg-amber-50 text-amber-600' },
              { icon: Shield, title: 'Surgery Sponsorship', desc: 'For patients requiring cardiac procedures or surgeries, the foundation covers a significant portion or full cost through our sponsorship program.', color: 'bg-rose-50 text-rose-600' },
              { icon: HandHeart, title: 'Emergency Financial Aid', desc: 'Immediate financial assistance for cardiac emergencies. We work with partner hospitals to ensure patients receive timely treatment.', color: 'bg-purple-50 text-purple-600' },
              { icon: Users, title: 'Follow-up Care', desc: 'Continuous monitoring and follow-up consultations to ensure patients recover well and maintain their cardiac health over the long term.', color: 'bg-teal-50 text-teal-600' },
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
    </div>
  );
}
