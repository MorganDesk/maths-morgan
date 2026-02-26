import { getLessonId } from './id.js';

/**
 * Normalizes a string by converting it to lower case and removing accents.
 * @param {string} str - The string to normalize.
 * @returns {string} The normalized string.
 */
function normalizeString(str) {
    if (!str) return '';
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

/**
 * Filters and sorts the courses based on various criteria.
 * @param {Array} courses - The array of course objects.
 * @param {Object} config - The configuration object.
 * @returns {Array} - The filtered and sorted array of courses.
 */
export function processCourses(courses, config) {
    let filteredCourses = courses;

    if (config.activePlaylist) {
        const courseIdsInPlaylist = new Set(config.activePlaylist.items || []);
        filteredCourses = courses.filter(course => courseIdsInPlaylist.has(course.id));
    } else if (config.levelFilter === 'Favoris') {
        filteredCourses = courses.filter(course => config.favorites.includes(course.id));
    } else if (config.levelFilter !== 'Tous') {
        filteredCourses = courses.filter(course => course.niveau === config.levelFilter);
    }

    if (config.searchTerm) {
        const normalizedSearchTerm = normalizeString(config.searchTerm);
        filteredCourses = filteredCourses.filter(course => 
            normalizeString(course.titre).includes(normalizedSearchTerm) ||
            normalizeString(course.desc).includes(normalizedSearchTerm) ||
            normalizeString(course.matiere).includes(normalizedSearchTerm) ||
            (course.tags && course.tags.some(tag => normalizeString(tag).includes(normalizedSearchTerm)))
        );
    }

    return sortCourses(filteredCourses, config.sortMethod);
}

/**
 * Filters and sorts playlists.
 * @param {Array} allPlaylists - All available playlists.
 * @param {Array} allCourses - All available courses.
 * @param {Object} config - Configuration object.
 * @returns {Array} - The filtered and sorted playlists.
 */
export function processPlaylists(allPlaylists, allCourses, config) {
    let filteredPlaylists = allPlaylists;
    if (config.searchTerm) {
        const normalizedSearchTerm = normalizeString(config.searchTerm);
        filteredPlaylists = allPlaylists.filter(playlist => {
            // 1. Search in playlist's own properties
            const hasMatchingTitle = normalizeString(playlist.titre).includes(normalizedSearchTerm);
            const hasMatchingDesc = normalizeString(playlist.desc).includes(normalizedSearchTerm);
            const hasMatchingTag = (playlist.tags || []).some(tag => normalizeString(tag).includes(normalizedSearchTerm));

            // 2. Deep search into the lessons contained in the playlist
            const hasMatchingCourse = (playlist.items || []).some(courseId => {
                const course = allCourses.find(c => getLessonId(c) === courseId);
                return course && (
                    normalizeString(course.titre).includes(normalizedSearchTerm) ||
                    normalizeString(course.desc).includes(normalizedSearchTerm) ||
                    normalizeString(course.matiere).includes(normalizedSearchTerm) ||
                    (course.tags && course.tags.some(tag => normalizeString(tag).includes(normalizedSearchTerm)))
                );
            });

            return hasMatchingTitle || hasMatchingDesc || hasMatchingTag || hasMatchingCourse;
        });
    }
    return filteredPlaylists; 
}

/**
 * Sorts an array of courses based on a specified method.
 * @param {Array} courses - The array of courses to sort.
 * @param {string} sortMethod - The sorting method.
 * @returns {Array} - The sorted array of courses.
 */
function sortCourses(courses, sortMethod) {
    const sorted = [...courses];
    switch (sortMethod) {
        case 'date-desc':
            sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'date-asc':
            sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'title-asc':
            sorted.sort((a, b) => a.titre.localeCompare(b.titre));
            break;
        case 'title-desc':
            sorted.sort((a, b) => b.titre.localeCompare(a.titre));
            break;
    }
    return sorted;
}
