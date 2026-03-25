import { Droplet, IndianRupee, History, Calendar } from 'lucide-react';

interface StatsGridProps {
  totalVolumeToday: number;
  totalRevenueToday: number;
  historyLength: number;
}

export const StatsGrid = ({ totalVolumeToday, totalRevenueToday, historyLength }: StatsGridProps) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-10">
    <div className="neo-card p-4 sm:p-6 flex items-center gap-3 sm:gap-4">
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-blue-600">
        <Droplet className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <div>
        <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Today's Vol</p>
        <p className="text-sm sm:text-xl font-display font-extrabold">{totalVolumeToday.toFixed(1)}L</p>
      </div>
    </div>
    <div className="neo-card p-4 sm:p-6 flex items-center gap-3 sm:gap-4">
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-emerald-600">
        <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <div>
        <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Today's Rev</p>
        <p className="text-sm sm:text-xl font-display font-extrabold">₹{totalRevenueToday.toLocaleString('en-IN')}</p>
      </div>
    </div>
    <div className="neo-card p-4 sm:p-6 flex items-center gap-3 sm:gap-4">
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-slate-600">
        <History className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <div>
        <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Records</p>
        <p className="text-sm sm:text-xl font-display font-extrabold">{historyLength}</p>
      </div>
    </div>
    <div className="neo-card p-4 sm:p-6 flex items-center gap-3 sm:gap-4">
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-amber-600">
        <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <div>
        <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
        <p className="text-sm sm:text-xl font-display font-extrabold">Online</p>
      </div>
    </div>
  </div>
);
