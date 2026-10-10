import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHospital } from '../../context/HospitalContext';
import { X, LogOut, CheckCircle2 } from 'lucide-react';
import { InpatientAdmission } from '../../types';

interface DischargePatientModalProps {
  admission: InpatientAdmission;
  onClose: () => void;
}

export const DischargePatientModal: React.FC<DischargePatientModalProps> = ({
  admission,
  onClose,
}) => {
  const { currentUser } = useAuth();
  const { patients, dischargePatient, logAuditEvent } = useHospital();

  const patient = patients.find((p) => p.id === admission?.patientId);

  const [condition, setCondition] = useState<InpatientAdmission['dischargeCondition']>('Stable');
  const [finalDiagnosis, setFinalDiagnosis] = useState(admission.initialDiagnosis || 'Acute clinical stabilization achieved');
  const [courseInHospital, setCourseInHospital] = useState(
    'Patient admitted for monitoring and therapeutic stabilization. Vitals stabilized, tolerated medications well, and achieved hemodynamic recovery.'
  );
  const [dietary, setDietary] = useState('Low sodium, heart-healthy balanced diet.');
  const [activity, setActivity] = useState('Light ambulation as tolerated, avoid heavy lifting for 7 days.');
  const [followUpDoctor, setFollowUpDoctor] = useState(admission.admittingDoctorName || currentUser.name);

  if (!admission) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    dischargePatient(
      admission.id,
      {
        finalDiagnosis,
        courseInHospital,
        proceduresPerformed: ['Routine Inpatient Monitoring & Supportive Care'],
        dischargeMedications: ['Prescribed discharge pharmacotherapy via EMR'],
        dietaryInstructions: dietary,
        activityRestrictions: activity,
        followUpDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        followUpDoctor,
        warningSignsToSeekImmediateCare: [
          'High fever (>101°F)',
          'Chest discomfort or worsening shortness of breath',
          'Persistent vomiting or dizziness',
        ],
      },
      condition
    );

    logAuditEvent(
      currentUser.id,
      currentUser.name,
      currentUser.role,
      'DISCHARGE_PATIENT',
      'Admission',
      admission.id,
      `Discharged patient from ${admission.ward} Bed ${admission.bedNumber} (Condition: ${condition})`,
      patient ? `${patient.patientId} (${patient.firstName[0]}.${patient.lastName[0]}.)` : undefined
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 shadow-3d-lg space-y-4 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 shadow-inner-bevel">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Inpatient Discharge Protocol</h3>
              <p className="text-xs text-slate-500">
                {patient ? `${patient.firstName} ${patient.lastName} (${patient.patientId})` : 'Patient Discharge'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Admission Summary */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1 shrink-0">
          <div><strong>Location:</strong> {admission.ward} — Bed {admission.bedNumber}</div>
          <div><strong>Admitted On:</strong> {admission.admissionDate ? new Date(admission.admissionDate).toLocaleDateString() : 'Active'}</div>
          <div><strong>Attending Physician:</strong> {admission.admittingDoctorName}</div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 overflow-y-auto flex-1 pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Discharge Condition <span className="text-rose-500">*</span>
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none"
              >
                <option value="Recovered">Recovered</option>
                <option value="Improved">Improved</option>
                <option value="Stable">Stable</option>
                <option value="Transferred">Transferred</option>
                <option value="Against Medical Advice">Against Medical Advice (AMA)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Follow-Up Attending
              </label>
              <input
                type="text"
                value={followUpDoctor}
                onChange={(e) => setFollowUpDoctor(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Final Clinical Diagnosis <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={finalDiagnosis}
              onChange={(e) => setFinalDiagnosis(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Clinical Hospital Course Summary
            </label>
            <textarea
              rows={2}
              required
              value={courseInHospital}
              onChange={(e) => setCourseInHospital(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Dietary Instructions
            </label>
            <input
              type="text"
              value={dietary}
              onChange={(e) => setDietary(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Activity Restrictions & Rehabilitation
            </label>
            <input
              type="text"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-3d-red btn-3d flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Process Discharge</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
