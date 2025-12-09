
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { DealsView } from './views/DealsView';
import { DealDetailView } from './views/DealDetailView';
import { AgentView } from './views/AgentView';
import { InsightsView } from './views/InsightsView';
import { SettingsView } from './views/SettingsView';
import { AgentPreferences, Deal, ViewState, UserProfile } from './types';
import { DEFAULT_PREFERENCES, MOCK_DEALS } from './constants';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  // App State
  const [currentView, setCurrentView] = useState<ViewState>('deals');
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<AgentPreferences>(DEFAULT_PREFERENCES);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john@drift.app',
    title: 'Senior Account Executive',
    country: 'United States',
    language: 'en',
    timezone: 'PST',
    notifications: {
      emailDigest: true,
      pushDesktop: false,
      marketing: false,
    }
  });

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize Dark Mode based on system pref or previous choice (if we had persistence)
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Derived state
  const selectedDeal = deals.find(d => d.id === selectedDealId);

  // Handlers
  const handleSelectDeal = (id: string) => {
    setSelectedDealId(id);
    setCurrentView('dealDetails');
    window.scrollTo(0,0);
  };

  const handleUpdateDeal = (updatedDeal: Deal) => {
    setDeals(prev => prev.map(d => d.id === updatedDeal.id ? updatedDeal : d));
  };

  const renderContent = () => {
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
      
      case 'insights':
        return <InsightsView deals={deals} onSelectDeal={handleSelectDeal} />;
      
      case 'agent':
        return <AgentView preferences={preferences} onSave={setPreferences} />;
      
      case 'help':
        return (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
             <h2 className="text-2xl font-semibold text-gray-800 dark:text-white tracking-tight">Help & FAQ</h2>
             <div className="space-y-4">
                <div className="glass-panel p-6 rounded-2xl">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">What is Drift?</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm leading-relaxed">Drift helps sales representatives unblock stalled deals. We scan your pipeline for inactivity and help you generate personalized follow-ups using AI.</p>
                </div>
                <div className="glass-panel p-6 rounded-2xl">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">How is the AI trained?</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm leading-relaxed">The AI uses the context of the specific deal (stage, history, contact) combined with your settings in "My AI Agent" to generate a tailored email draft.</p>
                </div>
                <div className="glass-panel p-6 rounded-2xl">
                   <h3 className="font-semibold text-gray-800 dark:text-gray-100">Is my data safe?</h3>
                   <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm leading-relaxed">Yes. Drift is SOC2 compliant (in this demo universe). We do not store your CRM data permanently, we only cache it for the session to generate insights.</p>
                </div>
             </div>
          </div>
        );

      case 'settings':
        return (
          <SettingsView 
            profile={userProfile} 
            onUpdateProfile={setUserProfile} 
            isDarkMode={isDarkMode} 
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
          />
        );

      default:
        return <div>Not found</div>;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar 
        currentView={currentView} 
        onChangeView={(view) => {
          setCurrentView(view);
          if (view === 'deals') setSelectedDealId(null);
        }} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="flex-1 min-w-0 flex flex-col relative transition-all duration-300">
        {/* Mobile Header */}
        <div className="lg:hidden p-4 glass-panel flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-pastel-primary rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">D</div>
             <span className="font-bold text-lg text-gray-800 dark:text-white">Drift</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
            <Menu size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto max-w-7xl w-full mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
