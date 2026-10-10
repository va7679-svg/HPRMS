import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHospital } from '../../context/HospitalContext';
import {
  Users,
  Activity,
  Calendar,
  BedDouble,
  Microscope,
  Pill,
  AlertTriangle,
  Plus,
  Clock,
  ChevronRight,
  Stethoscope,
  Save,
  CheckCircle2,
  Cpu,
  Sparkles,
  ShieldCheck,
  Share2,
} from 'lucide-react';
import { PatientRegistrationModal } from '../patients/PatientRegistrationModal';

export const DashboardView: React.FC = () => {
  const { currentUser, hasPermission } = useAuth();
  const {
    patients,
    appointments,
    beds,
    labOrders,
    prescriptions,
    admissions,
    setActiveView,
    setSelectedPatientId,
  } = useHospital();

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [quickNote, setQuickNote] = useState('Patient P-98231 scheduled for follow-up ECG post-beta-blocker titration.');
  const [noteSaved, setNoteSaved] = useState(false);

  // High-level Metrics
  const totalPatients = patients.length;
  const activeInpatients = admissions.filter((a) => a.status === 'Admitted').length;
  const todayDateStr = new Date().toISOString().split('T')[0];
  const appointmentsToday = appointments.filter((a) => a.dateTime.startsWith(todayDateStr));
  const pendingLabs = labOrders.filter((l) => l.status !== 'Verified' && l.status !== 'Cancelled').length;
  const criticalLabs = labOrders.filter((l) => l.priority === 'STAT (Emergency)' || l.priority === 'Urgent').length;

  const handleSelectPatient = (id: string) => {
    setSelectedPatientId(id);
    setActiveView('emr');
  };

  const handleSaveNote = () => {
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  const getRolePortalColor = (role: string) => {
    switch (role) {
      case 'doctor':
        return { bg: 'from-blue-950 via-slate-900 to-indigo-950', border: 'border-blue-500/40', badge: 'bg-blue-500/20 text-blue-300 border-blue-400/30', label: 'Doctor Clinical Portal' };
      case 'nurse':
        return { bg: 'from-emerald-950 via-slate-900 to-teal-950', border: 'border-emerald-500/40', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30', label: 'Inpatient Nursing Portal' };
      case 'receptionist':
        return { bg: 'from-amber-950 via-slate-900 to-slate-950', border: 'border-amber-500/40', badge: 'bg-amber-500/20 text-amber-300 border-amber-400/30', label: 'Reception & Admissions Portal' };
      case 'lab_tech':
        return { bg: 'from-cyan-950 via-slate-900 to-blue-950', border: 'border-cyan-500/40', badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30', label: 'Laboratory Diagnostic Portal' };
      case 'pharmacist':
        return { bg: 'from-rose-950 via-slate-900 to-slate-950', border: 'border-rose-500/40', badge: 'bg-rose-500/20 text-rose-300 border-rose-400/30', label: 'Clinical Pharmacy Portal' };
      case 'patient':
        return { bg: 'from-teal-950 via-slate-900 to-emerald-950', border: 'border-teal-500/40', badge: 'bg-teal-500/20 text-teal-300 border-teal-400/30', label: 'Patient Personal Health Portal' };
      default:
        return { bg: 'from-purple-950 via-slate-900 to-slate-950', border: 'border-purple-500/40', badge: 'bg-purple-500/20 text-purple-300 border-purple-400/30', label: 'Super Admin Executive Portal' };
    }
  };

  const portalMeta = getRolePortalColor(currentUser.role);

  return (
    <div className="space-y-6">
      
      {/* Personalized Role Portal Welcome Card */}
      <div className={`bg-gradient-to-r ${portalMeta.bg} p-5 rounded-2xl border ${portalMeta.border} text-white shadow-3d flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}>
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${portalMeta.badge}`}>
              {portalMeta.label}
            </span>
            {currentUser.isGoogleAuth && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-200 font-semibold border border-white/20 flex items-center gap-1.5">
                <svg className="w-3 h-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google SSO: {currentUser.googleEmail || currentUser.email}</span>
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-xs text-slate-300">
            {currentUser.specialty || currentUser.department || 'SRM Medical Center'} • {currentUser.licenseNumber ? `License: ${currentUser.licenseNumber}` : 'Active Session'}
          </p>
        </div>

        {/* Portal Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {currentUser.role === 'doctor' && (
            <>
              <button
                onClick={() => setActiveView('patients')}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Patient Charts</span>
              </button>
              <button
                onClick={() => setActiveView('appointments')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Queue</span>
              </button>
            </>
          )}

          {currentUser.role === 'nurse' && (
            <>
              <button
                onClick={() => setActiveView('inpatient')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <BedDouble className="w-3.5 h-3.5" />
                <span>Ward Beds Matrix</span>
              </button>
              <button
                onClick={() => {
                  setSelectedPatientId('pat-001');
                  setActiveView('emr');
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Record Vitals</span>
              </button>
            </>
          )}

          {currentUser.role === 'pharmacist' && (
            <>
              <button
                onClick={() => setActiveView('pharmacy')}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <Pill className="w-3.5 h-3.5" />
                <span>Prescription Queue</span>
              </button>
            </>
          )}

          {currentUser.role === 'lab_tech' && (
            <>
              <button
                onClick={() => setActiveView('laboratory')}
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <Microscope className="w-3.5 h-3.5" />
                <span>LIMS Worklist</span>
              </button>
            </>
          )}

          {currentUser.role === 'receptionist' && (
            <>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Register Patient</span>
              </button>
              <button
                onClick={() => setActiveView('appointments')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Appointment Desk</span>
              </button>
            </>
          )}

          {currentUser.role === 'patient' && (
            <>
              <button
                onClick={() => {
                  setSelectedPatientId('pat-001');
                  setActiveView('emr');
                }}
                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5" />
                <span>My Health Chart</span>
              </button>
              <button
                onClick={() => setActiveView('laboratory')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <Microscope className="w-3.5 h-3.5" />
                <span>My Lab Results</span>
              </button>
            </>
          )}

          {currentUser.role === 'super_admin' && (
            <>
              <button
                onClick={() => setActiveView('audit_logs')}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Audit Logs</span>
              </button>
              <button
                onClick={() => setActiveView('innovations')}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>System Hub</span>
              </button>
            </>
          )}
        </div>
      </div>
      <div className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-blue-950 p-4 sm:p-5 rounded-2xl border border-slate-700/60 text-white shadow-3d flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-400/30 shadow-inner-bevel">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                SRM Hospital Patient Record System • Innovations &amp; Security Hub
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-400/30 hidden sm:inline-block">
                Next-Gen Informatics
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              1. Legacy Problems Matrix • 2. 12 New Innovations (FHIR, Blockchain, IoT, NLP) • 3. Trade-offs • 4. System Improvements • 5. Defense-in-Depth Security
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveView('innovations')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-3d-primary btn-3d flex items-center gap-2 shrink-0 transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-blue-200" />
          <span>Explore System Hub</span>
        </button>
      </div>

      {/* 4-Column KPI Grid matching High Density Theme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Today's Appointments */}
        <div
          onClick={() => setActiveView('appointments')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs cursor-pointer hover:border-blue-300 transition"
        >
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Today's Appointments
          </p>
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold text-slate-800">{appointmentsToday.length}</h2>
            <span className="text-blue-600 text-[10px] font-bold px-1.5 py-0.5 bg-blue-50 border border-blue-100 rounded">
              +{Math.max(1, appointmentsToday.length)} active queue
            </span>
          </div>
        </div>

        {/* New Admissions */}
        <div
          onClick={() => setActiveView('inpatient')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs cursor-pointer hover:border-blue-300 transition"
        >
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Active Inpatients
          </p>
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold text-slate-800">
              {activeInpatients < 10 ? `0${activeInpatients}` : activeInpatients}
            </h2>
            <span className="text-slate-500 text-[10px] font-bold bg-slate-100 px-1.5 py-0.5 rounded">
              ICU & CCU Wings
            </span>
          </div>
        </div>

        {/* Pending Lab Reports */}
        <div
          onClick={() => setActiveView('laboratory')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs cursor-pointer hover:border-orange-300 transition"
        >
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Pending Lab Reports
          </p>
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold text-orange-600">
              {pendingLabs < 10 ? `0${pendingLabs}` : pendingLabs}
            </h2>
            <span className="text-orange-600 text-[10px] font-bold px-1.5 py-0.5 bg-orange-50 border border-orange-200 rounded">
              {criticalLabs} Urgent / STAT
            </span>
          </div>
        </div>

        {/* Emergency Alerts / STAT indicator */}
        <div
          onClick={() => setActiveView('laboratory')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs border-l-4 border-l-red-500 cursor-pointer hover:border-red-300 transition"
        >
          <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-1">
            Emergency Alerts
          </p>
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold text-red-600">
              {criticalLabs < 10 ? `0${criticalLabs}` : criticalLabs}
            </h2>
            <span className="text-red-600 text-[10px] font-bold animate-pulse">
              Action Required
            </span>
          </div>
        </div>
      </div>

      {/* Main 12-Column High Density Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Upcoming Patient Queue Table */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Upcoming Patient Queue</h3>
              <p className="text-[11px] text-slate-400">Scheduled clinical appointments and triage queue</p>
            </div>
            <div className="flex items-center gap-2">
              {hasPermission('registerPatients') && (
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow-3d-primary btn-3d cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Register Patient</span>
                </button>
              )}
              <button
                onClick={() => setActiveView('appointments')}
                className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
              >
                View Full Schedule
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-[10px] uppercase text-slate-500 font-bold border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Condition / Reason</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-100">
                {appointmentsToday.slice(0, 6).map((apt) => {
                  const patient = patients.find((p) => p.id === apt.patientId);
                  const isStat = apt.appointmentType === 'Emergency' || apt.status === 'In Consultation';
                  
                  return (
                    <tr
                      key={apt.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        apt.appointmentType === 'Emergency' ? 'bg-red-50/40' : ''
                      }`}
                    >
                      <td className="px-4 py-3 font-semibold text-blue-600 whitespace-nowrap">
                        {new Date(apt.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{apt.patientName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            ID: {patient?.patientId || 'P-44120'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 italic">
                        {apt.reasonForVisit}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {apt.status === 'In Consultation' ? (
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[9px] border border-blue-200">
                            IN CONSULTATION
                          </span>
                        ) : apt.status === 'Checked-in' ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[9px] border border-emerald-200">
                            WAITING
                          </span>
                        ) : apt.appointmentType === 'Emergency' ? (
                          <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold text-[9px] border border-red-200">
                            URGENT
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold text-[9px] border border-slate-200">
                            {apt.status.toUpperCase()}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleSelectPatient(apt.patientId)}
                          className="text-slate-400 hover:text-blue-600 font-medium transition cursor-pointer"
                        >
                          Edit EMR
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {appointmentsToday.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-xs text-slate-400">
                      No appointments currently in queue today. Click "Register Patient" or "View Full Schedule".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer Stats */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Showing {Math.min(6, appointmentsToday.length)} of {appointmentsToday.length} queue slots</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> In Consultation
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Waiting
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500"></span> Urgent
              </span>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Recent Lab Results & Doctor's Quick Notes */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Recent Lab Results Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">Recent Lab Results</h3>
              <button
                onClick={() => setActiveView('laboratory')}
                className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
              >
                LIMS View
              </button>
            </div>
            
            <div className="p-4 space-y-3">
              {labOrders.slice(0, 2).map((lab, idx) => {
                const isCritical = lab.priority === 'STAT (Emergency)' || lab.priority === 'Urgent';
                return (
                  <div
                    key={lab.id}
                    onClick={() => setActiveView('laboratory')}
                    className={`p-3 rounded-lg border transition cursor-pointer ${
                      isCritical
                        ? 'bg-orange-50 border-orange-200'
                        : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded border bg-white ${
                          isCritical
                            ? 'text-orange-600 border-orange-200'
                            : 'text-blue-600 border-blue-200'
                        }`}
                      >
                        {lab.testCategory}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {idx === 0 ? '12m ago' : '45m ago'}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 mb-0.5">
                      {lab.testName} - {lab.orderNumber}
                    </p>
                    <p className={`text-[10px] ${isCritical ? 'text-orange-700 font-semibold' : 'text-slate-500'}`}>
                      {isCritical ? 'Elevated / STAT Priority • Requires Review' : 'All standard values verified.'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Doctor's Quick Notes matching High Density Dark Widget */}
          <div className="bg-[#0f172a] rounded-xl p-4 shadow-sm text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Doctor's Quick Notes
                </h3>
                {noteSaved && (
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Saved
                  </span>
                )}
              </div>
              <textarea
                value={quickNote}
                onChange={(e) => setQuickNote(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700/60 rounded-lg p-3 text-xs text-slate-200 h-24 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Draft clinical notes or reminders here..."
              ></textarea>
            </div>
            <div className="mt-3 flex justify-end">
              <button
                onClick={handleSaveNote}
                className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Save className="w-3 h-3" />
                <span>Save to Vault</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Registration Modal */}
      {showRegisterModal && <PatientRegistrationModal onClose={() => setShowRegisterModal(false)} />}
    </div>
  );
};
