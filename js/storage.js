const FAVORITES_KEY = 'coursFavorites';
const MASTERY_KEY = 'coursMastery';
const HIGH_SCORES_KEY = 'gameHighScores';
const TOTAL_MP_KEY = 'total_mp';
const STATS_KEY = 'gameStats';
const ACTIVE_QUESTS_KEY = 'activeQuests'; // Key for active quests

// --- Utility to get today's date as a string ---
function getTodayDateString() {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format YYYY-MM-DD
}

// --- Favorite Functions (unchanged) ---
export function getFavorites() {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
}

export function addFavorite(courseId) {
    const favorites = getFavorites();
    if (!favorites.includes(courseId)) {
        favorites.push(courseId);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
}

export function removeFavorite(courseId) {
    let favorites = getFavorites();
    favorites = favorites.filter(id => id !== courseId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

// --- Mastery Functions (unchanged) ---
function getAllMastery() {
    const masteryData = localStorage.getItem(MASTERY_KEY);
    return masteryData ? JSON.parse(masteryData) : {};
}

export function getMastery(lessonId) {
    const allMastery = getAllMastery();
    return allMastery[lessonId] || 'm-undefined';
}

export function saveMastery(lessonId, status) {
    const allMastery = getAllMastery();
    allMastery[lessonId] = status;
    localStorage.setItem(MASTERY_KEY, JSON.stringify(allMastery));
}

// --- High Score Functions ---
function getHighScores() {
    const scores = localStorage.getItem(HIGH_SCORES_KEY);
    return scores ? JSON.parse(scores) : {};
}

function getModeSpecificKey(gameId, mode) {
    return `${gameId}_${mode || 'default'}`;
}

export function saveHighScore(gameId, mode, score) {
    const highScores = getHighScores();
    const key = getModeSpecificKey(gameId, mode);
    const currentHighScore = highScores[key] || 0;
    if (score > currentHighScore) {
        highScores[key] = score;
        localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(highScores));
    }
}

export function getHighScore(gameId, mode) {
    const highScores = getHighScores();
    const key = getModeSpecificKey(gameId, mode);
    return highScores[key] || 0;
}

export function getAllScores() {
    return getHighScores();
}

export function resetGameHighScores() {
    localStorage.removeItem(HIGH_SCORES_KEY);
}

// --- MP/Level Functions ---
export function getTotalMP() {
    const totalMP = localStorage.getItem(TOTAL_MP_KEY);
    return totalMP ? parseInt(totalMP, 10) : 0;
}

export function addMP(amount) {
    let totalMP = getTotalMP();
    totalMP += amount;
    localStorage.setItem(TOTAL_MP_KEY, totalMP);
    return totalMP;
}

// --- Stats Functions ---

/**
 * Retrieves all game stats from localStorage.
 * Resets daily stats (mpToday, gamesPlayedToday) if the date has changed.
 * @returns {object} The stats object.
 */
export function getGameStats() {
    const statsJSON = localStorage.getItem(STATS_KEY);
    let stats = statsJSON ? JSON.parse(statsJSON) : {
        gamesPlayed: 0,
        mpToday: 0,
        mpWeek: 0,
        mpMonth: 0,
        lastPlayedDate: '',
        lastPlayedWeek: -1,
        lastPlayedMonth: -1,
        gamesPlayedToday: [], 
        games: {} // Stockage des MP par jeu : { gameId: { total_mp: X, modes: { modeIndex: { mp: Y } } } }
    };
    
    // Initialiser 'games' pour les anciens utilisateurs
    if (!stats.games) stats.games = {};

    const now = new Date();
    const today = getTodayDateString();
    
    // Calcul de la semaine et du mois
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000));
    const currentWeek = Math.ceil((dayOfYear + startOfYear.getDay() + 1) / 7);
    const currentMonth = now.getMonth();

    let needsUpdate = false;

    // Reset journalier
    if (stats.lastPlayedDate !== today) {
        stats.mpToday = 0;
        stats.gamesPlayedToday = [];
        stats.lastPlayedDate = today;
        needsUpdate = true;
    }

    // Reset hebdomadaire
    if (stats.lastPlayedWeek !== currentWeek) {
        stats.mpWeek = 0;
        stats.lastPlayedWeek = currentWeek;
        needsUpdate = true;
    }

    // Reset mensuel
    if (stats.lastPlayedMonth !== currentMonth) {
        stats.mpMonth = 0;
        stats.lastPlayedMonth = currentMonth;
        needsUpdate = true;
    }

    if (needsUpdate) {
        localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    }
    
    return stats;
}

/**
 * Sauvegarde les MP gagnés pour un jeu et un mode spécifique
 */
export function saveGameMP(gameId, modeIndex, amount) {
    const stats = getGameStats();
    if (!stats.games[gameId]) stats.games[gameId] = { total_mp: 0, modes: {} };

    // Update global pour ce jeu
    stats.games[gameId].total_mp = (stats.games[gameId].total_mp || 0) + amount;

    // Update par mode
    if (modeIndex !== undefined && modeIndex !== null) {
        if (!stats.games[gameId].modes[modeIndex]) stats.games[gameId].modes[modeIndex] = { mp: 0 };
        stats.games[gameId].modes[modeIndex].mp = (stats.games[gameId].modes[modeIndex].mp || 0) + amount;
    }

    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}


/**
 * Logs a unique game played today for quest tracking.
 * @param {string} gameId - The ID of the game that was played.
 */
export function logPlayedGame(gameId) {
    if (!gameId) return;
    const stats = getGameStats();

    if (!stats.gamesPlayedToday.includes(gameId)) {
        stats.gamesPlayedToday.push(gameId);
        localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    }
}

/**
 * Updates the general game stats after a game is completed.
 */
export function updateStatsOnGameComplete(mpGained) {
    const stats = getGameStats();

    stats.gamesPlayed = (stats.gamesPlayed || 0) + 1;
    stats.mpToday = (stats.mpToday || 0) + mpGained;
    stats.mpWeek = (stats.mpWeek || 0) + mpGained;
    stats.mpMonth = (stats.mpMonth || 0) + mpGained;
    stats.lastPlayedDate = getTodayDateString();

    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

/**
 * Resets all game stats.
 */
export function resetGameStats() {
    localStorage.removeItem(STATS_KEY);
}


// --- Quest Functions ---

/**
 * Retrieves active quests from localStorage.
 * @returns {Array|null} The array of active quests or null.
 */
export function getActiveQuests() {
    const quests = localStorage.getItem(ACTIVE_QUESTS_KEY);
    return quests ? JSON.parse(quests) : null;
}

/**
 * Saves active quests to localStorage.
 * @param {Array} quests - The array of active quests to save.
 */
export function saveActiveQuests(quests) {
    localStorage.setItem(ACTIVE_QUESTS_KEY, JSON.stringify(quests));
}

// --- Auth Functions ---
const AUTH_KEY = 'cloud_session';

export function getAuthData() {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
}

export function saveAuthData(data) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(data));
}

export function clearAuthData() {
    localStorage.removeItem(AUTH_KEY);
}
