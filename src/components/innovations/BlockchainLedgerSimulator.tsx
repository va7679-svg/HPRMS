import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  Link2,
  ShieldCheck,
  Lock,
  Unlock,
  AlertTriangle,
  RefreshCw,
  FileCheck2,
  CheckCircle2,
  Database,
  Search,
} from 'lucide-react';

interface Block {
  index: number;
  timestamp: string;
  patientId: string;
  action: string;
  doctorName: string;
  previousHash: string;
  hash: string;
  nonce: number;
  isTampered: boolean;
}

// Simple fast SHA-256 mock hash function for interactive ledger simulation
function computeMockHash(index: number, timestamp: string, patientId: string, action: string, prevHash: string, nonce: number): string {
  const str = `${index}-${timestamp}-${patientId}-${action}-${prevHash}-${nonce}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `0000${hex}${hex.split('').reverse().join('')}`.slice(0, 32);
}

export const BlockchainLedgerSimulator: React.FC = () => {
  const { patients, auditLogs } = useHospital();

  const [blocks, setBlocks] = useState<Block[]>(() => {
    const initialBlocks: Block[] = [
      {
        index: 0,
        timestamp: '2026-08-20T08:00:00.000Z',
        patientId: 'GENESIS-BLOCK',
        action: 'SRM Medical Enterprise Blockchain Genesis Block',
        doctorName: 'System Security Module',
        previousHash: '00000000000000000000000000000000',
        hash: '0000a1b2c3d4e5f678901234567890ab',
        nonce: 4281,
        isTampered: false,
      },
      {
        index: 1,
        timestamp: '2026-08-21T09:30:00.000Z',
        patientId: 'HPR-2026-0042',
        action: 'SOAP Consultation & Essential Hypertension Diagnosis',
        doctorName: 'Dr. Sarah Jenkins, MD',
        previousHash: '0000a1b2c3d4e5f678901234567890ab',
        hash: '00008f9e1a2b3c4d5e6f7a8b9c0d1e2f',
        nonce: 19283,
        isTampered: false,
      },
      {
        index: 2,
        timestamp: '2026-08-22T11:15:00.000Z',
        patientId: 'HPR-2026-0042',
        action: 'E-Prescription Dispensed: Atorvastatin 20mg & Lisinopril 10mg',
        doctorName: 'Pharm. David Kim, RPh',
        previousHash: '00008f9e1a2b3c4d5e6f7a8b9c0d1e2f',
        hash: '00003c4d5e6f7a8b9c0d1e2f3a4b5c6d',
        nonce: 8741,
        isTampered: false,
      },
      {
        index: 3,
        timestamp: '2026-08-23T14:45:00.000Z',
        patientId: 'HPR-2026-0089',
        action: 'Inpatient ICU Bed Admission: Telemetry Ward 4B',
        doctorName: 'Dr. Marcus Vance, DO',
        previousHash: '00003c4d5e6f7a8b9c0d1e2f3a4b5c6d',
        hash: '000099887766554433221100aabbccdd',
        nonce: 63102,
        isTampered: false,
      },
      {
        index: 4,
        timestamp: '2026-08-24T16:20:00.000Z',
        patientId: 'HPR-2026-0115',
        action: 'Pathology Lab Verified: Cardiac Troponin I (0.01 ng/mL Normal)',
        doctorName: 'Dr. Michael Chen, MD',
        previousHash: '000099887766554433221100aabbccdd',
        hash: '0000eeff00112233445566778899aabb',
        nonce: 31054,
        isTampered: false,
      },
    ];
    return initialBlocks;
  });

  const [newAction, setNewAction] = useState('Critical Allergy Alert Added: Penicillin (Anaphylaxis)');
  const [selectedPatient, setSelectedPatient] = useState(patients[0]?.patientId || 'HPR-2026-0042');
  const [isVerifying, setIsVerifying] = useState(false);

  // Add a new immutable block to the chain
  const handleMineBlock = () => {
    const lastBlock = blocks[blocks.length - 1];
    const newIndex = blocks.length;
    const timestamp = new Date().toISOString();
    const nonce = Math.floor(Math.random() * 90000) + 10000;
    const newHash = computeMockHash(newIndex, timestamp, selectedPatient, newAction, lastBlock.hash, nonce);

    const newBlock: Block = {
      index: newIndex,
      timestamp,
      patientId: selectedPatient,
      action: newAction,
      doctorName: 'Dr. Sarah Jenkins, MD',
      previousHash: lastBlock.hash,
      hash: newHash,
      nonce,
      isTampered: false,
    };

    setBlocks([...blocks, newBlock]);
  };

  // Simulate an unauthorized database tampering attempt
  const handleSimulateTamper = (index: number) => {
    setBlocks(
      blocks.map((b, i) => {
        if (i === index) {
          return {
            ...b,
            action: '⚠️ [MALICIOUSLY ALTERED BY UNAUTHORIZED USER] Prescription dosage wiped',
            hash: '0000BAD_HASH_CORRUPTED_LEDGER_99',
            isTampered: true,
          };
        }
        return b;
      })
    );
  };

  // Repair / verify blockchain integrity
  const handleVerifyChain = () => {
    setIsVerifying(true);
    setTimeout(() => {
      // Recompute validity
      let isValid = true;
      for (let i = 1; i < blocks.length; i++) {
        if (blocks[i].previousHash !== blocks[i - 1].hash || blocks[i].isTampered) {
          isValid = false;
        }
      }
      setIsVerifying(false);
      if (!isValid) {
        alert('⚠️ Tamper Detection Alarm: Cryptographic hash chain broken at block! Integrity violation detected.');
      } else {
        alert('✅ Cryptographic Chain Integrity Verified: All blocks mathematically valid and untampered.');
      }
    }, 600);
  };

  const handleResetLedger = () => {
    setBlocks(blocks.map((b) => ({ ...b, isTampered: false })));
  };

  const hasTamper = blocks.some((b) => b.isTampered);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-3d space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 shadow-inner-bevel">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">Blockchain Immutable Health Ledger</h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                hasTamper
                  ? 'bg-rose-100 text-rose-800 border-rose-200 animate-pulse'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-200'
              }`}>
                {hasTamper ? '⚠️ Tamper Alarm Active' : '● Cryptographically Intact'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              SHA-256 hash chaining ensures medical records and clinical audits cannot be silently modified or deleted.
            </p>
          </div>
        </div>

        {/* Verification Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleVerifyChain}
            disabled={isVerifying}
            className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-3d-purple btn-3d cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isVerifying ? 'Verifying...' : 'Verify Cryptographic Integrity'}</span>
          </button>
          {hasTamper && (
            <button
              onClick={handleResetLedger}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restore Chain</span>
            </button>
          )}
        </div>
      </div>

      {/* Add New Block Form */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
        <div className="font-bold text-xs text-slate-800 flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-purple-600" />
          <span>Mine New Immutable Medical Record Block:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-4">
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Target Patient:</label>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-900"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.patientId}>
                  {p.firstName} {p.lastName} ({p.patientId})
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-6">
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Clinical Record Payload:</label>
            <input
              type="text"
              value={newAction}
              onChange={(e) => setNewAction(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900"
            />
          </div>
          <div className="sm:col-span-2 flex items-end">
            <button
              onClick={handleMineBlock}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-3d-emerald btn-3d flex items-center justify-center gap-1 cursor-pointer"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Commit Block</span>
            </button>
          </div>
        </div>
      </div>

      {/* Block Chaining Timeline */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Live Block Sequence ({blocks.length} Blocks):
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {blocks.map((b) => (
            <div
              key={b.index}
              className={`p-4 rounded-xl border transition-all space-y-2 card-3d-lift ${
                b.isTampered
                  ? 'bg-rose-50 border-rose-400 shadow-3d-red ring-2 ring-rose-500/30'
                  : 'bg-white border-slate-200 shadow-3d'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black font-mono">
                    #{b.index}
                  </span>
                  <span className="text-[11px] font-bold text-slate-800">{b.patientId}</span>
                </div>
                {!b.isTampered && b.index > 0 && (
                  <button
                    onClick={() => handleSimulateTamper(b.index)}
                    className="text-[10px] px-2 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 transition cursor-pointer"
                    title="Simulate attacker modifying database table directly"
                  >
                    Simulate Tamper
                  </button>
                )}
              </div>

              <div className="text-xs font-semibold text-slate-900 leading-snug">
                {b.action}
              </div>

              <div className="text-[10px] text-slate-500">
                Signer: <strong>{b.doctorName}</strong> • {new Date(b.timestamp).toLocaleTimeString()}
              </div>

              <div className="space-y-1 font-mono text-[10px] bg-slate-50 p-2 rounded-lg border border-slate-200">
                <div className="truncate text-slate-500">
                  <strong className="text-slate-700">Prev Hash:</strong> {b.previousHash}
                </div>
                <div className={`truncate font-bold ${b.isTampered ? 'text-rose-600' : 'text-emerald-700'}`}>
                  <strong>Block Hash:</strong> {b.hash}
                </div>
                <div className="text-slate-400">
                  Nonce: {b.nonce}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
