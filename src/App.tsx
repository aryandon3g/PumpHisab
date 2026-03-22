/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
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
  TrendingDown,
  Calendar
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

  // Input handler to allow proper decimal typing
  const handleNumberInput = (setter: (val: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
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
    
    return {
      numRate,
      numOpening,
      numClosing,
      numCollected,
      volume,
      expected,
      difference,
      isValid: numRate > 0 && numClosing >= numOpening && numClosing > 0
    };
  }, [rate, openingMeter, closingMeter, collected]);

  const { volume, expected, difference, isValid } = stats;

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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100">
      {/* Premium Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 backdrop-blur-md bg-white/80">
        <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Gauge className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold leading-tight tracking-tight text-slate-900">Pump Hisab</h1>
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Professional Edition</p>
            </div>
          </div>
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              showHistory 
                ? 'bg-slate-900 text-white shadow-lg' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {showHistory ? <Calculator className="w-4 h-4" /> : <History className="w-4 h-4" />}
            {showHistory ? 'Calc' : 'History'}
          </button>
        </div>
      </header>

      <main className="max-w-xl mx-auto p-4 pb-32">
        <AnimatePresence mode="wait">
          {!showHistory ? (
            <motion.div 
              key="calculator"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Input Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Shift Details</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Rate Card */}
                  <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 group focus-within:border-blue-400 transition-all">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Rate (₹/Ltr)</label>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-focus-within:bg-blue-600 group-focus-within:text-white transition-colors">
                        <IndianRupee className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={rate}
                        onChange={handleNumberInput(setRate)}
                        className="flex-1 text-2xl font-display font-bold outline-none placeholder:text-slate-200"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Collected Card */}
                  <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 group focus-within:border-blue-400 transition-all">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Cash Collected (₹)</label>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-focus-within:bg-emerald-600 group-focus-within:text-white transition-colors">
                        <IndianRupee className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={collected}
                        onChange={handleNumberInput(setCollected)}
                        className="flex-1 text-2xl font-display font-bold outline-none placeholder:text-slate-200"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                {/* Meter Section */}
                <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Meter Readings</label>
                    <div className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase">Auto-Calc</div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex-1 space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase ml-1">Opening</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={openingMeter}
                        onChange={handleNumberInput(setOpeningMeter)}
                        className="w-full bg-slate-50 px-4 py-4 rounded-2xl text-xl font-display font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        placeholder="0000.0"
                      />
                    </div>
                    <div className="mt-6">
                      <ArrowRight className="w-5 h-5 text-slate-300" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase ml-1">Closing</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={closingMeter}
                        onChange={handleNumberInput(setClosingMeter)}
                        className="w-full bg-slate-50 px-4 py-4 rounded-2xl text-xl font-display font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        placeholder="0000.0"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                        <Droplet className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold text-slate-500">Total Volume</span>
                    </div>
                    <span className="text-xl font-display font-bold text-slate-900">{volume.toFixed(2)} <span className="text-sm text-slate-400">Ltr</span></span>
                  </div>
                </div>
              </section>

              {/* Result Dashboard */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Live Summary</h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {/* Expected Amount */}
                  <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl shadow-slate-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                    <div className="relative z-10 flex justify-between items-end">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Expected Bill</p>
                        <h3 className="text-4xl font-display font-bold">₹{expected.toFixed(2)}</h3>
                      </div>
                      <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
                        <TrendingUp className="w-6 h-6 text-emerald-400" />
                      </div>
                    </div>
                  </div>

                  {/* Difference Card */}
                  <div className={`rounded-[2rem] p-6 border-2 transition-all duration-500 ${
                    !isValid ? 'bg-white border-slate-100 opacity-50' :
                    isShort ? 'bg-red-50 border-red-100 shadow-lg shadow-red-100' : 
                    isExcess ? 'bg-emerald-50 border-emerald-100 shadow-lg shadow-emerald-100' : 
                    'bg-blue-50 border-blue-100 shadow-lg shadow-blue-100'
                  }`}>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        {isShort ? <AlertCircle className="w-5 h-5 text-red-500" /> : 
                         isExcess ? <TrendingUp className="w-5 h-5 text-emerald-500" /> : 
                         <CheckCircle2 className="w-5 h-5 text-blue-500" />}
                        <span className={`text-xs font-bold uppercase tracking-wider ${
                          isShort ? 'text-red-600' : isExcess ? 'text-emerald-600' : 'text-blue-600'
                        }`}>
                          {isShort ? 'Shortage (Minus)' : isExcess ? 'Excess (Plus)' : 'Perfect Tally'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-baseline gap-1">
                      <span className={`text-5xl font-display font-bold ${
                        isShort ? 'text-red-600' : isExcess ? 'text-emerald-600' : 'text-blue-600'
                      }`}>
                        {isShort ? '-' : isExcess ? '+' : ''}₹{Math.abs(difference).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Floating Action Bar */}
              <div className="fixed bottom-6 left-4 right-4 max-w-xl mx-auto z-40">
                <div className="bg-white/80 backdrop-blur-xl border border-white p-3 rounded-[2rem] shadow-2xl flex gap-3">
                  <button
                    onClick={handleReset}
                    className="w-14 h-14 flex items-center justify-center bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-colors"
                  >
                    <RotateCcw className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!isValid}
                    className="flex-1 bg-blue-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale shadow-lg shadow-blue-200"
                  >
                    <Save className="w-6 h-6" />
                    Save Shift Record
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="history"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <h2 className="text-xl font-display font-bold text-slate-900">Past Records</h2>
                </div>
                {history.length > 0 && (
                  <button 
                    onClick={clearHistory}
                    className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[2.5rem] border border-slate-100 border-dashed">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <History className="w-10 h-10 text-slate-200" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">No records yet</h3>
                  <p className="text-sm text-slate-400 mt-2 max-w-[200px] mx-auto">Your saved shift calculations will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((record) => (
                    <motion.div 
                      layout
                      key={record.id} 
                      className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 group hover:border-blue-200 transition-all"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{record.date}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">{record.volume.toFixed(2)} Ltr</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-sm font-bold text-slate-900">₹{record.rate}/L</span>
                          </div>
                        </div>
                        <div className={`px-4 py-2 rounded-2xl font-display font-bold text-lg ${
                          record.difference < -0.01 ? 'bg-red-50 text-red-600' : 
                          record.difference > 0.01 ? 'bg-emerald-50 text-emerald-600' : 
                          'bg-blue-50 text-blue-600'
                        }`}>
                          {record.difference < -0.01 ? '-' : record.difference > 0.01 ? '+' : ''}
                          ₹{Math.abs(record.difference).toFixed(2)}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Meter Range</p>
                          <p className="text-xs font-bold text-slate-700">{record.opening} <ArrowRight className="inline w-3 h-3 mx-1" /> {record.closing}</p>
                        </div>
                        <div className="space-y-1 text-right">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Revenue</p>
                          <p className="text-xs font-bold text-slate-700">₹{record.collected.toFixed(2)} / ₹{record.expected.toFixed(2)}</p>
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

