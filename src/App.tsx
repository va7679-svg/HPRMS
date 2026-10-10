import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HospitalProvider, useHospital } from './context/HospitalContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { PatientList } from './components/patients/PatientList';
import { EMRDetailView } from './components/patients/EMRDetailView';
import { AppointmentManager } from './components/appointments/AppointmentManager';
import { BedManagementView } from './components/inpatient/BedManagementView';
import { LabManagementView } from './components/laboratory/LabManagementView';
import { PharmacyManagementView } from './components/pharmacy/PharmacyManagementView';
import { AuditLogsView } from './components/security/AuditLogsView';
import { HospitalSettingsView } from './components/admin/HospitalSettingsView';
import { SystemInnovationsHub } from './components/innovations/SystemInnovationsHub';
import { LockScreenModal } from './components/security/LockScreenModal';
import { ClinicalAssistantModal } from './components/clinical-ai/ClinicalAssistantModal';
import { RolePortalSignIn } from './components/auth/RolePortalSignIn';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AlertTriangle, Sparkles } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeView } = useHospital();
  const { currentUser, isAuthenticated } = useAuth();
  const [emergencyAlert, setEmergencyAlert] = useState<string | null>(null);
  const [showAiModal, setShowAiModal] = useState(false);

  if (!isAuthenticated) {
    return <RolePortalSignIn />;
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      
      {/* Emergency Broadcast Banner */}
      {emergencyAlert && (
        <div className="bg-red-600 border-b border-red-700 px-4 py-2 text-xs text-white flex items-center justify-between animate-pulse shadow-3d-red shrink-0 z-50">
          <div className="flex items-center gap-2 font-bold tracking-wide">
            <AlertTriangle className="w-4 h-4 text-white" />
            <span>EMERGENCY HOSPITAL CODE ALERT: {emergencyAlert}</span>
          </div>
          {currentUser.role === 'super_admin' && (
            <button
              onClick={() => setEmergencyAlert(null)}
              className="text-[11px] underline hover:text-red-100 font-semibold cursor-pointer"
            >
              Dismiss Code
            </button>
          )}
        </div>
      )}

      {/* Main App Navigation Header */}
      <Header onOpenAiAssistant={() => setShowAiModal(true)} />

      {/* App Body Container: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Navigation Sidebar */}
        <Sidebar onOpenAiAssistant={() => setShowAiModal(true)} />

        {/* Dynamic Main Workspace View wrapped in ErrorBoundary */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#f1f5f9]">
          <div className="max-w-7xl mx-auto space-y-4">
            <ErrorBoundary viewName={activeView}>
              {activeView === 'dashboard' && <DashboardView />}
              {activeView === 'patients' && <PatientList />}
              {activeView === 'emr' && <EMRDetailView />}
              {activeView === 'appointments' && <AppointmentManager />}
              {activeView === 'inpatient' && <BedManagementView />}
              {activeView === 'laboratory' && <LabManagementView />}
              {activeView === 'pharmacy' && <PharmacyManagementView />}
              {activeView === 'audit_logs' && <AuditLogsView />}
              {activeView === 'settings' && <HospitalSettingsView />}
              {activeView === 'innovations' && <SystemInnovationsHub />}
            </ErrorBoundary>
          </div>
        </main>
      </div>

      {/* Floating Dr.AI Medical Intelligence Quick Action Button */}
      <button
        onClick={() => setShowAiModal(true)}
        className="fixed bottom-6 right-6 z-40 px-4 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl shadow-lg flex items-center gap-2.5 font-bold text-xs transition border border-blue-400/50 group cursor-pointer hover:scale-105 active:scale-95"
        title="Consult Dr.AI - Chief Medical Intelligence Copilot"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
        </span>
        <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
        <span className="tracking-wide font-black">Ask Dr.AI</span>
      </button>

      {/* Modals */}
      <LockScreenModal />
      {showAiModal && <ClinicalAssistantModal onClose={() => setShowAiModal(false)} />}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <HospitalProvider>
        <MainLayout />
      </HospitalProvider>
    </AuthProvider>
  );
}
