import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHospital } from '../../context/HospitalContext';
import { X, BedDouble, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AdmitPatientModalProps {
  patientId: string;
  onClose: () => void;
}

export const AdmitPatientModal: React.FC<AdmitPatientModalProps> = ({ patientId, onClose }) => {
  const { currentUser, users } = useAuth();
  const { patients, beds, admitPatient, logAuditEvent } = useHospital();

  const patient = patients.find((p) => p.id === patientId) || patients[0];
  const doctors = users.filter((u) => u.role === 'doctor');
  const availableBeds = beds.filter((b) => !b.isOccupied && (b.maintenanceStatus === 'Available' || b.maintenanceStatus === 'Clean'));

  const [selectedBedId, setSelectedBedId] = useState(availableBeds[0]?.id || beds[0]?.id || '');
  const [admittingDoctorId, setAdmittingDoctorId] = useState(doctors[0]?.id || 'doc-1');
  const [reason, setReason] = useState('Acute clinical stabilization and inpatient monitoring');
  const [notes, setNotes] = useState('Continuous telemetry and vitals Q4H required.');

  if (!patient) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bed = beds.find((b) => b.id === selectedBedId) || availableBeds[0] || beds[0];
    const doc = doctors.find((d) => d.id === admittingDoctorId) || doctors[0];

    if (!bed) {
      alert('No clean, vacant beds available in the selected ward. Please release or clean a bed first.');
      return;
    }

    const admission = admitPatient(
      patient.id,
      bed.wardName,
      bed.bedNumber,
      doc.id,
      doc.name,
      reason,
      notes
    );

    logAuditEvent(
      currentUser.id,
      currentUser.name,
      currentUser.role,
      'ADMIT_PATIENT',
      'Admission',
      admission.id,
      `Admitted patient to ${bed.wardName} Bed ${bed.bedNumber} under ${doc.name}`,
      `${patient.patientId} (${patient.firstName[0]}.${patient.lastName[0]}.)`
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 shadow-3d-lg space-y-4 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 shadow-inner-bevel">
              <BedDouble className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Inpatient Ward Admission</h3>
              <p className="text-xs text-slate-500">
                Patient: <strong className="text-slate-800">{patient.firstName} {patient.lastName}</strong> ({patient.patientId})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Bed selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Select Vacant Bed / Ward Location <span className="text-rose-500">*</span>
            </label>
            {availableBeds.length > 0 ? (
              <select
                value={selectedBedId}
                onChange={(e) => setSelectedBedId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                {availableBeds.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.wardName} — Bed {b.bedNumber} ({b.wardType || 'General'}) - ${b.dailyRateUsd}/day
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>All ward beds are currently occupied or in maintenance turnover.</span>
              </div>
            )}
          </div>

          {/* Admitting Doctor */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Admitting Attending Physician <span className="text-rose-500">*</span>
            </label>
            <select
              value={admittingDoctorId}
              onChange={(e) => setAdmittingDoctorId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 font-medium focus:outline-none"
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.specialty || d.department})
                </option>
              ))}
            </select>
          </div>

          {/* Reason for Admission */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Primary Reason for Inpatient Stay <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Hypertensive crisis, post-operative observation"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none"
            />
          </div>

          {/* Clinical Directives */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Initial Nursing & Telemetry Directives
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Continuous telemetry, NPO after midnight, strict I/O monitoring"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={availableBeds.length === 0}
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-3d-amber btn-3d flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Admission</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
