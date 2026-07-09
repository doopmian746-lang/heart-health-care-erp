import { create } from 'zustand';
import { User, Patient, Consultation, FoundationAssistance, InventoryItem, MedicineIssue, DashboardStats } from '../types';

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

function loadAuth(): { user: User | null; token: string | null } {
  try {
    const raw = localStorage.getItem('hhcf_user');
    const token = localStorage.getItem('hhcf_token');
    return { user: raw ? JSON.parse(raw) : null, token };
  } catch {
    return { user: null, token: null };
  }
}

const init = loadAuth();

interface AppState {
  currentUser: User | null;
  token: string | null;
  patients: Patient[];
  consultations: Consultation[];
  assistanceRequests: FoundationAssistance[];
  inventory: InventoryItem[];
  medicineIssues: MedicineIssue[];
  dashboardStats: DashboardStats | null;
  activePatientId: string | null;
  activePatient: Patient | null;
  lowStockCount: number;
  pendingRequestCount: number;

  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  fetchAllData: () => Promise<void>;
  fetchActivePatient: (id: string) => Promise<void>;
  setActivePatientId: (id: string | null) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: init.user,
  token: init.token,
  patients: [],
  consultations: [],
  assistanceRequests: [],
  inventory: [],
  medicineIssues: [],
  dashboardStats: null,
  activePatientId: null,
  activePatient: null,
  lowStockCount: 0,
  pendingRequestCount: 0,

  login: async (username: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Login failed' }));
      throw new Error(err.error);
    }
    const data = await res.json();
    localStorage.setItem('hhcf_user', JSON.stringify(data.user));
    localStorage.setItem('hhcf_token', data.token);
    set({ currentUser: data.user, token: data.token });
  },

  logout: () => {
    localStorage.removeItem('hhcf_user');
    localStorage.removeItem('hhcf_token');
    set({
      currentUser: null,
      token: null,
      patients: [],
      consultations: [],
      assistanceRequests: [],
      inventory: [],
      medicineIssues: [],
      activePatientId: null,
      activePatient: null,
    });
  },

  fetchAllData: async () => {
    const token = get().token;
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [resPatients, resInventory, resAssistance] = await Promise.all([
        fetch(`${API_BASE}/patients`, { headers }),
        fetch(`${API_BASE}/inventory`, { headers }),
        fetch(`${API_BASE}/assistance`, { headers }),
      ]);

      if (!resPatients.ok || !resInventory.ok || !resAssistance.ok) {
        if (resPatients.status === 401 || resInventory.status === 401 || resAssistance.status === 401) {
          get().logout();
          return;
        }
      }

      const patients: Patient[] = resPatients.ok ? await resPatients.json() : [];
      const inventory: InventoryItem[] = resInventory.ok ? await resInventory.json() : [];
      const assistance: FoundationAssistance[] = resAssistance.ok ? await resAssistance.json() : [];

      const detailResults = await Promise.all(
        patients.slice(0, 50).map(async (pat) => {
          try {
            const detailRes = await fetch(`${API_BASE}/patients/${pat.id}`, { headers });
            if (detailRes.ok) return (await detailRes.json()).consultations;
          } catch { /* skip */ }
          return [];
        })
      );
      const consultations: Consultation[] = detailResults.flat();

      set({
        patients,
        inventory,
        assistanceRequests: assistance,
        consultations,
        lowStockCount: inventory.filter(i => i.quantityAvailable <= i.minimumStockLevel).length,
        pendingRequestCount: assistance.filter(r => r.status === 'Pending').length,
      });
    } catch (err) {
      console.error('Failed to fetch data', err);
    }
  },

  fetchActivePatient: async (id: string) => {
    const token = get().token;
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/patients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        set({ activePatient: data.patient });
      }
    } catch (err) {
      console.error(err);
    }
  },

  setActivePatientId: (id: string | null) => {
    set({ activePatientId: id });
    if (id) get().fetchActivePatient(id);
    else set({ activePatient: null });
  },
}));
