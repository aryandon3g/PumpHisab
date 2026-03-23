import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calculator, RotateCcw, CheckCircle2, IndianRupee, Share2 } from 'lucide-react';

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

  const total = DENOMINATIONS.reduce((acc, d) => {
    const count = parseInt(counts[d]) || 0;
    return acc + (d * count);
  }, 0);

  const handleCountChange = (denom: number, value: string) => {
    if (value === '' || /^\d+$/.test(value)) {
      setCounts(prev => ({ ...prev, [denom]: value }));
    }
  };

  const handleReset = () => {
    setCounts(DENOMINATIONS.reduce((acc, d) => ({ ...acc, [d]: '' }), {}));
  };

  const handleShareBreakdown = () => {
    let breakdown = `*Cash Breakdown*\n`;
    DENOMINATIONS.forEach(d => {
      const count = parseInt(counts[d]) || 0;
      if (count > 0) {
        breakdown += `₹${d} x ${count} = ₹${(d * count).toLocaleString('en-IN')}\n`;
      }
    });
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
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[3rem] z-[70] max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
          >
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <Calculator className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold text-slate-900">Cash Counter</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Denomination Calculator</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleShareBreakdown}
                  className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 hover:bg-emerald-100 transition-colors"
                  title="Share Breakdown"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-4 pb-32">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {DENOMINATIONS.map((denom) => (
                  <div key={denom} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 group focus-within:border-emerald-200 focus-within:bg-white transition-all">
                    <div className="w-16 text-right">
                      <span className="text-xs font-bold text-slate-400 block mb-1">Note</span>
                      <span className="text-lg font-display font-bold text-slate-700">₹{denom}</span>
                    </div>
                    <div className="w-px h-8 bg-slate-200 mx-2" />
                    <div className="flex-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Quantity</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={counts[denom]}
                        onChange={(e) => handleCountChange(denom, e.target.value)}
                        placeholder="0"
                        className="w-full bg-transparent text-2xl font-display font-bold outline-none placeholder:text-slate-200"
                      />
                    </div>
                    <div className="text-right min-w-[80px]">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Amount</span>
                      <span className="text-sm font-bold text-slate-600">₹{(denom * (parseInt(counts[denom]) || 0)).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 bg-slate-900 text-white sticky bottom-0 z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-1">Total Cash Calculated</p>
                  <h3 className="text-4xl font-display font-bold">₹{total.toLocaleString('en-IN')}</h3>
                </div>
                <button 
                  onClick={handleReset}
                  className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <RotateCcw className="w-6 h-6" />
                </button>
              </div>
              <button
                onClick={() => {
                  onApply(total);
                  onClose();
                }}
                className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-xl flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20 transition-all active:scale-[0.98]"
              >
                <CheckCircle2 className="w-6 h-6" />
                Apply to Collected Amount
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
