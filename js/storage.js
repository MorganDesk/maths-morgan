const FAVORITES_KEY = 'coursFavorites';

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
