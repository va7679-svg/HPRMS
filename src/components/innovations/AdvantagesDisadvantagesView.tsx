import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  Scale,
  Sparkles,
  HelpCircle,
  ArrowRight,
  Zap,
  Lock,
  Layers,
} from 'lucide-react';

interface AdvantageItem {
  id: string;
  title: string;
  clinicalImpact: string;
  roiCategory: 'Clinical' | 'Financial' | 'Operational' | 'Patient Experience';
}

interface DisadvantageItem {
  id: string;
  title: string;
  challenge: string;
  srmMitigationStrategy: string;
  mitigationStatus: 'Fully Solved in SRM' | 'Operational Safeguard';
}

const ADVANTAGES_LIST: AdvantageItem[] = [
  {
    id: 'adv-1',
    title: 'Rapid & Accurate Patient History Access',
    clinicalImpact: 'Sub-second chart retrieval accelerates triage during emergency trauma and reduces diagnostic delays from 45 minutes to under 5 seconds.',
    roiCategory: 'Clinical',
  },
  {
    id: 'adv-2',
    title: 'Elimination of Redundant Diagnostic Tests',
    clinicalImpact: 'Instant visibility of past MRI/CT imaging, lipid panels, and pathology reports saves patients $1,200+ per admission and prevents radiation overexposure.',
    roiCategory: 'Financial',
  },
  {
    id: 'adv-3',
    title: 'Seamless Cross-Departmental Coordination',
    clinicalImpact: 'Emergency, Lab, Pharmacy, Inpatient, and Billing operate off a single synchronized source of truth, eliminating lost requisitions.',
    roiCategory: 'Operational',
  },
  {
    id: 'adv-4',
    title: 'Eradication of Handwriting & Manual Transcription Errors',
    clinicalImpact: 'Digital e-prescriptions with standardized dosages and allergy cross-checks prevent fatal decimal errors (e.g. 10mg vs 100mg).',
    roiCategory: 'Clinical',
  },
  {
    id: 'adv-5',
    title: 'Data-Driven Clinical Decision-Making',
    clinicalImpact: 'Aggregate epidemiology analytics, antibiogram surveillance, and AI risk stratification optimize bed utilization and ICU triage.',
    roiCategory: 'Clinical',
  },
  {
    id: 'adv-6',
    title: 'Empowered Patient Self-Engagement',
    clinicalImpact: 'Patients directly access verified lab reports, schedule follow-ups, and review medication instructions from their own portal.',
    roiCategory: 'Patient Experience',
  },
  {
    id: 'adv-7',
    title: 'Zero-Loss Disaster Recovery & Resilience',
    clinicalImpact: 'Cloud snapshot replication safeguards health records against physical fires, floods, ransomware, or local server motherboard crashes.',
    roiCategory: 'Operational',
  },
  {
    id: 'adv-8',
    title: 'Robust Telemedicine & Remote Outpatient Care',
    clinicalImpact: 'Integrated HD video consultations link directly into the longitudinal chart, extending specialty care to rural and homebound patients.',
    roiCategory: 'Operational',
  },
];

const DISADVANTAGES_LIST: DisadvantageItem[] = [
  {
    id: 'dis-1',
    title: 'High Initial Implementation & Infrastructure Capital Costs',
    challenge: 'Procuring enterprise cloud servers, high-density barcode scanners, biometric terminals, and staff training requires significant capex.',
    srmMitigationStrategy: 'Cloud-native modular tiering: Deploy core modules first with zero expensive local server hardware required; runs in standard modern browsers.',
    mitigationStatus: 'Fully Solved in SRM',
  },
  {
    id: 'dis-2',
    title: 'Heightened Risk of Cyberattacks & Ransomware',
    challenge: 'Centralized electronic health repositories are prime targets for cyber criminals seeking sensitive protected health information (PHI).',
    srmMitigationStrategy: 'End-to-End AES-256 encryption at rest, TLS 1.3 in transit, immutable SHA-256 blockchain audit chaining, and air-gapped immutable backup snapshots.',
    mitigationStatus: 'Operational Safeguard',
  },
  {
    id: 'dis-3',
    title: 'Steep Learning Curve for Non-Technical & Rural Staff',
    challenge: 'Physicians and older nurses may experience computer fatigue or resist clunky, deeply nested dropdown software menus.',
    srmMitigationStrategy: 'High-density 3D tactile UI design, voice dictation NLP for rapid chart entry, and built-in interactive role onboarding walkthroughs.',
    mitigationStatus: 'Fully Solved in SRM',
  },
  {
    id: 'dis-4',
    title: 'Dependency on Constant Internet Connectivity & Electricity',
    challenge: 'System outages or bandwidth loss in rural clinics can paralyze outpatient desks and medication administration.',
    srmMitigationStrategy: 'Offline-First local storage caching engine: Station continues recording vitals and charting locally, automatically reconciling when back online.',
    mitigationStatus: 'Fully Solved in SRM',
  },
  {
    id: 'dis-5',
    title: 'Data Privacy, Ownership & Commercialization Concerns',
    challenge: 'Patients fear their private diagnoses will be sold to insurance advertisers or third-party pharmaceutical conglomerates.',
    srmMitigationStrategy: 'Granular patient consent controls, automated PII anonymization/masking for research, and compliance with GDPR and India DPDP Act.',
    mitigationStatus: 'Operational Safeguard',
  },
  {
    id: 'dis-6',
    title: 'Interoperability Friction Between Competing Vendor Systems',
    challenge: 'Proprietary legacy EHR vendors deliberately create data lock-in, impeding cross-hospital referrals.',
    srmMitigationStrategy: 'Open standard HL7 FHIR R4 JSON RESTful bridges and ABHA National Health ID integration for frictionless data portability.',
    mitigationStatus: 'Fully Solved in SRM',
  },
  {
    id: 'dis-7',
    title: 'Over-Reliance on AI Reducing Clinical Judgement',
    challenge: 'Junior clinicians may blindly accept AI suggestions without conducting independent physical examinations.',
    srmMitigationStrategy: 'Human-in-the-loop design: AI is strictly non-autonomous and acts as a passive decision-support advisor; physician electronic signature is mandatory.',
    mitigationStatus: 'Operational Safeguard',
  },
];

export const AdvantagesDisadvantagesView: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'all' | 'advantages' | 'disadvantages'>('all');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-2xl p-6 text-white shadow-3d-lg border border-slate-700/60 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5" />
            <span>Strategic Trade-off Analysis &amp; Mitigation Playbooks</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            3. Advantages, Disadvantages &amp; SRM Engineering Mitigations
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            A comprehensive evaluation of the clinical, financial, and security trade-offs of digital health record systems, 
            along with SRM's actionable engineering mitigations to neutralize every known operational risk.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-3d">
        <button
          onClick={() => setSelectedTab('all')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
            selectedTab === 'all'
              ? 'bg-slate-900 text-white shadow-3d'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          Full Executive Comparison (8 Advantages &amp; 7 Disadvantages)
        </button>
        <button
          onClick={() => setSelectedTab('advantages')}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
            selectedTab === 'advantages'
              ? 'bg-emerald-600 text-white shadow-3d-emerald'
              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>8 Core Advantages</span>
        </button>
        <button
          onClick={() => setSelectedTab('disadvantages')}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
            selectedTab === 'disadvantages'
              ? 'bg-rose-600 text-white shadow-3d-red'
              : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>7 Disadvantages &amp; Mitigations</span>
        </button>
      </div>

      {/* Grid: Advantages (Left) vs Disadvantages & Mitigations (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Advantages Column */}
        {(selectedTab === 'all' || selectedTab === 'advantages') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Primary Clinical &amp; Operational Advantages (8)</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 font-black">
                Proven ROI
              </span>
            </div>

            <div className="space-y-2.5">
              {ADVANTAGES_LIST.map((adv) => (
                <div
                  key={adv.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 shadow-3d card-3d-lift space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <span>{adv.title}</span>
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">
                      {adv.roiCategory}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed pl-3.5">
                    {adv.clinicalImpact}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disadvantages & Mitigations Column */}
        {(selectedTab === 'all' || selectedTab === 'disadvantages') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-rose-50 border border-rose-200 p-3 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-900">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Known Disadvantages &amp; SRM Active Mitigations (7)</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-200/80 text-rose-900 font-black">
                Engineered Out
              </span>
            </div>

            <div className="space-y-2.5">
              {DISADVANTAGES_LIST.map((dis) => (
                <div
                  key={dis.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 shadow-3d card-3d-lift space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                      <span>{dis.title}</span>
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 shrink-0">
                      {dis.mitigationStatus}
                    </span>
                  </div>

                  <div className="text-[11px] text-rose-900 bg-rose-50/60 p-2 rounded-lg border border-rose-100 leading-relaxed font-medium">
                    <strong>Challenge:</strong> {dis.challenge}
                  </div>

                  <div className="text-[11px] text-emerald-950 bg-emerald-50/80 p-2.5 rounded-lg border border-emerald-200 leading-relaxed font-semibold">
                    <strong className="text-emerald-900">SRM Mitigation Playbook:</strong> {dis.srmMitigationStrategy}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
