import React, { useState, useEffect } from 'react';
import { useAuth, ROLE_DEFINITIONS } from '../../context/AuthContext';
import { useHospital } from '../../context/HospitalContext';
import {
  ShieldCheck,
  Lock,
  Search,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Bell,
  LogOut,
} from 'lucide-react';
import { UserRole } from '../../types';

interface HeaderProps {
  onOpenAiAssistant: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAiAssistant }) => {
  const { currentUser, switchRole, lockSession, sessionRemainingSeconds, isLocked, logout } = useAuth();
  const { patients, setSelectedPatientId, setActiveView, resetToSampleData, labOrders } = useHospital();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const statLabsCount = labOrders.filter(
    (l) => (l.priority === 'STAT (Emergency)' || l.priority === 'Urgent') && l.status !== 'Verified'
  ).length;

  const filteredPatients = searchQuery.trim()
    ? patients.filter(
        (p) =>
          p.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.phone.includes(searchQuery)
      )
    : [];

  const handleSelectPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    setActiveView('emr');
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'doctor':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'nurse':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'receptionist':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'lab_tech':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'pharmacist':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'patient':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const formattedDate = currentTime
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    .toUpperCase();
  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs text-slate-800 shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Hospital Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-300 shadow-3d-sm bg-slate-900 flex items-center justify-center shrink-0 p-0.5">
              <img
                src="/srm_symbol.svg"
                alt="SRM Symbol"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-slate-900">SRM Medical Record System</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                  SRM-HPRMS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">SRM Institute of Science and Technology • Medical Center</p>
            </div>
          </div>

          {/* Quick Search in High Density style */}
          <div className="relative flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search Patient ID, Name, or Lab Case..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Live Search dropdown */}
            {showSearchResults && searchQuery.trim() && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 max-h-72 overflow-y-auto">
                <div className="p-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 bg-slate-50">
                  Patient Records Found ({filteredPatients.length})
                </div>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleSelectPatient(p.id)}
                      className="w-full text-left px-3.5 py-2.5 text-xs hover:bg-slate-50 flex items-center justify-between border-b border-slate-100 last:border-0 transition cursor-pointer"
                    >
                      <div>
                        <div className="font-bold text-slate-800">
                          {p.firstName} {p.lastName}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          MRN: <span className="font-mono text-blue-600 font-bold">{p.patientId}</span> • DOB: {p.dateOfBirth} • Blood: <strong className="text-rose-600">{p.bloodGroup}</strong>
                        </div>
                      </div>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                          p.status === 'Inpatient'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {p.status}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No matching patient record found for "{searchQuery}".
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Tools & High Density Metadata */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            
            {/* Live Date / Time Stamp */}
            <div className="hidden lg:flex flex-col items-end text-right">
              <p className="text-xs font-bold text-slate-600 leading-tight">{formattedDate}</p>
              <p className="text-[11px] text-slate-400 font-mono leading-tight">{formattedTime}</p>
            </div>

            <div className="hidden lg:block w-px h-7 bg-slate-200"></div>

            {/* Notification Bell with alert dot */}
            <div
              onClick={() => setActiveView('laboratory')}
              className="relative cursor-pointer p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition"
              title="STAT Alerts & Notifications"
            >
              {statLabsCount > 0 && (
                <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
              )}
              <Bell className="w-4 h-4" />
            </div>

            {/* Secure Session Pill */}
            <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-bold border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>SECURE SESSION</span>
            </div>

            {/* Dr.AI Clinical Assistant Trigger */}
            <button
              onClick={onOpenAiAssistant}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 border border-blue-200 text-xs font-bold transition shadow-xs cursor-pointer"
              title="Open Dr.AI Clinical Decision Support (Gemini 3.8 Flash)"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              <span>Dr.AI</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-blue-600 text-white font-mono font-bold hidden sm:inline">
                v3.8
              </span>
            </button>

            {/* Google SSO Active Indicator if logged in via Google */}
            {currentUser.isGoogleAuth && (
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 shadow-2xs font-medium">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="font-mono text-[11px] truncate max-w-[130px]" title={currentUser.googleEmail || currentUser.email}>
                  {currentUser.googleEmail || currentUser.email}
                </span>
              </div>
            )}

            {/* Role Portal Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition shadow-2xs cursor-pointer ${getRoleBadgeColor(
                  currentUser.role
                )}`}
              >
                <span>{ROLE_DEFINITIONS.find((r) => r.role === currentUser.role)?.title}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
                  <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">Switch Active Role Portal</div>
                      <div className="text-[10px] text-slate-400">Test different role portals & workflows</div>
                    </div>
                  </div>
                  <div className="p-1.5 max-h-80 overflow-y-auto space-y-1">
                    {ROLE_DEFINITIONS.map((def) => {
                      const isSelected = def.role === currentUser.role;
                      return (
                        <button
                          key={def.role}
                          onClick={() => {
                            switchRole(def.role);
                            setShowRoleDropdown(false);
                            // Set primary view based on role
                            if (def.role === 'nurse') setActiveView('inpatient');
                            else if (def.role === 'lab_tech') setActiveView('laboratory');
                            else if (def.role === 'pharmacist') setActiveView('pharmacy');
                            else if (def.role === 'receptionist') setActiveView('appointments');
                            else if (def.role === 'patient') setActiveView('emr');
                            else if (def.role === 'doctor') setActiveView('patients');
                            else setActiveView('dashboard');
                          }}
                          className={`w-full text-left p-2 rounded-lg text-xs transition flex items-start gap-2.5 cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50 text-blue-800 border border-blue-200 font-semibold'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <div className="mt-0.5">
                            {isSelected ? (
                              <CheckCircle2 className="w-4 h-4 text-blue-600" />
                            ) : (
                              <UserCheck className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800">{def.title}</div>
                            <div className="text-[11px] text-slate-400 leading-tight">{def.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Switch Portal / Sign Out Button */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition cursor-pointer"
              title="Exit Portal & Return to Role Gateway / Sign Out"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">Switch Portal</span>
            </button>

            {/* Session Timer & Security Lock */}
            <div className="hidden xl:flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 text-xs text-slate-600 font-mono font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatSeconds(sessionRemainingSeconds)}</span>
              <button
                onClick={lockSession}
                className="hover:text-amber-600 ml-1 transition cursor-pointer"
                title="Lock workstation session"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Reset sample data */}
            <button
              onClick={() => setShowResetConfirm(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              title="Reset to Sample Hospital Dataset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Data Reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-md w-full shadow-2xl text-slate-800">
            <div className="flex items-center gap-3 text-amber-600 mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-slate-900">Reset Hospital Database?</h3>
            </div>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              This will restore all patient records, vitals, admissions, prescriptions, lab results, and appointments to the initial standard hospital demo dataset.
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-lg transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetToSampleData();
                  setShowResetConfirm(false);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition shadow-xs cursor-pointer"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
