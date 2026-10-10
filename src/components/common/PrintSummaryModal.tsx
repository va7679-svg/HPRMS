import React from 'react';
import { PatientDemographics } from '../../types';
import { useHospital } from '../../context/HospitalContext';
import { X, Printer, Building2, Shield } from 'lucide-react';

interface PrintSummaryModalProps {
  patient: PatientDemographics;
  onClose: () => void;
}

export const PrintSummaryModal: React.FC<PrintSummaryModalProps> = ({ patient, onClose }) => {
  const { vitals, prescriptions } = useHospital();

  const patientVitals = vitals.filter((v) => v.patientId === patient.id);
  const patientPrescriptions = prescriptions.filter((p) => p.patientId === patient.id);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:bg-white print:static">
      <div className="bg-white border border-slate-200 rounded-xl max-w-3xl w-full p-8 shadow-3d-lg space-y-6 max-h-[92vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none print:p-0">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 print:hidden">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">Official Clinical Record</h3>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">Print Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-3d-primary btn-3d flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Record</span>
            </button>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="border-b-2 border-slate-900 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-blue-900 font-black text-xl tracking-tight">
                <Building2 className="w-6 h-6" />
                <span>St. Jude Metropolitan Medical Center</span>
              </div>
              <div className="text-xs text-slate-600">Department of Hospital Patient Record Management</div>
            </div>
            <div className="text-right">
              <div className="font-mono text-sm font-black text-blue-700">{patient.patientId}</div>
              <div className="text-[11px] text-slate-400">Date: {new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Patient Name</span>
            <strong className="text-sm text-slate-900">{patient.firstName} {patient.lastName}</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">DOB / Gender</span>
            <strong className="text-slate-900">{patient.dateOfBirth} • {patient.gender}</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Blood Group</span>
            <strong className="text-rose-700 font-bold">{patient.bloodGroup}</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Attending MD</span>
            <strong className="text-slate-900">{patient.assignedDoctorName || patient.primaryDoctorName}</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Insurance</span>
            <strong className="text-slate-900">{patient.insurance?.provider || 'Self Pay'}</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Emergency Contact</span>
            <strong className="text-slate-900">{patient.emergencyContact?.name || 'N/A'} ({patient.emergencyContact?.phone || 'N/A'})</strong>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-300 grid grid-cols-2 gap-8 text-xs">
          <div>
            <div className="text-slate-400 mb-6">Physician Signature:</div>
            <div className="font-serif italic text-base text-slate-900 font-bold">{patient.assignedDoctorName || patient.primaryDoctorName}</div>
          </div>
          <div className="text-right">
            <div className="text-slate-400 mb-6">HIPAA Security Verification:</div>
            <div className="text-emerald-700 font-bold flex items-center justify-end gap-1">
              <Shield className="w-4 h-4" />
              <span>Certified Confidential Record</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
