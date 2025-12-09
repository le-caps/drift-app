import React, { useState } from 'react';
import { AgentPreferences } from '../types';
import { Save, Bot, Check } from 'lucide-react';

interface AgentViewProps {
  preferences: AgentPreferences;
  onSave: (prefs: AgentPreferences) => void;
}

export const AgentView: React.FC<AgentViewProps> = ({ preferences, onSave }) => {
  const [localPrefs, setLocalPrefs] = useState<AgentPreferences>(preferences);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onSave(localPrefs);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const update = (field: keyof AgentPreferences, value: any) => {
    setLocalPrefs(prev => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const roles = ['AE', 'BDR', 'Founder', 'CSM', 'VP Sales'];
  
  const toneOptions = [
    { id: 'friendly', label: 'Friendly', desc: 'Warm and approachable. Focuses on building relationship.' },
    { id: 'direct', label: 'Direct', desc: 'Straight to the point. No fluff, respects time.' },
    { id: 'professional', label: 'Professional', desc: 'Formal and respectful. Standard business etiquette.' },
    { id: 'casual', label: 'Casual', desc: 'Relaxed and informal. Like texting a peer.' },
    { id: 'challenger', label: 'Challenger', desc: 'Bold and provocative. Pushes back constructively.' },
  ];
  
  const styleOptions = [
    { id: 'short', label: 'Short & Punchy', desc: 'Quick check-ins that respect time.' },
    { id: 'detailed', label: 'Detailed', desc: 'Comprehensive recap of value & context.' },
    { id: 'urgent', label: 'Urgent', desc: 'Drive immediate action or close file.' },
    { id: 'soft', label: 'Soft Touch', desc: 'Gentle, low-pressure reminders.' },
    { id: 'storytelling', label: 'Storytelling', desc: 'Persuasive narrative approach.' },
  ];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-12 pb-28">
      <div className="border-b border-gray-200/50 dark:border-gray-700/50 pb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3 tracking-tight">
          <div className="bg-pastel-primary/10 p-2.5 rounded-xl">
             <Bot className="text-pastel-primary" size={32} strokeWidth={1.5} /> 
          </div>
          My AI Agent
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg">
          Tune how Drift writes your follow-ups so it matches your role, tone, and product voice perfectly.
        </p>
      </div>

      <div className="space-y-12">
        {/* Role Section */}
        <section>
          <label className="block text-base font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide mb-4">Your Role</label>
          <div className="relative">
            <select 
              value={localPrefs.role}
              onChange={(e) => update('role', e.target.value)}
              className="block w-full sm:w-1/2 pl-4 pr-10 py-3.5 text-base border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-pastel-primary/50 focus:border-pastel-primary/50 rounded-xl glass-card shadow-sm dark:bg-slate-800 dark:text-white"
            >
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
              <option value="Other">Other</option>
            </select>
          </div>
        </section>

        {/* Tone Section */}
        <section>
          <label className="block text-base font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide mb-4">Tone of Voice</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {toneOptions.map((option) => {
              const isSelected = localPrefs.tone === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => update('tone', option.id)}
                  className={`group relative flex flex-col items-start p-6 rounded-2xl border text-left transition-all duration-300 ${
                    isSelected
                      ? 'border-pastel-primary/50 bg-pastel-primary/10 shadow-lg shadow-pastel-primary/10 dark:bg-pastel-primary/20'
                      : 'border-white/40 dark:border-white/10 bg-white/40 dark:bg-slate-800/40 hover:bg-white/70 dark:hover:bg-slate-800/60 hover:shadow-md'
                  }`}
                >
                  <div className="flex justify-between w-full mb-3">
                    <span className={`font-bold text-base ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                      {option.label}
                    </span>
                    <div className={`
                      h-6 w-6 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm
                      ${isSelected ? 'bg-pastel-primary text-white scale-100' : 'bg-gray-100 dark:bg-slate-700 scale-90 opacity-0 group-hover:opacity-100'}
                    `}>
                       <Check size={14} strokeWidth={2.5} />
                    </div>
                  </div>
                  <span className={`text-sm leading-relaxed font-medium ${isSelected ? 'text-gray-600 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
                    {option.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Style Section */}
        <section>
          <label className="block text-base font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide mb-4">Follow-Up Style</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {styleOptions.map((option) => {
              const isSelected = localPrefs.style === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => update('style', option.id)}
                   className={`group relative flex flex-col items-start p-6 rounded-2xl border text-left transition-all duration-300 ${
                    isSelected
                      ? 'border-pastel-secondary/50 bg-pastel-secondary/10 shadow-lg shadow-pastel-secondary/10 dark:bg-pastel-secondary/20'
                      : 'border-white/40 dark:border-white/10 bg-white/40 dark:bg-slate-800/40 hover:bg-white/70 dark:hover:bg-slate-800/60 hover:shadow-md'
                  }`}
                >
                  <div className="flex justify-between w-full mb-3">
                    <span className={`font-bold text-base ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                      {option.label}
                    </span>
                    <div className={`
                      h-6 w-6 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm
                      ${isSelected ? 'bg-pastel-secondary text-white scale-100' : 'bg-gray-100 dark:bg-slate-700 scale-90 opacity-0 group-hover:opacity-100'}
                    `}>
                       <Check size={14} strokeWidth={2.5} />
                    </div>
                  </div>
                  <span className={`text-sm leading-relaxed font-medium ${isSelected ? 'text-gray-600 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
                    {option.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Product Description */}
        <section>
          <label className="block text-base font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide mb-2">
            Product / Offer Description
          </label>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium">Briefly describe what you sell. The AI uses this to add context.</p>
          <textarea
            rows={4}
            value={localPrefs.productDescription}
            onChange={(e) => update('productDescription', e.target.value)}
            className="glass-card shadow-inner focus:ring-pastel-primary/50 focus:border-pastel-primary/50 block w-full text-base border-gray-200 dark:border-gray-600 rounded-xl p-4 border placeholder-gray-400 bg-white/60 dark:bg-slate-800/60 dark:text-white"
            placeholder="e.g. We sell a project management tool for creative agencies..."
          />
        </section>

        {/* Calendar Link */}
        <section>
          <label className="block text-base font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide mb-2">
            Calendar / Booking Link
          </label>
          <input
            type="text"
            value={localPrefs.calendarLink}
            onChange={(e) => update('calendarLink', e.target.value)}
            className="glass-card shadow-inner focus:ring-pastel-primary/50 focus:border-pastel-primary/50 block w-full text-base border-gray-200 dark:border-gray-600 rounded-xl p-4 border placeholder-gray-400 bg-white/60 dark:bg-slate-800/60 dark:text-white"
            placeholder="https://calendly.com/your-name"
          />
        </section>
      </div>

      {/* Footer / Save */}
      <div className="sticky bottom-6 glass-panel backdrop-blur-xl p-4 rounded-2xl border border-white/50 dark:border-white/10 shadow-2xl flex justify-between items-center mt-12 z-20">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium px-2">
          {isSaved ? "Preferences saved successfully." : "Changes are not saved automatically."}
        </span>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-lg text-base transform active:scale-95 ${
            isSaved 
              ? 'liquid-button bg-pastel-success/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' 
              : 'liquid-primary text-white'
          }`}
        >
          {isSaved ? 'Saved' : 'Save Preferences'}
          {!isSaved && <Save size={20} strokeWidth={2} />}
        </button>
      </div>
    </div>
  );
};