import React, { useState, useMemo, useEffect } from 'react';
import { Deal, Priority } from '../types';
import { 
  Clock, Search, SlidersHorizontal, ArrowDownWideNarrow, 
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

const getStageIcon = (stage: string) => {
  const s = stage.toLowerCase();
  if (s.includes('negotiation')) return <Handshake size={15} strokeWidth={1.5} />;
  if (s.includes('proposal')) return <FileText size={15} strokeWidth={1.5} />;
  if (s.includes('qualified') || s.includes('won')) return <CheckCircle2 size={15} strokeWidth={1.5} />;
  if (s.includes('discovery')) return <Compass size={15} strokeWidth={1.5} />;
  if (s.includes('evaluation') || s.includes('demo')) return <ClipboardList size={15} strokeWidth={1.5} />;
  return <CircleDashed size={15} strokeWidth={1.5} />;
};

const getPriorityBarStyle = (priority: Priority) => {
  switch (priority) {
    case 'high': return 'bg-rose-500';
    case 'medium': return 'bg-amber-500';
    case 'low': return 'bg-gray-400';
    default: return 'bg-gray-300';
  }
};

export const DealsView: React.FC<DealsViewProps> = ({ deals, onSelectDeal }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'all' | Priority>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'inactive' | 'amount' | 'name'>('priority');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, priorityFilter, sortBy]);

  const filteredAndSortedDeals = useMemo(() => {
    let result = [...deals];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(d => 
        d.name.toLowerCase().includes(q) || 
        d.companyName.toLowerCase().includes(q) ||
        d.contactName.toLowerCase().includes(q)
      );
    }
    if (priorityFilter !== 'all') {
      result = result.filter(d => d.priority === priorityFilter);
    }
    result.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const pMap = { high: 3, medium: 2, low: 1 };
          if (pMap[a.priority] !== pMap[b.priority]) return pMap[b.priority] - pMap[a.priority];
          return b.daysInactive - a.daysInactive;
        case 'inactive': return b.daysInactive - a.daysInactive;
        case 'amount': return b.amount - a.amount;
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });
    return result;
  }, [deals, searchQuery, priorityFilter, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedDeals.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedDeals = filteredAndSortedDeals.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-6 animate-fade-in pb-20 max-w-5xl mx-auto px-4 w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">Stalled Deals</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Action required on {filteredAndSortedDeals.length} opportunities
          </p>
        </div>

        {/* Controls Toolbar */}
        <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={15} className="text-gray-400" />
                </div>
                <input 
                    type="text" 
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 w-full sm:w-56 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-all placeholder-gray-400 dark:text-white shadow-sm"
                />
            </div>

            <div className="flex gap-2">
                <div className="relative flex-1 sm:flex-none">
                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value as any)}
                        className="w-full appearance-none pl-8 pr-8 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary cursor-pointer text-gray-700 dark:text-gray-200 shadow-sm"
                    >
                        <option value="all">All Priorities</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                    <SlidersHorizontal size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>

                <div className="relative flex-1 sm:flex-none">
                    <select
                         value={sortBy}
                         onChange={(e) => setSortBy(e.target.value as any)}
                         className="w-full appearance-none pl-8 pr-8 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary cursor-pointer text-gray-700 dark:text-gray-200 shadow-sm"
                    >
                        <option value="priority">Priority</option>
                        <option value="inactive">Inactive</option>
                        <option value="amount">Value</option>
                        <option value="name">Name</option>
                    </select>
                     <ArrowDownWideNarrow size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
            </div>
        </div>
      </div>

      <div className="grid gap-4 max-w-5xl mx-auto w-full">
        {paginatedDeals.length > 0 ? (
          paginatedDeals.map((deal) => {
            const barStyle = getPriorityBarStyle(deal.priority);
            return (
              <div 
                key={deal.id}
                className="layer-panel rounded-lg p-5 relative overflow-hidden pl-5"
              >
                {/* Priority Indicator Bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${barStyle}`} />

                <div className="relative z-10 flex flex-col gap-4">
                  
                  {/* Top Row: Main Info */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 mb-2">
                        <PriorityBadge priority={deal.priority} />
                      </div>
                      <button 
                        onClick={() => onSelectDeal(deal.id)}
                        className="text-base font-bold text-gray-900 dark:text-white hover:text-brand-primary dark:hover:text-blue-400 transition-colors text-left"
                      >
                        {deal.name}
                      </button>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                         <Building size={14} className="text-gray-400" />
                         {deal.companyName}
                         <span className="text-gray-300 dark:text-gray-700">•</span>
                         <User size={14} className="text-gray-400" />
                         {deal.contactName}
                      </p>
                    </div>

                    <div className="text-right pt-1">
                      <p className="text-lg font-bold text-gray-900 dark:text-white font-sans tracking-tight">
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: deal.currency, maximumFractionDigits: 0 }).format(deal.amount)}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gray-100 dark:bg-zinc-800" />

                  {/* Bottom Row: Context & Action */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mt-2">
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-0 flex-1 min-w-0">
                          
                          {/* Stage */}
                          <div className="flex-1 flex flex-col gap-1 sm:pr-4">
                              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider">Stage</span>
                              <div className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-200">
                                  <span className="text-gray-400 dark:text-gray-500 shrink-0">
                                      {getStageIcon(deal.stage)}
                                  </span>
                                  <span className="truncate font-medium">{deal.stage}</span>
                              </div>
                          </div>

                          {/* Divider */}
                          <div className="hidden sm:block w-px h-8 bg-gray-200 dark:bg-zinc-700" />

                          {/* Inactivity */}
                          <div className="flex-1 flex flex-col gap-1 sm:px-4">
                              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider">Inactivity</span>
                              <div className={`flex items-center gap-1.5 text-sm font-medium ${deal.daysInactive > 14 ? 'text-rose-600 dark:text-rose-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                  <Clock size={15} strokeWidth={1.5} className="shrink-0" />
                                  {deal.daysInactive}d
                              </div>
                          </div>

                          {/* Divider */}
                          <div className="hidden sm:block w-px h-8 bg-gray-200 dark:bg-zinc-700" />

                           {/* Next Step */}
                           <div className="flex-1 flex flex-col gap-1 sm:pl-4">
                                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider">Next Step</span>
                                <span className="text-sm text-gray-600 dark:text-gray-300 truncate" title={deal.nextStep || ''}>
                                    {deal.nextStep || '-'}
                                </span>
                            </div>
                      </div>

                      {/* Action */}
                      <button 
                          onClick={() => onSelectDeal(deal.id)}
                          className="btn-primary px-4 py-2 text-sm font-medium flex items-center justify-center gap-1.5 shrink-0 w-full sm:w-auto ml-0 sm:ml-4"
                      >
                          View Details <ChevronRight size={16} />
                      </button>

                  </div>
                </div>
              </div>
            );
          })
        ) : (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-full mb-4">
                    <Search size={32} strokeWidth={1} className="text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">No deals match your search</p>
                <button 
                    onClick={() => {setSearchQuery(''); setPriorityFilter('all');}}
                    className="text-brand-primary hover:underline text-sm font-medium mt-2"
                >
                    Clear filters
                </button>
            </div>
        )}
      </div>

      {/* Pagination Controls */}
      {filteredAndSortedDeals.length > ITEMS_PER_PAGE && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-zinc-800 mt-6">
            <span className="text-xs text-gray-500 dark:text-gray-400 order-2 sm:order-1">
                Showing <span className="font-medium text-gray-900 dark:text-white">{startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredAndSortedDeals.length)}</span> of <span className="font-medium text-gray-900 dark:text-white">{filteredAndSortedDeals.length}</span> deals
            </span>

            <div className="flex items-center gap-2 order-1 sm:order-2">
                <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-gray-600 dark:text-gray-300"
                >
                    <ChevronLeft size={16} />
                </button>

                <div className="px-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                    Page {currentPage} <span className="text-gray-400">/</span> {totalPages}
                </div>

                <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-gray-600 dark:text-gray-300"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
      )}
    </div>
  );
};