import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, HeartPulse, FileSpreadsheet, Pill, HandHeart, ShieldAlert, Settings, LogOut, ChevronLeft, ChevronRight, Activity, FileText, TrendingUp, Gift } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { UserRole } from '../../types';

interface MenuItem {
  id: string;
  name: string;
  icon: any;
  path: string;
  roles: UserRole[];
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', name: 'Dashboard', icon: Home, path: '/app/dashboard', roles: ['Admin', 'Doctor', 'Receptionist', 'Pharmacy Staff', 'Lab Staff'] },
  { id: 'patients', name: 'Patients Database', icon: Users, path: '/app/patients', roles: ['Admin', 'Doctor', 'Receptionist', 'Pharmacy Staff', 'Lab Staff'] },
  { id: 'consultations', name: 'Consultations', icon: HeartPulse, path: '/app/consultations', roles: ['Admin', 'Doctor', 'Receptionist'] },
  { id: 'prescriptions', name: 'Prescriptions', icon: FileSpreadsheet, path: '/app/prescriptions', roles: ['Admin', 'Doctor', 'Pharmacy Staff'] },
  { id: 'pharmacy', name: 'Pharmacy Inventory', icon: Pill, path: '/app/pharmacy', roles: ['Admin', 'Pharmacy Staff', 'Doctor'] },
  { id: 'assistance', name: 'Assistance Workflow', icon: HandHeart, path: '/app/assistance', roles: ['Admin', 'Doctor', 'Receptionist', 'Pharmacy Staff'] },
  { id: 'file-requests', name: 'File Requests', icon: FileText, path: '/app/file-requests', roles: ['Admin', 'Doctor', 'Receptionist'] },
  { id: 'reports', name: 'Reports & Analytics', icon: TrendingUp, path: '/app/reports', roles: ['Admin', 'Doctor', 'Receptionist', 'Pharmacy Staff'] },
  { id: 'sponsors', name: 'Donor Sponsorships', icon: Gift, path: '/app/sponsors', roles: ['Admin', 'Doctor', 'Receptionist', 'Pharmacy Staff'] },
  { id: 'audit-logs', name: 'Audit Logs', icon: ShieldAlert, path: '/app/audit-logs', roles: ['Admin'] },
  { id: 'users', name: 'System Staff', icon: Settings, path: '/app/users', roles: ['Admin'] },
];

export default function Sidebar() {
  const currentUser = useAppStore(s => s.currentUser);
  const logout = useAppStore(s => s.logout);
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = React.useState(false);

  if (!currentUser) return null;

  const allowedItems = menuItems.filter(item => item.roles.includes(currentUser.role as UserRole));

  return (
    <div className={`bg-slate-900 border-r border-slate-800 text-slate-100 flex flex-col justify-between transition-all duration-300 relative select-none shrink-0 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4 flex items-center justify-between border-b border-slate-800">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="p-1 px-2 bg-rose-600 rounded-lg text-white font-bold leading-none tracking-wider text-xs flex items-center">
              <Activity className="w-4 h-4 mr-1 animate-pulse" /> HHCF
            </div>
            <span className="font-bold text-sm tracking-wide text-white uppercase truncate">Heart ERP</span>
          </div>
        )}
        {collapsed && <div className="mx-auto p-1.5 bg-rose-600 rounded-lg"><Activity className="w-4 h-4 animate-pulse text-white" /></div>}
        <button onClick={() => setCollapsed(!collapsed)}
          className="absolute top-4.5 right-[-14px] bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 p-0.5 rounded-full cursor-pointer transition-all hover:scale-105 shadow z-50 flex items-center justify-center w-6 h-6">
          {collapsed ? <ChevronRight className="w-3.5 h-3.5 text-white" /> : <ChevronLeft className="w-3.5 h-3.5 text-white" />}
        </button>
      </div>

      <div className="flex-1 py-4 overflow-y-auto">
        {!collapsed && <div className="px-4 mb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Main Modules</div>}
        <nav className="space-y-1 px-2">
          {allowedItems.map(item => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button key={item.id} onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-all cursor-pointer ${isActive ? 'bg-blue-600/90 text-white shadow-md shadow-blue-900/30 font-semibold' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'}`}
                title={collapsed ? item.name : undefined}>
                <IconComponent className={`w-5 h-5 shrink-0 transition-transform ${isActive ? 'scale-105' : ''}`} />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-3 border-t border-slate-800">
        <div className="p-2 bg-slate-950/40 rounded-xl border border-slate-800/40 flex items-center gap-3.5 mb-2">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-sm text-blue-400 shrink-0 border border-slate-700">
            {currentUser.name?.charAt(0) || 'U'}
          </div>
          {!collapsed && (
            <div className="text-left truncate">
              <p className="text-xs font-semibold text-slate-200 truncate">{currentUser.name}</p>
              <p className="text-[10px] text-indigo-400 uppercase tracking-widest truncate">{currentUser.role}</p>
            </div>
          )}
        </div>
        <button onClick={logout}
          className="w-full flex items-center gap-3.5 px-3 py-2 hover:bg-rose-950/40 border border-transparent hover:border-rose-900/40 rounded-xl text-left text-sm text-rose-400 font-medium transition-all cursor-pointer">
          <LogOut className="w-5 h-5 shrink-0 text-rose-400" />
          {!collapsed && <span>Log Out</span>}
        </button>
      </div>
    </div>
  );
}
