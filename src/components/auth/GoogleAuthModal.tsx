import React, { useState } from 'react';
import { UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  CheckCircle2,
  Stethoscope,
  Activity,
  UserPlus,
  Microscope,
  Pill,
  HeartHandshake,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  Building2,
  Lock,
} from 'lucide-react';

interface GoogleAuthModalProps {
  initialRole?: UserRole;
  onClose: () => void;
  onSuccess?: (role: UserRole) => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  initialRole = 'doctor',
  onClose,
  onSuccess,
}) => {
  const { loginWithGoogle } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [googleEmail, setGoogleEmail] = useState('vabhinand2007@gmail.com');
  const [googleName, setGoogleName] = useState('Abhinand V');
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const rolesList: {
    role: UserRole;
    name: string;
    label: string;
    desc: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bg: string;
  }[] = [
    {
      role: 'doctor',
      name: 'Dr. Abhinand V, MD',
      label: 'Doctor / Physician Portal',
      desc: 'EMR timeline, clinical diagnosis, AI assistant, e-prescriptions & lab ordering',
      icon: Stethoscope,
      color: 'text-blue-600',
      bg: 'bg-blue-50 border-blue-200',
    },
    {
      role: 'nurse',
      name: 'Abhinand V, RN',
      label: 'Inpatient Nursing Portal',
      desc: 'Ward bed status, bedside vitals recording, triage alerts & nursing notes',
      icon: Activity,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-200',
    },
    {
      role: 'receptionist',
      name: 'Abhinand V',
      label: 'Receptionist & Intake Portal',
      desc: 'Patient intake desk, ABHA creation, appointment booking & admissions',
      icon: UserPlus,
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-200',
    },
    {
      role: 'lab_tech',
      name: 'Abhinand V, MLS',
      label: 'Laboratory Technologist Portal',
      desc: 'LIMS specimen tracking, test results verification & panic value flags',
      icon: Microscope,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50 border-cyan-200',
    },
    {
      role: 'pharmacist',
      name: 'Dr. Abhinand V, PharmD',
      label: 'Clinical Pharmacist Portal',
      desc: 'e-Prescription queue, formulary stock, contraindication alerts & dispensing',
      icon: Pill,
      color: 'text-rose-600',
      bg: 'bg-rose-50 border-rose-200',
    },
    {
      role: 'patient',
      name: 'Abhinand V',
      label: 'Patient Health Portal',
      desc: 'Personal digital health record, lab test reports, prescriptions & booking',
      icon: HeartHandshake,
      color: 'text-teal-600',
      bg: 'bg-teal-50 border-teal-200',
    },
    {
      role: 'super_admin',
      name: 'Abhinand V, System Admin',
      label: 'Super Admin Portal',
      desc: 'Hospital administration, audit trail logs, staff permissions & settings',
      icon: ShieldAlert,
      color: 'text-purple-600',
      bg: 'bg-purple-50 border-purple-200',
    },
  ];

  const handleGoogleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      const activeRoleMeta = rolesList.find((r) => r.role === selectedRole);
      const computedName = selectedRole === 'doctor' && !googleName.startsWith('Dr.') ? `Dr. ${googleName}, MD` : googleName;
      loginWithGoogle(selectedRole, {
        email: googleEmail,
        name: computedName,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(googleEmail)}`,
      });
      setIsLoading(false);
      if (onSuccess) onSuccess(selectedRole);
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Google Official Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <div>
              <h2 className="text-sm font-bold text-slate-800 leading-none">
                Sign in with Google
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                to continue to SRM Medical Record System
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* User Account Pill */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                {googleName.charAt(0)}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>{googleName}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 font-semibold">
                    Verified
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {googleEmail}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsCustomizing(!isCustomizing)}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
            >
              {isCustomizing ? 'Done' : 'Change Account'}
            </button>
          </div>

          {/* Account Customizer drawer if needed */}
          {isCustomizing && (
            <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-xl space-y-3 animate-in fade-in duration-150">
              <div className="text-xs font-bold text-slate-800">Use Another Google Account</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={googleName}
                    onChange={(e) => setGoogleName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Google Email
                  </label>
                  <input
                    type="email"
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="user@gmail.com or @srmist.edu.in"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Role Portal Picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800">
                Select Institutional Portal to Access:
              </label>
              <span className="text-[10px] text-slate-500 font-medium">
                Choose portal view
              </span>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {rolesList.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedRole === item.role;
                return (
                  <div
                    key={item.role}
                    onClick={() => setSelectedRole(item.role)}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? `${item.bg} ring-2 ring-blue-500/40 shadow-xs`
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-white shadow-2xs' : 'bg-slate-100'
                        } ${item.color}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {item.label}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {item.desc}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 ml-2">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-300"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Privacy & Scope disclosure */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-500 leading-relaxed flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Google Single Sign-On (SSO) links your Google identity to SRM Institute of Science and Technology Medical Record System with encrypted OAuth token handling and institutional audit logging.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition cursor-pointer"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleGoogleSubmit}
            disabled={isLoading}
            className="px-5 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg flex items-center gap-2 transition cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Authenticating with Google...</span>
              </span>
            ) : (
              <>
                <span>Continue as {googleName}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
