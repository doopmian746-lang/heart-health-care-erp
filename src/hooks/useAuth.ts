import { useAppStore } from '../store/appStore';

export function useAuth() {
  const currentUser = useAppStore(s => s.currentUser);
  const token = useAppStore(s => s.token);
  const login = useAppStore(s => s.login);
  const logout = useAppStore(s => s.logout);
  const fetchAllData = useAppStore(s => s.fetchAllData);

  return { currentUser, token, login, logout, isAuthenticated: !!token, fetchAllData };
}
