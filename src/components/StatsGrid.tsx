import { Droplet, IndianRupee, History, Calendar } from 'lucide-react';

interface StatsGridProps {
  totalVolumeToday: number;
  totalRevenueToday: number;
  historyLength: number;
}

export const StatsGrid = ({ totalVolumeToday, totalRevenueToday, historyLength }: StatsGridProps) => (
  <div className="grid grid-cols-4 gap-2 mb-4">
    <div className="neo-card p-2 flex flex-col items-center text-center">
      <div className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-1">
        <Droplet className="w-3 h-3" />
      </div>
      <p className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">Vol</p>
      <p className="text-[10px] font-display font-extrabold truncate w-full">{totalVolumeToday.toFixed(1)}L</p>
    </div>
    <div className="neo-card p-2 flex flex-col items-center text-center">
      <div className="w-6 h-6 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 mb-1">
        <IndianRupee className="w-3 h-3" />
      </div>
      <p className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">Rev</p>
      <p className="text-[10px] font-display font-extrabold truncate w-full">₹{totalRevenueToday > 9999 ? (totalRevenueToday/1000).toFixed(1) + 'k' : totalRevenueToday}</p>
    </div>
    <div className="neo-card p-2 flex flex-col items-center text-center">
      <div className="w-6 h-6 bg-slate-50 rounded-lg flex items-center justify-center text-slate-600 mb-1">
        <History className="w-3 h-3" />
      </div>
      <p className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">Rec</p>
      <p className="text-[10px] font-display font-extrabold truncate w-full">{historyLength}</p>
    </div>
    <div className="neo-card p-2 flex flex-col items-center text-center">
      <div className="w-6 h-6 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 mb-1">
        <Calendar className="w-3 h-3" />
      </div>
      <p className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">Stat</p>
      <p className="text-[10px] font-display font-extrabold truncate w-full">Live</p>
    </div>
  </div>
);
