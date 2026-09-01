export type PadelPoint = '0' | '15' | '30' | '40' | 'AD';

export interface Player {
  id: string;
  name: string;
}

export interface Team {
  id: 'team1' | 'team2';
  name: string;
  shortName: string;
  color: string; // Tailwind color class or hex
  players: [string, string]; // Two players per team in padel
}

export type MatchFormat = 'bestOf3' | 'bestOf3SuperTiebreak' | 'singleSet' | 'proSet8';

export interface MatchSettings {
  goldenPoint: boolean; // Punto de Oro (true: no advantage at 40-40, receiver chooses side; false: standard advantage)
  format: MatchFormat;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  voiceLang: 'ru-RU' | 'en-US' | 'es-ES';
  vibrationEnabled: boolean;
  screenAlwaysOn: boolean;
  watchSize: '40mm' | '44mm';
  highContrast: boolean;
  buttonSize: 'compact' | 'large'; // Control button scale mode
  appLanguage: 'en' | 'ru' | 'es';
}

export interface GameScore {
  team1: PadelPoint | number; // number during tie-break
  team2: PadelPoint | number;
  isTieBreak: boolean;
  isSuperTieBreak: boolean;
}

export interface SetScore {
  team1Games: number;
  team2Games: number;
  tieBreakScore?: {
    team1: number;
    team2: number;
  };
  winner?: 'team1' | 'team2';
}

export interface MatchStats {
  totalPointsTeam1: number;
  totalPointsTeam2: number;
  goldenPointsPlayed: number;
  goldenPointsWonTeam1: number;
  goldenPointsWonTeam2: number;
  breakPointsOpportunitiesTeam1: number;
  breakPointsConvertedTeam1: number;
  breakPointsOpportunitiesTeam2: number;
  breakPointsConvertedTeam2: number;
  longestGamePoints: number;
  totalGamesPlayed: number;
  startTime: number;
  durationSeconds: number;
}

export interface MatchState {
  team1: Team;
  team2: Team;
  currentSetIndex: number; // 0, 1, 2
  sets: SetScore[];
  currentGame: GameScore;
  servingTeam: 'team1' | 'team2';
  servingPlayerIndex: 0 | 1; // 0 or 1 within serving team
  isMatchFinished: boolean;
  matchWinner?: 'team1' | 'team2';
  showSideChangeAlert: boolean;
  isGoldenPoint: boolean;
  stats: MatchStats;
  lastActionDescription?: string;
}

export interface SavedMatchRecord {
  id: string;
  date: string;
  team1Name: string;
  team2Name: string;
  winner: 'team1' | 'team2';
  sets: SetScore[];
  durationMinutes: number;
  stats: MatchStats;
}
