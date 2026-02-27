import { getHighScore } from './storage.js';
import { updateProgressionWidget } from './progression.js';

document.addEventListener('DOMContentLoaded', () => {
    const gamesGrid = document.getElementById('games-grid');
    const gameContainer = document.getElementById('game-container');
    const searchInput = document.getElementById('search-input');
    const mainHeader = document.querySelector('header h1');
    const progressionContainer = document.getElementById('progression-container');

    let allGames = [];
    if (typeof gamesData !== 'undefined') {
        allGames = gamesData;
    }

    // Fonction pour afficher la grille des jeux
    const showGamesGrid = () => {
        gamesGrid.classList.remove('hidden');
        searchInput.parentElement.classList.remove('hidden');
        progressionContainer.classList.remove('hidden');
        gameContainer.classList.add('hidden');
        gameContainer.innerHTML = ''; // Vider le conteneur de jeu
        mainHeader.innerHTML = '<i class="fa-solid fa-gamepad"></i> Maths Morgan - Jeux';
        renderGameCards(allGames);
        updateProgressionWidget();
    };

    const renderGameCards = (gamesToRender) => {
        if (!gamesGrid) return;
        if (gamesToRender.length === 0) {
            gamesGrid.innerHTML = '<p class="no-results">Aucun jeu ne correspond à votre recherche.</p>';
            return;
        }

        gamesGrid.innerHTML = gamesToRender.map(game => {
            const initialMode = game.modes && game.modes.length > 0 ? game.modes[0] : null;
            const highScore = getHighScore(game.id, initialMode);

            const highScoreBadge = highScore > 0 ? `
                <div class="highscore-badge">
                    <i class="fas fa-trophy"></i>
                    <span class="score-value">${highScore}</span>
                </div>
            ` : '<div class="highscore-badge hidden"><i class="fas fa-trophy"></i><span class="score-value"></span></div>';

            const modeSelector = (game.modes && game.modes.length > 1) ? `
                <div class="mode-selection">
                    <select class="mode-selector">
                        ${game.modes.map(mode => `<option value="${mode}">${mode}</option>`).join('')}
                    </select>
                    <i class="fas fa-chevron-down"></i>
                </div>
            ` : '';

            return `
                <div class="card" data-game-id="${game.id}">
                    <div class="card-header">
                        <span class="category-badge">${game.matiere}</span>
                        ${highScoreBadge}
                    </div>
                    <div class="card-content">
                        <h3>${game.title}</h3>
                        <p>${game.description}</p>
                        <div class="card-footer">
                            ${modeSelector}
                            <button class="play-button">Jouer</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    };

    const filterGames = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const filteredGames = allGames.filter(game => {
            const titleMatch = game.title.toLowerCase().includes(searchTerm);
            const tagMatch = game.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            return titleMatch || tagMatch;
        });
        renderGameCards(filteredGames);
    };

    const startGame = async (gameId, mode) => {
        const game = allGames.find(g => g.id === gameId);
        if (!game || !game.entryPoint) {
            console.error("Jeu non trouvé ou point d'entrée manquant !");
            return;
        }

        try {
            // Ajout d'un timestamp pour forcer le rechargement du module (cache-busting)
            const gameModule = await import(`../${game.entryPoint}?v=${new Date().getTime()}`);
            
            gamesGrid.classList.add('hidden');
            searchInput.parentElement.classList.add('hidden');
            progressionContainer.classList.add('hidden');
            gameContainer.classList.remove('hidden');
            gameContainer.innerHTML = ''; // Vider complètement avant de commencer

            const backButton = document.createElement('button');
            backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Retour aux jeux';
            backButton.className = 'back-to-games';
            backButton.addEventListener('click', showGamesGrid);
            gameContainer.appendChild(backButton);

            const gameContentContainer = document.createElement('div');
            gameContentContainer.id = 'game-content-container';
            gameContainer.appendChild(gameContentContainer);

            mainHeader.textContent = mode ? `${game.title} - ${mode}` : game.title;

            gameModule.start(gameContentContainer, game.id, mode);

        } catch (error) {
            console.error("Erreur lors du chargement du module de jeu:", error);
            alert("Impossible de charger le jeu. Vérifiez la console pour plus de détails.");
            showGamesGrid(); // Revenir à la grille si le chargement échoue
        }
    };

    // --- GESTIONNAIRES D'ÉVÉNEMENTS ---

    gamesGrid.addEventListener('change', (e) => {
        if (e.target.classList.contains('mode-selector')) {
            const card = e.target.closest('.card');
            const gameId = card.dataset.gameId;
            const selectedMode = e.target.value;
            const highScore = getHighScore(gameId, selectedMode);
            
            const highScoreBadge = card.querySelector('.highscore-badge');
            const scoreValue = highScoreBadge.querySelector('.score-value');

            if (highScore > 0) {
                scoreValue.textContent = highScore;
                highScoreBadge.classList.remove('hidden');
            } else {
                highScoreBadge.classList.add('hidden');
            }
        }
    });

    gamesGrid.addEventListener('click', (e) => {
        const playButton = e.target.closest('.play-button');
        if (playButton) {
            const card = playButton.closest('.card');
            const gameId = card.dataset.gameId;
            const game = allGames.find(g => g.id === gameId);
            
            const modeSelector = card.querySelector('.mode-selector');
            const selectedMode = modeSelector ? modeSelector.value : (game.modes && game.modes.length > 0 ? game.modes[0] : null);
            
            startGame(gameId, selectedMode);
        }
    });

    searchInput.addEventListener('input', filterGames);

    // Lancement initial
    showGamesGrid();
});
