import { Droplet, IndianRupee, History, Calendar } from 'lucide-react';

interface StatsGridProps {
  totalVolumeToday: number;
  totalRevenueToday: number;
  historyLength: number;
}

export const StatsGrid = ({ totalVolumeToday, totalRevenueToday, historyLength }: StatsGridProps) => (
  <div className="hidden lg:grid grid-cols-4 gap-6 mb-10">
    <div className="bg-white p-6 rounded-3xl border border-slate-100 neo-shadow flex items-center gap-4">
      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
        <Droplet className="w-6 h-6" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Today's Volume</p>
        <p className="text-xl font-display font-bold">{totalVolumeToday.toFixed(2)} Ltr</p>
      </div>
    </div>
    <div className="bg-white p-6 rounded-3xl border border-slate-100 neo-shadow flex items-center gap-4">
      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
        <IndianRupee className="w-6 h-6" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Today's Revenue</p>
        <p className="text-xl font-display font-bold">₹{totalRevenueToday.toLocaleString('en-IN')}</p>
      </div>
    </div>
    <div className="bg-white p-6 rounded-3xl border border-slate-100 neo-shadow flex items-center gap-4">
      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600">
        <History className="w-6 h-6" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Records</p>
        <p className="text-xl font-display font-bold">{historyLength}</p>
      </div>
    </div>
    <div className="bg-white p-6 rounded-3xl border border-slate-100 neo-shadow flex items-center gap-4">
      <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
        <Calendar className="w-6 h-6" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Status</p>
        <p className="text-xl font-display font-bold">Online</p>
      </div>
    </div>
  </div>
);
