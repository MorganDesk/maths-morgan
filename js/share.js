import { getLessonId, getPlaylistId } from 'id.js';

/**
 * Copies a shareable link for a specific course to the clipboard.
 * @param {string} courseId - The ID of the course to share.
 */
export function copyShareLink(courseId) {
    const url = new URL(window.location.href);
    url.hash = courseId; // Use the direct ID for the hash
    
    navigator.clipboard.writeText(url.toString())
        .then(() => {
            showToast('Lien de la leçon copié !');
        })
        .catch(err => {
            console.error('Impossible de copier le lien : ', err);
            showToast('Erreur lors de la copie du lien.', true);
        });
}

/**
 * Copies a shareable link for a specific playlist to the clipboard.
 * @param {string} playlistId - The ID of the playlist to share.
 */
export function copyPlaylistShareLink(playlistId) {
    const url = new URL(window.location.href);
    url.hash = playlistId; // The ID is already prefixed

    navigator.clipboard.writeText(url.toString())
        .then(() => {
            showToast('Lien du parcours copié !');
        })
        .catch(err => {
            console.error('Impossible de copier le lien du parcours : ', err);
            showToast('Erreur lors de la copie du lien.', true);
        });
}


/**
 * Displays a toast message on the screen.
 * @param {string} message - The message to display.
 * @param {boolean} [isError=false] - If true, the toast will have an error style.
 */
function showToast(message, isError = false) {
    const toast = document.createElement('div');
    toast.className = `toast ${isError ? 'error' : ''}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    // Animate out and remove
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 500);
    }, 3000);
}
