import { getHighScore } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
    const gamesGrid = document.getElementById('games-grid');
    const gameContainer = document.getElementById('game-container');
    const searchInput = document.getElementById('search-input');
    const mainHeader = document.querySelector('header h1');

    let allGames = [];
    if (typeof gamesData !== 'undefined') {
        allGames = gamesData;
    }

    const renderGameCards = (gamesToRender) => {
        if (!gamesGrid) return;
        if (gamesToRender.length === 0) {
            gamesGrid.innerHTML = '<p class="no-results">Aucun jeu ne correspond à votre recherche.</p>';
            return;
        }

        gamesGrid.innerHTML = gamesToRender.map(game => {
            const initialMode = game.modes && game.modes.length > 0 ? game.modes[0] : undefined;
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
            const gameModule = await import(`../${game.entryPoint}`);
            
            gamesGrid.classList.add('hidden');
            searchInput.parentElement.classList.add('hidden');
            gameContainer.classList.remove('hidden');
            gameContainer.innerHTML = ''; // Clear previous game

            const backButton = document.createElement('button');
            backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Retour aux jeux';
            backButton.className = 'back-to-games';
            backButton.addEventListener('click', () => {
                gamesGrid.classList.remove('hidden');
                searchInput.parentElement.classList.remove('hidden');
                gameContainer.classList.add('hidden');
                mainHeader.innerHTML = '<i class="fa-solid fa-gamepad"></i> Maths Morgan - Jeux';
                filterGames(); // Re-render cards to update scores
            });
            gameContainer.appendChild(backButton);

            mainHeader.textContent = `${game.title} - ${mode}`;

            // Pass the container, gameId, and selected mode to the game module
            gameModule.start(gameContainer, game.id, mode);

        } catch (error) {
            console.error("Erreur lors du chargement du module de jeu:", error);
            alert("Impossible de charger le jeu. Vérifiez la console pour plus de détails.");
        }
    };

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
            let selectedMode;

            const modeSelector = card.querySelector('.mode-selector');
            if (modeSelector) {
                selectedMode = modeSelector.value;
            } else if (game.modes && game.modes.length > 0) {
                selectedMode = game.modes[0];
            } else {
                selectedMode = 'default';
            }
            
            startGame(gameId, selectedMode);
        }
    });

    searchInput.addEventListener('input', filterGames);

    // Initial render
    renderGameCards(allGames);
});
