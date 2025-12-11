import React, { useState } from 'react';
import { ViewState } from '../types';
import { Layers, PieChart, Bot, HelpCircle, Settings, X, ChevronLeft, ChevronRight, Shield } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isOpen, setIsOpen }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const NavItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => {
    const isActive = currentView === view || (view === 'deals' && currentView === 'dealDetails');
    
    return (
      <button
        onClick={() => {
          onChangeView(view);
          if (window.innerWidth < 1024) setIsOpen(false);
        }}
        className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors group relative ${
          isActive 
            ? 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white' 
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50 hover:text-gray-900 dark:hover:text-gray-200'
        } ${isCollapsed ? 'justify-center' : 'justify-start gap-3'}`}
        title={isCollapsed ? label : ''}
      >
        <Icon size={18} strokeWidth={1.5} className={`flex-shrink-0 transition-colors ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
        
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? 'max-w-0 opacity-0 -translate-x-4' : 'max-w-[160px] opacity-100 translate-x-0'}`}>
           <span className="whitespace-nowrap block">{label}</span>
        </div>
      </button>
    );
  };

  

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen 
        bg-white dark:bg-[#111] border-r border-gray-200 dark:border-zinc-800
        transform transition-all duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}>
        {/* Floating Collapse Toggle (Desktop) */}
        <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute -right-3 top-9 z-50 w-6 h-6 items-center justify-center bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-full shadow-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all hover:scale-105"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Logo Area */}
        <div className={`h-16 flex items-center px-4 border-b border-transparent ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-primary rounded-md flex items-center justify-center text-white font-bold text-lg shrink-0">
              D
            </div>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[120px] opacity-100'}`}>
               <span className="font-semibold text-lg tracking-tight text-gray-900 dark:text-white whitespace-nowrap block">Drift</span>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-500 dark:text-gray-400">
            <X size={20} />
          </button>
        </div>

       {/* Nav Links */}
<div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto mt-2 custom-scrollbar">
  <NavItem view="deals" icon={Layers} label="Deals" />
  <NavItem view="insights" icon={PieChart} label="Pipeline Insights" />

  {/* NEW — Risk Engine */}
  <NavItem view="riskEngine" icon={Shield} label="Deal Risk Engine" />

  <NavItem view="agent" icon={Bot} label="My AI Agent" />
</div>

        {/* Bottom Nav */}
        <div className="p-3 border-t border-gray-200 dark:border-zinc-800 space-y-1">
          <NavItem view="help" icon={HelpCircle} label="Help & FAQ" />
          <NavItem view="settings" icon={Settings} label="Settings" />
          
          <div className={`mt-4 flex items-center gap-3 px-2 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer ${isCollapsed ? 'justify-center px-0' : ''}`}>
            <div className="w-7 h-7 rounded bg-gray-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300 shrink-0">
              JD
            </div>
            
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[120px] opacity-100'}`}>
              <div className="whitespace-nowrap">
                <p className="text-xs font-medium text-gray-900 dark:text-white truncate">John Doe</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">john@drift.app</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};