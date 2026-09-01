export type Language = 'en' | 'ru' | 'es';

export interface Translations {
  // Common & Top Bar
  matchTimer: string;
  statistics: string;
  settings: string;
  matchHistory: string;
  set: string;
  games: string;
  serve: string;
  puntoDeOro: string;
  tieBreak: string;
  superTieBreak: string;
  undo: string;
  resetConfirm: string;
  yes: string;
  no: string;
  newMatch: string;
  pointPlus: string;
  
  // Settings Modal
  settingsTitle: string;
  watchSizeTitle: string;
  watchSize44: string;
  watchSize40: string;
  buttonSize: string;
  largeButtons: string;
  compactButtons: string;
  appLanguage: string;
  goldenPointTitle: string;
  goldenPointDesc: string;
  matchFormatTitle: string;
  formatBestOf3: string;
  formatBestOf3Super: string;
  formatSingleSet: string;
  voiceScoring: string;
  voiceLangTitle: string;
  vibration: string;
  soundEffects: string;
  teamLabels: string;
  done: string;
  enabled: string;
  disabled: string;

  // Stats Modal
  matchStatsTitle: string;
  matchDuration: string;
  totalPoints: string;
  breakPointsWon: string;
  goldenPointsWon: string;
  longestStreak: string;
  setsWon: string;
  noStats: string;

  // History Modal
  historyTitle: string;
  clearHistory: string;
  noMatches: string;
  noMatchesDesc: string;
  matchWinner: string;

  // Victory Modal
  matchWon: string;
  congratulations: string;
  finalScore: string;
  viewStats: string;
  newMatchBtn: string;

  // Side Change
  sideChangeTitle: string;
  sideChangeDesc: string;
  continueBtn: string;

  // PWA Install
  installApp: string;
  installAppDesc: string;
  installedBadge: string;
  howToInstallTitle: string;
  howToInstallDesc: string;

  // App & Frame Guide
  watch8Title: string;
  subtitle: string;
  watchMode: string;
  screenMode: string;
  guideTitle: string;
  guideSub: string;
  howToPlay: string;
  tapHint: string;
  shortcutsHint: string;
  startPlaying: string;
  rule1Title: string;
  rule1Desc: string;
  rule2Title: string;
  rule2Desc: string;
  rule3Title: string;
  rule3Desc: string;
  rule4Title: string;
  rule4Desc: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    matchTimer: 'Match Timer',
    statistics: 'Statistics',
    settings: 'Settings',
    matchHistory: 'Match History',
    set: 'Set',
    games: 'GAMES',
    serve: 'SERVE',
    puntoDeOro: 'PUNTO DE ORO',
    tieBreak: 'TIE-BREAK',
    superTieBreak: 'SUPER TIE-BREAK',
    undo: 'Undo',
    resetConfirm: 'Reset?',
    yes: 'Yes',
    no: 'No',
    newMatch: 'Reset',
    pointPlus: '+1 PT',

    settingsTitle: 'Settings',
    watchSizeTitle: 'Screen Size',
    watchSize44: '44mm Large',
    watchSize40: '40mm Compact',
    buttonSize: 'Button Sizing',
    largeButtons: 'Large',
    compactButtons: 'Compact',
    appLanguage: 'Language',
    goldenPointTitle: 'Punto de Oro',
    goldenPointDesc: 'Deciding golden point at 40:40',
    matchFormatTitle: 'Match Format',
    formatBestOf3: 'Best of 3 Sets',
    formatBestOf3Super: 'Best of 3 (Super TB)',
    formatSingleSet: 'Single Set (1 Set)',
    voiceScoring: 'Voice Scoring',
    voiceLangTitle: 'Voice Accent',
    vibration: 'Vibration',
    soundEffects: 'Sound FX',
    teamLabels: 'Team Labels',
    done: 'Done',
    enabled: 'On',
    disabled: 'Off',

    matchStatsTitle: 'Match Stats',
    matchDuration: 'Match Duration',
    totalPoints: 'Total Points Won',
    breakPointsWon: 'Break Points Converted',
    goldenPointsWon: 'Golden Points Won',
    longestStreak: 'Longest Streak',
    setsWon: 'Sets Won',
    noStats: 'No stats recorded yet.',

    historyTitle: 'Match History',
    clearHistory: 'Clear History',
    noMatches: 'No Matches Saved',
    noMatchesDesc: 'Completed matches will appear here automatically.',
    matchWinner: 'Winner',

    matchWon: 'VICTORY!',
    congratulations: 'Match Completed',
    finalScore: 'Final Score',
    viewStats: 'Stats',
    newMatchBtn: 'New Match',

    sideChangeTitle: 'Change Sides!',
    sideChangeDesc: 'Switch ends of the court.',
    continueBtn: 'Continue',

    installApp: 'Install App (PWA / APK)',
    installAppDesc: 'Install on Samsung Galaxy Watch, Wear OS, or Android phone',
    installedBadge: 'App Installed (Standalone)',
    howToInstallTitle: 'How to install on Watch / Phone',
    howToInstallDesc: 'Open in Samsung Internet or Chrome browser on your watch or phone, tap menu (...) and select "Add to Home screen" or "Install App".',

    watch8Title: 'Galaxy Watch 8 Padel',
    subtitle: 'Punto de Oro • Tie-break • Side Changes • Wear OS',
    watchMode: 'Watch 8',
    screenMode: 'Screen',
    guideTitle: 'Galaxy Watch Guide',
    guideSub: 'Padel Tennis Match Tracker',
    howToPlay: 'How to score on Galaxy Watch 8',
    tapHint: 'Tap the top or bottom half of the watch screen to score points',
    shortcutsHint: 'Keyboard shortcuts: [1] Team 1 (Volt), [2] Team 2 (Coral), [U] Undo',
    startPlaying: 'Start Playing',
    rule1Title: '1-Tap Scoring on Watch',
    rule1Desc: 'Top half of watch face (Volt) = Point for Team 1. Bottom half (Coral) = Point for Team 2.',
    rule2Title: 'Punto de Oro (Golden Point)',
    rule2Desc: 'At 40:40 (Deuce), the app triggers sudden-death golden point (Premier Padel / FIP standard).',
    rule3Title: 'Haptics & Audio Scoring',
    rule3Desc: 'The watch vibrates with custom pulse patterns and announces current scores out loud.',
    rule4Title: 'Instant Undo',
    rule4Desc: 'Center undo button allows you to instantly revert any mis-tapped score.',
  },
  ru: {
    matchTimer: 'Таймер матча',
    statistics: 'Статистика',
    settings: 'Настройки',
    matchHistory: 'История матчей',
    set: 'Сет',
    games: 'ГЕЙМЫ',
    serve: 'ПОДАЧА',
    puntoDeOro: 'ЗОЛОТОЕ ОЧКО',
    tieBreak: 'ТАЙ-БРЕЙК',
    superTieBreak: 'СУПЕР ТАЙ-БРЕЙК',
    undo: 'Отмена',
    resetConfirm: 'Сбросить?',
    yes: 'Да',
    no: 'Нет',
    newMatch: 'Новый матч',
    pointPlus: '+1 ОЧКО',

    settingsTitle: 'Настройки',
    watchSizeTitle: 'Размер экрана',
    watchSize44: '44 мм (Большой)',
    watchSize40: '40 мм (Компактный)',
    buttonSize: 'Размер кнопок',
    largeButtons: 'Большие',
    compactButtons: 'Компактные',
    appLanguage: 'Язык интерфейса',
    goldenPointTitle: 'Punto de Oro',
    goldenPointDesc: 'Решающее очко при счёте 40:40',
    matchFormatTitle: 'Формат матча',
    formatBestOf3: 'Из 3 сетов',
    formatBestOf3Super: '3 сета (Супер ТБ)',
    formatSingleSet: '1 сет (Один сет)',
    voiceScoring: 'Озвучка счёта',
    voiceLangTitle: 'Язык озвучки',
    vibration: 'Вибрация',
    soundEffects: 'Звуки',
    teamLabels: 'Имена команд',
    done: 'Готово',
    enabled: 'Вкл',
    disabled: 'Выкл',

    matchStatsTitle: 'Статистика матча',
    matchDuration: 'Длительность',
    totalPoints: 'Всего очков',
    breakPointsWon: 'Брейк-поинты',
    goldenPointsWon: 'Золотые очки',
    longestStreak: 'Лучшая серия очков',
    setsWon: 'Выиграно сетов',
    noStats: 'Пока нет данных.',

    historyTitle: 'История матчей',
    clearHistory: 'Очистить',
    noMatches: 'Нет сыгранных матчей',
    noMatchesDesc: 'Завершённые матчи будут сохраняться здесь.',
    matchWinner: 'Победитель',

    matchWon: 'ПОБЕДА!',
    congratulations: 'Матч завершён',
    finalScore: 'Финальный счёт',
    viewStats: 'Статистика',
    newMatchBtn: 'Новый матч',

    sideChangeTitle: 'Смена сторон!',
    sideChangeDesc: 'Перейдите на другую сторону корта.',
    continueBtn: 'Продолжить',

    installApp: 'Установить приложение (PWA / APK)',
    installAppDesc: 'Установка на Samsung Galaxy Watch, Wear OS или Android смартфон',
    installedBadge: 'Приложение установлено',
    howToInstallTitle: 'Как установить на часы или телефон',
    howToInstallDesc: 'Откройте ссылку в браузере Samsung Internet или Chrome на часах/телефоне, нажмите меню (...) и выберите «Добавить на главный экран» или «Установить».',

    watch8Title: 'Galaxy Watch 8 Padel',
    subtitle: 'Punto de Oro • Тай-брейк • Смена сторон • Wear OS',
    watchMode: 'Корпус 8',
    screenMode: 'Экран',
    guideTitle: 'Инструкция Galaxy Watch',
    guideSub: 'Счётчик матчей для падел-тенниса',
    howToPlay: 'Как управлять на Galaxy Watch 8',
    tapHint: 'Нажимайте на верхнюю или нижнюю половину экрана для счёта',
    shortcutsHint: 'Горячие клавиши: [1] Команда 1, [2] Команда 2, [U] Отмена',
    startPlaying: 'Начать игру',
    rule1Title: '1 касание по экрану',
    rule1Desc: 'Верхняя половина (Volt) — очко Команде 1. Нижняя половина (Coral) — очко Команде 2.',
    rule2Title: 'Правило Punto de Oro',
    rule2Desc: 'При 40:40 разыгрывается решающее золотое очко (стандарт Premier Padel / FIP).',
    rule3Title: 'Вибрация и Озвучка',
    rule3Desc: 'Часы тактильно вибрируют при каждом начислении очка и озвучивают текущий счёт.',
    rule4Title: 'Мгновенная отмена (Undo)',
    rule4Desc: 'Кнопка по центру позволяет мгновенно вернуть ошибочно нажатое очко.',
  },
  es: {
    matchTimer: 'Tiempo de Partido',
    statistics: 'Estadísticas',
    settings: 'Ajustes',
    matchHistory: 'Historial',
    set: 'Set',
    games: 'JUEGOS',
    serve: 'SAQUE',
    puntoDeOro: 'PUNTO DE ORO',
    tieBreak: 'TIE-BREAK',
    superTieBreak: 'SÚPER TIE-BREAK',
    undo: 'Deshacer',
    resetConfirm: '¿Reiniciar?',
    yes: 'Sí',
    no: 'No',
    newMatch: 'Nuevo Partido',
    pointPlus: '+1 PTO',

    settingsTitle: 'Ajustes',
    watchSizeTitle: 'Tamaño Pantalla',
    watchSize44: '44 mm Grande',
    watchSize40: '40 mm Compacto',
    buttonSize: 'Tamaño Botones',
    largeButtons: 'Grandes',
    compactButtons: 'Compacto',
    appLanguage: 'Idioma',
    goldenPointTitle: 'Punto de Oro',
    goldenPointDesc: 'Punto decisivo con 40:40',
    matchFormatTitle: 'Formato de Partido',
    formatBestOf3: 'Mejor de 3 sets',
    formatBestOf3Super: 'Mejor de 3 (Súper TB)',
    formatSingleSet: 'Un solo set',
    voiceScoring: 'Voz del Marcador',
    voiceLangTitle: 'Idioma de Voz',
    vibration: 'Vibración',
    soundEffects: 'Sonidos',
    teamLabels: 'Nombres Equipos',
    done: 'Listo',
    enabled: 'Activado',
    disabled: 'Desactivado',

    matchStatsTitle: 'Estadísticas',
    matchDuration: 'Duración',
    totalPoints: 'Puntos Totales',
    breakPointsWon: 'Puntos de Break',
    goldenPointsWon: 'Puntos de Oro Ganados',
    longestStreak: 'Mayor Racha',
    setsWon: 'Sets Ganados',
    noStats: 'Sin estadísticas todavía.',

    historyTitle: 'Historial',
    clearHistory: 'Borrar',
    noMatches: 'No hay partidos guardados',
    noMatchesDesc: 'Los partidos finalizados aparecerán aquí.',
    matchWinner: 'Ganador',

    matchWon: '¡VICTORIA!',
    congratulations: 'Partido Finalizado',
    finalScore: 'Resultado Final',
    viewStats: 'Estadísticas',
    newMatchBtn: 'Nuevo',

    sideChangeTitle: '¡Cambio de Pista!',
    sideChangeDesc: 'Cambien de lado de la pista.',
    continueBtn: 'Continuar',

    installApp: 'Instalar Aplicación (PWA / APK)',
    installAppDesc: 'Instalar en Samsung Galaxy Watch, Wear OS o teléfono Android',
    installedBadge: 'Aplicación instalada',
    howToInstallTitle: 'Cómo instalar en reloj / teléfono',
    howToInstallDesc: 'Abre en Samsung Internet o Chrome en tu reloj/teléfono, toca el menú (...) y selecciona "Añadir a pantalla de inicio" o "Instalar".',

    watch8Title: 'Galaxy Watch 8 Padel',
    subtitle: 'Punto de Oro • Tie-break • Cambio de lado • Wear OS',
    watchMode: 'Reloj 8',
    screenMode: 'Pantalla',
    guideTitle: 'Guía Galaxy Watch',
    guideSub: 'Marcador de Pádel',
    howToPlay: 'Cómo jugar con Galaxy Watch 8',
    tapHint: 'Toca la mitad superior o inferior para sumar puntos',
    shortcutsHint: 'Atajos: [1] Equipo 1, [2] Equipo 2, [U] Deshacer',
    startPlaying: 'Empezar',
    rule1Title: 'Puntuación con 1 Toque',
    rule1Desc: 'Mitad superior (Volt) = Punto Equipo 1. Mitad inferior (Coral) = Punto Equipo 2.',
    rule2Title: 'Punto de Oro',
    rule2Desc: 'Con 40:40 se juega punto de oro decisivo (estándar Premier Padel / FIP).',
    rule3Title: 'Vibración y Audio',
    rule3Desc: 'El reloj vibra con patrones táctiles y canta el marcador por voz.',
    rule4Title: 'Deshacer Rápido',
    rule4Desc: 'El botón central permite corregir cualquier punto inmediatamente.',
  },
};
