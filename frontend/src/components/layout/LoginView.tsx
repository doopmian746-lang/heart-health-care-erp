import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartPulse, ShieldAlert, UserCheck, Lock, LogIn, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

export default function LoginView() {
  const navigate = useNavigate();
  const login = useAppStore(s => s.login);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onLoginSuccess = () => {
    navigate('/app/dashboard');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) { setError('Please fill in both fields.'); return; }
    setIsLoading(true); setError('');
    try {
      await login(username, password);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally { setIsLoading(false); }
  };

  const handleShortcut = async (usr: string) => {
    setIsLoading(true); setError('');
    try {
      await login(usr, 'admin123');
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 overflow-hidden relative">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-950/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl relative z-10 m-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3.5 bg-rose-500/10 text-rose-500 rounded-2xl border border-rose-500/20 mb-4">
            <HeartPulse className="w-8 h-8 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Heart Health Care Foundation</h1>
          <p className="text-sm text-slate-400 mt-1.5">ERP — Patient Management System</p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs rounded-lg flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">Username</label>
            <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500"><UserCheck className="w-4 h-4" /></span>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                placeholder="e.g. admin" disabled={isLoading}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500"><Lock className="w-4 h-4" /></span>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" disabled={isLoading}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
            </div>
          </div>
          <button type="submit" disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 rounded-xl text-white font-medium text-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-blue-900/40">
            {isLoading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>Verifying...</span> : <><LogIn className="w-4 h-4" /> Sign In to ERP</>}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/60">
          <p className="text-center text-[10px] text-slate-500 mb-3 flex items-center justify-center gap-1"><Sparkles className="w-3 h-3 text-amber-400" /> Quick Access</p>
          <div className="grid grid-cols-2 gap-2">
            {['admin', 'doctor', 'receptionist', 'pharmacy'].map(role => (
              <button key={role} onClick={() => handleShortcut(role)}
                className="py-2 px-3 bg-slate-950 hover:bg-slate-800/60 text-xs text-left text-slate-300 rounded-xl border border-slate-800 hover:border-slate-700 transition-all cursor-pointer capitalize">
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
