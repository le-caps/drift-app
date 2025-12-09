import React, { useState, useMemo, useEffect } from 'react';
import { Deal, Priority } from '../types';
import { 
  ArrowRight, Clock, Search, SlidersHorizontal, ArrowDownWideNarrow, 
  Handshake, FileText, CheckCircle2, Compass, ClipboardList, CircleDashed,
  User, ChevronLeft, ChevronRight, Building
} from 'lucide-react';

interface DealsViewProps {
  deals: Deal[];
  onSelectDeal: (dealId: string) => void;
}

const ITEMS_PER_PAGE = 6;

const PriorityBadge = ({ priority }: { priority: Priority }) => {
  const styles = {
    high: 'text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800/50',
    medium: 'text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/50',
    low: 'text-slate-500 bg-slate-100 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700',
  };

  const labels = {
    high: 'High Priority',
    medium: 'Medium Priority',
    low: 'Low Priority',
  };

  return (
    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border backdrop-blur-sm ${styles[priority]} shadow-sm`}>
      {labels[priority]}
    </span>
  );
};

const getStageIcon = (stage: string) => {
  const s = stage.toLowerCase();
  if (s.includes('negotiation')) return <Handshake size={16} strokeWidth={2} />;
  if (s.includes('proposal')) return <FileText size={16} strokeWidth={2} />;
  if (s.includes('qualified') || s.includes('won')) return <CheckCircle2 size={16} strokeWidth={2} />;
  if (s.includes('discovery')) return <Compass size={16} strokeWidth={2} />;
  if (s.includes('evaluation') || s.includes('demo')) return <ClipboardList size={16} strokeWidth={2} />;
  return <CircleDashed size={16} strokeWidth={2} />;
};

// Updated to return styles based on Priority to match the badge
const getPriorityBarStyle = (priority: Priority) => {
  switch (priority) {
    case 'high': 
      return 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]';
    case 'medium': 
      return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]';
    case 'low': 
      return 'bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.4)]';
    default:
      return 'bg-gray-300';
  }
};

export const DealsView: React.FC<DealsViewProps> = ({ deals, onSelectDeal }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'all' | Priority>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'inactive' | 'amount' | 'name'>('priority');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, priorityFilter, sortBy]);

  const filteredAndSortedDeals = useMemo(() => {
    let result = [...deals];

    // Filter by Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(d => 
        d.name.toLowerCase().includes(q) || 
        d.companyName.toLowerCase().includes(q) ||
        d.contactName.toLowerCase().includes(q)
      );
    }

    // Filter by Priority
    if (priorityFilter !== 'all') {
      result = result.filter(d => d.priority === priorityFilter);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const pMap = { high: 3, medium: 2, low: 1 };
          if (pMap[a.priority] !== pMap[b.priority]) return pMap[b.priority] - pMap[a.priority];
          return b.daysInactive - a.daysInactive; // Tie-breaker
        case 'inactive':
          return b.daysInactive - a.daysInactive;
        case 'amount':
          return b.amount - a.amount;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return result;
  }, [deals, searchQuery, priorityFilter, sortBy]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredAndSortedDeals.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedDeals = filteredAndSortedDeals.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Stalled Deals</h2>
          <p className="text-gray-500 dark:text-gray-400 text-base mt-2 font-medium">
            Action required on {filteredAndSortedDeals.length} opportunities
          </p>
        </div>

        {/* Controls Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Search size={16} className="text-gray-400 group-focus-within:text-pastel-primary transition-colors" />
                </div>
                <input 
                    type="text" 
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2.5 w-full sm:w-56 bg-white/50 dark:bg-slate-800/50 border border-white/60 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pastel-primary/30 focus:border-pastel-primary/30 transition-all placeholder-gray-400 dark:text-white shadow-sm hover:bg-white/70 dark:hover:bg-slate-800/70 backdrop-blur-sm"
                />
            </div>

            <div className="flex gap-3">
                {/* Priority Filter */}
                <div className="relative flex-1 sm:flex-none">
                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value as any)}
                        className="w-full appearance-none pl-9 pr-10 py-2.5 bg-white/50 dark:bg-slate-800/50 border border-white/60 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pastel-primary/30 cursor-pointer text-gray-700 dark:text-gray-200 font-medium shadow-sm hover:bg-white/70 dark:hover:bg-slate-800/70 backdrop-blur-sm"
                    >
                        <option value="all">All Priorities</option>
                        <option value="high">High Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="low">Low Priority</option>
                    </select>
                    <SlidersHorizontal size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>

                {/* Sort */}
                <div className="relative flex-1 sm:flex-none">
                    <select
                         value={sortBy}
                         onChange={(e) => setSortBy(e.target.value as any)}
                         className="w-full appearance-none pl-9 pr-10 py-2.5 bg-white/50 dark:bg-slate-800/50 border border-white/60 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pastel-primary/30 cursor-pointer text-gray-700 dark:text-gray-200 font-medium shadow-sm hover:bg-white/70 dark:hover:bg-slate-800/70 backdrop-blur-sm"
                    >
                        <option value="priority">Priority</option>
                        <option value="inactive">Inactive</option>
                        <option value="amount">Value</option>
                        <option value="name">Name</option>
                    </select>
                     <ArrowDownWideNarrow size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
            </div>
        </div>
      </div>

      <div className="grid gap-4">
        {paginatedDeals.length > 0 ? (
          paginatedDeals.map((deal) => {
            const barStyle = getPriorityBarStyle(deal.priority);
            return (
              <div 
                key={deal.id}
                // Changed glass-card to glass-panel to remove global hover effects
                // Removed specific hover:bg-* classes
                className="group glass-panel rounded-xl p-5 relative overflow-hidden border border-white/40 dark:border-white/5 pl-6"
              >
                {/* Priority Indicator Bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${barStyle}`} />

                <div className="relative z-10 flex flex-col gap-4">
                  
                  {/* Top Row: Main Info */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5">
                        <PriorityBadge priority={deal.priority} />
                      </div>
                      <button 
                        onClick={() => onSelectDeal(deal.id)}
                        className="text-xl font-bold text-gray-900 dark:text-white leading-tight hover:text-pastel-primary dark:hover:text-pastel-primary transition-colors text-left"
                      >
                        {deal.name}
                      </button>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2">
                         <Building size={14} className="text-gray-400 dark:text-gray-500" />
                         {deal.companyName}
                         <span className="text-gray-300 dark:text-gray-600">•</span>
                         <User size={14} className="text-gray-400 dark:text-gray-500" />
                         {deal.contactName}
                      </p>
                    </div>

                    <div className="text-right pt-1">
                      <p className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: deal.currency, maximumFractionDigits: 0 }).format(deal.amount)}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gray-100 dark:bg-white/5" />

                  {/* Bottom Row: Unified Context & Action */}
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                      
                      <div className="flex flex-wrap items-center gap-6 sm:gap-12 flex-1">
                          
                          {/* Stage */}
                          <div className="flex flex-col gap-1.5">
                              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">Stage</span>
                              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                  <span className="text-pastel-secondary dark:text-pastel-secondary/90">
                                      {getStageIcon(deal.stage)}
                                  </span>
                                  {deal.stage}
                              </div>
                          </div>

                          {/* Inactivity */}
                          <div className="flex flex-col gap-1.5">
                              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">Inactivity</span>
                              <div className={`flex items-center gap-2 text-sm font-bold ${deal.daysInactive > 14 ? 'text-rose-500' : 'text-gray-600 dark:text-gray-400'}`}>
                                  <Clock size={16} strokeWidth={2} />
                                  {deal.daysInactive}d
                              </div>
                          </div>

                           {/* Next Step */}
                          {deal.nextStep && (
                              <div className="flex flex-col gap-1.5 max-w-[200px]">
                                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">Next Step</span>
                                  <span className="text-sm text-gray-600 dark:text-gray-300 font-medium truncate" title={deal.nextStep}>
                                      {deal.nextStep}
                                  </span>
                              </div>
                          )}
                      </div>

                      {/* Action */}
                      <button 
                          onClick={() => onSelectDeal(deal.id)}
                          className="liquid-primary px-6 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-pastel-primary/20 shrink-0 w-full sm:w-auto"
                      >
                          View Details <ArrowRight size={16} strokeWidth={2} />
                      </button>

                  </div>
                </div>
              </div>
            );
          })
        ) : (
            <div className="flex flex-col items-center justify-center py-24 opacity-60 space-y-4">
                <div className="p-6 bg-white/50 dark:bg-slate-800/50 rounded-full shadow-sm border border-white/20">
                    <Search size={40} strokeWidth={1} className="text-gray-400" />
                </div>
                <div className="text-center">
                    <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">No deals match your search</p>
                    <p className="text-base text-gray-400 dark:text-gray-500">Try adjusting your filters or search terms.</p>
                </div>
                <button 
                    onClick={() => {setSearchQuery(''); setPriorityFilter('all');}}
                    className="text-pastel-primary hover:text-pastel-primary/80 text-base font-bold mt-2"
                >
                    Reset Filters
                </button>
            </div>
        )}
      </div>

      {/* Pagination Controls */}
      {filteredAndSortedDeals.length > ITEMS_PER_PAGE && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-gray-200/50 dark:border-white/5 mt-8">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium order-2 sm:order-1">
                Showing <span className="font-bold text-gray-800 dark:text-white">{startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredAndSortedDeals.length)}</span> of <span className="font-bold text-gray-800 dark:text-white">{filteredAndSortedDeals.length}</span> deals
            </span>

            <div className="flex items-center gap-2 order-1 sm:order-2 glass-panel p-1 rounded-xl">
                <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg hover:bg-white dark:hover:bg-slate-700 disabled:opacity-50 disabled:hover:bg-transparent transition-colors text-gray-600 dark:text-gray-300"
                >
                    <ChevronLeft size={18} strokeWidth={2} />
                </button>

                <div className="px-4 py-1 font-bold text-sm text-gray-700 dark:text-gray-200">
                    Page {currentPage} <span className="text-gray-400 font-normal mx-1">/</span> {totalPages}
                </div>

                <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg hover:bg-white dark:hover:bg-slate-700 disabled:opacity-50 disabled:hover:bg-transparent transition-colors text-gray-600 dark:text-gray-300"
                >
                    <ChevronRight size={18} strokeWidth={2} />
                </button>
            </div>
        </div>
      )}
    </div>
  );
};
