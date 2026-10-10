import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHospital } from '../../context/HospitalContext';
import {
  HeartPulse,
  Activity,
  FileText,
  Pill,
  FlaskConical,
  BedDouble,
  ShieldAlert,
  Printer,
  Plus,
  ArrowLeft,
  Calendar,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { VitalsChart } from './VitalsChart';
import { AddVitalsModal } from './AddVitalsModal';
import { AddConsultationModal } from './AddConsultationModal';
import { AddPrescriptionModal } from './AddPrescriptionModal';
import { OrderLabModal } from './OrderLabModal';
import { AdmitPatientModal } from './AdmitPatientModal';
import { PrintSummaryModal } from './PrintSummaryModal';
import { ClinicalAssistantModal } from '../clinical-ai/ClinicalAssistantModal';

interface EMRDetailViewProps {
  patientId?: string;
  onBack?: () => void;
}

export const EMRDetailView: React.FC<EMRDetailViewProps> = ({ patientId, onBack }) => {
  const { currentUser, hasPermission } = useAuth();
  const {
    patients,
    selectedPatientId,
    setActiveView,
    vitals,
    consultations,
    prescriptions,
    labOrders,
    admissions,
  } = useHospital();

  const currentId = patientId || selectedPatientId;
  const patient = patients.find((p) => p.id === currentId) || patients[0];

  const [activeTab, setActiveTab] = useState<'timeline' | 'vitals' | 'consults' | 'rx' | 'labs' | 'admissions'>('timeline');

  // Modals state
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [showRxModal, setShowRxModal] = useState(false);
  const [showLabModal, setShowLabModal] = useState(false);
  const [showAdmitModal, setShowAdmitModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  if (!patient) {
    return (
      <div className="p-8 bg-white border border-slate-200 rounded-xl shadow-3d text-center space-y-3">
        <HeartPulse className="w-10 h-10 text-slate-400 mx-auto" />
        <h3 className="text-base font-bold text-slate-900">No Patient Selected</h3>
        <p className="text-xs text-slate-500">Please select a patient from the Patient Registry to view their electronic health record.</p>
        <button
          onClick={() => setActiveView('patients')}
          className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-3d-primary btn-3d cursor-pointer"
        >
          Go to Patient Registry
        </button>
      </div>
    );
  }

  // Filter patient related records
  const patientVitals = vitals.filter((v) => v.patientId === patient.id);
  const patientConsults = consultations.filter((c) => c.patientId === patient.id);
  const patientPrescriptions = prescriptions.filter((p) => p.patientId === patient.id);
  const patientLabs = labOrders.filter((l) => l.patientId === patient.id);
  const patientAdmissions = admissions.filter((a) => a.patientId === patient.id);

  const latestVital = patientVitals[0];

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Top Patient Header Banner with 3D Depth */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-3d space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition shadow-3d-sm btn-3d cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-3d-primary shadow-inner-bevel">
              {patient.firstName[0]}
              {patient.lastName[0]}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {patient.firstName} {patient.lastName}
                </h1>
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  MRN: {patient.patientId}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                    patient.status === 'Inpatient'
                      ? 'bg-rose-100 text-rose-700 border-rose-200'
                      : patient.status === 'Emergency'
                      ? 'bg-purple-100 text-purple-700 border-purple-200'
                      : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {patient.status}
                </span>
              </div>

              <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3 mt-1">
                <span>DOB: <strong className="text-slate-800">{patient.dateOfBirth}</strong> ({patient.gender})</span>
                <span>•</span>
                <span>Blood Group: <strong className="text-rose-600 font-bold">{patient.bloodGroup}</strong></span>
                <span>•</span>
                <span>Primary MD: <strong className="text-slate-800">{patient.assignedDoctorName || patient.primaryDoctorName}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAiModal(true)}
              className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold shadow-3d-sm btn-3d flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              <span>Consult Dr.AI</span>
            </button>

            <button
              onClick={() => setShowPrintModal(true)}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold shadow-3d-sm btn-3d flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print EHR Summary</span>
            </button>
          </div>
        </div>

        {/* Demographics & Clinical Tags Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-100 text-xs">
          <div className="p-2 bg-slate-50 rounded-lg border border-slate-200/80">
            <div className="text-[10px] text-slate-500 font-semibold uppercase">Phone / Contact</div>
            <div className="font-bold text-slate-800 truncate">{patient.phone}</div>
          </div>
          <div className="p-2 bg-slate-50 rounded-lg border border-slate-200/80">
            <div className="text-[10px] text-slate-500 font-semibold uppercase">Insurance Policy</div>
            <div className="font-bold text-slate-800 truncate">{patient.insurance?.provider || 'Direct Pay'}</div>
          </div>
          <div className="p-2 bg-slate-50 rounded-lg border border-slate-200/80">
            <div className="text-[10px] text-slate-500 font-semibold uppercase">Emergency Contact</div>
            <div className="font-bold text-slate-800 truncate">{patient.emergencyContact?.name || 'N/A'} ({patient.emergencyContact?.phone || 'N/A'})</div>
          </div>
          <div className="p-2 bg-slate-50 rounded-lg border border-slate-200/80">
            <div className="text-[10px] text-slate-500 font-semibold uppercase">Known Allergies</div>
            <div className="font-bold text-rose-700 truncate">
              {patient.allergies && patient.allergies.length > 0 ? patient.allergies.map((a) => a.substance).join(', ') : 'NKDA (None)'}
            </div>
          </div>
        </div>
      </div>

      {/* Live Vitals Ribbon Banner */}
      {latestVital && (
        <div className="bg-gradient-to-r from-blue-50 via-white to-slate-50 border border-blue-200 rounded-xl p-3.5 shadow-3d">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-rose-600 animate-pulse" />
              <span className="text-xs font-bold text-slate-900">Latest Physiological Telemetry</span>
              <span className="text-[10px] text-slate-500">Recorded: {new Date(latestVital.recordedAt).toLocaleString()} by {latestVital.recordedBy || 'Staff'}</span>
            </div>
            {hasPermission('recordVitals') && (
              <button
                onClick={() => setShowVitalsModal(true)}
                className="text-[11px] font-bold text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Record New Vitals</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-inner-bevel">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Blood Pressure</div>
              <div className="text-base font-extrabold text-slate-900 font-mono">
                {latestVital.bloodPressureSystolic}/{latestVital.bloodPressureDiastolic} <span className="text-[10px] font-normal text-slate-500">mmHg</span>
              </div>
            </div>

            <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-inner-bevel">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Heart Rate</div>
              <div className="text-base font-extrabold text-rose-700 font-mono">
                {latestVital.heartRateBpm} <span className="text-[10px] font-normal text-slate-500">bpm</span>
              </div>
            </div>

            <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-inner-bevel">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Oxygen (SpO2)</div>
              <div className="text-base font-extrabold text-blue-700 font-mono">
                {latestVital.oxygenSaturationPercent}% <span className="text-[10px] font-normal text-slate-500">Room air</span>
              </div>
            </div>

            <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-inner-bevel">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Body Temp</div>
              <div className="text-base font-extrabold text-slate-900 font-mono">
                {latestVital.temperatureF}°F <span className="text-[10px] font-normal text-slate-500">Oral</span>
              </div>
            </div>

            <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-inner-bevel col-span-2 sm:col-span-1">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Blood Glucose</div>
              <div className="text-base font-extrabold text-amber-700 font-mono">
                {latestVital.bloodGlucoseMgDl ? `${latestVital.bloodGlucoseMgDl} mg/dL` : '--'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-3 pt-2 rounded-t-xl shadow-3d-sm overflow-x-auto">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-2 rounded-t-lg text-xs font-bold transition border-b-2 whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'timeline'
              ? 'border-blue-600 text-blue-700 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Care Timeline</span>
        </button>

        <button
          onClick={() => setActiveTab('vitals')}
          className={`px-4 py-2 rounded-t-lg text-xs font-bold transition border-b-2 whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'vitals'
              ? 'border-blue-600 text-blue-700 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Vitals Trends & Chart ({patientVitals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('consults')}
          className={`px-4 py-2 rounded-t-lg text-xs font-bold transition border-b-2 whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'consults'
              ? 'border-blue-600 text-blue-700 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Clinical SOAP Notes ({patientConsults.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rx')}
          className={`px-4 py-2 rounded-t-lg text-xs font-bold transition border-b-2 whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'rx'
              ? 'border-blue-600 text-blue-700 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Pill className="w-3.5 h-3.5" />
          <span>Prescriptions & Meds ({patientPrescriptions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('labs')}
          className={`px-4 py-2 rounded-t-lg text-xs font-bold transition border-b-2 whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'labs'
              ? 'border-blue-600 text-blue-700 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5" />
          <span>Diagnostics & Labs ({patientLabs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('admissions')}
          className={`px-4 py-2 rounded-t-lg text-xs font-bold transition border-b-2 whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'admissions'
              ? 'border-blue-600 text-blue-700 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <BedDouble className="w-3.5 h-3.5" />
          <span>Inpatient Admissions ({patientAdmissions.length})</span>
        </button>
      </div>

      {/* TAB CONTENT 1: TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-3">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-3d flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Multidisciplinary Care Activity Feed</h3>
              <div className="flex items-center gap-2">
                {hasPermission('createDiagnosis') && (
                  <button
                    onClick={() => setShowConsultModal(true)}
                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold shadow-3d-primary btn-3d flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>SOAP Note</span>
                  </button>
                )}
                {hasPermission('createPrescriptions') && (
                  <button
                    onClick={() => setShowRxModal(true)}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold shadow-3d-emerald btn-3d flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>e-Prescribe</span>
                  </button>
                )}
                {hasPermission('orderLabTests') && (
                  <button
                    onClick={() => setShowLabModal(true)}
                    className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-bold shadow-3d-purple btn-3d flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Order Lab</span>
                  </button>
                )}
              </div>
            </div>

            {/* Timeline Items */}
            <div className="space-y-3">
              {patientConsults.map((c) => (
                <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-3d card-3d-lift space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Clinical Consultation</div>
                        <div className="text-[10px] text-slate-500">{c.doctorName} ({c.doctorSpecialty})</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">{new Date(c.consultationDate || c.date || Date.now()).toLocaleString()}</span>
                  </div>

                  <div className="text-xs space-y-1.5">
                    <div><strong className="text-slate-700">Chief Complaint:</strong> <span className="text-slate-900">{c.chiefComplaint}</span></div>
                    <div>
                      <strong className="text-slate-700">Diagnosis:</strong>{' '}
                      <span className="text-slate-900 font-semibold">
                        {c.diagnoses && c.diagnoses.length > 0 ? `${c.diagnoses[0].description} (${c.diagnoses[0].icd10Code})` : c.assessment}
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-[11px] leading-relaxed">
                      <strong className="text-slate-900">Treatment Plan:</strong> {c.plan}
                    </div>
                  </div>
                </div>
              ))}

              {patientPrescriptions.map((rx) => (
                <div key={rx.id} className="bg-white border border-emerald-200 rounded-xl p-4 shadow-3d card-3d-lift space-y-2">
                  <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
                        <Pill className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">e-Prescription Order ({rx.prescriptionNumber})</div>
                        <div className="text-[10px] text-slate-500">Prescribed by {rx.doctorName}</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">{new Date(rx.prescribedDate).toLocaleDateString()}</span>
                  </div>

                  <div className="space-y-1.5">
                    {rx.items.map((item, i) => (
                      <div key={i} className="p-2 bg-emerald-50/50 border border-emerald-200 rounded text-xs flex items-center justify-between">
                        <div>
                          <strong className="text-emerald-950">{item.medicationName} {item.dosage}</strong>
                          <span className="text-slate-600 ml-2">({item.route}, {item.frequency})</span>
                          <div className="text-[11px] text-slate-500 italic">{item.instructions}</div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {item.dispensedStatus}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {patientLabs.map((lab) => (
                <div key={lab.id} className="bg-white border border-purple-200 rounded-xl p-4 shadow-3d card-3d-lift space-y-2">
                  <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600 border border-purple-200">
                        <FlaskConical className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{lab.testName} ({lab.testCategory})</div>
                        <div className="text-[10px] text-slate-500">Ordered by {lab.doctorName}</div>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        lab.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {lab.status}
                    </span>
                  </div>

                  {lab.results && lab.results.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                      {lab.results.map((r, i) => (
                        <div key={i} className="p-2 bg-slate-50 border border-slate-200 rounded text-xs">
                          <div className="text-[10px] text-slate-500">{r.parameterName}</div>
                          <div className={`font-bold ${r.flag === 'Normal' ? 'text-slate-900' : 'text-rose-700'}`}>
                            {r.measuredValue} {r.unit}
                          </div>
                          <div className="text-[9px] text-slate-400">Ref: {r.referenceRange}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Medical Alerts & Quick Summary */}
          <div className="space-y-3">
            {/* Allergies Card */}
            <div className="bg-white border border-rose-200 rounded-xl p-4 shadow-3d space-y-2">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-xs border-b border-rose-100 pb-2">
                <ShieldAlert className="w-4 h-4" />
                <span>Known Allergies & Sensitivities</span>
              </div>
              {patient.allergies && patient.allergies.length > 0 ? (
                <div className="space-y-1.5">
                  {patient.allergies.map((alg) => (
                    <div key={alg.id} className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-xs">
                      <div className="font-bold text-rose-900">{alg.substance}</div>
                      <div className="text-[11px] text-rose-700">{alg.severity} Severity: {alg.reaction}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-500 p-2 bg-slate-50 rounded">No known drug allergies (NKDA).</div>
              )}
            </div>

            {/* Chronic Conditions */}
            <div className="bg-white border border-blue-200 rounded-xl p-4 shadow-3d space-y-2">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-xs border-b border-blue-100 pb-2">
                <HeartPulse className="w-4 h-4" />
                <span>Chronic Conditions & Comorbidities</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {patient.chronicConditions && patient.chronicConditions.length > 0 ? (
                  patient.chronicConditions.map((c, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg font-semibold">
                      {c}
                    </span>
                  ))
                ) : (
                  <div className="text-xs text-slate-500">None documented</div>
                )}
              </div>
            </div>

            {/* Inpatient Admission Status */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-3d space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-900">Inpatient Care Status</span>
                {hasPermission('manageAdmissions') && (
                  <button
                    onClick={() => setShowAdmitModal(true)}
                    className="text-[11px] font-bold text-blue-700 hover:underline cursor-pointer"
                  >
                    + Admit
                  </button>
                )}
              </div>
              {patient.status === 'Inpatient' ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs space-y-1">
                  <div className="font-bold text-amber-900">Currently Hospitalized Inpatient</div>
                  <div className="text-slate-600">Active ward bed assignment under multidisciplinary telemetry</div>
                </div>
              ) : (
                <div className="text-xs text-slate-500">Patient is currently registered as Outpatient.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: VITALS TRENDS */}
      {activeTab === 'vitals' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-3d">
            <h3 className="text-sm font-bold text-slate-900">Physiological Parameters & Vitals History</h3>
            {hasPermission('recordVitals') && (
              <button
                onClick={() => setShowVitalsModal(true)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-3d-primary btn-3d flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Record New Vitals</span>
              </button>
            )}
          </div>

          <VitalsChart vitals={patientVitals} onAddVital={() => setShowVitalsModal(true)} />
        </div>
      )}

      {/* TAB CONTENT 3: CONSULTATIONS */}
      {activeTab === 'consults' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-3d">
            <h3 className="text-sm font-bold text-slate-900">Clinical SOAP Progress Notes</h3>
            {hasPermission('createDiagnosis') && (
              <button
                onClick={() => setShowConsultModal(true)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-3d-primary btn-3d flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Consultation Note</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {patientConsults.map((c) => (
              <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-3d card-3d-lift space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Clinical Consultation Note</h4>
                    <div className="text-xs text-slate-500">
                      Attending: <strong className="text-slate-800">{c.doctorName}</strong> ({c.doctorSpecialty})
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-blue-700">{new Date(c.consultationDate || c.date || Date.now()).toLocaleString()}</div>
                    <div className="text-[10px] text-slate-400">
                      ICD-10: {c.diagnoses && c.diagnoses.length > 0 ? c.diagnoses[0].icd10Code : 'R69'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="font-bold text-slate-900 mb-1">Subjective (Symptoms & History)</div>
                    <div className="text-slate-700 leading-relaxed">{c.subjective}</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="font-bold text-slate-900 mb-1">Objective (Physical Exam & Findings)</div>
                    <div className="text-slate-700 leading-relaxed">{c.objective}</div>
                  </div>
                  <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200">
                    <div className="font-bold text-blue-900 mb-1">Assessment & Differential Diagnosis</div>
                    <div className="text-slate-800 leading-relaxed">{c.assessment}</div>
                  </div>
                  <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200">
                    <div className="font-bold text-emerald-900 mb-1">Plan & Management Orders</div>
                    <div className="text-slate-800 leading-relaxed">{c.plan}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: PRESCRIPTIONS */}
      {activeTab === 'rx' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-3d">
            <h3 className="text-sm font-bold text-slate-900">Active Pharmacotherapy & Medication Orders</h3>
            {hasPermission('createPrescriptions') && (
              <button
                onClick={() => setShowRxModal(true)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-3d-emerald btn-3d flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>e-Prescribe Medication</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {patientPrescriptions.map((rx) => (
              <div key={rx.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-3d card-3d-lift space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div>
                    <span className="font-mono font-bold text-xs text-blue-700">Order: {rx.prescriptionNumber}</span>
                    <div className="text-xs text-slate-500">Prescribed by {rx.doctorName}</div>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                      rx.overallStatus === 'Fulfilled'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border-amber-200'
                    }`}
                  >
                    {rx.overallStatus}
                  </span>
                </div>

                <div className="space-y-2">
                  {rx.items.map((item, i) => (
                    <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{item.medicationName} ({item.dosage})</div>
                        <div className="text-slate-600 mt-0.5">Route: {item.route} • Frequency: {item.frequency} • Duration: {item.durationDays} days</div>
                        <div className="text-[11px] text-slate-500 italic mt-0.5">Instructions: {item.instructions}</div>
                      </div>
                      <span className="text-[11px] font-semibold px-2 py-1 bg-emerald-100 text-emerald-800 rounded">
                        {item.dispensedStatus}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: LABS */}
      {activeTab === 'labs' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-3d">
            <h3 className="text-sm font-bold text-slate-900">Diagnostic Laboratory & Pathology Orders</h3>
            {hasPermission('orderLabTests') && (
              <button
                onClick={() => setShowLabModal(true)}
                className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow-3d-purple btn-3d flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Order Diagnostic Lab</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {patientLabs.map((lab) => (
              <div key={lab.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-3d card-3d-lift space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{lab.testName} ({lab.testCategory})</h4>
                    <div className="text-xs text-slate-500">Ordered by {lab.doctorName} • Sample: {lab.sampleType}</div>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                      lab.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border-amber-200'
                    }`}
                  >
                    {lab.status}
                  </span>
                </div>

                {lab.results && lab.results.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    {lab.results.map((r, i) => (
                      <div key={i}>
                        <div className="text-[10px] text-slate-500 uppercase font-semibold">{r.parameterName}</div>
                        <div className={`text-sm font-bold ${r.flag === 'Normal' ? 'text-slate-900' : 'text-rose-700'}`}>
                          {r.measuredValue} {r.unit}
                        </div>
                        <div className="text-[9px] text-slate-400">Ref: {r.referenceRange} ({r.flag})</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 6: ADMISSIONS */}
      {activeTab === 'admissions' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-3d">
            <h3 className="text-sm font-bold text-slate-900">Hospitalization & Admission Log</h3>
            {hasPermission('manageAdmissions') && (
              <button
                onClick={() => setShowAdmitModal(true)}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-3d-amber btn-3d flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Admit Inpatient</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {patientAdmissions.map((adm) => (
              <div key={adm.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-3d card-3d-lift space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <BedDouble className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-sm text-slate-900">{adm.ward} - Bed {adm.bedNumber}</span>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                      adm.status === 'Admitted'
                        ? 'bg-rose-100 text-rose-800 border-rose-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {adm.status === 'Admitted' ? 'Currently Admitted' : 'Discharged'}
                  </span>
                </div>

                <div className="text-xs text-slate-700 space-y-1">
                  <div><strong>Admitting Physician:</strong> {adm.admittingDoctorName}</div>
                  <div><strong>Reason for Admission:</strong> {adm.reasonForAdmission}</div>
                  <div><strong>Admitted Date:</strong> {new Date(adm.admissionDate).toLocaleString()}</div>
                  {adm.dischargeDate && (
                    <div><strong>Discharged Date:</strong> {new Date(adm.dischargeDate).toLocaleString()}</div>
                  )}
                  {adm.dischargeSummary && (
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded mt-1">
                      <strong>Discharge Summary:</strong> {adm.dischargeSummary.courseInHospital} (Final Dx: {adm.dischargeSummary.finalDiagnosis})
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Render Submodals safely */}
      {showVitalsModal && <AddVitalsModal patientId={patient.id} onClose={() => setShowVitalsModal(false)} />}
      {showConsultModal && <AddConsultationModal patientId={patient.id} onClose={() => setShowConsultModal(false)} />}
      {showRxModal && <AddPrescriptionModal patientId={patient.id} onClose={() => setShowRxModal(false)} />}
      {showLabModal && <OrderLabModal patientId={patient.id} onClose={() => setShowLabModal(false)} />}
      {showAdmitModal && <AdmitPatientModal patientId={patient.id} onClose={() => setShowAdmitModal(false)} />}
      {showPrintModal && <PrintSummaryModal patient={patient} onClose={() => setShowPrintModal(false)} />}
      {showAiModal && <ClinicalAssistantModal onClose={() => setShowAiModal(false)} />}
    </div>
  );
};
