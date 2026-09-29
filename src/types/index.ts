export type LanguageCode = 'en' | 'hi' | 'bn' | 'ta' | 'te' | 'mr' | 'kn' | 'gu' | 'pa' | 'or';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
}

export type PresetIssueCategory = 
  | 'Piped Water / Jal Jeevan Mission'
  | 'Rural & State Roads / PMGSY'
  | 'Primary Healthcare / Ayushman Bharat'
  | 'School Infrastructure / Samagra Shiksha'
  | 'Power & Solar / PM Surya Ghar'
  | 'Sanitation & Solid Waste / Swachh Bharat'
  | 'Flood & Drainage Resilience'
  | 'Street Lighting & Public Safety'
  | 'Public Transport & Connectivity'
  | 'Irrigation & Agriculture'
  | 'Digital & Telecom Connectivity';

export type IssueCategory = PresetIssueCategory | string;

export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type RequestStatus = 
  | 'Pending_Community_Review'
  | 'AI_Verified'
  | 'Hotspot_Clustered'
  | 'DPR_Drafted'
  | 'Budget_Sanctioned'
  | 'Work_In_Progress'
  | 'Resolved';

export type InputChannel = 'voice' | 'photo' | 'whatsapp' | 'web_portal';

export interface DemographicImpact {
  populationCovered: number;
  aspirationalDistrict: boolean;
  bplPercentage: number;
  scStPercentage: number;
  gatiShaktiAlignmentScore: number; // 0 - 100
}

export interface CitizenRequest {
  id: string;
  trackingNumber: string;
  title: string;
  description: string;
  originalLanguage: LanguageCode;
  translatedDescription?: string;
  category: IssueCategory;
  customCategoryName?: string;
  state: string;
  district: string;
  blockOrWard: string;
  pinCode: string;
  coordinates: [number, number]; // [lat, lng]
  status: RequestStatus;
  severity: SeverityLevel;
  urgencyScore: number; // 0 - 100
  inputChannel: InputChannel;
  imageUrl?: string;
  audioDurationSec?: number;
  citizenName: string;
  citizenPhoneMasked: string;
  timestamp: string;
  upvotes: number; // Community endorsement likes
  endorsementsNeeded?: number; // e.g. 3 to publish on live map
  isPublished?: boolean; // When true, appears on live map & officer feed
  isResolved?: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNotes?: string;
  resolutionLikes?: number; // Citizen confirmations that issue is fixed
  demographicImpact: DemographicImpact;
  aiVerification?: {
    verified: boolean;
    confidence: number;
    detectedDefect: string;
    hazardIndex: number;
    recommendedMinistry: string;
    notes: string;
  };
}

export interface DistrictMetric {
  id: string;
  name: string;
  state: string;
  coordinates: [number, number];
  isAspirational: boolean;
  compositeDeficitScore: number; // 0 - 100
  totalRequests: number;
  criticalPending: number;
  topSector: IssueCategory;
  population: number;
  fundsAllocatedINR_Cr: number;
  fundsRequiredINR_Cr: number;
  gatiShaktiGapScore: number;
}

export interface DetailedProjectReport {
  id: string;
  dprNumber: string;
  title: string;
  category: IssueCategory;
  state: string;
  district: string;
  hotspotLocation: string;
  targetBeneficiaries: number;
  estimatedBudgetINR_Cr: number;
  centralSharePercentage: number;
  stateSharePercentage: number;
  priorityRank: number;
  status: 'Drafted' | 'Under Review' | 'Cabinet Sanctioned' | 'Tender Floating';
  createdAt: string;
  executiveSummary: string;
  civicEngineeringScope: string[];
  budgetBreakdown: { item: string; costINR_Lakhs: number }[];
  demographicBenefits: string[];
  gatiShaktiIntegration: string;
  executionMilestones: { month: string; target: string }[];
  aiPolicyRecommendation: string;
  associatedRequestCount: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  translatedText?: string;
  timestamp: string;
  mediaUrl?: string;
  options?: string[];
  trackingCard?: Partial<CitizenRequest>;
}
