import { Heart } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-rose-600 rounded-lg">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white">Heart Health Care Foundation</span>
            </div>
            <p className="text-sm leading-relaxed max-w-md">
              Dedicated to providing quality cardiac healthcare to underserved communities. 
              Every patient deserves access to life-saving heart treatment regardless of their 
              financial circumstances.
            </p>
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
              <li>info@heartfoundation.org</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} Heart Health Care Foundation. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
