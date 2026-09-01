import React, { useEffect } from 'react';
import { Trophy, RotateCcw, BarChart2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MatchState } from '../types';
import { translations, Language } from '../utils/i18n';

interface VictoryModalProps {
  state: MatchState;
  appLanguage?: Language;
  onNewMatch: () => void;
  onViewStats: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({ state, appLanguage = 'en', onNewMatch, onViewStats }) => {
  const winner = state.matchWinner === 'team1' ? state.team1 : state.team2;
  const t = translations[appLanguage] || translations.en;

  useEffect(() => {
    // Fire celebratory confetti bursts
    const count = 160;
    const defaults = { origin: { y: 0.55 } };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 50,
      colors: ['#CBFB5E', '#FF385C', '#10B981'],
    });
    fire(0.2, {
      spread: 60,
      colors: ['#CBFB5E', '#FF385C', '#38BDF8'],
    });
    fire(0.35, {
      spread: 90,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      colors: ['#CBFB5E', '#ffffff'],
    });
  }, []);

  return (
    <div className="absolute inset-0 z-50 rounded-full bg-black flex flex-col items-center justify-between py-3 px-3 text-center select-none overflow-hidden">
      {/* Top Header */}
      <div className="pt-1.5 flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-[#CBFB5E]/20 border border-[#CBFB5E]/40 flex items-center justify-center mb-1 animate-bounce shadow-[0_0_12px_rgba(203,251,94,0.3)]">
          <Trophy className="w-4 h-4 text-[#CBFB5E]" />
        </div>
        <span className="text-[9px] uppercase font-black tracking-widest text-[#CBFB5E]">
          {t.matchWon}
        </span>
        <h2 className="text-[11px] font-black text-white leading-tight uppercase tracking-wider font-heavy max-w-[190px] truncate">
          {t.matchWinner}: {winner.name}
        </h2>
      </div>

      {/* Final Sets Score Box */}
      <div className="my-auto w-full max-w-[184px] bg-[#121212] border border-[#222222] rounded-xl py-2 px-2.5 flex flex-col gap-1 shadow-xl">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-black text-[#CBFB5E] uppercase tracking-wider truncate max-w-[70px]">
            {state.team1.shortName}
          </span>
          <div className="flex gap-2 font-digits font-black text-white text-xs">
            {state.sets.map((s, i) => (
              <span key={i} className={s.winner === 'team1' ? 'text-[#CBFB5E] font-black' : 'text-neutral-500'}>
                {s.team1Games}
                {s.tieBreakScore && (
                  <sup className="text-[7.5px] ml-0.5 text-neutral-400">
                    {s.tieBreakScore.team1}
                  </sup>
                )}
              </span>
            ))}
          </div>
        </div>

        <div className="h-px bg-[#222222] w-full" />

        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-black text-[#FF385C] uppercase tracking-wider truncate max-w-[70px]">
            {state.team2.shortName}
          </span>
          <div className="flex gap-2 font-digits font-black text-white text-xs">
            {state.sets.map((s, i) => (
              <span key={i} className={s.winner === 'team2' ? 'text-[#FF385C] font-black' : 'text-neutral-500'}>
                {s.team2Games}
                {s.tieBreakScore && (
                  <sup className="text-[7.5px] ml-0.5 text-neutral-400">
                    {s.tieBreakScore.team2}
                  </sup>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons formatted to sit safely inside the round watch bottom */}
      <div className="pb-3 w-full max-w-[184px] flex items-center justify-center gap-2">
        <button
          onClick={onViewStats}
          className="flex-1 py-1.5 px-2 rounded-full bg-[#181818] hover:bg-[#262626] active:scale-95 text-white text-[9.5px] font-black uppercase tracking-wider flex items-center justify-center gap-1 border border-[#333333] transition shadow whitespace-nowrap"
        >
          <BarChart2 className="w-3 h-3 text-[#CBFB5E]" />
          <span>{t.viewStats}</span>
        </button>

        <button
          onClick={onNewMatch}
          className="flex-1 py-1.5 px-2 rounded-full bg-[#CBFB5E] hover:bg-[#B5EB48] active:scale-95 text-black text-[9.5px] font-black uppercase tracking-wider flex items-center justify-center gap-1 shadow-lg shadow-[#CBFB5E]/30 transition whitespace-nowrap"
        >
          <RotateCcw className="w-3 h-3 text-black" />
          <span>{t.newMatchBtn}</span>
        </button>
      </div>
    </div>
  );
};
