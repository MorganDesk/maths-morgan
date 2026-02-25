const FAVORITES_KEY = 'coursFavorites';
const MASTERY_KEY = 'coursMastery';

/**
 * Récupère les IDs des cours favoris depuis le localStorage.
 * @returns {string[]} Un tableau d'IDs.
 */
export function getFavorites() {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
}

/**
 * Ajoute un ID de cours aux favoris.
 * @param {string} courseId - L'ID du cours à ajouter.
 */
export function addFavorite(courseId) {
    const favorites = getFavorites();
    if (!favorites.includes(courseId)) {
        favorites.push(courseId);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
}

/**
 * Supprime un ID de cours des favoris.
 * @param {string} courseId - L'ID du cours à supprimer.
 */
export function removeFavorite(courseId) {
    let favorites = getFavorites();
    favorites = favorites.filter(id => id !== courseId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

/**
 * Récupère tous les états de maîtrise.
 * @returns {object} Un objet avec les IDs de leçon comme clés et les états comme valeurs.
 */
function getAllMastery() {
    const masteryData = localStorage.getItem(MASTERY_KEY);
    return masteryData ? JSON.parse(masteryData) : {};
}

/**
 * Récupère l'état de maîtrise pour une leçon donnée.
 * @param {string} lessonId - L'ID de la leçon.
 * @returns {string} L'état de maîtrise (par défaut 'm-undefined').
 */
export function getMastery(lessonId) {
    const allMastery = getAllMastery();
    return allMastery[lessonId] || 'm-undefined';
}

/**
 * Enregistre l'état de maîtrise pour une leçon donnée.
 * @param {string} lessonId - L'ID de la leçon.
 * @param {string} status - Le nouvel état de maîtrise.
 */
export function saveMastery(lessonId, status) {
    const allMastery = getAllMastery();
    allMastery[lessonId] = status;
    localStorage.setItem(MASTERY_KEY, JSON.stringify(allMastery));
}