const STATS_KEY = 'gameStats';
const COURS_KEY = 'cours';
import { gamesData } from '../datas/games_data.js';

// --- Utility to get today's date as a string ---
function getTodayDateString() {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format YYYY-MM-DD
}

// --- Favorite Functions ---
export function getFavorites() {
    const cours = JSON.parse(localStorage.getItem(COURS_KEY)) || { favoris: [], maitrises: {} };
    return cours.favoris || [];
}

export function addFavorite(courseId) {
    const cours = JSON.parse(localStorage.getItem(COURS_KEY)) || { favoris: [], maitrises: {} };
    if (!cours.favoris) cours.favoris = [];
    if (!cours.favoris.includes(courseId)) {
        cours.favoris.push(courseId);
        localStorage.setItem(COURS_KEY, JSON.stringify(cours));
    }
}

export function removeFavorite(courseId) {
    const cours = JSON.parse(localStorage.getItem(COURS_KEY)) || { favoris: [], maitrises: {} };
    if (cours.favoris) {
        cours.favoris = cours.favoris.filter(id => id !== courseId);
        localStorage.setItem(COURS_KEY, JSON.stringify(cours));
    }
}

// --- Mastery Functions ---
function getAllMastery() {
    const cours = JSON.parse(localStorage.getItem(COURS_KEY)) || { favoris: [], maitrises: {} };
    return cours.maitrises || {};
}

export function getMastery(lessonId) {
    const allMastery = getAllMastery();
    return allMastery[lessonId] || 'm-undefined';
}

export function saveMastery(lessonId, status) {
    const cours = JSON.parse(localStorage.getItem(COURS_KEY)) || { favoris: [], maitrises: {} };
    if (!cours.maitrises) cours.maitrises = {};
    cours.maitrises[lessonId] = status;
    localStorage.setItem(COURS_KEY, JSON.stringify(cours));
}

// --- High Score Functions ---
export function saveHighScore(gameId, mode, score) {
    const stats = getGameStats();
    const modeIndex = mode !== undefined && mode !== null ? String(mode) : '0';
    if (!stats.games[gameId]) stats.games[gameId] = { total_mp: 0, modes: {} };
    if (!stats.games[gameId].modes[modeIndex]) stats.games[gameId].modes[modeIndex] = { mp: 0, highscore: 0 };
    
    const currentHighScore = stats.games[gameId].modes[modeIndex].highscore || 0;
    const gameInfo = gamesData.find(g => g.id === gameId);
    
    // Si le jeu n'a pas de timer, le score correspond au nombre de victoires (incrémentation)
    if (gameInfo && gameInfo.timer === false) {
        if (score > 0) {
            stats.games[gameId].modes[modeIndex].highscore = currentHighScore + 1;
            localStorage.setItem(STATS_KEY, JSON.stringify(stats));
        }
    } else {
        if (score > currentHighScore) {
            stats.games[gameId].modes[modeIndex].highscore = score;
            localStorage.setItem(STATS_KEY, JSON.stringify(stats));
        }
    }
}

export function getHighScore(gameId, mode) {
    const stats = getGameStats();
    const modeIndex = mode !== undefined && mode !== null ? String(mode) : '0';
    if (stats.games[gameId] && stats.games[gameId].modes[modeIndex]) {
        return stats.games[gameId].modes[modeIndex].highscore || 0;
    }
    return 0;
}

export function getAllScores() {
    const stats = getGameStats();
    const allScores = {};
    for (const gameId in stats.games) {
        for (const modeIndex in stats.games[gameId].modes) {
            allScores[`${gameId}_${modeIndex}`] = stats.games[gameId].modes[modeIndex].highscore || 0;
        }
    }
    return allScores;
}

export function resetGameHighScores() {
    const stats = getGameStats();
    for (const gameId in stats.games) {
        for (const modeIndex in stats.games[gameId].modes) {
            stats.games[gameId].modes[modeIndex].highscore = 0;
        }
    }
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

// --- MP/Level Functions ---
export function getTotalMP() {
    const stats = getGameStats();
    return stats.total_mp || 0;
}

export function addMP(amount) {
    const stats = getGameStats();
    stats.total_mp = (stats.total_mp || 0) + amount;
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    return stats.total_mp;
}

// --- Stats Functions ---

/**
 * Retrieves all game stats from localStorage.
 * Resets daily stats (mpToday, gamesPlayedToday) if the date has changed.
 * Includes local migration from old variables.
 * @returns {object} The stats object.
 */
export function getGameStats() {
    let statsJSON = localStorage.getItem(STATS_KEY);
    
    const oldTotalMp = localStorage.getItem('total_mp');
    const oldHighScores = localStorage.getItem('gameHighScores');
    const oldCoursF = localStorage.getItem('coursFavorites');
    const oldCoursM = localStorage.getItem('coursMastery');
    const oldActiveQuests = localStorage.getItem('activeQuests');
    
    let stats = statsJSON ? JSON.parse(statsJSON) : {};
    let needsMigration = false;
    
    // Migration logic
    if (!stats.format_v2 && (oldTotalMp !== null || oldHighScores !== null || oldCoursF !== null || oldCoursM !== null || oldActiveQuests !== null)) {
        needsMigration = true;
        if (statsJSON) {
            localStorage.setItem('OLD_gameStats_backup', statsJSON);
        }
        
        stats.total_mp = oldTotalMp !== null ? parseInt(oldTotalMp, 10) : (stats.total_mp || 0);
        
        if (!stats.games) stats.games = {};
        
        if (oldHighScores) {
            const parsedHS = JSON.parse(oldHighScores);
            for (const key in parsedHS) {
                const lastUnderscore = key.lastIndexOf('_');
                let gameId = key, mode = '0';
                if (lastUnderscore !== -1) {
                    gameId = key.substring(0, lastUnderscore);
                    mode = key.substring(lastUnderscore + 1);
                    if (mode === 'default') mode = '0';
                }
                if (!stats.games[gameId]) stats.games[gameId] = { total_mp: 0, modes: {} };
                if (!stats.games[gameId].modes[mode]) stats.games[gameId].modes[mode] = { mp: 0, highscore: 0 };
                stats.games[gameId].modes[mode].highscore = parsedHS[key];
            }
        }
        
        if (oldActiveQuests) {
            const parsed = JSON.parse(oldActiveQuests);
            if (Array.isArray(parsed)) {
                stats.activeQuests = { bonus_given_today: false, quests: parsed };
            } else {
                stats.activeQuests = parsed;
            }
        }
        
        const cours = { favoris: [], maitrises: {} };
        if (oldCoursF) cours.favoris = JSON.parse(oldCoursF);
        if (oldCoursM) cours.maitrises = JSON.parse(oldCoursM);
        localStorage.setItem(COURS_KEY, JSON.stringify(cours));
        
        localStorage.removeItem('total_mp');
        localStorage.removeItem('gameHighScores');
        localStorage.removeItem('coursFavorites');
        localStorage.removeItem('coursMastery');
        localStorage.removeItem('activeQuests');
        localStorage.removeItem('lastQuestDate'); 
        
        stats.format_v2 = true;
    }
    
    stats = Object.assign({
        format_v2: true,
        total_mp: stats.total_mp || 0,
        gamesPlayed: 0,
        mpToday: 0,
        mpWeek: 0,
        mpMonth: 0,
        lastPlayedDate: '',
        lastPlayedWeek: -1,
        lastPlayedMonth: -1,
        gamesPlayedToday: [], 
        games: {} 
    }, stats);

    const now = new Date();
    const today = getTodayDateString();
    
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000));
    const currentWeek = Math.ceil((dayOfYear + startOfYear.getDay() + 1) / 7);
    const currentMonth = now.getMonth();

    let needsUpdate = needsMigration;

    if (stats.lastPlayedDate !== today) {
        stats.mpToday = 0;
        stats.gamesPlayedToday = [];
        stats.lastPlayedDate = today;
        stats.activeQuests = null; // Triggers new daily quests generation
        needsUpdate = true;
    }

    if (stats.lastPlayedWeek !== currentWeek) {
        stats.mpWeek = 0;
        stats.lastPlayedWeek = currentWeek;
        needsUpdate = true;
    }

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

export function saveGameMP(gameId, modeIndex, amount) {
    const stats = getGameStats();
    if (!stats.games[gameId]) stats.games[gameId] = { total_mp: 0, modes: {} };

    stats.games[gameId].total_mp = (stats.games[gameId].total_mp || 0) + amount;

    const mode = modeIndex !== undefined && modeIndex !== null ? String(modeIndex) : '0';
    if (!stats.games[gameId].modes[mode]) stats.games[gameId].modes[mode] = { mp: 0, highscore: 0 };
    stats.games[gameId].modes[mode].mp = (stats.games[gameId].modes[mode].mp || 0) + amount;

    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function logPlayedGame(gameId) {
    if (!gameId) return;
    const stats = getGameStats();

    if (!stats.gamesPlayedToday.includes(gameId)) {
        stats.gamesPlayedToday.push(gameId);
        localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    }
}

export function updateStatsOnGameComplete(mpGained) {
    const stats = getGameStats();

    stats.gamesPlayed = (stats.gamesPlayed || 0) + 1;
    stats.mpToday = (stats.mpToday || 0) + mpGained;
    stats.mpWeek = (stats.mpWeek || 0) + mpGained;
    stats.mpMonth = (stats.mpMonth || 0) + mpGained;
    stats.lastPlayedDate = getTodayDateString();

    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function resetGameStats() {
    localStorage.removeItem(STATS_KEY);
}

// --- Quest Functions ---
export function getActiveQuests() {
    const stats = getGameStats();
    return stats.activeQuests || null;
}

export function saveActiveQuests(quests) {
    const stats = getGameStats();
    stats.activeQuests = quests;
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
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
