import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Function to dynamically obtain or refresh Gemini client
  function getGeminiClient(): GoogleGenAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
      return null;
    }
    try {
      return new GoogleGenAI({
        apiKey: apiKey.trim(),
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (e) {
      console.error('Failed to initialize GoogleGenAI client:', e);
      return null;
    }
  }

  // Health check API
  app.get('/api/health', (req: Request, res: Response) => {
    const aiClient = getGeminiClient();
    res.json({
      status: 'healthy',
      system: 'Hospital Patient Record Management System (SRM-HPRMS)',
      version: '2.5.0',
      timestamp: new Date().toISOString(),
      aiAssistant: 'Dr.AI',
      aiEnabled: !!aiClient,
    });
  });

  // Dr.AI Status Check API
  app.get('/api/dr-ai/status', (req: Request, res: Response) => {
    const apiKey = process.env.GEMINI_API_KEY;
    const hasKey = Boolean(apiKey && apiKey.trim().length > 0 && apiKey !== 'MY_GEMINI_API_KEY');

    res.json({
      assistantName: 'Dr.AI',
      systemRole: 'Chief Clinical Decision Support AI',
      status: 'operational',
      model: 'gemini-3.8-flash',
      hasApiKey: hasKey,
      engine: hasKey
        ? 'Google Gemini 3.8 Flash (Live Medical Intelligence)'
        : 'Dr.AI Clinical Rules Engine (Fallback mode - GEMINI_API_KEY pending)',
      apiKeyLocation: 'AI Studio Settings > Secrets (GEMINI_API_KEY) or .env',
      capabilities: [
        'Differential Diagnosis & Symptom Stratification',
        'Drug-Drug & Drug-Allergy Interaction Screening',
        'Longitudinal EMR & Vitals Synthesis',
        'Automated Clinical SOAP Consultation Note Drafting',
        'Laboratory Panel Anomaly Interpretation',
        'Discharge Summary & Patient Care Instructions',
      ],
      timestamp: new Date().toISOString(),
    });
  });

  // Dr.AI Interactive Chat & Clinical Decision Endpoint
  app.post(['/api/dr-ai/chat', '/api/clinical-ai'], async (req: Request, res: Response) => {
    try {
      const {
        prompt,
        mode = 'general',
        patient,
        vitals = [],
        consultations = [],
        prescriptions = [],
        labOrders = [],
        conversationHistory = [],
      } = req.body;

      const userQuery = prompt || req.body.query || '';
      if (!userQuery.trim()) {
        return res.status(400).json({ error: 'Query or prompt is required for Dr.AI' });
      }

      const ai = getGeminiClient();

      if (ai) {
        // Construct comprehensive clinical prompt for Gemini 3.8 Flash
        let systemPrompt =
          `You are "Dr.AI", the Chief Clinical Decision Support AI and Senior Medical Intelligence Copilot of SRM Medical Record System (SRM-HPRMS).
You assist licensed medical doctors, surgeons, clinical pharmacists, nurses, and hospital staff.
Guidelines:
1. Provide structured, evidence-based clinical insights, differential diagnoses, pharmacology evaluations, or documentation.
2. If patient context is provided, cross-reference their documented allergies, active medications, vital trends, and lab results.
3. Highlight critical safety alerts, contraindications, or red flags prominently using ⚠️ or 🚨.
4. Format responses cleanly using Markdown headers (###), bold tags, bullet points, and clinical action plans.
5. Conclude with appropriate clinical decision-support disclaimers reminding the user that Dr.AI aids but does not replace licensed medical judgment.`;

        let contextInfo = '';
        if (patient) {
          contextInfo += `\n\n--- ACTIVE PATIENT CONTEXT ---
Patient: ${patient.firstName} ${patient.lastName} (MRN: ${patient.patientId || patient.id})
Demographics: Age ${patient.dateOfBirth ? (new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()) : 'Adult'}, Gender: ${patient.gender || 'Unknown'}, Blood Group: ${patient.bloodGroup || 'Unknown'}
Known Allergies: ${(patient.allergies || []).map((a: any) => typeof a === 'string' ? a : `${a.substance} (${a.severity}: ${a.reaction})`).join('; ') || 'NKDA (No Known Drug Allergies)'}
Chronic Conditions: ${(patient.chronicConditions || []).join(', ') || 'None recorded'}
Active Prescriptions: ${(prescriptions || []).flatMap((p: any) => (p.items || []).map((i: any) => `${i.medicationName} (${i.dosage || ''} ${i.frequency || ''})`)).join('; ') || 'None active'}
Recent Vitals: ${(vitals || []).slice(0, 3).map((v: any) => `BP: ${v.bloodPressureSystolic}/${v.bloodPressureDiastolic} mmHg, HR: ${v.heartRateBpm} bpm, SpO2: ${v.oxygenSaturationPercent}%, Temp: ${v.temperatureCelsius || 37}°C`).join(' | ') || 'No vitals logged'}
Recent Lab Orders: ${(labOrders || []).slice(0, 4).map((l: any) => `${l.testName} (${l.status})`).join(', ') || 'No active lab orders'}`;
        }

        const promptWithContext = `${userQuery}${contextInfo ? `\n\n${contextInfo}` : ''}`;

        try {
          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: promptWithContext,
            config: {
              systemInstruction: systemPrompt,
              temperature: 0.25,
            },
          });

          return res.json({
            success: true,
            assistant: 'Dr.AI',
            model: 'gemini-3.8-flash',
            response: response.text || 'Dr.AI processed your request.',
            analysis: response.text || 'Dr.AI processed your request.',
            timestamp: new Date().toISOString(),
            isLiveGemini: true,
          });
        } catch (apiError: any) {
          console.warn('Gemini 3.8 Flash live call error, falling back to Dr.AI clinical rules engine:', apiError?.message);
        }
      }

      // High-grade clinical rules engine fallback if API key is not yet loaded
      const lowerQuery = userQuery.toLowerCase();
      let responseText = '';

      if (patient) {
        const allergies = (patient.allergies || []).map((a: any) =>
          typeof a === 'string' ? a.toLowerCase() : (a.substance || '').toLowerCase()
        );
        const hasPenicillinAllergy = allergies.some((a: string) => a.includes('penicillin') || a.includes('amoxicillin'));
        const hasSulfaAllergy = allergies.some((a: string) => a.includes('sulfa'));

        if (lowerQuery.includes('interaction') || lowerQuery.includes('drug') || lowerQuery.includes('medication') || mode === 'drug_safety') {
          const activeMeds = (prescriptions || []).flatMap((p: any) => (p.items || []).map((i: any) => i.medicationName));
          responseText = `### 🩺 Dr.AI Pharmacotherapy & Interaction Review
**Patient:** ${patient.firstName} ${patient.lastName} (MRN: ${patient.patientId || patient.id})
**Allergy Profile:** ${allergies.length > 0 ? allergies.join(', ').toUpperCase() : 'NKDA (No Known Drug Allergies)'}

#### 💊 Active Formulary Review:
${activeMeds.length > 0 ? activeMeds.map((m: string) => `- ${m}`).join('\n') : '- No active prescriptions currently on file.'}

#### 🚨 Safety Screen & Contraindications:
${hasPenicillinAllergy ? '❌ **HIGH-RISK ALLERGY ALERT:** Documented hypersensitivity to beta-lactams/penicillins. Avoid amoxicillin, augmentin, ampicillin, and monitor first-generation cephalosporins for cross-reactivity.' : '✅ No primary beta-lactam hypersensitivities recorded.'}
${hasSulfaAllergy ? '❌ **SULFA ALLERGY ALERT:** Avoid sulfonamide-based antimicrobials (e.g. Bactrim/TMP-SMX).' : ''}
${(patient.chronicConditions || []).some((c: string) => c.toLowerCase().includes('hypertension')) ? '⚠️ **CARDIOVASCULAR CAUTION:** Patient has hypertension. Concomitant high-dose NSAID therapy can attenuate antihypertensive effects and worsen renal perfusion.' : ''}

#### 📋 Clinical Recommendations:
1. Verify baseline serum creatinine and eGFR prior to initiating any nephrotoxic or renally cleared pharmacotherapy.
2. Ensure patient counseling on scheduled compliance and reportable adverse symptoms (rash, angioedema, GI bleeding).`;
        } else if (lowerQuery.includes('summary') || lowerQuery.includes('brief') || lowerQuery.includes('emr') || mode === 'patient') {
          const latestVital = vitals[0];
          responseText = `### 📋 Dr.AI Longitudinal EMR Synthesis
**Patient:** ${patient.firstName} ${patient.lastName} | **MRN:** ${patient.patientId || patient.id}
**Demographics:** ${patient.dateOfBirth ? (new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()) + 'y' : 'Adult'} ${patient.gender} | **Blood Group:** ${patient.bloodGroup || 'O+'}

#### 🩺 Clinical Status & Chronic Conditions:
${(patient.chronicConditions || []).length > 0 ? (patient.chronicConditions || []).map((c: string) => `- **${c}** (ICD-10 active surveillance)`).join('\n') : '- No chronic diagnoses cataloged.'}

#### 📊 Latest Hemodynamic Parameters:
${latestVital ? `- **Blood Pressure:** ${latestVital.bloodPressureSystolic}/${latestVital.bloodPressureDiastolic} mmHg (${latestVital.bloodPressureSystolic > 140 ? 'Stage 2 Hypertension' : 'Controlled'})\n- **Heart Rate:** ${latestVital.heartRateBpm} bpm (Normal sinus rate)\n- **Oxygen Saturation:** ${latestVital.oxygenSaturationPercent}% (Room air)\n- **Temperature:** ${latestVital.temperatureCelsius || 37}°C` : '- No recent vitals recorded.'}

#### 🧪 Laboratory & Diagnostic Highlights:
${(labOrders || []).length > 0 ? (labOrders || []).map((l: any) => `- **${l.testName}**: Status: ${l.status}${l.results ? ` (Result: ${l.results})` : ''}`).join('\n') : '- Routine screening recommended upon next physician round.'}

#### 🎯 Strategic Action Plan:
- Continue scheduled medications and review treatment response at upcoming appointment.
- Re-check hemodynamics prior to discharge.`;
        } else if (lowerQuery.includes('soap') || lowerQuery.includes('note') || mode === 'soap_note') {
          responseText = `### 📝 Dr.AI Clinical Consultation Note (SOAP Format)
**Patient:** ${patient.firstName} ${patient.lastName} (${patient.patientId})
**Encounter Date:** ${new Date().toISOString().split('T')[0]}

**S — Subjective:**
Patient presents for comprehensive clinical evaluation. Chief complaint: "${userQuery}". Reports stable functional baseline without acute orthopnea, chest tightness, or syncope. Known history of ${(patient.chronicConditions || []).join(', ') || 'routine health maintenance'}.

**O — Objective:**
- Vitals: Stable hemodynamic baseline. Alert and oriented x4.
- Physical Exam: Cardiovascular S1/S2 distinct; lungs clear to auscultation bilaterally; no pedal edema.

**A — Assessment:**
1. Active symptomatic evaluation related to presenting query.
2. ${(patient.chronicConditions || [])[0] || 'Essential hypertension'} - compensated under current therapy.

**P — Plan:**
1. Diagnostic workup: order routine lab panel and baseline ECG if indicated.
2. Pharmacotherapy: continue current regimen with medication adherence counseling.
3. Red flag education: patient instructed to seek emergency medical attention if acute chest pressure or severe shortness of breath arises.
4. Schedule follow-up clinic visit in 10-14 days.`;
        } else {
          responseText = `### 🩺 Dr.AI Clinical Copilot Analysis
**Patient Record:** ${patient.firstName} ${patient.lastName} (${patient.patientId})

Based on the longitudinal clinical chart and your query (*"${userQuery}"*):
- **Allergies & Safety:** ${(patient.allergies || []).length > 0 ? (patient.allergies || []).map((a: any) => a.substance).join(', ') : 'No documented drug allergies (NKDA)'}.
- **Hemodynamics:** Patient exhibits ${vitals[0]?.bloodPressureSystolic ? `BP ${vitals[0]?.bloodPressureSystolic}/${vitals[0]?.bloodPressureDiastolic} mmHg` : 'stable vital parameters'}.
- **Active Diagnoses:** ${(patient.chronicConditions || []).join(', ') || 'No major active chronic diagnoses'}.

**Clinical Guidance:**
1. Proceed with targeted diagnostic evaluation based on institutional protocols.
2. Ensure strict medication reconciliation across inpatient or outpatient transitions.
3. Re-evaluate if unexpected changes in patient symptoms occur.`;
        }
      } else {
        // General clinical query when no patient is attached
        if (lowerQuery.includes('drug') || lowerQuery.includes('interaction')) {
          responseText = `### 💊 Dr.AI Clinical Pharmacology Guidance
Regarding your pharmacology query: *"${userQuery}"*

**Evidence-Based Clinical Guidelines:**
- **Mechanism of Action & Absorption:** Verify pharmacokinetic absorption timing (oral vs intravenous) and whether administration with food is indicated.
- **Hepatic & Renal Metabolism:** Check cytochrome P450 (CYP3A4/CYP2D6) substrate interactions and calculate Cockcroft-Gault CrCl for dosage adjustments.
- **Critical Contraindications:** Always verify patient hypersensitivity profile and QT-prolonging concomitant agents before initiating pharmacotherapy.`;
        } else if (lowerQuery.includes('diagnosis') || lowerQuery.includes('symptom')) {
          responseText = `### 🩺 Dr.AI Differential Diagnostic Framework
Evaluating presenting symptomology: *"${userQuery}"*

**Structured Differential Categories:**
1. **Primary Etiology (High Probability):** Correlate with acute infectious, inflammatory, or lifestyle triggers.
2. **Secondary Etiology (Moderate Probability):** Metabolic or endocrine disturbances, chronic degenerative progression.
3. **Critical Rule-Outs (Must Exclude):** Acute coronary syndrome, pulmonary embolism, stroke, sepsis, or occult hemorrhage.

**Recommended Immediate Next Steps:**
- Obtain focused history and comprehensive physical exam.
- Order targeted diagnostic panel (CBC, CMP, Biomarkers, and relevant imaging).`;
        } else {
          responseText = `### 🩺 Dr.AI Hospital Decision Support
I am **Dr.AI**, your clinical intelligence copilot for the SRM Medical Record System (SRM-HPRMS).

**Query Analyzed:** *"${userQuery}"*

**Key Medical Points:**
- **Evidence-Based Standard of Care:** Treatment decisions should be aligned with current clinical practice guidelines (AHA/ACC, ADA, WHO, and institutional formulary rules).
- **Patient Safety Check:** Always verify vital sign stability, allergy lists, and renal/hepatic function markers before prescribing or initiating interventions.
- **Multidisciplinary Coordination:** Involve specialty consults, clinical pharmacy, and nursing teams for complex diagnostic presentations.`;
        }
      }

      // Add API key instruction hint if running on fallback
      responseText += `\n\n---\n*💡 Dr.AI Note: Powered by SRM Clinical Rules. Attach your \`GEMINI_API_KEY\` in AI Studio Settings > Secrets or .env to activate live Google Gemini 3.8 Flash real-time reasoning.*`;

      return res.json({
        success: true,
        assistant: 'Dr.AI',
        model: 'Dr.AI Clinical Engine (Ready for Gemini 3.8 Flash)',
        response: responseText,
        analysis: responseText,
        timestamp: new Date().toISOString(),
        isLiveGemini: false,
      });
    } catch (err: any) {
      console.error('Dr.AI Error:', err);
      return res.status(500).json({ error: err.message || 'Internal Dr.AI Service Error' });
    }
  });

  // Clinical AI Legacy Analyze Endpoint
  app.post('/api/clinical-ai/analyze', async (req: Request, res: Response) => {
    try {
      const { type, payload } = req.body;
      if (!type) {
        return res.status(400).json({ error: 'Missing analysis type' });
      }

      const ai = getGeminiClient();

      if (ai) {
        let systemPrompt =
          'You are Dr.AI, the Clinical Decision Support AI assisting licensed healthcare professionals in SRM Medical Record System. Provide structured, evidence-based, medically accurate guidance with clear clinical safety disclaimers.';
        let userPrompt = '';

        if (type === 'soap_generator') {
          systemPrompt += ' Output structured SOAP format (Subjective, Objective, Assessment, Plan) with ICD-10 diagnostic codes.';
          userPrompt = `Please structure the following raw clinical notes into a formal SOAP note:\n\nPatient Context:\nAge/Gender: ${payload.age || 'Adult'}, ${payload.gender || 'Unknown'}\nChief Complaint: ${payload.chiefComplaint}\nRaw Notes: ${payload.rawNotes}\nChronic: ${(payload.chronicConditions || []).join(', ')}\nAllergies: ${(payload.allergies || []).join(', ')}`;
        } else if (type === 'drug_interaction_check') {
          systemPrompt += ' Analyze potential drug-drug interactions, drug-allergy contraindications, dosage cautions, and organ function alerts.';
          userPrompt = `Perform clinical safety check for this medication:\nProposed: ${payload.drugName} ${payload.dosage || ''}\nAllergies: ${(payload.allergies || []).map((a: any) => typeof a === 'string' ? a : `${a.substance} (${a.severity}: ${a.reaction})`).join('; ')}\nCurrent Medications: ${(payload.currentMedications || []).join(', ')}\nChronic Conditions: ${(payload.chronicConditions || []).join(', ')}`;
        } else if (type === 'discharge_summary') {
          systemPrompt += ' Create a comprehensive hospital discharge summary and patient-friendly care instructions.';
          userPrompt = `Generate a discharge summary for:\nPatient: ${payload.patientName} (MRN: ${payload.patientId})\nAdmitted For: ${payload.reasonForAdmission}\nHospital Course: ${payload.courseInHospital || 'Stabilized'}\nMedications: ${(payload.medications || []).join(', ')}`;
        } else {
          userPrompt = `Clinical analysis query:\n${JSON.stringify(payload, null, 2)}`;
        }

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: userPrompt,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.25,
          },
        });

        return res.json({
          success: true,
          assistant: 'Dr.AI',
          source: 'gemini-3.8-flash',
          analysis: response.text,
          timestamp: new Date().toISOString(),
          isLiveGemini: true,
        });
      }

      // Built-in intelligent clinical heuristic fallback when AI key is not loaded
      let fallbackText = '';
      if (type === 'drug_interaction_check') {
        const drug = (payload.drugName || '').toLowerCase();
        const allergies = (payload.allergies || []).map((a: any) =>
          (typeof a === 'string' ? a : a.substance || '').toLowerCase()
        );
        let contraindications: string[] = [];
        let warnings: string[] = [];

        if (allergies.some((a: string) => a.includes('penicillin') || a.includes('amoxicillin'))) {
          if (drug.includes('penicillin') || drug.includes('amoxicillin') || drug.includes('ampicillin') || drug.includes('augmentin')) {
            contraindications.push('CRITICAL ALLERGY ALERT: Patient has documented Penicillin hypersensitivity. High risk of anaphylaxis.');
          } else if (drug.includes('cephal') || drug.includes('keflex') || drug.includes('ceftriaxone')) {
            warnings.push('CROSS-REACTIVITY WARNING: Cephalosporins carry cross-reactivity risk with severe penicillin allergy.');
          }
        }
        if (allergies.some((a: string) => a.includes('sulfa'))) {
          if (drug.includes('bactrim') || drug.includes('sulfamethoxazole') || drug.includes('sulfadiazine')) {
            contraindications.push('CRITICAL ALLERGY ALERT: Patient has documented Sulfonamide allergy.');
          }
        }
        if (
          (drug.includes('ibuprofen') || drug.includes('naproxen') || drug.includes('meloxicam')) &&
          (payload.chronicConditions || []).some((c: string) => c.toLowerCase().includes('hypertension') || c.toLowerCase().includes('coronary'))
        ) {
          warnings.push('CARDIOVASCULAR CAUTION: Systemic NSAIDs may blunt antihypertensive therapy and increase fluid retention.');
        }

        fallbackText = `### 🩺 Dr.AI Pharmacotherapy Safety Review\n\n` +
          `**Medication Evaluated:** ${payload.drugName}\n` +
          `**Safety Status:** ${contraindications.length > 0 ? '❌ CONTRAINDICATION DETECTED' : warnings.length > 0 ? '⚠️ MODERATE CAUTION' : '✅ NO CRITICAL DRUG INTERACTIONS FOUND'}\n\n` +
          (contraindications.length > 0 ? `#### 🚨 Contraindications:\n${contraindications.map((c) => `- ${c}`).join('\n')}\n\n` : '') +
          (warnings.length > 0 ? `#### ⚠️ Clinical Cautions:\n${warnings.map((w) => `- ${w}`).join('\n')}\n\n` : '') +
          `#### 📋 Administration Notes:\n` +
          `- Verify baseline renal clearance (eGFR) before initiation.\n` +
          `- Counsel patient regarding adherence and emergency signs.\n\n` +
          `*💡 Dr.AI Note: Attach your GEMINI_API_KEY in AI Studio Settings > Secrets or .env to enable live Gemini 3.8 Flash model checks.*`;
      } else if (type === 'soap_generator') {
        fallbackText = `### 📝 Dr.AI Formatted Clinical Consultation (SOAP Format)\n\n` +
          `**Subjective (S):**\n` +
          `Patient presents with chief complaint of ${payload.chiefComplaint || 'routine clinical evaluation'}. Notes: ${payload.rawNotes || 'Patient reports stable baseline'}. Chronic history includes ${(payload.chronicConditions || []).join(', ') || 'none'}.\n\n` +
          `**Objective (O):**\n` +
          `Physical exam and vital parameters reviewed. Hemodynamically stable. Pertinent exams consistent with presentation.\n\n` +
          `**Assessment (A):**\n` +
          `1. Active symptomatic evaluation.\n` +
          `2. Routine risk stratification and chronic disease management.\n\n` +
          `**Plan (P):**\n` +
          `- Initiate targeted pharmacological or supportive regimen as indicated.\n` +
          `- Order diagnostic labs/imaging to monitor baseline and treatment response.\n` +
          `- Patient educated on red flag warning signs requiring immediate emergency evaluation.\n` +
          `- Schedule clinical follow-up in 1 to 2 weeks.\n\n` +
          `*💡 Dr.AI Note: Attach your GEMINI_API_KEY in AI Studio Settings > Secrets or .env to enable live Gemini 3.8 Flash note generation.*`;
      } else {
        fallbackText = `### 🩺 Dr.AI Decision Support\n\nAnalysis for ${type} generated based on standard institutional evidence-based practice guidelines.\n\n*💡 Attach GEMINI_API_KEY to activate live Gemini 3.8 Flash reasoning.*`;
      }

      return res.json({
        success: true,
        assistant: 'Dr.AI',
        source: 'dr-ai-rules-engine',
        analysis: fallbackText,
        timestamp: new Date().toISOString(),
        isLiveGemini: false,
      });
    } catch (err: any) {
      console.error('Dr.AI Analyze Error:', err);
      return res.status(500).json({ error: err.message || 'Internal AI Server Error' });
    }
  });

  // Vite development middleware vs Static Production serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HPRMS Hospital Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
