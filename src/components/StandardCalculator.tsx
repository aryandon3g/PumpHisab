import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calculator, RotateCcw, Delete } from 'lucide-react';

interface StandardCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StandardCalculator = ({ isOpen, onClose }: StandardCalculatorProps) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handleNumber = (num: string) => {
    setDisplay(prev => prev === '0' ? num : prev + num);
  };

  const handleOperator = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
  };

  const handleDelete = () => {
    setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
  };

  const handleEqual = () => {
    try {
      const result = eval(equation + display);
      setDisplay(result.toString());
      setEquation('');
    } catch (e) {
      setDisplay('Error');
    }
  };

  // Prevent background scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isOpen]);

  const buttons = [
    { label: 'C', action: handleClear, color: 'text-red-500' },
    { label: 'DEL', action: handleDelete, color: 'text-amber-500' },
    { label: '%', action: () => handleOperator('%'), color: 'text-blue-500' },
    { label: '/', action: () => handleOperator('/'), color: 'text-blue-500' },
    { label: '7', action: () => handleNumber('7') },
    { label: '8', action: () => handleNumber('8') },
    { label: '9', action: () => handleNumber('9') },
    { label: '*', action: () => handleOperator('*'), color: 'text-blue-500' },
    { label: '4', action: () => handleNumber('4') },
    { label: '5', action: () => handleNumber('5') },
    { label: '6', action: () => handleNumber('6') },
    { label: '-', action: () => handleOperator('-'), color: 'text-blue-500' },
    { label: '1', action: () => handleNumber('1') },
    { label: '2', action: () => handleNumber('2') },
    { label: '3', action: () => handleNumber('3') },
    { label: '+', action: () => handleOperator('+'), color: 'text-blue-500' },
    { label: '0', action: () => handleNumber('0'), span: 2 },
    { label: '.', action: () => handleNumber('.') },
    { label: '=', action: handleEqual, color: 'bg-blue-600 text-white rounded-2xl' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[80]"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] bg-white rounded-[2.5rem] shadow-2xl z-[90] overflow-hidden border border-slate-100"
          >
            <div className="p-6 bg-slate-900 text-white">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Calculator</span>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="text-right space-y-1">
                <div className="text-slate-400 text-sm font-medium h-6 overflow-hidden truncate">
                  {equation || '0'}
                </div>
                <div className="text-4xl font-display font-extrabold truncate">
                  {display}
                </div>
              </div>
            </div>

            <div className="p-4 grid grid-cols-4 gap-2 bg-slate-50">
              {buttons.map((btn, i) => (
                <button
                  key={i}
                  onClick={btn.action}
                  className={`h-16 flex items-center justify-center text-lg font-bold transition-all active:scale-95 rounded-2xl ${
                    btn.span === 2 ? 'col-span-2' : ''
                  } ${
                    btn.label === '=' 
                      ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                      : btn.color?.includes('text-') 
                        ? 'bg-slate-200 ' + btn.color 
                        : 'bg-white text-slate-900 shadow-sm border border-slate-100'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
