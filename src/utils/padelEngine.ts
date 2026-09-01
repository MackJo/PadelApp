import {
  GameScore,
  MatchFormat,
  MatchSettings,
  MatchState,
  MatchStats,
  PadelPoint,
  SetScore,
  Team,
} from '../types';

export const DEFAULT_TEAM1: Team = {
  id: 'team1',
  name: 'Team 1 (US)',
  shortName: 'US',
  color: '#CBFB5E', // Neon Volt (Bold Theme)
  players: ['Player 1', 'Player 2'],
};

export const DEFAULT_TEAM2: Team = {
  id: 'team2',
  name: 'Team 2 (THEM)',
  shortName: 'THEM',
  color: '#FF385C', // Vibrant Coral Pink
  players: ['Opponent 1', 'Opponent 2'],
};

export const DEFAULT_SETTINGS: MatchSettings = {
  goldenPoint: true, // WPT / Premier Padel standard
  format: 'bestOf3',
  soundEnabled: true,
  voiceEnabled: false, // Disabled for fast silent watch gameplay
  voiceLang: 'en-US',
  vibrationEnabled: true,
  screenAlwaysOn: true,
  watchSize: '44mm',
  highContrast: true,
  buttonSize: 'large',
  appLanguage: 'ru', // Default to Russian as requested by user
};

const POINT_SEQUENCE: PadelPoint[] = ['0', '15', '30', '40'];

export function createInitialMatchState(
  team1: Team = DEFAULT_TEAM1,
  team2: Team = DEFAULT_TEAM2
): MatchState {
  const initialSet: SetScore = {
    team1Games: 0,
    team2Games: 0,
  };

  const initialGame: GameScore = {
    team1: '0',
    team2: '0',
    isTieBreak: false,
    isSuperTieBreak: false,
  };

  const initialStats: MatchStats = {
    totalPointsTeam1: 0,
    totalPointsTeam2: 0,
    goldenPointsPlayed: 0,
    goldenPointsWonTeam1: 0,
    goldenPointsWonTeam2: 0,
    breakPointsOpportunitiesTeam1: 0,
    breakPointsConvertedTeam1: 0,
    breakPointsOpportunitiesTeam2: 0,
    breakPointsConvertedTeam2: 0,
    longestGamePoints: 0,
    totalGamesPlayed: 0,
    startTime: Date.now(),
    durationSeconds: 0,
  };

  return {
    team1,
    team2,
    currentSetIndex: 0,
    sets: [initialSet],
    currentGame: initialGame,
    servingTeam: 'team1',
    servingPlayerIndex: 0,
    isMatchFinished: false,
    showSideChangeAlert: false,
    isGoldenPoint: false,
    stats: initialStats,
    lastActionDescription: 'Match Started',
  };
}

export interface PointResult {
  nextState: MatchState;
  event: 'point' | 'gameWon' | 'setWon' | 'matchWon';
  scoringTeam: 'team1' | 'team2';
  isBreak: boolean;
  sideChangeTriggered: boolean;
  goldenPointTriggered: boolean;
}

/**
 * Pure function to calculate state when a point is scored in padel
 */
export function scorePoint(
  currentState: MatchState,
  scoringTeam: 'team1' | 'team2',
  settings: MatchSettings
): PointResult {
  if (currentState.isMatchFinished) {
    return {
      nextState: currentState,
      event: 'point',
      scoringTeam,
      isBreak: false,
      sideChangeTriggered: false,
      goldenPointTriggered: false,
    };
  }

  const state = JSON.parse(JSON.stringify(currentState)) as MatchState;
  const receivingTeam = scoringTeam === 'team1' ? 'team2' : 'team1';
  const isServerScoring = currentState.servingTeam === scoringTeam;

  // Update total points stats
  if (scoringTeam === 'team1') {
    state.stats.totalPointsTeam1 += 1;
  } else {
    state.stats.totalPointsTeam2 += 1;
  }

  let event: 'point' | 'gameWon' | 'setWon' | 'matchWon' = 'point';
  let isBreak = false;
  let sideChangeTriggered = false;
  let goldenPointTriggered = false;

  const currentSet = state.sets[state.currentSetIndex];
  const currentGame = state.currentGame;

  // Check if we are in Tie-Break or Super Tie-Break
  if (currentGame.isTieBreak || currentGame.isSuperTieBreak) {
    const targetPoints = currentGame.isSuperTieBreak ? 10 : 7;
    const currentScore1 = (currentGame.team1 as number) || 0;
    const currentScore2 = (currentGame.team2 as number) || 0;

    const newScore1 = scoringTeam === 'team1' ? currentScore1 + 1 : currentScore1;
    const newScore2 = scoringTeam === 'team2' ? currentScore2 + 1 : currentScore2;

    currentGame.team1 = newScore1;
    currentGame.team2 = newScore2;

    const totalPoints = newScore1 + newScore2;

    // Tie-break side change every 6 points (6, 12, 18, ...)
    if (totalPoints % 6 === 0 && totalPoints > 0) {
      sideChangeTriggered = true;
      state.showSideChangeAlert = true;
    }

    // Tie-break serving alternation: 1st point server 1, then every 2 points switch
    // Point 1: Player A. Point 2 & 3: Player B. Point 4 & 5: Player A...
    const pointNumber = totalPoints;
    const isOddRotation = Math.floor((pointNumber + 1) / 2) % 2 === 1;
    state.servingTeam = isOddRotation ? 'team2' : 'team1';

    // Check if Tie-break won
    const leaderScore = scoringTeam === 'team1' ? newScore1 : newScore2;
    const trailerScore = scoringTeam === 'team1' ? newScore2 : newScore1;

    if (leaderScore >= targetPoints && leaderScore - trailerScore >= 2) {
      // Tie break won! This finishes the set
      currentSet.tieBreakScore = {
        team1: newScore1,
        team2: newScore2,
      };

      if (scoringTeam === 'team1') {
        currentSet.team1Games += 1;
        currentSet.winner = 'team1';
      } else {
        currentSet.team2Games += 1;
        currentSet.winner = 'team2';
      }

      event = checkSetFinish(state, settings, scoringTeam);
    }
  } else {
    // Regular Padel Game
    const p1 = currentGame.team1 as PadelPoint;
    const p2 = currentGame.team2 as PadelPoint;

    // Check for Golden Point (Punto de Oro) scenario: 40-40 with golden point enabled
    if (state.isGoldenPoint) {
      // Whoever wins this point wins the game immediately!
      state.stats.goldenPointsPlayed += 1;
      if (scoringTeam === 'team1') {
        state.stats.goldenPointsWonTeam1 += 1;
      } else {
        state.stats.goldenPointsWonTeam2 += 1;
      }

      state.isGoldenPoint = false;
      event = handleGameWon(state, scoringTeam, settings);
      if (!isServerScoring) isBreak = true;
    } else if (settings.goldenPoint && ((p1 === '40' && p2 === '30' && scoringTeam === 'team2') || (p2 === '40' && p1 === '30' && scoringTeam === 'team1'))) {
      // Reaching 40-40 (Punto de Oro triggered!)
      currentGame.team1 = '40';
      currentGame.team2 = '40';
      state.isGoldenPoint = true;
      goldenPointTriggered = true;
      state.lastActionDescription = 'Golden Point! (Punto de Oro)';
    } else if (!settings.goldenPoint && p1 === '40' && p2 === '40') {
      // Standard Advantage rule
      if (scoringTeam === 'team1') {
        currentGame.team1 = 'AD';
        currentGame.team2 = '40';
        state.lastActionDescription = `Advantage ${state.team1.shortName}`;
      } else {
        currentGame.team1 = '40';
        currentGame.team2 = 'AD';
        state.lastActionDescription = `Advantage ${state.team2.shortName}`;
      }
    } else if (!settings.goldenPoint && (p1 === 'AD' || p2 === 'AD')) {
      // An Advantage was held
      if ((p1 === 'AD' && scoringTeam === 'team1') || (p2 === 'AD' && scoringTeam === 'team2')) {
        event = handleGameWon(state, scoringTeam, settings);
        if (!isServerScoring) isBreak = true;
      } else {
        // Back to deuce (40-40)
        currentGame.team1 = '40';
        currentGame.team2 = '40';
        state.lastActionDescription = 'Deuce (40:40)';
      }
    } else {
      // Standard progression: 0 -> 15 -> 30 -> 40 -> Game
      const currentPoint = scoringTeam === 'team1' ? p1 : p2;
      const otherPoint = scoringTeam === 'team1' ? p2 : p1;

      if (currentPoint === '40') {
        // Game won!
        event = handleGameWon(state, scoringTeam, settings);
        if (!isServerScoring) isBreak = true;
      } else {
        const nextPoint = getNextPadelPoint(currentPoint);
        if (scoringTeam === 'team1') {
          currentGame.team1 = nextPoint;
        } else {
          currentGame.team2 = nextPoint;
        }

        // Check if this reached Golden Point (40:40)
        if (settings.goldenPoint && currentGame.team1 === '40' && currentGame.team2 === '40') {
          state.isGoldenPoint = true;
          goldenPointTriggered = true;
          state.lastActionDescription = 'Golden Point! (Punto de Oro)';
        } else {
          state.lastActionDescription = `Point ${scoringTeam === 'team1' ? state.team1.shortName : state.team2.shortName}`;
        }
      }
    }
  }

  return {
    nextState: state,
    event,
    scoringTeam,
    isBreak,
    sideChangeTriggered: sideChangeTriggered || state.showSideChangeAlert,
    goldenPointTriggered,
  };
}

function getNextPadelPoint(point: PadelPoint): PadelPoint {
  switch (point) {
    case '0':
      return '15';
    case '15':
      return '30';
    case '30':
      return '40';
    default:
      return '40';
  }
}

function handleGameWon(
  state: MatchState,
  winningTeam: 'team1' | 'team2',
  settings: MatchSettings
): 'gameWon' | 'setWon' | 'matchWon' {
  const currentSet = state.sets[state.currentSetIndex];
  state.stats.totalGamesPlayed += 1;

  if (winningTeam === 'team1') {
    currentSet.team1Games += 1;
    if (state.servingTeam === 'team2') {
      state.stats.breakPointsConvertedTeam1 += 1;
    }
  } else {
    currentSet.team2Games += 1;
    if (state.servingTeam === 'team1') {
      state.stats.breakPointsConvertedTeam2 += 1;
    }
  }

  // Reset current game score
  state.currentGame = {
    team1: '0',
    team2: '0',
    isTieBreak: false,
    isSuperTieBreak: false,
  };
  state.isGoldenPoint = false;

  // Switch serving team
  state.servingTeam = state.servingTeam === 'team1' ? 'team2' : 'team1';
  // Toggle serving player index every 2 service games for the team
  if (state.servingTeam === 'team1') {
    state.servingPlayerIndex = state.servingPlayerIndex === 0 ? 1 : 0;
  }

  // Check if side change is needed in regular games:
  // Odd total games in the set (1, 3, 5, 7, 9...)
  const totalGamesInSet = currentSet.team1Games + currentSet.team2Games;
  if (totalGamesInSet % 2 === 1) {
    state.showSideChangeAlert = true;
  }

  // Check if Set is Won or Tiebreak is needed
  const g1 = currentSet.team1Games;
  const g2 = currentSet.team2Games;

  // Check if 6-6 -> Tie Break
  if (g1 === 6 && g2 === 6) {
    state.currentGame.isTieBreak = true;
    state.currentGame.team1 = 0;
    state.currentGame.team2 = 0;
    state.lastActionDescription = 'Tie-break!';
    return 'gameWon';
  }

  // Check standard Set Win: 6 or 7 games with 2 games lead (e.g. 6-0, 6-4, 7-5)
  if ((g1 >= 6 && g1 - g2 >= 2) || (g2 >= 6 && g2 - g1 >= 2) || g1 === 7 || g2 === 7) {
    currentSet.winner = g1 > g2 ? 'team1' : 'team2';
    return checkSetFinish(state, settings, winningTeam);
  }

  state.lastActionDescription = `Game ${winningTeam === 'team1' ? state.team1.shortName : state.team2.shortName}`;
  return 'gameWon';
}

function checkSetFinish(
  state: MatchState,
  settings: MatchSettings,
  winningTeam: 'team1' | 'team2'
): 'setWon' | 'matchWon' {
  // Count sets won by each team
  let setsWon1 = 0;
  let setsWon2 = 0;

  state.sets.forEach((s) => {
    if (s.winner === 'team1') setsWon1++;
    if (s.winner === 'team2') setsWon2++;
  });

  const requiredSets = settings.format === 'singleSet' ? 1 : 2;

  if (setsWon1 >= requiredSets || setsWon2 >= requiredSets) {
    // Match finished!
    state.isMatchFinished = true;
    state.matchWinner = setsWon1 > setsWon2 ? 'team1' : 'team2';
    state.lastActionDescription = `Winner: ${state.matchWinner === 'team1' ? state.team1.name : state.team2.name}!`;
    return 'matchWon';
  }

  // Start next set!
  state.currentSetIndex += 1;
  const isFinalSetSuperTieBreak = settings.format === 'bestOf3SuperTiebreak' && state.currentSetIndex === 2;

  state.sets.push({
    team1Games: 0,
    team2Games: 0,
  });

  if (isFinalSetSuperTieBreak) {
    state.currentGame = {
      team1: 0,
      team2: 0,
      isTieBreak: true,
      isSuperTieBreak: true,
    };
    state.lastActionDescription = 'Super Tie-break (10 points)!';
  } else {
    state.currentGame = {
      team1: '0',
      team2: '0',
      isTieBreak: false,
      isSuperTieBreak: false,
    };
    state.lastActionDescription = `Set ${state.currentSetIndex + 1}`;
  }

  // Side change at end of set
  state.showSideChangeAlert = true;

  return 'setWon';
}
