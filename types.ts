
export type ViewState =
  | 'deals'
  | 'dealDetails'
  | 'insights'
  | 'agent'
  | 'help'
  | 'settings'
  | 'riskEngine'; // NEW

export type Priority = 'high' | 'medium' | 'low';

export interface Deal {
  id: string;
  name: string;
  companyName: string;
  contactName: string; // Added for better email generation
  priority: Priority;
  stage: string;
  nextStep: string | null;
  amount: number;
  currency: 'USD' | 'EUR' | 'CAD' | 'GBP';
  daysInStage: number;
  daysInactive: number;
  crmUrl: string;
  lastActivityDate: string;
  notes: string; // New field
  aiFollowUp?: string;

  // --- NOUVEAU ---
  riskScore?: number;           // 0–100
  riskLevel?: 'low' | 'medium' | 'high';
  riskFactors?: string[];       // explications lisibles
  
}

export interface AgentPreferences {
  senderName: string;
  role: 'AE' | 'BDR' | 'Founder' | 'CSM' | 'VP Sales' | 'Other';
  tone: 'friendly' | 'direct' | 'professional' | 'casual' | 'challenger';
  style: 'short' | 'detailed' | 'urgent' | 'soft' | 'storytelling';
  productDescription: string;
  calendarLink: string;
  language: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  title: string;
  country: string;
  language: string;
  timezone: string;
  

  notifications: {
    emailDigest: boolean;
    pushDesktop: boolean;
    marketing: boolean;
  };

 

  // ------------------------------
  // 🔥 RISK ENGINE — CORE SETTINGS
  // ------------------------------

  /** Number of inactive days before a deal becomes "stalled" */
  stalledThresholdDays: number;

  /** Weight of deal amount in the risk score (0–1) */
  riskWeightAmount: number;

  /** Weight of deal stage in the risk score (0–1) */
  riskWeightStage: number;

  /** Weight of inactivity in the risk score (0–1) */
  riskWeightInactivity: number;

  /** Weight of notes keyword detection in the risk score (0–1) */
  riskWeightNotes: number;

  // -----------------------------------
  // 🔥 RISK ENGINE — ADVANCED SETTINGS
  // -----------------------------------

  // NOUVEAU — Keywords avancés
  riskKeywords: {
    word: string;
    weight: number; // 0 à 1
  }[];

  /** Deal amount threshold beyond which a deal becomes “high-value” */
  highValueThreshold: number;  // ex: 50000

  /** Stages considered risky by the user */
  riskyStages: string[];       // ex: ["Negotiation", "Legal Review", "Contract Sent"]

  
}
