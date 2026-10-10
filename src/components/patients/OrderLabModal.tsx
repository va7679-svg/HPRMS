import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHospital } from '../../context/HospitalContext';
import { X, FlaskConical, CheckCircle2 } from 'lucide-react';
import { LabPriority } from '../../types';

interface OrderLabModalProps {
  patientId: string;
  onClose: () => void;
}

export const OrderLabModal: React.FC<OrderLabModalProps> = ({ patientId, onClose }) => {
  const { currentUser } = useAuth();
  const { patients, orderLabTest, logAuditEvent } = useHospital();

  const patient = patients.find((p) => p.id === patientId) || patients[0];

  const [testName, setTestName] = useState('Complete Blood Count (CBC with Diff)');
  const [category, setCategory] = useState<string>('Hematology');
  const [sampleType, setSampleType] = useState('Whole Blood (EDTA tube)');
  const [priority, setPriority] = useState<LabPriority>('Routine');
  const [clinicalIndication, setClinicalIndication] = useState('Evaluate for systemic infection and anemia.');

  if (!patient) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lab = orderLabTest({
      patientId: patient.id,
      doctorId: currentUser.id,
      doctorName: currentUser.name,
      department: currentUser.department || 'Internal Medicine',
      testName,
      testCategory: category,
      sampleType,
      priority,
      clinicalIndication,
    });

    logAuditEvent(
      currentUser.id,
      currentUser.name,
      currentUser.role,
      'ORDER_LAB_TEST',
      'Lab',
      lab.id,
      `Ordered ${testName} (${priority}) for ${patient.firstName} ${patient.lastName}`,
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
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600 border border-purple-200 shadow-inner-bevel">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Order Diagnostic Laboratory Test</h3>
              <p className="text-xs text-slate-500">
                Patient: <strong className="text-slate-800">{patient.firstName} {patient.lastName}</strong> ({patient.patientId})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Diagnostic Test Name</label>
            <input
              type="text"
              required
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Test Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none"
              >
                <option value="Hematology">Hematology</option>
                <option value="Biochemistry">Biochemistry</option>
                <option value="Microbiology">Microbiology</option>
                <option value="Radiology / Imaging">Radiology / Imaging</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Immunology">Immunology</option>
                <option value="Urinalysis">Urinalysis</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Priority SLA</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as LabPriority)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none"
              >
                <option value="Routine">Routine (24h turnaround)</option>
                <option value="Urgent">Urgent (4h turnaround)</option>
                <option value="STAT (Emergency)">STAT (Emergency &lt; 45min)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Specimen Collection Type</label>
            <input
              type="text"
              value={sampleType}
              onChange={(e) => setSampleType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Indication & Notes</label>
            <textarea
              rows={2}
              value={clinicalIndication}
              onChange={(e) => setClinicalIndication(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow-3d-purple btn-3d flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Lab Order</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
