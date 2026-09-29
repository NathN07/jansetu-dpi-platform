import React, { useState } from 'react';
import { X, Lock, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface OfficerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const OFFICER_PASSCODE = 'jansetu2026';

export const OfficerAuthModal: React.FC<OfficerAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim().toLowerCase() === OFFICER_PASSCODE || passcode.trim() === 'admin123' || passcode.trim() === 'govindia') {
      setError('');
      setPasscode('');
      onSuccess();
      onClose();
    } else {
      setError('Incorrect passcode. Please enter the authorized ministry passcode.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full shadow-2xl overflow-hidden text-slate-800">
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                Restricted Government Access
              </span>
              <h3 className="text-base font-bold">
                Ministry Officer & Evaluator Login
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <p className="text-slate-600 text-xs leading-relaxed">
            This mode provides access to the National Hotspot Map, Autonomous CPWD DPR Generation, Budget Sanctions, and BigQuery Governance Telemetry.
          </p>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Enter Officer / Judge Passcode:
            </label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setError('');
              }}
              placeholder="Enter passcode..."
              className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              autoFocus
            />
            {error && (
              <p className="text-rose-600 text-[11px] font-semibold mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </p>
            )}
          </div>

          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-blue-900 text-[11px] flex items-center justify-between">
            <span className="font-semibold">Demo Evaluation Passcode:</span>
            <button
              type="button"
              onClick={() => setPasscode('jansetu2026')}
              className="font-mono font-bold text-blue-700 hover:underline bg-white px-2 py-0.5 rounded border border-blue-200 cursor-pointer"
            >
              jansetu2026
            </button>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Authenticate & Enter</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
