/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { 
  Droplet, 
  IndianRupee, 
  History, 
  Trash2, 
  RotateCcw, 
  Save, 
  Gauge, 
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Calendar,
  Calculator,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ShiftRecord {
  id: string;
  date: string;
  rate: number;
  opening: number;
  closing: number;
  volume: number;
  expected: number;
  collected: number;
  difference: number;
}

export default function App() {
  const [rate, setRate] = useState<string>('');
  const [openingMeter, setOpeningMeter] = useState<string>('');
  const [closingMeter, setClosingMeter] = useState<string>('');
  const [collected, setCollected] = useState<string>('');
  
  const [history, setHistory] = useState<ShiftRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);

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

  const handleNumberInput = (setter: (val: string) => void) => (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      setter(val);
    }
  };

  const stats = useMemo(() => {
    const numRate = parseFloat(rate) || 0;
    const numOpening = parseFloat(openingMeter) || 0;
    const numClosing = parseFloat(closingMeter) || 0;
    const numCollected = parseFloat(collected) || 0;
    
    const volume = Math.max(0, numClosing - numOpening);
    const expected = numRate * volume;
    const difference = numCollected - expected;
    
    // Calculate daily totals for dashboard feel
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
  const isExact = Math.abs(difference) <= 0.01 && expected > 0;

  const handleSave = () => {
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

    setHistory([newRecord, ...history]);
    handleReset();
  };

  const handleReset = () => {
    setRate('');
    setOpeningMeter('');
    setClosingMeter('');
    setCollected('');
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      {/* Responsive Header */}
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
                {history.length > 0 && (
                  <span className="ml-1 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                    {history.length}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pb-32">
        {/* Dashboard Quick Stats (Desktop Only) */}
        {!showHistory && (
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
                <p className="text-xl font-display font-bold">{history.length}</p>
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
        )}

        <AnimatePresence mode="wait">
          {!showHistory ? (
            <motion.div 
              key="calculator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Left Column: Inputs */}
              <div className="lg:col-span-7 space-y-8">
                <div className="flex items-center gap-3 px-1">
                  <div className="w-2 h-6 bg-blue-600 rounded-full" />
                  <h2 className="text-lg font-display font-bold text-slate-800">Shift Configuration</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Rate Card */}
                  <motion.div 
                    whileHover={{ y: -4 }}
                    className="bg-white p-8 rounded-[2rem] neo-shadow-lg border border-slate-100 group focus-within:border-blue-400 transition-all"
                  >
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">Current Rate (₹/Ltr)</label>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-focus-within:bg-blue-600 group-focus-within:text-white transition-all duration-300">
                        <IndianRupee className="w-7 h-7" />
                      </div>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={rate}
                        onChange={handleNumberInput(setRate)}
                        className="flex-1 text-4xl font-display font-bold outline-none placeholder:text-slate-200 bg-transparent"
                        placeholder="0.00"
                      />
                    </div>
                  </motion.div>

                  {/* Collected Card */}
                  <motion.div 
                    whileHover={{ y: -4 }}
                    className="bg-white p-8 rounded-[2rem] neo-shadow-lg border border-slate-100 group focus-within:border-emerald-400 transition-all"
                  >
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">Cash Collected (₹)</label>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-focus-within:bg-emerald-600 group-focus-within:text-white transition-all duration-300">
                        <IndianRupee className="w-7 h-7" />
                      </div>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={collected}
                        onChange={handleNumberInput(setCollected)}
                        className="flex-1 text-4xl font-display font-bold outline-none placeholder:text-slate-200 bg-transparent"
                        placeholder="0.00"
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Meter Section */}
                <div className="bg-white p-10 rounded-[3rem] neo-shadow-lg border border-slate-100 space-y-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
                  
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <Gauge className="w-6 h-6" />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-slate-800 uppercase tracking-wider">Meter Readings</label>
                        <p className="text-xs text-slate-400 font-medium">Enter opening and closing values</p>
                      </div>
                    </div>
                    <div className="hidden sm:flex px-4 py-1.5 bg-blue-50 rounded-full text-[10px] font-bold text-blue-600 uppercase tracking-widest border border-blue-100">Automatic Calculation</div>
                  </div>
                  
                  <div className="relative z-10 grid grid-cols-1 sm:grid-cols-11 items-center gap-6">
                    <div className="sm:col-span-5 space-y-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Opening Reading</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={openingMeter}
                        onChange={handleNumberInput(setOpeningMeter)}
                        className="w-full bg-slate-50 px-8 py-6 rounded-[1.5rem] text-3xl font-display font-bold outline-none focus:ring-8 focus:ring-blue-500/5 focus:bg-white border-2 border-transparent focus:border-blue-100 transition-all"
                        placeholder="0000.0"
                      />
                    </div>
                    <div className="sm:col-span-1 flex justify-center">
                      <div className="w-12 h-12 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center">
                        <ArrowRight className="w-6 h-6 text-slate-300" />
                      </div>
                    </div>
                    <div className="sm:col-span-5 space-y-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Closing Reading</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={closingMeter}
                        onChange={handleNumberInput(setClosingMeter)}
                        className="w-full bg-slate-50 px-8 py-6 rounded-[1.5rem] text-3xl font-display font-bold outline-none focus:ring-8 focus:ring-blue-500/5 focus:bg-white border-2 border-transparent focus:border-blue-100 transition-all"
                        placeholder="0000.0"
                      />
                    </div>
                  </div>

                  <div className="relative z-10 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-blue-50 rounded-[1.25rem] flex items-center justify-center text-blue-600 shadow-inner">
                        <Droplet className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Calculated Volume</p>
                        <p className="text-base font-bold text-slate-600">Total Liters Sold</p>
                      </div>
                    </div>
                    <div className="text-center sm:text-right">
                      <motion.span 
                        key={volume}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-5xl font-display font-bold text-slate-900"
                      >
                        {volume.toFixed(2)}
                      </motion.span>
                      <span className="text-xl font-bold text-slate-400 ml-3">Ltr</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Summary */}
              <div className="lg:col-span-5 space-y-8">
                <div className="flex items-center gap-3 px-1">
                  <div className="w-2 h-6 bg-emerald-500 rounded-full" />
                  <h2 className="text-lg font-display font-bold text-slate-800">Live Analytics</h2>
                </div>

                <div className="space-y-6 sticky top-28">
                  {/* Expected Amount Card */}
                  <motion.div 
                    layout
                    className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-slate-300 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/20 rounded-full -mr-36 -mt-36 blur-[100px] group-hover:bg-blue-500/30 transition-colors duration-700" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full -ml-24 -mb-24 blur-[80px]" />
                    
                    <div className="relative z-10 space-y-8">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Expected Revenue</p>
                          <motion.h3 
                            key={expected}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-6xl font-display font-bold tracking-tight"
                          >
                            ₹{expected.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </motion.h3>
                        </div>
                        <div className="bg-white/10 p-5 rounded-[1.5rem] backdrop-blur-xl border border-white/10 shadow-inner">
                          <TrendingUp className="w-10 h-10 text-emerald-400" />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                          Real-time
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                          {volume.toFixed(2)} Ltr Sold
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Difference Status Card */}
                  <motion.div 
                    layout
                    className={`rounded-[3rem] p-10 border-2 transition-all duration-700 relative overflow-hidden ${
                    !isValid ? 'bg-white border-slate-100 opacity-60' :
                    isShort ? 'bg-red-50 border-red-100 shadow-2xl shadow-red-500/5' : 
                    isExcess ? 'bg-emerald-50 border-emerald-100 shadow-2xl shadow-emerald-500/5' : 
                    'bg-blue-50 border-blue-100 shadow-2xl shadow-blue-500/5'
                  }`}>
                    <div className="flex justify-between items-center mb-8">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${
                          isShort ? 'bg-red-100 text-red-600' : 
                          isExcess ? 'bg-emerald-100 text-emerald-600' : 
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {isShort ? <AlertCircle className="w-8 h-8" /> : 
                           isExcess ? <TrendingUp className="w-8 h-8" /> : 
                           <CheckCircle2 className="w-8 h-8" />}
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Status</p>
                          <span className={`text-base font-bold uppercase tracking-widest ${
                            isShort ? 'text-red-600' : isExcess ? 'text-emerald-600' : 'text-blue-600'
                          }`}>
                            {isShort ? 'Shortage (Minus)' : isExcess ? 'Excess (Plus)' : 'Perfect Tally'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-baseline gap-3">
                      <motion.span 
                        key={difference}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`text-7xl font-display font-bold tracking-tighter ${
                        isShort ? 'text-red-600' : isExcess ? 'text-emerald-600' : 'text-blue-600'
                      }`}>
                        {isShort ? '-' : isExcess ? '+' : ''}₹{Math.abs(difference).toFixed(2)}
                      </motion.span>
                    </div>
                    
                    {!isValid && (
                      <div className="mt-6 flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest italic">
                        <AlertCircle className="w-4 h-4" />
                        Awaiting Inputs...
                      </div>
                    )}
                  </motion.div>

                  {/* Quick Actions (Desktop Only) */}
                  <div className="hidden lg:flex gap-4 pt-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleReset}
                      className="flex-1 py-5 bg-white border-2 border-slate-100 text-slate-600 rounded-[1.5rem] font-bold hover:bg-slate-50 hover:border-slate-200 transition-all flex items-center justify-center gap-3 shadow-sm btn-no-zoom"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Reset
                    </motion.button>
                    <motion.button
                      whileHover={isValid ? { scale: 1.02 } : {}}
                      whileTap={isValid ? { scale: 0.98 } : {}}
                      onClick={handleSave}
                      disabled={!isValid}
                      className="flex-[2] py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-[1.5rem] font-bold hover:from-blue-700 hover:to-blue-800 disabled:opacity-30 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 btn-no-zoom"
                    >
                      <Save className="w-6 h-6" />
                      Save Record
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Mobile Floating Action Bar */}
              <div className="lg:hidden fixed bottom-8 left-6 right-6 z-40">
                <div className="bg-white/90 backdrop-blur-2xl border border-white p-4 rounded-[2.5rem] shadow-2xl flex gap-4 ring-1 ring-slate-900/5">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleReset}
                    className="w-16 h-16 flex items-center justify-center bg-slate-100 text-slate-600 rounded-[1.5rem] hover:bg-slate-200 transition-colors shadow-sm btn-no-zoom"
                  >
                    <RotateCcw className="w-7 h-7" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    disabled={!isValid}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-[1.5rem] font-bold text-xl flex items-center justify-center gap-4 hover:from-blue-700 hover:to-blue-800 active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale shadow-xl shadow-blue-500/20 btn-no-zoom"
                  >
                    <Save className="w-7 h-7" />
                    Save Record
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="history"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-10"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-slate-900/20">
                    <History className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-display font-bold text-slate-900">Shift History</h2>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">All Saved Records</p>
                    </div>
                  </div>
                </div>
                {history.length > 0 && (
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={clearHistory}
                    className="text-xs font-bold text-red-500 hover:bg-red-50 px-6 py-4 rounded-2xl transition-all flex items-center justify-center gap-3 border-2 border-red-100 shadow-sm btn-no-zoom"
                  >
                    <Trash2 className="w-5 h-5" />
                    Clear History
                  </motion.button>
                )}
              </div>

              {history.length === 0 ? (
                <div className="text-center py-40 bg-white rounded-[4rem] border-2 border-slate-100 border-dashed neo-shadow">
                  <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <History className="w-16 h-16 text-slate-200" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-slate-900">No records found</h3>
                  <p className="text-sm text-slate-400 mt-3 max-w-[280px] mx-auto font-medium">Your saved shift calculations will be listed here for future reference.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {history.map((record) => (
                    <motion.div 
                      layout
                      key={record.id} 
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
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}


