import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHospital } from '../../context/HospitalContext';
import {
  BedDouble,
  Activity,
  UserCheck,
  AlertCircle,
  Plus,
  ArrowRightLeft,
  Wrench,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  Search,
  Filter,
  Eye,
  LogOut,
  SlidersHorizontal,
  Box,
  LayoutGrid,
  List,
} from 'lucide-react';
import { WardBed, InpatientAdmission } from '../../types';
import { AdmitPatientModal } from '../patients/AdmitPatientModal';
import { DischargePatientModal } from '../patients/DischargePatientModal';

export const BedManagementView: React.FC = () => {
  const { currentUser, hasPermission } = useAuth();
  const {
    beds,
    admissions,
    patients,
    updateBedStatus,
    setSelectedPatientId,
    setActiveView,
    logAuditEvent,
  } = useHospital();

  const [selectedWard, setSelectedWard] = useState<string>('ALL');
  const [selectedWardType, setSelectedWardType] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OCCUPIED' | 'VACANT' | 'MAINTENANCE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'3d-grid' | 'table'>('3d-grid');

  // Modals state
  const [admitModalPatientId, setAdmitModalPatientId] = useState<string | null>(null);
  const [dischargeAdmission, setDischargeAdmission] = useState<InpatientAdmission | null>(null);

  // Filtered beds
  const filteredBeds = beds.filter((bed) => {
    const matchesWard = selectedWard === 'ALL' || bed.wardName === selectedWard;
    const matchesType = selectedWardType === 'ALL' || bed.wardType === selectedWardType;
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'OCCUPIED' && bed.isOccupied) ||
      (statusFilter === 'VACANT' && !bed.isOccupied && bed.maintenanceStatus === 'Available') ||
      (statusFilter === 'MAINTENANCE' && bed.maintenanceStatus !== 'Available');

    const patient = bed.currentPatientId ? patients.find((p) => p.id === bed.currentPatientId) : null;
    const matchesSearch =
      bed.bedNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bed.wardName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (patient && `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (patient && patient.patientId.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesWard && matchesType && matchesStatus && matchesSearch;
  });

  const totalBeds = beds.length;
  const occupiedBeds = beds.filter((b) => b.isOccupied).length;
  const vacantBeds = beds.filter((b) => !b.isOccupied && b.maintenanceStatus === 'Available').length;
  const maintenanceBeds = beds.filter((b) => b.maintenanceStatus !== 'Available' && !b.isOccupied).length;
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  const wardsList = Array.from(new Set(beds.map((b) => b.wardName)));

  const handleMaintenanceToggle = (bedId: string, currentStatus: WardBed['maintenanceStatus']) => {
    const nextStatus: WardBed['maintenanceStatus'] =
      currentStatus === 'Available' ? 'Cleaning Required' : currentStatus === 'Cleaning Required' ? 'Maintenance' : 'Available';
    updateBedStatus(bedId, nextStatus);
    logAuditEvent(
      currentUser.id,
      currentUser.name,
      currentUser.role,
      'UPDATE_BED_STATUS',
      'Ward',
      bedId,
      `Changed bed maintenance status from ${currentStatus} to ${nextStatus}`
    );
  };

  const handleQuickAdmitClick = (bed: WardBed) => {
    const availablePatients = patients.filter((p) => p.status !== 'Inpatient');
    if (availablePatients.length > 0) {
      setAdmitModalPatientId(availablePatients[0].id);
    } else if (patients.length > 0) {
      setAdmitModalPatientId(patients[0].id);
    }
  };

  const handleDischargeClick = (bed: WardBed) => {
    const activeAdm = admissions.find(
      (a) =>
        (bed.admissionId && a.id === bed.admissionId) ||
        (a.bedNumber === bed.bedNumber && a.status === 'Admitted')
    );
    if (activeAdm) {
      setDischargeAdmission(activeAdm);
    } else {
      // Mock admission object if missing
      setDischargeAdmission({
        id: bed.admissionId || `adm-temp-${Date.now()}`,
        patientId: bed.currentPatientId || 'pat-001',
        admittingDoctorName: 'Dr. Marcus Vance, MD',
        ward: bed.wardName,
        bedNumber: bed.bedNumber,
        reasonForAdmission: 'Inpatient Hospitalization and Telemetry',
        initialDiagnosis: 'Under Observation',
        status: 'Admitted',
        admittedDate: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-3d">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 border border-blue-500/20 shadow-inner-bevel">
              <BedDouble className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Inpatient Ward & Bed Capacity Management</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Telemetry Active
                </span>
              </h1>
              <p className="text-xs text-slate-500">
                Live bed occupancy matrix, ward turnover telemetry, sanitization, and admission allocation
              </p>
            </div>
          </div>
        </div>

        {/* View Switcher & Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 shadow-inner-bevel">
            <button
              onClick={() => setViewMode('3d-grid')}
              className={`p-1.5 rounded-md text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                viewMode === '3d-grid'
                  ? 'bg-white text-slate-900 shadow-3d-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="3D Ward Perspective"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">3D Grid</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-3d-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Clinical Table View"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>

          {hasPermission('manageAdmissions') && (
            <button
              onClick={() => {
                const outPatient = patients.find((p) => p.status !== 'Inpatient') || patients[0];
                if (outPatient) setAdmitModalPatientId(outPatient.id);
              }}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-3d-primary btn-3d flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Admit Patient</span>
            </button>
          )}
        </div>
      </div>

      {/* 3D KPI Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-3d card-3d-lift">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Total Bed Census</span>
            <BedDouble className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">{totalBeds} Beds</div>
          <div className="text-[11px] text-slate-500 mt-1">Across 4 specialized hospital wings</div>
        </div>

        <div className="bg-white border border-rose-200 rounded-xl p-4 shadow-3d card-3d-lift">
          <div className="flex items-center justify-between text-xs text-rose-600 font-semibold mb-1">
            <span>Occupied Beds</span>
            <Activity className="w-4 h-4 text-rose-600 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-rose-700 font-mono">{occupiedBeds} Beds</div>
          <div className="text-[11px] text-rose-600/80 mt-1 font-medium">{occupancyRate}% Total Hospital Occupancy</div>
        </div>

        <div className="bg-white border border-emerald-200 rounded-xl p-4 shadow-3d card-3d-lift">
          <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold mb-1">
            <span>Vacant & Sanitized</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 font-mono">{vacantBeds} Beds</div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">Ready for immediate intake</div>
        </div>

        <div className="bg-white border border-amber-200 rounded-xl p-4 shadow-3d card-3d-lift">
          <div className="flex items-center justify-between text-xs text-amber-700 font-semibold mb-1">
            <span>Turnover / Cleaning</span>
            <Wrench className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700 font-mono">{maintenanceBeds} Beds</div>
          <div className="text-[11px] text-amber-600 mt-1 font-medium">Sanitization / Bio-cleaning</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-3d flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Hospital Wings & Wards</option>
            {wardsList.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="OCCUPIED">Occupied Beds Only</option>
            <option value="VACANT">Vacant / Available</option>
            <option value="MAINTENANCE">Turnover & Cleaning</option>
          </select>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search bed, ward, MRN, patient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* VIEW 1: 3D WARD INTERACTIVE PERSPECTIVE GRID */}
      {viewMode === '3d-grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBeds.map((bed) => {
            const patient = bed.currentPatientId
              ? patients.find((p) => p.id === bed.currentPatientId)
              : null;
            const admission = admissions.find(
              (a) => (bed.admissionId && a.id === bed.admissionId) || (a.bedNumber === bed.bedNumber && a.status === 'Admitted')
            );

            return (
              <div
                key={bed.id}
                className={`relative rounded-xl border transition-all duration-200 overflow-hidden shadow-3d card-3d-lift ${
                  bed.isOccupied
                    ? 'bg-gradient-to-b from-white to-rose-50/40 border-rose-200'
                    : bed.maintenanceStatus !== 'Available'
                    ? 'bg-gradient-to-b from-white to-amber-50/40 border-amber-200'
                    : 'bg-gradient-to-b from-white to-emerald-50/40 border-emerald-200'
                }`}
              >
                {/* Top 3D Headboard & Status Bar */}
                <div
                  className={`p-3 border-b flex items-center justify-between ${
                    bed.isOccupied
                      ? 'bg-rose-100/70 border-rose-200 text-rose-900'
                      : bed.maintenanceStatus !== 'Available'
                      ? 'bg-amber-100/70 border-amber-200 text-amber-900'
                      : 'bg-emerald-100/70 border-emerald-200 text-emerald-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        bed.isOccupied
                          ? 'bg-rose-500 ring-4 ring-rose-200 animate-pulse'
                          : bed.maintenanceStatus !== 'Available'
                          ? 'bg-amber-500 ring-4 ring-amber-200'
                          : 'bg-emerald-500 ring-4 ring-emerald-200'
                      }`}
                    />
                    <div>
                      <span className="font-mono font-black text-sm tracking-tight">{bed.bedNumber}</span>
                      {bed.wardType && (
                        <span className="text-[10px] text-slate-500 ml-1.5 font-medium">({bed.wardType})</span>
                      )}
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shadow-inner-bevel ${
                      bed.isOccupied
                        ? 'bg-rose-600 text-white border-rose-700'
                        : bed.maintenanceStatus !== 'Available'
                        ? 'bg-amber-600 text-white border-amber-700'
                        : 'bg-emerald-600 text-white border-emerald-700'
                    }`}
                  >
                    {bed.isOccupied ? 'OCCUPIED' : bed.maintenanceStatus.toUpperCase()}
                  </span>
                </div>

                {/* Patient / Bed Info */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="font-semibold">{bed.wardName}</span>
                    <span className="font-mono text-slate-700 font-bold">${bed.dailyRateUsd}/day</span>
                  </div>

                  {bed.isOccupied && patient ? (
                    <div className="p-3 bg-white border border-rose-200 rounded-lg shadow-inner-bevel space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-sm text-slate-900">
                          {patient.firstName} {patient.lastName}
                        </div>
                        <span className="text-[10px] font-mono font-bold text-blue-700 px-1.5 py-0.5 bg-blue-50 rounded border border-blue-200">
                          {patient.patientId}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-600">
                        {patient.gender}, {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} yo • Blood: <strong className="text-rose-600">{patient.bloodGroup}</strong>
                      </div>

                      {admission && (
                        <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
                          <span>Admitted: {new Date(admission.admittedDate || admission.admissionDate || '').toLocaleDateString()}</span>
                          <span className="text-slate-700 font-medium">{admission.admittingDoctorName}</span>
                        </div>
                      )}
                    </div>
                  ) : bed.isOccupied ? (
                    <div className="p-3 bg-white border border-rose-200 rounded-lg shadow-inner-bevel text-xs text-slate-700">
                      <div className="font-bold text-slate-900">{bed.currentPatientName || 'Patient in Bed'}</div>
                      <div className="text-[11px] text-slate-500">Status: Under Active Monitoring</div>
                    </div>
                  ) : (
                    <div className="p-4 bg-white/80 border border-dashed border-slate-300 rounded-lg text-center space-y-1">
                      <BedDouble className="w-6 h-6 text-slate-400 mx-auto" />
                      <div className="text-xs font-bold text-slate-700">Bed Vacant & Prepared</div>
                      <div className="text-[11px] text-slate-500">Sanitized linens, telemetry ready</div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    {bed.isOccupied && patient ? (
                      <button
                        onClick={() => {
                          setSelectedPatientId(patient.id);
                          setActiveView('emr');
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Chart</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleMaintenanceToggle(bed.id, bed.maintenanceStatus)}
                        className="text-xs text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <Wrench className="w-3.5 h-3.5 text-slate-400" />
                        <span>Status: {bed.maintenanceStatus}</span>
                      </button>
                    )}

                    {hasPermission('manageAdmissions') && (
                      bed.isOccupied ? (
                        hasPermission('dischargePatients') && (
                          <button
                            onClick={() => handleDischargeClick(bed)}
                            className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-xs font-bold shadow-3d-rose btn-3d flex items-center gap-1 cursor-pointer"
                          >
                            <LogOut className="w-3 h-3" />
                            <span>Discharge</span>
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => handleQuickAdmitClick(bed)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-bold shadow-3d-emerald btn-3d flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Admit Patient</span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: CLINICAL TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-3d">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Bed Number</th>
                  <th className="p-3">Ward / Unit</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Current Patient</th>
                  <th className="p-3">Daily Rate</th>
                  <th className="p-3">Hygiene & Maintenance</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredBeds.map((bed) => {
                  const patient = bed.currentPatientId
                    ? patients.find((p) => p.id === bed.currentPatientId)
                    : null;

                  return (
                    <tr key={bed.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3 font-mono font-bold text-slate-900">{bed.bedNumber}</td>
                      <td className="p-3 font-medium text-slate-800">{bed.wardName}</td>
                      <td className="p-3 text-slate-600">{bed.wardType || 'General'}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            bed.isOccupied
                              ? 'bg-rose-100 text-rose-700 border-rose-200'
                              : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {bed.isOccupied ? 'Occupied' : 'Vacant'}
                        </span>
                      </td>
                      <td className="p-3">
                        {patient ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900">
                              {patient.firstName} {patient.lastName}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">({patient.patientId})</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">-- None --</span>
                        )}
                      </td>
                      <td className="p-3 font-mono font-semibold text-slate-900">${bed.dailyRateUsd}/day</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleMaintenanceToggle(bed.id, bed.maintenanceStatus)}
                          className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold border border-slate-200 transition cursor-pointer"
                        >
                          {bed.maintenanceStatus}
                        </button>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {patient && (
                            <button
                              onClick={() => {
                                setSelectedPatientId(patient.id);
                                setActiveView('emr');
                              }}
                              className="px-2 py-1 text-[11px] font-bold text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                            >
                              Chart
                            </button>
                          )}
                          {hasPermission('manageAdmissions') && (
                            bed.isOccupied ? (
                              hasPermission('dischargePatients') && (
                                <button
                                  onClick={() => handleDischargeClick(bed)}
                                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-bold shadow-3d-rose btn-3d cursor-pointer"
                                >
                                  Discharge
                                </button>
                              )
                            ) : (
                              <button
                                onClick={() => handleQuickAdmitClick(bed)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold shadow-3d-emerald btn-3d cursor-pointer"
                              >
                                Admit
                              </button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admit Inpatient Modal */}
      {admitModalPatientId && (
        <AdmitPatientModal
          patientId={admitModalPatientId}
          onClose={() => setAdmitModalPatientId(null)}
        />
      )}

      {/* Discharge Inpatient Modal */}
      {dischargeAdmission && (
        <DischargePatientModal
          admission={dischargeAdmission}
          onClose={() => setDischargeAdmission(null)}
        />
      )}
    </div>
  );
};
