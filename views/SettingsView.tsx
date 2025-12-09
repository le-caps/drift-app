import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Mail, Globe, Bell, Shield, LogOut, Camera, Monitor, Smartphone, Moon, Sun } from 'lucide-react';

interface SettingsViewProps {
  profile: UserProfile;
  onUpdateProfile: (p: UserProfile) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ profile, onUpdateProfile, isDarkMode, onToggleDarkMode }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'account'>('general');
  const [localProfile, setLocalProfile] = useState<UserProfile>(profile);

  const handleSave = (key: keyof UserProfile, value: any) => {
    const updated = { ...localProfile, [key]: value };
    setLocalProfile(updated);
    onUpdateProfile(updated);
  };

  const handleNotificationToggle = (key: keyof UserProfile['notifications']) => {
    const updated = {
      ...localProfile,
      notifications: {
        ...localProfile.notifications,
        [key]: !localProfile.notifications[key]
      }
    };
    setLocalProfile(updated);
    onUpdateProfile(updated);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-20">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-8">Settings</h2>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="glass-panel p-2 rounded-xl flex flex-col gap-1 sticky top-24">
            <button 
              onClick={() => setActiveTab('general')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'general' ? 'bg-pastel-primary/10 text-pastel-dark dark:text-pastel-primary' : 'text-gray-500 hover:bg-white/50 dark:text-gray-400 dark:hover:bg-white/5'}`}
            >
              <User size={18} strokeWidth={1.5} /> General
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'notifications' ? 'bg-pastel-primary/10 text-pastel-dark dark:text-pastel-primary' : 'text-gray-500 hover:bg-white/50 dark:text-gray-400 dark:hover:bg-white/5'}`}
            >
              <Bell size={18} strokeWidth={1.5} /> Notifications
            </button>
            <button 
              onClick={() => setActiveTab('account')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'account' ? 'bg-pastel-primary/10 text-pastel-dark dark:text-pastel-primary' : 'text-gray-500 hover:bg-white/50 dark:text-gray-400 dark:hover:bg-white/5'}`}
            >
              <Shield size={18} strokeWidth={1.5} /> Account
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 space-y-8">
          
          {/* GENERAL TAB */}
          {activeTab === 'general' && (
            <div className="space-y-8 animate-fade-in">
              {/* Profile Section */}
              <section className="glass-panel p-8 rounded-2xl">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Public Profile</h3>
                
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative group cursor-pointer">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-xl font-bold text-gray-600 dark:text-gray-200 shadow-inner border-2 border-white dark:border-white/10">
                      JD
                    </div>
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="text-white" size={20} />
                    </div>
                  </div>
                  <div>
                    <button className="liquid-button px-4 py-2 rounded-lg text-sm font-bold text-gray-700 dark:text-white mb-2">Change Avatar</button>
                    <p className="text-xs text-gray-500 dark:text-gray-400">JPG, GIF or PNG. 1MB max.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Full Name</label>
                    <input 
                      type="text" 
                      value={localProfile.name}
                      onChange={(e) => handleSave('name', e.target.value)}
                      className="w-full bg-white/50 dark:bg-slate-900/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pastel-primary/30 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Email Address</label>
                    <input 
                      type="email" 
                      value={localProfile.email}
                      onChange={(e) => handleSave('email', e.target.value)}
                      className="w-full bg-white/50 dark:bg-slate-900/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pastel-primary/30 dark:text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Job Title</label>
                    <input 
                      type="text" 
                      value={localProfile.title}
                      onChange={(e) => handleSave('title', e.target.value)}
                      className="w-full bg-white/50 dark:bg-slate-900/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pastel-primary/30 dark:text-white"
                    />
                  </div>
                </div>
              </section>

              {/* Preferences Section */}
              <section className="glass-panel p-8 rounded-2xl">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Language</label>
                    <div className="relative">
                      <select 
                        value={localProfile.language}
                        onChange={(e) => handleSave('language', e.target.value)}
                        className="w-full bg-white/50 dark:bg-slate-900/50 border border-gray-200 dark:border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pastel-primary/30 dark:text-white appearance-none"
                      >
                        <option value="en">English (US)</option>
                        <option value="fr">French</option>
                        <option value="es">Spanish</option>
                        <option value="de">German</option>
                      </select>
                      <Globe size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Timezone</label>
                    <select 
                      value={localProfile.timezone}
                      onChange={(e) => handleSave('timezone', e.target.value)}
                      className="w-full bg-white/50 dark:bg-slate-900/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pastel-primary/30 dark:text-white"
                    >
                      <option value="PST">Pacific Time (US & Canada)</option>
                      <option value="EST">Eastern Time (US & Canada)</option>
                      <option value="GMT">Greenwich Mean Time</option>
                      <option value="CET">Central European Time</option>
                    </select>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200/50 dark:border-gray-700/50">
                   <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm text-gray-800 dark:text-white">Appearance</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Customize how Drift looks on your device.</p>
                      </div>
                      <div className="flex p-1 bg-gray-100 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-white/5">
                        <button 
                          onClick={() => isDarkMode && onToggleDarkMode()}
                          className={`p-2 rounded-md transition-all ${!isDarkMode ? 'bg-white shadow-sm text-amber-500' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                          <Sun size={18} />
                        </button>
                        <button 
                           onClick={() => !isDarkMode && onToggleDarkMode()}
                           className={`p-2 rounded-md transition-all ${isDarkMode ? 'bg-slate-600 shadow-sm text-indigo-300' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                          <Moon size={18} />
                        </button>
                      </div>
                   </div>
                </div>
              </section>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="space-y-8 animate-fade-in">
              <section className="glass-panel p-8 rounded-2xl">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Email Notifications</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="mt-1 p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-lg">
                        <Mail size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-800 dark:text-white">Daily Digest</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Receive a summary of stalled deals every morning at 9 AM.</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={localProfile.notifications.emailDigest}
                        onChange={() => handleNotificationToggle('emailDigest')}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-pastel-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="mt-1 p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-500 rounded-lg">
                        <Monitor size={20} />
                      </div>
                      <div>
                         <p className="font-bold text-sm text-gray-800 dark:text-white">Product Updates</p>
                         <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">News about features and improvements to Drift.</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={localProfile.notifications.marketing}
                        onChange={() => handleNotificationToggle('marketing')}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-pastel-primary"></div>
                    </label>
                  </div>
                </div>
              </section>

              <section className="glass-panel p-8 rounded-2xl">
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Push Notifications</h3>
                 <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="mt-1 p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-lg">
                        <Smartphone size={20} />
                      </div>
                      <div>
                         <p className="font-bold text-sm text-gray-800 dark:text-white">Browser Notifications</p>
                         <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Get notified immediately when a deal becomes stalled.</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={localProfile.notifications.pushDesktop}
                        onChange={() => handleNotificationToggle('pushDesktop')}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-pastel-primary"></div>
                    </label>
                  </div>
              </section>
            </div>
          )}

           {/* ACCOUNT TAB */}
           {activeTab === 'account' && (
            <div className="space-y-8 animate-fade-in">
              <section className="glass-panel p-8 rounded-2xl border-l-4 border-l-rose-400">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Danger Zone</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Manage your session and account data.</p>
                
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between p-4 bg-white/40 dark:bg-slate-800/40 rounded-xl border border-white/50 dark:border-white/5">
                    <div>
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Sign Out</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">End your current session.</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-bold text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors">
                      <LogOut size={16} /> Log Out
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white/40 dark:bg-slate-800/40 rounded-xl border border-white/50 dark:border-white/5">
                    <div>
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Delete Account</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Permanently remove all data.</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900 rounded-lg text-sm font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};