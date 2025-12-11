import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { DealsView } from './views/DealsView';
import { DealDetailView } from './views/DealDetailView';
import { AgentView } from './views/AgentView';
import { InsightsView } from './views/InsightsView';
import { SettingsView } from './views/SettingsView';
import { MOCK_DEALS, DEFAULT_PREFERENCES } from './constants';
import { Deal, ViewState, AgentPreferences, UserProfile } from './types';
import { Search, MessageSquare, Mail } from 'lucide-react';

// ⭐️ IMPORT DU RISK ENGINE
import { computeRiskScore } from "./services/riskEngine";

const HelpView = () => (
  <div className="max-w-4xl mx-auto animate-fade-in pb-20">
    {/* ... TON HELP VIEW SANS CHANGEMENT ... */}
  </div>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('deals');
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);

  // ⛔ AVANT : deals = MOCK_DEALS
  // ✅ MAINTENANT : deals enrichis avec risk scoring
  const [deals, setDeals] = useState<Deal[]>(() => {
    return MOCK_DEALS.map((d) => {
      const { score, riskLevel, riskFactors } = computeRiskScore(d, {
        stalledThresholdDays: 14,
        riskWeightAmount: 0.4,
        riskWeightStage: 0.3,
        riskWeightInactivity: 0.2,
        riskWeightNotes: 0.1,
      } as UserProfile);
      return { ...d, riskScore: score, riskLevel, riskFactors };
    });
  });

  const [preferences, setPreferences] = useState<AgentPreferences>(DEFAULT_PREFERENCES);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // ⭐️ USER PROFILE EXTENDU
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john@drift.app',
    title: 'Senior Account Executive',
    country: 'United States',
    language: 'en',
    timezone: 'EST',
    notifications: {
      emailDigest: true,
      pushDesktop: false,
      marketing: false,
    },
    stalledThresholdDays: 14,
    riskWeightAmount: 0.4,
    riskWeightStage: 0.3,
    riskWeightInactivity: 0.2,
    riskWeightNotes: 0.1,
  });

  // ⭐️ FONCTION D’ENRICHISSEMENT DES DEALS
  const enrichDealsWithRisk = (dealList: Deal[], profile: UserProfile): Deal[] => {
    return dealList.map((deal) => {
      const { score, riskLevel, riskFactors } = computeRiskScore(deal, profile);
      return {
        ...deal,
        riskScore: score,
        riskLevel,
        riskFactors,
      };
    });
  };

  // ⭐️ RECALCUL AUTOMATIQUE DES SCORES QUAND LE PROFIL CHANGE
  useEffect(() => {
    setDeals((prev) => enrichDealsWithRisk(prev, userProfile));
  }, [userProfile]);

  const handleSelectDeal = (dealId: string) => {
    setSelectedDealId(dealId);
    setCurrentView('dealDetails');
  };

const handleUpdateDeal = (updatedDeal: Deal) => {
  // Recalcul du risque quand un deal change
  const enriched = {
    ...updatedDeal,
    ...computeRiskScore(updatedDeal, userProfile)
  };

  setDeals(prev =>
    prev.map(d => (d.id === updatedDeal.id ? enriched : d))
  );
};

  const selectedDeal = deals.find(d => d.id === selectedDealId);

  const renderView = () => {
    switch (currentView) {
      case 'deals':
        return <DealsView deals={deals} onSelectDeal={handleSelectDeal} />;
      case 'dealDetails':
        if (!selectedDeal) return <DealsView deals={deals} onSelectDeal={handleSelectDeal} />;
        return (
          <DealDetailView 
            deal={selectedDeal} 
            preferences={preferences} 
            onBack={() => setCurrentView('deals')}
            onUpdateDeal={handleUpdateDeal}
          />
        );
      case 'agent':
        return <AgentView preferences={preferences} onSave={setPreferences} />;
      case 'insights':
        return <InsightsView deals={deals} onSelectDeal={handleSelectDeal} />;
      case 'help':
        return <HelpView />;
      case 'settings':
  return (
    <SettingsView 
      profile={userProfile} 
      onUpdateProfile={setUserProfile}
      isDarkMode={isDarkMode}
      onToggleDarkMode={toggleDarkMode}
      deals={deals}       // ✅ on passe les deals pour la preview Risk
    />
  );
      default:
        return <DealsView deals={deals} onSelectDeal={handleSelectDeal} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] dark:bg-[#09090B] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      <main className="flex-1 min-w-0 transition-all duration-300 ease-in-out">
        <div className="p-4 sm:p-6 lg:p-10 max-w-[1600px] mx-auto h-full">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;