import { getPlaylistId } from './id.js';

/**
 * Generates the HTML for a list of playlist cards.
 * @param {Array} playlists - The array of playlist objects to display.
 * @param {Array} allCourses - The full list of all available courses to find level data.
 * @returns {string} - The HTML string for the playlist cards.
 */
export function renderPlaylistCards(playlists, allCourses) {
    if (!playlists || playlists.length === 0) {
        return '<p style="text-align: center; width: 100%;">Aucun parcours ne correspond à votre recherche.</p>';
    }

    return playlists.map(playlist => {
        const playlistId = getPlaylistId(playlist);
        const courseIdsInPlaylist = new Set(playlist.items || []);
        const levelsInPlaylist = new Set();

        allCourses.forEach(course => {
            if (courseIdsInPlaylist.has(course.id)) {
                levelsInPlaylist.add(course.niveau);
            }
        });

        const sortedLevels = Array.from(levelsInPlaylist).sort();
        const levelBadges = sortedLevels.map(n => 
            `<span class=\"badge niveau-${n.toLowerCase()}\">${n}</span>`
        ).join(' ');

        const lesson_count = courseIdsInPlaylist.size;
        const itemCountBadge = `<span class=\"badge matiere\">${lesson_count} leçon${lesson_count > 1 ? 's' : ''}</span>`;

        return `
            <div class=\"playlist-card\" id=\"${playlistId}\" data-playlist-id=\"${playlist.id}\">
                <div class=\"card-actions\">
                    <i class=\"fas fa-share-nodes share-icon share-playlist-button\" title=\"Copier le lien du parcours\"></i>
                </div>
                 <div class=\"card-header\">
                    <div class=\"card-badges\">
                        ${levelBadges}
                        ${itemCountBadge}
                    </div>
                </div>
                <h2>${playlist.titre}</h2>
                <p>${playlist.desc}</p>
                <div class=\"files-list\">
                    <button class=\"file-button view-playlist-button\">Voir le parcours</button>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Finds a playlist by its ID from a global or passed-in list.
 * @param {string} id - The ID of the playlist to find.
 * @param {Array} allPlaylists - The array of all playlist objects.
 * @returns {Object|undefined} - The playlist object or undefined if not found.
 */
export function getPlaylistById(id, allPlaylists) {
    return allPlaylists.find(p => p.id === id);
}
