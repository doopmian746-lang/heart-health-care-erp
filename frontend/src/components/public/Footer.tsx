import { Heart } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="bg-[#1e3a5f] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#c41e3a] rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div className="leading-none">
                <span className="font-bold text-sm text-white block">Healing Hearts</span>
                <span className="text-[8px] text-[#c41e3a] font-semibold uppercase tracking-[0.2em]">Foundation</span>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed max-w-md">
              Dedicated to providing quality cardiac healthcare to underserved communities.
              Every patient deserves access to life-saving heart treatment regardless of their
              financial circumstances.
            </p>
            <p className="text-xs text-[#c41e3a] font-medium mt-3">Every Heart Matters. Every Life Matters.</p>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/team" className="hover:text-white transition-colors">Our Team</a></li>
              <li><a href="/donations" className="hover:text-white transition-colors">Donations</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>Chiniot, Punjab, Pakistan</li>
              <li>+92-XXX-XXXXXXX</li>
              <li>info@healinghearts.org</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Healing Hearts Foundation. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-[#c41e3a]" /> WE CARE</span>
            <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-[#c41e3a]" /> WE TREAT</span>
            <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-[#c41e3a]" /> WE SUPPORT</span>
            <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-[#c41e3a]" /> WE SAVE LIVES</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
