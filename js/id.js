/**
 * Génère un ID de secours pour une leçon si celle-ci n'en a pas.
 * @param {object} lesson - L'objet de la leçon.
 * @returns {string} L'ID généré.
 */
function fallback_generateLessonId(lesson) {
    console.warn(`Attention : ID généré à la volée pour la leçon "${lesson.titre}". Pensez à ajouter un ID statique.`);
    const titlePart = lesson.titre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '-').substring(0, 20);
    const datePart = new Date(lesson.date).getTime().toString(36);
    return `${titlePart}-${datePart}`;
}

/**
 * Génère un ID de secours pour une playlist si celle-ci n'en a pas.
 * @param {object} playlist - L'objet de la playlist.
 * @returns {string} L'ID généré.
 */
function fallback_generatePlaylistId(playlist) {
    console.warn(`Attention : ID généré à la volée pour la playlist "${playlist.titre}". Pensez à ajouter un ID statique.`);
    const slug = playlist.titre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return `playlist-${slug}`;
}

/**
 * Récupère l'ID d'une leçon. Utilise un fallback si 'id' est manquant.
 * @param {object} lesson - L'objet de la leçon.
 * @returns {string} L'ID de la leçon.
 */
export function getLessonId(lesson) {
    return (lesson && lesson.id) ? lesson.id : fallback_generateLessonId(lesson);
}

/**
 * Récupère l'ID d'une playlist. Utilise un fallback si 'id' est manquant.
 * @param {object} playlist - L'objet de la playlist.
 * @returns {string} L'ID de la playlist.
 */
export function getPlaylistId(playlist) {
    return (playlist && playlist.id) ? playlist.id : fallback_generatePlaylistId(playlist);
}
