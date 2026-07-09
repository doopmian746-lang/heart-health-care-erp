import { BrowserRouter, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import ProtectedRoute from './components/layout/ProtectedRoute';
import LoginView from './components/layout/LoginView';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/dashboard/Dashboard';
import PatientManager from './components/patients/PatientManager';
import PatientDetail from './components/patients/PatientDetail';

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/login" element={<LoginView />} />
        <Route path="/app/*" element={<ProtectedRoute><AppLayout /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/app" replace />} />
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function AppLayout() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-800 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50/60">
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="patients" element={
              <PatientManager
                onSelectPatient={(id) => navigate(`/app/patients/${id}`)}
                onCreateConsultation={() => {}}
                onRequestAssistance={() => {}}
              />
            } />
            <Route path="patients/:id" element={<PatientDetailWrapper />} />
            <Route path="consultations" element={<Placeholder title="Consultations" />} />
            <Route path="prescriptions" element={<Placeholder title="Prescriptions" />} />
            <Route path="pharmacy" element={<Placeholder title="Pharmacy Inventory" />} />
            <Route path="assistance" element={<Placeholder title="Assistance Workflow" />} />
            <Route path="file-requests" element={<Placeholder title="File Requests" />} />
            <Route path="reports" element={<Placeholder title="Reports & Analytics" />} />
            <Route path="sponsors" element={<Placeholder title="Donor Sponsorships" />} />
            <Route path="audit-logs" element={<Placeholder title="Audit Logs" />} />
            <Route path="users" element={<Placeholder title="System Staff" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function PatientDetailWrapper() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  if (!id) return null;
  return <PatientDetail patientId={id} onBack={() => navigate('/app/patients')} />;
}

function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <h2 className="text-lg font-bold text-slate-800">{title}</h2>
        <p className="text-sm text-slate-400 mt-1">Module being migrated — coming soon</p>
      </div>
    </div>
  );
}
