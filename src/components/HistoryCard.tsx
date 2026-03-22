import React from 'react';
import { motion } from 'motion/react';
import { Calendar, ArrowRight } from 'lucide-react';
import { ShiftRecord } from '../types';

interface HistoryCardProps {
  record: ShiftRecord;
}

export const HistoryCard = React.memo(({ record }: HistoryCardProps) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ y: -8 }}
    className="bg-white p-10 rounded-[3rem] neo-shadow border border-slate-100 group hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
  >
    <div className="flex justify-between items-start mb-10">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          <Calendar className="w-3.5 h-3.5" />
          {record.date}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-display font-bold text-slate-900">{record.volume.toFixed(2)} Ltr</span>
        </div>
      </div>
      <div className={`px-6 py-4 rounded-[1.25rem] font-display font-bold text-2xl shadow-sm border ${
        record.difference < -0.01 ? 'bg-red-50 text-red-600 border-red-100' : 
        record.difference > 0.01 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
        'bg-blue-50 text-blue-600 border-blue-100'
      }`}>
        {record.difference < -0.01 ? '-' : record.difference > 0.01 ? '+' : ''}
        ₹{Math.abs(record.difference).toFixed(2)}
      </div>
    </div>
    
    <div className="space-y-5 pt-8 border-t border-slate-50">
      <div className="flex justify-between items-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Meter Range</p>
        <p className="text-sm font-bold text-slate-700 bg-slate-50 px-3 py-1 rounded-lg">{record.opening} <ArrowRight className="inline w-3 h-3 mx-1 text-slate-300" /> {record.closing}</p>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Rate</p>
        <p className="text-sm font-bold text-slate-700">₹{record.rate}/L</p>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Revenue</p>
        <p className="text-sm font-bold text-slate-700">₹{record.collected.toLocaleString('en-IN')} / ₹{record.expected.toLocaleString('en-IN')}</p>
      </div>
    </div>
  </motion.div>
));

HistoryCard.displayName = 'HistoryCard';
