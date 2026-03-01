const FAVORITES_KEY = 'coursFavorites';
const MASTERY_KEY = 'coursMastery';
const HIGH_SCORES_KEY = 'gameHighScores';
const TOTAL_MP_KEY = 'total_mp';
const STATS_KEY = 'gameStats'; // New key for stats

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

// --- New Stats Functions ---

/**
 * Retrieves all game stats from localStorage.
 * Resets daily stats if the date has changed.
 * @returns {object} The stats object.
 */
export function getGameStats() {
    const statsJSON = localStorage.getItem(STATS_KEY);
    let stats = statsJSON ? JSON.parse(statsJSON) : { gamesPlayed: 0, mpToday: 0, lastPlayedDate: '' };

    // Reset daily stats if it's a new day
    const today = getTodayDateString();
    if (stats.lastPlayedDate !== today) {
        stats.mpToday = 0;
        stats.lastPlayedDate = today;
    }

    return stats;
}

/**
 * Updates the game stats after a game is completed.
 * @param {number} mpGained - The amount of MP gained in the last game.
 */
export function updateStatsOnGameComplete(mpGained) {
    const stats = getGameStats();
    
    stats.gamesPlayed = (stats.gamesPlayed || 0) + 1;
    stats.mpToday = (stats.mpToday || 0) + mpGained;
    stats.lastPlayedDate = getTodayDateString(); // Ensure date is always current

    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

/**
 * Resets all game stats.
 */
export function resetGameStats() {
    localStorage.removeItem(STATS_KEY);
}
