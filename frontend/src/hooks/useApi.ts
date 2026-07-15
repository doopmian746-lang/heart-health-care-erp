import { useState, useCallback, useRef } from 'react';
import { useAppStore } from '../store/appStore';

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (body?: any) => Promise<T | null>;
}

function resolveUrl(url: string): string {
  if (url.startsWith('http')) return url;
  return `${API_BASE}${url.startsWith('/') ? url : `/${url}`}`;
}

export function useApi<T>(url: string, method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET'): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const urlRef = useRef(resolveUrl(url));
  const methodRef = useRef(method);
  urlRef.current = resolveUrl(url);
  methodRef.current = method;

  const execute = useCallback(async (body?: any): Promise<T | null> => {
    const token = useAppStore.getState().token;
    if (!token) return null;
    setLoading(true);
    setError(null);
    try {
      const options: RequestInit = {
        method: methodRef.current,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      };
      if (body && methodRef.current !== 'GET') options.body = JSON.stringify(body);

      const res = await fetch(urlRef.current, options);
      if (!res.ok) {
        if (res.status === 401) {
          useAppStore.getState().logout();
          return null;
        }
        const errData = await res.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(errData.error || errData.details?.[0]?.message || 'Request failed');
      }
      const result = await res.json();
      setData(result);
      return result;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, execute };
}
