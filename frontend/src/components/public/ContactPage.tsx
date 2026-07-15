import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="text-slate-400 mt-3 max-w-2xl">Get in touch with us for appointments, donations, or any inquiries</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Get in Touch</h2>
              <div className="space-y-6">
                {[
                  { icon: MapPin, title: 'Address', lines: ['Heart Health Care Foundation', 'Chiniot, Punjab, Pakistan'] },
                  { icon: Phone, title: 'Phone', lines: ['+92-XXX-XXXXXXX', '+92-YYY-YYYYYYY'] },
                  { icon: Mail, title: 'Email', lines: ['info@heartfoundation.org', 'donate@heartfoundation.org'] },
                  { icon: Clock, title: 'Working Hours', lines: ['Monday - Saturday: 9:00 AM - 5:00 PM', 'Sunday: Closed (Emergency Only)'] },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-start gap-4">
                      <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                        {item.lines.map((line, j) => (
                          <p key={j} className="text-sm text-slate-500">{line}</p>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm mb-3">For Emergencies</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  If you or someone you know is experiencing a cardiac emergency, please call our 
                  emergency line immediately or visit the nearest hospital emergency department.
                </p>
                <p className="text-lg font-bold text-rose-600 mt-2">+92-XXX-XXXXXXX</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Send Us a Message</h2>
              <form className="space-y-4" onSubmit={e => { e.preventDefault(); alert('Thank you for your message! We will get back to you soon.'); }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Your Name *</label>
                    <input required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Email *</label>
                    <input type="email" required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Phone</label>
                  <input className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Subject *</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>General Inquiry</option>
                    <option>Appointment Request</option>
                    <option>Donation</option>
                    <option>Volunteer</option>
                    <option>Medical Records</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Message *</label>
                  <textarea required rows={5} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
