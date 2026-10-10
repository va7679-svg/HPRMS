import React, { useState } from 'react';
import {
  FileText,
  Cloud,
  Sparkles,
  Link2,
  Activity,
  Share2,
  Fingerprint,
  Video,
  BarChart3,
  Mic,
  Smartphone,
  QrCode,
  ArrowRight,
  CheckCircle2,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { FhirInteroperabilityLab } from './FhirInteroperabilityLab';
import { BlockchainLedgerSimulator } from './BlockchainLedgerSimulator';
import { IotTelemetryStream } from './IotTelemetryStream';
import { VoiceClinicalTranscriber } from './VoiceClinicalTranscriber';

interface InnovationCard {
  id: string;
  name: string;
  icon: any;
  whatItDoes: string;
  srmImplementation: string;
  color: string;
  hasInteractiveDemo: boolean;
}

const INNOVATIONS: InnovationCard[] = [
  {
    id: 'ehr',
    name: 'Electronic Health Records (EHR/EMR)',
    icon: FileText,
    whatItDoes: 'Digitizes all patient demographics, histories, vitals, prescriptions, and lab tests into a unified, instant searchable digital chart.',
    srmImplementation: 'Core EMR module with instant longitudinal timelines, allergy safety alerts, and complete clinical encounter logs.',
    color: 'blue',
    hasInteractiveDemo: false,
  },
  {
    id: 'cloud',
    name: 'Cloud-Based Storage & Scalability',
    icon: Cloud,
    whatItDoes: 'Enables high-speed access from any clinical station, automated multi-region replication, and elastic scalability for surges.',
    srmImplementation: 'Cloud-native database persistence with zero-loss point-in-time recovery and sub-second multi-zone sync.',
    color: 'sky',
    hasInteractiveDemo: false,
  },
  {
    id: 'ai_ml',
    name: 'Dr.AI — Clinical Intelligence (Gemini 3.8 Flash)',
    icon: Sparkles,
    whatItDoes: 'Predictive diagnostics, automated clinical SOAP synthesis, drug-drug contraindication warnings, and laboratory anomaly alerts powered by Dr.AI.',
    srmImplementation: 'Dr.AI Copilot integrated across physician charts, pharmacy workflows, and hospital operations with real-time medical reasoning.',
    color: 'purple',
    hasInteractiveDemo: false,
  },
  {
    id: 'blockchain',
    name: 'Blockchain & Cryptographic Ledger',
    icon: Link2,
    whatItDoes: 'Immutable, tamper-proof record-keeping and cryptographic audit trails preventing unauthorized history alterations.',
    srmImplementation: 'SHA-256 block-chained audit records with instant cryptographic proof-of-integrity verification.',
    color: 'indigo',
    hasInteractiveDemo: true,
  },
  {
    id: 'iot',
    name: 'IoT Telemetry & Wearable Sensors',
    icon: Activity,
    whatItDoes: 'Real-time streaming vitals (ECG heart rate, SpO2 pulse oximetry, continuous temperature) feeding directly into inpatient charts.',
    srmImplementation: 'Live WebSocket sensor telemetry engine with automated clinical deterioration triggers for rapid response teams.',
    color: 'rose',
    hasInteractiveDemo: true,
  },
  {
    id: 'fhir',
    name: 'Interoperability Standards (HL7 & FHIR R4)',
    icon: Share2,
    whatItDoes: 'Allows heterogeneous hospital systems and regional health information exchanges (HIE) to exchange structured clinical payloads.',
    srmImplementation: 'Full HL7 FHIR R4 export and ingestion bridge supporting Patient, Observation, MedicationRequest, and DiagnosticReport.',
    color: 'teal',
    hasInteractiveDemo: true,
  },
  {
    id: 'biometric',
    name: 'Biometric & Multi-Factor Authentication',
    icon: Fingerprint,
    whatItDoes: 'Fingerprint and facial recognition for error-free patient identity verification and privileged staff workstation sign-in.',
    srmImplementation: 'Biometric credentialing simulation + TOTP MFA guards on clinical administrative and prescription dispatch actions.',
    color: 'emerald',
    hasInteractiveDemo: false,
  },
  {
    id: 'telemedicine',
    name: 'Telemedicine & Virtual Care Integration',
    icon: Video,
    whatItDoes: 'Encrypted remote video consultations linked directly into the patient longitudinal medical chart and e-prescription engine.',
    srmImplementation: 'Integrated telehealth appointment schedules with instantaneous EHR notes synchronization during video calls.',
    color: 'cyan',
    hasInteractiveDemo: false,
  },
  {
    id: 'bigdata',
    name: 'Big Data & Population Health Analytics',
    icon: BarChart3,
    whatItDoes: 'Epidemiological outbreak surveillance, hospital ward capacity forecasting, antibiotic resistance tracking, and resource planning.',
    srmImplementation: 'Executive Analytics dashboard visualizing bed occupancy rates, diagnostic trends, and pharmacy burn-rates.',
    color: 'amber',
    hasInteractiveDemo: false,
  },
  {
    id: 'voice_nlp',
    name: 'Voice Recognition & Clinical NLP Dictation',
    icon: Mic,
    whatItDoes: 'Physicians dictate natural voice notes auto-transcribed into structured Subjective, Objective, Assessment, and Plan (SOAP) charts.',
    srmImplementation: 'Real-time NLP medical entity extractor with automated ICD-10 diagnostic coding and prescription parsing.',
    color: 'amber',
    hasInteractiveDemo: true,
  },
  {
    id: 'mobile',
    name: 'Patient Mobile Health Portal',
    icon: Smartphone,
    whatItDoes: 'Empowers patients to review their lab results, download verified discharge summaries, schedule follow-ups, and manage privacy consent.',
    srmImplementation: 'Responsive mobile-first Patient Portal with OTP access controls and consent withdrawal mechanisms.',
    color: 'blue',
    hasInteractiveDemo: false,
  },
  {
    id: 'qrcode',
    name: 'QR Code & Barcode Patient Master ID',
    icon: QrCode,
    whatItDoes: 'Quick, zero-error patient identification on wristbands and digital cards to prevent wrong-patient medication or surgical errors.',
    srmImplementation: 'Dynamic QR patient badges scanning directly into bedside EMR triage with ABHA National ID linkage.',
    color: 'slate',
    hasInteractiveDemo: false,
  },
];

export const InnovationsShowcase: React.FC = () => {
  const [activeInteractiveDemo, setActiveInteractiveDemo] = useState<'none' | 'fhir' | 'blockchain' | 'iot' | 'voice_nlp'>('fhir');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-3d-lg border border-slate-700/60 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Healthcare Technology Matrix</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            2. New Innovations to Enhance the Hospital Patient Record System
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Explore the 12 core technological innovations transforming modern hospital informatics — from 
            <strong> FHIR Interoperability</strong> and <strong>Blockchain Hash Verification</strong> to <strong>IoT Bedside Telemetry</strong> and <strong>Voice NLP Dictation</strong>.
          </p>
        </div>
      </div>

      {/* Interactive Tool Selector Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-3d flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>Launch Live Interactive Simulation Labs:</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveInteractiveDemo('fhir')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              activeInteractiveDemo === 'fhir'
                ? 'bg-blue-600 text-white shadow-3d-primary'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>HL7 / FHIR R4 Lab</span>
          </button>
          <button
            onClick={() => setActiveInteractiveDemo('blockchain')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              activeInteractiveDemo === 'blockchain'
                ? 'bg-purple-600 text-white shadow-3d-purple'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Blockchain Ledger</span>
          </button>
          <button
            onClick={() => setActiveInteractiveDemo('iot')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              activeInteractiveDemo === 'iot'
                ? 'bg-rose-600 text-white shadow-3d-red'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>IoT Bedside Telemetry</span>
          </button>
          <button
            onClick={() => setActiveInteractiveDemo('voice_nlp')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              activeInteractiveDemo === 'voice_nlp'
                ? 'bg-amber-600 text-white shadow-3d-amber'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voice NLP Dictation</span>
          </button>
        </div>
      </div>

      {/* Active Interactive Lab Area */}
      {activeInteractiveDemo === 'fhir' && <FhirInteroperabilityLab />}
      {activeInteractiveDemo === 'blockchain' && <BlockchainLedgerSimulator />}
      {activeInteractiveDemo === 'iot' && <IotTelemetryStream />}
      {activeInteractiveDemo === 'voice_nlp' && <VoiceClinicalTranscriber />}

      {/* 12 Innovations Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
          <span>Complete 12-Pillar Healthcare Innovation Matrix:</span>
          <span className="text-blue-600 font-semibold">12 of 12 Implemented &amp; Architectural in SRM</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {INNOVATIONS.map((inv) => {
            const Icon = inv.icon;
            return (
              <div
                key={inv.id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-3d card-3d-lift flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 shadow-inner-bevel">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 leading-snug">
                        {inv.name}
                      </h4>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-600 leading-relaxed">
                    <strong className="text-slate-800">What It Does:</strong> {inv.whatItDoes}
                  </div>

                  <div className="text-[11px] text-emerald-900 bg-emerald-50/70 p-2 rounded-lg border border-emerald-200 leading-relaxed font-medium">
                    <strong className="text-emerald-950">SRM Implementation:</strong> {inv.srmImplementation}
                  </div>
                </div>

                {inv.hasInteractiveDemo && (
                  <button
                    onClick={() => {
                      if (inv.id === 'fhir') setActiveInteractiveDemo('fhir');
                      if (inv.id === 'blockchain') setActiveInteractiveDemo('blockchain');
                      if (inv.id === 'iot') setActiveInteractiveDemo('iot');
                      if (inv.id === 'voice_nlp') setActiveInteractiveDemo('voice_nlp');
                      window.scrollTo({ top: 180, behavior: 'smooth' });
                    }}
                    className="w-full py-1.5 px-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 border border-blue-200 transition cursor-pointer"
                  >
                    <span>Launch Live Interactive Demo</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
