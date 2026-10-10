import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, Unlock, ShieldAlert, KeyRound, AlertCircle } from 'lucide-react';

export const LockScreenModal: React.FC = () => {
  const { isLocked, unlockSession, currentUser } = useAuth();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isLocked) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError('Please enter your staff security PIN/passcode');
      return;
    }

    const success = unlockSession(pin);
    if (!success) {
      setError('Invalid PIN code. Try 1234 or your staff PIN.');
    } else {
      setError('');
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 shadow-3d-lg space-y-5 animate-in fade-in zoom-in-95 duration-200 text-center">
        
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center mx-auto shadow-inner-bevel">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            HIPAA Security Lock Active
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Session suspended for <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.role.replace('_', ' ').toUpperCase()}).
          </p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-3.5">
          <div className="relative">
            <input
              type="password"
              autoFocus
              placeholder="Enter PIN (Default: 1234)"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-sm font-mono tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
            />
            <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          {error && (
            <div className="text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-2 flex items-center justify-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-3d-primary btn-3d flex items-center justify-center gap-2 cursor-pointer"
          >
            <Unlock className="w-4 h-4" />
            <span>Unlock Medical Session</span>
          </button>
        </form>

        <div className="text-[10px] text-slate-400 font-medium">
          Protected by AES-256 state encryption & institutional audit trail
        </div>
      </div>
    </div>
  );
};
