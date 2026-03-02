let timerInterval = null; // Déplacé ici pour être accessible par cleanup

export function start(container, options) {
    const { gameId, modeName, modeIndex, settings, endGameCallback } = options;

    let gameWrapper = container.querySelector('#defi-des-tables-game');
    if (!gameWrapper) {
        gameWrapper = document.createElement('div');
        gameWrapper.id = 'defi-des-tables-game';
        container.appendChild(gameWrapper);
    }

    const GAME_DURATION = settings.duration || 60;
    let score = 0;
    let timeLeft = GAME_DURATION;
    let isGameOver = false;

    function showGameOverScreen() {
        endGameCallback(gameId, modeName, modeIndex, score);

        gameWrapper.innerHTML = `
            <div class="game-over-screen">
                <h2>Temps écoulé !</h2>
                <div class="final-score">${score}</div>
                <p class="final-score-label">réponses en ${GAME_DURATION} secondes.</p>
                <div class="game-over-actions">
                     <button id="restart-button">Rejouer</button>
                </div>
            </div>
        `;

        gameWrapper.querySelector('#restart-button').addEventListener('click', runGame);
    }
    
    function endGame() {
        if (isGameOver) return;
        isGameOver = true;
        clearInterval(timerInterval);
        timerInterval = null;
        showGameOverScreen();
    }

    function updateTimer() {
        timeLeft--;
        const timerElement = gameWrapper.querySelector('#time-left');
        if(timerElement) timerElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame();
        }
    }

    function generateQuestion() {
        const num1 = Math.floor(Math.random() * 9) + 2;
        const num2 = Math.floor(Math.random() * 9) + 2;
        const questionContainer = gameWrapper.querySelector('#question-container');
        const answerInput = gameWrapper.querySelector('#answer-input');
        
        if (questionContainer && answerInput) {
            questionContainer.textContent = `${num1} × ${num2}`;
            answerInput.dataset.answer = String(num1 * num2);
            answerInput.value = '';
            answerInput.focus();
        }
    }

    function handleInput() {
        if (isGameOver) return;
        const answerInput = gameWrapper.querySelector('#answer-input');
        const feedbackEl = gameWrapper.querySelector('#feedback');
        const correctAnswer = answerInput.dataset.answer;
        const userAnswer = answerInput.value;

        if (userAnswer.length >= correctAnswer.length) {
             if (userAnswer === correctAnswer) {
                score++;
                gameWrapper.querySelector('#score').textContent = score;
                feedbackEl.textContent = 'Correct !';
                feedbackEl.className = 'feedback correct';
                setTimeout(() => { 
                    if (!isGameOver) {
                        generateQuestion();
                        feedbackEl.textContent = '';
                    }
                }, 300);
            } else {
                feedbackEl.textContent = 'Incorrect !';
                feedbackEl.className = 'feedback incorrect';
                answerInput.value = ''; 
                setTimeout(() => { 
                    if(feedbackEl) feedbackEl.textContent = '' 
                }, 1000);
            }
        }
    }

    function runGame() {
        score = 0;
        timeLeft = GAME_DURATION;
        isGameOver = false;

        gameWrapper.innerHTML = `
            <div class="game-stats">
                <span>Score: <span id="score">0</span></span>
                <span>Temps: <span id="time-left">${GAME_DURATION}</span>s</span>
            </div>
            <p class="game-instruction">Répondez correctement au plus grand nombre de multiplications en ${GAME_DURATION} secondes !</p>
            <div class="game-area">
                <div id="question-container" class="game-question"></div>
                <input type="number" pattern="[0-9]*" inputmode="numeric" id="answer-input" autofocus autocomplete="off" />
                <div id="feedback" class="feedback"></div>
            </div>
        `;

        const answerInput = gameWrapper.querySelector('#answer-input');
        answerInput.addEventListener('input', handleInput);

        generateQuestion();
        
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 1000);
        
        if(answerInput) answerInput.focus();
    }

    runGame();
}

export function cleanup() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}
