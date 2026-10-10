import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHospital } from '../../context/HospitalContext';
import { X, Pill, Plus, Trash2, CheckCircle2, ShieldAlert } from 'lucide-react';
import { PrescriptionItem } from '../../types';

interface AddPrescriptionModalProps {
  patientId: string;
  onClose: () => void;
}

export const AddPrescriptionModal: React.FC<AddPrescriptionModalProps> = ({
  patientId,
  onClose,
}) => {
  const { currentUser } = useAuth();
  const { patients, createPrescription, logAuditEvent } = useHospital();

  const patient = patients.find((p) => p.id === patientId) || patients[0];

  const [items, setItems] = useState<Omit<PrescriptionItem, 'id' | 'dispensedStatus'>[]>([
    {
      medicationName: 'Amoxicillin-Clavulanate 875mg',
      genericName: 'Amoxicillin-Clavulanate',
      dosage: '875mg / 125mg',
      route: 'Oral',
      frequency: 'BID (Twice daily)',
      durationDays: 7,
      quantity: 14,
      refillsAllowed: 0,
      instructions: 'Take with meals. Complete full 7-day course.',
    },
  ]);

  const [pharmacyNotes, setPharmacyNotes] = useState('Standard oral outpatient protocol.');

  if (!patient) return null;

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        medicationName: 'Lisinopril 10mg',
        genericName: 'Lisinopril',
        dosage: '10mg',
        route: 'Oral',
        frequency: 'QD (Once daily in morning)',
        durationDays: 30,
        quantity: 30,
        refillsAllowed: 2,
        instructions: 'Take in morning with water. Monitor BP weekly.',
      },
    ]);
  };

  const handleRemoveItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Please add at least one medication item.');
      return;
    }

    const prescription = createPrescription({
      patientId: patient.id,
      doctorId: currentUser.id,
      doctorName: currentUser.name,
      overallStatus: 'Active',
      pharmacyNotes,
      items: items.map((it, idx) => ({
        ...it,
        id: `rx-item-${Date.now()}-${idx}`,
        dispensedStatus: 'Pending',
      })),
    });

    logAuditEvent(
      currentUser.id,
      currentUser.name,
      currentUser.role,
      'PRESCRIBE_MEDICATION',
      'Prescription',
      prescription.id,
      `Issued e-Prescription ${prescription.prescriptionNumber} for ${items.length} medications`,
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
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-inner-bevel">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Issue Electronic Prescription (e-Rx)</h3>
              <p className="text-xs text-slate-500">
                Patient: <strong className="text-slate-800">{patient.firstName} {patient.lastName}</strong> ({patient.patientId})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Known Allergies Warning */}
        {patient.allergies.length > 0 && (
          <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-800 shrink-0">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              <strong>Allergy Alert:</strong> Patient has known sensitivities to:{' '}
              <strong className="underline">{patient.allergies.map((a) => a.substance).join(', ')}</strong>
            </span>
          </div>
        )}

        {/* Items List */}
        <form onSubmit={handleSubmit} className="space-y-3.5 overflow-y-auto flex-1 pr-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700">Prescribed Pharmacotherapy Items</label>
            <button
              type="button"
              onClick={handleAddItem}
              className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Medication</span>
            </button>
          </div>

          {items.map((item, idx) => (
            <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2 relative">
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveItem(idx)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Medication Name</label>
                  <input
                    type="text"
                    required
                    value={item.medicationName}
                    onChange={(e) => {
                      const next = [...items];
                      next[idx].medicationName = e.target.value;
                      setItems(next);
                    }}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Dosage / Strength</label>
                  <input
                    type="text"
                    required
                    value={item.dosage}
                    onChange={(e) => {
                      const next = [...items];
                      next[idx].dosage = e.target.value;
                      setItems(next);
                    }}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Route</label>
                  <select
                    value={item.route}
                    onChange={(e) => {
                      const next = [...items];
                      next[idx].route = e.target.value as any;
                      setItems(next);
                    }}
                    className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs font-semibold"
                  >
                    <option value="Oral">Oral</option>
                    <option value="IV">IV</option>
                    <option value="IM">IM</option>
                    <option value="Topical">Topical</option>
                    <option value="Inhalation">Inhalation</option>
                    <option value="Sublingual">Sublingual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Frequency</label>
                  <input
                    type="text"
                    value={item.frequency}
                    onChange={(e) => {
                      const next = [...items];
                      next[idx].frequency = e.target.value;
                      setItems(next);
                    }}
                    className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Duration (Days)</label>
                  <input
                    type="number"
                    value={item.durationDays}
                    onChange={(e) => {
                      const next = [...items];
                      next[idx].durationDays = Number(e.target.value);
                      setItems(next);
                    }}
                    className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Quantity</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      const next = [...items];
                      next[idx].quantity = Number(e.target.value);
                      setItems(next);
                    }}
                    className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Dispensing Instructions</label>
                <input
                  type="text"
                  value={item.instructions}
                  onChange={(e) => {
                    const next = [...items];
                    next[idx].instructions = e.target.value;
                    setItems(next);
                  }}
                  className="w-full px-2.5 py-1 bg-white border border-slate-300 rounded text-xs text-slate-700 focus:outline-none"
                />
              </div>
            </div>
          ))}

          {/* Pharmacy / Clinical Notes */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Pharmacy Special Instructions</label>
            <input
              type="text"
              value={pharmacyNotes}
              onChange={(e) => setPharmacyNotes(e.target.value)}
              className="w-full px-2.5 py-1 bg-white border border-slate-300 rounded text-xs text-slate-700 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-3d-emerald btn-3d flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Authorize e-Prescription</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
