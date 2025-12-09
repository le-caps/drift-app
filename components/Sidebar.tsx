import React, { useState } from 'react';
import { ViewState } from '../types';
import { Layers, PieChart, Bot, HelpCircle, Settings, X, ChevronLeft, ChevronRight } from 'lucide-react';

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
        className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
          isActive 
            ? 'bg-pastel-primary/10 text-pastel-dark dark:text-pastel-primary shadow-sm border border-pastel-primary/10 dark:border-pastel-primary/20' 
            : 'text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white hover:shadow-sm'
        } ${isCollapsed ? 'justify-center' : 'justify-start gap-3'}`}
        title={isCollapsed ? label : ''}
      >
        <Icon size={18} strokeWidth={1.5} className={`flex-shrink-0 transition-colors ${isActive ? 'text-pastel-primary' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
        
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
          className="fixed inset-0 bg-gray-900/10 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container - Glass Panel */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen 
        glass-panel border-r-0 border-r-white/50 dark:border-r-white/5
        transform transition-all duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}>
        {/* Floating Collapse Toggle (Desktop) */}
        <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute -right-3 top-9 z-50 w-6 h-6 items-center justify-center bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-600 rounded-full shadow-md text-gray-500 hover:text-pastel-primary hover:border-pastel-primary/50 transition-all transform hover:scale-110"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
            {isCollapsed ? <ChevronRight size={14} strokeWidth={2} /> : <ChevronLeft size={14} strokeWidth={2} />}
        </button>

        {/* Logo Area */}
        <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-pastel-primary to-rose-300 rounded-xl shadow-lg shadow-pastel-primary/20 flex items-center justify-center text-white font-bold text-lg shrink-0">
              D
            </div>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[120px] opacity-100'}`}>
               <span className="font-bold text-xl tracking-tight text-gray-800 dark:text-white whitespace-nowrap block">Drift</span>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-500 dark:text-gray-400">
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Nav Links */}
        <div className="flex-1 px-3 space-y-1.5 overflow-y-auto mt-2 custom-scrollbar">
          <NavItem view="deals" icon={Layers} label="Deals" />
          <NavItem view="insights" icon={PieChart} label="Pipeline Insights" />
          <NavItem view="agent" icon={Bot} label="My AI Agent" />
        </div>

        {/* Bottom Nav */}
        <div className="p-4 border-t border-white/40 dark:border-white/5 space-y-1.5">
          <NavItem view="help" icon={HelpCircle} label="Help & FAQ" />
          <NavItem view="settings" icon={Settings} label="Settings" />
          
          <div className={`mt-4 flex items-center gap-3 px-2 py-2 glass-card rounded-xl overflow-hidden transition-all duration-300 ${isCollapsed ? 'justify-center px-0 bg-transparent border-transparent shadow-none' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-200 shadow-inner border border-white dark:border-white/10 shrink-0">
              JD
            </div>
            
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[120px] opacity-100'}`}>
              <div className="whitespace-nowrap">
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">John Doe</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate font-medium">john@drift.app</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};