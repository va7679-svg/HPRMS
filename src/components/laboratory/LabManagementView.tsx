import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHospital } from '../../context/HospitalContext';
import {
  FlaskConical,
  Activity,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  FileCheck,
  Sparkles,
  Layers,
} from 'lucide-react';
import { LabOrder, LabTestStatus, LabTestParameter } from '../../types';
import { OrderLabModal } from '../patients/OrderLabModal';

export const LabManagementView: React.FC = () => {
  const { currentUser, hasPermission, users } = useAuth();
  const {
    labOrders,
    patients,
    updateLabResults,
    setSelectedPatientId,
    setActiveView,
    logAuditEvent,
  } = useHospital();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedLabForResults, setSelectedLabForResults] = useState<LabOrder | null>(null);

  // Result entry form state
  const [resultsInput, setResultsInput] = useState<{
    parameterName: string;
    measuredValue: string;
    unit: string;
    referenceRange: string;
    flag: 'Normal' | 'High' | 'Low' | 'Critical High' | 'Critical Low';
  }[]>([
    { parameterName: 'Hemoglobin', measuredValue: '14.2', unit: 'g/dL', referenceRange: '13.5 - 17.5', flag: 'Normal' },
    { parameterName: 'WBC Count', measuredValue: '7.8', unit: 'x10^3/uL', referenceRange: '4.5 - 11.0', flag: 'Normal' },
  ]);

  // Filter orders visible to user
  const userVisibleOrders = labOrders.filter((order) => {
    if (currentUser.role === 'patient') {
      const patientRecord = patients.find(
        (p) => p.email.toLowerCase() === currentUser.email.toLowerCase()
      );
      if (patientRecord) {
        return order.patientId === patientRecord.id;
      }
    }
    return true;
  });

  const filteredOrders = userVisibleOrders.filter((order) => {
    const matchesCat = selectedCategory === 'ALL' || order.testCategory === selectedCategory;
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    const patient = patients.find((p) => p.id === order.patientId);
    const matchesSearch =
      order.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (patient && `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (patient && patient.patientId.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCat && matchesStatus && matchesSearch;
  });

  const handleAddResultRow = () => {
    setResultsInput([
      ...resultsInput,
      { parameterName: 'Serum Marker', measuredValue: '0.0', unit: 'mg/dL', referenceRange: '0 - 1.0', flag: 'Normal' },
    ]);
  };

  const handleSaveResults = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLabForResults) return;

    const formattedResults: LabTestParameter[] = resultsInput.map((r) => ({
      parameterName: r.parameterName,
      name: r.parameterName,
      measuredValue: r.measuredValue,
      value: r.measuredValue,
      unit: r.unit,
      referenceRange: r.referenceRange,
      flag: r.flag,
      isAbnormal: r.flag !== 'Normal',
    }));

    updateLabResults(
      selectedLabForResults.id,
      formattedResults,
      'Specimen analysis completed and verified by laboratory diagnostics staff.',
      currentUser.name,
      `Verified ${resultsInput.length} parameters for ${selectedLabForResults.testName}.`
    );

    logAuditEvent(
      currentUser.id,
      currentUser.name,
      currentUser.role,
      'COMPLETE_LAB_TEST',
      'Lab',
      selectedLabForResults.id,
      `Entered and verified diagnostic test results for ${selectedLabForResults.testName}`
    );

    setSelectedLabForResults(null);
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-3d">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 border border-purple-500/20 shadow-inner-bevel">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Diagnostic Laboratory & Pathology</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  LIMS Engine
                </span>
              </h1>
              <p className="text-xs text-slate-500">
                Specimen barcode tracking, automated chemistry/hematology results, reference flags, and turnaround SLA
              </p>
            </div>
          </div>
        </div>

        {hasPermission('orderLabTests') && (
          <button
            onClick={() => setShowOrderModal(true)}
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow-3d-purple btn-3d flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Order Diagnostic Test</span>
          </button>
        )}
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-3d card-3d-lift">
          <div className="text-xs text-slate-500 font-semibold mb-1">Total Lab Orders</div>
          <div className="text-2xl font-extrabold text-slate-900">{labOrders.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Clinical diagnostics catalog</div>
        </div>

        <div className="bg-white border border-amber-200 rounded-xl p-3.5 shadow-3d card-3d-lift">
          <div className="text-xs text-amber-600 font-semibold mb-1">In Processing / Pending</div>
          <div className="text-2xl font-extrabold text-amber-700">
            {labOrders.filter((l) => l.status === 'Processing' || l.status === 'Ordered').length}
          </div>
          <div className="text-[11px] text-amber-600/80 mt-0.5">Specimen in analysis queue</div>
        </div>

        <div className="bg-white border border-emerald-200 rounded-xl p-3.5 shadow-3d card-3d-lift">
          <div className="text-xs text-emerald-600 font-semibold mb-1">Completed & Verified</div>
          <div className="text-2xl font-extrabold text-emerald-700">
            {labOrders.filter((l) => l.status === 'Completed' || l.status === 'Verified').length}
          </div>
          <div className="text-[11px] text-emerald-600/80 mt-0.5">Synced to patient EMR</div>
        </div>

        <div className="bg-white border border-rose-200 rounded-xl p-3.5 shadow-3d card-3d-lift">
          <div className="text-xs text-rose-600 font-semibold mb-1">Critical Value Flags</div>
          <div className="text-2xl font-extrabold text-rose-700">
            {labOrders.filter((l) => l.results?.some((r) => r.flag === 'Critical High' || r.flag === 'Critical Low' || r.flag === 'High')).length}
          </div>
          <div className="text-[11px] text-rose-600/80 mt-0.5">Physician alert triggered</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-3d grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search test name, doctor, patient MRN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none"
          >
            <option value="ALL">All Diagnostic Categories</option>
            <option value="Hematology">Hematology</option>
            <option value="Biochemistry">Biochemistry</option>
            <option value="Microbiology">Microbiology</option>
            <option value="Radiology">Radiology & Imaging</option>
            <option value="Pathology">Pathology</option>
            <option value="Immunology">Immunology</option>
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="Ordered">Ordered / Specimen Collection</option>
            <option value="Sample Collected">Sample Collected</option>
            <option value="Processing">Processing in Lab</option>
            <option value="Completed">Completed & Verified</option>
            <option value="Verified">Verified</option>
          </select>
        </div>
      </div>

      {/* Lab Orders List */}
      <div className="space-y-3">
        {filteredOrders.map((order) => {
          const patient = patients.find((p) => p.id === order.patientId);

          return (
            <div
              key={order.id}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-3d card-3d-lift space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-purple-50 text-purple-600 border border-purple-200 shadow-inner-bevel">
                    <FlaskConical className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{order.testName}</h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                        {order.testCategory}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Patient: <strong className="text-slate-800">{patient ? `${patient.firstName} ${patient.lastName}` : 'Patient'}</strong> ({patient?.patientId || 'MRN'}) • Ordered by: {order.doctorName}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                      order.status === 'Completed' || order.status === 'Verified'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : order.status === 'Processing'
                        ? 'bg-blue-100 text-blue-800 border-blue-200 animate-pulse'
                        : 'bg-amber-100 text-amber-800 border-amber-200'
                    }`}
                  >
                    {order.status}
                  </span>

                  {hasPermission('enterLabResults') && order.status !== 'Completed' && order.status !== 'Verified' && (
                    <button
                      onClick={() => setSelectedLabForResults(order)}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-bold shadow-3d-purple btn-3d cursor-pointer"
                    >
                      Enter Results
                    </button>
                  )}
                </div>
              </div>

              {/* Lab Results Table */}
              {order.results && order.results.length > 0 ? (
                <div className="bg-slate-50 rounded-lg border border-slate-200 p-3">
                  <div className="text-xs font-bold text-slate-700 mb-2">Verified Diagnostic Parameters:</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {order.results.map((res, i) => (
                      <div key={i} className="p-2 bg-white rounded border border-slate-200 shadow-inner-bevel">
                        <div className="text-[10px] text-slate-500 uppercase font-semibold">{res.parameterName || res.name}</div>
                        <div className={`text-sm font-extrabold ${res.flag === 'Normal' ? 'text-slate-900' : 'text-rose-700'}`}>
                          {res.measuredValue || res.value} <span className="text-xs font-normal text-slate-500">{res.unit}</span>
                        </div>
                        <div className="text-[9px] text-slate-400 mt-0.5">
                          Ref: {res.referenceRange} • <strong className={res.flag === 'Normal' ? 'text-emerald-600' : 'text-rose-600'}>{res.flag}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic p-2 bg-slate-50 rounded">
                  Specimen collected ({order.sampleType || 'Standard Specimen'}). Awaiting laboratory technician verification.
                </div>
              )}
            </div>
          );
        })}

        {filteredOrders.length === 0 && (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-xl shadow-3d">
            <FlaskConical className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-900">No Lab Orders Found</h3>
            <p className="text-xs text-slate-500">No active diagnostic orders match the current criteria.</p>
          </div>
        )}
      </div>

      {/* Order Lab Modal */}
      {showOrderModal && (
        <OrderLabModal
          patientId={patients[0]?.id || ''}
          onClose={() => setShowOrderModal(false)}
        />
      )}

      {/* Enter Lab Results Modal */}
      {selectedLabForResults && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full p-6 shadow-3d-lg space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Enter Verified Diagnostic Results</h3>
              <p className="text-xs text-slate-500">
                {selectedLabForResults.testName} ({selectedLabForResults.testCategory})
              </p>
            </div>

            <form onSubmit={handleSaveResults} className="space-y-3">
              {resultsInput.map((row, idx) => (
                <div key={idx} className="grid grid-cols-5 gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="col-span-2">
                    <label className="text-[10px] text-slate-500 font-bold block mb-0.5">Parameter</label>
                    <input
                      type="text"
                      value={row.parameterName}
                      onChange={(e) => {
                        const next = [...resultsInput];
                        next[idx].parameterName = e.target.value;
                        setResultsInput(next);
                      }}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 font-bold block mb-0.5">Value</label>
                    <input
                      type="text"
                      value={row.measuredValue}
                      onChange={(e) => {
                        const next = [...resultsInput];
                        next[idx].measuredValue = e.target.value;
                        setResultsInput(next);
                      }}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 font-bold block mb-0.5">Unit</label>
                    <input
                      type="text"
                      value={row.unit}
                      onChange={(e) => {
                        const next = [...resultsInput];
                        next[idx].unit = e.target.value;
                        setResultsInput(next);
                      }}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 font-bold block mb-0.5">Flag</label>
                    <select
                      value={row.flag}
                      onChange={(e) => {
                        const next = [...resultsInput];
                        next[idx].flag = e.target.value as any;
                        setResultsInput(next);
                      }}
                      className="w-full px-1.5 py-1 bg-white border border-slate-300 rounded text-xs font-bold"
                    >
                      <option value="Normal">Normal</option>
                      <option value="High">High</option>
                      <option value="Low">Low</option>
                      <option value="Critical High">Critical High</option>
                      <option value="Critical Low">Critical Low</option>
                    </select>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddResultRow}
                className="text-xs text-purple-700 font-bold hover:underline cursor-pointer"
              >
                + Add Another Parameter Row
              </button>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedLabForResults(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow-3d-purple btn-3d cursor-pointer"
                >
                  Save & Verify Results
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
