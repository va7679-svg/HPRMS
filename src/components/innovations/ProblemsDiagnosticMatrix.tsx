import React, { useState } from 'react';
import {
  AlertTriangle,
  FileSpreadsheet,
  Zap,
  Lock,
  ServerCrash,
  UserX,
  CheckCircle2,
  ArrowRight,
  Database,
  Search,
  ShieldCheck,
  RefreshCw,
  Layers,
  FileText,
} from 'lucide-react';

interface ProblemItem {
  id: string;
  category: 'data' | 'access' | 'security' | 'technical' | 'human';
  title: string;
  legacyIssue: string;
  impactLevel: 'Critical' | 'High' | 'Moderate';
  srmModernSolution: string;
  keyFeature: string;
  liveStatus: 'Resolved in SRM' | 'Actively Monitored' | 'Standardized';
}

const PROBLEMS_DATA: ProblemItem[] = [
  // 1. Data-related issues
  {
    id: 'p-data-1',
    category: 'data',
    title: 'Fragmented Departmental Silos',
    legacyIssue: 'Lab, Pharmacy, Radiology, and Billing operate disconnected software systems with no mutual data exchange.',
    impactLevel: 'Critical',
    srmModernSolution: 'Unified Enterprise EMR bus linking all clinical modules into a synchronized real-time data repository.',
    keyFeature: 'Cross-Department Event Bus & Shared Patient Store',
    liveStatus: 'Resolved in SRM',
  },
  {
    id: 'p-data-2',
    category: 'data',
    title: 'Duplicate & Inconsistent Patient Records',
    legacyIssue: 'Patients get registered multiple times under slight name/phone variations, fragmenting allergy and medical histories.',
    impactLevel: 'High',
    srmModernSolution: 'Single Patient ID (ABHA-compatible 14-digit format) with automated algorithmic duplicate detection.',
    keyFeature: 'Unique Universal Health Identifier & Fuzzy Deduplication',
    liveStatus: 'Resolved in SRM',
  },
  {
    id: 'p-data-3',
    category: 'data',
    title: 'Manual & Paper-Based Record Frailty',
    legacyIssue: 'Paper physical charts are lost, water-damaged, coffee-stained, or rendered illegible by hurried handwriting.',
    impactLevel: 'Critical',
    srmModernSolution: '100% digital EMR charts with structured SOAP note entry, e-prescriptions, and immutable audit logs.',
    keyFeature: 'Zero-Paper Digital Clinical Charting',
    liveStatus: 'Resolved in SRM',
  },
  {
    id: 'p-data-4',
    category: 'data',
    title: 'Non-Standard Formats & Poor Interoperability',
    legacyIssue: 'Inability to transfer records when patients visit other health networks or tertiary referral centers.',
    impactLevel: 'High',
    srmModernSolution: 'HL7 v2/v3 and HL7 FHIR R4 standard JSON/XML data export pipelines for seamless health information exchange (HIE).',
    keyFeature: 'FHIR R4 RESTful Interoperability Bridge',
    liveStatus: 'Standardized',
  },

  // 2. Access and efficiency issues
  {
    id: 'p-access-1',
    category: 'access',
    title: 'Slow Emergency Record Retrieval',
    legacyIssue: 'Emergency doctors waste 20–45 minutes locating previous physical files or contacting archives during trauma intake.',
    impactLevel: 'Critical',
    srmModernSolution: 'Sub-50ms instant search by Patient ID, National ABHA ID, Barcode/QR scan, or biometric index.',
    keyFeature: 'Instant Emergency Trauma Intake Querying',
    liveStatus: 'Resolved in SRM',
  },
  {
    id: 'p-access-2',
    category: 'access',
    title: 'Inter-Hospital Transfer Friction',
    legacyIssue: 'Referred patients must carry physical paper envelopes; tests are duplicated upon arrival at new hospitals.',
    impactLevel: 'High',
    srmModernSolution: 'Encrypted patient health record exports and cross-institutional referral token generation.',
    keyFeature: 'Inter-Facility Referral Records Transfer Protocol',
    liveStatus: 'Standardized',
  },
  {
    id: 'p-access-3',
    category: 'access',
    title: 'Lack of Real-Time Diagnostic Visibility',
    legacyIssue: 'Doctors wait hours for printed lab slips or verbal calls, delaying critical ICU or surgical interventions.',
    impactLevel: 'Critical',
    srmModernSolution: 'Instant telemetry notification: verified lab results & critical flags immediately appear on attending doctor screen.',
    keyFeature: 'Real-time WebSocket Lab Telemetry & Alerting',
    liveStatus: 'Actively Monitored',
  },
  {
    id: 'p-access-4',
    category: 'access',
    title: 'Excessive Administrative Data Entry Burden',
    legacyIssue: 'Physicians spend up to 40% of their workday typing repetitive entries rather than providing bedside care.',
    impactLevel: 'High',
    srmModernSolution: 'Smart clinical templates, AI-assisted SOAP synthesis, and voice-to-text NLP dictation.',
    keyFeature: 'Clinical Assistant & Voice NLP Auto-Transcriber',
    liveStatus: 'Resolved in SRM',
  },

  // 3. Security and privacy issues
  {
    id: 'p-sec-1',
    category: 'security',
    title: 'Weak Authentication & Shared Passwords',
    legacyIssue: 'Ward terminals left permanently logged in with generic nurse passwords, destroying individual accountability.',
    impactLevel: 'Critical',
    srmModernSolution: 'Granular Role-Based Access Control (RBAC), multi-factor authentication (MFA), and session auto-locking.',
    keyFeature: 'Strict RBAC Matrix + 15-Min Auto Terminal Lock',
    liveStatus: 'Resolved in SRM',
  },
  {
    id: 'p-sec-2',
    category: 'security',
    title: 'Vulnerability to Ransomware & Breaches',
    legacyIssue: 'Unpatched local Windows XP/7 server boxes targeted by LockBit and WannaCry ransomware variants.',
    impactLevel: 'Critical',
    srmModernSolution: 'End-to-End TLS 1.3 encryption in transit, AES-256 at rest, and immutable air-gapped backup snapshots.',
    keyFeature: 'Defense-in-Depth Cryptographic Vault Architecture',
    liveStatus: 'Actively Monitored',
  },
  {
    id: 'p-sec-3',
    category: 'security',
    title: 'Absence of Tamper-Proof Audit Trails',
    legacyIssue: 'No reliable logging of who accessed VIP records, altered prescriptions, or deleted diagnostic notes.',
    impactLevel: 'High',
    srmModernSolution: 'Append-only audit ledger with cryptographic SHA-256 hash chaining and detailed IP/user context logging.',
    keyFeature: 'Cryptographic Audit Trail & Forensic Logging',
    liveStatus: 'Resolved in SRM',
  },
  {
    id: 'p-sec-4',
    category: 'security',
    title: 'Regulatory Non-Compliance (HIPAA/GDPR/DPDP)',
    legacyIssue: 'Massive non-compliance fines and patient privacy violations due to unencrypted data exports.',
    impactLevel: 'Critical',
    srmModernSolution: 'Full alignment with HIPAA Security Rule, GDPR Chapter III, and India Digital Personal Data Protection (DPDP) Act.',
    keyFeature: 'Built-in Privacy Compliance & Consent Engine',
    liveStatus: 'Standardized',
  },

  // 4. Technical issues
  {
    id: 'p-tech-1',
    category: 'technical',
    title: 'Outdated Legacy Infrastructure',
    legacyIssue: 'Hospital dependent on noisy 10-year-old on-premise tower servers prone to power surges and motherboard failures.',
    impactLevel: 'High',
    srmModernSolution: 'Cloud-native, microservices-ready React/TypeScript container architecture with horizontal auto-scaling.',
    keyFeature: 'Cloud-Native Containerized Infrastructure',
    liveStatus: 'Resolved in SRM',
  },
  {
    id: 'p-tech-2',
    category: 'technical',
    title: 'Disaster Loss & Absence of Cloud Backups',
    legacyIssue: 'A single server room fire or flood can permanently destroy decades of patient medical histories.',
    impactLevel: 'Critical',
    srmModernSolution: 'Multi-region geo-redundant automated snapshots and point-in-time recovery with zero data loss.',
    keyFeature: 'Automated Multi-Zone Disaster Recovery (RPO < 1m)',
    liveStatus: 'Actively Monitored',
  },
  {
    id: 'p-tech-3',
    category: 'technical',
    title: 'Poor Scalability During Patient Surges',
    legacyIssue: 'Database locks up and freezes during epidemics, outpatient rush hours, or vaccine drives.',
    impactLevel: 'High',
    srmModernSolution: 'High-throughput non-blocking asynchronous state architecture capable of handling 100,000+ daily encounters.',
    keyFeature: 'High-Concurrency Memory Caching & Paging',
    liveStatus: 'Resolved in SRM',
  },

  // 5. Human & organizational issues
  {
    id: 'p-human-1',
    category: 'human',
    title: 'Staff Resistance to Digital Transformation',
    legacyIssue: 'Doctors and nurses refuse complicated software with cluttered 90s-era Win32 dropdown menus.',
    impactLevel: 'High',
    srmModernSolution: 'High-density 3D tactile interface designed for instant visual cognition, minimal clicks, and ergonomic workflows.',
    keyFeature: 'Clinician-Centered Modern UX Design',
    liveStatus: 'Resolved in SRM',
  },
  {
    id: 'p-human-2',
    category: 'human',
    title: 'Lack of Structured Training & Digital Literacy',
    legacyIssue: 'High turnover leads to new staff inputting incorrect data or bypassing security safeguards.',
    impactLevel: 'Moderate',
    srmModernSolution: 'Built-in interactive onboarding wizards, contextual clinical guides, and staff role competence tracking.',
    keyFeature: 'Integrated Interactive Guidance & Training Modules',
    liveStatus: 'Standardized',
  },
  {
    id: 'p-human-3',
    category: 'human',
    title: 'Clinical Errors in Dosage & Diagnosis Codes',
    legacyIssue: 'Prescription typos and mistyped decimal points (e.g. 10.0mg vs 100mg) causing adverse drug events.',
    impactLevel: 'Critical',
    srmModernSolution: 'Automated dose range safety checks, drug-allergy contraindication triggers, and ICD-10 autocomplete validation.',
    keyFeature: 'AI Clinical Decision Support Safety Guardrails',
    liveStatus: 'Actively Monitored',
  },
];

export const ProblemsDiagnosticMatrix: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProblemId, setActiveProblemId] = useState<string>(PROBLEMS_DATA[0].id);

  const categories = [
    { id: 'all', label: 'All Problems (16)', icon: Layers },
    { id: 'data', label: 'Data Issues (4)', icon: FileSpreadsheet },
    { id: 'access', label: 'Access & Speed (4)', icon: Zap },
    { id: 'security', label: 'Security & Privacy (4)', icon: Lock },
    { id: 'technical', label: 'Technical & Cloud (3)', icon: ServerCrash },
    { id: 'human', label: 'Human & Clinical (3)', icon: UserX },
  ];

  const filteredProblems = PROBLEMS_DATA.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.legacyIssue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.srmModernSolution.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const activeProblem = PROBLEMS_DATA.find((p) => p.id === activeProblemId) || filteredProblems[0] || PROBLEMS_DATA[0];

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-slate-900 to-blue-950 rounded-2xl p-6 text-white shadow-3d-lg border border-slate-700/60 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Problem vs. Modern Solution Matrix</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            1. Problems in Existing Hospital Patient Record Management Systems
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Legacy hospital systems suffer from data fragmentation, paper decay, slow retrieval, security vulnerabilities, 
            and clinical transcription errors. See how <strong>SRM Medical Record System (SRM-HPRMS)</strong> systematically overcomes each critical failure mode.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-3d">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
          {categories.map((c) => {
            const Icon = c.icon;
            const isSelected = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-3d-primary'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems or solutions..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Main Grid: Problem Selector + Detailed Solution Comparison Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Problem List (5 cols) */}
        <div className="lg:col-span-5 space-y-2 max-h-[620px] overflow-y-auto pr-1">
          {filteredProblems.map((item) => {
            const isSelected = item.id === activeProblem.id;
            return (
              <div
                key={item.id}
                onClick={() => setActiveProblemId(item.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer card-3d-lift ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-400 shadow-3d-primary ring-2 ring-blue-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-3d'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="font-bold text-xs text-slate-900 leading-tight">
                    {item.title}
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0 border ${
                      item.impactLevel === 'Critical'
                        ? 'bg-rose-100 text-rose-700 border-rose-200'
                        : item.impactLevel === 'High'
                        ? 'bg-amber-100 text-amber-700 border-amber-200'
                        : 'bg-blue-100 text-blue-700 border-blue-200'
                    }`}
                  >
                    {item.impactLevel} Impact
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-2">
                  {item.legacyIssue}
                </p>
                <div className="flex items-center justify-between text-[10px] font-semibold">
                  <span className="text-slate-400 uppercase tracking-wider">{item.category}</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {item.liveStatus}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Deep Architectural Comparison (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-3d space-y-5 sticky top-4">
            
            {/* Header of Active Problem */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {activeProblem.category} Issue Breakdown
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  {activeProblem.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-3 py-1 bg-emerald-500/10 text-emerald-700 font-bold border border-emerald-500/20 rounded-lg flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{activeProblem.liveStatus}</span>
                </span>
              </div>
            </div>

            {/* Side-by-Side Comparison Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Legacy Failure Box */}
              <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 text-rose-900 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>The Legacy Flaw</span>
                </div>
                <p className="text-xs text-rose-900/90 leading-relaxed font-medium">
                  {activeProblem.legacyIssue}
                </p>
                <div className="text-[10px] text-rose-700 bg-rose-100/60 px-2 py-1 rounded font-semibold">
                  ⚠️ Risk: Diagnostic delay, regulatory fine & adverse clinical outcomes.
                </div>
              </div>

              {/* SRM Modern Solution Box */}
              <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-900 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>SRM Modern Solution</span>
                </div>
                <p className="text-xs text-emerald-950 leading-relaxed font-semibold">
                  {activeProblem.srmModernSolution}
                </p>
                <div className="text-[10px] text-emerald-800 bg-emerald-100/60 px-2 py-1 rounded font-bold">
                  ⚡ Feature: {activeProblem.keyFeature}
                </div>
              </div>
            </div>

            {/* Architectural Highlights in SRM */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-blue-600" />
                <span>Implemented Engineering Defense in SRM-HPRMS</span>
              </h4>
              <ul className="text-xs text-slate-600 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <span><strong>Zero-Downtime Resilience:</strong> Micro-transactions with client-side optimistic synchronization and cloud durability.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <span><strong>Audit Immutability:</strong> Every view, edit, prescription, and lab verification is signed with user ID, timestamp, and IP address.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <span><strong>Standard Compliance:</strong> Built from ground up to support HL7 FHIR resource schemas and DPDP patient consent lifecycle.</span>
                </li>
              </ul>
            </div>

            {/* Quick Summary Strip */}
            <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-900 font-medium">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                <span>Active Protection: 16 of 16 legacy flaws remediated in current architecture.</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
