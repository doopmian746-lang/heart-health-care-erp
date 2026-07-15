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

import PublicNavbar from './components/public/Navbar';
import PublicFooter from './components/public/Footer';
import HomePage from './components/public/HomePage';
import AboutPage from './components/public/AboutPage';
import TeamPage from './components/public/TeamPage';
import DonationsPage from './components/public/DonationsPage';
import ContactPage from './components/public/ContactPage';

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />
      <div className="flex-1">{children}</div>
      <PublicFooter />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/login" element={<LoginView />} />
        <Route path="/app/*" element={<ProtectedRoute><AppLayout /></ProtectedRoute>} />

        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
        <Route path="/team" element={<PublicLayout><TeamPage /></PublicLayout>} />
        <Route path="/donations" element={<PublicLayout><DonationsPage /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />

        <Route path="*" element={<Navigate to="/" replace />} />
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
