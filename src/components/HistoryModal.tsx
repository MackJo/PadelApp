import React from 'react';
import { ArrowLeft, Trash2, Calendar, Trophy, Clock } from 'lucide-react';
import { SavedMatchRecord } from '../types';
import { translations, Language } from '../utils/i18n';

interface HistoryModalProps {
  history: SavedMatchRecord[];
  appLanguage?: Language;
  onClearHistory: () => void;
  onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ history, appLanguage = 'en', onClearHistory, onClose }) => {
  const t = translations[appLanguage];

  return (
    <div className="absolute inset-0 z-50 rounded-full bg-black flex flex-col p-4 text-white select-none overflow-y-auto no-scrollbar">
      {/* Top Header */}
      <div className="pt-2 flex items-center justify-between border-b border-[#1F1F1F] pb-2 px-2">
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-[#181818] hover:bg-[#262626] border border-[#2E2E2E] flex items-center justify-center text-white active:scale-90 transition shadow"
          title="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-xs font-black uppercase tracking-widest text-[#CBFB5E]">
          {t.historyTitle}
        </span>
        {history.length > 0 ? (
          <button
            onClick={onClearHistory}
            className="w-8 h-8 rounded-full bg-[#240D11] text-[#FF385C] border border-[#FF385C]/40 hover:bg-[#340D15] flex items-center justify-center active:scale-90 transition shadow"
            title={t.clearHistory}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        ) : (
          <div className="w-8 h-8" />
        )}
      </div>

      {/* History List */}
      <div className="flex flex-col gap-2 py-2 text-xs">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-neutral-500">
            <Trophy className="w-8 h-8 mb-2 opacity-30 text-[#CBFB5E]" />
            <p className="text-xs font-black uppercase tracking-wider text-neutral-400">{t.noMatches}</p>
            <p className="text-[10px] text-neutral-600">{t.noMatchesDesc}</p>
          </div>
        ) : (
          history.map((record) => (
            <div
              key={record.id}
              className="bg-[#121212] border border-[#222222] rounded-xl p-2.5 flex flex-col gap-1.5"
            >
              <div className="flex justify-between items-center text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-neutral-500" />
                  {record.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-neutral-500" />
                  {record.durationMinutes} min
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider pt-0.5">
                <span className={record.winner === 'team1' ? 'text-[#CBFB5E]' : 'text-neutral-400'}>
                  {record.team1Name} {record.winner === 'team1' && '🏆'}
                </span>
                <span className="text-[10px] text-neutral-600 font-black">VS</span>
                <span className={record.winner === 'team2' ? 'text-[#FF385C]' : 'text-neutral-400'}>
                  {record.team2Name} {record.winner === 'team2' && '🏆'}
                </span>
              </div>

              {/* Sets Result */}
              <div className="flex justify-center gap-2 font-digits text-xs font-black text-white bg-[#1A1A1A] border border-[#262626] py-1 rounded-lg">
                {record.sets.map((s, i) => (
                  <span key={i}>
                    {s.team1Games}:{s.team2Games}
                    {s.tieBreakScore && (
                      <sup className="text-[8px] ml-0.5 text-neutral-400">
                        ({s.tieBreakScore.team1}:{s.tieBreakScore.team2})
                      </sup>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Close button */}
      <div className="pb-3 pt-1 flex justify-center">
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
