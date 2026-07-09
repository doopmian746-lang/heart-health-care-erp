import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, AlertTriangle, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

export default function Header() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const lowStockCount = useAppStore(s => s.lowStockCount);
  const pendingRequestCount = useAppStore(s => s.pendingRequestCount);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/app/patients?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={handleSearch}
          placeholder="Search patients by name, ID, CNIC, or mobile..."
          className="w-full max-w-md pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
      </div>
      <div className="flex items-center gap-3">
        {lowStockCount > 0 && (
          <button onClick={() => navigate('/app/pharmacy')} className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 text-xs font-medium rounded-lg hover:bg-rose-100 cursor-pointer">
            <AlertTriangle className="w-3.5 h-3.5" /> {lowStockCount} Low Stock
          </button>
        )}
        {pendingRequestCount > 0 && (
          <button onClick={() => navigate('/app/assistance')} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-lg hover:bg-amber-100 cursor-pointer">
            <Sparkles className="w-3.5 h-3.5" /> {pendingRequestCount} Pending
          </button>
        )}
        <Bell className="w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-600" />
      </div>
    </div>
  );
}
