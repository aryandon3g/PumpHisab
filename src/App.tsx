import { useState, useEffect, useMemo, ChangeEvent, useCallback } from 'react';
import { 
  Trash2, 
  RotateCcw, 
  Save, 
  Gauge, 
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Calculator,
  Share2,
  History,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ShiftRecord } from './types';
import { Header } from './components/Header';
import { StatsGrid } from './components/StatsGrid';
import { HistoryCard } from './components/HistoryCard';
import { MobileActionBar } from './components/MobileActionBar';
import { IndianRupee, Droplet } from 'lucide-react';
import { CashCounter } from './components/CashCounter';
import { StandardCalculator } from './components/StandardCalculator';

export default function App() {
  const [rate, setRate] = useState<string>('');
  const [openingMeter, setOpeningMeter] = useState<string>('');
  const [closingMeter, setClosingMeter] = useState<string>('');
  const [collected, setCollected] = useState<string>('');
  
  const [history, setHistory] = useState<ShiftRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isCashCounterOpen, setIsCashCounterOpen] = useState(false);
  const [isStandardCalculatorOpen, setIsStandardCalculatorOpen] = useState(false);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('pump_hisab_history_v2');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history');
      }
    }
  }, []);

  // Save history when updated
  useEffect(() => {
    localStorage.setItem('pump_hisab_history_v2', JSON.stringify(history));
  }, [history]);

  const handleNumberInput = useCallback((setter: (val: string) => void) => (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      setter(val);
    }
  }, []);

  const stats = useMemo(() => {
    const numRate = parseFloat(rate) || 0;
    const numOpening = parseFloat(openingMeter) || 0;
    const numClosing = parseFloat(closingMeter) || 0;
    const numCollected = parseFloat(collected) || 0;
    
    const volume = Math.max(0, numClosing - numOpening);
    const expected = numRate * volume;
    const difference = numCollected - expected;
    
    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    const todayRecords = history.filter(r => r.date.includes(today));
    const totalVolumeToday = todayRecords.reduce((acc, r) => acc + r.volume, 0);
    const totalRevenueToday = todayRecords.reduce((acc, r) => acc + r.collected, 0);

    return {
      numRate,
      numOpening,
      numClosing,
      numCollected,
      volume,
      expected,
      difference,
      totalVolumeToday,
      totalRevenueToday,
      isValid: numRate > 0 && numClosing >= numOpening && numClosing > 0
    };
  }, [rate, openingMeter, closingMeter, collected, history]);

  const { volume, expected, difference, isValid, totalVolumeToday, totalRevenueToday } = stats;

  const isShort = difference < -0.01;
  const isExcess = difference > 0.01;

  const handleReset = useCallback(() => {
    setRate('');
    setOpeningMeter('');
    setClosingMeter('');
    setCollected('');
  }, []);

  const handleSave = useCallback(() => {
    if (!isValid) return;

    const newRecord: ShiftRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleString('en-IN', {
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
      }),
      rate: stats.numRate,
      opening: stats.numOpening,
      closing: stats.numClosing,
      volume: volume,
      expected: expected,
      collected: stats.numCollected,
      difference: difference,
    };

    setHistory(prev => [newRecord, ...prev]);
    handleReset();
  }, [isValid, stats, volume, expected, difference, handleReset]);

  const clearHistory = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      setHistory([]);
    }
  }, []);

  const handleShare = useCallback((record: ShiftRecord | any) => {
    const text = `*Pump Hisab Report*\n` +
      `Date: ${record.date}\n` +
      `Volume: ${record.volume.toFixed(2)} Ltr\n` +
      `Rate: ₹${record.rate}/L\n` +
      `Expected: ₹${record.expected.toFixed(2)}\n` +
      `Collected: ₹${record.collected.toFixed(2)}\n` +
      `Difference: ${record.difference < 0 ? '-' : '+'}${Math.abs(record.difference).toFixed(2)} ₹\n` +
      `Status: ${record.difference < -0.01 ? 'Shortage' : record.difference > 0.01 ? 'Excess' : 'Perfect'}`;

    if (navigator.share) {
      navigator.share({
        title: 'Pump Hisab Report',
        text: text,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text);
      alert('Report copied to clipboard!');
    }
  }, []);

  const handleApplyCash = (total: number) => {
    setCollected(total.toString());
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100">
      <Header 
        showHistory={showHistory} 
        setShowHistory={setShowHistory} 
        historyCount={history.length} 
      />

      <main className="max-w-7xl mx-auto p-3 sm:p-6 lg:p-8 pb-32">
        {!showHistory && (
          <StatsGrid 
            totalVolumeToday={totalVolumeToday} 
            totalRevenueToday={totalRevenueToday} 
            historyLength={history.length} 
          />
        )}

        <AnimatePresence mode="wait">
          {!showHistory ? (
            <motion.div 
              key="calculator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8"
            >
              {/* Left Column: Inputs */}
              <div className="lg:col-span-7 space-y-3 sm:space-y-8">
                <div className="flex items-center gap-2 px-1">
                  <div className="w-1 h-4 bg-slate-900 rounded-full" />
                  <h2 className="text-[10px] font-display font-extrabold text-slate-800 uppercase tracking-wider">Shift Configuration</h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-6">
                  {/* Rate Card */}
                  <motion.div 
                    whileHover={{ y: -2 }}
                    className="neo-card p-3 sm:p-8 group focus-within:border-slate-300 transition-all"
                  >
                    <label className="block text-[7px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Rate (₹/L)</label>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 sm:w-14 sm:h-14 bg-slate-50 rounded-lg sm:rounded-xl flex items-center justify-center text-slate-400 group-focus-within:bg-slate-900 group-focus-within:text-white transition-all duration-300">
                        <IndianRupee className="w-3.5 h-3.5 sm:w-7 sm:h-7" />
                      </div>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={rate}
                        onChange={handleNumberInput(setRate)}
                        className="flex-1 text-lg sm:text-4xl font-display font-extrabold outline-none placeholder:text-slate-200 bg-transparent btn-no-zoom"
                        placeholder="0.0"
                      />
                    </div>
                  </motion.div>

                  {/* Collected Card */}
                  <motion.div 
                    whileHover={{ y: -2 }}
                    className="neo-card p-3 sm:p-8 group focus-within:border-slate-300 transition-all relative"
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <label className="block text-[7px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Collected (₹)</label>
                      <button 
                        onClick={() => setIsCashCounterOpen(true)}
                        className="p-1 bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200 transition-colors"
                      >
                        <Calculator className="w-2.5 h-2.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 sm:w-14 sm:h-14 bg-slate-50 rounded-lg sm:rounded-xl flex items-center justify-center text-slate-400 group-focus-within:bg-slate-900 group-focus-within:text-white transition-all duration-300">
                        <IndianRupee className="w-3.5 h-3.5 sm:w-7 sm:h-7" />
                      </div>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={collected}
                        onChange={handleNumberInput(setCollected)}
                        className="flex-1 text-lg sm:text-4xl font-display font-extrabold outline-none placeholder:text-slate-200 bg-transparent btn-no-zoom"
                        placeholder="0.0"
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Meter Section */}
                <div className="neo-card p-3 sm:p-10 space-y-3 sm:space-y-10 relative overflow-hidden">
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-slate-900 rounded-md flex items-center justify-center text-white shadow-lg">
                        <Gauge className="w-3 h-3" />
                      </div>
                      <div>
                        <label className="text-[9px] font-display font-extrabold text-slate-800 uppercase tracking-wider leading-none">Meter Readings</label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative z-10 grid grid-cols-11 items-center gap-2 sm:gap-6">
                    <div className="col-span-5 space-y-1">
                      <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest ml-1">Opening</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={openingMeter}
                        onChange={handleNumberInput(setOpeningMeter)}
                        className="w-full bg-slate-50 px-2 py-1.5 sm:px-8 sm:py-6 rounded-lg sm:rounded-[1.5rem] text-xs sm:text-3xl font-display font-extrabold outline-none focus:bg-white border-2 border-transparent focus:border-slate-200 transition-all btn-no-zoom"
                        placeholder="0.0"
                      />
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <ArrowRight className="w-2.5 h-2.5 text-slate-300" />
                    </div>
                    <div className="col-span-5 space-y-1">
                      <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest ml-1">Closing</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={closingMeter}
                        onChange={handleNumberInput(setClosingMeter)}
                        className="w-full bg-slate-50 px-2 py-1.5 sm:px-8 sm:py-6 rounded-lg sm:rounded-[1.5rem] text-xs sm:text-3xl font-display font-extrabold outline-none focus:bg-white border-2 border-transparent focus:border-slate-200 transition-all btn-no-zoom"
                        placeholder="0.0"
                      />
                    </div>
                  </div>

                  <div className="relative z-10 pt-2 sm:pt-8 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-slate-50 rounded-md flex items-center justify-center text-slate-400">
                        <Droplet className="w-3 h-3" />
                      </div>
                      <div>
                        <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Volume</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <motion.span 
                        key={volume}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-lg sm:text-5xl font-display font-extrabold text-slate-900"
                      >
                        {volume.toFixed(2)}
                      </motion.span>
                      <span className="text-[8px] font-bold text-slate-400 ml-0.5 uppercase tracking-widest">Ltr</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Summary */}
              <div className="lg:col-span-5 space-y-3 sm:space-y-8">
                <div className="flex items-center gap-2 px-1">
                  <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                  <h2 className="text-[10px] font-display font-extrabold text-slate-800 uppercase tracking-wider">Live Analytics</h2>
                </div>

                <div className="space-y-3 sm:space-y-6 sticky top-28">
                  {/* Expected Amount Card */}
                  <motion.div 
                    layout
                    className="bg-slate-900 rounded-[1.5rem] sm:rounded-[2.5rem] p-4 sm:p-10 text-white shadow-2xl shadow-slate-900/10 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                    
                    <div className="relative z-10 space-y-3 sm:space-y-8">
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">Expected Revenue</p>
                          <motion.h3 
                            key={expected}
                            initial={{ y: 5, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-2xl sm:text-5xl font-display font-extrabold tracking-tight"
                          >
                            ₹{expected.toLocaleString('en-IN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                          </motion.h3>
                        </div>
                        <div className="bg-white/10 p-2 sm:p-4 rounded-xl backdrop-blur-xl border border-white/10">
                          <TrendingUp className="w-5 h-5 sm:w-8 sm:h-8 text-emerald-400" />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 text-[8px] font-bold text-slate-400 uppercase tracking-widest pt-2 border-t border-white/5">
                        <div className="flex items-center gap-1">
                          <div className="w-1 h-1 rounded-full bg-emerald-400" />
                          Live
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-1 h-1 rounded-full bg-blue-400" />
                          {volume.toFixed(1)}L Sold
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Difference Status Card */}
                  <motion.div 
                    layout
                    className={`rounded-[1.5rem] sm:rounded-[2.5rem] p-4 sm:p-10 border transition-all duration-500 relative overflow-hidden ${
                    !isValid ? 'bg-white border-slate-100 opacity-60' :
                    isShort ? 'bg-red-50 border-red-100' : 
                    isExcess ? 'bg-emerald-50 border-emerald-100' : 
                    'bg-blue-50 border-blue-100'
                  }`}>
                    <div className="flex justify-between items-center mb-3 sm:mb-8">
                      <div className="flex items-center gap-2 sm:gap-4">
                        <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl flex items-center justify-center ${
                          isShort ? 'bg-red-100 text-red-600' : 
                          isExcess ? 'bg-emerald-100 text-emerald-600' : 
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {isShort ? <AlertCircle className="w-5 h-5 sm:w-8 sm:h-8" /> : 
                           isExcess ? <TrendingUp className="w-5 h-5 sm:w-8 sm:h-8" /> : 
                           <CheckCircle2 className="w-5 h-5 sm:w-8 sm:h-8" />}
                        </div>
                        <div>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Status</p>
                          <span className={`text-[10px] sm:text-sm font-bold uppercase tracking-widest ${
                            isShort ? 'text-red-600' : isExcess ? 'text-emerald-600' : 'text-blue-600'
                          }`}>
                            {isShort ? 'Shortage' : isExcess ? 'Excess' : 'Perfect'}
                          </span>
                        </div>
                      </div>
                      {isValid && (
                        <button 
                          onClick={() => handleShare({
                            date: new Date().toLocaleString('en-IN'),
                            volume,
                            rate: stats.numRate,
                            expected,
                            collected: stats.numCollected,
                            difference
                          })}
                          className="p-2 bg-white/50 hover:bg-white rounded-lg text-slate-600 transition-all border border-slate-200/50"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    
                    <div className="flex items-baseline gap-1">
                      <motion.span 
                        key={difference}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`text-3xl sm:text-6xl font-display font-extrabold tracking-tighter ${
                        isShort ? 'text-red-600' : isExcess ? 'text-emerald-600' : 'text-blue-600'
                      }`}>
                        {isShort ? '-' : isExcess ? '+' : ''}₹{Math.abs(difference).toFixed(1)}
                      </motion.span>
                    </div>
                  </motion.div>

                  {/* Quick Actions (Desktop Only) */}
                  <div className="hidden lg:flex gap-4 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleReset}
                      className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 text-sm btn-no-zoom"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </motion.button>
                    <motion.button
                      whileHover={isValid ? { scale: 1.02 } : {}}
                      whileTap={isValid ? { scale: 0.98 } : {}}
                      onClick={handleSave}
                      disabled={!isValid}
                      className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-bold disabled:opacity-30 transition-all shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2 text-sm btn-no-zoom"
                    >
                      <Save className="w-5 h-5" />
                      Save Record
                    </motion.button>
                  </div>
                </div>
              </div>

              <MobileActionBar 
                isValid={isValid} 
                handleReset={handleReset} 
                handleSave={handleSave} 
                handleShare={() => handleShare({
                  date: new Date().toLocaleString('en-IN'),
                  volume,
                  rate: stats.numRate,
                  expected,
                  collected: stats.numCollected,
                  difference
                })}
              />
            </motion.div>
          ) : (
            <motion.div 
              key="history"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                    <History className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-extrabold text-slate-900">Shift History</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">All Saved Records</p>
                  </div>
                </div>
                {history.length > 0 && (
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={clearHistory}
                    className="text-[10px] font-bold text-red-500 hover:bg-red-50 px-5 py-3 rounded-xl transition-all flex items-center justify-center gap-2 border border-red-100 uppercase tracking-widest btn-no-zoom"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </motion.button>
                )}
              </div>

              {history.length === 0 ? (
                <div className="text-center py-32 neo-card border-dashed">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <History className="w-10 h-10 text-slate-200" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-slate-900">No records found</h3>
                  <p className="text-xs text-slate-400 mt-2 max-w-[240px] mx-auto font-medium">Your saved shift calculations will appear here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {history.map((record) => (
                    <HistoryCard key={record.id} record={record} onShare={handleShare} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <CashCounter 
          isOpen={isCashCounterOpen}
          onClose={() => setIsCashCounterOpen(false)}
          onApply={handleApplyCash}
        />

        <StandardCalculator 
          isOpen={isStandardCalculatorOpen}
          onClose={() => setIsStandardCalculatorOpen(false)}
        />

        {/* Floating Calculator Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsStandardCalculatorOpen(true)}
          className="fixed bottom-24 right-4 lg:bottom-8 lg:right-8 w-12 h-12 bg-slate-900 text-white rounded-xl shadow-2xl flex items-center justify-center z-50 hover:bg-slate-800 transition-colors"
        >
          <Calculator className="w-5 h-5" />
        </motion.button>
      </main>
    </div>
  );
}
