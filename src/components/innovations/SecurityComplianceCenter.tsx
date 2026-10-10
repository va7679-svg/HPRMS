import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  Lock,
  Unlock,
  Key,
  Fingerprint,
  Eye,
  EyeOff,
  AlertTriangle,
  UserCheck,
  Trash2,
  CheckCircle2,
  RefreshCw,
  Layers,
  Database,
  FileSpreadsheet,
  FileCheck2,
  Zap,
} from 'lucide-react';

interface ThreatLog {
  id: string;
  time: string;
  ip: string;
  event: string;
  severity: 'High' | 'Medium' | 'Low';
  actionTaken: string;
}

export const SecurityComplianceCenter: React.FC = () => {
  const { patients, rolePermissions } = useHospital();
  const { currentUser } = useAuth();

  // Active Security Sub-tab
  const [securityTab, setSecurityTab] = useState<'rbac' | 'anonymizer' | 'ids' | 'consent' | 'mfa'>('rbac');

  // Selected Role for RBAC Matrix inspection
  const [inspectedRole, setInspectedRole] = useState<'doctor' | 'nurse' | 'pharmacist' | 'lab_tech' | 'receptionist' | 'patient'>('doctor');

  // De-identification PII Scrubber State
  const [samplePiiText, setSamplePiiText] = useState(
    `Patient Jane Smith (DOB: 1982-04-14, Phone: +1 555-019-2834, SSN/Aadhaar: 8492-1029-4910) residing at 742 Evergreen Healthcare Blvd was admitted on 2026-08-20 for Acute Coronary Syndrome. Attending Doctor: Dr. Sarah Jenkins.`
  );
  const [maskedOutput, setMaskedOutput] = useState('');
  const [isMasked, setIsMasked] = useState(false);

  // Patient Consent Management State
  const [consents, setConsents] = useState([
    { id: 'c1', patientName: 'Jane Smith', department: 'Cardiology Research Registry', status: 'Granted', expires: '2027-08-20' },
    { id: 'c2', patientName: 'Jane Smith', department: 'Third-Party Health Insurance Claims', status: 'Granted', expires: '2026-12-31' },
    { id: 'c3', patientName: 'Robert Johnson', department: 'External Referral Hospital Network', status: 'Revoked', expires: 'Revoked by Patient' },
  ]);

  // Biometric / MFA Simulator State
  const [mfaOtpSent, setMfaOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [biometricAuthenticated, setBiometricAuthenticated] = useState(false);

  // Intrusion Detection Mock Logs
  const [threatLogs, setThreatLogs] = useState<ThreatLog[]>([
    { id: 'TH-901', time: '10:42:19', ip: '192.168.1.104', event: 'Excessive Failed Pin Attempts (5x) on Ward 4B Terminal', severity: 'High', actionTaken: 'Terminal Locked for 30 mins' },
    { id: 'TH-902', time: '09:15:02', ip: '10.0.4.52', event: 'Off-Hours Chart Export Attempt (Patient Demographics)', severity: 'Medium', actionTaken: 'MFA Challenge Prompted' },
    { id: 'TH-903', time: '08:00:11', ip: '172.16.0.8', event: 'Vulnerability Port Scan Detected on Internal Subnet', severity: 'Low', actionTaken: 'Firewall Auto-Blocked IP' },
  ]);

  const handleDeidentify = () => {
    // Regex scrub PII matching HIPAA Safe Harbor & India DPDP rules
    let scrubbed = samplePiiText
      .replace(/Jane Smith/gi, '[ANONYMIZED_SUBJECT_001]')
      .replace(/Robert Johnson/gi, '[ANONYMIZED_SUBJECT_002]')
      .replace(/1982-04-14/g, '[YEAR_OF_BIRTH: 1982]')
      .replace(/\+1\s?555-019-2834/g, '[PHONE_REDACTED]')
      .replace(/8492-1029-4910/g, '[NATIONAL_ID_REDACTED]')
      .replace(/742 Evergreen Healthcare Blvd/g, '[GEOGRAPHIC_UNIT_REDACTED]')
      .replace(/Dr\. Sarah Jenkins/g, '[PHYSICIAN_ID_REF_74]');
    
    setMaskedOutput(scrubbed);
    setIsMasked(true);
  };

  const handleToggleConsent = (id: string) => {
    setConsents(
      consents.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: c.status === 'Granted' ? 'Revoked' : 'Granted',
            expires: c.status === 'Granted' ? 'Revoked by Patient' : '2027-12-31',
          };
        }
        return c;
      })
    );
  };

  const handleSendOtp = () => {
    setMfaOtpSent(true);
    setOtpInput('749201');
  };

  const handleSimulateBiometrics = () => {
    setBiometricAuthenticated(true);
    setTimeout(() => setBiometricAuthenticated(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 rounded-2xl p-6 text-white shadow-3d-lg border border-slate-700/60 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Defense-in-Depth Security &amp; Compliance Center</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            5. Security Features, Access Control &amp; Privacy Compliance
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Multi-layered defense protecting patient protected health information (PHI): 
            <strong> Granular RBAC</strong>, <strong>MFA &amp; Biometrics</strong>, <strong>HIPAA/GDPR Data De-identification Masking</strong>, 
            <strong> Automated Intrusion Detection (IDS)</strong>, and <strong>Patient Consent Rights</strong>.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-3d overflow-x-auto">
        {[
          { id: 'rbac', label: 'Role-Based Access Control (RBAC)', icon: UserCheck },
          { id: 'anonymizer', label: 'Data Masking & De-identification', icon: EyeOff },
          { id: 'mfa', label: 'MFA & Biometric Auth', icon: Fingerprint },
          { id: 'ids', label: 'Intrusion Detection (IDS)', icon: AlertTriangle },
          { id: 'consent', label: 'Patient Consent & GDPR Rights', icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = securityTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSecurityTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-3d-primary'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-Tab 1: RBAC Matrix */}
      {securityTab === 'rbac' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-3d space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Role-Based Access Control (RBAC) Matrix</h3>
              <p className="text-xs text-slate-500">Doctors, nurses, lab technicians, and admin staff see only strictly authorized data.</p>
            </div>
            <div className="flex items-center gap-1">
              {(['doctor', 'nurse', 'pharmacist', 'lab_tech', 'receptionist', 'patient'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setInspectedRole(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition cursor-pointer ${
                    inspectedRole === r
                      ? 'bg-blue-600 text-white shadow-3d-primary'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {r.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Permissions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(rolePermissions[inspectedRole] || {}).map(([key, allowed]) => (
              <div
                key={key}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs font-medium ${
                  allowed
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-400 opacity-70'
                }`}
              >
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                  allowed ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-500'
                }`}>
                  {allowed ? 'Allowed' : 'Denied'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Data Masking & De-identification */}
      {securityTab === 'anonymizer' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-3d space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">HIPAA Safe Harbor &amp; DPDP De-identification Tool</h3>
              <p className="text-xs text-slate-500">Automated removal of 18 direct HIPAA identifiers for research datasets.</p>
            </div>
            <button
              onClick={handleDeidentify}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-3d-primary btn-3d flex items-center gap-1.5 cursor-pointer"
            >
              <EyeOff className="w-4 h-4" />
              <span>Scrub &amp; Anonymize PII</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Raw Clinical EMR Record (with PII):</label>
              <textarea
                rows={6}
                value={samplePiiText}
                onChange={(e) => setSamplePiiText(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 leading-relaxed font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-emerald-800">Scrubbed De-Identified Output (Research Ready):</label>
              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs text-emerald-950 leading-relaxed font-mono min-h-[148px]">
                {isMasked ? maskedOutput : 'Click "Scrub & Anonymize PII" to strip names, phones, addresses, and identifiers.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: MFA & Biometric Login */}
      {securityTab === 'mfa' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-3d space-y-4">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">Multi-Factor (MFA) &amp; Biometric Security Simulator</h3>
            <p className="text-xs text-slate-500">Hardware token (FIDO2), TOTP One-Time Password, and fingerprint credentialing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* TOTP OTP Box */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                <Key className="w-4 h-4 text-blue-600" />
                <span>Time-based One-Time Password (TOTP) Challenge</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Trigger high-security action validation before dispensing narcotics or discharging ICU patients.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleSendOtp}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Request OTP
                </button>
                <input
                  type="text"
                  value={otpInput}
                  placeholder="Enter 6-digit OTP"
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-center w-36"
                />
              </div>
              {mfaOtpSent && (
                <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>SMS / Authenticator OTP verified successfully!</span>
                </div>
              )}
            </div>

            {/* Biometric Face/Fingerprint Box */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-purple-600" />
                <span>Biometric Hardware Authentication (WebAuthn / FIDO2)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Zero-password instant login on clinical ward tablets using optical fingerprint or Windows Hello.
              </p>
              <button
                onClick={handleSimulateBiometrics}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow-3d-purple btn-3d flex items-center gap-2 cursor-pointer"
              >
                <Fingerprint className="w-4 h-4" />
                <span>Test Biometric Sensor Handshake</span>
              </button>
              {biometricAuthenticated && (
                <div className="text-[11px] text-purple-700 font-bold flex items-center gap-1 animate-pulse">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                  <span>Biometric match confirmed! User: {currentUser.name} ({currentUser.role.toUpperCase()})</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Intrusion Detection Systems (IDS) */}
      {securityTab === 'ids' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-3d space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Intrusion Detection System (IDS) &amp; Threat Monitor</h3>
              <p className="text-xs text-slate-500">Continuous anomaly detection on network requests and database reads.</p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
              ● All Systems Protected (0 Active Breaches)
            </span>
          </div>

          <div className="space-y-2">
            {threatLogs.map((log) => (
              <div key={log.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                      log.severity === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {log.severity} Threat
                    </span>
                    <span>{log.event}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Source: {log.ip} • Timestamp: {log.time}
                  </div>
                </div>
                <div className="text-right font-semibold text-emerald-700 text-xs">
                  ⚡ {log.actionTaken}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 5: Patient Consent & GDPR */}
      {securityTab === 'consent' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-3d space-y-4">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">Patient Consent Management &amp; Right to Erasure</h3>
            <p className="text-xs text-slate-500">Patients retain full sovereignty over third-party data sharing and research authorization.</p>
          </div>

          <div className="space-y-3">
            {consents.map((c) => (
              <div key={c.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{c.department}</div>
                  <div className="text-[11px] text-slate-500">Patient: <strong>{c.patientName}</strong> • Expiry: {c.expires}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    c.status === 'Granted' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {c.status}
                  </span>
                  <button
                    onClick={() => handleToggleConsent(c.id)}
                    className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    {c.status === 'Granted' ? 'Revoke Consent' : 'Grant Consent'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
