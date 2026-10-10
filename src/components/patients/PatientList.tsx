import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHospital } from '../../context/HospitalContext';
import {
  Users,
  Search,
  UserPlus,
  Filter,
  FileText,
  Activity,
  AlertTriangle,
  ChevronRight,
  Shield,
  Printer,
  Sparkles,
} from 'lucide-react';
import { Patient, PatientStatus } from '../../types';
import { PatientRegistrationModal } from './PatientRegistrationModal';
import { PrintSummaryModal } from './PrintSummaryModal';

export const PatientList: React.FC = () => {
  const { currentUser, hasPermission } = useAuth();
  const { patients, setSelectedPatientId, setActiveView, vitals } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [genderFilter, setGenderFilter] = useState<string>('ALL');
  const [showRegModal, setShowRegModal] = useState(false);
  const [printPatient, setPrintPatient] = useState<Patient | null>(null);

  // Filter patients
  const filteredPatients = patients.filter((patient) => {
    // If patient user, only show own record
    if (currentUser.role === 'patient') {
      const isSelf = patient.email.toLowerCase() === currentUser.email.toLowerCase();
      if (!isSelf) return false;
    }

    const matchesSearch =
      patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery);

    const matchesStatus = statusFilter === 'ALL' || patient.status === statusFilter;
    const matchesGender = genderFilter === 'ALL' || patient.gender === genderFilter;

    return matchesSearch && matchesStatus && matchesGender;
  });

  const handleOpenEMR = (patientId: string) => {
    setSelectedPatientId(patientId);
    setActiveView('emr');
  };

  const getStatusBadge = (status: PatientStatus) => {
    switch (status) {
      case 'Inpatient':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Outpatient':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Emergency':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Discharged':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Active':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-blue-600" />
            <span>Master Patient Index (MPI)</span>
          </h1>
          <p className="text-xs text-slate-500">
            Search, manage, and review verified hospital medical records ({patients.length} active records)
          </p>
        </div>

        {hasPermission('registerPatients') && (
          <button
            onClick={() => setShowRegModal(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition flex items-center gap-2 shadow-3d-primary btn-3d shrink-0 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register New Patient</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-3d">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Patient MRN, Full Name, Phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:bg-white"
          >
            <option value="ALL">All Care Statuses</option>
            <option value="Inpatient">Inpatient</option>
            <option value="Outpatient">Outpatient</option>
            <option value="Emergency">Emergency</option>
            <option value="Critical">Critical Care</option>
            <option value="Discharged">Discharged</option>
          </select>

          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:bg-white"
          >
            <option value="ALL">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Patient Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map((patient) => {
          const patientVitals = vitals.filter((v) => v.patientId === patient.id);
          const latestVital = patientVitals[0];
          const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear();

          return (
            <div
              key={patient.id}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-3d card-3d-lift flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header info */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-700 border border-blue-200 flex items-center justify-center font-bold text-sm shadow-inner-bevel">
                      {patient.firstName[0]}
                      {patient.lastName[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 leading-tight">
                        {patient.firstName} {patient.lastName}
                      </h3>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono font-semibold text-blue-600">{patient.patientId}</span>
                        <span>•</span>
                        <span>{age} yrs, {patient.gender}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getStatusBadge(patient.status)}`}>
                      {patient.status}
                    </span>
                    <button
                      onClick={() => setPrintPatient(patient)}
                      title="Print Health Record Summary"
                      className="text-slate-400 hover:text-slate-700 p-1 hover:bg-slate-100 rounded transition cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Metrics / Info */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[11px]">Blood Group:</span>
                    <span className="font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded text-[11px] border border-rose-200">
                      {patient.bloodGroup}
                    </span>
                  </div>

                  {latestVital ? (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Activity className="w-3 h-3 text-blue-600" />
                        <span>Latest Vitals:</span>
                      </span>
                      <span className="font-mono font-bold text-slate-800">
                        {latestVital.bloodPressureSystolic}/{latestVital.bloodPressureDiastolic} mmHg • {latestVital.heartRateBpm} bpm
                      </span>
                    </div>
                  ) : (
                    <div className="text-slate-400 text-[11px] italic">No vitals recorded yet</div>
                  )}

                  {patient.allergies && patient.allergies.length > 0 ? (
                    <div className="flex items-center gap-1.5 text-rose-600">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span className="font-medium text-[11px] truncate">
                        Allergies: {patient.allergies.map((a) => a.substance).join(', ')}
                      </span>
                    </div>
                  ) : (
                    <div className="text-slate-400 text-[11px]">No known drug allergies (NKDA)</div>
                  )}

                  <div className="text-slate-500 text-[11px] truncate">
                    Assigned: <span className="text-slate-700 font-medium">{patient.assignedDoctorName || patient.primaryDoctorName}</span> • Phone: {patient.phone}
                  </div>
                </div>
              </div>

              {/* Card Footer actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Ins: {patient.insurance?.provider || 'Self-Pay'}</span>
                <button
                  onClick={() => handleOpenEMR(patient.id)}
                  className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Open EMR Chart</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredPatients.length === 0 && (
          <div className="col-span-full p-12 bg-white border border-slate-200 rounded-xl text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700 mb-1">No patient records found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No matching records for "{searchQuery}". Try searching with another MRN or register a new patient.
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showRegModal && <PatientRegistrationModal onClose={() => setShowRegModal(false)} />}
      {printPatient && <PrintSummaryModal patient={printPatient} onClose={() => setPrintPatient(null)} />}
    </div>
  );
};
