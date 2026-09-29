import React, { useState } from 'react';
import { X, Key, ShieldCheck, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
import { getStoredApiKey, saveStoredApiKey } from '../services/gemini';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeySaved }) => {
  const [keyInput, setKeyInput] = useState(getStoredApiKey());
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredApiKey(keyInput);
    onKeySaved(keyInput);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    setKeyInput('');
    saveStoredApiKey('');
    onKeySaved('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full shadow-2xl overflow-hidden text-slate-800">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Google Gemini API Configuration</h3>
              <p className="text-xs text-slate-500">Live AI Integration & Inference</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Gemini API Key (Optional for live execution):
            </label>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full text-xs font-mono rounded-xl border border-slate-300 p-2.5 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Your key is saved locally in your browser session and never sent to third-party servers.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-900 space-y-1">
            <span className="font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Smart Demo Mode Active by Default
            </span>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              If left blank, JanSetu AI runs in intelligent high-fidelity demo mode with pre-computed Google AI outputs so you can test all flows without an API key!
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1"
            >
              <span>Get Free Gemini Key</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <div className="flex items-center gap-2">
              {keyInput && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
                >
                  Clear Key
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1 cursor-pointer"
              >
                {isSaved ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : null}
                <span>{isSaved ? 'Saved!' : 'Save & Activate'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
