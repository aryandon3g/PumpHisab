import { motion } from 'motion/react';
import { Gauge, Calculator, History } from 'lucide-react';

interface HeaderProps {
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  historyCount: number;
}

export const Header = ({ showHistory, setShowHistory, historyCount }: HeaderProps) => (
  <header className="bg-white/80 border-b border-slate-200 sticky top-0 z-50 backdrop-blur-xl">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20"
        >
          <Gauge className="w-7 h-7 text-white" />
        </motion.div>
        <div className="hidden sm:block">
          <h1 className="text-xl font-display font-bold tracking-tight text-slate-900">Pump Hisab</h1>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">Professional Dashboard</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-6">
        <nav className="flex items-center bg-slate-100 p-1.5 rounded-2xl">
          <button 
            onClick={() => setShowHistory(false)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 btn-no-zoom ${
              !showHistory 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span className="hidden md:inline">Calculator</span>
          </button>
          <button 
            onClick={() => setShowHistory(true)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 btn-no-zoom ${
              showHistory 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <History className="w-4 h-4" />
            <span className="hidden md:inline">History</span>
            {historyCount > 0 && (
              <span className="ml-1 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                {historyCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </div>
  </header>
);
