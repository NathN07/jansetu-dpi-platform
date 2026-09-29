import React from 'react';
import { SUPPORTED_LANGUAGES } from '../data/mockData';
import { LanguageCode } from '../types';
import { 
  Building2, 
  MapPin, 
  FileText, 
  MessageSquare, 
  BarChart3, 
  Sparkles, 
  Key, 
  Presentation, 
  Globe, 
  ShieldCheck,
  Search
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  selectedLanguage: LanguageCode;
  setSelectedLanguage: (lang: LanguageCode) => void;
  isLiveAi: boolean;
  onOpenApiKeyModal: () => void;
  onOpenPitchDeck: () => void;
  onOpenTrackModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  selectedLanguage,
  setSelectedLanguage,
  isLiveAi,
  onOpenApiKeyModal,
  onOpenPitchDeck,
  onOpenTrackModal
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top micro-bar: Indian Digital Public Good banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1 px-4 flex flex-wrap justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-slate-200">Digital Public Infrastructure (DPI)</span>
          <span className="text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-400">National Citizen-to-Governance AI Platform • Built with Google AI</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenTrackModal}
            className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium transition cursor-pointer"
          >
            <Search className="w-3 h-3" />
            <span>Track Grievance (जन-प्रमाण)</span>
          </button>
          <div className="flex items-center gap-1 text-slate-400">
            <Globe className="w-3 h-3 text-slate-400" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as LanguageCode)}
              className="bg-slate-800 text-slate-200 text-xs rounded px-2 py-0.5 border border-slate-700 focus:outline-hidden focus:border-orange-500 cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('citizen')}>
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-950 flex items-center justify-center shadow-md border border-orange-500/30 overflow-hidden">
              <span className="text-xl font-black text-amber-400">ज</span>
              <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-orange-500 via-white to-green-600"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 font-display">
                  Jan<span className="text-orange-600">Setu</span> <span className="text-blue-900 font-extrabold text-sm uppercase px-1.5 py-0.5 bg-blue-50 text-blue-800 rounded border border-blue-200">AI</span>
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" /> DPG Certified
                </span>
              </div>
              <p className="text-[11px] text-slate-500 -mt-0.5 hidden sm:block">
                जन-सेतु: Citizen Demand Aggregator & Autonomous DPR Engine
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setCurrentTab('citizen')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                currentTab === 'citizen'
                  ? 'bg-orange-50 text-orange-700 border border-orange-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-4 h-4 text-orange-600" />
              <span>Citizen Portal</span>
            </button>

            <button
              onClick={() => setCurrentTab('map')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                currentTab === 'map'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>National Hotspot Map</span>
            </button>

            <button
              onClick={() => setCurrentTab('dpr')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                currentTab === 'dpr'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>AI DPR & Allocation</span>
            </button>

            <button
              onClick={() => setCurrentTab('whatsapp')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                currentTab === 'whatsapp'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp / IVR Bot</span>
            </button>

            <button
              onClick={() => setCurrentTab('analytics')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                currentTab === 'analytics'
                  ? 'bg-purple-50 text-purple-700 border border-purple-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-purple-600" />
              <span>National Analytics</span>
            </button>
          </nav>

          {/* Action CTAs: Pitch Deck & API Key */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenPitchDeck}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-xs hover:from-amber-600 hover:to-orange-700 transition cursor-pointer"
              title="View Hackathon Pitch Presentation"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pitch Deck (12 Slides)</span>
              <span className="sm:hidden">Pitch</span>
            </button>

            <button
              onClick={onOpenApiKeyModal}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                isLiveAi
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
              title="Configure Gemini API Key"
            >
              <Key className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">
                {isLiveAi ? 'Gemini 3.8 Live' : 'AI: Smart Demo'}
              </span>
              <span className={`w-2 h-2 rounded-full ${isLiveAi ? 'bg-emerald-500 ring-2 ring-emerald-200' : 'bg-amber-400'}`}></span>
            </button>
          </div>
        </div>

        {/* Mobile secondary tab bar */}
        <div className="lg:hidden flex items-center justify-between overflow-x-auto py-2 border-t border-slate-100 gap-1 text-xs">
          <button
            onClick={() => setCurrentTab('citizen')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'citizen' ? 'bg-orange-100 text-orange-800 font-bold' : 'text-slate-600'}`}
          >
            📢 Citizen
          </button>
          <button
            onClick={() => setCurrentTab('map')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'map' ? 'bg-blue-100 text-blue-800 font-bold' : 'text-slate-600'}`}
          >
            🗺️ Hotspots
          </button>
          <button
            onClick={() => setCurrentTab('dpr')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'dpr' ? 'bg-indigo-100 text-indigo-800 font-bold' : 'text-slate-600'}`}
          >
            📑 AI DPR
          </button>
          <button
            onClick={() => setCurrentTab('whatsapp')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'whatsapp' ? 'bg-emerald-100 text-emerald-800 font-bold' : 'text-slate-600'}`}
          >
            💬 WhatsApp
          </button>
          <button
            onClick={() => setCurrentTab('analytics')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'analytics' ? 'bg-purple-100 text-purple-800 font-bold' : 'text-slate-600'}`}
          >
            📊 Analytics
          </button>
        </div>
      </div>
    </header>
  );
};
