import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  Sparkles,
  QrCode,
  Wifi,
  WifiOff,
  Database,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Layers,
  ArrowRight,
  HardDrive,
  CreditCard,
  UserCheck,
  Activity,
  Server,
  FileCheck2,
} from 'lucide-react';

export const ImprovementsActionCenter: React.FC = () => {
  const { patients } = useHospital();
  
  // 1. Single Patient ID / ABHA Generator State
  const [generatedAbha, setGeneratedAbha] = useState('91-8840-2918-4902');
  const [nationalIdName, setNationalIdName] = useState(patients[0]?.firstName + ' ' + patients[0]?.lastName);
  const [duplicateCheckQuery, setDuplicateCheckQuery] = useState('John Doe');
  const [duplicateResult, setDuplicateResult] = useState<{ match: boolean; count: number; ids: string[] } | null>(null);

  // 2. Offline-First Simulator State
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);
  const [cachedTransactionsCount, setCachedTransactionsCount] = useState(3);
  const [isSyncing, setIsSyncing] = useState(false);

  // 3. Automated Cloud Backup Snapshot State
  const [backupSnapshots, setBackupSnapshots] = useState([
    { id: 'SNP-2026-08-25', time: 'Yesterday 23:59:00', size: '1.42 GB', checksum: 'SHA-256: 9e8a...31bf', status: 'Replicated (3 Regions)' },
    { id: 'SNP-2026-08-26-06', time: 'Today 06:00:00', size: '1.44 GB', checksum: 'SHA-256: 4b1c...99a0', status: 'Replicated (3 Regions)' },
  ]);
  const [isCreatingSnapshot, setIsCreatingSnapshot] = useState(false);

  // 4. Staff Digital Literacy Quiz State
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // ABHA Generator
  const handleGenerateNewAbha = () => {
    const randomDigits = () => Math.floor(1000 + Math.random() * 9000);
    const newId = `91-${randomDigits()}-${randomDigits()}-${randomDigits()}`;
    setGeneratedAbha(newId);
  };

  // Duplicate Record Check
  const handleCheckDuplicates = () => {
    const query = duplicateCheckQuery.toLowerCase().trim();
    const matched = patients.filter(
      (p) =>
        p.firstName.toLowerCase().includes(query) ||
        p.lastName.toLowerCase().includes(query) ||
        p.phone.includes(query)
    );
    setDuplicateResult({
      match: matched.length > 1,
      count: matched.length,
      ids: matched.map((m) => `${m.firstName} ${m.lastName} (${m.patientId})`),
    });
  };

  // Trigger Online Sync
  const handleReconcileSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setCachedTransactionsCount(0);
      setIsSyncing(false);
    }, 1200);
  };

  // Trigger Instant Snapshot
  const handleCreateSnapshot = () => {
    setIsCreatingSnapshot(true);
    setTimeout(() => {
      const now = new Date();
      const newSnap = {
        id: `SNP-${now.toISOString().slice(0, 10)}-${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`,
        time: now.toLocaleTimeString(),
        size: '1.46 GB',
        checksum: `SHA-256: ${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 6)}`,
        status: 'Replicated (3 Regions)',
      };
      setBackupSnapshots([newSnap, ...backupSnapshots]);
      setIsCreatingSnapshot(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 rounded-2xl p-6 text-white shadow-3d-lg border border-slate-700/60 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Operational Upgrades &amp; Architecture Modernization</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            4. Improvements That Can Be Made &amp; SRM Implementations
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Ten crucial operational and infrastructural enhancements to eliminate duplicate registrations, guarantee zero data loss, 
            support rural offline clinics, and streamline insurance claim settlement.
          </p>
        </div>
      </div>

      {/* Grid of Interactive Improvements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Module 1: Single Patient ID (ABHA) & Deduplication Engine */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3d space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">1. National Single Patient ID &amp; Anti-Duplicate Engine</h3>
                <p className="text-[11px] text-slate-500">14-Digit ABHA / Aadhaar-linked universal identification</p>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Active in SRM</span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Universal ABHA Digital ID:</span>
              <button
                onClick={handleGenerateNewAbha}
                className="text-[11px] text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Re-generate ID</span>
              </button>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
              <span className="font-mono text-base font-black text-blue-700 tracking-wider">
                {generatedAbha}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                NDHM Certified
              </span>
            </div>

            {/* Deduplication Test Box */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <label className="block text-[11px] font-bold text-slate-700">Fuzzy Duplicate Record Checker:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={duplicateCheckQuery}
                  onChange={(e) => setDuplicateCheckQuery(e.target.value)}
                  placeholder="Enter patient name or phone to check..."
                  className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
                <button
                  onClick={handleCheckDuplicates}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Scan Duplicates
                </button>
              </div>
              {duplicateResult && (
                <div className={`p-2.5 rounded-lg text-xs ${
                  duplicateResult.match
                    ? 'bg-amber-50 text-amber-900 border border-amber-300'
                    : 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                }`}>
                  {duplicateResult.match ? (
                    <div>
                      <strong>⚠️ {duplicateResult.count} Potential Duplicates Found:</strong>
                      <ul className="list-disc pl-4 mt-1 text-[11px]">
                        {duplicateResult.ids.map((id, i) => <li key={i}>{id}</li>)}
                      </ul>
                    </div>
                  ) : (
                    <div>✅ Zero duplicate records detected! Unique record verified.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Module 2: Offline-First Engine & Low-Bandwidth Rural Sync */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3d space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-teal-50 text-teal-600 border border-teal-200">
                {isSimulatedOffline ? <WifiOff className="w-5 h-5 text-rose-600" /> : <Wifi className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">2. Offline-First Rural Clinic Resiliency</h3>
                <p className="text-[11px] text-slate-500">Local IndexedDB caching + automatic background reconciliation</p>
              </div>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
              isSimulatedOffline ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'
            }`}>
              {isSimulatedOffline ? 'Simulated: OFFLINE' : 'ONLINE: Synced'}
            </span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Network Simulation Toggle:</span>
              <button
                onClick={() => setIsSimulatedOffline(!isSimulatedOffline)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  isSimulatedOffline
                    ? 'bg-rose-600 text-white shadow-3d-red'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {isSimulatedOffline ? 'Restore Connection (Go Online)' : 'Simulate Remote Outage (Cut Network)'}
              </button>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1 text-xs">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-600">Pending Local Transactions (IndexedDB):</span>
                <span className="font-bold text-amber-700">{cachedTransactionsCount} records</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-slate-600">Conflict Resolution Strategy:</span>
                <span className="font-bold text-emerald-700">Last-Write-Wins CRDT</span>
              </div>
            </div>

            <button
              onClick={handleReconcileSync}
              disabled={isSimulatedOffline || isSyncing || cachedTransactionsCount === 0}
              className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                isSimulatedOffline || cachedTransactionsCount === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-teal-600 hover:bg-teal-700 text-white shadow-3d-emerald btn-3d'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Synchronizing with SRM Cloud...' : 'Flush & Sync Local Records to Cloud'}</span>
            </button>
          </div>
        </div>

        {/* Module 3: Cross-Department Synchronization Monitor */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3d space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">3. Cross-Department Real-Time Sync Bus</h3>
                <p className="text-[11px] text-slate-500">Real-time state replication across 7 hospital divisions</p>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">100% Latency &lt; 50ms</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {[
              { name: 'Emergency Trauma', status: 'Connected', ping: '12ms' },
              { name: 'Inpatient Wards', status: 'Connected', ping: '18ms' },
              { name: 'Laboratory & Path', status: 'Connected', ping: '14ms' },
              { name: 'Pharmacy Dispensing', status: 'Connected', ping: '16ms' },
              { name: 'Radiology / PACS', status: 'Connected', ping: '24ms' },
              { name: 'Billing & Insurance', status: 'Connected', ping: '20ms' },
            ].map((dept, idx) => (
              <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <div className="font-bold text-slate-800 text-[11px] truncate">{dept.name}</div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {dept.status}
                  </span>
                  <span className="font-mono text-slate-500">{dept.ping}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Module 4: Automated Encrypted Cloud Backup & Disaster Snapshots */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-3d space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">4. Automated Disaster Recovery &amp; Snapshots</h3>
                <p className="text-[11px] text-slate-500">Immutable air-gapped backups for ransomware immunity</p>
              </div>
            </div>
            <button
              onClick={handleCreateSnapshot}
              disabled={isCreatingSnapshot}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-3d-amber btn-3d cursor-pointer"
            >
              {isCreatingSnapshot ? 'Creating Snapshot...' : '+ Instant Cloud Snapshot'}
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {backupSnapshots.map((snap) => (
              <div key={snap.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                <div>
                  <div className="font-mono font-bold text-slate-900 text-[11px]">{snap.id}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{snap.checksum} • {snap.size}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    {snap.status}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-0.5">{snap.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
