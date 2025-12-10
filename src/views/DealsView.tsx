import React, { useState, useMemo, useEffect } from 'react';
import { Deal, Priority } from '../types';
import { 
  Search, ArrowUpDown, 
  ChevronLeft, ChevronRight
} from 'lucide-react';

interface DealsViewProps {
  deals: Deal[];
  onSelectDeal: (dealId: string) => void;
}

const ITEMS_PER_PAGE = 12;

const PriorityBadge = ({ priority }: { priority: Priority }) => {
  const styles = {
    high: 'text-orange-600 bg-orange-50/50 border-orange-200/60 dark:text-orange-400 dark:bg-orange-500/10 dark:border-orange-500/20',
    medium: 'text-amber-600 bg-amber-50/50 border-amber-200/60 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20',
    low: 'text-slate-500 bg-slate-100/50 border-slate-200/60 dark:text-slate-400 dark:bg-slate-800/40 dark:border-slate-700/50',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-medium uppercase tracking-wide ${styles[priority]}`}>
      {priority}
    </span>
  );
};

const StageBadge = ({ stage }: { stage: string }) => {
    let colorClass = 'bg-zinc-400';
    if (stage.toLowerCase().includes('won') || stage.toLowerCase().includes('qualified')) colorClass = 'bg-emerald-500';
    else if (stage.toLowerCase().includes('negotiation')) colorClass = 'bg-indigo-500';
    else if (stage.toLowerCase().includes('proposal')) colorClass = 'bg-blue-500';
    else if (stage.toLowerCase().includes('evaluation')) colorClass = 'bg-amber-500';

    return (
        <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full shadow-sm ${colorClass}`} />
            <span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">{stage}</span>
        </div>
    );
};

export const DealsView: React.FC<DealsViewProps> = ({ deals, onSelectDeal }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'all' | Priority>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'inactive' | 'amount' | 'name'>('priority');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, priorityFilter, sortBy, sortDirection]);

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
      let comparison = 0;
      switch (sortBy) {
        case 'priority':
          const pMap = { high: 3, medium: 2, low: 1 };
          comparison = pMap[a.priority] - pMap[b.priority];
          break;
        case 'inactive': 
          comparison = a.daysInactive - b.daysInactive;
          break;
        case 'amount': 
          comparison = a.amount - b.amount;
          break;
        case 'name': 
          comparison = a.name.localeCompare(b.name);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [deals, searchQuery, priorityFilter, sortBy, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedDeals.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedDeals = filteredAndSortedDeals.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc'); // Default to desc for most metrics
    }
  };

  const SortIcon = ({ field }: { field: typeof sortBy }) => {
    if (sortBy !== field) return null;
    return <ArrowUpDown size={12} className={`ml-1 inline-block transition-transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />;
  };

  return (
    <div className="flex flex-col h-full animate-fade-in pb-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white tracking-tight">Deals</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
             {filteredAndSortedDeals.length} opportunities requiring attention.
          </p>
        </div>

        <div className="flex items-center gap-3">
             <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input 
                    type="text" 
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 w-full sm:w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md text-sm text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all shadow-sm"
                />
            </div>
            
            <div className="flex bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md p-0.5">
                {(['all', 'high', 'medium', 'low'] as const).map((p) => (
                    <button
                        key={p}
                        onClick={() => setPriorityFilter(p)}
                        className={`px-3 py-1 text-xs font-medium rounded-sm capitalize transition-all ${
                            priorityFilter === p 
                                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' 
                                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                        }`}
                    >
                        {p}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* Linear Style List */}
      <div className="bg-white dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm overflow-hidden flex flex-col flex-1 min-h-0">
          
          {/* List Header */}
          <div className="grid grid-cols-[minmax(200px,2fr)_minmax(120px,1fr)_120px_100px_100px_40px] gap-4 px-5 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider select-none">
              <div onClick={() => handleSort('name')} className="cursor-pointer hover:text-zinc-800 dark:hover:text-zinc-200 flex items-center">
                  Deal / Company <SortIcon field="name" />
              </div>
              <div className="flex items-center">Stage</div>
              <div onClick={() => handleSort('amount')} className="cursor-pointer hover:text-zinc-800 dark:hover:text-zinc-200 text-right block">
                  Value <SortIcon field="amount" />
              </div>
              <div onClick={() => handleSort('priority')} className="cursor-pointer hover:text-zinc-800 dark:hover:text-zinc-200 flex items-center justify-center">
                  Priority <SortIcon field="priority" />
              </div>
              <div onClick={() => handleSort('inactive')} className="cursor-pointer hover:text-zinc-800 dark:hover:text-zinc-200 text-right block">
                  Inactive <SortIcon field="inactive" />
              </div>
              <div aria-hidden="true"></div>
          </div>

          {/* List Rows */}
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50 overflow-y-auto flex-1 bg-white dark:bg-[#111]">
              {paginatedDeals.length > 0 ? (
                paginatedDeals.map((deal) => (
                    <div 
                        key={deal.id}
                        onClick={() => onSelectDeal(deal.id)}
                        className="group grid grid-cols-[minmax(200px,2fr)_minmax(120px,1fr)_120px_100px_100px_40px] gap-4 px-5 py-3 items-center hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors cursor-pointer text-sm"
                    >
                        <div className="min-w-0 pr-4">
                            <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate">{deal.name}</div>
                            <div className="text-zinc-500 text-xs truncate mt-0.5">{deal.companyName} • {deal.contactName}</div>
                        </div>

                        <div className="min-w-0">
                            <StageBadge stage={deal.stage} />
                            {deal.nextStep && (
                                <div className="text-[11px] text-zinc-400 mt-1 truncate" title={deal.nextStep}>
                                    → {deal.nextStep}
                                </div>
                            )}
                        </div>

                        <div className="text-right font-medium text-zinc-700 dark:text-zinc-300 tabular-nums">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: deal.currency, maximumFractionDigits: 0 }).format(deal.amount)}
                        </div>

                        <div className="flex justify-center">
                            <PriorityBadge priority={deal.priority} />
                        </div>

                        <div className="text-right">
                             <span className={`tabular-nums font-medium ${deal.daysInactive > 14 ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-600 dark:text-zinc-400'}`}>
                                {deal.daysInactive}d
                             </span>
                        </div>

                        <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight size={16} className="text-zinc-400" />
                        </div>
                    </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                    <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center mb-3">
                        <Search size={20} />
                    </div>
                    <p className="text-sm">No matching deals found</p>
                    <button 
                        onClick={() => {setSearchQuery(''); setPriorityFilter('all');}}
                        className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-2 hover:underline"
                    >
                        Clear filters
                    </button>
                </div>
              )}
          </div>

          {/* Pagination Footer */}
          <div className="px-5 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 flex items-center justify-between text-xs">
               <span className="text-zinc-500 dark:text-zinc-400">
                   Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredAndSortedDeals.length)} of {filteredAndSortedDeals.length}
               </span>
               <div className="flex items-center gap-1">
                   <button
                       onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                       disabled={currentPage === 1}
                       className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-zinc-600 dark:text-zinc-300"
                   >
                       <ChevronLeft size={14} />
                   </button>
                   <span className="px-2 font-medium text-zinc-700 dark:text-zinc-300">
                       {currentPage}
                   </span>
                   <button
                       onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                       disabled={currentPage === totalPages || totalPages === 0}
                       className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-zinc-600 dark:text-zinc-300"
                   >
                       <ChevronRight size={14} />
                   </button>
               </div>
          </div>
      </div>
    </div>
  );
};
