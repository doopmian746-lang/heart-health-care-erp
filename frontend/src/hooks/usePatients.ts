import { useState, useEffect } from 'react';
import { Patient } from '../types';
import { useAppStore } from '../store/appStore';

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

export function usePatients(search?: string) {
  const [data, setData] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useAppStore(s => s.token);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const url = search ? `${API_BASE}/patients?search=${encodeURIComponent(search)}` : `${API_BASE}/patients`;
        const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
        if (!res.ok) throw new Error('Failed to fetch');
        const patients = await res.json();
        setData(patients);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search, token]);

  return { data, loading, error };
}
