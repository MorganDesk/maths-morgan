import { getHighScore, saveHighScore } from '../js/storage.js';
import { updateProgressionWidget } from '../js/progression.js';

export function start(container, gameId, mode) {
    let gameWrapper = container.querySelector(`#${gameId}-wrapper`);
    if (!gameWrapper) {
        gameWrapper = document.createElement('div');
        gameWrapper.id = `${gameId}-wrapper`;
        container.appendChild(gameWrapper);
    }

    const GAME_DURATION = 60;
    const DIVISORS = [2, 3, 5, 9, 10];
    let score = 0;
    let timeLeft = GAME_DURATION;
    let timerInterval = null;
    let currentNumber = 0;
    let correctDivisors = [];

    // --- Helper Functions for Divisibility ---
    const isDivisibleBy = {
        2: n => n % 2 === 0,
        3: n => {
            const sumOfDigits = String(n).split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
            return sumOfDigits % 3 === 0;
        },
        5: n => n % 5 === 0,
        9: n => {
            const sumOfDigits = String(n).split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
            return sumOfDigits % 9 === 0;
        },
        10: n => n % 10 === 0,
    };

    function formatNumber(n) {
        return new Intl.NumberFormat('fr-FR').format(n);
    }

    // --- Core Game Logic ---
    function endGame() {
        clearInterval(timerInterval);
        const oldHighScore = getHighScore(gameId, mode);
        const isNewRecord = score > oldHighScore;
        if (isNewRecord) {
            saveHighScore(gameId, mode, score);
        }
        const finalHighScore = isNewRecord ? score : oldHighScore;

        gameWrapper.innerHTML = `
            <div class="game-over-screen">
                <h2>Temps écoulé !</h2>
                ${isNewRecord ? `<div class="new-record-message"><i class="fas fa-trophy"></i> Nouveau Record !</div>` : ''}
                <div class="final-score">${score}</div>
                <p class="final-score-label">bonnes réponses.</p>
                <div class="game-over-actions">
                     <div class="highscore-info"><i class="fas fa-trophy"></i> Record : ${finalHighScore}</div>
                     <button id="restart-button">Rejouer</button>
                </div>
            </div>
        `;
        gameWrapper.querySelector('#restart-button').addEventListener('click', runGame);
        updateProgressionWidget();
    }

    function updateTimer() {
        timeLeft--;
        const timerElement = gameWrapper.querySelector('#time-left');
        if (timerElement) timerElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame();
        }
    }

    function generateNewRound() {
        const feedbackEl = gameWrapper.querySelector('#feedback');
        if (feedbackEl) {
            feedbackEl.textContent = '';
            feedbackEl.className = 'feedback';
        }

        let numberIsValid = false;
        while (!numberIsValid) {
            currentNumber = Math.floor(Math.random() * (100000 - 100 + 1)) + 100;
            correctDivisors = DIVISORS.filter(divisor => isDivisibleBy[divisor](currentNumber));
            if (correctDivisors.length > 0) {
                numberIsValid = true;
            }
        }

        gameWrapper.querySelector('#number-display').textContent = formatNumber(currentNumber);
        
        const tiles = gameWrapper.querySelectorAll('.tile');
        tiles.forEach(tile => {
            tile.classList.remove('selected');
            tile.disabled = false;
        });

        const validateButton = gameWrapper.querySelector('#check-button');
        if (validateButton) {
            validateButton.disabled = false;
        }
    }

    function validateSubmission() {
        const selectedTiles = gameWrapper.querySelectorAll('.tile.selected');
        const selectedDivisors = Array.from(selectedTiles).map(tile => parseInt(tile.dataset.value, 10));

        const sortedSelected = selectedDivisors.sort((a, b) => a - b);
        const sortedCorrect = [...correctDivisors].sort((a, b) => a - b);

        const feedbackEl = gameWrapper.querySelector('#feedback');

        if (JSON.stringify(sortedSelected) === JSON.stringify(sortedCorrect)) {
            score++;
            gameWrapper.querySelector('#score').textContent = score;
            
            feedbackEl.textContent = 'Correct !';
            feedbackEl.className = 'feedback correct';

            gameWrapper.querySelectorAll('.tile').forEach(tile => tile.disabled = true);
            gameWrapper.querySelector('#check-button').disabled = true;

            setTimeout(generateNewRound, 1200);
        } else {
            feedbackEl.textContent = 'Incorrect ! Essayez encore.';
            feedbackEl.className = 'feedback incorrect';
        }
    }

    function handleTileClick(event) {
        const tile = event.currentTarget;
        if (tile.disabled) return;
        
        tile.classList.toggle('selected');
    }

    function runGame() {
        score = 0;
        timeLeft = GAME_DURATION;

        gameWrapper.innerHTML = `
            <div class="game-stats">
                <span>Score: <span id="score">0</span></span>
                <span>Temps: <span id="time-left">${GAME_DURATION}</span>s</span>
            </div>
            <div class="game-area">
                <p class="game-instruction">Quels sont tous les diviseurs de ce nombre ?</p>
                <div class="game-question" id="number-display"></div>
                <div class="tiles-container">
                    ${DIVISORS.map(d => `<button class="tile number-tile" data-value="${d}">${d}</button>`).join('')}
                </div>
                <div id="feedback" class="feedback"></div>
            </div>
            <div class="game-actions">
                <button id="check-button" class="action-button">Valider</button>
            </div>
        `;

        const tiles = gameWrapper.querySelectorAll('.tile');
        tiles.forEach(tile => tile.addEventListener('click', handleTileClick));
        gameWrapper.querySelector('#check-button').addEventListener('click', validateSubmission);

        generateNewRound();
        clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 1000);
    }

    runGame();
}
