import { motion } from 'motion/react';
import { RotateCcw, Save, Share2 } from 'lucide-react';

interface MobileActionBarProps {
  isValid: boolean;
  handleReset: () => void;
  handleSave: () => void;
  handleShare?: () => void;
}

export const MobileActionBar = ({ isValid, handleReset, handleSave, handleShare }: MobileActionBarProps) => (
  <div className="lg:hidden fixed bottom-6 left-4 right-4 z-40">
    <div className="ios-blur p-2 sm:p-3 rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl flex gap-2 sm:gap-3 ring-1 ring-slate-900/5">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleReset}
        className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-slate-100 text-slate-600 rounded-xl sm:rounded-2xl hover:bg-slate-200 transition-colors btn-no-zoom"
      >
        <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
      </motion.button>
      {handleShare && isValid && (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleShare}
          className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-slate-100 text-slate-600 rounded-xl sm:rounded-2xl hover:bg-slate-200 transition-colors btn-no-zoom"
        >
          <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
        </motion.button>
      )}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleSave}
        disabled={!isValid}
        className="flex-1 bg-slate-900 text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 sm:gap-3 active:scale-[0.98] transition-all disabled:opacity-30 shadow-lg shadow-slate-900/10 btn-no-zoom"
      >
        <Save className="w-4 h-4 sm:w-5 sm:h-5" />
        Save Record
      </motion.button>
    </div>
  </div>
);
