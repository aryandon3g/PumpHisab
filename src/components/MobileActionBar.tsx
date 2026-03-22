import { motion } from 'motion/react';
import { RotateCcw, Save } from 'lucide-react';

interface MobileActionBarProps {
  isValid: boolean;
  handleReset: () => void;
  handleSave: () => void;
}

export const MobileActionBar = ({ isValid, handleReset, handleSave }: MobileActionBarProps) => (
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
);
