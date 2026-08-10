import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';
import { useState } from 'react';

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/team', label: 'Our Team' },
    { to: '/donations', label: 'Donations' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="bg-white border-b border-[#e5e7eb] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#c41e3a] rounded-full flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <div className="leading-none">
              <span className="font-bold text-sm text-[#1e3a5f] block">Healing Hearts</span>
              <span className="text-[8px] text-[#c41e3a] font-semibold uppercase tracking-[0.2em]">Foundation</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-0.5">
            {links.map(l => (
              <Link key={l.to} to={l.to}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === l.to ? 'bg-[#c41e3a]/10 text-[#c41e3a]' : 'text-[#475569] hover:bg-[#f1f5f9] hover:text-[#1e3a5f]'}`}>
                {l.label}
              </Link>
            ))}
            <Link to="/login" className="ml-3 px-4 py-2 bg-[#1e3a5f] text-white text-sm font-medium rounded-lg hover:bg-[#152d4a] transition-colors">
              Staff Login
            </Link>
          </div>

          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg hover:bg-[#f1f5f9]">
            {open ? <X className="w-5 h-5 text-[#1e3a5f]" /> : <Menu className="w-5 h-5 text-[#1e3a5f]" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-[#e5e7eb] bg-white px-4 py-3 space-y-1">
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${location.pathname === l.to ? 'bg-[#c41e3a]/10 text-[#c41e3a]' : 'text-[#475569] hover:bg-[#f1f5f9]'}`}>
              {l.label}
            </Link>
          ))}
          <Link to="/login" onClick={() => setOpen(false)} className="block px-3 py-2 bg-[#1e3a5f] text-white text-sm font-medium rounded-lg text-center mt-2">
            Staff Login
          </Link>
        </div>
      )}
    </nav>
  );
}
