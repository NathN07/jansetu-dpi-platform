import React, { useState } from 'react';
import { CitizenRequest } from '../types';
import { 
  X, 
  Search, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  FileText,
  AlertTriangle,
  QrCode
} from 'lucide-react';

interface StatusTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  requests: CitizenRequest[];
}

export const StatusTracker: React.FC<StatusTrackerProps> = ({ isOpen, onClose, requests }) => {
  const [searchTerm, setSearchTerm] = useState('JS-UP-2026-8821');
  const [searchedRequest, setSearchedRequest] = useState<CitizenRequest | null>(
    requests.find((r) => r.trackingNumber === 'JS-UP-2026-8821') || requests[0] || null
  );

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchTerm.trim().toLowerCase();
    const found = requests.find(
      (r) =>
        r.trackingNumber.toLowerCase().includes(clean) ||
        r.title.toLowerCase().includes(clean) ||
        r.district.toLowerCase().includes(clean)
    );
    if (found) {
      setSearchedRequest(found);
    } else {
      alert(`No record matching "${searchTerm}" found in DPI registry. Try "JS-UP-2026-8821" or "JS-OD-2026-1932".`);
    }
  };

  const stages = [
    { label: 'Submitted', key: 'Submitted', desc: 'Ingested via Voice/Photo/WhatsApp' },
    { label: 'AI Verified', key: 'AI_Verified', desc: 'Gemini Vision & Multilingual Authenticated' },
    { label: 'Hotspot Clustered', key: 'Hotspot_Clustered', desc: 'Spatial cluster with Gati Shakti Layer' },
    { label: 'DPR Drafted', key: 'DPR_Drafted', desc: 'Autonomous Engineering Proposal Ready' },
    { label: 'Sanctioned', key: 'Budget_Sanctioned', desc: 'Administrative & Financial Clearance' },
    { label: 'Resolved', key: 'Resolved', desc: 'On-ground execution & Citizen feedback' }
  ];

  const getStageIndex = (status: string) => {
    switch (status) {
      case 'Submitted': return 0;
      case 'AI_Verified': return 1;
      case 'Hotspot_Clustered': return 2;
      case 'DPR_Drafted': return 3;
      case 'Budget_Sanctioned': return 4;
      case 'Work_In_Progress': return 4;
      case 'Resolved': return 5;
      default: return 2;
    }
  };

  const currentStageIndex = searchedRequest ? getStageIndex(searchedRequest.status) : 2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full shadow-2xl overflow-hidden text-slate-800">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                Jan-Praman (जन-प्रमाण)
              </span>
              <h3 className="text-base sm:text-lg font-bold">
                Transparent DPI Grievance Audit Trail
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

        {/* Search Bar */}
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter DPI Token (e.g. JS-UP-2026-8821) or District..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-orange-500 bg-white"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
            >
              Verify Record
            </button>
          </form>

          <div className="flex gap-2 mt-2 text-[11px] text-slate-500">
            <span>Quick tokens:</span>
            <button
              onClick={() => {
                setSearchTerm('JS-UP-2026-8821');
                setSearchedRequest(requests.find((r) => r.trackingNumber === 'JS-UP-2026-8821') || requests[0]);
              }}
              className="font-mono text-blue-600 hover:underline"
            >
              JS-UP-2026-8821 (Water)
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setSearchTerm('JS-OD-2026-1932');
                setSearchedRequest(requests.find((r) => r.trackingNumber === 'JS-OD-2026-1932') || requests[0]);
              }}
              className="font-mono text-blue-600 hover:underline"
            >
              JS-OD-2026-1932 (Bridge)
            </button>
          </div>
        </div>

        {/* Content Body */}
        {searchedRequest ? (
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-xs">
            {/* Ticket Header Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-amber-300 font-mono font-bold block">
                  DPI CERTIFIED TOKEN:
                </span>
                <span className="text-xl font-mono font-black text-white">
                  {searchedRequest.trackingNumber}
                </span>
                <h4 className="text-sm font-bold text-slate-200 mt-1">
                  {searchedRequest.title}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>
                    {searchedRequest.blockOrWard}, {searchedRequest.district}, {searchedRequest.state}
                  </span>
                </div>
              </div>

              {/* QR Mockup */}
              <div className="bg-white p-2 rounded-xl text-slate-900 flex flex-col items-center shrink-0 w-24">
                <QrCode className="w-14 h-14" />
                <span className="text-[9px] font-mono font-bold text-center mt-0.5">
                  DPI-VERIFIED
                </span>
              </div>
            </div>

            {/* Step-by-Step Progress Pipeline */}
            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-3">
                Lifecycle Transparency Audit Pipeline:
              </span>
              <div className="relative pl-6 space-y-4 border-l-2 border-slate-200 ml-2">
                {stages.map((st, idx) => {
                  const isDone = idx <= currentStageIndex;
                  const isCurrent = idx === currentStageIndex;

                  return (
                    <div key={st.key} className="relative">
                      <div
                        className={`absolute -left-[31px] top-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isDone
                            ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {isDone ? '✓' : idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold ${
                              isCurrent ? 'text-indigo-900 text-sm' : isDone ? 'text-slate-900' : 'text-slate-400'
                            }`}
                          >
                            {st.label}
                          </span>
                          {isCurrent && (
                            <span className="px-2 py-0.2 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                              Current Stage
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{st.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Insights Card */}
            {searchedRequest.aiVerification && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span>Google AI Multimodal Forensic Analysis:</span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  <strong>Detected Defect:</strong> {searchedRequest.aiVerification.detectedDefect}
                </p>
                <div className="flex justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  <span>Target Ministry: {searchedRequest.aiVerification.recommendedMinistry}</span>
                  <span className="font-bold text-amber-600">
                    Hazard Index: {searchedRequest.aiVerification.hazardIndex}/10
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
