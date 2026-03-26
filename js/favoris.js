import { getFavorites, addFavorite, removeFavorite } from './storage.js';
import { autoSyncThrottled } from './cloud_manager.js';

/**
 * Bascule l'état de favori pour un cours donné.
 * @param {string} courseId - L'ID du cours.
 * @returns {boolean} - Retourne true si le cours est maintenant en favori, false sinon.
 */
export function toggleFavorite(courseId) {
    const favorites = getFavorites();
    let isFavoriteNow;

    if (favorites.includes(courseId)) {
        removeFavorite(courseId);
        isFavoriteNow = false;
    } else {
        addFavorite(courseId);
        isFavoriteNow = true;
    }

    // --- NOUVEAU : Sauvegarde Cloud Automatique Throttlée ---
    autoSyncThrottled();

    return isFavoriteNow;
}

/**
 * Met à jour l'apparence de l'icône de favori sur une carte.
 * @param {HTMLElement} starIcon - L'élément de l'icône étoile (la balise <i>).
 * @param {boolean} isFavorite - L'état de favori.
 */
export function updateStarIcon(starIcon, isFavorite) {
    starIcon.setAttribute('aria-pressed', isFavorite);
    
    if (isFavorite) {
        starIcon.classList.add('active');
        starIcon.classList.remove('far'); // `regular`
        starIcon.classList.add('fas'); // `solid`
    } else {
        starIcon.classList.remove('active');
        starIcon.classList.remove('fas'); // `solid`
        starIcon.classList.add('far'); // `regular`
    }
}
