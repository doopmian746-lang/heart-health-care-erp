import { Mail, Phone, MapPin, Clock, Heart } from 'lucide-react';

export default function ContactPage() {
  return (
    <div>
      <section className="bg-[#0B2A4A] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold">Contact Us</h1>
          <p className="text-[#D71920] mt-2 font-medium">Every Heart Matters. Every Life Matters.</p>
          <p className="text-slate-300 mt-3 max-w-2xl">Get in touch with us for appointments, donations, or any inquiries.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-[#0B2A4A] mb-6">Get in Touch</h2>
              <div className="space-y-6">
                {[
                  { icon: MapPin, title: 'Address', lines: ['Healing Hearts Foundation', 'Chiniot, Punjab, Pakistan'] },
                  { icon: Phone, title: 'Phone', lines: ['+92-XXX-XXXXXXX', '+92-YYY-YYYYYYY'] },
                  { icon: Mail, title: 'Email', lines: ['info@healinghearts.org', 'donate@healinghearts.org'] },
                  { icon: Clock, title: 'Working Hours', lines: ['Monday - Saturday: 9:00 AM - 5:00 PM', 'Sunday: Closed (Emergency Only)'] },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-start gap-4">
                      <div className="p-2.5 bg-[#D71920]/10 text-[#D71920] rounded-xl shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#0B2A4A] text-sm">{item.title}</h4>
                        {item.lines.map((line, j) => (
                          <p key={j} className="text-sm text-[#475569]">{line}</p>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 p-6 bg-[#FDF2F2] rounded-2xl border border-[#D71920]/20">
                <h3 className="font-bold text-[#0B2A4A] text-sm mb-3">For Emergencies</h3>
                <p className="text-sm text-[#475569] leading-relaxed">
                  If you or someone you know is experiencing a cardiac emergency, please call our emergency line immediately or visit the nearest hospital emergency department.
                </p>
                <p className="text-lg font-bold text-[#D71920] mt-2">+92-XXX-XXXXXXX</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0B2A4A] mb-6">Send Us a Message</h2>
              <form className="space-y-4" onSubmit={e => { e.preventDefault(); alert('Thank you for your message! We will get back to you soon.'); }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#475569] mb-1">Your Name *</label>
                    <input required className="w-full px-3 py-2 border border-[#0B2A4A]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D71920]/30 focus:border-[#D71920]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#475569] mb-1">Email *</label>
                    <input type="email" required className="w-full px-3 py-2 border border-[#0B2A4A]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D71920]/30 focus:border-[#D71920]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#475569] mb-1">Phone</label>
                  <input className="w-full px-3 py-2 border border-[#0B2A4A]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D71920]/30 focus:border-[#D71920]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#475569] mb-1">Subject *</label>
                  <select className="w-full px-3 py-2 border border-[#0B2A4A]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D71920]/30 focus:border-[#D71920]">
                    <option>General Inquiry</option>
                    <option>Appointment Request</option>
                    <option>Donation</option>
                    <option>Volunteer</option>
                    <option>Medical Records</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#475569] mb-1">Message *</label>
                  <textarea required rows={5} className="w-full px-3 py-2 border border-[#0B2A4A]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D71920]/30 focus:border-[#D71920]" />
                </div>
                <button type="submit" className="px-6 py-2.5 bg-[#D71920] text-white text-sm font-semibold rounded-lg hover:bg-[#b8141a] transition-colors shadow-md shadow-[#D71920]/20 flex items-center gap-2">
                  <Heart className="w-4 h-4" /> Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
