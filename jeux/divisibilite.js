let timerInterval = null;
let roundTimeout = null;

export function start(container, options) {
    const { gameId, modeName, modeIndex, settings, endGameCallback } = options;

    let gameWrapper = container.querySelector(`#${gameId}-wrapper`);
    if (!gameWrapper) {
        gameWrapper = document.createElement('div');
        gameWrapper.id = `${gameId}-wrapper`;
        container.appendChild(gameWrapper);
    }

    const GAME_DURATION = settings.duration || 60;
    const DIVISORS = settings.divisors || [2, 3, 5, 9, 10];
    let score = 0;
    let timeLeft = GAME_DURATION;
    let currentNumber = 0;
    let correctDivisors = [];
    let isGameOver = false;

    function cleanupInternals() {
        if (timerInterval) clearInterval(timerInterval);
        if (roundTimeout) clearTimeout(roundTimeout);
        timerInterval = null;
        roundTimeout = null;
    }

    const isDivisibleBy = {
        2: n => n % 2 === 0,
        3: n => String(n).split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0) % 3 === 0,
        4: n => parseInt(String(n).slice(-2)) % 4 === 0,
        5: n => n % 5 === 0,
        9: n => String(n).split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0) % 9 === 0,
        10: n => n % 10 === 0,
    };

    function formatNumber(n) {
        return new Intl.NumberFormat('fr-FR').format(n);
    }

    function showGameOverScreen() {
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

    function endGame() {
        if(isGameOver) return;
        isGameOver = true;
        cleanupInternals();
        showGameOverScreen();
    }

    function updateTimer() {
        timeLeft--;
        const timerElement = gameWrapper.querySelector('#time-left');
        if (timerElement) timerElement.textContent = timeLeft;
        if (timeLeft <= 0) endGame();
    }

    function generateNewRound() {
        const numberDisplay = gameWrapper.querySelector('#number-display');
        if (!numberDisplay) return;

        const feedbackEl = gameWrapper.querySelector('#feedback');
        if (feedbackEl) {
            feedbackEl.textContent = '';
            feedbackEl.className = 'feedback';
        }

        let numberIsValid = false;
        while (!numberIsValid) {
            currentNumber = Math.floor(Math.random() * (100000 - 100 + 1)) + 100;
            correctDivisors = DIVISORS.filter(divisor => isDivisibleBy[divisor](currentNumber));
            if (correctDivisors.length > 0) numberIsValid = true;
        }

        numberDisplay.textContent = formatNumber(currentNumber);
        gameWrapper.querySelectorAll('.tile').forEach(tile => { tile.classList.remove('selected'); tile.disabled = false; });
        const validateButton = gameWrapper.querySelector('#check-button');
        if (validateButton) validateButton.disabled = false;
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
            roundTimeout = setTimeout(() => { if(!isGameOver) generateNewRound(); }, 1200);
        } else {
            feedbackEl.textContent = `Incorrect ! La bonne réponse était : ${sortedCorrect.join(', ')}`;
            feedbackEl.className = 'feedback incorrect';
            roundTimeout = setTimeout(() => { if(!isGameOver) generateNewRound(); }, 1500);
        }
        gameWrapper.querySelectorAll('.tile').forEach(tile => tile.disabled = true);
        gameWrapper.querySelector('#check-button').disabled = true;
    }

    function handleTileClick(event) {
        const tile = event.currentTarget;
        if (tile.disabled) return;
        tile.classList.toggle('selected');
    }

    function runGame() {
        cleanupInternals();
        score = 0;
        timeLeft = GAME_DURATION;
        isGameOver = false;

        gameWrapper.innerHTML = `
            <div class="game-container">
                <div class="game-stats">
                    <span>Score: <span id="score">0</span></span>
                    <span>Temps: <span id="time-left">${GAME_DURATION}</span>s</span>
                </div>
                <div class="game-area">
                    <div class="game-question" id="number-display"></div>
                    <div class="tiles-container">
                        ${DIVISORS.map(d => `<button class="tile number-tile" data-value="${d}">${d}</button>`).join('')}
                    </div>
                    <div id="feedback" class="feedback"></div>
                </div>
                <div class="game-actions"><button id="check-button" class="action-button">Valider</button></div>
            </div>
        `;

        gameWrapper.querySelectorAll('.tile').forEach(tile => tile.addEventListener('click', handleTileClick));
        gameWrapper.querySelector('#check-button').addEventListener('click', validateSubmission);

        generateNewRound();
        timerInterval = setInterval(updateTimer, 1000);
    }

    runGame();
}

export function cleanup() {
    if (timerInterval) clearInterval(timerInterval);
    if (roundTimeout) clearTimeout(roundTimeout);
    timerInterval = null;
    roundTimeout = null;
}
