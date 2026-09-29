import { CitizenRequest, DistrictMetric, DetailedProjectReport, LanguageOption } from '../types';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' }
];

export const INITIAL_REQUESTS: CitizenRequest[] = [
  {
    id: 'req-001',
    trackingNumber: 'JS-UP-2026-8821',
    title: 'Severe pipeline collapse cuts clean water for 12,000 villagers in Bahraich',
    description: 'गांव नानपारा के मुख्य पेयजल पाइपलाइन पिछले 18 दिनों से टूटी हुई है। दूषित पानी पीने से 40 से अधिक बच्चे बीमार पड़ गए हैं। तत्काल नई पीवीसी पाइपलाइन और सौर पंप की आवश्यकता है।',
    originalLanguage: 'hi',
    translatedDescription: 'Main drinking water pipeline in Nanpara village has been broken for the past 18 days. Over 40 children have fallen sick from drinking contaminated water. Immediate replacement with PVC pipeline and solar pump needed.',
    category: 'Piped Water / Jal Jeevan Mission',
    state: 'Uttar Pradesh',
    district: 'Bahraich',
    blockOrWard: 'Nanpara Block',
    pinCode: '271865',
    coordinates: [27.8667, 81.5000],
    status: 'Hotspot_Clustered',
    severity: 'Critical',
    urgencyScore: 96,
    inputChannel: 'voice',
    citizenName: 'Ramprasad Maurya',
    citizenPhoneMasked: '+91 98****3210',
    timestamp: '2026-09-28 09:14 AM',
    upvotes: 284,
    demographicImpact: {
      populationCovered: 14200,
      aspirationalDistrict: true,
      bplPercentage: 62.4,
      scStPercentage: 38.1,
      gatiShaktiAlignmentScore: 92
    },
    aiVerification: {
      verified: true,
      confidence: 0.97,
      detectedDefect: 'Severe sub-surface ductile water line burst with high microbiological contamination hazard',
      hazardIndex: 9.4,
      recommendedMinistry: 'Ministry of Jal Shakti / Jal Jeevan Mission (Rural)',
      notes: 'Matches 26 other localized distress pings within 3.5 km radius. Urgent public health intervention recommended.'
    }
  },
  {
    id: 'req-002',
    trackingNumber: 'JS-JH-2026-4419',
    title: 'Sub-Centre health clinic collapsed roof leaves pregnant women without care in Dumka',
    description: 'शिकारीपाड़ा उप-स्वास्थ्य केंद्र की छत भारी बारिश में ढह गई है। पिछले 3 महीनों से कोई एएनएम या डॉक्टर यहां नहीं बैठ पा रहे हैं। प्रसव के लिए 35 किमी दूर जाना पड़ता है।',
    originalLanguage: 'hi',
    translatedDescription: 'Shikaripara Sub-Health Centre roof collapsed in heavy monsoon rains. No ANM or doctor able to operate for 3 months. Pregnant women forced to travel 35 km for institutional delivery.',
    category: 'Primary Healthcare / Ayushman Bharat',
    state: 'Jharkhand',
    district: 'Dumka',
    blockOrWard: 'Shikaripara',
    pinCode: '814158',
    coordinates: [24.2667, 87.2500],
    status: 'DPR_Drafted',
    severity: 'Critical',
    urgencyScore: 94,
    inputChannel: 'photo',
    imageUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80',
    citizenName: 'Sunita Soren',
    citizenPhoneMasked: '+91 87****6512',
    timestamp: '2026-09-27 02:45 PM',
    upvotes: 312,
    demographicImpact: {
      populationCovered: 19800,
      aspirationalDistrict: true,
      bplPercentage: 68.9,
      scStPercentage: 74.3,
      gatiShaktiAlignmentScore: 88
    },
    aiVerification: {
      verified: true,
      confidence: 0.98,
      detectedDefect: 'Structural masonry ceiling fracture, exposed rebar, unhygienic standing water',
      hazardIndex: 9.1,
      recommendedMinistry: 'Ministry of Health and Family Welfare (NHM)',
      notes: 'High maternal mortality vulnerability district. Meets Ayushman Arogya Mandir upgrade criteria.'
    }
  },
  {
    id: 'req-003',
    trackingNumber: 'JS-OD-2026-1932',
    title: 'Broken bridge culvert strands 6 tribal hamlets during flood in Nabarangpur',
    description: 'ଭାରୀ ବର୍ଷା ଯୋଗୁଁ ଝରିଗାଁ କଲଭର୍ଟ ପୋଲ ଭାଙ୍ଗିଯାଇଛି। ସ୍କୁଲ ଛାତ୍ର ଏବଂ ଆମ୍ବୁଲାନ୍ସ ଗାଁକୁ ଆସିପାରୁନାହାଁନ୍ତି। ଆମକୁ ତୁରନ୍ତ ସ୍ଥାୟୀ କଂକ୍ରିଟ୍ ପୋଲ ଦରକାର।',
    originalLanguage: 'or',
    translatedDescription: 'Jharigaon culvert bridge washed away due to heavy flash floods. School students and ambulances completely cut off from 6 hamlets. Permanent RCC bridge urgently needed.',
    category: 'Rural & State Roads / PMGSY',
    state: 'Odisha',
    district: 'Nabarangpur',
    blockOrWard: 'Jharigaon',
    pinCode: '764072',
    coordinates: [19.2333, 82.5500],
    status: 'Budget_Sanctioned',
    severity: 'Critical',
    urgencyScore: 92,
    inputChannel: 'whatsapp',
    citizenName: 'Baidhar Majhi',
    citizenPhoneMasked: '+91 94****9021',
    timestamp: '2026-09-26 11:20 AM',
    upvotes: 418,
    demographicImpact: {
      populationCovered: 22000,
      aspirationalDistrict: true,
      bplPercentage: 71.2,
      scStPercentage: 81.5,
      gatiShaktiAlignmentScore: 95
    },
    aiVerification: {
      verified: true,
      confidence: 0.95,
      detectedDefect: 'Washout of earthen approach ramp and fractured slab culvert over seasonal river',
      hazardIndex: 8.9,
      recommendedMinistry: 'Ministry of Rural Development / PMGSY Tier-3',
      notes: 'Qualifies under PM-JANMAN / Gati Shakti Last-Mile Connectivity mission.'
    }
  },
  {
    id: 'req-004',
    trackingNumber: 'JS-BR-2026-7731',
    title: 'Government Girls High School lacks functional sanitation and boundary wall in Bhojpur',
    description: 'आरा प्रखंड के राजकीय बालिका उच्च विद्यालय में 650 छात्राएं पढ़ती हैं लेकिन एक भी चालू शौचालय नहीं है। चारदीवारी न होने से आवारा पशु और सुरक्षा जोखिम बना रहता है। छात्राएं स्कूल छोड़ रही हैं।',
    originalLanguage: 'hi',
    translatedDescription: 'Government Girls High School in Ara block has 650 female students but zero functioning toilets. Absence of boundary wall creates severe safety issues. Girls are dropping out.',
    category: 'School Infrastructure / Samagra Shiksha',
    state: 'Bihar',
    district: 'Bhojpur',
    blockOrWard: 'Ara Sadar',
    pinCode: '802301',
    coordinates: [25.5564, 84.6603],
    status: 'Hotspot_Clustered',
    severity: 'High',
    urgencyScore: 89,
    inputChannel: 'web_portal',
    citizenName: 'Priyanka Kumari',
    citizenPhoneMasked: '+91 70****4489',
    timestamp: '2026-09-25 04:10 PM',
    upvotes: 560,
    demographicImpact: {
      populationCovered: 8500,
      aspirationalDistrict: false,
      bplPercentage: 48.0,
      scStPercentage: 24.5,
      gatiShaktiAlignmentScore: 82
    },
    aiVerification: {
      verified: true,
      confidence: 0.96,
      detectedDefect: 'Non-functional sanitation units, lack of perimeter security, high girl child retention risk',
      hazardIndex: 8.5,
      recommendedMinistry: 'Department of School Education & Literacy / Samagra Shiksha',
      notes: 'Critical gender equity indicator. Prioritized for fast-track sanction.'
    }
  },
  {
    id: 'req-005',
    trackingNumber: 'JS-TN-2026-3108',
    title: 'Fisherfolk community cold-storage power grid failure in Ramanathapuram',
    description: 'ராமேஸ்வரம் மீனவ கிராமத்தில் பவர் கட்டுகளால் தினமும் பல டன் மீன்கள் வீணாகின்றன. சூரிய ஒளி மேற்கூரை மைக்ரோகிரிட் மற்றும் மின்கல சேமிப்பு வசதி தேவை.',
    originalLanguage: 'ta',
    translatedDescription: 'Frequent grid power outages causing tons of daily fish catch to rot in Rameswaram coastal villages. Urgent need for solar rooftop microgrid and battery energy storage system.',
    category: 'Power & Solar / PM Surya Ghar',
    state: 'Tamil Nadu',
    district: 'Ramanathapuram',
    blockOrWard: 'Rameswaram Coastal',
    pinCode: '623526',
    coordinates: [9.2876, 79.3129],
    status: 'AI_Verified',
    severity: 'Medium',
    urgencyScore: 78,
    inputChannel: 'whatsapp',
    citizenName: 'K. Muthuvel',
    citizenPhoneMasked: '+91 97****1890',
    timestamp: '2026-09-28 01:15 PM',
    upvotes: 198,
    demographicImpact: {
      populationCovered: 11000,
      aspirationalDistrict: true,
      bplPercentage: 54.3,
      scStPercentage: 18.2,
      gatiShaktiAlignmentScore: 86
    },
    aiVerification: {
      verified: true,
      confidence: 0.93,
      detectedDefect: 'Intermittent 11kV coastal distribution line tripping, lack of resilient islanding solar backup',
      hazardIndex: 7.2,
      recommendedMinistry: 'Ministry of New and Renewable Energy / PM Surya Ghar',
      notes: 'High economic livelihood impact on small-scale fishing cooperatives.'
    }
  },
  {
    id: 'req-006',
    trackingNumber: 'JS-MH-2026-5520',
    title: 'Hazardous garbage dumping and open toxic runoff in Kurla East, Mumbai',
    description: 'कुर्ला पूर्व मधील सांडपाणी नाला पूर्णपणे प्लास्टिक आणि कचऱ्याने तुंबला आहे. पावसाळ्यात संपूर्ण वस्तीत घाण पाणी शिरते. डेंग्यू आणि मलेरियाचा प्रादुर्भाव वाढला आहे.',
    originalLanguage: 'mr',
    translatedDescription: 'Drainage nallah in Kurla East completely clogged with solid plastic waste and industrial runoff. Backflow into informal settlements during rains causing surge in dengue & malaria cases.',
    category: 'Sanitation & Solid Waste / Swachh Bharat',
    state: 'Maharashtra',
    district: 'Mumbai Suburban',
    blockOrWard: 'Kurla Ward L',
    pinCode: '400024',
    coordinates: [19.0657, 72.8797],
    status: 'Work_In_Progress',
    severity: 'High',
    urgencyScore: 84,
    inputChannel: 'photo',
    imageUrl: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=600&q=80',
    citizenName: 'Anil Jadhav',
    citizenPhoneMasked: '+91 91****6621',
    timestamp: '2026-09-24 10:00 AM',
    upvotes: 389,
    demographicImpact: {
      populationCovered: 45000,
      aspirationalDistrict: false,
      bplPercentage: 35.0,
      scStPercentage: 15.0,
      gatiShaktiAlignmentScore: 76
    },
    aiVerification: {
      verified: true,
      confidence: 0.95,
      detectedDefect: 'Severe municipal channel blockage, high biological oxygen demand, monsoon flood vulnerability',
      hazardIndex: 8.3,
      recommendedMinistry: 'Ministry of Housing and Urban Affairs / Swachh Bharat Urban 2.0',
      notes: 'Urban drainage hotspot. Automated suction desilting deployed.'
    }
  }
];

export const DISTRICT_METRICS: DistrictMetric[] = [
  {
    id: 'dist-01',
    name: 'Bahraich',
    state: 'Uttar Pradesh',
    coordinates: [27.5750, 81.5950],
    isAspirational: true,
    compositeDeficitScore: 89,
    totalRequests: 1420,
    criticalPending: 48,
    topSector: 'Piped Water / Jal Jeevan Mission',
    population: 3487000,
    fundsAllocatedINR_Cr: 112.5,
    fundsRequiredINR_Cr: 245.0,
    gatiShaktiGapScore: 88
  },
  {
    id: 'dist-02',
    name: 'Dumka',
    state: 'Jharkhand',
    coordinates: [24.2667, 87.2500],
    isAspirational: true,
    compositeDeficitScore: 86,
    totalRequests: 980,
    criticalPending: 34,
    topSector: 'Primary Healthcare / Ayushman Bharat',
    population: 1321000,
    fundsAllocatedINR_Cr: 65.0,
    fundsRequiredINR_Cr: 158.0,
    gatiShaktiGapScore: 84
  },
  {
    id: 'dist-03',
    name: 'Nabarangpur',
    state: 'Odisha',
    coordinates: [19.2333, 82.5500],
    isAspirational: true,
    compositeDeficitScore: 85,
    totalRequests: 890,
    criticalPending: 29,
    topSector: 'Rural & State Roads / PMGSY',
    population: 1220000,
    fundsAllocatedINR_Cr: 78.0,
    fundsRequiredINR_Cr: 190.0,
    gatiShaktiGapScore: 91
  },
  {
    id: 'dist-04',
    name: 'Nuh',
    state: 'Haryana',
    coordinates: [28.1167, 77.0167],
    isAspirational: true,
    compositeDeficitScore: 82,
    totalRequests: 740,
    criticalPending: 22,
    topSector: 'School Infrastructure / Samagra Shiksha',
    population: 1089000,
    fundsAllocatedINR_Cr: 54.0,
    fundsRequiredINR_Cr: 120.0,
    gatiShaktiGapScore: 80
  },
  {
    id: 'dist-05',
    name: 'Gadchiroli',
    state: 'Maharashtra',
    coordinates: [20.1833, 80.0000],
    isAspirational: true,
    compositeDeficitScore: 81,
    totalRequests: 620,
    criticalPending: 19,
    topSector: 'Rural & State Roads / PMGSY',
    population: 1072000,
    fundsAllocatedINR_Cr: 88.0,
    fundsRequiredINR_Cr: 175.0,
    gatiShaktiGapScore: 87
  },
  {
    id: 'dist-06',
    name: 'Bhojpur',
    state: 'Bihar',
    coordinates: [25.5564, 84.6603],
    isAspirational: false,
    compositeDeficitScore: 74,
    totalRequests: 1150,
    criticalPending: 31,
    topSector: 'School Infrastructure / Samagra Shiksha',
    population: 2728000,
    fundsAllocatedINR_Cr: 95.0,
    fundsRequiredINR_Cr: 180.0,
    gatiShaktiGapScore: 72
  },
  {
    id: 'dist-07',
    name: 'Ramanathapuram',
    state: 'Tamil Nadu',
    coordinates: [9.3667, 78.8333],
    isAspirational: true,
    compositeDeficitScore: 71,
    totalRequests: 540,
    criticalPending: 14,
    topSector: 'Power & Solar / PM Surya Ghar',
    population: 1353000,
    fundsAllocatedINR_Cr: 62.0,
    fundsRequiredINR_Cr: 110.0,
    gatiShaktiGapScore: 78
  },
  {
    id: 'dist-08',
    name: 'Baramulla',
    state: 'Jammu and Kashmir',
    coordinates: [34.2000, 74.3400],
    isAspirational: true,
    compositeDeficitScore: 77,
    totalRequests: 480,
    criticalPending: 16,
    topSector: 'Rural & State Roads / PMGSY',
    population: 1008000,
    fundsAllocatedINR_Cr: 58.0,
    fundsRequiredINR_Cr: 130.0,
    gatiShaktiGapScore: 83
  }
];

export const INITIAL_DPRS: DetailedProjectReport[] = [
  {
    id: 'dpr-001',
    dprNumber: 'DPR-JJM-2026-UP-088',
    title: 'Nanpara & Mihinpurwa Integrated Solar Piped Water Scheme & Nanofiltration Grid',
    category: 'Piped Water / Jal Jeevan Mission',
    state: 'Uttar Pradesh',
    district: 'Bahraich',
    hotspotLocation: 'Nanpara, Mihinpurwa Clusters (24 Hamlets)',
    targetBeneficiaries: 42500,
    estimatedBudgetINR_Cr: 14.8,
    centralSharePercentage: 60,
    stateSharePercentage: 40,
    priorityRank: 1,
    status: 'Cabinet Sanctioned',
    createdAt: '2026-09-28',
    executiveSummary: 'Formulated autonomously by JanSetu AI policy agent by synthesizing 384 citizen voice grievance records with CGWB groundwater salinity data and NITI Aayog Aspirational District parameters. The project replaces arsenic-tainted shallow handpumps with a 65 km HDPE networked distribution scheme powered by dedicated decentralized solar pumps.',
    civicEngineeringScope: [
      'Laying 64.8 km high-density polyethylene (HDPE) distribution mainlines',
      'Construction of two 450 kL elevated storage reservoirs (ESR) with telemetry SCADA sensors',
      'Installation of 18 solar-powered multi-stage filtration kiosks with automated chlorine dosers',
      'Direct FHTC (Functional Household Tap Connection) meters for 6,200 rural households'
    ],
    budgetBreakdown: [
      { item: 'Civil Works & Piping Network', costINR_Lakhs: 720 },
      { item: 'Solar Power Sub-stations & Inverters', costINR_Lakhs: 290 },
      { item: 'Filtration Plants & Arsenic Remediation Units', costINR_Lakhs: 240 },
      { item: 'IoT Flow & Water Purity Telemetry Nodes', costINR_Lakhs: 90 },
      { item: 'Contingency & Community Jal Samiti Training', costINR_Lakhs: 140 }
    ],
    demographicBenefits: [
      'Eliminates waterborne morbidity across 62% BPL and 38% SC/ST populace',
      'Saves estimated 2.8 hours daily productive labor predominantly borne by rural women and girls',
      'Real-time IoT water quality sensors report directly to Central Jal Jeevan Mission dashboard'
    ],
    gatiShaktiIntegration: 'Corridor aligned with PM Gati Shakti National Master Plan Layer 14 (Rural Arterial Waterways & Power Rights of Way).',
    executionMilestones: [
      { month: 'Month 1-2', target: 'Detailed engineering survey & contractor tendering via GeM' },
      { month: 'Month 3-5', target: 'Borewell drilling, ESR foundation, and solar array installation' },
      { month: 'Month 6-8', target: 'Pipeline trenching, hydrotesting, and household meters' },
      { month: 'Month 9-10', target: 'SCADA commissioning, water quality certification & handover to Gram Panchayat' }
    ],
    aiPolicyRecommendation: 'HIGH VALUE / IMMEDIATE SANCTION: Cost-to-impact ratio of ₹3,482 per citizen protected against arsenic poisoning. Reallocating unused CAPEX from central Jal Jeevan Mission uncommitted state reserves.',
    associatedRequestCount: 384
  },
  {
    id: 'dpr-002',
    dprNumber: 'DPR-PMGSY-2026-OD-041',
    title: 'High-Level RCC Submersible Bridge & All-Weather Alluvial Road over Jharigaon Basin',
    category: 'Rural & State Roads / PMGSY',
    state: 'Odisha',
    district: 'Nabarangpur',
    hotspotLocation: 'Jharigaon to Chandahandi link corridor',
    targetBeneficiaries: 31000,
    estimatedBudgetINR_Cr: 9.4,
    centralSharePercentage: 90,
    stateSharePercentage: 10,
    priorityRank: 2,
    status: 'Tender Floating',
    createdAt: '2026-09-27',
    executiveSummary: 'Triggered by 418 citizen WhatsApp and IVR distress submissions reporting cutoff of 6 tribal villages during monsoon. Aligns with PM-JANMAN Special Tribal Vulnerability Initiative.',
    civicEngineeringScope: [
      'Construction of 120-meter 4-span Reinforced Cement Concrete (RCC) high-level bridge',
      'Construction of 14.2 km bituminous all-weather road with reinforced retaining walls',
      'Cross-drainage culverts (8 units) with anti-scour geo-textile mattressing'
    ],
    budgetBreakdown: [
      { item: 'RCC Bridge Superstructure & Piling', costINR_Lakhs: 510 },
      { item: 'Road Pavement & Embankment Works', costINR_Lakhs: 280 },
      { item: 'Drainage Culverts & Riverbank Protection', costINR_Lakhs: 95 },
      { item: 'Signage, Solar Streetlights & Safety Barriers', costINR_Lakhs: 55 }
    ],
    demographicBenefits: [
      'Ensures 24x7 365-day emergency ambulance and 108 healthcare access to 81.5% ST populace',
      'Enables tribal farmers to transport minor forest produce to district APMC mandi without middleman spoilage'
    ],
    gatiShaktiIntegration: 'PM Gati Shakti Rural Logistics Node ID: OD-NBR-7821. Cross-referenced with ISRO Bhuvan satellite flood inundation maps.',
    executionMilestones: [
      { month: 'Month 1-3', target: 'Piling and substructure completion before pre-monsoon flow' },
      { month: 'Month 4-7', target: 'Girder casting, deck slab concreting and road base compaction' },
      { month: 'Month 8', target: 'Black-topping, safety testing and formal inauguration' }
    ],
    aiPolicyRecommendation: 'CRITICAL ACCESS INFRASTRUCTURE: Solves chronic geographic isolation. Highest score under NITI Aayog tribal infrastructure equity index.',
    associatedRequestCount: 418
  },
  {
    id: 'dpr-003',
    dprNumber: 'DPR-AYUSH-2026-JH-019',
    title: 'Modern 24x7 Ayushman Arogya Mandir & Maternal Emergency Unit in Shikaripara',
    category: 'Primary Healthcare / Ayushman Bharat',
    state: 'Jharkhand',
    district: 'Dumka',
    hotspotLocation: 'Shikaripara Block Central Sub-Division',
    targetBeneficiaries: 28000,
    estimatedBudgetINR_Cr: 4.2,
    centralSharePercentage: 60,
    stateSharePercentage: 40,
    priorityRank: 3,
    status: 'Under Review',
    createdAt: '2026-09-27',
    executiveSummary: 'Direct response to citizen photo verification flagging total structural ceiling collapse. Creates an upgraded climate-resilient 10-bed Primary Health Centre equipped with teleconsultation link to AIIMS Deoghar.',
    civicEngineeringScope: [
      'Pre-fabricated earthquake-resistant two-storey clinical building (4,800 sq ft)',
      'Solar-backed cold chain for essential vaccines and 24x7 labor room',
      'Telemedicine workstation with high-speed BharatNet optical fiber connectivity'
    ],
    budgetBreakdown: [
      { item: 'Civil Construction & Medical Grade Flooring', costINR_Lakhs: 210 },
      { item: 'Maternal Delivery Room & Diagnostic Equipment', costINR_Lakhs: 110 },
      { item: 'Solar Hybrid Power with 24-hr Battery Bank', costINR_Lakhs: 55 },
      { item: 'BharatNet Tele-consultation Kiosk & IT Hardware', costINR_Lakhs: 45 }
    ],
    demographicBenefits: [
      'Reduces travel distance for institutional delivery from 35 km to under 4 km for 74% SC/ST populace',
      'Projected reduction in infant and maternal mortality by 38% in Shikaripara block'
    ],
    gatiShaktiIntegration: 'Integrated with PM Ayushman Bharat Health Infrastructure Mission (PM-ABHIM) regional network.',
    executionMilestones: [
      { month: 'Month 1-2', target: 'Demolition of condemned building and foundation casting' },
      { month: 'Month 3-5', target: 'Modular structure assembly and medical electrical installations' },
      { month: 'Month 6', target: 'Medical equipment calibration, tele-link verification and staff deployment' }
    ],
    aiPolicyRecommendation: 'HIGH HUMANITARIAN IMPACT: Immediate life-saving capability for high-vulnerability tribal corridor.',
    associatedRequestCount: 312
  }
];

export const NATIONAL_STATS = {
  totalRequestsProcessed: 284190,
  activeHotspotsIdentified: 1420,
  verifiedByVisionAI: 198420,
  avgResolutionTimeDays: 24.6,
  fundsRecommendedINR_Cr: 1845.8,
  dprsGeneratedAutonomously: 642,
  statesActive: 28,
  unionTerritoriesActive: 8,
  languagesServed: 12,
  aspirationalDistrictsCovered: 112,
  satisfactionScorePct: 91.4
};
