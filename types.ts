
export type ViewState = 'deals' | 'dealDetails' | 'insights' | 'agent' | 'help' | 'settings';

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
  }
}
