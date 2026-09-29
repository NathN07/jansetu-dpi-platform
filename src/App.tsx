import React, { useState, useEffect } from 'react';
import { 
  CitizenRequest, 
  DetailedProjectReport, 
  DistrictMetric, 
  IssueCategory, 
  LanguageCode 
} from './types';
import { INITIAL_REQUESTS, INITIAL_DPRS, DISTRICT_METRICS } from './data/mockData';
import { isLiveAiAvailable } from './services/gemini';
import { Navbar, UserRole } from './components/Navbar';
import { CitizenPortal } from './components/CitizenPortal';
import { HotspotMap } from './components/HotspotMap';
import { DprEngine } from './components/DprEngine';
import { WhatsAppSimulator } from './components/WhatsAppSimulator';
import { NationalAnalytics } from './components/NationalAnalytics';
import { PitchDeckModal } from './components/PitchDeckModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { StatusTracker } from './components/StatusTracker';
import { ShieldCheck, Lock, Sparkles, Presentation } from 'lucide-react';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('citizen');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('hi');
  const [userRole, setUserRole] = useState<UserRole>('official'); // Default to officer/judge mode for hackathon review, easily toggleable
  const [requests, setRequests] = useState<CitizenRequest[]>(INITIAL_REQUESTS);
  const [dprs, setDprs] = useState<DetailedProjectReport[]>(INITIAL_DPRS);

  // Modals
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState(false);
  const [isStatusTrackerOpen, setIsStatusTrackerOpen] = useState(false);

  // Live AI status
  const [isLiveAi, setIsLiveAi] = useState(isLiveAiAvailable());

  // Cross-component transition context
  const [preselectedHotspot, setPreselectedHotspot] = useState<{
    district: string;
    state: string;
    category?: IssueCategory;
  } | null>(null);

  useEffect(() => {
    setIsLiveAi(isLiveAiAvailable());
  }, []);

  const handleAddRequest = (req: CitizenRequest) => {
    setRequests((prev) => [req, ...prev]);
  };

  const handleUpvoteRequest = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r))
    );
  };

  const handleAddDpr = (newDpr: DetailedProjectReport) => {
    setDprs((prev) => [newDpr, ...prev]);
  };

  const handleUpdateDprStatus = (id: string, newStatus: DetailedProjectReport['status']) => {
    setDprs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
    );
  };

  const handleSelectDistrictForDPR = (district: DistrictMetric) => {
    setUserRole('official');
    setPreselectedHotspot({
      district: district.name,
      state: district.state,
      category: district.topSector
    });
    setCurrentTab('dpr');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRequestForDPR = (req: CitizenRequest) => {
    setUserRole('official');
    setPreselectedHotspot({
      district: req.district,
      state: req.state,
      category: req.category
    });
    setCurrentTab('dpr');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        isLiveAi={isLiveAi}
        userRole={userRole}
        setUserRole={setUserRole}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenPitchDeck={() => setIsPitchDeckOpen(true)}
        onOpenTrackModal={() => setIsStatusTrackerOpen(true)}
      />

      {/* Main Tab Content */}
      <main className="flex-1">
        {currentTab === 'citizen' && (
          <CitizenPortal
            requests={requests}
            onAddRequest={handleAddRequest}
            onUpvoteRequest={handleUpvoteRequest}
            selectedLanguage={selectedLanguage}
            onSelectRequestForDPR={handleSelectRequestForDPR}
          />
        )}

        {currentTab === 'map' && userRole === 'official' && (
          <HotspotMap
            requests={requests}
            onSelectDistrictForDPR={handleSelectDistrictForDPR}
          />
        )}

        {currentTab === 'dpr' && userRole === 'official' && (
          <DprEngine
            dprs={dprs}
            onAddDpr={handleAddDpr}
            onUpdateDprStatus={handleUpdateDprStatus}
            preselectedHotspot={preselectedHotspot}
          />
        )}

        {currentTab === 'whatsapp' && <WhatsAppSimulator />}

        {currentTab === 'analytics' && userRole === 'official' && <NationalAnalytics />}
      </main>

      {/* Indian Civic Footer */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-extrabold text-sm">
                ज
              </div>
              <div>
                <span className="font-bold text-white text-sm">
                  JanSetu AI (जन-सेतु AI)
                </span>
                <p className="text-[11px] text-slate-400">
                  Digital Public Infrastructure for Demand-Driven Infrastructure Governance
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
              <button
                onClick={() => setIsStatusTrackerOpen(true)}
                className="text-amber-400 hover:text-amber-300 cursor-pointer"
              >
                Track Grievance (जन-प्रमाण)
              </button>

              {userRole === 'official' ? (
                <>
                  <button
                    onClick={() => setIsPitchDeckOpen(true)}
                    className="text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Presentation className="w-3.5 h-3.5" />
                    <span>Pitch Deck (12 Slides)</span>
                  </button>
                  <button
                    onClick={() => setIsApiKeyModalOpen(true)}
                    className="text-slate-300 hover:text-white cursor-pointer"
                  >
                    AI Config
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setUserRole('official')}
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                >
                  <Lock className="w-3 h-3" />
                  <span>Ministry / Evaluator Login</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <span>Built for</span>
              <span className="font-bold text-slate-300">
                Build with AI: Code for Communities — Second Edition
              </span>
              <span>• Integrated with Google AI</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Open Source Digital Public Good (DPG)</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <PitchDeckModal
        isOpen={isPitchDeckOpen}
        onClose={() => setIsPitchDeckOpen(false)}
      />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeySaved={(k) => setIsLiveAi(Boolean(k && k.length > 10))}
      />

      <StatusTracker
        isOpen={isStatusTrackerOpen}
        onClose={() => setIsStatusTrackerOpen(false)}
        requests={requests}
      />
    </div>
  );
};
