const FAVORITES_KEY = 'coursFavorites';
const MASTERY_KEY = 'coursMastery';
const HIGH_SCORES_KEY = 'gameHighScores';

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
