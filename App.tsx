import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { DealsView } from './views/DealsView';
import { DealDetailView } from './views/DealDetailView';
import { AgentView } from './views/AgentView';
import { InsightsView } from './views/InsightsView';
import { SettingsView } from './views/SettingsView';
import { MOCK_DEALS, DEFAULT_PREFERENCES } from './constants';
import { Deal, ViewState, AgentPreferences, UserProfile } from './types';
import { Search, ChevronDown, MessageSquare, Mail, HelpCircle } from 'lucide-react';

const HelpView = () => (
  <div className="max-w-4xl mx-auto animate-fade-in pb-20">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">Help & Support</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Guides, FAQs, and support for your workspace.
        </p>
      </div>
      <div className="relative w-full md:w-64">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search help articles..." 
          className="input-field w-full pl-9 pr-4 py-2 rounded-md text-sm bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder-gray-400"
        />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      <div className="layer-panel p-6 rounded-lg hover:border-gray-300 dark:hover:border-zinc-600 transition-colors cursor-pointer group">
        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-brand-primary mb-4 group-hover:scale-105 transition-transform">
          <MessageSquare size={20} />
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">Getting Started</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          Learn the basics of connecting your CRM, setting up your profile, and generating your first AI follow-up.
        </p>
      </div>

      <div className="layer-panel p-6 rounded-lg hover:border-gray-300 dark:hover:border-zinc-600 transition-colors cursor-pointer group">
        <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4 group-hover:scale-105 transition-transform">
          <MessageSquare size={20} />
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">AI & Personalization</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          Deep dive into how the AI Agent works, customizing tone of voice, and best practices for draft generation.
        </p>
      </div>
    </div>

    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h3>
    <div className="space-y-4">
      {[
        { q: "How does Drift connect to my CRM?", a: "Drift uses a secure, read-only API connection to pull deal data. We currently support HubSpot and Salesforce." },
        { q: "Is my data used to train public models?", a: "No. Your data is isolated and only used to generate content for your specific workspace. We adhere to strict enterprise privacy standards." },
        { q: "Can I customize the email templates?", a: "Yes. Go to 'My AI Agent' to adjust the tone, style, and role that the AI adopts when writing drafts." },
        { q: "How is 'Days Inactive' calculated?", a: "We look at the 'Last Activity Date' field in your CRM (emails, calls, meetings) and count the days since the last logged event." }
      ].map((faq, i) => (
        <div key={i} className="layer-panel p-5 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">{faq.q}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{faq.a}</p>
        </div>
      ))}
    </div>

    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-zinc-800 flex flex-col items-center text-center">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">Still need help?</h3>
      <p className="text-sm text-gray-500 mb-6">Our support team is available Mon-Fri, 9am - 5pm EST.</p>
      <button className="btn-primary px-6 py-2 text-sm flex items-center gap-2">
        <Mail size={16} /> Contact Support
      </button>
    </div>
  </div>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('deals');
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);
  const [preferences, setPreferences] = useState<AgentPreferences>(DEFAULT_PREFERENCES);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Theme Management - Default to Light Mode (false)
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // User Profile State
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
      marketing: false
    }
  });

  const handleSelectDeal = (dealId: string) => {
    setSelectedDealId(dealId);
    setCurrentView('dealDetails');
  };

  const handleUpdateDeal = (updatedDeal: Deal) => {
    setDeals(prevDeals => prevDeals.map(d => d.id === updatedDeal.id ? updatedDeal : d));
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