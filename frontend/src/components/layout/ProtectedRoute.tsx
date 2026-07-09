import { useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAppStore(s => s.token);
  const fetchAllData = useAppStore(s => s.fetchAllData);
  const fetched = useRef(false);

  useEffect(() => {
    if (token && !fetched.current) {
      fetched.current = true;
      fetchAllData();
    }
  }, [token, fetchAllData]);

  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
