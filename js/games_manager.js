import { getHighScore, saveHighScore, resetGameHighScores } from './storage.js';
import { updateProgressionWidget, completeGame } from './progression.js';
import { checkDailyQuests } from './quests.js';
import { gamesData } from '../datas/games_data.js';

document.addEventListener('DOMContentLoaded', () => {
    const gamesGrid = document.getElementById('games-grid');
    const gameContainer = document.getElementById('game-container');
    const searchInput = document.getElementById('search-input');
    const mainHeader = document.querySelector('header h1');
    const progressionContainer = document.getElementById('progression-container');
    const questsContainer = document.getElementById('quests-container');
    const resetButton = document.getElementById('reset-progression-button');
    const resetContainer = document.querySelector('.reset-container');

    const allGames = gamesData;
    let activeGameId = null;
    let activeGameModule = null; // Pour garder une référence au module du jeu actif

    const endGameManager = async (gameId, modeName, modeIndex, score) => {
        activeGameId = null;
        activeGameModule = null; // Nettoyer la référence
        await completeGame(gameId, modeIndex, score);
        saveHighScore(gameId, modeName, score);
    };

    const showGamesGrid = () => {
        activeGameId = null;

        gamesGrid.classList.remove('hidden');
        searchInput.parentElement.classList.remove('hidden');
        progressionContainer.classList.remove('hidden');
        questsContainer.classList.remove('hidden');
        resetContainer.classList.remove('hidden');
        gameContainer.classList.add('hidden');
        gameContainer.innerHTML = ''; 
        mainHeader.innerHTML = '<i class="fa-solid fa-gamepad"></i> Maths Morgan - Jeux';
        renderGameCards(allGames);
        updateProgressionWidget();
        checkDailyQuests();
    };

    const returnToGridAndCleanup = () => {
        if (activeGameModule && typeof activeGameModule.cleanup === 'function') {
            activeGameModule.cleanup();
        }
        activeGameModule = null; // Important: réinitialiser la référence
        showGamesGrid();
    };

    const renderGameCards = (gamesToRender) => {
        if (!gamesGrid) return;
        if (gamesToRender.length === 0) {
            gamesGrid.innerHTML = '<p class="no-results">Aucun jeu ne correspond à votre recherche.</p>';
            return;
        }

        gamesGrid.innerHTML = gamesToRender.map(game => {
            const defaultModeName = (game.modes && game.modes.length > 0) ? game.modes[0].name : 'default';
            const highScore = getHighScore(game.id, defaultModeName);

            const highScoreBadge = highScore > 0 ? `
                <div class="highscore-badge">
                    <i class="fas fa-trophy"></i>
                    <span class="score-value">${highScore}</span>
                </div>
            ` : '<div class="highscore-badge hidden"><i class="fas fa-trophy"></i><span class="score-value"></span></div>';

            const modeSelector = (game.modes && game.modes.length > 1) ? `
                <div class="mode-selection">
                    <select class="mode-selector" data-game-id="${game.id}">
                        ${game.modes.map(mode => `<option value="${mode.name}">${mode.name}</option>`).join('')}
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

    const startGame = async (gameId, modeName) => {
        const game = allGames.find(g => g.id === gameId);
        if (!game || !game.entryPoint) {
            console.error("Jeu non trouvé ou point d'entrée manquant !");
            return;
        }

        let mode = null;
        let modeIndex = -1;

        if (game.modes && game.modes.length > 0) {
            mode = game.modes.find(m => m.name === modeName) || game.modes[0];
            modeIndex = game.modes.indexOf(mode);
        } else {
            mode = { name: 'default', settings: {} }; 
            modeIndex = 0;
        }

        activeGameId = game.id;

        try {
            const gameModule = await import(`../${game.entryPoint}?v=${new Date().getTime()}`);
            activeGameModule = gameModule; // Stocker la référence au module
            
            gamesGrid.classList.add('hidden');
            searchInput.parentElement.classList.add('hidden');
            progressionContainer.classList.add('hidden');
            questsContainer.classList.add('hidden');
            resetContainer.classList.add('hidden'); 
            gameContainer.classList.remove('hidden');
            gameContainer.innerHTML = '';

            const backButton = document.createElement('button');
            backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Retour aux jeux';
            backButton.className = 'back-to-games';
            backButton.addEventListener('click', returnToGridAndCleanup); // Utiliser la nouvelle fonction
            gameContainer.appendChild(backButton);

            const gameContentContainer = document.createElement('div');
            gameContentContainer.id = 'game-content-container';
            gameContainer.appendChild(gameContentContainer);

            mainHeader.textContent = (game.modes && game.modes.length > 0) ? `${game.title} - ${mode.name}` : game.title;

            gameModule.start(gameContentContainer, {
                gameId,
                modeName: mode.name,
                modeIndex,
                settings: mode.settings || {}, 
                endGameCallback: endGameManager
            });

        } catch (error) {
            console.error("Erreur lors du chargement du module de jeu:", error);
            alert("Impossible de charger le jeu. Vérifiez la console pour plus de détails.");
            showGamesGrid();
        }
    };

    resetButton.addEventListener('click', () => {
        if (confirm("Êtes-vous sûr de vouloir réinitialiser toute votre progression ? Cette action est irréversible.")) {
            resetGameHighScores();
            localStorage.clear();
            showGamesGrid();
            location.reload();
        }
    });

    gamesGrid.addEventListener('change', (e) => {
        if (e.target.classList.contains('mode-selector')) {
            const gameId = e.target.dataset.gameId;
            const selectedModeName = e.target.value;
            const card = e.target.closest('.card');
            const highScoreBadge = card.querySelector('.highscore-badge');
            const scoreValue = highScoreBadge.querySelector('.score-value');
            const highScore = getHighScore(gameId, selectedModeName);
            
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
            const gameData = allGames.find(g => g.id === gameId);
            
            let selectedModeName = null;
            if (gameData.modes && gameData.modes.length > 0) {
                const modeSelector = card.querySelector('.mode-selector');
                selectedModeName = modeSelector ? modeSelector.value : gameData.modes[0].name;
            } else {
                selectedModeName = 'default';
            }

            startGame(gameId, selectedModeName);
        }
    });

    searchInput.addEventListener('input', filterGames);

    showGamesGrid();
});
