import React from 'react';
import { Deal } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, 
  PieChart, Pie, CartesianGrid 
} from 'recharts';
import { Activity, AlertTriangle, PauseCircle, TrendingUp, Clock, ArrowRight } from 'lucide-react';

interface InsightsViewProps {
  deals: Deal[];
  onSelectDeal: (id: string) => void;
}

// Custom Glass Tooltip Component
const CustomTooltip = ({ active, payload, label, prefix = '', suffix = '' }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-white/20 dark:border-white/10 p-3 rounded-lg shadow-xl text-xs z-50">
        <p className="font-bold text-gray-800 dark:text-white mb-1">{label}</p>
        <p className="text-gray-600 dark:text-gray-300 font-medium">
          {prefix}{payload[0].value.toLocaleString()}{suffix}
        </p>
      </div>
    );
  }
  return null;
};

export const InsightsView: React.FC<InsightsViewProps> = ({ deals, onSelectDeal }) => {
  // --- Metrics Calculation ---
  
  const totalInactiveValue = deals
    .filter(d => d.daysInactive > 7)
    .reduce((sum, d) => sum + d.amount, 0);
  
  const avgDaysInStage = Math.round(
    deals.reduce((sum, d) => sum + d.daysInStage, 0) / (deals.length || 1)
  );

  const highPriorityCount = deals.filter(d => d.priority === 'high').length;

  // --- Chart Data Preparation ---

  // 1. Value by Stage
  const dealsByStage = deals.reduce((acc, deal) => {
    acc[deal.stage] = (acc[deal.stage] || 0) + deal.amount;
    return acc;
  }, {} as Record<string, number>);

  const valueByStageData = Object.entries(dealsByStage).map(([stage, value]) => ({
    name: stage,
    value: value,
  }));

  // 2. Avg Inactive Days by Stage (Bottleneck Analysis)
  const inactiveDaysByStage = deals.reduce((acc, deal) => {
    if (!acc[deal.stage]) acc[deal.stage] = { totalDays: 0, count: 0 };
    acc[deal.stage].totalDays += deal.daysInactive;
    acc[deal.stage].count += 1;
    return acc;
  }, {} as Record<string, { totalDays: number, count: number }>);

  const bottleneckData = Object.entries(inactiveDaysByStage).map(([stage, data]) => ({
    name: stage,
    avgInactive: Math.round(data.totalDays / data.count),
  }));

  // 3. Health Distribution (Pie)
  // Strict Order: Healthy -> Stalled -> Critical
  const healthStats = {
    healthy: deals.filter(d => d.daysInactive <= 7).length,
    stalled: deals.filter(d => d.daysInactive > 7 && d.daysInactive <= 14).length,
    critical: deals.filter(d => d.daysInactive > 14).length,
  };

  const healthData = [
    { name: 'Healthy (<7d)', value: healthStats.healthy, color: '#6366f1' }, // Indigo-500
    { name: 'Stalled (7-14d)', value: healthStats.stalled, color: '#a5b4fc' }, // Indigo-300
    { name: 'Critical (>14d)', value: healthStats.critical, color: '#fb7185' }, // Rose-400
  ];

  const highPriorityDeals = deals.filter(d => d.priority === 'high');

  // Helper Component for KPI Cards with Liquid Icons
  const StatCard = ({ title, value, sub, icon: Icon, gradientFrom, gradientTo, iconColor }: any) => (
    <div className="glass-panel p-5 rounded-2xl flex items-start justify-between transition-all hover:translate-y-[-2px] group">
      <div>
        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{title}</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-white mt-2 tracking-tight">{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">{sub}</p>
      </div>
      <div className={`p-3 rounded-2xl shadow-sm border border-white/60 dark:border-white/10 bg-gradient-to-br ${gradientFrom} ${gradientTo} dark:from-slate-700 dark:to-slate-800 group-hover:shadow-md transition-all`}>
        <Icon size={20} strokeWidth={1.5} className={iconColor} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm rounded-xl border border-white/60 dark:border-white/10 shadow-sm">
          <TrendingUp size={24} strokeWidth={1.5} className="text-pastel-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Pipeline Insights</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Real-time analysis of your stalled opportunities.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard 
          title="Stalled Revenue"
          value={`$${totalInactiveValue.toLocaleString()}`}
          sub="Deals inactive > 7 days"
          icon={PauseCircle}
          gradientFrom="from-rose-50"
          gradientTo="to-rose-100"
          iconColor="text-rose-500 dark:text-rose-400"
        />
        <StatCard 
          title="Avg. Deal Velocity"
          value={`${avgDaysInStage} Days`}
          sub="Average time in current stage"
          icon={Activity}
          gradientFrom="from-blue-50"
          gradientTo="to-blue-100"
          iconColor="text-blue-500 dark:text-blue-400"
        />
        <StatCard 
          title="Attention Needed"
          value={highPriorityCount}
          sub="High priority active deals"
          icon={AlertTriangle}
          gradientFrom="from-amber-50"
          gradientTo="to-amber-100"
          iconColor="text-amber-500 dark:text-amber-400"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Value by Stage */}
        <div className="glass-panel p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-bold text-gray-800 dark:text-white">Revenue at Risk by Stage</h3>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={valueByStageData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }} barSize={16}>
                <CartesianGrid horizontal={false} strokeDasharray="3 3" strokeOpacity={0.1} />
                <XAxis 
                    type="number" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#9CA3AF' }}
                    tickFormatter={(val) => `$${(val/1000).toFixed(0)}k`}
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  width={100}
                  tick={{ fontSize: 11, fill: '#6B7280', fontWeight: 600 }}
                />
                <Tooltip content={<CustomTooltip prefix="$" />} cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} />
                {/* Linear Style: Sharper radius, monochromatic color */}
                <Bar dataKey="value" radius={[0, 2, 2, 0]} fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Bottleneck Analysis */}
        <div className="glass-panel p-6 rounded-2xl">
           <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-bold text-gray-800 dark:text-white">Bottleneck Analysis (Avg. Inactive Days)</h3>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bottleneckData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barSize={24}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.1} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#6B7280', fontWeight: 600 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#9CA3AF' }}
                />
                <Tooltip content={<CustomTooltip suffix=" days" />} cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} />
                <Bar dataKey="avgInactive" radius={[2, 2, 0, 0]}>
                   {bottleneckData.map((entry, index) => (
                    // Linear Style: Indigo for normal, Rose for critical
                    <Cell key={`cell-${index}`} fill={entry.avgInactive > 14 ? '#fb7185' : '#818cf8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Portfolio Health (Pie) */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center">
           <div className="w-full flex items-center justify-between mb-4">
             <h3 className="text-sm font-bold text-gray-800 dark:text-white">Deal Health Distribution</h3>
           </div>
           
           <div className="h-[240px] w-full flex items-center justify-center relative">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={healthData}
                   cx="50%"
                   cy="50%"
                   innerRadius={75} // Thinner ring
                   outerRadius={95}
                   paddingAngle={4}
                   dataKey="value"
                   cornerRadius={4}
                   stroke="none"
                   startAngle={90}
                   endAngle={-270}
                 >
                   {healthData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Pie>
                 <Tooltip content={<CustomTooltip />} />
               </PieChart>
             </ResponsiveContainer>
             
             {/* Center Label */}
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-gray-800 dark:text-white">{deals.length}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Total Deals</span>
             </div>
           </div>

           {/* Custom Legend */}
           <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-2">
             {healthData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                   <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}40` }} />
                   <div className="flex items-baseline gap-1.5">
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{item.name.split(' ')[0]}</span>
                      <span className="text-[10px] text-gray-400 font-medium">({item.value})</span>
                   </div>
                </div>
             ))}
           </div>
        </div>

        {/* Priority Focus List */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-sm font-bold text-gray-800 dark:text-white">Priority Focus</h3>
            <span className="bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
              {highPriorityDeals.length}
            </span>
          </div>
          
          <div className="space-y-2 flex-1 overflow-y-auto max-h-[260px] pr-2 custom-scrollbar">
            {highPriorityDeals.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                <Clock size={24} strokeWidth={1} className="mb-2 opacity-50"/>
                <p className="text-xs">No high priority deals.</p>
              </div>
            ) : (
              highPriorityDeals.map(deal => (
                <button 
                  key={deal.id} 
                  onClick={() => onSelectDeal(deal.id)}
                  className="w-full flex justify-between items-center p-3 hover:bg-white/50 dark:hover:bg-white/10 rounded-xl border border-transparent hover:border-white/60 dark:hover:border-white/10 transition-all group text-left"
                >
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{deal.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{deal.companyName}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-800 dark:text-gray-200">${(deal.amount / 1000).toFixed(0)}k</p>
                      <p className="text-[10px] text-rose-500 font-bold bg-rose-50/50 dark:bg-rose-900/30 px-1.5 py-0.5 rounded">{deal.daysInactive}d</p>
                    </div>
                    <ArrowRight size={14} strokeWidth={2} className="text-gray-300 dark:text-gray-600 group-hover:text-indigo-500 transition-colors" />
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};