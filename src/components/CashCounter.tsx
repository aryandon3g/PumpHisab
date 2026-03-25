import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calculator, RotateCcw, CheckCircle2, IndianRupee, Share2, Plus } from 'lucide-react';

interface CashCounterProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (total: number) => void;
  initialTotal?: number;
}

const DENOMINATIONS = [2000, 500, 200, 100, 50, 20, 10, 5, 2, 1];

export const CashCounter = ({ isOpen, onClose, onApply }: CashCounterProps) => {
  const [counts, setCounts] = useState<{ [key: number]: string }>(
    DENOMINATIONS.reduce((acc, d) => ({ ...acc, [d]: '' }), {})
  );
  const [manualAmount, setManualAmount] = useState<string>('');

  const total = DENOMINATIONS.reduce((acc, d) => {
    const count = parseInt(counts[d]) || 0;
    return acc + (d * count);
  }, 0) + (parseFloat(manualAmount) || 0);

  const handleCountChange = (denom: number, value: string) => {
    if (value === '' || /^\d+$/.test(value)) {
      setCounts(prev => ({ ...prev, [denom]: value }));
    }
  };

  const handleReset = () => {
    setCounts(DENOMINATIONS.reduce((acc, d) => ({ ...acc, [d]: '' }), {}));
    setManualAmount('');
  };

  const handleShareBreakdown = () => {
    let breakdown = `*Cash Breakdown*\n`;
    DENOMINATIONS.forEach(d => {
      const count = parseInt(counts[d]) || 0;
      if (count > 0) {
        breakdown += `₹${d} x ${count} = ₹${(d * count).toLocaleString('en-IN')}\n`;
      }
    });
    
    const manual = parseFloat(manualAmount) || 0;
    if (manual > 0) {
      breakdown += `Manual Addition: ₹${manual.toLocaleString('en-IN')}\n`;
    }
    
    breakdown += `*Total: ₹${total.toLocaleString('en-IN')}*`;

    if (navigator.share) {
      navigator.share({
        title: 'Cash Breakdown',
        text: breakdown,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(breakdown);
      alert('Breakdown copied to clipboard!');
    }
  };

  // Prevent background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] z-[70] max-h-[92vh] overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Handle Bar */}
            <div className="w-full flex justify-center pt-4 pb-2">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
            </div>

            <div className="p-6 sm:p-8 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                  <IndianRupee className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-extrabold text-slate-900">Cash Counter</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Denomination Breakdown</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-3 bg-slate-100 text-slate-400 rounded-xl hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 custom-scrollbar">
              {/* Manual Addition Card */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 shadow-sm">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Manual Addition</span>
                </div>
                <input
                  type="text"
                  inputMode="decimal"
                  value={manualAmount}
                  onChange={(e) => setManualAmount(e.target.value)}
                  className="w-full bg-white px-6 py-4 rounded-2xl text-2xl font-display font-extrabold outline-none focus:ring-4 focus:ring-slate-900/5 border border-slate-100 transition-all"
                  placeholder="Enter manual amount..."
                />
              </div>

              <div className="grid grid-cols-1 gap-3">
                {DENOMINATIONS.map((denom) => (
                  <div 
                    key={denom}
                    className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 transition-all group"
                  >
                    <div className="w-16 text-sm font-bold text-slate-400 uppercase tracking-widest">₹{denom}</div>
                    <div className="flex-1 flex items-center gap-3">
                      <span className="text-slate-300 font-bold">×</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={counts[denom] || ''}
                        onChange={(e) => handleCountChange(denom, e.target.value)}
                        className="w-full bg-slate-50 px-4 py-3 rounded-xl text-lg font-bold outline-none focus:bg-white border border-transparent focus:border-slate-200 transition-all"
                        placeholder="0"
                      />
                    </div>
                    <div className="w-24 text-right font-display font-extrabold text-slate-900">
                      ₹{(counts[denom] || 0) * denom}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Amount</p>
                  <p className="text-3xl font-display font-extrabold text-slate-900">₹{total.toLocaleString('en-IN')}</p>
                </div>
                <button 
                  onClick={handleShareBreakdown}
                  className="p-4 bg-white text-slate-600 rounded-2xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-all"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={() => {
                  onApply(total);
                  onClose();
                }}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/10 active:scale-[0.98] transition-all"
              >
                Apply Total
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
