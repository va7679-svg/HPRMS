import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHospital } from '../../context/HospitalContext';
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  BedDouble,
  Microscope,
  Pill,
  ShieldAlert,
  Settings,
  Sparkles,
  HeartPulse,
  Cpu,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  onOpenAiAssistant: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenAiAssistant }) => {
  const { currentUser, logout, allRoles } = useAuth();
  const {
    activeView,
    setActiveView,
    patients,
    labOrders,
    prescriptions,
    appointments,
    admissions,
  } = useHospital();

  const pendingLabsCount = labOrders.filter((l) => l.status !== 'Verified' && l.status !== 'Cancelled').length;
  const pendingPrescriptionsCount = prescriptions.flatMap((p) => p.items).filter((i) => i.dispensedStatus === 'Pending').length;
  const currentInpatientsCount = admissions.filter((a) => a.status === 'Admitted').length;
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayAppointmentsCount = appointments.filter(
    (a) => a.dateTime.startsWith(todayDateStr) && a.status !== 'Cancelled'
  ).length;

  const isPatient = currentUser.role === 'patient';

  const initials = currentUser.name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const coreNavItems = [
    {
      id: 'dashboard',
      label: isPatient ? 'Doctor Dashboard' : 'Doctor Dashboard',
      icon: LayoutDashboard,
      badge: null,
      visible: true,
    },
    {
      id: 'patients',
      label: 'Patient Records',
      icon: Users,
      badge: patients.length,
      visible: !isPatient,
    },
    {
      id: 'emr',
      label: isPatient ? 'My Health Chart' : 'EMR Digital Charts',
      icon: FileText,
      badge: null,
      visible: true,
    },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: Calendar,
      badge: todayAppointmentsCount > 0 ? `${todayAppointmentsCount} today` : null,
      visible: true,
    },
    {
      id: 'inpatient',
      label: 'Inpatient Wards',
      icon: BedDouble,
      badge: currentInpatientsCount > 0 ? `${currentInpatientsCount} admitted` : null,
      visible: !isPatient,
    },
    {
      id: 'pharmacy',
      label: 'E-Prescriptions',
      icon: Pill,
      badge: !isPatient && pendingPrescriptionsCount > 0 ? `${pendingPrescriptionsCount}` : null,
      visible: true,
    },
  ];

  const diagnosticNavItems = [
    {
      id: 'innovations',
      label: 'Innovations & Arch',
      icon: Cpu,
      badge: 'Next-Gen',
      visible: true,
    },
    {
      id: 'laboratory',
      label: 'Laboratory Results',
      icon: Microscope,
      badge: !isPatient && pendingLabsCount > 0 ? `${pendingLabsCount}` : null,
      visible: true,
    },
    {
      id: 'audit_logs',
      label: 'Audit & Compliance',
      icon: ShieldAlert,
      badge: null,
      visible: currentUser.role === 'super_admin',
    },
    {
      id: 'settings',
      label: 'Hospital Settings',
      icon: Settings,
      badge: null,
      visible: currentUser.role === 'super_admin',
    },
  ];

  const currentPortalDef = allRoles.find((r) => r.role === currentUser.role);

  return (
    <aside className="w-64 bg-[#0f172a] text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] border-r border-slate-800">
      
      {/* Active Portal Header Banner */}
      <div className="px-4 py-3 bg-[#0a101f] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
            {currentPortalDef?.title || 'Hospital Portal'}
          </span>
        </div>
        {currentUser.isGoogleAuth && (
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-400/30">
            Google SSO
          </span>
        )}
      </div>

      {/* Navigation section */}
      <nav className="flex-1 py-4 overflow-y-auto space-y-4">
        
        {/* Core Modules Group */}
        <div>
          <div className="px-5 mb-2 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            Core Modules
          </div>
          <div className="space-y-0.5">
            {coreNavItems
              .filter((item) => item.visible)
              .map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`w-full flex items-center justify-between px-5 py-2.5 text-xs transition-colors cursor-pointer text-left ${
                      isActive
                        ? 'bg-blue-600/10 border-l-4 border-blue-500 text-blue-400 font-semibold'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge !== null && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold transition ${
                          isActive
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>
        </div>

        {/* Diagnostics & Operations Group */}
        <div>
          <div className="px-5 mb-2 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            Diagnostics & Admin
          </div>
          <div className="space-y-0.5">
            {diagnosticNavItems
              .filter((item) => item.visible)
              .map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`w-full flex items-center justify-between px-5 py-2.5 text-xs transition-colors cursor-pointer text-left ${
                      isActive
                        ? 'bg-blue-600/10 border-l-4 border-blue-500 text-blue-400 font-semibold'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge !== null && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold transition ${
                          isActive
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>
        </div>

        {/* Dr.AI Clinical Copilot Card in Sidebar */}
        {!isPatient && (
          <div className="px-3 pt-2">
            <div className="p-3 rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/80 text-slate-300 shadow-md">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-xs font-black text-white tracking-tight">Dr.AI Copilot</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-mono font-bold border border-blue-400/30">
                  v3.8 Flash
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mb-2.5 leading-tight">
                Drug-drug checks, SOAP note drafting & differential diagnoses.
              </p>
              <button
                onClick={onOpenAiAssistant}
                className="w-full py-1.5 px-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
              >
                <HeartPulse className="w-3.5 h-3.5 text-blue-200" />
                <span>Consult Dr.AI</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* User profile footer card */}
      <div className="p-4 border-t border-slate-700/50 bg-[#0b1120] space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-700 border-2 border-slate-500 overflow-hidden shrink-0">
            {currentUser.isGoogleAuth ? (
              <div className="w-full h-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                {initials}
              </div>
            ) : (
              <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                {initials}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate flex items-center gap-1">
              <span>{currentUser.name}</span>
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {currentUser.specialty || currentUser.department || currentUser.role.replace('_', ' ').toUpperCase()}
            </p>
          </div>
        </div>

        {/* Switch Portal / Sign Out Button in Sidebar */}
        <button
          onClick={logout}
          className="w-full py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 border border-slate-700 hover:border-rose-800/60 text-slate-400 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Switch Portal / Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
