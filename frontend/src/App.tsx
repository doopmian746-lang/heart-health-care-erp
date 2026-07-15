import { BrowserRouter, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import ProtectedRoute from './components/layout/ProtectedRoute';
import LoginView from './components/layout/LoginView';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/dashboard/Dashboard';
import PatientManager from './components/patients/PatientManager';
import PatientDetail from './components/patients/PatientDetail';
import ConsultationList from './components/consultations/ConsultationList';
import PrescriptionList from './components/prescriptions/PrescriptionList';
import PharmacyInventory from './components/pharmacy/PharmacyInventory';
import AssistanceWorkflow from './components/assistance/AssistanceWorkflow';
import FileRequestList from './components/file-requests/FileRequestList';
import ReportsAnalytics from './components/reports/ReportsAnalytics';
import DonorSponsorships from './components/sponsors/DonorSponsorships';
import AuditLogs from './components/audit-logs/AuditLogs';
import SystemStaff from './components/users/SystemStaff';

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
            <Route path="consultations" element={<ConsultationList />} />
            <Route path="prescriptions" element={<PrescriptionList />} />
            <Route path="pharmacy" element={<PharmacyInventory />} />
            <Route path="assistance" element={<AssistanceWorkflow />} />
            <Route path="file-requests" element={<FileRequestList />} />
            <Route path="reports" element={<ReportsAnalytics />} />
            <Route path="sponsors" element={<DonorSponsorships />} />
            <Route path="audit-logs" element={<AuditLogs />} />
            <Route path="users" element={<SystemStaff />} />
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
