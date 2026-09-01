import { MatchState } from '../types';

/**
 * Speech synthesis for score announcement during active padel play
 */
class SpeechAnnouncer {
  private synth: SpeechSynthesis | null = null;
  private isSpeaking = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  private speak(text: string, lang: string = 'en-US') {
    if (!this.synth) return;
    try {
      this.synth.cancel(); // Stop any previous speech immediately
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 1.15; // Fast responsive rate for padel pace
      utterance.pitch = 1.0;

      // Find best matching voice if available
      const voices = this.synth.getVoices();
      const matchedVoice = voices.find(v => v.lang.toLowerCase().startsWith(lang.split('-')[0].toLowerCase()));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      this.isSpeaking = true;
      utterance.onend = () => {
        this.isSpeaking = false;
      };
      utterance.onerror = () => {
        this.isSpeaking = false;
      };

      this.synth.speak(utterance);
    } catch {
      this.isSpeaking = false;
    }
  }

  announceScore(
    state: MatchState,
    lang: 'ru-RU' | 'en-US' | 'es-ES' = 'en-US',
    _scoringTeam?: 'team1' | 'team2'
  ) {
    const { currentGame, team1, team2, isGoldenPoint } = state;

    if (lang === 'ru-RU') {
      if (isGoldenPoint) {
        this.speak('Золотое очко! Решающий мяч.', lang);
        return;
      }

      if (currentGame.isTieBreak || currentGame.isSuperTieBreak) {
        const t1 = currentGame.team1;
        const t2 = currentGame.team2;
        this.speak(`Тай-брейк: ${t1} — ${t2}`, lang);
        return;
      }

      const p1 = currentGame.team1;
      const p2 = currentGame.team2;

      if (p1 === 'AD') {
        this.speak(`Больше ${team1.shortName}`, lang);
      } else if (p2 === 'AD') {
        this.speak(`Больше ${team2.shortName}`, lang);
      } else if (p1 === p2 && p1 !== '0') {
        if (p1 === '40') {
          this.speak('Ровно, сорок-сорок', lang);
        } else {
          this.speak(`По ${p1}`, lang);
        }
      } else {
        const s1 = p1 === '0' ? 'ноль' : p1;
        const s2 = p2 === '0' ? 'ноль' : p2;
        this.speak(`${s1} : ${s2}`, lang);
      }
    } else if (lang === 'es-ES') {
      if (isGoldenPoint) {
        this.speak('¡Punto de Oro! Punto decisivo.', lang);
        return;
      }
      if (currentGame.isTieBreak || currentGame.isSuperTieBreak) {
        this.speak(`Tie-break: ${currentGame.team1} a ${currentGame.team2}`, lang);
        return;
      }
      const p1 = currentGame.team1;
      const p2 = currentGame.team2;

      if (p1 === 'AD') {
        this.speak(`Ventaja ${team1.shortName}`, lang);
      } else if (p2 === 'AD') {
        this.speak(`Ventaja ${team2.shortName}`, lang);
      } else if (p1 === p2 && p1 !== '0') {
        if (p1 === '40') {
          this.speak('Iguales', lang);
        } else {
          this.speak(`Iguales a ${p1}`, lang);
        }
      } else {
        const s1 = p1 === '0' ? 'cero' : p1;
        const s2 = p2 === '0' ? 'cero' : p2;
        this.speak(`${s1} - ${s2}`, lang);
      }
    } else {
      // Default: English (en-US)
      if (isGoldenPoint) {
        this.speak('Golden Point! Deciding point.', lang);
        return;
      }
      if (currentGame.isTieBreak || currentGame.isSuperTieBreak) {
        this.speak(`Tie break: ${currentGame.team1} - ${currentGame.team2}`, lang);
        return;
      }
      const p1 = currentGame.team1;
      const p2 = currentGame.team2;

      if (p1 === 'AD') {
        this.speak(`Advantage ${team1.shortName}`, lang);
      } else if (p2 === 'AD') {
        this.speak(`Advantage ${team2.shortName}`, lang);
      } else if (p1 === p2 && p1 !== '0') {
        if (p1 === '40') {
          this.speak('Deuce', lang);
        } else {
          this.speak(`${p1} All`, lang);
        }
      } else {
        const s1 = p1 === '0' ? 'Love' : p1;
        const s2 = p2 === '0' ? 'Love' : p2;
        this.speak(`${s1} - ${s2}`, lang);
      }
    }
  }

  announceGameWon(teamName: string, lang: 'ru-RU' | 'en-US' | 'es-ES' = 'en-US') {
    if (lang === 'ru-RU') {
      this.speak(`Гейм, ${teamName}!`, lang);
    } else if (lang === 'es-ES') {
      this.speak(`¡Juego, ${teamName}!`, lang);
    } else {
      this.speak(`Game, ${teamName}!`, lang);
    }
  }

  announceSetWon(teamName: string, setNumber: number, lang: 'ru-RU' | 'en-US' | 'es-ES' = 'en-US') {
    if (lang === 'ru-RU') {
      this.speak(`Сет ${setNumber} выиграли ${teamName}!`, lang);
    } else if (lang === 'es-ES') {
      this.speak(`¡Set ${setNumber} para ${teamName}!`, lang);
    } else {
      this.speak(`Set ${setNumber} for ${teamName}!`, lang);
    }
  }

  announceMatchWon(teamName: string, lang: 'ru-RU' | 'en-US' | 'es-ES' = 'en-US') {
    if (lang === 'ru-RU') {
      this.speak(`Матч окончен! Победители: ${teamName}!`, lang);
    } else if (lang === 'es-ES') {
      this.speak(`¡Partido ganado por ${teamName}!`, lang);
    } else {
      this.speak(`Match won by ${teamName}!`, lang);
    }
  }

  announceSideChange(lang: 'ru-RU' | 'en-US' | 'es-ES' = 'en-US') {
    if (lang === 'ru-RU') {
      this.speak(`Смена сторон!`, lang);
    } else if (lang === 'es-ES') {
      this.speak(`¡Cambio de lado!`, lang);
    } else {
      this.speak(`Change sides!`, lang);
    }
  }
}

export const speechAnnouncer = new SpeechAnnouncer();
