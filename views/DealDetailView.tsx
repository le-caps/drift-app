import React, { useState, useEffect } from 'react';
import { Deal, AgentPreferences, Priority } from '../types';
import { generateFollowUp } from '../services/aiService';
import {
  ArrowLeft, Building, User, Calendar, DollarSign,
  Activity, Send, Sparkles, Copy, Check, RefreshCw, AlignLeft,
  ExternalLink, Clock, Mail, AlertTriangle
} from 'lucide-react';

const getRiskColorClasses = (level?: 'low' | 'medium' | 'high') => {
  switch (level) {
    case "high":
      return "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-900";
    case "medium":
      return "text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-900/20 dark:border-amber-900";
    case "low":
      return "text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-900";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200 dark:bg-zinc-800 dark:text-gray-400 dark:border-zinc-700";
  }
};

interface DealDetailViewProps {
  deal: Deal;
  preferences: AgentPreferences;
  onBack: () => void;
  onUpdateDeal: (deal: Deal) => void;
}

const PriorityBadge = ({ priority }: { priority: Priority }) => {
  const styles = {
    high: 'text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-900',
    medium: 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900',
    low: 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-zinc-800 dark:text-gray-400 dark:border-zinc-700',
  };

  const labels = {
    high: 'High Priority',
    medium: 'Medium Priority',
    low: 'Low Priority',
  };

  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${styles[priority]}`}>
      {labels[priority]}
    </span>
  );
};

export const DealDetailView: React.FC<DealDetailViewProps> = ({
  deal,
  preferences,
  onBack,
  onUpdateDeal
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [emailDraft, setEmailDraft] = useState('');
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleGenerate = async () => {
  setIsGenerating(true);
  setEmailSent(false);

  try {
    // ✅ On part de preferences (qui est déjà un AgentPreferences)
    const enrichedPrefs: AgentPreferences = {
      ...preferences,
      senderName: preferences.senderName, // tu peux mettre un fallback si tu veux
      // si tu veux forcer une langue par défaut :
      language: preferences.language || 'en',
    };

    const draft = await generateFollowUp(deal, enrichedPrefs);
    setEmailDraft(draft);

  } catch (error) {
    console.error("Failed to generate", error);
  } finally {
    setIsGenerating(false);
  }
};

  // Reset state when deal changes, but DO NOT auto-generate
  useEffect(() => {
    setEmailDraft('');
    setEmailSent(false);
    setIsGenerating(false);
  }, [deal.id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(emailDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = () => {
    setEmailSent(true);
    
    const updatedDeal = {
      ...deal,
      lastActivityDate: new Date().toISOString(),
      daysInactive: 0,
      notes: deal.notes + `\n[${new Date().toLocaleDateString('en-US')}] Follow-up email logged to CRM.`
    };
    onUpdateDeal(updatedDeal);
  };

  const getContactEmail = () => {
    const cleanName = deal.contactName.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanCompany = deal.companyName.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `${cleanName}@${cleanCompany}.com`;
  };

  return (
    <div className="animate-fade-in pb-20 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <button 
          onClick={onBack}
          className="group px-3 py-2 rounded-md border border-gray-200 dark:border-zinc-700 hover:bg-white dark:hover:bg-zinc-800 hover:border-gray-300 dark:hover:border-zinc-600 transition-all text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2 w-fit"
        >
          <ArrowLeft size={16} className="text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300 transition-colors" />
          Back to Deals
        </button>

        <button className="px-3 py-2 rounded-md border border-gray-200 dark:border-zinc-700 hover:bg-white dark:hover:bg-zinc-800 hover:border-gray-300 dark:hover:border-zinc-600 transition-all text-xs font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2 shadow-sm w-fit">
          Open in CRM <ExternalLink size={12} className="text-gray-400" />
        </button>
      </div>
      
      {/* Deal Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{deal.name}</h1>
              <PriorityBadge priority={deal.priority} />
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
               <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-gray-100 dark:bg-zinc-800/50">
                  <Building size={14} /> {deal.companyName}
               </span>
               <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-gray-100 dark:bg-zinc-800/50">
                  <User size={14} /> {deal.contactName}
               </span>
            </div>
          </div>
        </div>
      </div>

      {/* ---- DEAL RISK BLOCK ---- */}
<div className="layer-panel p-6 rounded-xl border border-gray-200 dark:border-zinc-800 mb-8 bg-white dark:bg-zinc-900">

  {/* Top: Icon + Label + Score */}
  <div className="flex items-start justify-between">

    {/* Left: Risk Icon + Labels */}
    <div className="flex items-start gap-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${getRiskColorClasses(deal.riskLevel)}`}>
        <AlertTriangle size={18} />
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Deal Risk Level
        </p>
        <p className="text-lg font-bold text-gray-900 dark:text-white">
          {deal.riskLevel === "high" && "High Risk"}
          {deal.riskLevel === "medium" && "Medium Risk"}
          {deal.riskLevel === "low" && "Low Risk"}
        </p>
      </div>
    </div>

    {/* Right: Score */}
    <div className="text-right">
      <p className="text-[11px] text-gray-500 uppercase tracking-wide">Risk Score</p>
      <p className="text-xl font-extrabold text-gray-900 dark:text-white">
        {deal.riskScore}/100
      </p>
    </div>
  </div>

  {/* Divider */}
  <div className="h-px bg-gray-100 dark:bg-zinc-800 my-4"></div>

  {/* Risk Factors */}
  {deal.riskFactors && deal.riskFactors.length > 0 ? (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
        Why this deal is at risk
      </p>

      <ul className="space-y-1.5">
        {deal.riskFactors.map((f, i) => (
          <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-zinc-600"></span>
            {f}
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <p className="text-sm text-gray-500 dark:text-gray-400">
      No risk indicators detected for this deal.
    </p>
  )}
</div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Deal Information */}
        <div className="space-y-6">
          
          {/* Contact Card */}
          <div className="layer-panel p-5 rounded-xl flex items-center gap-4 bg-white dark:bg-zinc-900">
             <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-500 font-bold text-lg border border-gray-200 dark:border-zinc-700">
                {deal.contactName.split(' ').map(n => n[0]).join('')}
             </div>
             <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{deal.contactName}</p>
                <div className="flex items-center gap-2 mt-0.5 text-gray-500">
                    <Mail size={12} />
                    <p className="text-xs truncate">{getContactEmail()}</p>
                </div>
             </div>
          </div>

          <div className="layer-panel p-6 rounded-xl space-y-6 bg-white dark:bg-zinc-900">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-zinc-800 pb-3">
              Deal Information
            </h3>
            
            
            {/* Amount */}
            <div>
               <span className="text-xs text-gray-500 uppercase font-semibold">Deal Value</span>
               <p className="text-2xl font-bold font-sans text-gray-900 dark:text-white tracking-tight mt-1">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: deal.currency, maximumFractionDigits: 0 }).format(deal.amount)}
               </p>
            </div>

            {/* Vitals List */}
            <div className="space-y-6">
              
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5">
                  <Activity size={12} /> Inactive
                </span>
                <div className={`p-3 rounded-lg bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 text-sm font-medium ${deal.daysInactive > 14 ? 'text-rose-600 dark:text-rose-400' : 'text-gray-900 dark:text-white'}`}>
                  {deal.daysInactive} days
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                 <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5">
                   <Clock size={12} /> Days In Stage
                 </span>
                 <div className="p-3 rounded-lg bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 text-sm font-medium text-gray-900 dark:text-white">
                   {deal.daysInStage} days
                 </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5">
                  <Calendar size={12} /> Last Activity
                </span>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(deal.lastActivityDate).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                </div>
              </div>
              
               <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5">
                  <ArrowLeft size={12} className="rotate-180" /> Next Step
                </span>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 text-sm font-medium text-gray-900 dark:text-white">
                   {deal.nextStep || 'Not defined'}
                </div>
              </div>

              {/* Notes Section (Read Only) */}
              <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5">
                     <AlignLeft size={12} /> Notes
                  </span>
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                     {deal.notes || "No notes available."}
                  </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: AI Assistant */}
        <div className="lg:col-span-2 space-y-6">
          <div className="layer-panel p-6 rounded-xl h-full flex flex-col bg-white dark:bg-zinc-900">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-brand-primary/10 rounded-lg">
                   <Sparkles size={20} className="text-brand-primary" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
                  <p className="text-xs text-gray-500">Generate personalized AI follow-ups — review & edit before sending</p>
                </div>
              </div>
              
              {!emailSent && emailDraft && (
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="px-3 py-1.5 text-xs font-medium rounded-md border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5 text-gray-600 dark:text-gray-300"
                >
                  <RefreshCw size={12} className={isGenerating ? 'animate-spin' : ''} />
                  Regenerate
                </button>
              )}
            </div>

            {/* Editor / Draft Area */}
            <div className="flex-1 bg-gray-50 dark:bg-zinc-950/50 rounded-lg border border-gray-200 dark:border-zinc-700 p-4 relative min-h-[400px]">
              
              {/* Empty State / Generate Button */}
              {!emailDraft && !isGenerating && !emailSent && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                      <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-full shadow-sm flex items-center justify-center mb-4 border border-gray-100 dark:border-zinc-700">
                          <Sparkles size={24} className="text-brand-primary" />
                      </div>
                      <h4 className="text-gray-900 dark:text-white font-medium mb-1">Ready to draft a personalized follow-up?</h4>
                      <p className="text-sm text-gray-500 max-w-xs mb-6">
                          I'll use the deal context, notes, and your preferences to write a tailored email.
                      </p>
                      <button 
                        onClick={handleGenerate}
                        className="btn-primary px-6 py-2.5 shadow-lg shadow-brand-primary/20"
                      >
                        Generate Draft
                      </button>
                  </div>
              )}

              {/* Loading State */}
              {isGenerating && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-[2px] rounded-lg z-10 transition-all">
                   <div className="w-12 h-12 border-2 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin mb-4"></div>
                   <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Analyzing deal context, notes, and preferences...</p>
                </div>
              )}

              {/* Success State */}
              {emailSent ? (
                <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in">
                   <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900/30">
                     <Check size={40} strokeWidth={2.5} />
                   </div>
                   <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Logged to CRM</h3>
                   <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto mb-8 leading-relaxed">
                     The email has been copied and the activity has been logged in your Salesforce instance.
                   </p>
                   <button 
                     onClick={onBack}
                     className="px-6 py-2.5 rounded-md border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                   >
                     Back to Deals
                   </button>
                </div>
              ) : (
                // Draft View
                emailDraft && (
                    <div className="flex flex-col h-full animate-fade-in">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-zinc-700 pb-3">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Email Preview</span>
                        <div className="flex gap-2">
                            <button 
                            onClick={handleCopy} 
                            className="flex items-center gap-1.5 px-2 py-1 hover:bg-white dark:hover:bg-zinc-800 rounded text-xs font-medium text-gray-500 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-zinc-700"
                            title="Copy to clipboard"
                            >
                            {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                            {copied ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                    </div>
                    <textarea
                        value={emailDraft}
                        onChange={(e) => setEmailDraft(e.target.value)}
                        className="flex-1 w-full bg-transparent border-none resize-none focus:ring-0 p-0 text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-mono focus:outline-none custom-scrollbar"
                        placeholder="Generating draft..."
                    />
                    </div>
                )
              )}
            </div>

            {/* Actions */}
            {!emailSent && emailDraft && (
              <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                 <p className="text-xs text-gray-400 order-2 sm:order-1 font-medium">
                   Using {preferences.role} persona • {preferences.tone} tone
                 </p>
                 <div className="flex gap-3 order-1 sm:order-2 w-full sm:w-auto">
                   <button 
                     onClick={handleSend} // Reused for Log to CRM logic
                     className="whitespace-nowrap flex-1 sm:flex-none px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md text-xs font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors shadow-sm"
                   >
                     Log to CRM
                   </button>
                   <button 
                     onClick={handleCopy}
                     className="whitespace-nowrap flex-1 sm:flex-none btn-primary flex items-center justify-center gap-2 px-4 py-2 shadow-sm text-xs font-medium"
                   >
                     <Copy size={14} />
                     Copy Text
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