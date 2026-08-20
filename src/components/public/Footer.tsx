import { Link } from 'react-router-dom';
import { Heart, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { LogoMark } from './Logo';

export default function PublicFooter() {
  return (
    <footer className="bg-[#0B2A4A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <LogoMark className="w-10 h-10" />
              <div className="leading-none">
                <span className="font-bold text-base text-white block tracking-tight">Healing Hearts</span>
                <span className="text-[8px] text-[#D71920] font-bold uppercase tracking-[0.25em]">Foundation</span>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mt-3">
              Dedicated to providing quality cardiac healthcare to underserved communities. Every patient deserves access to life-saving heart treatment regardless of their financial circumstances.
            </p>
            <p className="text-xs text-[#D71920] font-semibold mt-3">Every Heart Matters. Every Life Matters.</p>
            <div className="flex items-center gap-3 mt-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#D71920] transition-colors duration-300">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About Us' },
                { href: '/about', label: 'Our Mission' },
                { href: '/about', label: 'Our Services' },
                { href: '/about', label: 'Our Vision' },
                { href: '/about', label: 'Our Values' },
              ].map((l, i) => (
                <li key={i}><a href={l.href} className="hover:text-[#D71920] transition-colors duration-300">{l.label}</a></li>
              ))}
            </ul>
          </div>

          {/* How We Help */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4 uppercase tracking-wider">How We Help</h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              {[
                'Free Consultations',
                'Diagnostic Services',
                'Essential Medications',
                'Lifesaving Interventions',
                'Rehabilitation Support',
                'Financial Assistance',
              ].map((l, i) => (
                <li key={i}><a href="/about" className="hover:text-[#D71920] transition-colors duration-300">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4 uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D71920] mt-0.5 flex-shrink-0" />
                <span>Chiniot, Punjab, Pakistan</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#D71920] mt-0.5 flex-shrink-0" />
                <span>+92-XXX-XXXXXXX</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#D71920] mt-0.5 flex-shrink-0" />
                <span>info@healinghearts.org</span>
              </li>
            </ul>
            <Link to="/donations" className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-[#D71920] text-white text-sm font-semibold rounded-lg hover:bg-[#b8141a] transition-colors shadow-md shadow-[#D71920]/20">
              <Heart className="w-3.5 h-3.5" /> Donate Now
            </Link>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Healing Hearts Foundation. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs text-slate-400">
            <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-[#D71920]" /> WE CARE</span>
            <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-[#D71920]" /> WE TREAT</span>
            <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-[#D71920]" /> WE SUPPORT</span>
            <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-[#D71920]" /> WE SAVE LIVES</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
