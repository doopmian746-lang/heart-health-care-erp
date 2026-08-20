import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';
import { useState } from 'react';
import { LogoMark } from './Logo';

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/team', label: 'Our Team' },
    { to: '/donations', label: 'Donate', highlight: true },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="bg-white border-b border-[#0B2A4A]/10 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <LogoMark className="w-9 h-9" />
            <div className="leading-none">
              <span className="font-bold text-sm text-[#0B2A4A] block tracking-tight">Healing Hearts</span>
              <span className="text-[8px] text-[#D71920] font-bold uppercase tracking-[0.25em]">Foundation</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-0.5">
            {links.map(l => (
              l.highlight ? (
                <Link key={l.to} to={l.to}
                  className="ml-2 px-5 py-2 bg-[#D71920] text-white text-sm font-semibold rounded-lg hover:bg-[#b8141a] transition-all duration-300 shadow-md shadow-[#D71920]/20 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5" /> {l.label}
                </Link>
              ) : (
                <Link key={l.to} to={l.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === l.to ? 'bg-[#0B2A4A]/5 text-[#0B2A4A]' : 'text-[#475569] hover:bg-[#F7F9FC] hover:text-[#0B2A4A]'}`}>
                  {l.label}
                </Link>
              )
            ))}
            <Link to="/login" className="ml-3 px-4 py-2 bg-[#0B2A4A] text-white text-sm font-medium rounded-lg hover:bg-[#091f38] transition-colors">
              Staff Login
            </Link>
          </div>

          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg hover:bg-[#F7F9FC]">
            {open ? <X className="w-5 h-5 text-[#0B2A4A]" /> : <Menu className="w-5 h-5 text-[#0B2A4A]" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-[#0B2A4A]/10 bg-white px-4 py-3 space-y-1 shadow-lg">
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${l.highlight ? 'bg-[#D71920] text-white text-center mt-2' : location.pathname === l.to ? 'bg-[#0B2A4A]/5 text-[#0B2A4A]' : 'text-[#475569] hover:bg-[#F7F9FC]'}`}>
              {l.label}
            </Link>
          ))}
          <Link to="/login" onClick={() => setOpen(false)} className="block px-3 py-2.5 bg-[#0B2A4A] text-white text-sm font-medium rounded-lg text-center mt-2">
            Staff Login
          </Link>
        </div>
      )}
    </nav>
  );
}
