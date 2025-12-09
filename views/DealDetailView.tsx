import React, { useState, useEffect } from 'react';
import { AgentPreferences, Deal } from '../types';
import { 
  ArrowLeft, ExternalLink, RefreshCw, Copy, Check, Sparkles, 
  Building, Clock, History, User, Mail, StickyNote, FileText, CheckCircle 
} from 'lucide-react';
import { generateFollowUp } from '../services/aiService';

interface DealDetailViewProps {
  deal: Deal;
  preferences: AgentPreferences;
  onBack: () => void;
  onUpdateDeal: (updatedDeal: Deal) => void;
}

export const DealDetailView: React.FC<DealDetailViewProps> = ({ deal, preferences, onBack, onUpdateDeal }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [logged, setLogged] = useState(false);

  // Reset logged state if the draft changes (regenerated)
  useEffect(() => {
    setLogged(false);
  }, [deal.aiFollowUp]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const draft = await generateFollowUp(deal, preferences);
      onUpdateDeal({ ...deal, aiFollowUp: draft });
    } catch (error) {
      console.error("Failed to generate", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (deal.aiFollowUp) {
      navigator.clipboard.writeText(deal.aiFollowUp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogToCrm = async () => {
    if (!deal.aiFollowUp) return;
    setIsLogging(true);
    // Simulate API call to CRM to add note
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLogging(false);
    setLogged(true);
    setTimeout(() => setLogged(false), 4000);
  };

  // Helper to determine stage progress for visual bar
  const getStageProgress = (stage: string) => {
    const s = stage.toLowerCase();
    if (s.includes('discovery')) return 1;
    if (s.includes('evaluation') || s.includes('demo')) return 2;
    if (s.includes('proposal')) return 3;
    if (s.includes('negotiation')) return 4;
    if (s.includes('qualified') || s.includes('won')) return 5;
    return 1;
  };
  const progress = getStageProgress(deal.stage);

  return (
    <div className="animate-fade-in max-w-6xl mx-auto pb-20">
      
      {/* Top Nav / Breadcrumb */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-semibold"
        >
          <div className="p-1.5 rounded-lg bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10 group-hover:border-pastel-primary/50 transition-colors">
             <ArrowLeft size={16} strokeWidth={2} />
          </div>
          Back to Deals
        </button>
        
        <div className="flex items-center gap-3">
             <a 
              href={deal.crmUrl} 
              target="_blank" 
              rel="noreferrer"
              className="liquid-button px-4 py-2 rounded-xl text-gray-600 dark:text-gray-300 hover:text-pastel-primary transition-colors text-sm font-bold flex items-center gap-2"
              title="Open in CRM"
            >
              <ExternalLink size={16} strokeWidth={2} />
              Open in CRM
            </a>
        </div>
      </div>

      {/* Main Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 px-1">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">{deal.name}</h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-base text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
                <Building size={18} className="text-gray-400" />
                <span className="font-semibold">{deal.companyName}</span>
            </div>
            <div className="hidden md:block w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
            <div className="flex items-center gap-2">
                <User size={18} className="text-gray-400" />
                <span className="font-semibold">{deal.contactName}</span>
            </div>
            <div className="hidden md:block w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
            <div className="flex items-center gap-3">
                <span className="font-bold text-gray-900 dark:text-white bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-2 py-0.5 rounded border border-green-100 dark:border-green-900/50">
                   {new Intl.NumberFormat('en-US', { style: 'currency', currency: deal.currency, maximumFractionDigits: 0 }).format(deal.amount)}
                </span>
                
                {/* Priority Badge Moved Here */}
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wide border shadow-sm backdrop-blur-sm ${
                  deal.priority === 'high' ? 'bg-rose-50/50 text-rose-600 border-rose-100 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800' : 
                  deal.priority === 'medium' ? 'bg-amber-50/50 text-amber-600 border-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800' : 'bg-slate-100/50 text-slate-500 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700'
                }`}>
                  {deal.priority} Priority
                </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Context & Vitals */}
        <div className="lg:col-span-1 space-y-6">
            
            {/* Status Card */}
            <div className="glass-panel p-6 rounded-2xl">
                <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6">Status</h3>
                
                {/* Stage Progress */}
                <div className="mb-6">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{deal.stage}</span>
                        <span className="text-xs text-gray-400 font-medium">Step {progress}/5</span>
                    </div>
                    <div className="flex gap-1 h-1.5">
                        {[1, 2, 3, 4, 5].map(step => (
                            <div 
                                key={step} 
                                className={`flex-1 rounded-full ${step <= progress ? 'bg-pastel-secondary' : 'bg-gray-200 dark:bg-slate-700'}`} 
                            />
                        ))}
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/50 dark:bg-white/5 rounded-xl border border-white/60 dark:border-white/5">
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">
                            <Clock size={12} /> Inactive
                        </div>
                        <div className={`text-xl font-bold ${deal.daysInactive > 14 ? 'text-rose-500' : 'text-gray-800 dark:text-white'}`}>
                            {deal.daysInactive}d
                        </div>
                    </div>
                     <div className="p-3 bg-white/50 dark:bg-white/5 rounded-xl border border-white/60 dark:border-white/5">
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">
                            <History size={12} /> Last Activity
                        </div>
                        <div className="text-sm font-bold text-gray-800 dark:text-white truncate">
                             {new Date(deal.lastActivityDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                    </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-white/10">
                     <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 block">Next Step</span>
                     <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{deal.nextStep || 'No next step defined'}</p>
                </div>
            </div>

            {/* Contact Card */}
            <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-lg font-bold text-gray-500 dark:text-gray-300 shadow-inner">
                    {deal.contactName.charAt(0)}
                 </div>
                 <div>
                    <p className="font-bold text-gray-900 dark:text-white text-base">{deal.contactName}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        <Mail size={12} />
                        {deal.contactName.toLowerCase().replace(' ', '.')}@{deal.companyName.toLowerCase().replace(/[\s,.]/g, '')}.com
                    </div>
                 </div>
            </div>

            {/* Notes Card */}
            <div className="glass-panel p-6 rounded-2xl flex-1">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <StickyNote size={14} /> Notes
                    </h3>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic bg-yellow-50/50 dark:bg-yellow-900/10 p-4 rounded-xl border border-yellow-100/50 dark:border-yellow-900/20">
                    "{deal.notes || 'No notes available.'}"
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN: AI Workspace */}
        <div className="lg:col-span-2">
           <div className="glass-panel rounded-2xl overflow-hidden flex flex-col h-full min-h-[600px] border border-white/60 dark:border-white/10 relative group">
                {/* AI Header */}
                <div className="p-5 border-b border-gray-100/50 dark:border-white/5 flex justify-between items-center bg-white/40 dark:bg-white/5 backdrop-blur-md z-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-pastel-primary to-rose-300 p-2 rounded-lg text-white shadow-lg shadow-pastel-primary/30">
                            <Sparkles size={18} strokeWidth={2} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 dark:text-white text-lg leading-none">AI Follow-Up</h3>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium mt-1">
                                Powered by Gemini • {preferences.tone} tone
                            </p>
                        </div>
                    </div>
                    {deal.aiFollowUp && (
                        <button 
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="text-xs font-bold text-gray-500 hover:text-pastel-primary transition-colors flex items-center gap-1.5 disabled:opacity-50"
                        >
                            <RefreshCw size={14} className={isGenerating ? "animate-spin" : ""} /> Regenerate
                        </button>
                    )}
                </div>

                {/* Editor Area */}
                <div className="flex-grow bg-white/30 dark:bg-black/20 p-6 relative">
                    {deal.aiFollowUp ? (
                         <textarea 
                            value={deal.aiFollowUp}
                            readOnly // In a real app, onChange would update state
                            className="w-full h-full bg-transparent border-none focus:ring-0 text-gray-800 dark:text-gray-200 text-base leading-relaxed resize-none font-sans placeholder-gray-400"
                            placeholder="Draft will appear here..."
                         />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                             <div className="w-16 h-16 bg-white/50 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm border border-white/40 dark:border-white/10">
                                <Sparkles size={32} className="text-pastel-primary" />
                             </div>
                             <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Ready to unblock this deal?</h4>
                             <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8">
                                Drift will analyze the stage, inactivity, and your notes to write a personalized follow-up.
                             </p>
                             <button 
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className="liquid-primary px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                            >
                                {isGenerating ? <RefreshCw size={20} className="animate-spin"/> : <Sparkles size={20} />}
                                Generate Draft
                            </button>
                        </div>
                    )}
                </div>

                {/* Action Toolbar (Bottom) */}
                {deal.aiFollowUp && (
                    <div className="p-4 border-t border-gray-100/50 dark:border-white/5 bg-white/40 dark:bg-white/5 backdrop-blur-md flex justify-between items-center">
                        <div className="text-xs font-medium text-gray-400">
                           {deal.aiFollowUp.length} chars
                        </div>
                        <div className="flex items-center gap-3">
                             <button
                                onClick={handleLogToCrm}
                                disabled={isLogging || logged}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                                    logged 
                                    ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' 
                                    : 'bg-white/50 dark:bg-slate-800/50 border-white/60 dark:border-white/10 hover:bg-white dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200'
                                }`}
                            >
                                {isLogging ? <RefreshCw size={16} className="animate-spin" /> : logged ? <CheckCircle size={16} /> : <FileText size={16} />}
                                {logged ? "Logged" : "Log to CRM"}
                            </button>
                            <button 
                                onClick={handleCopy}
                                className="liquid-primary px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                                {copied ? "Copied" : "Copy Text"}
                            </button>
                        </div>
                    </div>
                )}
           </div>
        </div>

      </div>
    </div>
  );
};