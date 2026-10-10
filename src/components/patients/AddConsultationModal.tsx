import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHospital } from '../../context/HospitalContext';
import { X, FileText, CheckCircle2 } from 'lucide-react';
import { ConsultationNote, Diagnosis } from '../../types';

interface AddConsultationModalProps {
  patientId: string;
  onClose: () => void;
}

export const AddConsultationModal: React.FC<AddConsultationModalProps> = ({
  patientId,
  onClose,
}) => {
  const { currentUser } = useAuth();
  const { patients, addConsultation, logAuditEvent } = useHospital();

  const patient = patients.find((p) => p.id === patientId) || patients[0];

  const [consultType, setConsultType] = useState<string>('Inpatient Ward Round');
  const [chiefComplaint, setChiefComplaint] = useState('Substernal chest discomfort on exertion');
  const [subjective, setSubjective] = useState(
    'Patient reports 3-day history of intermittent substernal pressure, worsening with moderate physical activity. No nausea or diaphoresis.'
  );
  const [objective, setObjective] = useState(
    'Alert and oriented x4. BP 142/88 mmHg, HR 78 bpm, SpO2 98% on room air. S1/S2 present, no murmurs or gallops. Lungs clear to auscultation bilaterally.'
  );
  const [assessment, setAssessment] = useState(
    'Atypical Angina Pectoris; Essential Hypertension, moderately controlled.'
  );
  const [plan, setPlan] = useState(
    '1. Order 12-lead ECG and Troponin I serial levels.\n2. Initiate oral beta-blocker (Metoprolol Succinate 25mg daily).\n3. Schedule echocardiography and stress test upon stabilization.'
  );
  const [icd10, setIcd10] = useState('I20.9');

  if (!patient) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const diagnosis: Diagnosis = {
      id: `diag-${Date.now()}`,
      patientId: patient.id,
      icd10Code: icd10,
      description: assessment,
      type: 'Primary',
      diagnosedDate: new Date().toISOString().split('T')[0],
      diagnosedByDoctor: currentUser.name,
      status: 'Active',
    };

    const newConsult = addConsultation({
      patientId: patient.id,
      doctorId: currentUser.id,
      doctorName: currentUser.name,
      doctorSpecialty: currentUser.department || currentUser.specialty || 'Internal Medicine',
      chiefComplaint,
      subjective,
      objective,
      assessment,
      plan,
      diagnoses: [diagnosis],
    });

    logAuditEvent(
      currentUser.id,
      currentUser.name,
      currentUser.role,
      'CREATE_CONSULTATION',
      'EMR',
      newConsult.id,
      `Authored SOAP note for ${patient.firstName} ${patient.lastName} (${icd10})`,
      `${patient.patientId} (${patient.firstName[0]}.${patient.lastName[0]}.)`
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full p-6 shadow-3d-lg space-y-4 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 shadow-inner-bevel">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Author Clinical SOAP Consultation Note</h3>
              <p className="text-xs text-slate-500">
                Patient: <strong className="text-slate-800">{patient.firstName} {patient.lastName}</strong> ({patient.patientId})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3.5 overflow-y-auto flex-1 pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Consultation Type</label>
              <select
                value={consultType}
                onChange={(e) => setConsultType(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none"
              >
                <option value="Initial Outpatient">Initial Outpatient Consultation</option>
                <option value="Follow-up Visit">Follow-up Visit</option>
                <option value="Emergency Intake">Emergency Intake</option>
                <option value="Inpatient Ward Round">Inpatient Daily Ward Round</option>
                <option value="Specialist Referral">Specialist Referral</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">ICD-10 Diagnostic Code</label>
              <input
                type="text"
                required
                value={icd10}
                onChange={(e) => setIcd10(e.target.value)}
                placeholder="e.g. I20.9"
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-blue-700 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Chief Complaint</label>
            <input
              type="text"
              required
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">S - Subjective (History of Present Illness)</label>
            <textarea
              rows={2}
              required
              value={subjective}
              onChange={(e) => setSubjective(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">O - Objective (Physical Findings & Vitals)</label>
            <textarea
              rows={2}
              required
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">A - Assessment (Clinical Impression)</label>
            <textarea
              rows={2}
              required
              value={assessment}
              onChange={(e) => setAssessment(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">P - Plan (Orders, Pharmacotherapy, Follow-up)</label>
            <textarea
              rows={3}
              required
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
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
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-3d-primary btn-3d flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Sign Note</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
