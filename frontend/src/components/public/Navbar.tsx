import { Link, useLocation } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';
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
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-1.5 bg-rose-600 rounded-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900">Heart Health Care Foundation</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <Link key={l.to} to={l.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === l.to ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                {l.label}
              </Link>
            ))}
            <Link to="/login" className="ml-3 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">
              Staff Login
            </Link>
          </div>

          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg hover:bg-slate-100">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${location.pathname === l.to ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
              {l.label}
            </Link>
          ))}
          <Link to="/login" onClick={() => setOpen(false)} className="block px-3 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg text-center mt-2">
            Staff Login
          </Link>
        </div>
      )}
    </nav>
  );
}
