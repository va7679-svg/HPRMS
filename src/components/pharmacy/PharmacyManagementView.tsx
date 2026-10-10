import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHospital } from '../../context/HospitalContext';
import {
  Pill,
  Search,
  CheckCircle2,
  AlertTriangle,
  Package,
  Layers,
  Sparkles,
  ClipboardList,
} from 'lucide-react';
import { Prescription, PrescriptionItem } from '../../types';

export const PharmacyManagementView: React.FC = () => {
  const { currentUser, hasPermission } = useAuth();
  const {
    prescriptions,
    inventory,
    patients,
    dispensePrescriptionItem,
    updateInventoryStock,
    logAuditEvent,
  } = useHospital();

  const [activeTab, setActiveTab] = useState<'prescriptions' | 'inventory'>('prescriptions');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Filter prescriptions
  const userVisiblePrescriptions = prescriptions.filter((rx) => {
    if (currentUser.role === 'patient') {
      const patientRecord = patients.find(
        (p) => p.email.toLowerCase() === currentUser.email.toLowerCase()
      );
      if (patientRecord) {
        return rx.patientId === patientRecord.id;
      }
    }
    return true;
  });

  const filteredPrescriptions = userVisiblePrescriptions.filter((rx) => {
    const matchesStatus = statusFilter === 'ALL' || rx.overallStatus === statusFilter;
    const patient = patients.find((p) => p.id === rx.patientId);
    const matchesSearch =
      rx.prescriptionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (patient && `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (patient && patient.patientId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      rx.items.some((i) => i.medicationName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  // Filter inventory
  const filteredInventory = inventory.filter(
    (med) =>
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.batchNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPrescriptions = prescriptions.length;
  const fulfilledPrescriptions = prescriptions.filter((rx) => rx.overallStatus === 'Fulfilled').length;
  const pendingPrescriptions = totalPrescriptions - fulfilledPrescriptions;
  const lowStockCount = inventory.filter((i) => i.stockQuantity <= i.reorderLevel).length;

  const handleDispenseItem = (rxId: string, itemId: string, medName: string) => {
    dispensePrescriptionItem(rxId, itemId, currentUser.name);

    logAuditEvent(
      currentUser.id,
      currentUser.name,
      currentUser.role,
      'DISPENSE_MEDICATION',
      'Pharmacy',
      rxId,
      `Dispensed ${medName} to patient under prescription ${rxId}`
    );
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-3d">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shadow-inner-bevel">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Pharmacy & Digital Formulary Dispensary
              </h2>
              <p className="text-xs text-slate-500">
                e-Prescription queue fulfillment, allergy verification & batch-level formulary stock
              </p>
            </div>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner-bevel">
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'prescriptions'
                ? 'bg-white text-slate-900 shadow-3d-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>e-Prescriptions ({pendingPrescriptions} Pending)</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-white text-slate-900 shadow-3d-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Medication Formulary ({inventory.length})</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-3d">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Prescriptions</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalPrescriptions}</div>
          <div className="text-[10px] text-blue-600 font-semibold mt-1">In EMR registry</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-3d">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Awaiting Dispensing</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{pendingPrescriptions}</div>
          <div className="text-[10px] text-amber-700 font-semibold mt-1">Pending pharmacist review</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-3d">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Fulfilled & Verified</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{fulfilledPrescriptions}</div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-1">Dispensed to patients</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-3d">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Low Formulary Alerts</div>
          <div className="text-2xl font-black text-rose-600 mt-1">{lowStockCount}</div>
          <div className="text-[10px] text-rose-700 font-semibold mt-1">Below reorder threshold</div>
        </div>
      </div>

      {/* TAB 1: PRESCRIPTIONS */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-3">
          {/* Controls Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-3d flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search prescription number, patient name, doctor, or medication..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none"
              >
                <option value="ALL">All Prescription Statuses</option>
                <option value="Active">Active (Pending)</option>
                <option value="Fulfilled">Fulfilled (Dispensed)</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Prescriptions List */}
          <div className="space-y-3">
            {filteredPrescriptions.map((rx) => {
              const patient = patients.find((p) => p.id === rx.patientId);

              return (
                <div
                  key={rx.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 shadow-3d card-3d-lift space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-inner-bevel">
                        <Pill className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-blue-700">{rx.prescriptionNumber}</span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                              rx.overallStatus === 'Fulfilled'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                : 'bg-amber-100 text-amber-800 border-amber-200'
                            }`}
                          >
                            {rx.overallStatus}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">
                          Patient: <strong className="text-slate-800">{patient ? `${patient.firstName} ${patient.lastName}` : 'Patient'}</strong> ({patient?.patientId || 'MRN'}) • Prescribed by {rx.doctorName}
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-400 font-mono">
                      Issued: {new Date(rx.prescribedDate).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Medications Ordered */}
                  <div className="space-y-2">
                    {rx.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{item.medicationName} ({item.dosage})</div>
                          <div className="text-xs text-slate-600 mt-0.5">
                            Route: {item.route} • Frequency: {item.frequency} • Duration: {item.durationDays} days
                          </div>
                          <div className="text-[11px] text-slate-500 italic mt-0.5">Instructions: {item.instructions}</div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded font-semibold ${
                              item.dispensedStatus === 'Dispensed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {item.dispensedStatus}
                          </span>

                          {hasPermission('dispenseMedications') && item.dispensedStatus !== 'Dispensed' && (
                            <button
                              onClick={() => handleDispenseItem(rx.id, item.id, item.medicationName)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold shadow-3d-emerald btn-3d cursor-pointer"
                            >
                              Dispense & Sign
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: INVENTORY */}
      {activeTab === 'inventory' && (
        <div className="space-y-3">
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-3d">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search medication formulary, NDC batch, drug category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-3d">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Medication Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Strength & Unit</th>
                    <th className="p-3">Stock Level</th>
                    <th className="p-3">Unit Price</th>
                    <th className="p-3">Status</th>
                    {hasPermission('dispenseMedications') && <th className="p-3 text-right">Stock Adjust</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredInventory.map((med) => {
                    const isLow = med.stockQuantity <= med.reorderLevel;

                    return (
                      <tr key={med.id} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-bold text-slate-900">
                          <div>{med.name}</div>
                          <div className="text-[10px] text-slate-500 font-normal">{med.genericName} • Batch: {med.batchNumber}</div>
                        </td>
                        <td className="p-3">{med.category}</td>
                        <td className="p-3 font-mono text-slate-600">{med.strength}</td>
                        <td className="p-3 font-mono font-bold text-slate-900">
                          {med.stockQuantity} units
                        </td>
                        <td className="p-3 font-mono font-semibold">${med.unitPriceUsd}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              isLow
                                ? 'bg-rose-100 text-rose-700 border-rose-200'
                                : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                            }`}
                          >
                            {isLow ? 'LOW STOCK' : 'ADEQUATE'}
                          </span>
                        </td>
                        {hasPermission('dispenseMedications') && (
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                const addAmount = prompt(`Add stock quantity for ${med.name}:`, '50');
                                if (addAmount && !isNaN(Number(addAmount))) {
                                  updateInventoryStock(med.id, Number(addAmount));
                                }
                              }}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded text-[11px] shadow-3d-sm cursor-pointer"
                            >
                              + Restock
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
