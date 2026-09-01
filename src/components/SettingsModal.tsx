import React, { useState } from 'react';
import { ArrowLeft, Volume2, VolumeX, Vibrate, Zap, Trophy, UserCheck, MousePointerClick, Globe, Watch, Download, CheckCircle2, Info } from 'lucide-react';
import { MatchSettings, Team } from '../types';
import { translations } from '../utils/i18n';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface SettingsModalProps {
  settings: MatchSettings;
  team1: Team;
  team2: Team;
  onUpdateSettings: (newSettings: Partial<MatchSettings>) => void;
  onUpdateTeams: (team1: Team, team2: Team) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  team1,
  team2,
  onUpdateSettings,
  onUpdateTeams,
  onClose,
}) => {
  const [t1Name, setT1Name] = useState(team1?.shortName || 'US');
  const [t2Name, setT2Name] = useState(team2?.shortName || 'THEM');
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const currentLang = settings?.appLanguage || 'en';
  const t = translations[currentLang] || translations.en;
  const { isInstallable, isInstalled, install } = usePWAInstall();

  const handleSaveNames = () => {
    onUpdateTeams(
      { ...team1, shortName: t1Name || 'US' },
      { ...team2, shortName: t2Name || 'THEM' }
    );
  };

  return (
    <div className="absolute inset-0 z-50 rounded-full bg-black flex flex-col p-4 text-white select-none overflow-y-auto no-scrollbar">
      {/* Top Bar */}
      <div className="pt-2 flex items-center justify-between border-b border-[#1F1F1F] pb-2 px-2">
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-[#181818] hover:bg-[#262626] border border-[#2E2E2E] flex items-center justify-center text-white active:scale-90 transition shadow"
          title="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-xs font-black uppercase tracking-widest text-[#CBFB5E]">
          {t.settingsTitle}
        </span>
        <div className="w-8 h-8" />
      </div>

      {/* Settings list */}
      <div className="flex flex-col gap-2.5 py-2.5 text-xs">
        {/* App Language Switcher */}
        <div className="bg-[#121212] border border-[#222222] rounded-xl p-2.5 flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#CBFB5E]" />
            <span className="text-xs font-black uppercase tracking-wider text-white">{t.appLanguage}</span>
          </div>
          <div className="grid grid-cols-3 gap-1 text-[10px]">
            {(['en', 'ru', 'es'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  onUpdateSettings({ 
                    appLanguage: lang, 
                    voiceLang: lang === 'ru' ? 'ru-RU' : lang === 'es' ? 'es-ES' : 'en-US' 
                  });
                }}
                className={`py-1.5 rounded-lg font-black uppercase tracking-wider border transition flex items-center justify-center ${
                  (settings.appLanguage || 'en') === lang
                    ? 'bg-[#CBFB5E] border-[#CBFB5E] text-black shadow-md'
                    : 'bg-[#1C1C1C] border-[#2A2A2A] text-neutral-400 hover:text-white'
                }`}
              >
                {lang === 'en' ? 'English' : lang === 'ru' ? 'Русский' : 'Español'}
              </button>
            ))}
          </div>
        </div>

        {/* Watch Screen Size Switcher (44mm vs 40mm) */}
        <div className="bg-[#121212] border border-[#222222] rounded-xl p-2.5 flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Watch className="w-4 h-4 text-[#CBFB5E]" />
            <span className="text-xs font-black uppercase tracking-wider text-white">{t.watchSizeTitle}</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <button
              onClick={() => onUpdateSettings({ watchSize: '44mm' })}
              className={`py-2 px-2 rounded-lg font-black uppercase tracking-wider border transition flex items-center justify-center gap-1 ${
                (settings.watchSize || '44mm') === '44mm'
                  ? 'bg-[#CBFB5E] border-[#CBFB5E] text-black shadow-md'
                  : 'bg-[#1C1C1C] border-[#2A2A2A] text-neutral-400'
              }`}
            >
              <span>{t.watchSize44}</span>
            </button>
            <button
              onClick={() => onUpdateSettings({ watchSize: '40mm' })}
              className={`py-2 px-2 rounded-lg font-black uppercase tracking-wider border transition flex items-center justify-center gap-1 ${
                settings.watchSize === '40mm'
                  ? 'bg-[#CBFB5E] border-[#CBFB5E] text-black shadow-md'
                  : 'bg-[#1C1C1C] border-[#2A2A2A] text-neutral-400'
              }`}
            >
              <span>{t.watchSize40}</span>
            </button>
          </div>
        </div>

        {/* Button Size & Controls Style */}
        <div className="bg-[#121212] border border-[#222222] rounded-xl p-2.5 flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <MousePointerClick className="w-4 h-4 text-[#CBFB5E]" />
            <span className="text-xs font-black uppercase tracking-wider text-white">{t.buttonSize}</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <button
              onClick={() => onUpdateSettings({ buttonSize: 'large' })}
              className={`py-2 px-2 rounded-lg font-black uppercase tracking-wider border transition flex items-center justify-center gap-1 ${
                settings.buttonSize === 'large'
                  ? 'bg-[#CBFB5E] border-[#CBFB5E] text-black shadow-md'
                  : 'bg-[#1C1C1C] border-[#2A2A2A] text-neutral-400'
              }`}
            >
              <span>{t.largeButtons}</span>
            </button>
            <button
              onClick={() => onUpdateSettings({ buttonSize: 'compact' })}
              className={`py-2 px-2 rounded-lg font-black uppercase tracking-wider border transition flex items-center justify-center gap-1 ${
                settings.buttonSize === 'compact'
                  ? 'bg-[#CBFB5E] border-[#CBFB5E] text-black shadow-md'
                  : 'bg-[#1C1C1C] border-[#2A2A2A] text-neutral-400'
              }`}
            >
              <span>{t.compactButtons}</span>
            </button>
          </div>
        </div>

        {/* Punto de Oro / Golden Point */}
        <div className="bg-[#121212] border border-[#222222] rounded-xl p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#CBFB5E]/20 flex items-center justify-center text-[#CBFB5E]">
              <Zap className="w-4 h-4 fill-[#CBFB5E]" />
            </div>
            <div>
              <div className="text-xs font-black text-white leading-tight uppercase tracking-wider">{t.goldenPointTitle}</div>
              <div className="text-[10px] font-semibold text-neutral-400">{t.goldenPointDesc}</div>
            </div>
          </div>
          <button
            onClick={() => onUpdateSettings({ goldenPoint: !settings.goldenPoint })}
            className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
              settings.goldenPoint ? 'bg-[#CBFB5E]' : 'bg-[#262626]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-black transition-transform ${
                settings.goldenPoint ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Match Format */}
        <div className="bg-[#121212] border border-[#222222] rounded-xl p-2.5 flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#CBFB5E]" />
            <span className="text-xs font-black uppercase tracking-wider text-white">{t.matchFormatTitle}</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            <button
              onClick={() => onUpdateSettings({ format: 'bestOf3' })}
              className={`py-2 px-2 rounded-lg font-black uppercase tracking-wider border transition ${
                settings.format === 'bestOf3'
                  ? 'bg-[#CBFB5E] border-[#CBFB5E] text-black'
                  : 'bg-[#1C1C1C] border-[#2A2A2A] text-neutral-400'
              }`}
            >
              {t.formatBestOf3}
            </button>
            <button
              onClick={() => onUpdateSettings({ format: 'bestOf3SuperTiebreak' })}
              className={`py-2 px-2 rounded-lg font-black uppercase tracking-wider border transition ${
                settings.format === 'bestOf3SuperTiebreak'
                  ? 'bg-[#CBFB5E] border-[#CBFB5E] text-black'
                  : 'bg-[#1C1C1C] border-[#2A2A2A] text-neutral-400'
              }`}
            >
              {t.formatBestOf3Super}
            </button>
            <button
              onClick={() => onUpdateSettings({ format: 'singleSet' })}
              className={`py-2 px-2 rounded-lg font-black uppercase tracking-wider border transition col-span-2 ${
                settings.format === 'singleSet'
                  ? 'bg-[#CBFB5E] border-[#CBFB5E] text-black'
                  : 'bg-[#1C1C1C] border-[#2A2A2A] text-neutral-400'
              }`}
            >
              {t.formatSingleSet}
            </button>
          </div>
        </div>

        {/* Voice Announcements */}
        <div className="bg-[#121212] border border-[#222222] rounded-xl p-2.5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#CBFB5E]/20 flex items-center justify-center text-[#CBFB5E]">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-black text-white leading-tight uppercase tracking-wider">{t.voiceScoring}</div>
                <div className="text-[10px] font-semibold text-neutral-400">{t.voiceLangTitle}</div>
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ voiceEnabled: !settings.voiceEnabled })}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                settings.voiceEnabled ? 'bg-[#CBFB5E]' : 'bg-[#262626]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-black transition-transform ${
                  settings.voiceEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {settings.voiceEnabled && (
            <div className="flex gap-1.5 pt-1">
              {(['en-US', 'es-ES', 'ru-RU'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => onUpdateSettings({ voiceLang: lang })}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border transition ${
                    settings.voiceLang === lang
                      ? 'bg-[#CBFB5E] border-[#CBFB5E] text-black'
                      : 'bg-[#1C1C1C] border-[#2A2A2A] text-neutral-400'
                  }`}
                >
                  {lang === 'en-US' ? 'Eng' : lang === 'es-ES' ? 'Esp' : 'Rus'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Vibration & Sound toggles */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onUpdateSettings({ vibrationEnabled: !settings.vibrationEnabled })}
            className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition ${
              settings.vibrationEnabled
                ? 'bg-[#181818] border-[#CBFB5E] text-[#CBFB5E]'
                : 'bg-[#121212] border-[#222222] text-neutral-500'
            }`}
          >
            <Vibrate className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-wider">{t.vibration}</span>
            <span className="text-[9px] font-bold">
              {settings.vibrationEnabled ? t.enabled : t.disabled}
            </span>
          </button>

          <button
            onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
            className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition ${
              settings.soundEnabled
                ? 'bg-[#181818] border-[#CBFB5E] text-[#CBFB5E]'
                : 'bg-[#121212] border-[#222222] text-neutral-500'
            }`}
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="text-[10px] font-black uppercase tracking-wider">{t.soundEffects}</span>
            <span className="text-[9px] font-bold">
              {settings.soundEnabled ? t.enabled : t.disabled}
            </span>
          </button>
        </div>

        {/* Team Names */}
        <div className="bg-[#121212] border border-[#222222] rounded-xl p-2.5 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#CBFB5E]" />
            <span className="text-xs font-black uppercase tracking-wider text-white">{t.teamLabels}</span>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <span className="text-[9px] text-[#CBFB5E] font-black uppercase tracking-wider block mb-0.5">Team 1</span>
              <input
                type="text"
                maxLength={6}
                value={t1Name}
                onChange={(e) => setT1Name(e.target.value.toUpperCase())}
                onBlur={handleSaveNames}
                className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-lg px-2 py-1.5 text-xs text-white font-black uppercase text-center focus:border-[#CBFB5E] outline-none"
              />
            </div>
            <div className="flex-1">
              <span className="text-[9px] text-[#FF385C] font-black uppercase tracking-wider block mb-0.5">Team 2</span>
              <input
                type="text"
                maxLength={6}
                value={t2Name}
                onChange={(e) => setT2Name(e.target.value.toUpperCase())}
                onBlur={handleSaveNames}
                className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-lg px-2 py-1.5 text-xs text-white font-black uppercase text-center focus:border-[#FF385C] outline-none"
              />
            </div>
          </div>
        </div>

        {/* PWA / App Installation */}
        <div className="bg-[#121212] border border-[#222222] rounded-xl p-2.5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-[#CBFB5E]" />
              <span className="text-xs font-black uppercase tracking-wider text-white">{t.installApp}</span>
            </div>
            {isInstalled ? (
              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#CBFB5E]/20 text-[#CBFB5E] border border-[#CBFB5E]/40 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {t.installedBadge}
              </span>
            ) : null}
          </div>

          <p className="text-[10px] text-neutral-400 leading-snug">
            {t.installAppDesc}
          </p>

          {!isInstalled && (
            <div className="flex flex-col gap-1.5 pt-1">
              {isInstallable && (
                <button
                  onClick={install}
                  className="w-full py-2 rounded-lg bg-[#CBFB5E] hover:bg-[#B5EB48] active:scale-95 text-black text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  {t.installApp}
                </button>
              )}

              <button
                onClick={() => setShowInstallGuide(!showInstallGuide)}
                className="w-full py-1.5 rounded-lg bg-[#1C1C1C] hover:bg-[#252525] border border-[#2A2A2A] text-neutral-300 text-[10px] font-bold tracking-wider transition flex items-center justify-center gap-1"
              >
                <Info className="w-3 h-3 text-[#CBFB5E]" />
                {t.howToInstallTitle}
              </button>

              {showInstallGuide && (
                <div className="p-2 rounded-lg bg-[#181818] border border-[#2E2E2E] text-[10px] text-neutral-300 space-y-1">
                  <p className="leading-tight">{t.howToInstallDesc}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Done button */}
      <div className="pb-3 pt-2 flex justify-center">
        <button
          onClick={() => {
            handleSaveNames();
            onClose();
          }}
          className="px-8 py-2 rounded-full bg-[#CBFB5E] hover:bg-[#B5EB48] active:scale-95 text-xs font-black uppercase tracking-wider text-black transition shadow-lg shadow-[#CBFB5E]/20"
        >
          {t.done}
        </button>
      </div>
    </div>
  );
};

