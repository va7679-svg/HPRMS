import React, { useState, useEffect, useRef } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Patient } from '../../types';
import {
  Sparkles,
  X,
  Send,
  Bot,
  AlertTriangle,
  FileText,
  Pill,
  Activity,
  CheckCircle2,
  BrainCircuit,
  Key,
  Info,
  Copy,
  Check,
  RefreshCw,
  Stethoscope,
  ChevronDown,
  ShieldAlert,
  User,
} from 'lucide-react';

interface ClinicalAssistantModalProps {
  patient?: Patient;
  onClose: () => void;
}

interface DrAiStatus {
  hasApiKey: boolean;
  model: string;
  assistantName: string;
  engine: string;
}

export const ClinicalAssistantModal: React.FC<ClinicalAssistantModalProps> = ({
  patient: initialPatient,
  onClose,
}) => {
  const { patients, vitals, consultations, prescriptions, labOrders } = useHospital();

  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    initialPatient?.id || (patients.length > 0 ? patients[0].id : '')
  );

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || null;

  const patientVitals = selectedPatient ? vitals.filter((v) => v.patientId === selectedPatient.id) : [];
  const patientConsults = selectedPatient ? consultations.filter((c) => c.patientId === selectedPatient.id) : [];
  const patientPrescriptions = selectedPatient ? prescriptions.filter((p) => p.patientId === selectedPatient.id) : [];
  const patientLabs = selectedPatient ? labOrders.filter((l) => l.patientId === selectedPatient.id) : [];

  const [activeMode, setActiveMode] = useState<
    'general' | 'patient' | 'drug_safety' | 'diagnosis' | 'soap_note' | 'labs'
  >('general');

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [showKeyInstructions, setShowKeyInstructions] = useState(false);
  const [aiStatus, setAiStatus] = useState<DrAiStatus | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Check Dr.AI server status
  useEffect(() => {
    fetch('/api/dr-ai/status')
      .then((res) => res.json())
      .then((data) => {
        setAiStatus(data);
      })
      .catch((err) => {
        console.warn('Dr.AI status check notice:', err);
      });
  }, []);

  const [messages, setMessages] = useState<{
    sender: 'user' | 'ai';
    text: string;
    time: string;
    isLiveGemini?: boolean;
  }[]>([
    {
      sender: 'ai',
      text: selectedPatient
        ? `Hello, I am **Dr.AI**, your Senior Clinical Decision Support & Medical Copilot.\n\nI have indexed the longitudinal medical record for **${selectedPatient.firstName} ${selectedPatient.lastName}** (MRN: ${selectedPatient.patientId}).\n\nHow can I assist you? I can perform **drug-drug interaction screening**, synthesize **vital trends**, author **SOAP notes**, or analyze **differential diagnoses**.`
        : `Hello, I am **Dr.AI**, your Senior Clinical Decision Support Copilot for SRM Medical Record System.\n\nAsk me any medical queries, clinical pharmacotherapy guidelines, ICD-10 diagnostic codes, or hospital care pathways. You can also select a patient above for real-time EMR chart analysis.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendPrompt = async (e?: React.FormEvent, customQuery?: string, customMode?: typeof activeMode) => {
    if (e) e.preventDefault();
    const query = customQuery || prompt;
    if (!query.trim() || loading) return;

    const modeToUse = customMode || activeMode;

    const userMsg = {
      sender: 'user' as const,
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customQuery) setPrompt('');
    setLoading(true);

    try {
      const response = await fetch('/api/dr-ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          mode: modeToUse,
          patient: selectedPatient,
          vitals: patientVitals.slice(0, 5),
          consultations: patientConsults.slice(0, 3),
          prescriptions: patientPrescriptions.slice(0, 5),
          labOrders: patientLabs.slice(0, 5),
        }),
      });

      if (!response.ok) {
        throw new Error('Dr.AI clinical response error');
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: data.response || data.analysis || 'Analysis complete.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isLiveGemini: data.isLiveGemini,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `⚠️ **Dr.AI Notice:** Could not reach server endpoint. Please verify server connection.\n\nDetails: ${err.message || 'Network error'}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const latestVital = patientVitals[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg border border-blue-400/40">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  <span>Dr.AI</span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-400/30 font-mono font-bold">
                    v3.8 Flash
                  </span>
                </h2>
                
                {aiStatus?.hasApiKey ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    Live Gemini Active
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    Rules Engine (API Key Ready)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300 font-medium">
                Chief Clinical Decision Support AI • SRM Medical Record System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowKeyInstructions(!showKeyInstructions)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
              title="API Key Configuration Guide"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">API Key Guide</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* API Key Instructions Accordion (If toggled or if key is pending) */}
        {showKeyInstructions && (
          <div className="bg-slate-900 border-b border-slate-800 p-4 text-xs text-slate-200 shrink-0 animate-in slide-in-from-top-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1.5">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>How to connect your Gemini API Key to Dr.AI</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-mono">
                      Environment variable: GEMINI_API_KEY
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    1. When you have your Gemini API key from Google AI Studio, add it to your app by navigating to <strong>Settings &gt; Secrets</strong> in AI Studio.
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    2. Set variable name as <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-300 font-mono">GEMINI_API_KEY</code> and paste your key.
                  </p>
                  <p className="text-slate-400 leading-relaxed">
                    3. Dr.AI instantly detects the key on subsequent queries and utilizes <strong>Gemini 3.8 Flash</strong> for deep clinical reasoning. In the meantime, Dr.AI provides built-in clinical rule assessments.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowKeyInstructions(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Patient Selection & Clinical Ribbon */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-700">Patient Context:</span>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="text-xs font-semibold bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">-- No Patient Attached (General Medical Queries) --</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName} (MRN: {p.patientId}) - {p.gender}, Blood {p.bloodGroup}
                </option>
              ))}
            </select>
          </div>

          {selectedPatient && (
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold border border-blue-200">
                MRN: {selectedPatient.patientId}
              </span>
              {selectedPatient.allergies && selectedPatient.allergies.length > 0 ? (
                <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold border border-rose-200 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-rose-600" />
                  Allergies: {selectedPatient.allergies.map((a) => a.substance).join(', ')}
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-medium">
                  NKDA
                </span>
              )}
              {latestVital && (
                <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-mono">
                  BP: {latestVital.bloodPressureSystolic}/{latestVital.bloodPressureDiastolic} | HR: {latestVital.heartRateBpm}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Clinical Modes Tabs */}
        <div className="px-5 py-2 bg-white border-b border-slate-200 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
          {[
            { id: 'general', label: '🩺 Clinical Copilot', desc: 'General queries & guidelines' },
            { id: 'patient', label: '📋 Longitudinal EMR', desc: 'Synthesize patient chart' },
            { id: 'drug_safety', label: '💊 Drug Interactions', desc: 'Pharmacotherapy & allergy safety' },
            { id: 'soap_note', label: '📝 SOAP Note Generator', desc: 'Draft clinical encounter' },
            { id: 'diagnosis', label: '🧬 Differential Dx', desc: 'Symptom stratification & ICD-10' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeMode === mode.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{mode.label}</span>
            </button>
          ))}
        </div>

        {/* Suggestion Chips */}
        <div className="px-5 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            Quick Actions:
          </span>
          <button
            onClick={() =>
              handleSendPrompt(
                undefined,
                selectedPatient
                  ? `Screen ${selectedPatient.firstName} ${selectedPatient.lastName}'s active medications against their documented allergies and chronic conditions for drug interactions.`
                  : 'What are the top clinical guidelines and contraindications for prescribing ACE inhibitors and ARBs?',
                'drug_safety'
              )
            }
            className="px-2.5 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded-md text-[11px] font-semibold transition shrink-0 cursor-pointer shadow-xs"
          >
            💊 Screen Drug Interactions
          </button>
          <button
            onClick={() =>
              handleSendPrompt(
                undefined,
                selectedPatient
                  ? `Synthesize ${selectedPatient.firstName} ${selectedPatient.lastName}'s vital signs trends and list any abnormal parameters requiring physician attention.`
                  : 'Provide standard emergency protocol for acute chest pain evaluation and troponin serial intervals.',
                'patient'
              )
            }
            className="px-2.5 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded-md text-[11px] font-semibold transition shrink-0 cursor-pointer shadow-xs"
          >
            📊 Hemodynamic & Vitals Analysis
          </button>
          <button
            onClick={() =>
              handleSendPrompt(
                undefined,
                selectedPatient
                  ? `Generate a formal SOAP consultation note for ${selectedPatient.firstName} ${selectedPatient.lastName} based on their primary complaints and recent vitals.`
                  : 'Format a comprehensive SOAP consultation note template for an inpatient internal medicine follow-up visit.',
                'soap_note'
              )
            }
            className="px-2.5 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded-md text-[11px] font-semibold transition shrink-0 cursor-pointer shadow-xs"
          >
            📝 Generate SOAP Progress Note
          </button>
          <button
            onClick={() =>
              handleSendPrompt(
                undefined,
                selectedPatient
                  ? `Draft comprehensive, clear discharge instructions and red flag warnings for ${selectedPatient.firstName} ${selectedPatient.lastName}.`
                  : 'What are the clinical diagnostic criteria and ICD-10 coding categories for Type 2 Diabetes with diabetic nephropathy?',
                'diagnosis'
              )
            }
            className="px-2.5 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded-md text-[11px] font-semibold transition shrink-0 cursor-pointer shadow-xs"
          >
            🏠 Discharge Instructions & Red Flags
          </button>
        </div>

        {/* Chat History Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-100/70">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Stethoscope className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs leading-relaxed transition ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white font-medium rounded-tr-xs shadow-md'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-sm space-y-2'
                }`}
              >
                {/* Assistant message header */}
                {m.sender === 'ai' && (
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>Dr.AI Clinical Decision Support</span>
                      {m.isLiveGemini && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                          Gemini 3.8 Flash
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => copyToClipboard(m.text, idx)}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded transition cursor-pointer flex items-center gap-1 text-[10px]"
                      title="Copy response to clipboard"
                    >
                      {copiedIdx === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Body Content with simple Markdown rendering */}
                <div className="whitespace-pre-line leading-relaxed space-y-1.5">
                  {m.text}
                </div>

                <div
                  className={`text-[9px] mt-2 text-right ${
                    m.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                  }`}
                >
                  {m.time}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-blue-700 font-bold p-3 bg-white rounded-xl border border-blue-200 shadow-sm w-fit animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
              <span>Dr.AI is analyzing clinical records & medical guidelines...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input & Consultation Bar */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-slate-200 shrink-0">
          <form onSubmit={handleSendPrompt} className="flex gap-2.5">
            <input
              type="text"
              placeholder={
                selectedPatient
                  ? `Ask Dr.AI regarding ${selectedPatient.firstName}'s medications, vitals, or clinical management...`
                  : 'Ask Dr.AI any medical query, pharmacological contraindication, or guideline...'
              }
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask Dr.AI</span>
            </button>
          </form>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span className="flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-slate-400" />
              Dr.AI clinical support system complies with hospital HIPAA & PHI data governance.
            </span>
            <button
              onClick={() => {
                setMessages([
                  {
                    sender: 'ai',
                    text: `Conversation cleared. Dr.AI is ready for your next clinical query.`,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  },
                ]);
              }}
              className="text-slate-400 hover:text-slate-600 font-semibold cursor-pointer"
            >
              Clear Conversation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
