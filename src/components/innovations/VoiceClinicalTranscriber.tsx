import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  FileText,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  Stethoscope,
  Volume2,
} from 'lucide-react';

const SAMPLE_DICTATIONS = [
  {
    title: 'Cardiac Evaluation (Hypertension / Angina)',
    rawText: "Patient is a 54-year-old male presenting with intermittent substernal chest pressure for three days, exacerbated by climbing stairs. No diaphoresis or nausea. On examination, blood pressure is 148 over 92, heart rate 78 regular, lungs clear to auscultation. Assessment: Atypical Angina Pectoris and Essential Hypertension. Plan: Order 12-lead ECG, troponin I serial levels, prescribe Atorvastatin 20mg daily and Metoprolol 25mg twice daily, follow up in clinic in 5 days.",
    subjective: "54-year-old male reports 3-day history of intermittent substernal chest pressure, triggered by physical exertion (climbing stairs). Denies radiating pain, diaphoresis, shortness of breath, or nausea.",
    objective: "BP: 148/92 mmHg, HR: 78 bpm regular rhythm, SpO2: 98% on room air. Lungs clear to auscultation bilaterally. Heart S1/S2 present, no murmurs, rubs, or gallops.",
    assessment: "1. Atypical Angina Pectoris (ICD-10: I20.9)\n2. Essential Primary Hypertension, Stage 1 (ICD-10: I10)",
    plan: "1. Urgent 12-Lead ECG & Serial Serum Troponin I.\n2. Initiate Atorvastatin 20mg PO QHS.\n3. Initiate Metoprolol Tartrate 25mg PO BID.\n4. Strict low-sodium DASH diet & outpatient cardiology follow-up in 5 days.",
  },
  {
    title: 'Endocrine Review (Type 2 Diabetes)',
    rawText: "Follow-up visit for 48-year-old female with Type 2 Diabetes Mellitus. Patient reports mild polydipsia, fasting fingersticks averaging 160 to 180 mg/dL. Current HbA1c is 8.2%. Feet exam shows intact monofilament sensation, no ulcerations. Assessment: Inadequately controlled Type 2 Diabetes without acute complication. Plan: Increase Metformin to 1000mg twice daily with meals, add Empagliflozin 10mg daily, order comprehensive lipid panel and urine microalbumin, repeat HbA1c in 3 months.",
    subjective: "48-year-old female with known Type 2 DM presents for quarterly follow-up. Complains of mild increased thirst. Fasting blood glucose log shows values between 160–180 mg/dL over past 2 weeks.",
    objective: "HbA1c: 8.2%. BMI: 28.4 kg/m². Blood Pressure: 126/78 mmHg. Bilateral lower extremities: 5.07 monofilament sensation intact, pedal pulses 2+ symmetric, no skin breakdown.",
    assessment: "1. Type 2 Diabetes Mellitus without complications, inadequately controlled (ICD-10: E11.65)",
    plan: "1. Titrate Metformin from 500mg BID to 1000mg PO BID with meals.\n2. Add Empagliflozin 10mg PO QAM.\n3. Order Urine Albumin-to-Creatinine Ratio (UACR) & Lipid Panel.\n4. Dietary consultation & repeat HbA1c in 12 weeks.",
  },
];

export const VoiceClinicalTranscriber: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);
  const [transcript, setTranscript] = useState(SAMPLE_DICTATIONS[0].rawText);
  const [isProcessing, setIsProcessing] = useState(false);
  const [structuredSoap, setStructuredSoap] = useState<{
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  }>({
    subjective: SAMPLE_DICTATIONS[0].subjective,
    objective: SAMPLE_DICTATIONS[0].objective,
    assessment: SAMPLE_DICTATIONS[0].assessment,
    plan: SAMPLE_DICTATIONS[0].plan,
  });

  const [copied, setCopied] = useState(false);

  const handleSelectSample = (index: number) => {
    setSelectedSampleIndex(index);
    setTranscript(SAMPLE_DICTATIONS[index].rawText);
    setStructuredSoap({
      subjective: SAMPLE_DICTATIONS[index].subjective,
      objective: SAMPLE_DICTATIONS[index].objective,
      assessment: SAMPLE_DICTATIONS[index].assessment,
      plan: SAMPLE_DICTATIONS[index].plan,
    });
  };

  const handleToggleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate live dictation typing
      setTranscript('');
      const fullText = SAMPLE_DICTATIONS[selectedSampleIndex].rawText;
      let curr = '';
      let i = 0;
      const interval = setInterval(() => {
        if (i < fullText.length) {
          curr += fullText.slice(i, i + 8);
          i += 8;
          setTranscript(curr);
        } else {
          clearInterval(interval);
          setIsRecording(false);
          triggerNlpStructuring();
        }
      }, 100);
    } else {
      setIsRecording(false);
      triggerNlpStructuring();
    }
  };

  const triggerNlpStructuring = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setStructuredSoap({
        subjective: SAMPLE_DICTATIONS[selectedSampleIndex].subjective,
        objective: SAMPLE_DICTATIONS[selectedSampleIndex].objective,
        assessment: SAMPLE_DICTATIONS[selectedSampleIndex].assessment,
        plan: SAMPLE_DICTATIONS[selectedSampleIndex].plan,
      });
      setIsProcessing(false);
    }, 800);
  };

  const handleCopySoap = () => {
    const text = `SOAP CLINICAL NOTE\n\nSUBJECTIVE:\n${structuredSoap.subjective}\n\nOBJECTIVE:\n${structuredSoap.objective}\n\nASSESSMENT:\n${structuredSoap.assessment}\n\nPLAN:\n${structuredSoap.plan}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-3d space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 shadow-inner-bevel">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">Voice Recognition & Clinical NLP Transcriber</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-200">
                NLP Medical Engine
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Physicians dictate unstructured voice notes that are automatically transformed into codified SOAP formats and ICD-10 diagnoses.
            </p>
          </div>
        </div>

        {/* Dictation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleRecord}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
              isRecording
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-3d-red animate-pulse'
                : 'bg-amber-600 hover:bg-amber-700 text-white shadow-3d-amber btn-3d'
            }`}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{isRecording ? 'Stop & Auto-Structure' : 'Start Voice Dictation'}</span>
          </button>
          <button
            onClick={handleCopySoap}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy SOAP'}</span>
          </button>
        </div>
      </div>

      {/* Preset Clinician Scenarios */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-slate-600 shrink-0">Sample Audio Dictation:</span>
        {SAMPLE_DICTATIONS.map((sample, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectSample(idx)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 cursor-pointer ${
              selectedSampleIndex === idx
                ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {sample.title}
          </button>
        ))}
      </div>

      {/* Grid: Raw Dictation Audio Feed vs Structured SOAP Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Raw Audio Dictation Buffer */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Raw Dictated Transcript</span>
            </span>
            {isRecording && <span className="text-[10px] text-rose-600 font-mono animate-pulse">● Recording audio...</span>}
          </div>
          <textarea
            rows={12}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Click 'Start Voice Dictation' or type unstructured physician notes..."
            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 leading-relaxed font-sans focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            onClick={triggerNlpStructuring}
            disabled={isProcessing}
            className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isProcessing ? 'Processing NLP Entity Extraction...' : 'Re-Run Medical NLP Parsing'}</span>
          </button>
        </div>

        {/* Right Column: Parsed Structured SOAP Note */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Auto-Generated Structured EMR SOAP Note</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
              ICD-10 Codified
            </span>
          </div>

          <div className="p-4 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 space-y-3 max-h-[340px] overflow-y-auto font-sans text-xs">
            
            {/* Subjective */}
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Subjective (S)</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed pl-2.5 border-l-2 border-amber-500/40">
                {structuredSoap.subjective}
              </p>
            </div>

            {/* Objective */}
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>Objective (O)</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed pl-2.5 border-l-2 border-blue-500/40">
                {structuredSoap.objective}
              </p>
            </div>

            {/* Assessment */}
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Assessment &amp; Diagnoses (A)</span>
              </div>
              <pre className="text-emerald-300 text-xs leading-relaxed pl-2.5 border-l-2 border-emerald-500/40 font-mono whitespace-pre-wrap">
                {structuredSoap.assessment}
              </pre>
            </div>

            {/* Plan */}
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span>Clinical Care Plan (P)</span>
              </div>
              <pre className="text-slate-300 text-xs leading-relaxed pl-2.5 border-l-2 border-purple-500/40 font-mono whitespace-pre-wrap">
                {structuredSoap.plan}
              </pre>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
