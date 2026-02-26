import { getFavorites } from './storage.js';
import { toggleFavorite, updateStarIcon } from './favoris.js';
import { processCourses, processPlaylists } from './search.js';
import { getLessonId, getPlaylistId } from './id.js';
import { copyShareLink, copyPlaylistShareLink } from './share.js';
import { renderPlaylistCards, getPlaylistById } from './playlist.js';
import { createMasteryElement } from './mastery.js';

document.addEventListener('DOMContentLoaded', function() {

    const filterItems = ['tous', '6e', '5e', '4e', '3e', 'parcours', 'favoris'];

    // --- Data Loading ---
    let allCourses = [];
    if (typeof data6e !== 'undefined') allCourses.push(...data6e.map(c => ({...c, id: getLessonId(c)})));
    if (typeof data5e !== 'undefined') allCourses.push(...data5e.map(c => ({...c, id: getLessonId(c)})));
    if (typeof data4e !== 'undefined') allCourses.push(...data4e.map(c => ({...c, id: getLessonId(c)})));
    if (typeof data3e !== 'undefined') allCourses.push(...data3e.map(c => ({...c, id: getLessonId(c)})));

    const allPlaylists = typeof playlists_data !== 'undefined' ? playlists_data.map(p => ({...p, id: getPlaylistId(p)})) : [];

    // --- DOM Elements ---
    const container = document.getElementById('cours-container');
    const modal = document.getElementById('pdf-modal');
    const closeModalButton = document.querySelector('.close-button');
    const pdfViewer = document.getElementById('pdf-viewer');
    const sortControls = document.getElementById('sort-controls');
    const sortSelect = document.getElementById('sort-select');
    const searchInput = document.getElementById('search-input');
    const mainHeading = document.querySelector('header h1');
    const backToPlaylistsButton = document.getElementById('back-to-playlists-button');
    const toolbar = document.querySelector('.toolbar');

    // --- State Management ---
    let currentLevelFilter = 'Tous';
    let currentSortMethod = 'date-desc';
    let currentSearchTerm = '';
    let activePlaylist = null;

    // --- Main Render Function ---
    function render() {
        if (!container) return;
        
        const favorites = getFavorites();
        const config = {
            levelFilter: currentLevelFilter,
            favorites: favorites,
            searchTerm: currentSearchTerm,
            sortMethod: currentSortMethod,
            activePlaylist: activePlaylist
        };

        let coursesToDisplay = [];
        let contentHtml = '';
        updateToolbarVisibility();

        if (activePlaylist) {
            coursesToDisplay = processCourses(allCourses, config);
            contentHtml = renderCourseCards(coursesToDisplay, favorites);
        } else if (currentLevelFilter === 'Parcours') {
            const playlistsToDisplay = processPlaylists(allPlaylists, allCourses, config);
            contentHtml = renderPlaylistCards(playlistsToDisplay, allCourses);
            coursesToDisplay = []; // Ensure mastery is not applied to playlists
        } else {
            coursesToDisplay = processCourses(allCourses, config);
            contentHtml = renderCourseCards(coursesToDisplay, favorites);
        }

        container.innerHTML = contentHtml;

        if (coursesToDisplay.length > 0) {
            coursesToDisplay.forEach(course => {
                const cardElement = document.getElementById(course.id);
                if (cardElement) {
                    const filesListElement = cardElement.querySelector('.files-list');
                    if (filesListElement) {
                        const masteryElement = createMasteryElement(course.id);
                        filesListElement.insertAdjacentElement('beforebegin', masteryElement);
                    }
                }
            });
        }

        updateTitleFromState();
        // The highlighting will be called after render, which is more reliable
        setTimeout(handleHighlighting, 0);
    }

    function renderCourseCards(courses, favorites) {
        if (courses.length === 0) {
            return '<p style="text-align: center; width: 100%;">Aucun résultat.</p>';
        }
        return courses.map(cours => {
             const isFavorite = favorites.includes(cours.id);
             const starIconClass = isFavorite ? 'fas fa-star' : 'far fa-star';
             const activeClass = isFavorite ? 'active' : '';
             const niveauBadge = `<span class=\"badge niveau-${cours.niveau.toLowerCase()}\">${cours.niveau}</span>`;
             const matiereBadge = `<span class=\"badge matiere\">${cours.matiere}</span>`;
             const filesHtml = cours.fichiers.map(file => 
                 `<button class=\"file-button\" data-pdf-path=\"${file.url}\">${file.nom}</button>`
             ).join('');

             return `
                 <div class=\"cours-card\" id="${cours.id}" data-course-id="${cours.id}">
                     <div class="card-actions">
                         <i class="fas fa-share-alt share-icon" title="Copier le lien"></i>
                         <i class="${starIconClass} favorite-star ${activeClass}" role="button" aria-pressed="${isFavorite}" title="Ajouter aux favoris"></i>
                     </div>
                     <div class="card-header">
                         <div class=\"card-badges\">
                             ${niveauBadge}
                             ${matiereBadge}
                         </div>
                     </div>
                     <h2>${cours.titre}</h2>
                     <p>${cours.desc}</p>
                     <div class=\"files-list\">
                         ${filesHtml}
                     </div>
                 </div>
             `;
        }).join('');
    }

    function updateToolbarVisibility() {
        if (activePlaylist) {
            backToPlaylistsButton.style.display = 'inline-flex';
            sortControls.style.display = 'flex';
        } else if (currentLevelFilter === 'Parcours') {
            backToPlaylistsButton.style.display = 'none';
            sortControls.style.display = 'none';
        } else {
            backToPlaylistsButton.style.display = 'none';
            sortControls.style.display = 'flex';
        }
    }
    
    function updateTitleFromState(lessonTitle = null) {
        let title;
        if (lessonTitle) {
            title = lessonTitle;
        } else if (activePlaylist) {
            title = `Parcours : ${activePlaylist.titre}`;
        } else if (currentLevelFilter === 'Parcours') {
            title = 'Parcours';
        } else if (currentLevelFilter === 'Favoris') {
            title = 'Mes favoris';
        } else if (currentLevelFilter !== 'Tous') {
            title = currentLevelFilter;
        } else {
            title = 'Accueil';
        }
        const fullTitle = `Maths Morgan - ${title}`;
        document.title = fullTitle;
        mainHeading.innerHTML = `<i class="fa-solid fa-book"></i> ${fullTitle}`;
    }

    document.addEventListener('filterChange', function(event) {
        const { filter } = event.detail;
        activePlaylist = null;
        currentLevelFilter = filter.charAt(0).toUpperCase() + filter.slice(1);
        currentSearchTerm = '';
        searchInput.value = '';
        render();
    });

    sortSelect.addEventListener('change', function() {
        currentSortMethod = this.value;
        render();
    });

    searchInput.addEventListener('input', function() {
        currentSearchTerm = this.value;
        render();
    });

    container.addEventListener('click', function(event) {
        const viewPlaylistButton = event.target.closest('.view-playlist-button');
        if (viewPlaylistButton) {
            const playlistCard = viewPlaylistButton.closest('.playlist-card');
            activePlaylist = getPlaylistById(playlistCard.dataset.playlistId, allPlaylists);
            currentSearchTerm = '';
            searchInput.value = '';
            render();
            return;
        }

        const sharePlaylistBtn = event.target.closest('.share-playlist-button');
        if (sharePlaylistBtn) {
            const playlistCard = sharePlaylistBtn.closest('.playlist-card');
            copyPlaylistShareLink(playlistCard.id);
            return;
        }

        const star = event.target.closest('.favorite-star');
        if (star) {
            const courseCard = star.closest('.cours-card');
            const courseId = courseCard.dataset.courseId;
            const isNowFavorite = toggleFavorite(courseId);
            updateStarIcon(star, isNowFavorite);
            if (currentLevelFilter === 'Favoris' && !isNowFavorite) render();
            return;
        }

        const shareButton = event.target.closest('.share-icon');
        if (shareButton) {
            const courseCard = shareButton.closest('.cours-card');
            copyShareLink(courseCard.dataset.courseId);
            return;
        }

        const fileButton = event.target.closest('.file-button');
        if (fileButton && !fileButton.closest('#back-to-playlists-button')) { 
            const pdfPath = fileButton.dataset.pdfPath;
            if (pdfPath) {
                pdfViewer.src = pdfPath;
                modal.style.display = 'flex';
            }
        }
    });

    toolbar.addEventListener('click', function(event) {
        if (event.target.closest('#back-to-playlists-button')) {
            activePlaylist = null;
            render();
        }
    });

    function closeModal() {
        modal.style.display = 'none';
        pdfViewer.src = '';
    }
    closeModalButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => (event.target === modal) && closeModal());
    window.addEventListener('keydown', (event) => (event.key === 'Escape') && closeModal());

    function handleHighlighting() {
        const hash = window.location.hash.substring(1);
        if (!hash) return;

        requestAnimationFrame(() => {
            const targetElement = document.getElementById(hash);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                targetElement.classList.add('highlight');
                
                if (targetElement.classList.contains('cours-card')) {
                    const lessonTitle = targetElement.querySelector('h2').textContent;
                    updateTitleFromState(lessonTitle);
                }

                setTimeout(() => {
                    targetElement.classList.remove('highlight');
                }, 4500);
            }
        });
    }

    function initialize() {
        function syncFilterFromURL() {
            const hash = window.location.hash.substring(1);
            let filter = 'tous'; // Default filter

            // 1. Déterminer le filtre approprié à partir de l'ancre
            if (filterItems.includes(hash)) {
                filter = hash;
            } else if (hash.startsWith('playlist-')) {
                filter = 'parcours';
            } else {
                const levelMatch = hash.match(/^([3-6]e)-/);
                if (levelMatch && levelMatch[1]) {
                    filter = levelMatch[1];
                }
            }

            // 2. Envoyer les événements pour mettre à jour l'UI
            document.dispatchEvent(new CustomEvent('filterChange', { detail: { filter } }));
            document.dispatchEvent(new CustomEvent('setActiveFilter', { detail: { filter } }));
        }

        window.addEventListener('hashchange', syncFilterFromURL);
        syncFilterFromURL(); // Appel initial
    }

    initialize();
});
