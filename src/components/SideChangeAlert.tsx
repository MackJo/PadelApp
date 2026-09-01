import React, { useEffect } from 'react';
import { ArrowLeftRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MatchState } from '../types';
import { translations, Language } from '../utils/i18n';

interface SideChangeAlertProps {
  show: boolean;
  state: MatchState;
  appLanguage?: Language;
  onDismiss: () => void;
}

export const SideChangeAlert: React.FC<SideChangeAlertProps> = ({ show, state, appLanguage = 'en', onDismiss }) => {
  const t = translations[appLanguage] || translations.en;

  useEffect(() => {
    if (show) {
      // Auto dismiss after 4 seconds on smartwatch
      const timer = setTimeout(() => {
        onDismiss();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onDismiss]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="absolute inset-0 z-50 rounded-full bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
          onClick={onDismiss}
        >
          <div className="w-12 h-12 rounded-full bg-[#CBFB5E]/20 border border-[#CBFB5E]/40 flex items-center justify-center mb-2 animate-bounce">
            <ArrowLeftRight className="w-6 h-6 text-[#CBFB5E]" />
          </div>

          <span className="text-xs font-black uppercase tracking-widest text-[#CBFB5E] mb-1">
            90 SEC BREAK
          </span>

          <h3 className="text-base font-black text-white leading-tight mb-2 uppercase tracking-wider font-heavy">
            {t.sideChangeTitle}
          </h3>

          <div className="bg-[#121212] border border-[#222222] rounded-xl px-3 py-1.5 mb-3 flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">{t.set}:</span>
            <div className="flex gap-1.5 font-digits font-black text-xs text-white">
              {state.sets.map((s, idx) => (
                <span
                  key={idx}
                  className={idx === state.currentSetIndex ? 'text-[#CBFB5E]' : 'text-neutral-400'}
                >
                  {s.team1Games}:{s.team2Games}
                </span>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider leading-tight max-w-[190px] mb-3">
            {t.serve}:{' '}
            <span className="font-black text-white">
              {state.servingTeam === 'team1' ? state.team1.shortName : state.team2.shortName}
            </span>
          </p>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDismiss();
            }}
            className="px-5 py-1.5 rounded-full bg-[#CBFB5E] hover:bg-[#B5EB48] active:scale-95 text-black text-xs font-black uppercase tracking-wider transition flex items-center gap-1 shadow-lg shadow-[#CBFB5E]/20"
          >
            <span>{t.continueBtn}</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

