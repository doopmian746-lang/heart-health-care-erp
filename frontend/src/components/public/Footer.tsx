import { Heart } from 'lucide-react';
import { LogoMark } from './Logo';

export default function PublicFooter() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <LogoMark className="w-9 h-9" />
              <div className="leading-tight">
                <span className="font-bold text-base text-white block">Healing Hearts</span>
                <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-widest">Foundation</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-md">
              Dedicated to providing quality cardiac healthcare to underserved communities.
              Every patient deserves access to life-saving heart treatment regardless of their
              financial circumstances. Every Heart Matters. Every Life Matters.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-500" /> WE CARE
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-500" /> WE TREAT
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-500" /> WE SUPPORT
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-500" /> WE SAVE LIVES
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/team" className="hover:text-white transition-colors">Our Team</a></li>
              <li><a href="/donations" className="hover:text-white transition-colors">Donations</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>Chiniot, Punjab, Pakistan</li>
              <li>+92-XXX-XXXXXXX</li>
              <li>info@healinghearts.org</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Healing Hearts Foundation. All rights reserved.
          </p>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <Heart className="w-3 h-3 text-rose-500" /> Every Heart Matters. Every Life Matters.
          </p>
        </div>
      </div>
    </footer>
  );
}
