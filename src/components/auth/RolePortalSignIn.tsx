import React, { useState } from 'react';
import { UserRole } from '../../types';
import { useAuth, ROLE_DEFINITIONS } from '../../context/AuthContext';
import { useHospital } from '../../context/HospitalContext';
import { GoogleAuthModal } from './GoogleAuthModal';
import {
  Stethoscope,
  Activity,
  UserPlus,
  Microscope,
  Pill,
  HeartHandshake,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Building2,
  Sparkles,
  Server,
  Layers,
  ChevronRight,
  UserCheck,
  Copy,
  Key,
  Eye,
  EyeOff,
} from 'lucide-react';

export const RolePortalSignIn: React.FC = () => {
  const { quickPortalLogin, login, users } = useAuth();
  const { setActiveView } = useHospital();

  const [activeTab, setActiveTab] = useState<'portals' | 'credentials'>('portals');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleTargetRole, setGoogleTargetRole] = useState<UserRole>('doctor');

  // Credentials tab state
  const [emailInput, setEmailInput] = useState('admin@stjudemeridian.org');
  const [passwordInput, setPasswordInput] = useState('hospital123');
  const [twoFactorInput, setTwoFactorInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const portalsData: {
    role: UserRole;
    title: string;
    badge: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    borderColor: string;
    bgGradient: string;
    btnColor: string;
    sampleUser: string;
    sampleTitle: string;
    username: string;
    password: string;
    email: string;
    keyFeatures: string[];
    defaultView: string;
  }[] = [
    {
      role: 'doctor',
      title: 'Doctor / Physician Portal',
      badge: 'Clinical EMR',
      icon: Stethoscope,
      accentColor: 'text-blue-600',
      borderColor: 'border-blue-200 hover:border-blue-400',
      bgGradient: 'from-blue-50/50 to-white',
      btnColor: 'bg-blue-600 hover:bg-blue-700 shadow-3d-primary',
      sampleUser: 'Dr. Marcus Vance, MD, FACC',
      sampleTitle: 'Cardiovascular Disease & Critical Care',
      username: 'doctor',
      password: 'doctorpassword',
      email: 'm.vance@stjudemeridian.org',
      keyFeatures: [
        'Longitudinal EMR digital patient charts',
        'Clinical Decision Support AI & SOAP notes',
        'e-Prescriptions with drug interaction checks',
        'STAT Diagnostic laboratory orders',
      ],
      defaultView: 'patients',
    },
    {
      role: 'nurse',
      title: 'Inpatient Nursing Portal',
      badge: 'Wards & Beds',
      icon: Activity,
      accentColor: 'text-emerald-600',
      borderColor: 'border-emerald-200 hover:border-emerald-400',
      bgGradient: 'from-emerald-50/50 to-white',
      btnColor: 'bg-emerald-600 hover:bg-emerald-700 shadow-3d',
      sampleUser: 'David Chen, BSN, RN',
      sampleTitle: 'Critical Care Registered Nurse (CCRN)',
      username: 'nurse',
      password: 'nursepassword',
      email: 'd.chen@stjudemeridian.org',
      keyFeatures: [
        'Live hospital bed & ward occupancy matrix',
        'Bedside vital signs recording & telemetry',
        'Inpatient medication administration (eMAR)',
        'Nursing shift handoff notes',
      ],
      defaultView: 'inpatient',
    },
    {
      role: 'receptionist',
      title: 'Receptionist & Intake Portal',
      badge: 'Front Desk',
      icon: UserPlus,
      accentColor: 'text-amber-600',
      borderColor: 'border-amber-200 hover:border-amber-400',
      bgGradient: 'from-amber-50/50 to-white',
      btnColor: 'bg-amber-600 hover:bg-amber-700 shadow-3d',
      sampleUser: 'Maya Al-Mansoor',
      sampleTitle: 'Patient Registration & Intake Lead',
      username: 'receptionist',
      password: 'receptionistpassword',
      email: 'm.almansoor@stjudemeridian.org',
      keyFeatures: [
        'Quick patient intake with photo capture',
        'National ABHA 14-digit ID generator',
        'Outpatient appointment booking desk',
        'Inpatient triage & admission transfer',
      ],
      defaultView: 'appointments',
    },
    {
      role: 'lab_tech',
      title: 'Laboratory Technologist Portal',
      badge: 'Diagnostics LIMS',
      icon: Microscope,
      accentColor: 'text-cyan-600',
      borderColor: 'border-cyan-200 hover:border-cyan-400',
      bgGradient: 'from-cyan-50/50 to-white',
      btnColor: 'bg-cyan-600 hover:bg-cyan-700 shadow-3d',
      sampleUser: 'Alex Rivera, MLS (ASCP)',
      sampleTitle: 'Clinical Laboratory Scientist & Pathology',
      username: 'labtech',
      password: 'labpassword',
      email: 'a.rivera@stjudemeridian.org',
      keyFeatures: [
        'LIMS laboratory specimen worklist',
        'Numerical & qualitative test result entry',
        'Automated panic value alerts & reference ranges',
        'Pathologist sign-off & report verification',
      ],
      defaultView: 'laboratory',
    },
    {
      role: 'pharmacist',
      title: 'Clinical Pharmacist Portal',
      badge: 'Dispensary',
      icon: Pill,
      accentColor: 'text-rose-600',
      borderColor: 'border-rose-200 hover:border-rose-400',
      bgGradient: 'from-rose-50/50 to-white',
      btnColor: 'bg-rose-600 hover:bg-rose-700 shadow-3d',
      sampleUser: 'Dr. Priya Patel, PharmD, BCPS',
      sampleTitle: 'Chief Pharmacotherapy Specialist',
      username: 'pharmacist',
      password: 'pharmpassword',
      email: 'p.patel@stjudemeridian.org',
      keyFeatures: [
        'Real-time e-Prescription dispensing queue',
        'Allergy contraindication safety safeguards',
        'Pharmacy inventory & batch stock tracking',
        'Automated low-stock restock reordering',
      ],
      defaultView: 'pharmacy',
    },
    {
      role: 'patient',
      title: 'Patient Health Portal',
      badge: 'Personal Health',
      icon: HeartHandshake,
      accentColor: 'text-teal-600',
      borderColor: 'border-teal-200 hover:border-teal-400',
      bgGradient: 'from-teal-50/50 to-white',
      btnColor: 'bg-teal-600 hover:bg-teal-700 shadow-3d',
      sampleUser: 'James Harrison (Self)',
      sampleTitle: 'Patient ID: HPR-2026-4891',
      username: 'patient',
      password: 'patientpassword',
      email: 'james.harrison@gmail.com',
      keyFeatures: [
        'My digital Electronic Health Record (EMR)',
        'Laboratory diagnostic reports & download',
        'Active prescription list & instructions',
        'Doctor appointments & visit history',
      ],
      defaultView: 'emr',
    },
    {
      role: 'super_admin',
      title: 'Super Admin & Executive Portal',
      badge: 'Full Administration',
      icon: ShieldAlert,
      accentColor: 'text-purple-600',
      borderColor: 'border-purple-200 hover:border-purple-400',
      bgGradient: 'from-purple-50/50 to-white',
      btnColor: 'bg-purple-600 hover:bg-purple-700 shadow-3d',
      sampleUser: 'Dr. Sarah Jenkins, MD, MBA',
      sampleTitle: 'Chief Medical Officer & Administrator',
      username: 'admin',
      password: 'adminpassword',
      email: 'admin@stjudemeridian.org',
      keyFeatures: [
        'Hospital-wide clinical analytics dashboard',
        'HIPAA-compliant immutable audit trails',
        'Granular role-based access control (RBAC)',
        'Innovations, FHIR R4 & Security Hub',
      ],
      defaultView: 'dashboard',
    },
  ];

  const handlePortalLaunch = (role: UserRole, defaultView: string) => {
    quickPortalLogin(role);
    setActiveView(defaultView);
  };

  const handleOpenGoogleAuth = (role: UserRole) => {
    setGoogleTargetRole(role);
    setShowGoogleModal(true);
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError(null);

    const res = await login(emailInput, passwordInput, twoFactorInput);
    setIsSubmitting(false);

    if (!res.success) {
      setLoginError(res.error || 'Authentication failed. Please verify credentials.');
    } else {
      // Find matching user and set view
      const cleanInput = emailInput.trim().toLowerCase();
      const targetUser = users.find(
        (u) =>
          (u.username && u.username.toLowerCase() === cleanInput) ||
          u.email.toLowerCase() === cleanInput
      );
      if (targetUser) {
        const portal = portalsData.find((p) => p.role === targetUser.role);
        if (portal) {
          setActiveView(portal.defaultView);
        }
      }
    }
  };

  const handleFillDemoUser = (userRole: UserRole) => {
    const user = users.find((u) => u.role === userRole);
    const portal = portalsData.find((p) => p.role === userRole);
    if (user && portal) {
      setEmailInput(user.username || user.email);
      setPasswordInput(user.password || portal.password);
      if (user.twoFactorEnabled) {
        setTwoFactorInput('123456');
      } else {
        setTwoFactorInput('');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1329] via-[#0f172a] to-[#1e293b] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top Institutional Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-400/40 bg-slate-900 flex items-center justify-center p-0.5 shadow-3d-sm">
              <img
                src="/srm_symbol.svg"
                alt="SRM Symbol"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base tracking-tight text-white">
                  SRM Medical Record System
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-400/30">
                  SRM-HPRMS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                SRM Institute of Science and Technology • Multi-Role Healthcare Portal Gateway
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-xs">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>All Clinical Services Operational</span>
            </div>
            <button
              onClick={() => handleOpenGoogleAuth('doctor')}
              className="px-3.5 py-1.5 bg-white text-slate-800 hover:bg-slate-100 rounded-lg text-xs font-bold shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
              <span>Sign in with Google</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Banner Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Role Hospital Portal &amp; Google SSO Gateway</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Select Your Role Portal or Sign In with Google
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Secure, HIPAA and DPDP compliant access for clinicians, nursing staff, laboratory technologists, pharmacists, administrative intake, and patients.
          </p>
        </div>

        {/* Unified Google Sign-in Master Callout Card */}
        <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-500/40 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4 text-left">
              <div className="w-14 h-14 rounded-2xl bg-white p-2.5 shadow-lg flex items-center justify-center shrink-0">
                <svg className="w-9 h-9" viewBox="0 0 24 24">
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
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    Sign in with Google (Single Sign-On)
                  </h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    Recommended
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                  Sign in using your Google credentials (<strong className="text-white">vabhinand2007@gmail.com</strong> or institutional Google Workspace) to immediately enter any role portal with encrypted single sign-on.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
              <button
                onClick={() => handleOpenGoogleAuth('doctor')}
                className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-bold shadow-lg flex items-center justify-center gap-2.5 transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                <span>Continue with Google</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Toggle: Role Portals vs Staff Credentials */}
        <div className="flex items-center justify-center">
          <div className="bg-slate-900/90 p-1.5 rounded-xl border border-slate-700/80 inline-flex shadow-inner">
            <button
              onClick={() => setActiveTab('portals')}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'portals'
                  ? 'bg-blue-600 text-white shadow-3d-primary'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Role Portals (7 Portals)</span>
            </button>
            <button
              onClick={() => setActiveTab('credentials')}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'credentials'
                  ? 'bg-blue-600 text-white shadow-3d-primary'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Staff Email &amp; 2FA Login</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Role Portals Grid */}
        {activeTab === 'portals' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {portalsData.map((portal) => {
              const Icon = portal.icon;
              return (
                <div
                  key={portal.role}
                  className={`bg-white rounded-2xl border ${portal.borderColor} p-6 shadow-xl flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 text-slate-800`}
                >
                  <div className="space-y-4">
                    
                    {/* Header: Icon + Badge */}
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-xs">
                        <Icon className={`w-6 h-6 ${portal.accentColor}`} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {portal.badge}
                      </span>
                    </div>

                    {/* Title & User */}
                    <div>
                      <h2 className="text-base font-black text-slate-900 tracking-tight">
                        {portal.title}
                      </h2>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                        <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-700">{portal.sampleUser}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        {portal.sampleTitle}
                      </p>
                    </div>

                    {/* Role Credentials Box */}
                    <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/80 space-y-1.5 text-xs">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span>Portal Login Credentials</span>
                        <span className="text-[9px] text-blue-600 font-semibold lowercase">click to fill</span>
                      </div>
                      <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
                        <span className="text-slate-500 text-[11px]">Username:</span>
                        <button
                          type="button"
                          onClick={() => {
                            setEmailInput(portal.username);
                            setPasswordInput(portal.password);
                            setActiveTab('credentials');
                          }}
                          className="font-mono font-bold text-slate-800 hover:text-blue-600 text-xs flex items-center gap-1 cursor-pointer"
                          title="Click to copy & switch to Login form"
                        >
                          <span>{portal.username}</span>
                          <Copy className="w-3 h-3 text-slate-400 hover:text-blue-500" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
                        <span className="text-slate-500 text-[11px]">Password:</span>
                        <button
                          type="button"
                          onClick={() => {
                            setEmailInput(portal.username);
                            setPasswordInput(portal.password);
                            setActiveTab('credentials');
                          }}
                          className="font-mono font-semibold text-blue-700 hover:text-blue-900 text-xs flex items-center gap-1 cursor-pointer"
                          title="Click to copy & switch to Login form"
                        >
                          <span>{portal.password}</span>
                          <Copy className="w-3 h-3 text-slate-400 hover:text-blue-500" />
                        </button>
                      </div>
                    </div>

                    {/* Key Features List */}
                    <div className="pt-2 border-t border-slate-100 space-y-1.5">
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Portal Features:
                      </div>
                      {portal.keyFeatures.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>

                  </div>

                  {/* Portal Action Buttons */}
                  <div className="pt-5 mt-4 border-t border-slate-100 space-y-2">
                    <button
                      onClick={() => handlePortalLaunch(portal.role, portal.defaultView)}
                      className={`w-full py-2.5 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${portal.btnColor}`}
                    >
                      <span>Enter {portal.badge}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleOpenGoogleAuth(portal.role)}
                      className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
                    >
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
                      <span>Sign in with Google</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Traditional Staff Login Form */}
        {activeTab === 'credentials' && (
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xl text-slate-800 space-y-6">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-200">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-black text-slate-900">Institutional Staff Login</h2>
              <p className="text-xs text-slate-500">
                Hospital Active Directory (AD) / Staff ID credentials
              </p>
            </div>

            {/* Quick Credentials Directory Table */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-blue-600" />
                  <span>Configured User Credentials</span>
                </span>
                <span className="text-[10px] text-slate-400">Click any row to auto-fill</span>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {portalsData.map((p) => (
                  <div
                    key={p.role}
                    onClick={() => handleFillDemoUser(p.role)}
                    className="p-2 bg-white hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 rounded-lg flex items-center justify-between cursor-pointer transition text-[11px]"
                  >
                    <div>
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        <span>{p.badge}</span>
                        <span className="text-slate-400 font-normal">({p.sampleUser.split(',')[0]})</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        User: <strong className="text-slate-700 font-bold">{p.username}</strong> • Pass: <strong className="text-blue-700">{p.password}</strong>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium shrink-0">
                      Auto-fill
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Username or Institutional Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-mono"
                    placeholder="e.g. doctor or admin@stjudemeridian.org"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-mono"
                    placeholder="Enter password (e.g. doctorpassword)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  2FA Verification Code (For 2FA-enabled accounts)
                </label>
                <input
                  type="text"
                  value={twoFactorInput}
                  onChange={(e) => setTwoFactorInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-mono"
                  placeholder="6-digit TOTP code (Test: 123456)"
                />
              </div>

              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-3d-primary btn-3d flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Authenticating Staff...</span>
                ) : (
                  <>
                    <span>Log in to Clinical System</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

      </main>

      {/* Security & Accreditation Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 mt-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              Protected by AES-256 state encryption, role-based access control (RBAC), and HIPAA audit trail standards.
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>FHIR R4 Compliant</span>
            <span>•</span>
            <span>India DPDP 2023</span>
            <span>•</span>
            <span>Zero-Trust Architecture</span>
          </div>
        </div>
      </footer>

      {/* Google Authentication Modal */}
      {showGoogleModal && (
        <GoogleAuthModal
          initialRole={googleTargetRole}
          onClose={() => setShowGoogleModal(false)}
          onSuccess={(role) => {
            const portal = portalsData.find((p) => p.role === role);
            if (portal) {
              setActiveView(portal.defaultView);
            }
          }}
        />
      )}

    </div>
  );
};
