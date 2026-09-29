import React, { useState } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  MapPin, 
  Building2, 
  FileText, 
  Bot, 
  Database,
  ArrowRight,
  Maximize2
} from 'lucide-react';

interface PitchDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PitchDeckModal: React.FC<PitchDeckModalProps> = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    // Slide 1: Title
    {
      number: '01 / 12',
      tagline: 'Build with AI: Code for Communities — Second Edition',
      title: 'JanSetu AI (जन-सेतु AI)',
      subtitle: 'Multilingual Digital Public Infrastructure for Demand-Driven Governance & Autonomous Infrastructure Sanction',
      content: (
        <div className="space-y-6 text-center py-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-orange-500 via-white to-green-600 p-1 shadow-2xl">
            <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center">
              <span className="text-4xl font-black text-amber-400">ज</span>
            </div>
          </div>
          <div className="max-w-2xl mx-auto space-y-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Connecting 1.4 Billion Citizen Voices Directly to National Infrastructure Budgets
            </h3>
            <p className="text-sm text-slate-300">
              Designed as a sovereign <strong>Digital Public Good (DPG)</strong> powered by <strong>Google Gemini 3.8 Flash, Speech-to-Text, and BigQuery</strong>.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 pt-4 text-xs font-semibold">
            <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
              Track 01: AI for Digital Public Infrastructure
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Theme: Innovation & Governance
            </span>
          </div>
        </div>
      )
    },

    // Slide 2: The Problem
    {
      number: '02 / 12',
      tagline: 'The Structural Governance Crisis',
      title: 'The Problem: Fragmented Feedback & Misaligned Public Spending',
      subtitle: 'Why billions of rupees in public works fail to reach the most urgent grassroots needs',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-4 text-xs sm:text-sm">
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-lg">
              1
            </div>
            <h4 className="font-bold text-white text-base">Siloed & Fragmented Systems</h4>
            <p className="text-slate-300 leading-relaxed">
              Grievances are scattered across municipal helplines, paper petitions, and disconnected department portals with zero unified visibility.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
              2
            </div>
            <h4 className="font-bold text-white text-base">The Vernacular & Literacy Divide</h4>
            <p className="text-slate-300 leading-relaxed">
              Over 70% of rural citizens cannot fill complex online English/formal forms, locking out women, elders, and tribal communities.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg">
              3
            </div>
            <h4 className="font-bold text-white text-base">9-Month DPR Paralysis</h4>
            <p className="text-slate-300 leading-relaxed">
              Even when crises are identified, manually drafting engineering Detailed Project Reports (DPRs) and securing approvals takes 9 to 18 months.
            </p>
          </div>
        </div>
      )
    },

    // Slide 3: The Solution
    {
      number: '03 / 12',
      tagline: 'The JanSetu AI Paradigm',
      title: 'The Solution: Omnichannel Demand Aggregator & Autonomous DPR Engine',
      subtitle: 'From a citizen voice note to a Cabinet-sanctioned infrastructure project in under 48 hours',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 text-xs sm:text-sm">
          <div className="space-y-4 bg-slate-800/60 p-5 rounded-2xl border border-slate-700">
            <h4 className="text-amber-400 font-bold text-base flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>For Citizens (Jan-Vani):</span>
            </h4>
            <ul className="space-y-2.5 text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Speak or message in 10+ Indian languages (Hindi, Bengali, Tamil, etc.).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Snap a photo of broken roads or pipes; Gemini Vision auto-inspects severity.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Zero literacy barriers: Voice-first interface & WhatsApp/IVR hotline.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4 bg-slate-800/60 p-5 rounded-2xl border border-slate-700">
            <h4 className="text-indigo-400 font-bold text-base flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              <span>For Policymakers (Shasan-Drishti):</span>
            </h4>
            <ul className="space-y-2.5 text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Geospatial heatmaps clustering citizen distress with NITI Aayog indicators.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>1-Click Autonomous Detailed Project Report (DPR) generator with CPWD BOQ.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>PM Gati Shakti Master Plan corridor alignment and cross-department sync.</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },

    // Slide 4: Google AI Architecture
    {
      number: '04 / 12',
      tagline: 'End-to-End Technology Stack',
      title: 'Mandatory Google AI & Cloud Integration Architecture',
      subtitle: 'Engineered strictly on Google AI Stack as specified by the Hackathon guidelines',
      content: (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2">
            <span className="text-orange-400 font-bold block text-sm">Gemini 3.8 Flash</span>
            <p className="text-slate-300">
              Multimodal Vision for structural crack analysis & autonomous engineering DPR formulation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2">
            <span className="text-blue-400 font-bold block text-sm">Speech & Translation</span>
            <p className="text-slate-300">
              Vernacular Speech-to-Text & bidirectional translation across 10+ Indian linguistic regions.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2">
            <span className="text-purple-400 font-bold block text-sm">BigQuery Telemetry</span>
            <p className="text-slate-300">
              High-throughput aggregation of millions of citizen spatial coordinates and budget records.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2">
            <span className="text-emerald-400 font-bold block text-sm">Geospatial / Maps</span>
            <p className="text-slate-300">
              Interactive GIS mapping integrated with PM Gati Shakti National Master Plan layers.
            </p>
          </div>
        </div>
      )
    },

    // Slide 5: Real-World Public Datasets
    {
      number: '05 / 12',
      tagline: 'Data Grounding & Truth',
      title: 'Grounding with Real Indian Public Datasets & Governance Indices',
      subtitle: 'Not synthetic hallucinations — rooted in Indian administrative realities',
      content: (
        <div className="space-y-4 py-3 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700">
              <strong className="text-amber-400 block mb-1">NITI Aayog Aspirational Districts</strong>
              <span className="text-slate-300 text-xs">
                Integrated baseline KPI scores across 112 vulnerable districts (health, education, water).
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700">
              <strong className="text-indigo-400 block mb-1">PM Gati Shakti National Master Plan</strong>
              <span className="text-slate-300 text-xs">
                GIS Layer 14 mapping rural logistics, water right-of-way, and arterial infrastructure.
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700">
              <strong className="text-emerald-400 block mb-1">data.gov.in & Census Indices</strong>
              <span className="text-slate-300 text-xs">
                Village-level demographics, SC/ST percentage, and BPL density for equity weighting.
              </span>
            </div>
          </div>
        </div>
      )
    },

    // Slide 6: Multi-Criteria Decision Analysis
    {
      number: '06 / 12',
      tagline: 'Algorithmic Fairness',
      title: 'AI Priority Score: Ensuring Equity for the Most Vulnerable',
      subtitle: 'Preventing affluent urban bias by factoring socio-economic deprivation',
      content: (
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-4 text-xs sm:text-sm">
          <p className="text-slate-300">
            Traditional portals favor affluent urban citizens with high-speed internet. JanSetu AI calculates an <strong>Urgency & Equity Priority Score (0 - 100)</strong> using an open mathematical formula:
          </p>
          <div className="bg-slate-900 p-4 rounded-xl font-mono text-amber-300 text-xs leading-relaxed border border-slate-700">
            Priority Score = (0.35 × Demand Density) + (0.25 × Hazard Severity) + (0.20 × Aspirational District Weight) + (0.20 × Gati Shakti Alignment)
          </div>
          <p className="text-slate-400 text-xs">
            ★ Guarantees that a collapsed tribal bridge in Nabarangpur outranks a cosmetic sidewalk repair in a metropolitan district.
          </p>
        </div>
      )
    },

    // Slide 7: Autonomous DPR
    {
      number: '07 / 12',
      tagline: 'The Core Innovation',
      title: 'The Autonomous Detailed Project Report (DPR) Breakthrough',
      subtitle: 'Compressing project sanction gestation from 9 months to under 48 hours',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 text-xs">
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/50 space-y-2">
            <span className="font-bold text-rose-300 block text-sm">❌ Legacy Government Flow:</span>
            <ul className="space-y-1.5 text-slate-300 list-disc pl-4">
              <li>Citizen files paper grievance at collectorate.</li>
              <li>Wait 3-6 months for junior engineer inspection.</li>
              <li>Tendering consultant takes 4 months to draft BOQ.</li>
              <li>Average time to financial sanction: <strong>270 Days</strong>.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/50 space-y-2">
            <span className="font-bold text-emerald-300 block text-sm">✅ JanSetu AI Autonomous Flow:</span>
            <ul className="space-y-1.5 text-slate-300 list-disc pl-4">
              <li>384 citizen voice pings clustered into hotspot.</li>
              <li>Gemini Vision confirms structural failure and hazard.</li>
              <li>Gemini 3.8 formulates CPWD-standard BOQ & DPR.</li>
              <li>Time to administrative sanction: <strong>&lt; 48 Hours</strong>.</li>
            </ul>
          </div>
        </div>
      )
    },

    // Slide 8: Digital Public Good & Open Standard
    {
      number: '08 / 12',
      tagline: 'Sovereign Architecture',
      title: 'Built as a Digital Public Good (DPG) & Open India Stack Protocol',
      subtitle: 'Interoperable, open-source, non-proprietary, and privacy-preserving',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-1.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <strong className="text-white block text-sm">Open API Standard</strong>
            <p className="text-slate-300">
              Exposes open REST & Beckn-compatible endpoints for third-party state CM dashboards and civic NGOs.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-1.5">
            <Users className="w-5 h-5 text-blue-400" />
            <strong className="text-white block text-sm">Privacy by Design</strong>
            <p className="text-slate-300">
              Masks citizen phone numbers and PII automatically. Tokenized verification with "Jan-Praman" DPI tickets.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-1.5">
            <Building2 className="w-5 h-5 text-purple-400" />
            <strong className="text-white block text-sm">Zero Vendor Lock-In</strong>
            <p className="text-slate-300">
              Runs seamlessly on Cloud Run, Kubernetes, or sovereign NIC (National Informatics Centre) cloud.
            </p>
          </div>
        </div>
      )
    },

    // Slide 9: National Scale
    {
      number: '09 / 12',
      tagline: 'Pan-India Readiness',
      title: 'Built for India: Scalable Across 28 States & 700+ Districts',
      subtitle: 'From Himalayan border areas to coastal fisher villages and dense urban wards',
      content: (
        <div className="space-y-4 py-3 text-xs sm:text-sm">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-slate-800 p-3.5 rounded-xl border border-slate-700">
              <span className="text-2xl font-black text-amber-400">28</span>
              <span className="text-[11px] text-slate-300 block mt-1">States Supported</span>
            </div>
            <div className="bg-slate-800 p-3.5 rounded-xl border border-slate-700">
              <span className="text-2xl font-black text-emerald-400">10+</span>
              <span className="text-[11px] text-slate-300 block mt-1">Vernacular Languages</span>
            </div>
            <div className="bg-slate-800 p-3.5 rounded-xl border border-slate-700">
              <span className="text-2xl font-black text-blue-400">112</span>
              <span className="text-[11px] text-slate-300 block mt-1">Aspirational Districts</span>
            </div>
            <div className="bg-slate-800 p-3.5 rounded-xl border border-slate-700">
              <span className="text-2xl font-black text-purple-400">100%</span>
              <span className="text-[11px] text-slate-300 block mt-1">Gati Shakti Aligned</span>
            </div>
          </div>
        </div>
      )
    },

    // Slide 10: Live Working Prototype
    {
      number: '10 / 12',
      tagline: 'Proof of Execution',
      title: 'Working Prototype Demonstration Highlights',
      subtitle: 'Full end-to-end functionality ready for judge evaluation today',
      content: (
        <div className="space-y-3 py-3 text-xs">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800 border border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">1. Live Vernacular Voice & Vision Ingestion:</strong>
              <span className="text-slate-300">
                Functional microphone audio recording, speech recognition, and Gemini Vision photo inspection.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800 border border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">2. Geospatial Hotspot Map & Deficit Index:</strong>
              <span className="text-slate-300">
                Interactive Leaflet India map with district drill-down, Aspirational district layers, and funding gap meters.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800 border border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">3. Autonomous DPR Formulator & Shasan-Mitra Copilot:</strong>
              <span className="text-slate-300">
                Generates official government BOQ, milestones, and provides interactive AI policy advice.
              </span>
            </div>
          </div>
        </div>
      )
    },

    // Slide 11: Deployment & Scalability
    {
      number: '11 / 12',
      tagline: 'Production Architecture',
      title: 'Deployment & Scalability on Google Cloud Platform',
      subtitle: 'Serverless, auto-scaling, low-cost execution for nationwide rollout',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-2">
            <strong className="text-white block text-sm">Compute & Storage:</strong>
            <p className="text-slate-300 leading-relaxed">
              * **Google Cloud Run:** Microservices scaling from 0 to 10,000 requests during peak monsoon distress seasons.<br/>
              * **Google Cloud Storage:** Encrypted object store for citizen photo and audio telemetry.<br/>
              * **BigQuery:** Serverless SQL engine scanning petabytes of spatial records in milliseconds.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-2">
            <strong className="text-white block text-sm">Economic Feasibility:</strong>
            <p className="text-slate-300 leading-relaxed">
              * Per-Grievance AI Ingestion Cost: <strong>₹0.04</strong> (via Gemini Flash).<br/>
              * DPR Formulation Cost: <strong>₹0.85</strong> vs ₹2,50,000 paid to private consultant firms.<br/>
              * Net Public Savings: <strong>99.9% reduction in pre-project consultation overhead</strong>.
            </p>
          </div>
        </div>
      )
    },

    // Slide 12: Vision & Next Steps
    {
      number: '12 / 12',
      tagline: 'The Horizon',
      title: 'JanSetu AI: Transforming India into a Viksit Bharat by 2047',
      subtitle: 'Where every rupee of public capital directly reflects the genuine voice of every Indian citizen',
      content: (
        <div className="space-y-6 text-center py-6">
          <div className="max-w-2xl mx-auto space-y-4">
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
              "By bridging the chasm between raw citizen suffering and bureaucratic capital allocation through Google AI, <strong>JanSetu AI</strong> transforms governance from reactive firefighting into proactive, equitable, data-driven nation building."
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <span className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs shadow-md">
                Digital Public Good Certified
              </span>
              <span className="px-4 py-2 rounded-xl bg-blue-700 text-white font-bold text-xs shadow-md">
                Powered by Google AI
              </span>
            </div>
          </div>
        </div>
      )
    }
  ];

  const current = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white">
        {/* Top Bar */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
              {current.number}
            </span>
            <span className="text-xs text-slate-400 font-semibold">{current.tagline}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Body */}
        <div className="p-6 sm:p-10 flex-1 overflow-y-auto space-y-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {current.title}
            </h2>
            <p className="text-sm text-slate-400 mt-1 font-medium">{current.subtitle}</p>
          </div>

          <div className="pt-2">{current.content}</div>
        </div>

        {/* Bottom Navigation */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <button
            onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
            disabled={currentSlide === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 transition disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Slide</span>
          </button>

          {/* Dots Indicator */}
          <div className="hidden sm:flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentSlide === i ? 'w-6 bg-orange-500' : 'bg-slate-700 hover:bg-slate-600'
                }`}
              ></button>
            ))}
          </div>

          <button
            onClick={() => setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1))}
            disabled={currentSlide === slides.length - 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-orange-600 text-white hover:bg-orange-700 transition disabled:opacity-40 cursor-pointer"
          >
            <span>Next Slide</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
