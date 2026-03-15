
let timerInterval = null;
let isGameOver = false;

// Nettoie les timers
function cleanupInternals() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
}

// Fonction pour formater les nombres avec des espaces comme séparateurs de milliers
function formatNumber(n) {
    return new Intl.NumberFormat('fr-FR').format(n);
}

// Fonction principale qui démarre le jeu
export function start(container, options) {
    const { gameId, modeName, modeIndex, endGameCallback } = options;

    // Crée un conteneur spécifique pour le jeu s'il n'existe pas
    let gameWrapper = container.querySelector(`#${gameId}-wrapper`);
    if (!gameWrapper) {
        gameWrapper = document.createElement('div');
        gameWrapper.id = `${gameId}-wrapper`;
        container.appendChild(gameWrapper);
    }

    const GAME_DURATION = 120; // 120 secondes
    let score = 0;
    let timeLeft = GAME_DURATION;
    let currentNumber = 0;
    
    const primeRanges = {
        0: [2, 3, 5, 7, 11], // Facile
        1: [2, 3, 5, 7, 11], // Normal
        2: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29] // Extrême
    };
    
    const primeCounts = {
        0: 3, // Facile
        1: 5, // Normal
        2: 5  // Extrême
    };

    // Affiche l'écran de fin de partie
    function showGameOverScreen() {
        // Appelle le callback de fin de jeu pour enregistrer le score
        endGameCallback(gameId, modeName, modeIndex, score);

        gameWrapper.innerHTML = `
         <div class="game-container">
            <div class="game-over-screen">
                <h2>Temps écoulé !</h2>
                <div class="final-score">${score}</div>
                <p class="final-score-label">bonnes réponses.</p>
                <div class="game-over-actions"><button id="restart-button">Rejouer</button></div>
            </div>
        </div>
        `;
        gameWrapper.querySelector('#restart-button').addEventListener('click', runGame);
    }

    // Termine la partie
    function endGame() {
        if(isGameOver) return;
        isGameOver = true;
        cleanupInternals();
        showGameOverScreen();
    }
    
    // Met à jour l'affichage du chronomètre
    function updateTimerDisplay() {
        const timerElement = gameWrapper.querySelector('#time-left');
        if (timerElement) timerElement.textContent = timeLeft;
    }

    // Met à jour le chronomètre
    function updateTimer() {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            endGame();
        }
    }
    
    // Génère le nombre cible et met à jour l'UI pour une nouvelle manche
    function newRound() {
        if (isGameOver) return;
        const primes = primeRanges[modeIndex];
        const count = primeCounts[modeIndex];
        let number = 1;
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * primes.length);
            number *= primes[randomIndex];
        }
        currentNumber = number;
        
        const numberDisplay = gameWrapper.querySelector('#number-display');
        if (numberDisplay) numberDisplay.textContent = formatNumber(currentNumber);
        
        const feedbackEl = gameWrapper.querySelector('#feedback');
        if (feedbackEl) {
            feedbackEl.textContent = '';
            feedbackEl.className = 'feedback';
        }
    }

    // Gère le clic sur une tuile
    function handleTileClick(event) {
        const tile = event.currentTarget;
        const prime = parseInt(tile.dataset.value, 10);

        if (tile.disabled || isGameOver) return;
        
        const feedbackEl = gameWrapper.querySelector('#feedback');

        if (currentNumber % prime === 0) {
            currentNumber /= prime;
            gameWrapper.querySelector('#number-display').textContent = formatNumber(currentNumber);

            if (currentNumber === 1) {
                score++; // Incrémente le score
                gameWrapper.querySelector('#score').textContent = score;
                feedbackEl.textContent = 'Correct !';
                feedbackEl.className = 'feedback correct';
                setTimeout(newRound, 1000); // Passe à la question suivante après 1 seconde
            }
        } else {
            timeLeft = Math.max(0, timeLeft - 2); // Pénalité de 2 secondes
            updateTimerDisplay();
            feedbackEl.textContent = 'Incorrect ! -2 secondes.';
            feedbackEl.className = 'feedback incorrect';
             setTimeout(() => {
                if(feedbackEl && feedbackEl.className.includes('incorrect')) {
                    feedbackEl.textContent = '';
                    feedbackEl.className = 'feedback';
                }
            }, 1500);
        }
    }

    // Exécute la logique principale du jeu
    function runGame() {
        cleanupInternals();
        score = 0;
        timeLeft = GAME_DURATION;
        isGameOver = false;

        const primesForMode = primeRanges[modeIndex];

        gameWrapper.innerHTML = `
            <div class="game-container">
                <div class="game-stats">
                    <span>Score: <span id="score">0</span></span>
                    <span>Temps: <span id="time-left">${GAME_DURATION}</span>s</span>
                </div>
                <div class="game-area">
                    <div class="game-question" id="number-display"></div>
                    <div class="tiles-container">
                        ${primesForMode.map(p => `<button class="tile number-tile" data-value="${p}">${p}</button>`).join('')}
                    </div>
                    <div id="feedback" class="feedback"></div>
                </div>
            </div>
        `;

        gameWrapper.querySelectorAll('.tile').forEach(tile => tile.addEventListener('click', handleTileClick));

        newRound(); // Commence la première manche
        timerInterval = setInterval(updateTimer, 1000);
    }

    runGame();
}

// Nettoie les ressources à la sortie du jeu
export function cleanup() {
    cleanupInternals();
    isGameOver = false;
}
