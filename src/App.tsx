/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Droplet, IndianRupee, Calculator, History, Trash2, RotateCcw, Save, Gauge } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ShiftRecord {
  id: string;
  date: string;
  rate: number;
  volume: number;
  expected: number;
  collected: number;
  difference: number;
  mode: 'volume' | 'meter';
  opening?: number;
  closing?: number;
}

export default function App() {
  const [calcMode, setCalcMode] = useState<'volume' | 'meter'>('volume');
  
  const [rate, setRate] = useState<string>('');
  const [volume, setVolume] = useState<string>('');
  const [openingMeter, setOpeningMeter] = useState<string>('');
  const [closingMeter, setClosingMeter] = useState<string>('');
  const [collected, setCollected] = useState<string>('');
  
  const [history, setHistory] = useState<ShiftRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('pump_hisab_history');
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
    localStorage.setItem('pump_hisab_history', JSON.stringify(history));
  }, [history]);

  // Input handler to allow proper decimal typing
  const handleNumberInput = (setter: (val: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*\.?\d*$/.test(val)) {
      setter(val);
    }
  };

  const numRate = parseFloat(rate) || 0;
  const numOpening = parseFloat(openingMeter) || 0;
  const numClosing = parseFloat(closingMeter) || 0;
  
  // Calculate volume based on mode
  const calculatedVolume = calcMode === 'meter' 
    ? Math.max(0, numClosing - numOpening)
    : (parseFloat(volume) || 0);

  const numCollected = parseFloat(collected) || 0;
  const expectedAmount = numRate * calculatedVolume;
  const difference = numCollected - expectedAmount;

  const isShort = difference < -0.01;
  const isExcess = difference > 0.01;
  const isExact = Math.abs(difference) <= 0.01 && expectedAmount > 0;

  const handleSave = () => {
    if (expectedAmount <= 0) return;

    const newRecord: ShiftRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleString('en-IN', {
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
      }),
      rate: numRate,
      volume: calculatedVolume,
      expected: expectedAmount,
      collected: numCollected,
      difference: difference,
      mode: calcMode,
      ...(calcMode === 'meter' && {
        opening: numOpening,
        closing: numClosing
      })
    };

    setHistory([newRecord, ...history]);
    handleReset();
  };

  const handleReset = () => {
    setRate('');
    setVolume('');
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
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplet className="w-6 h-6 fill-blue-400 text-blue-100" />
            <h1 className="text-xl font-display font-bold tracking-tight">Pump Hisab</h1>
          </div>
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 bg-blue-700/50 rounded-full hover:bg-blue-700 transition-colors"
          >
            {showHistory ? <Calculator className="w-5 h-5" /> : <History className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6 mt-4">
        <AnimatePresence mode="wait">
          {!showHistory ? (
            <motion.div 
              key="calculator"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Mode Toggle */}
              <div className="bg-white p-1.5 rounded-xl border border-gray-200 flex shadow-sm">
                <button
                  onClick={() => setCalcMode('volume')}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    calcMode === 'volume' ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Droplet className="w-4 h-4" />
                  Direct Volume
                </button>
                <button
                  onClick={() => setCalcMode('meter')}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    calcMode === 'meter' ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Gauge className="w-4 h-4" />
                  Meter Reading
                </button>
              </div>

              {/* Input Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-5">
                
                {/* Rate Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Price / Rate (₹ per Ltr)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IndianRupee className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={rate}
                      onChange={handleNumberInput(setRate)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-medium transition-shadow"
                      placeholder="e.g. 96.50"
                    />
                  </div>
                </div>

                {/* Volume / Meter Inputs */}
                {calcMode === 'volume' ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      Sales Volume (Liters)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Droplet className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={volume}
                        onChange={handleNumberInput(setVolume)}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-medium transition-shadow"
                        placeholder="e.g. 150.5"
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-2 gap-3"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        Opening Meter
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={openingMeter}
                        onChange={handleNumberInput(setOpeningMeter)}
                        className="block w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-medium transition-shadow"
                        placeholder="Start"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        Closing Meter
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={closingMeter}
                        onChange={handleNumberInput(setClosingMeter)}
                        className="block w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-medium transition-shadow"
                        placeholder="End"
                      />
                    </div>
                    <div className="col-span-2 bg-gray-50 p-3 rounded-xl border border-gray-100 flex justify-between items-center">
                      <span className="text-sm text-gray-500 font-medium">Calculated Volume:</span>
                      <span className="font-bold text-gray-900">{calculatedVolume.toFixed(2)} L</span>
                    </div>
                  </motion.div>
                )}

                {/* Collected Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Total Money Collected (₹)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IndianRupee className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={collected}
                      onChange={handleNumberInput(setCollected)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-medium transition-shadow"
                      placeholder="e.g. 14500"
                    />
                  </div>
                </div>
              </div>

              {/* Results Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Expected Bill</span>
                  <span className="text-2xl font-display font-bold text-gray-900">
                    ₹{expectedAmount.toFixed(2)}
                  </span>
                </div>
                
                <div className="p-5">
                  <div className="text-center mb-2">
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Hisab Status</span>
                  </div>
                  
                  <div className={`rounded-xl p-4 text-center ${
                    isShort ? 'bg-red-50 border border-red-100' : 
                    isExcess ? 'bg-emerald-50 border border-emerald-100' : 
                    isExact ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50 border border-gray-100'
                  }`}>
                    {expectedAmount === 0 ? (
                      <span className="text-gray-400 font-medium">Enter details to calculate</span>
                    ) : (
                      <div className="flex flex-col items-center">
                        <span className={`text-3xl font-display font-bold ${
                          isShort ? 'text-red-600' : 
                          isExcess ? 'text-emerald-600' : 
                          'text-blue-600'
                        }`}>
                          {isShort ? '-' : isExcess ? '+' : ''}₹{Math.abs(difference).toFixed(2)}
                        </span>
                        <span className={`text-sm font-medium mt-1 ${
                          isShort ? 'text-red-500' : 
                          isExcess ? 'text-emerald-500' : 
                          'text-blue-500'
                        }`}>
                          {isShort ? 'Short (Minus)' : isExcess ? 'Extra (Plus)' : 'Perfect Tally (Barabar)'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </button>
                <button
                  onClick={handleSave}
                  disabled={expectedAmount <= 0}
                  className="flex-[2] flex items-center justify-center gap-2 py-3.5 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  <Save className="w-5 h-5" />
                  Save Hisab
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-display font-bold text-gray-900">Saved Records</h2>
                {history.length > 0 && (
                  <button 
                    onClick={clearHistory}
                    className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 border-dashed">
                  <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No history found</p>
                  <p className="text-sm text-gray-400 mt-1">Saved calculations will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((record) => (
                    <div key={record.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                          {record.date}
                        </span>
                        <span className={`text-sm font-bold px-2 py-1 rounded-md ${
                          record.difference < -0.01 ? 'bg-red-50 text-red-600' : 
                          record.difference > 0.01 ? 'bg-emerald-50 text-emerald-600' : 
                          'bg-blue-50 text-blue-600'
                        }`}>
                          {record.difference < -0.01 ? '-' : record.difference > 0.01 ? '+' : ''}
                          ₹{Math.abs(record.difference).toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-y-2 text-sm">
                        {record.mode === 'meter' ? (
                          <>
                            <div className="text-gray-500">Meter Reading:</div>
                            <div className="text-right font-medium text-gray-900">{record.opening} → {record.closing}</div>
                          </>
                        ) : null}
                        
                        <div className="text-gray-500">Volume:</div>
                        <div className="text-right font-medium text-gray-900">{record.volume.toFixed(2)} L</div>
                        
                        <div className="text-gray-500">Rate:</div>
                        <div className="text-right font-medium text-gray-900">₹{record.rate}/L</div>
                        
                        <div className="text-gray-500">Expected:</div>
                        <div className="text-right font-medium text-gray-900">₹{record.expected.toFixed(2)}</div>
                        
                        <div className="text-gray-500">Collected:</div>
                        <div className="text-right font-medium text-gray-900">₹{record.collected.toFixed(2)}</div>
                      </div>
                    </div>
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
