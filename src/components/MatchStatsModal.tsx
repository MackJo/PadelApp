import React from 'react';
import { ArrowLeft, Clock, Zap, Target, Award, Activity } from 'lucide-react';
import { MatchState } from '../types';
import { translations, Language } from '../utils/i18n';

interface MatchStatsModalProps {
  state: MatchState;
  appLanguage?: Language;
  onClose: () => void;
}

export const MatchStatsModal: React.FC<MatchStatsModalProps> = ({ state, appLanguage = 'en', onClose }) => {
  const { stats, team1, team2 } = state;
  const t = translations[appLanguage] || translations.en;
  const minutes = Math.floor(stats.durationSeconds / 60);
  const seconds = stats.durationSeconds % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const totalPoints = stats.totalPointsTeam1 + stats.totalPointsTeam2;
  const pct1 = totalPoints > 0 ? Math.round((stats.totalPointsTeam1 / totalPoints) * 100) : 50;
  const pct2 = totalPoints > 0 ? 100 - pct1 : 50;

  return (
    <div className="absolute inset-0 z-50 rounded-full bg-black flex flex-col p-4 text-white select-none overflow-y-auto no-scrollbar">
      {/* Top Header with Back */}
      <div className="pt-2 flex items-center justify-between border-b border-[#1F1F1F] pb-2 px-2">
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-[#181818] hover:bg-[#262626] border border-[#2E2E2E] flex items-center justify-center text-white active:scale-90 transition shadow"
          title="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-xs font-black uppercase tracking-widest text-[#CBFB5E]">
          {t.matchStatsTitle}
        </span>
        <div className="w-8 h-8" />
      </div>

      {/* Duration */}
      <div className="flex items-center justify-center gap-1.5 py-1.5 text-xs text-neutral-400 font-bold uppercase tracking-wider">
        <Clock className="w-3.5 h-3.5 text-neutral-500" />
        <span>{t.matchDuration}:</span>
        <span className="font-digits font-black text-white">{timeFormatted}</span>
      </div>

      {/* Team vs Team Header */}
      <div className="flex items-center justify-between text-xs px-3 py-1.5 bg-[#121212] border border-[#222222] rounded-xl mb-2">
        <span className="font-black text-[#CBFB5E] tracking-wider uppercase truncate max-w-[80px]">{team1.shortName}</span>
        <span className="text-[10px] text-neutral-500 font-black tracking-widest uppercase">VS</span>
        <span className="font-black text-[#FF385C] tracking-wider uppercase truncate max-w-[80px]">{team2.shortName}</span>
      </div>

      {/* Stats list */}
      <div className="flex flex-col gap-2 pb-6 text-xs">
        {/* Total Points */}
        <div className="bg-[#121212] border border-[#222222] rounded-xl p-2.5 flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-[11px]">
            <span className="font-digits font-black text-[#CBFB5E]">{stats.totalPointsTeam1} ({pct1}%)</span>
            <span className="text-neutral-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
              <Activity className="w-3 h-3 text-[#CBFB5E]" /> {t.totalPoints}
            </span>
            <span className="font-digits font-black text-[#FF385C]">{stats.totalPointsTeam2} ({pct2}%)</span>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 bg-[#222222] rounded-full overflow-hidden flex w-full">
            <div className="bg-[#CBFB5E] h-full" style={{ width: `${pct1}%` }} />
            <div className="bg-[#FF385C] h-full" style={{ width: `${pct2}%` }} />
          </div>
        </div>

        {/* Punto de Oro (Golden Points) */}
        <div className="bg-[#121212] border border-[#222222] rounded-xl p-2.5 flex justify-between items-center text-[11px]">
          <span className="font-digits font-black text-[#CBFB5E] text-base">
            {stats.goldenPointsWonTeam1}
          </span>
          <div className="flex flex-col items-center">
            <span className="text-[#CBFB5E] font-black uppercase tracking-wider flex items-center gap-1 text-[10px]">
              <Zap className="w-3 h-3 fill-[#CBFB5E]" /> {t.goldenPointTitle}
            </span>
            <span className="text-[9px] text-neutral-500 font-bold uppercase">({stats.goldenPointsPlayed})</span>
          </div>
          <span className="font-digits font-black text-[#FF385C] text-base">
            {stats.goldenPointsWonTeam2}
          </span>
        </div>

        {/* Break Points */}
        <div className="bg-[#121212] border border-[#222222] rounded-xl p-2.5 flex justify-between items-center text-[11px]">
          <span className="font-digits font-black text-[#CBFB5E] text-base">
            {stats.breakPointsConvertedTeam1}
          </span>
          <span className="text-neutral-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <Target className="w-3 h-3 text-neutral-400" /> {t.breakPointsWon}
          </span>
          <span className="font-digits font-black text-[#FF385C] text-base">
            {stats.breakPointsConvertedTeam2}
          </span>
        </div>

        {/* Sets Score Breakdown */}
        <div className="bg-[#121212] border border-[#222222] rounded-xl p-2.5 flex flex-col gap-1.5">
          <span className="text-[10px] font-black text-neutral-400 text-center uppercase tracking-widest flex items-center justify-center gap-1">
            <Award className="w-3 h-3 text-[#CBFB5E]" /> {t.setsWon}
          </span>
          <div className="flex justify-center gap-2 font-digits text-xs font-black text-white pt-1">
            {state.sets.map((s, idx) => (
              <div key={idx} className="bg-[#1C1C1C] border border-[#2A2A2A] px-2.5 py-1 rounded-lg text-center">
                <span className="text-[9px] text-neutral-400 block mb-0.5 uppercase tracking-wider font-bold">{t.set} {idx + 1}</span>
                <span className={s.winner === 'team1' ? 'text-[#CBFB5E]' : s.winner === 'team2' ? 'text-[#FF385C]' : 'text-white'}>
                  {s.team1Games}:{s.team2Games}
                  {s.tieBreakScore && (
                    <span className="text-[9px] ml-0.5 text-neutral-400">({s.tieBreakScore.team1}:{s.tieBreakScore.team2})</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Close button at bottom */}
      <div className="pb-3 flex justify-center">
        <button
          onClick={onClose}
          className="px-6 py-1.5 rounded-full bg-[#181818] hover:bg-[#222222] active:scale-95 text-xs font-black uppercase tracking-wider text-white border border-[#333333] transition"
        >
          {t.done}
        </button>
      </div>
    </div>
  );
};
