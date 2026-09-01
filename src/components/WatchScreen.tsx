import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  Undo2,
  Settings as SettingsIcon,
  BarChart2,
  History,
  CircleDot,
  Zap,
  Play,
  Pause,
} from 'lucide-react';
import { MatchFormat, MatchSettings, MatchState, SavedMatchRecord, Team } from '../types';
import {
  createInitialMatchState,
  DEFAULT_SETTINGS,
  DEFAULT_TEAM1,
  DEFAULT_TEAM2,
  scorePoint,
} from '../utils/padelEngine';
import { soundEngine } from '../utils/audio';
import { haptics } from '../utils/haptics';
import { speechAnnouncer } from '../utils/speech';
import { SideChangeAlert } from './SideChangeAlert';
import { MatchStatsModal } from './MatchStatsModal';
import { SettingsModal } from './SettingsModal';
import { HistoryModal } from './HistoryModal';
import { VictoryModal } from './VictoryModal';
import { translations } from '../utils/i18n';

interface WatchScreenProps {
  watchSize?: '40mm' | '44mm';
  onToggleWatchSize?: (size: '40mm' | '44mm') => void;
  onBezelRotate?: (direction: 'cw' | 'ccw') => void;
}

export const WatchScreen: React.FC<WatchScreenProps> = ({ watchSize, onToggleWatchSize }) => {
  // Current time state
  const [currentTime, setCurrentTime] = useState<string>('');

  // Match settings with resilient fallback
  const [settings, setSettings] = useState<MatchSettings>(() => {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      const saved = localStorage.getItem('padel_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          voiceEnabled: false, // Turned off for watch convenience
        };
      }
    } catch (e) {
      console.warn('Failed to parse settings from storage, resetting to defaults', e);
    }
    return DEFAULT_SETTINGS;
  });

  // Teams
  const [team1, setTeam1] = useState<Team>(() => {
    try {
      const saved = localStorage.getItem('padel_team1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name?.includes('Команда') || parsed.shortName === 'МЫ') {
          return DEFAULT_TEAM1;
        }
        return { ...DEFAULT_TEAM1, ...parsed };
      }
      return DEFAULT_TEAM1;
    } catch {
      return DEFAULT_TEAM1;
    }
  });

  const [team2, setTeam2] = useState<Team>(() => {
    try {
      const saved = localStorage.getItem('padel_team2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name?.includes('Команда') || parsed.shortName === 'ОНИ') {
          return DEFAULT_TEAM2;
        }
        return { ...DEFAULT_TEAM2, ...parsed };
      }
      return DEFAULT_TEAM2;
    } catch {
      return DEFAULT_TEAM2;
    }
  });

  // Match state & history stack for Undo
  const [matchState, setMatchState] = useState<MatchState>(() => {
    try {
      const saved = localStorage.getItem('padel_match_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.team1?.shortName === 'МЫ') parsed.team1 = DEFAULT_TEAM1;
        if (parsed.team2?.shortName === 'ОНИ') parsed.team2 = DEFAULT_TEAM2;
        return parsed;
      }
      return createInitialMatchState(team1, team2);
    } catch {
      return createInitialMatchState(team1, team2);
    }
  });

  const [historyStack, setHistoryStack] = useState<MatchState[]>([]);

  // Saved match archives
  const [matchHistory, setMatchHistory] = useState<SavedMatchRecord[]>(() => {
    try {
      const saved = localStorage.getItem('padel_history_records');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI Modals
  const [activeModal, setActiveModal] = useState<'stats' | 'settings' | 'history' | null>(null);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  // Clock updater
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Match Duration Timer
  useEffect(() => {
    if (matchState.isMatchFinished || isTimerPaused) return;

    const timer = setInterval(() => {
      setMatchState((prev) => {
        const next = {
          ...prev,
          stats: {
            ...prev.stats,
            durationSeconds: prev.stats.durationSeconds + 1,
          },
        };
        localStorage.setItem('padel_match_state', JSON.stringify(next));
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [matchState.isMatchFinished, isTimerPaused]);

  // Save changes
  useEffect(() => {
    localStorage.setItem('padel_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('padel_team1', JSON.stringify(team1));
    localStorage.setItem('padel_team2', JSON.stringify(team2));
  }, [team1, team2]);

  // Handle Score Point
  const handleScorePoint = (scoringTeam: 'team1' | 'team2') => {
    if (matchState.isMatchFinished) return;

    // Push current state to undo history
    setHistoryStack((prev) => [...prev, JSON.parse(JSON.stringify(matchState))]);

    // Calculate next state
    const result = scorePoint(matchState, scoringTeam, settings);
    setMatchState(result.nextState);
    localStorage.setItem('padel_match_state', JSON.stringify(result.nextState));

    // Audio & Haptic Feedback (Crisp haptics & sound only, no voice interruptions)
    if (settings.vibrationEnabled) {
      if (result.event === 'matchWon' || result.event === 'setWon') {
        haptics.setWon();
      } else if (result.event === 'gameWon') {
        haptics.gameWon();
      } else if (result.goldenPointTriggered) {
        haptics.goldenPoint();
      } else if (result.sideChangeTriggered) {
        haptics.sideChange();
      } else {
        haptics.point();
      }
    }

    if (settings.soundEnabled) {
      if (result.event === 'matchWon' || result.event === 'setWon') {
        soundEngine.playSetWonSound();
      } else if (result.event === 'gameWon') {
        soundEngine.playGameWonSound();
      } else if (result.goldenPointTriggered) {
        soundEngine.playGoldenPointAlarm();
      } else {
        soundEngine.playPointSound(scoringTeam === 'team1');
      }
    }

    // Save to match archive if match completed
    if (result.event === 'matchWon') {
      const newRecord: SavedMatchRecord = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
        team1Name: team1.shortName,
        team2Name: team2.shortName,
        winner: scoringTeam,
        sets: result.nextState.sets,
        durationMinutes: Math.ceil(result.nextState.stats.durationSeconds / 60),
        stats: result.nextState.stats,
      };

      const updatedHistory = [newRecord, ...matchHistory];
      setMatchHistory(updatedHistory);
      localStorage.setItem('padel_history_records', JSON.stringify(updatedHistory));
    }
  };

  // Undo Last Point
  const handleUndo = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (historyStack.length === 0) return;

    const previousState = historyStack[historyStack.length - 1];
    setHistoryStack((prev) => prev.slice(0, prev.length - 1));
    setMatchState(previousState);
    localStorage.setItem('padel_match_state', JSON.stringify(previousState));

    if (settings.vibrationEnabled) haptics.undo();
    if (settings.soundEnabled) soundEngine.playUndoSound();
  };

  // Toggle Server Manually
  const handleToggleServer = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMatchState((prev) => {
      const next = {
        ...prev,
        servingTeam: prev.servingTeam === 'team1' ? ('team2' as const) : ('team1' as const),
      };
      localStorage.setItem('padel_match_state', JSON.stringify(next));
      return next;
    });
    if (settings.vibrationEnabled) haptics.point();
    if (settings.soundEnabled) soundEngine.playPointSound(true);
  };

  // Reset / New Match
  const handleStartNewMatch = () => {
    const freshState = createInitialMatchState(team1, team2);
    setMatchState(freshState);
    setHistoryStack([]);
    setShowConfirmReset(false);
    localStorage.setItem('padel_match_state', JSON.stringify(freshState));
    if (settings.soundEnabled) soundEngine.playGameWonSound();
  };

  // Format Duration string for top bar
  const durationMins = Math.floor(matchState.stats.durationSeconds / 60);
  const durationSecs = matchState.stats.durationSeconds % 60;
  const formattedDuration = `${durationMins}:${durationSecs < 10 ? '0' : ''}${durationSecs}`;

  const currentSet = matchState.sets[matchState.currentSetIndex] || { team1Games: 0, team2Games: 0 };
  const isTieBreak = matchState.currentGame.isTieBreak || matchState.currentGame.isSuperTieBreak;
  const currentLang = settings?.appLanguage || 'en';
  const t = translations[currentLang] || translations.en;
  const effectiveWatchSize = watchSize || settings?.watchSize || '44mm';
  const is40mm = effectiveWatchSize === '40mm';

  return (
    <div
      id="galaxy-watch-screen"
      className="relative w-full h-full aspect-square rounded-full bg-black text-white select-none overflow-hidden flex flex-col justify-between p-0 m-0"
      style={{
        boxShadow: 'inset 0 0 24px rgba(0,0,0,0.9)',
      }}
    >
      {/* 1. Top Smartwatch Control Bar (Centered Clock & Match Timer, nothing at edges) */}
      <div className="relative z-30 pt-2 flex flex-col items-center justify-center w-full flex-shrink-0">
        {/* Subtle Clock centered above Timer */}
        <span className="font-digits font-bold text-neutral-400 tracking-wider text-[10px] mb-0.5 opacity-90">
          {currentTime || '12:00'}
        </span>

        {/* Center: Match Timer Button (Same compact pill as Reset) */}
        <button
          onClick={() => setIsTimerPaused(!isTimerPaused)}
          className="flex items-center justify-center gap-1.5 bg-[#161616] hover:bg-[#262626] border-2 border-[#CBFB5E]/60 rounded-full text-white active:scale-95 transition shadow-lg shadow-black/80 ring-2 ring-[#CBFB5E]/20 h-8 px-3.5 cursor-pointer"
          title={`${t.matchTimer} (Tap to pause/resume)`}
        >
          {isTimerPaused ? (
            <Play className="w-3 h-3 text-[#CBFB5E] fill-[#CBFB5E]" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-[#CBFB5E] animate-pulse shadow-[0_0_8px_#CBFB5E]" />
          )}
          <span className="font-digits font-black tracking-wider text-white text-xs">
            {formattedDuration}
          </span>
        </button>
      </div>

      {/* 2. Main Large Touch Scoreboard (Two Symmetrical Hemispheres) */}
      <div className="relative flex-1 flex flex-col w-full my-0 z-10 overflow-hidden">
        {/* TOP HEMISPHERE: Team 1 (US / Neon Volt) */}
        <button
          id="tap-zone-team-1"
          onClick={() => handleScorePoint('team1')}
          className="flex-1 w-full bg-gradient-to-b from-[#CBFB5E]/12 via-[#CBFB5E]/4 to-transparent active:bg-[#CBFB5E]/20 transition-colors flex flex-col items-center justify-center px-4 relative group"
        >
          {/* Team 1 Header Info */}
          <div className="flex items-center justify-center gap-1.5 mb-0.5">
            <span className="font-black tracking-widest uppercase text-[#CBFB5E] text-xs font-heavy">
              {team1.shortName}
            </span>

            {/* Serving Ball Indicator */}
            {matchState.servingTeam === 'team1' ? (
              <div
                onClick={handleToggleServer}
                className="flex items-center gap-1 bg-[#CBFB5E] text-black rounded-full font-black tracking-wider cursor-pointer px-1.5 py-0.5 text-[8.5px] shadow-[0_0_8px_rgba(203,251,94,0.6)]"
                title="Team 1 Serving (tap to switch)"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-black" />
                <span>{t.serve}</span>
              </div>
            ) : (
              <div
                onClick={handleToggleServer}
                className="opacity-30 hover:opacity-100 p-0.5 cursor-pointer text-neutral-400 flex items-center justify-center rounded-full hover:bg-neutral-800"
                title="Switch serve to Team 1"
              >
                <CircleDot className="w-3 h-3" />
              </div>
            )}
          </div>

          {/* Big Digital Game Point for Team 1 */}
          <div className="font-digits font-black leading-none text-[#CBFB5E] tracking-tight drop-shadow-[0_0_15px_rgba(203,251,94,0.4)] group-active:scale-105 transition-transform text-5xl">
            {matchState.currentGame.team1}
          </div>
        </button>

        {/* CENTER DIVIDER & STATUS BADGE & PROMINENT UNDO, STATS & HISTORY BUTTONS */}
        <div className="relative z-20 flex items-center justify-between px-3.5 py-1.5 bg-[#0A0A0A] border-y border-[#1F1F1F]">
          {/* Undo Button (Left) */}
          <button
            onClick={handleUndo}
            disabled={historyStack.length === 0}
            className={`w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition cursor-pointer ${
              historyStack.length > 0
                ? 'bg-[#1C1C1C] text-white hover:bg-[#2A2A2A] border-2 border-[#CBFB5E]/50 shadow-md shadow-black'
                : 'bg-[#0E0E0E] text-neutral-700 border border-[#161616] cursor-not-allowed'
            }`}
            title={t.undo}
          >
            <Undo2 className="w-4.5 h-4.5" />
          </button>

          {/* Center Status & Match Games / Sets Tracker */}
          {matchState.isGoldenPoint ? (
            <div className="animate-golden bg-[#CBFB5E] text-black border border-white rounded-full flex items-center gap-1 px-2.5 py-1 shadow-[0_0_12px_#CBFB5E]">
              <Zap className="w-3 h-3 text-black fill-black" />
              <span className="text-[9px] font-black uppercase tracking-wider">
                {t.puntoDeOro}
              </span>
              <span className="font-digits font-black text-[10px]">
                ({currentSet.team1Games}:{currentSet.team2Games})
              </span>
            </div>
          ) : isTieBreak ? (
            <div className="bg-purple-950 border border-purple-400 rounded-full flex items-center gap-1 px-2.5 py-1 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-purple-300 shadow-[0_0_8px_#C084FC]" />
              <span className="text-[9px] font-black uppercase tracking-wider text-purple-200">
                {matchState.currentGame.isSuperTieBreak ? t.superTieBreak : t.tieBreak}
              </span>
              <span className="font-digits font-black text-purple-200 text-[10px]">
                ({currentSet.team1Games}:{currentSet.team2Games})
              </span>
            </div>
          ) : (
            <div className="text-neutral-300 font-bold uppercase tracking-wider flex items-center gap-1.5 bg-[#141414] rounded-full border border-[#282828] px-3 py-1 text-[11px]">
              {/* Previous Completed Sets if any */}
              {matchState.sets.slice(0, matchState.currentSetIndex).map((pastSet, pIdx) => (
                <span key={pIdx} className="font-digits font-bold text-neutral-500 flex items-center">
                  <span>{pastSet.team1Games}-{pastSet.team2Games}</span>
                  <span className="text-neutral-600 mx-0.5">•</span>
                </span>
              ))}

              {/* Current Active Set Label */}
              <span className="text-neutral-400 font-black">
                S{matchState.currentSetIndex + 1}:
              </span>

              {/* Current Set Games Score */}
              <span className="font-digits font-black flex items-center gap-0.5 text-xs">
                <span className={currentSet.team1Games > currentSet.team2Games ? 'text-[#CBFB5E]' : 'text-white'}>
                  {currentSet.team1Games}
                </span>
                <span className="text-neutral-500">:</span>
                <span className={currentSet.team2Games > currentSet.team1Games ? 'text-[#FF385C]' : 'text-white'}>
                  {currentSet.team2Games}
                </span>
              </span>
            </div>
          )}

          {/* Quick Action Buttons: Stats, History, Settings (Right) */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveModal('stats')}
              className="w-7 h-7 rounded-full bg-[#161616] hover:bg-[#262626] text-neutral-200 border border-neutral-700 flex items-center justify-center active:scale-90 transition cursor-pointer shadow-md"
              title={t.statistics}
            >
              <BarChart2 className="w-3.5 h-3.5 text-[#CBFB5E]" />
            </button>
            <button
              onClick={() => setActiveModal('history')}
              className="w-7 h-7 rounded-full bg-[#161616] hover:bg-[#262626] text-neutral-200 border border-neutral-700 flex items-center justify-center active:scale-90 transition cursor-pointer shadow-md"
              title={t.matchHistory}
            >
              <History className="w-3.5 h-3.5 text-neutral-300" />
            </button>
            <button
              onClick={() => setActiveModal('settings')}
              className="w-7 h-7 rounded-full bg-[#161616] hover:bg-[#262626] text-neutral-200 border border-neutral-700 flex items-center justify-center active:scale-90 transition cursor-pointer shadow-md"
              title={t.settings}
            >
              <SettingsIcon className="w-3.5 h-3.5 text-neutral-300" />
            </button>
          </div>
        </div>

        {/* BOTTOM HEMISPHERE: Team 2 (THEM / Coral Red) */}
        <button
          id="tap-zone-team-2"
          onClick={() => handleScorePoint('team2')}
          className="flex-1 w-full bg-gradient-to-t from-[#FF385C]/12 via-[#FF385C]/4 to-transparent active:bg-[#FF385C]/20 transition-colors flex flex-col items-center justify-center px-4 relative group"
        >
          {/* Big Digital Game Point for Team 2 */}
          <div className="font-digits font-black leading-none text-[#FF385C] tracking-tight drop-shadow-[0_0_15px_rgba(255,56,92,0.4)] group-active:scale-105 transition-transform text-5xl">
            {matchState.currentGame.team2}
          </div>

          {/* Team 2 Header Info */}
          <div className="flex items-center justify-center gap-1.5 mt-0.5">
            <span className="font-black tracking-widest uppercase text-[#FF385C] text-xs font-heavy">
              {team2.shortName}
            </span>

            {/* Serving Ball Indicator */}
            {matchState.servingTeam === 'team2' ? (
              <div
                onClick={handleToggleServer}
                className="flex items-center gap-1 bg-[#FF385C] text-white rounded-full font-black tracking-wider cursor-pointer px-1.5 py-0.5 text-[8.5px] shadow-[0_0_8px_rgba(255,56,92,0.6)]"
                title="Team 2 Serving (tap to switch)"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                <span>{t.serve}</span>
              </div>
            ) : (
              <div
                onClick={handleToggleServer}
                className="opacity-30 hover:opacity-100 p-0.5 cursor-pointer text-neutral-400 flex items-center justify-center rounded-full hover:bg-neutral-800"
                title="Switch serve to Team 2"
              >
                <CircleDot className="w-3 h-3" />
              </div>
            )}
          </div>
        </button>
      </div>

      {/* 3. Bottom Reset Button (Exact same compact pill size as the Timer button) */}
      <div className="relative z-30 w-full flex-shrink-0 flex items-center justify-center pb-3 pt-0.5">
        <button
          onClick={() => setShowConfirmReset(true)}
          className="flex items-center justify-center gap-1.5 bg-[#161616] hover:bg-[#262626] border-2 border-neutral-700 hover:border-[#CBFB5E]/60 rounded-full text-white active:scale-95 transition shadow-lg shadow-black/80 h-8 px-3.5 cursor-pointer"
          title={t.newMatch}
        >
          <RotateCcw className="w-3 h-3 text-[#CBFB5E]" />
          <span className="font-heavy font-black uppercase tracking-wider text-white text-xs">
            {t.newMatch}
          </span>
        </button>
      </div>

      {/* Confirmation Modal for Reset */}
      {showConfirmReset && (
        <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 animate-scale-in">
          <div className={`bg-[#161616] border-2 border-[#FF385C]/60 rounded-3xl flex flex-col items-center text-center shadow-2xl ${
            is40mm ? 'p-4 max-w-[200px]' : 'p-5 max-w-[220px]'
          }`}>
            <div className="w-10 h-10 rounded-full bg-[#FF385C]/20 border border-[#FF385C]/50 flex items-center justify-center mb-2 text-[#FF385C]">
              <RotateCcw className="w-5 h-5" />
            </div>
            <span className="text-white font-black text-sm uppercase tracking-wider mb-1">
              {t.resetConfirm}
            </span>
            <span className="text-neutral-400 text-[10px] leading-tight mb-4">
              {currentLang === 'ru' ? 'Сбросить текущий счёт матча?' : currentLang === 'es' ? '¿Reiniciar el partido actual?' : 'Reset current match score?'}
            </span>
            <div className="flex items-center justify-center gap-2.5 w-full">
              <button
                onClick={() => {
                  setShowConfirmReset(false);
                  handleStartNewMatch();
                }}
                className="flex-1 py-2.5 bg-[#FF385C] hover:bg-[#E0264B] text-white rounded-full text-xs font-black uppercase tracking-wider active:scale-95 shadow transition"
              >
                {t.yes}
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="flex-1 py-2.5 bg-[#262626] hover:bg-[#333333] text-neutral-300 rounded-full text-xs font-black uppercase tracking-wider active:scale-95 transition"
              >
                {t.no}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Side Change Alert Modal */}
      <SideChangeAlert
        show={matchState.showSideChangeAlert}
        state={matchState}
        appLanguage={currentLang}
        onDismiss={() => {
          setMatchState((prev) => {
            const next = { ...prev, showSideChangeAlert: false };
            localStorage.setItem('padel_match_state', JSON.stringify(next));
            return next;
          });
        }}
      />

      {/* 5. Victory celebration modal */}
      {matchState.isMatchFinished && (
        <VictoryModal
          state={matchState}
          appLanguage={currentLang}
          onNewMatch={handleStartNewMatch}
          onViewStats={() => setActiveModal('stats')}
        />
      )}

      {/* 6. Modals */}
      {activeModal === 'stats' && (
        <MatchStatsModal state={matchState} appLanguage={currentLang} onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'settings' && (
        <SettingsModal
          settings={{ ...settings, watchSize: effectiveWatchSize }}
          team1={team1}
          team2={team2}
          onUpdateSettings={(newS) => {
            setSettings((prev) => ({ ...prev, ...newS }));
            if (newS.watchSize && onToggleWatchSize) {
              onToggleWatchSize(newS.watchSize);
            }
          }}
          onUpdateTeams={(t1, t2) => {
            setTeam1(t1);
            setTeam2(t2);
            setMatchState((prev) => ({ ...prev, team1: t1, team2: t2 }));
          }}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'history' && (
        <HistoryModal
          history={matchHistory}
          appLanguage={currentLang}
          onClearHistory={() => {
            setMatchHistory([]);
            localStorage.removeItem('padel_history_records');
          }}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
};
