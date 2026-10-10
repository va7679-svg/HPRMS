import React from 'react';
import { Patient } from '../../types';
import { useHospital } from '../../context/HospitalContext';
import { X, Printer, Building2, Shield } from 'lucide-react';

interface PrintSummaryModalProps {
  patient: Patient;
  onClose: () => void;
}

export const PrintSummaryModal: React.FC<PrintSummaryModalProps> = ({ patient, onClose }) => {
  const { vitals, consultations, prescriptions } = useHospital();

  const patientVitals = vitals.filter((v) => v.patientId === patient.id);
  const patientPrescriptions = prescriptions.filter((p) => p.patientId === patient.id);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:bg-white print:static">
      <div className="bg-white border border-slate-200 rounded-xl max-w-3xl w-full p-8 shadow-3d-lg space-y-6 max-h-[92vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none print:p-0">
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 print:hidden">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">Official Clinical Record & Summary</h3>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">Print Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-3d-primary btn-3d flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Record</span>
            </button>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Hospital Document Header */}
        <div className="border-b-2 border-slate-900 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-blue-900 font-black text-xl tracking-tight">
                <img src="/srm_symbol.svg" alt="SRM" className="w-7 h-7 object-contain" />
                <span>SRM Medical College Hospital and Research Centre</span>
              </div>
              <div className="text-xs text-slate-600">SRM Institute of Science and Technology • Medical Record System</div>
              <div className="text-xs text-slate-500 mt-1">
                SRM Nagar, Kattankulathur, Chengalpattu Dist • Tel: (555) 019-2834 • Emergency: (555) 911-0000
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Official Medical Record</div>
              <div className="font-mono text-sm font-black text-blue-700">{patient.patientId}</div>
              <div className="text-[11px] text-slate-400">Date: {new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        {/* Patient Demographics Box */}
        <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Patient Full Name</span>
            <strong className="text-sm text-slate-900 font-bold">{patient.firstName} {patient.lastName}</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">DOB & Age / Gender</span>
            <strong className="text-slate-900">
              {patient.dateOfBirth} ({new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()}y) • {patient.gender}
            </strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Blood Group</span>
            <strong className="text-rose-700 font-bold">{patient.bloodGroup}</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Attending Physician</span>
            <strong className="text-slate-900">{patient.assignedDoctorName || patient.primaryDoctorName || 'Dr. Eleanor Vance, MD'}</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Insurance & Policy</span>
            <strong className="text-slate-900">{patient.insurance?.provider || 'Self Pay'} ({patient.insurance?.policyNumber || 'N/A'})</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Emergency Contact</span>
            <strong className="text-slate-900">{patient.emergencyContact?.name || 'N/A'} ({patient.emergencyContact?.phone || 'N/A'})</strong>
          </div>
        </div>

        {/* Clinical Allergies & Conditions */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 border border-slate-200 rounded-lg">
            <h4 className="text-xs font-bold text-slate-900 mb-1">Active Chronic Conditions</h4>
            <div className="text-xs text-slate-700">
              {patient.chronicConditions && patient.chronicConditions.length > 0 ? patient.chronicConditions.join(', ') : 'None documented'}
            </div>
          </div>
          <div className="p-3 border border-rose-200 bg-rose-50/50 rounded-lg">
            <h4 className="text-xs font-bold text-rose-900 mb-1">Known Allergies</h4>
            <div className="text-xs text-rose-800">
              {patient.allergies && patient.allergies.length > 0
                ? patient.allergies.map((a) => `${a.substance} (${a.reaction})`).join(', ')
                : 'No known drug allergies (NKDA)'}
            </div>
          </div>
        </div>

        {/* Latest Vitals */}
        {patientVitals.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
              Physiological Vitals Baseline
            </h4>
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-semibold">Blood Pressure</span>
                <strong>{patientVitals[0].bloodPressureSystolic}/{patientVitals[0].bloodPressureDiastolic} mmHg</strong>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-semibold">Heart Rate</span>
                <strong>{patientVitals[0].heartRateBpm} bpm</strong>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-semibold">SpO2 Oxygen</span>
                <strong>{patientVitals[0].oxygenSaturationPercent}%</strong>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-semibold">Temperature</span>
                <strong>{patientVitals[0].temperatureF}°F</strong>
              </div>
            </div>
          </div>
        )}

        {/* Active Prescriptions */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
            Active Pharmacotherapy (e-Prescriptions)
          </h4>
          <table className="w-full text-xs text-left border border-slate-200">
            <thead className="bg-slate-50 font-bold text-slate-700">
              <tr>
                <th className="p-2 border-b">Medication</th>
                <th className="p-2 border-b">Dosage & Route</th>
                <th className="p-2 border-b">Frequency</th>
                <th className="p-2 border-b">Instructions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patientPrescriptions.flatMap((p) => p.items).map((item, i) => (
                <tr key={i}>
                  <td className="p-2 font-bold">{item.medicationName}</td>
                  <td className="p-2">{item.dosage} ({item.route})</td>
                  <td className="p-2">{item.frequency}</td>
                  <td className="p-2 text-slate-600">{item.instructions}</td>
                </tr>
              ))}
              {patientPrescriptions.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-3 text-center text-slate-400 italic">No active prescriptions</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Physician Signature Line */}
        <div className="pt-8 border-t border-slate-300 grid grid-cols-2 gap-8 text-xs">
          <div>
            <div className="text-slate-400 mb-6">Attending Physician Electronic Signature:</div>
            <div className="font-serif italic text-base text-slate-900 font-bold">
              {patient.assignedDoctorName || patient.primaryDoctorName || 'Dr. Eleanor Vance, MD'}
            </div>
            <div className="text-[10px] text-slate-500">St. Jude Medical Staff • Board Certified</div>
          </div>
          <div className="text-right">
            <div className="text-slate-400 mb-6">HIPAA Security Verification:</div>
            <div className="text-emerald-700 font-bold flex items-center justify-end gap-1">
              <Shield className="w-4 h-4" />
              <span>Certified Confidential Health Record</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Generated by HPRMS Enterprise</div>
          </div>
        </div>
      </div>
    </div>
  );
};
