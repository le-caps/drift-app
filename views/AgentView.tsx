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
    { id: 'friendly', label: 'Friendly', desc: 'Warm and approachable.' },
    { id: 'direct', label: 'Direct', desc: 'Straight to the point.' },
    { id: 'professional', label: 'Professional', desc: 'Formal and respectful.' },
    { id: 'casual', label: 'Casual', desc: 'Relaxed and informal.' },
    { id: 'challenger', label: 'Challenger', desc: 'Bold and provocative.' },
  ];
  
  const styleOptions = [
    { id: 'short', label: 'Short & Punchy', desc: 'Respects time.' },
    { id: 'detailed', label: 'Detailed', desc: 'Full context recap.' },
    { id: 'urgent', label: 'Urgent', desc: 'Drive action now.' },
    { id: 'soft', label: 'Soft Touch', desc: 'Low pressure.' },
    { id: 'storytelling', label: 'Storytelling', desc: 'Persuasive narrative.' },
  ];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-8 pb-28">
      <div className="border-b border-gray-200 dark:border-zinc-800 pb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 tracking-tight">
          <Bot className="text-brand-primary" size={24} />
          My AI Agent
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-base">
          Tune how Drift writes your follow-ups to match your voice.
        </p>
      </div>

      <div className="space-y-10">
        {/* Role Section */}
        <section>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">Your Role</label>
          <div className="relative">
            <select 
              value={localPrefs.role}
              onChange={(e) => update('role', e.target.value)}
              className="block w-full sm:w-1/2 px-3 py-2 text-sm border border-gray-200 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-primary bg-white dark:bg-zinc-800 dark:text-white shadow-sm"
            >
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
              <option value="Other">Other</option>
            </select>
          </div>
        </section>

        {/* Tone Section */}
        <section>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">Tone of Voice</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {toneOptions.map((option) => {
              const isSelected = localPrefs.tone === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => update('tone', option.id)}
                  className={`group relative flex flex-col items-start p-4 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'border-brand-primary bg-blue-50/50 dark:bg-blue-900/10 ring-1 ring-brand-primary'
                      : 'border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-gray-300 dark:hover:border-zinc-600'
                  }`}
                >
                  <div className="flex justify-between w-full mb-1">
                    <span className={`font-semibold text-sm ${isSelected ? 'text-brand-primary' : 'text-gray-900 dark:text-white'}`}>
                      {option.label}
                    </span>
                    {isSelected && <Check size={14} className="text-brand-primary" strokeWidth={3} />}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {option.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Style Section */}
        <section>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">Follow-Up Style</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {styleOptions.map((option) => {
              const isSelected = localPrefs.style === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => update('style', option.id)}
                   className={`group relative flex flex-col items-start p-4 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'border-brand-primary bg-blue-50/50 dark:bg-blue-900/10 ring-1 ring-brand-primary'
                      : 'border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-gray-300 dark:hover:border-zinc-600'
                  }`}
                >
                  <div className="flex justify-between w-full mb-1">
                    <span className={`font-semibold text-sm ${isSelected ? 'text-brand-primary' : 'text-gray-900 dark:text-white'}`}>
                      {option.label}
                    </span>
                    {isSelected && <Check size={14} className="text-brand-primary" strokeWidth={3} />}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {option.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Product Description */}
        <section>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Product / Offer Description
          </label>
          <textarea
            rows={4}
            value={localPrefs.productDescription}
            onChange={(e) => update('productDescription', e.target.value)}
            className="input-field block w-full text-sm rounded-md p-3 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder-gray-400"
            placeholder="e.g. We sell a project management tool for creative agencies..."
          />
          <p className="text-xs text-gray-500 mt-2">The AI uses this to add context to your emails.</p>
        </section>

        {/* Calendar Link */}
        <section>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Calendar / Booking Link
          </label>
          <input
            type="text"
            value={localPrefs.calendarLink}
            onChange={(e) => update('calendarLink', e.target.value)}
            className="input-field block w-full text-sm rounded-md p-3 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder-gray-400"
            placeholder="https://calendly.com/your-name"
          />
        </section>
      </div>

      {/* Footer / Save */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#111] p-4 flex justify-between items-center z-20">
        <span className="text-sm text-gray-500 font-medium px-4">
          {isSaved ? "Saved." : "Unsaved changes."}
        </span>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-2 rounded-md font-medium text-sm transition-all ${
            isSaved 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'btn-primary'
          }`}
        >
          {isSaved ? 'Saved' : 'Save Preferences'}
          {!isSaved && <Save size={16} />}
        </button>
      </div>
    </div>
  );
};