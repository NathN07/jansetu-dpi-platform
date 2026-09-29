import React, { useState, useRef } from 'react';
import { CitizenRequest, IssueCategory, LanguageCode, SeverityLevel, RequestStatus } from '../types';
import { ALL_INDIAN_STATES, resolveLocationCoordinates } from '../data/mockData';
import { geocodeLocationPrecise, getLiveBrowserGps } from '../services/geocoding';
import { 
  Mic, 
  MicOff, 
  Camera, 
  Upload, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ThumbsUp, 
  MapPin, 
  Volume2, 
  Filter,
  Flame,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Crosshair,
  Loader2,
  Users,
  CheckCheck,
  PlusCircle,
  HelpCircle,
  Zap
} from 'lucide-react';
import { analyzeInfrastructurePhoto, processCitizenVoiceOrText } from '../services/gemini';
import confetti from 'canvas-confetti';

interface CitizenPortalProps {
  requests: CitizenRequest[];
  onAddRequest: (req: CitizenRequest) => void;
  onUpvoteRequest: (id: string) => void;
  onResolveRequest?: (id: string, notes?: string, byOfficer?: boolean) => void;
  onConfirmResolution?: (id: string) => void;
  onFastTrackApprove?: (id: string) => void;
  userRole?: 'citizen' | 'official';
  selectedLanguage: LanguageCode;
  onSelectRequestForDPR: (req: CitizenRequest) => void;
}

export const CitizenPortal: React.FC<CitizenPortalProps> = ({
  requests,
  onAddRequest,
  onUpvoteRequest,
  onResolveRequest,
  onConfirmResolution,
  onFastTrackApprove,
  userRole = 'citizen',
  selectedLanguage,
  onSelectRequestForDPR
}) => {
  // Mode: 'voice' | 'photo' | 'text'
  const [activeMode, setActiveMode] = useState<'voice' | 'photo' | 'text'>('voice');
  
  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Photo state
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoMime, setPhotoMime] = useState<string>('image/jpeg');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IssueCategory>('Piped Water / Jal Jeevan Mission');
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [stateName, setStateName] = useState('Uttar Pradesh');
  const [district, setDistrict] = useState('Bahraich');
  const [blockOrWard, setBlockOrWard] = useState('Nanpara Block');
  const [pinCode, setPinCode] = useState('271865');
  const [citizenName, setCitizenName] = useState('Rameshwar Kumar');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [customCoords, setCustomCoords] = useState<[number, number] | null>(null);
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);

  // AI Processing status
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysisPreview, setAiAnalysisPreview] = useState<any>(null);
  const [lastSubmittedToken, setLastSubmittedToken] = useState<string | null>(null);
  const [lastSubmittedIsReview, setLastSubmittedIsReview] = useState(false);

  // Feed Tab: 'published' | 'review_queue' | 'resolved'
  const [feedTab, setFeedTab] = useState<'published' | 'review_queue' | 'resolved'>('published');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('all');

  // Voice recording handler
  const startRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported directly in this browser. You can type or use the Quick Presets below!');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      const langMap: Record<LanguageCode, string> = {
        en: 'en-IN',
        hi: 'hi-IN',
        bn: 'bn-IN',
        ta: 'ta-IN',
        te: 'te-IN',
        mr: 'mr-IN',
        kn: 'kn-IN',
        gu: 'gu-IN',
        pa: 'pa-IN',
        or: 'or-IN'
      };

      recognition.lang = langMap[selectedLanguage] || 'hi-IN';

      recognition.onstart = () => {
        setIsRecording(true);
        setRecordingSeconds(0);
        timerRef.current = setInterval(() => {
          setRecordingSeconds((prev) => prev + 1);
        }, 1000);
      };

      recognition.onresult = (event: any) => {
        let current = '';
        for (let i = 0; i < event.results.length; i++) {
          current += event.results[i][0].transcript;
        }
        setVoiceTranscript(current);
        setDescription(current);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event);
        stopRecording();
      };

      recognition.onend = () => {
        stopRecording();
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error(err);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsRecording(false);
  };

  // Analyze Voice with Gemini AI
  const handleAnalyzeVoiceTranscript = async () => {
    if (!voiceTranscript.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await processCitizenVoiceOrText(voiceTranscript, selectedLanguage);
      setCategory(result.category);
      if (result.extractedLocation?.state) setStateName(result.extractedLocation.state);
      if (result.extractedLocation?.district) setDistrict(result.extractedLocation.district);
      if (result.extractedLocation?.villageOrWard) setBlockOrWard(result.extractedLocation.villageOrWard);
      if (!title) {
        setTitle(`Urgent ${result.category} requirement in ${result.extractedLocation?.district || district}`);
      }
      setAiAnalysisPreview({
        translatedText: result.translatedText,
        detectedLang: result.detectedLanguage,
        urgency: result.urgencyScore,
        severity: result.severity,
        sentiment: result.sentimentIntensity
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoMime(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setPhotoPreview(base64);
      setIsAnalyzing(true);
      try {
        const photoResult = await analyzeInfrastructurePhoto(base64, file.type, {
          location: `${district}, ${stateName}`,
          title: title || 'Reported damage'
        });
        setCategory(photoResult.category);
        if (!title) setTitle(photoResult.suggestedTitle);
        setAiAnalysisPreview({
          verified: photoResult.verified,
          confidence: photoResult.confidence,
          detectedDefect: photoResult.detectedDefect,
          hazardIndex: photoResult.hazardIndex,
          recommendedMinistry: photoResult.recommendedMinistry,
          severity: photoResult.severity,
          notes: photoResult.notes
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Quick Demo Presets
  const applyPreset = (presetType: 'water' | 'bridge' | 'clinic' | 'school') => {
    if (presetType === 'water') {
      setTitle('Severe drinking water pipeline rupture in Nanpara');
      setDescription('गांव नानपारा में मुख्य पेयजल पाइपलाइन टूट गई है। 12,000 लोग गंदा पानी पीने को मजबूर हैं। 30 बच्चे डायरिया से पीड़ित हैं। तुरंत नई पाइपलाइन और सोलर पंप चाहिए।');
      setCategory('Piped Water / Jal Jeevan Mission');
      setStateName('Uttar Pradesh');
      setDistrict('Bahraich');
      setBlockOrWard('Nanpara Block');
      setPinCode('271865');
      setVoiceTranscript('गांव नानपारा में मुख्य पेयजल पाइपलाइन टूट गई है। 12,000 लोग गंदा पानी पीने को मजबूर हैं।');
      setPhotoPreview('https://images.unsplash.com/photo-1541888946425-d0fbb18f156f?auto=format&fit=crop&w=600&q=80');
      setAiAnalysisPreview({
        verified: true,
        confidence: 0.98,
        detectedDefect: 'Severe sub-surface ductile water line burst with critical public health biological contamination hazard',
        hazardIndex: 9.4,
        recommendedMinistry: 'Ministry of Jal Shakti / Jal Jeevan Mission',
        notes: 'Clusters with 38 adjacent distress records. Fast-track pipe relaying required.'
      });
    } else if (presetType === 'bridge') {
      setTitle('Tribal culvert collapse cuts off 6 hamlets in Jharigaon');
      setDescription('ଝରିଗାଁରେ କଲଭର୍ଟ ପୋଲ ଭାଙ୍ଗିଯାଇଛି। ସ୍କୁଲ ଓ ଆମ୍ବୁଲାନ୍ସ ଯିବା ବନ୍ଦ। ତୁରନ୍ତ ନୂତନ ପୋଲ ନିର୍ମାଣ କରାଯାଉ।');
      setCategory('Rural & State Roads / PMGSY');
      setStateName('Odisha');
      setDistrict('Nabarangpur');
      setBlockOrWard('Jharigaon Block');
      setPinCode('764072');
      setPhotoPreview('https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80');
      setAiAnalysisPreview({
        verified: true,
        confidence: 0.97,
        detectedDefect: 'Catastrophic deck slab rupture on seasonal river culvert, impassable for vehicular traffic',
        hazardIndex: 9.2,
        recommendedMinistry: 'Ministry of Rural Development / PMGSY Tier-3',
        notes: 'Identified as sole connectivity corridor for 22,000 tribal populace.'
      });
    } else if (presetType === 'clinic') {
      setTitle('Primary Sub-Centre roof collapsed during monsoon');
      setDescription('शिकारीपाड़ा उप-स्वास्थ्य केंद्र की छत गिर गई है। गर्भवती महिलाओं को प्रसव के लिए 35 किलोमीटर दूर जाना पड़ रहा है।');
      setCategory('Primary Healthcare / Ayushman Bharat');
      setStateName('Jharkhand');
      setDistrict('Dumka');
      setBlockOrWard('Shikaripara');
      setPinCode('814158');
      setPhotoPreview('https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80');
      setAiAnalysisPreview({
        verified: true,
        confidence: 0.96,
        detectedDefect: 'Structural masonry ceiling fracture, high collapse hazard in clinical examination room',
        hazardIndex: 9.1,
        recommendedMinistry: 'Ministry of Health & Family Welfare / PM-ABHIM',
        notes: 'Maternal care disruption hotspot. Requires modular clinical renovation.'
      });
    } else if (presetType === 'school') {
      setTitle('Girls High School lacks functional sanitation units and boundary wall');
      setDescription('स्कूल में 650 छात्राओं के लिए एक भी चालू शौचालय नहीं है। बाउंड्री न होने से सुरक्षा का भारी खतरा है।');
      setCategory('School Infrastructure / Samagra Shiksha');
      setStateName('Bihar');
      setDistrict('Bhojpur');
      setBlockOrWard('Ara Sadar');
      setPinCode('802301');
      setPhotoPreview('https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80');
      setAiAnalysisPreview({
        verified: true,
        confidence: 0.95,
        detectedDefect: 'Severely degraded sanitation blocks and absence of campus perimeter security',
        hazardIndex: 8.5,
        recommendedMinistry: 'Department of School Education / Samagra Shiksha',
        notes: 'Impacts adolescent girl child retention rate.'
      });
    }
  };

  // GPS Geolocation handler
  const handleGetGps = async () => {
    setIsLocatingGps(true);
    try {
      const gps = await getLiveBrowserGps();
      setCustomCoords(gps.coordinates);
      setGpsAccuracy(gps.accuracyMeters || 10);
      if (gps.reverseDetails?.district) setDistrict(gps.reverseDetails.district);
      if (gps.reverseDetails?.state) setStateName(gps.reverseDetails.state);
      if (gps.reverseDetails?.suburb || gps.reverseDetails?.road) {
        setBlockOrWard(`${gps.reverseDetails.suburb || ''} ${gps.reverseDetails.road || ''}`.trim());
      }
      if (gps.reverseDetails?.postcode) setPinCode(gps.reverseDetails.postcode);
    } catch (e) {
      alert('Could not access GPS. Please ensure location permissions are enabled in your browser.');
    } finally {
      setIsLocatingGps(false);
    }
  };

  // Submit Final Request (Lodges into Community Review Pipeline)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please provide a title and description or use voice/preset.');
      return;
    }

    const effectiveCategory = category === 'Other / Custom Infrastructure Issue'
      ? (customCategoryName.trim() || 'General Public Infrastructure')
      : category;

    const stateCodes: Record<string, string> = {
      'Uttar Pradesh': 'UP',
      'Jharkhand': 'JH',
      'Odisha': 'OD',
      'Bihar': 'BR',
      'Tamil Nadu': 'TN',
      'Maharashtra': 'MH',
      'Haryana': 'HR',
      'Rajasthan': 'RJ',
      'West Bengal': 'WB'
    };
    const code = stateCodes[stateName] || 'IN';
    const trackingNum = `JS-${code}-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    // Resolve high-precision coordinates
    const finalCoords = customCoords || (await geocodeLocationPrecise(blockOrWard, district, stateName, pinCode));

    // New submissions start in Community Review to keep feed uncluttered and spam-proof
    const newRequest: CitizenRequest = {
      id: `req-${Date.now()}`,
      trackingNumber: trackingNum,
      title,
      description,
      originalLanguage: selectedLanguage,
      translatedDescription: aiAnalysisPreview?.translatedText || description,
      category: effectiveCategory,
      customCategoryName: customCategoryName || undefined,
      state: stateName,
      district,
      blockOrWard,
      pinCode,
      coordinates: finalCoords,
      status: 'Pending_Community_Review',
      severity: (aiAnalysisPreview?.severity as SeverityLevel) || 'High',
      urgencyScore: aiAnalysisPreview?.urgencyScore || 88,
      inputChannel: activeMode === 'voice' ? 'voice' : activeMode === 'photo' ? 'photo' : 'web_portal',
      imageUrl: photoPreview || undefined,
      citizenName: citizenName || 'Anonymous Citizen',
      citizenPhoneMasked: phone ? phone.replace(/(\d{2})\d{4}(\d{4})/, '$1****$2') : '+91 98****1234',
      timestamp: 'Just now',
      upvotes: 1, // Author's endorsement
      endorsementsNeeded: 3, // Requires 3 neighborhood endorsements to publish to live map
      isPublished: false,
      isResolved: false,
      resolutionLikes: 0,
      demographicImpact: {
        populationCovered: Math.floor(8000 + Math.random() * 15000),
        aspirationalDistrict: true,
        bplPercentage: Math.floor(45 + Math.random() * 25),
        scStPercentage: Math.floor(20 + Math.random() * 50),
        gatiShaktiAlignmentScore: Math.floor(80 + Math.random() * 18)
      },
      aiVerification: {
        verified: true,
        confidence: 0.97,
        detectedDefect: aiAnalysisPreview?.detectedDefect || 'Field issue confirmed by JanSetu Multimodal Engine',
        hazardIndex: aiAnalysisPreview?.hazardIndex || 8.7,
        recommendedMinistry: aiAnalysisPreview?.recommendedMinistry || 'Ministry of Rural Development',
        notes: aiAnalysisPreview?.notes || 'Validated against national demographic and geospatial layers.'
      }
    };

    onAddRequest(newRequest);
    setLastSubmittedToken(trackingNum);
    setLastSubmittedIsReview(true);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    // Reset inputs
    setTitle('');
    setDescription('');
    setVoiceTranscript('');
    setPhotoPreview(null);
    setAiAnalysisPreview(null);
    setCustomCoords(null);
    setCustomCategoryName('');
  };

  // Text to Speech playback
  const playTextToSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Categorize requests into Published, Review Queue, and Resolved
  const publishedRequests = requests.filter((r) => r.isPublished && !r.isResolved);
  const reviewQueueRequests = requests.filter((r) => !r.isPublished && !r.isResolved);
  const resolvedRequests = requests.filter((r) => r.isResolved);

  const displayedRequests = (
    feedTab === 'published'
      ? publishedRequests
      : feedTab === 'review_queue'
      ? reviewQueueRequests
      : resolvedRequests
  ).filter((r) => {
    if (selectedFilterCategory === 'all') return true;
    return r.category.toLowerCase().includes(selectedFilterCategory.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Section */}
      <div className="relative rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-10 shadow-xl overflow-hidden border border-blue-800/40">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-orange-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute right-1/3 -bottom-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-400/30 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Digital Public Good for 1.4 Billion Citizens</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
            Jan-Vani <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">(जन-वाणी)</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-6">
            Lodge community infrastructure demands in any language via <strong>Voice</strong>, <strong>Photos</strong>, or <strong>WhatsApp</strong>. Community endorsements verify true local priorities, and Google AI turns collective citizen voices into official Detailed Project Reports (DPR).
          </p>

          {/* Quick Preset Buttons for Hackathon Demo */}
          <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-3.5 backdrop-blur-xs">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Instant Hackathon Demo Presets (1-Click Test):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyPreset('water')}
                className="px-3 py-1.5 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-blue-200 text-xs font-semibold border border-blue-700/50 transition cursor-pointer flex items-center gap-1"
              >
                💧 Arsenic Water Pipe Burst (UP)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('bridge')}
                className="px-3 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-xs font-semibold border border-emerald-700/50 transition cursor-pointer flex items-center gap-1"
              >
                🌉 Washed Out Tribal Bridge (Odisha)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('clinic')}
                className="px-3 py-1.5 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-rose-200 text-xs font-semibold border border-rose-700/50 transition cursor-pointer flex items-center gap-1"
              >
                🏥 Collapsed Health Clinic Roof (Jharkhand)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('school')}
                className="px-3 py-1.5 rounded-lg bg-amber-900/60 hover:bg-amber-800 text-amber-200 text-xs font-semibold border border-amber-700/50 transition cursor-pointer flex items-center gap-1"
              >
                🏫 Girls School Sanitation Deficit (Bihar)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Community Review Notice Banner */}
      {lastSubmittedToken && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-950">
                Grievance Lodged into Neighborhood Community Review! (Token: {lastSubmittedToken})
              </p>
              <p className="text-xs text-amber-800 mt-0.5">
                To prevent spam and keep the public feed high quality, your issue needs <strong>3 citizen endorsements/likes</strong> in the "Community Review Queue". Once endorsed, it will be automatically published on the National Hotspot Map for Officer DPR allocation!
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setLastSubmittedToken(null);
              setFeedTab('review_queue');
            }}
            className="text-xs text-amber-900 hover:text-amber-950 font-bold px-3 py-1.5 rounded-lg bg-amber-200 hover:bg-amber-300 transition cursor-pointer shrink-0"
          >
            View in Review Queue
          </button>
        </div>
      )}

      {/* Main Grid: Submission Studio on Left, Live Citizen Distress Feed on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Ingestion Studio (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Lodge Infrastructure Grievance</h2>
              <p className="text-xs text-slate-500">Multimodal AI input • Citizen moderation enabled</p>
            </div>
            <div className="flex p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveMode('voice')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeMode === 'voice'
                    ? 'bg-white text-orange-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Voice First</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMode('photo')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeMode === 'photo'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Photo AI</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMode('text')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeMode === 'text'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Direct Form</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mode 1: Voice Recording View */}
            {activeMode === 'voice' && (
              <div className="p-5 rounded-2xl bg-orange-50/60 border border-orange-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-orange-950 uppercase tracking-wide flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-orange-600" />
                    Indian Linguistic Voice-to-DPR Engine
                  </span>
                  <span className="text-[11px] text-orange-700 font-medium">
                    Speaks in Hindi, Bengali, Tamil, Telugu, Marathi, etc.
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-orange-100">
                  <button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition shadow-lg cursor-pointer ${
                      isRecording
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-gradient-to-tr from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                  </button>

                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-sm font-bold text-slate-800">
                      {isRecording ? `Recording... (${recordingSeconds}s)` : 'Tap mic and speak your grievance'}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Example: "আমাদের রানাঘাটের ১ নং ব্লকের কালভার্ট ব্রিজ ভেঙে গেছে, গাড়ি চলাচল বন্ধ।"
                    </p>
                  </div>
                </div>

                {voiceTranscript && (
                  <div className="space-y-2">
                    <div className="p-3 bg-white rounded-xl border border-orange-200 text-xs text-slate-800">
                      <span className="font-bold text-orange-900 block mb-1">Live Transcript:</span>
                      <p className="italic">{voiceTranscript}</p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAnalyzeVoiceTranscript}
                      disabled={isAnalyzing}
                      className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      {isAnalyzing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      <span>Extract Urgency & Fill Form via Gemini AI</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mode 2: Multimodal Photo View */}
            {activeMode === 'photo' && (
              <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-950 uppercase tracking-wide flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-blue-600" />
                    Gemini Multimodal Vision Inspector
                  </span>
                  <span className="text-[11px] text-blue-700 font-medium">
                    Auto-detects defect, severity & hazard
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-xl p-4 bg-white/70 hover:bg-white transition cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  {photoPreview ? (
                    <div className="relative w-full max-h-56 rounded-lg overflow-hidden flex justify-center">
                      <img
                        src={photoPreview}
                        alt="Infrastructure Failure Preview"
                        className="object-contain max-h-56 rounded-lg"
                      />
                      <div className="absolute top-2 right-2 bg-slate-900/80 text-white text-[11px] px-2 py-0.5 rounded-full font-semibold">
                        Change Photo
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-2">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-slate-800">
                        Click to upload photo of road, water pipe, school, or bridge
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        JPEG, PNG, WEBP (Camera capture supported on mobile)
                      </p>
                    </div>
                  )}
                </div>

                {isAnalyzing && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-100 text-blue-800 text-xs font-semibold animate-pulse">
                    <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                    <span>Gemini Vision AI is analyzing civil structural deformation, cracks, and safety risk...</span>
                  </div>
                )}
              </div>
            )}

            {/* AI Vision / Text Extraction Result Card */}
            {aiAnalysisPreview && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-blue-950 text-white border border-blue-800 shadow-md space-y-3">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-amber-300">
                      Google Gemini AI Structured Ingestion Insights
                    </span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                    Confidence: 97%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Detected Defect:</span>
                    <span className="font-semibold text-slate-200">
                      {aiAnalysisPreview.detectedDefect || 'Structural fracture identified'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Recommended Ministry:</span>
                    <span className="font-semibold text-slate-200">
                      {aiAnalysisPreview.recommendedMinistry || 'Ministry of Rural Development'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">Severity:</span>
                    <span className="px-2 py-0.5 rounded font-bold text-xs bg-rose-500/30 text-rose-300 border border-rose-500/40">
                      {aiAnalysisPreview.severity || 'Critical'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400">Hazard Index:</span>
                    <span className="font-mono font-bold text-amber-400 text-sm">
                      {aiAnalysisPreview.hazardIndex || 9.1}/10
                    </span>
                  </div>
                </div>

                {aiAnalysisPreview.translatedText && (
                  <div className="bg-slate-800/80 rounded p-2 text-xs text-slate-300 border border-slate-700">
                    <span className="text-[10px] text-slate-400 font-bold block mb-0.5">
                      Vernacular Translation for Policymakers:
                    </span>
                    {aiAnalysisPreview.translatedText}
                  </div>
                )}
              </div>
            )}

            {/* Standard Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Grievance / Demand Title:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Collapsed culvert cutting off 6 villages"
                  className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  required
                />
              </div>

              {/* Dynamic Extensible Issue Category Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Infrastructure Sector / Scheme:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  >
                    <option value="Piped Water / Jal Jeevan Mission">💧 Piped Water / Jal Jeevan Mission</option>
                    <option value="Rural & State Roads / PMGSY">🛣️ Rural & State Roads / PMGSY</option>
                    <option value="Primary Healthcare / Ayushman Bharat">🏥 Primary Healthcare / Ayushman Bharat</option>
                    <option value="School Infrastructure / Samagra Shiksha">🏫 School Infrastructure / Samagra Shiksha</option>
                    <option value="Power & Solar / PM Surya Ghar">⚡ Power & Solar / PM Surya Ghar</option>
                    <option value="Sanitation & Solid Waste / Swachh Bharat">🚯 Sanitation & Solid Waste / Swachh Bharat</option>
                    <option value="Flood & Drainage Resilience">🌊 Flood & Drainage Resilience</option>
                    <option value="Street Lighting & Public Safety">💡 Street Lighting & Public Safety</option>
                    <option value="Public Transport & Connectivity">🚌 Public Transport & Connectivity</option>
                    <option value="Irrigation & Agriculture">🌾 Irrigation & Agriculture</option>
                    <option value="Digital & Telecom Connectivity">📶 Digital & Telecom Connectivity</option>
                    <option value="Other / Custom Infrastructure Issue">➕ Other / Custom Infrastructure Issue</option>
                  </select>

                  {/* Custom Category Input if 'Other' selected */}
                  {category === 'Other / Custom Infrastructure Issue' ? (
                    <input
                      type="text"
                      value={customCategoryName}
                      onChange={(e) => setCustomCategoryName(e.target.value)}
                      placeholder="Specify custom issue type (e.g. Community Hall)..."
                      className="w-full text-sm rounded-xl border-2 border-orange-400 bg-orange-50/50 p-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-semibold"
                      required
                    />
                  ) : (
                    <div className="flex items-center text-xs text-slate-500 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
                      <span>✓ Standard DPI Sector Classified</span>
                    </div>
                  )}
                </div>
              </div>

              {/* State & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    State:
                  </label>
                  <select
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  >
                    {ALL_INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    District / City:
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. Nadia, Ranaghat, Patna"
                    className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              {/* Block / Ward & PIN Code with Live GPS auto-detect */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Block / Panchayat / Ward / Area:
                  </label>
                  <input
                    type="text"
                    value={blockOrWard}
                    onChange={(e) => setBlockOrWard(e.target.value)}
                    placeholder="e.g., Ranaghat I Block, Ward 4"
                    className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      PIN Code:
                    </label>
                    <button
                      type="button"
                      onClick={handleGetGps}
                      disabled={isLocatingGps}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 transition cursor-pointer"
                    >
                      {isLocatingGps ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Crosshair className="w-3 h-3 text-blue-600" />
                      )}
                      <span>{customCoords ? 'GPS Locked' : 'Auto-Detect GPS'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="e.g. 741201"
                    className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Coordinates Pinpoint Indicator */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-orange-500" />
                  <span>Target Map Pin:</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[200px]">
                    {blockOrWard || district}, {stateName}
                  </span>
                </div>
                <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200 text-blue-700 font-bold">
                  {customCoords
                    ? `GPS: ${customCoords[0].toFixed(4)}°, ${customCoords[1].toFixed(4)}° (±${gpsAccuracy || 10}m)`
                    : 'Auto-Geocoded on Submit'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Detailed Description (Spoken or Written):
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe the issue, number of households affected, how long it has been broken, etc."
                  className="w-full text-sm rounded-xl border border-slate-300 p-3 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  required
                ></textarea>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl font-extrabold text-sm text-white bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>Lodge Grievance for Neighborhood Review</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Demand Stream, Review Queue & Resolved Works (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Feed Navigation Tabs (Published / Review Queue / Resolved) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                  <span>Citizen Demand Matrix</span>
                </h3>
                <p className="text-xs text-slate-500">Community verified & officer monitored</p>
              </div>
            </div>

            {/* 3 Main Pipeline Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setFeedTab('published')}
                className={`py-2 px-1 text-center rounded-lg transition cursor-pointer flex flex-col items-center gap-0.5 ${
                  feedTab === 'published'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🏛️ Live Hotspots</span>
                <span className="text-[10px] font-mono text-emerald-600">({publishedRequests.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setFeedTab('review_queue')}
                className={`py-2 px-1 text-center rounded-lg transition cursor-pointer flex flex-col items-center gap-0.5 ${
                  feedTab === 'review_queue'
                    ? 'bg-white text-amber-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>👥 Needs Review</span>
                <span className="text-[10px] font-mono text-amber-600">({reviewQueueRequests.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setFeedTab('resolved')}
                className={`py-2 px-1 text-center rounded-lg transition cursor-pointer flex flex-col items-center gap-0.5 ${
                  feedTab === 'resolved'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>✅ Resolved Works</span>
                <span className="text-[10px] font-mono text-emerald-600">({resolvedRequests.length})</span>
              </button>
            </div>

            {/* Explanatory subtitle for current tab */}
            <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
              {feedTab === 'published' && '✓ Verified demands with ≥3 community endorsements, active on National Map & DPR queue.'}
              {feedTab === 'review_queue' && '⏳ Newly lodged grievances. Like & endorse to approve them to the Live Map!'}
              {feedTab === 'resolved' && '🎉 Completed civil repairs marked by Officers or confirmed by 3+ local citizens.'}
            </div>

            {/* Quick Filter chips */}
            <div className="flex flex-wrap gap-1.5 pt-1 text-xs">
              <button
                onClick={() => setSelectedFilterCategory('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                  selectedFilterCategory === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedFilterCategory('Water')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                  selectedFilterCategory === 'Water'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                💧 Water
              </button>
              <button
                onClick={() => setSelectedFilterCategory('Roads')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                  selectedFilterCategory === 'Roads'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                🛣️ Roads
              </button>
              <button
                onClick={() => setSelectedFilterCategory('Healthcare')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                  selectedFilterCategory === 'Healthcare'
                    ? 'bg-rose-600 text-white'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                }`}
              >
                🏥 Health
              </button>
              <button
                onClick={() => setSelectedFilterCategory('School')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                  selectedFilterCategory === 'School'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                }`}
              >
                🏫 School
              </button>
            </div>
          </div>

          {/* Cards Feed */}
          <div className="space-y-3.5 max-h-[660px] overflow-y-auto pr-1">
            {displayedRequests.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold">No records in this tab matching the filter.</p>
              </div>
            ) : (
              displayedRequests.map((req) => (
                <div
                  key={req.id}
                  className={`bg-white rounded-xl border p-4 shadow-xs hover:shadow-md transition space-y-3 ${
                    req.isResolved
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : !req.isPublished
                      ? 'border-amber-300 bg-amber-50/20'
                      : 'border-slate-200'
                  }`}
                >
                  {/* Card Top: Tracking Number & Status Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {req.trackingNumber}
                      </span>
                      <span className="text-[10px] text-slate-400">• {req.timestamp}</span>
                    </div>

                    {req.isResolved ? (
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <CheckCheck className="w-3 h-3 text-emerald-600" /> Resolved
                      </span>
                    ) : !req.isPublished ? (
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                        <Users className="w-3 h-3 text-amber-600" /> Review ({req.upvotes}/3 Likes)
                      </span>
                    ) : (
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          req.severity === 'Critical'
                            ? 'bg-rose-100 text-rose-700 border border-rose-200'
                            : req.severity === 'High'
                            ? 'bg-orange-100 text-orange-700 border border-orange-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {req.severity} Priority
                      </span>
                    )}
                  </div>

                  {/* Card Title & Category Tag */}
                  <div>
                    <div className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 mb-1">
                      {req.category}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {req.title}
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        {req.blockOrWard}, {req.district}, {req.state} ({req.pinCode})
                      </span>
                    </div>
                  </div>

                  {/* Photo Thumbnail if available */}
                  {req.imageUrl && (
                    <div className="w-full h-32 rounded-lg overflow-hidden border border-slate-200">
                      <img
                        src={req.imageUrl}
                        alt={req.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {req.description}
                  </p>

                  {/* Resolution Notes if Resolved */}
                  {req.isResolved && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span>✅ Completed Work Sanction</span>
                        <span>{req.resolvedAt}</span>
                      </div>
                      <p className="text-[11px] text-emerald-800">{req.resolutionNotes || 'Civil repair verified & completed.'}</p>
                      <p className="text-[10px] text-emerald-600 font-semibold">Authority: {req.resolvedBy}</p>
                    </div>
                  )}

                  {/* Community Review Progress Bar if in Review Queue */}
                  {!req.isPublished && !req.isResolved && (
                    <div className="space-y-1 bg-amber-50/70 p-2.5 rounded-lg border border-amber-200/80">
                      <div className="flex justify-between text-[11px] font-bold text-amber-900">
                        <span>Community Endorsement Progress:</span>
                        <span>{req.upvotes} / {req.endorsementsNeeded || 3} Likes</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-amber-200 overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, ((req.upvotes || 1) / (req.endorsementsNeeded || 3)) * 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-[10px] text-amber-700">
                        {3 - (req.upvotes || 1) > 0
                          ? `Needs ${3 - (req.upvotes || 1)} more citizen endorsement to publish on live map.`
                          : 'Threshold reached! Promoting to live map...'}
                      </p>
                    </div>
                  )}

                  {/* Action Bar: Endorse, Listen, Confirm Resolved & Officer Tools */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      {/* Community Endorse Button */}
                      {!req.isResolved && (
                        <button
                          type="button"
                          onClick={() => onUpvoteRequest(req.id)}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shadow-xs ${
                            !req.isPublished
                              ? 'bg-amber-600 hover:bg-amber-700 text-white'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                          title="Endorse this grievance to help verify & publish it"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{!req.isPublished ? `Endorse (${req.upvotes}/3)` : `${req.upvotes} Likes`}</span>
                        </button>
                      )}

                      {/* Text to Speech */}
                      <button
                        type="button"
                        onClick={() => playTextToSpeech(req.translatedDescription || req.description)}
                        className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                        title="Listen via Speech"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Listen</span>
                      </button>
                    </div>

                    {/* Officer Actions & Community Resolution Controls */}
                    <div className="flex items-center gap-2">
                      {/* Officer Fast-Track Button */}
                      {userRole === 'official' && !req.isPublished && !req.isResolved && onFastTrackApprove && (
                        <button
                          type="button"
                          onClick={() => onFastTrackApprove(req.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1"
                        >
                          <Zap className="w-3 h-3 text-amber-300" />
                          <span>Fast-Track</span>
                        </button>
                      )}

                      {/* Officer Mark as Resolved Button */}
                      {userRole === 'official' && !req.isResolved && onResolveRequest && (
                        <button
                          type="button"
                          onClick={() => {
                            const note = prompt('Enter official resolution remarks (e.g., Road resurfacing completed, pipeline repaired):', 'Civil infrastructure repair verified and completed.');
                            if (note !== null) {
                              onResolveRequest(req.id, note, true);
                            }
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>Mark Resolved</span>
                        </button>
                      )}

                      {/* Citizen Confirm Resolution Button */}
                      {userRole === 'citizen' && !req.isResolved && req.isPublished && onConfirmResolution && (
                        <button
                          type="button"
                          onClick={() => onConfirmResolution(req.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition cursor-pointer flex items-center gap-1"
                          title="Confirm if this problem has been repaired in your area"
                        >
                          <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Fixed? ({req.resolutionLikes || 0}/3)</span>
                        </button>
                      )}

                      {/* Draft DPR Button */}
                      {userRole === 'official' && !req.isResolved && (
                        <button
                          type="button"
                          onClick={() => onSelectRequestForDPR(req)}
                          className="flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                        >
                          <span>Draft DPR</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
