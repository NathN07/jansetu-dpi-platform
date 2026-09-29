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
import { ApiKeyModal } from './components/ApiKeyModal';
import { StatusTracker } from './components/StatusTracker';
import { OfficerAuthModal } from './components/OfficerAuthModal';
import { ShieldCheck, Lock } from 'lucide-react';

const REQUESTS_STORAGE_KEY = 'JANSETU_SAVED_REQUESTS_V2';
const DPRS_STORAGE_KEY = 'JANSETU_SAVED_DPRS_V2';
const ROLE_STORAGE_KEY = 'JANSETU_USER_ROLE_V2';

function loadPersistedRequests(): CitizenRequest[] {
  try {
    const saved = localStorage.getItem(REQUESTS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error loading persisted requests', e);
  }
  return INITIAL_REQUESTS;
}

function loadPersistedDprs(): DetailedProjectReport[] {
  try {
    const saved = localStorage.getItem(DPRS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error loading persisted DPRs', e);
  }
  return INITIAL_DPRS;
}

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('citizen');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('hi');
  const [userRole, setUserRole] = useState<UserRole>(() => {
    return (sessionStorage.getItem(ROLE_STORAGE_KEY) as UserRole) || 'citizen';
  });

  // Persistent state
  const [requests, setRequests] = useState<CitizenRequest[]>(loadPersistedRequests);
  const [dprs, setDprs] = useState<DetailedProjectReport[]>(loadPersistedDprs);

  // Modals
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isStatusTrackerOpen, setIsStatusTrackerOpen] = useState(false);
  const [isOfficerAuthModalOpen, setIsOfficerAuthModalOpen] = useState(false);

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

  // Sync to localStorage whenever requests change
  useEffect(() => {
    try {
      localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(requests));
    } catch (e) {
      console.error('Failed to save requests to localStorage', e);
    }
  }, [requests]);

  // Sync to localStorage whenever dprs change
  useEffect(() => {
    try {
      localStorage.setItem(DPRS_STORAGE_KEY, JSON.stringify(dprs));
    } catch (e) {
      console.error('Failed to save DPRs to localStorage', e);
    }
  }, [dprs]);

  const handleAddRequest = (req: CitizenRequest) => {
    setRequests((prev) => {
      const updated = [req, ...prev];
      return updated;
    });
  };

  const handleUpvoteRequest = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r))
    );
  };

  const handleAddDpr = (newDpr: DetailedProjectReport) => {
    setDprs((prev) => {
      const updated = [newDpr, ...prev];
      return updated;
    });
  };

  const handleUpdateDprStatus = (id: string, newStatus: DetailedProjectReport['status']) => {
    setDprs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
    );
  };

  const handleOfficerAuthSuccess = () => {
    setUserRole('official');
    sessionStorage.setItem(ROLE_STORAGE_KEY, 'official');
  };

  const handleSetCitizenRole = () => {
    setUserRole('citizen');
    sessionStorage.setItem(ROLE_STORAGE_KEY, 'citizen');
    if (currentTab !== 'citizen' && currentTab !== 'whatsapp') {
      setCurrentTab('citizen');
    }
  };

  const handleSelectDistrictForDPR = (district: DistrictMetric) => {
    setPreselectedHotspot({
      district: district.name,
      state: district.state,
      category: district.topSector
    });
    setCurrentTab('dpr');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRequestForDPR = (req: CitizenRequest) => {
    if (userRole !== 'official') {
      setIsOfficerAuthModalOpen(true);
      return;
    }
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
        onRequestOfficerLogin={() => setIsOfficerAuthModalOpen(true)}
        onSetCitizenRole={handleSetCitizenRole}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
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
                <button
                  onClick={() => setIsApiKeyModalOpen(true)}
                  className="text-slate-300 hover:text-white cursor-pointer"
                >
                  AI Infrastructure Config
                </button>
              ) : (
                <button
                  onClick={() => setIsOfficerAuthModalOpen(true)}
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                >
                  <Lock className="w-3 h-3" />
                  <span>Ministry / Officer Login</span>
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
      <OfficerAuthModal
        isOpen={isOfficerAuthModalOpen}
        onClose={() => setIsOfficerAuthModalOpen(false)}
        onSuccess={handleOfficerAuthSuccess}
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
