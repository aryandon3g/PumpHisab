import { motion } from 'motion/react';
import { Gauge, Calculator, History } from 'lucide-react';

interface HeaderProps {
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  historyCount: number;
}

export const Header = ({ showHistory, setShowHistory, historyCount }: HeaderProps) => (
  <header className="sticky top-0 z-50 ios-blur border-b border-slate-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-11 h-11 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-900/10"
        >
          <Gauge className="w-6 h-6 text-white" />
        </motion.div>
        <div>
          <h1 className="text-lg font-display font-extrabold tracking-tight text-slate-900 leading-none">Pump Hisab</h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[9px] uppercase tracking-[0.25em] font-bold text-slate-400">Pro Dashboard</p>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <nav className="flex items-center bg-slate-100/80 p-1 rounded-2xl border border-slate-200/50">
          <button 
            onClick={() => setShowHistory(false)}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 btn-no-zoom ${
              !showHistory 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Calc</span>
          </button>
          <button 
            onClick={() => setShowHistory(true)}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 btn-no-zoom ${
              showHistory 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>History</span>
            {historyCount > 0 && (
              <span className="bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded-md min-w-[18px] text-center">
                {historyCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </div>
  </header>
);
