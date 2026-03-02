let timerInterval = null;
let feedbackTimeout = null;

export function start(container, options) {
    const { gameId, modeName, modeIndex, settings, endGameCallback } = options;

    const gameWrapper = document.createElement('div');
    gameWrapper.id = 'choc-des-relatifs-game';

    const GAME_DURATION = settings.duration || 60;
    let score = 0;
    let timeLeft = GAME_DURATION;
    let isGameOver = false;

    function cleanupInternals() {
        if (timerInterval) clearInterval(timerInterval);
        if (feedbackTimeout) clearTimeout(feedbackTimeout);
        timerInterval = null;
        feedbackTimeout = null;
    }

    function formatNumber(num) {
        return num >= 0 ? `(+${num})` : `(${num})`;
    }

    function getOperator() {
        const operators = settings.operators || ['+'];
        return operators[Math.floor(Math.random() * operators.length)];
    }

    function getInstructionText() {
        let operationName;
        const ops = settings.operators.join('');
        if (ops.includes('+') && ops.includes('-') && ops.includes('*')) {
            operationName = "d'opérations";
        } else if (ops.includes('+') && ops.includes('-')) {
            operationName = "d'additions et de soustractions";
        } else if (ops.includes('+')) {
            operationName = "d'additions";
        } else if (ops.includes('-')) {
            operationName = "de soustractions";
        } else if (ops.includes('*')) {
            operationName = "de multiplications";
        } else {
            operationName = "d'opérations sur les nombres relatifs";
        }
        return `Répondez correctement au plus grand nombre ${operationName} en ${GAME_DURATION} secondes !`;
    }

    function generateQuestion() {
        const questionContainer = gameWrapper.querySelector('#question-container');
        const answerInput = gameWrapper.querySelector('#answer-input');
        if (!questionContainer || !answerInput) return;
        
        const num1 = Math.floor(Math.random() * 21) - 10;
        const num2 = Math.floor(Math.random() * 21) - 10;
        const operator = getOperator();
        
        let correctAnswer;
        switch (operator) {
            case '+': correctAnswer = num1 + num2; break;
            case '-': correctAnswer = num1 - num2; break;
            case '*': correctAnswer = num1 * num2; break;
        }

        questionContainer.textContent = `${formatNumber(num1)} ${operator === '*' ? '×' : operator} ${formatNumber(num2)}`;
        answerInput.dataset.answer = correctAnswer;
        answerInput.value = '';
        answerInput.focus();
    }
    
    function handleInput() {
        if (isGameOver) return;
        const answerInput = gameWrapper.querySelector('#answer-input');
        const feedbackEl = gameWrapper.querySelector('#feedback');
        const correctAnswer = parseInt(answerInput.dataset.answer, 10);
        
        if (answerInput.value === '-' || answerInput.value === '' ) return;

        const userAnswer = parseInt(answerInput.value, 10);

        if (String(userAnswer).length >= String(correctAnswer).length && userAnswer !== correctAnswer) {
             if (String(correctAnswer).startsWith(answerInput.value)) return;
            feedbackEl.textContent = 'Incorrect !';
            feedbackEl.className = 'feedback incorrect';
            answerInput.value = '';
            feedbackTimeout = setTimeout(() => { if(feedbackEl) feedbackEl.textContent = '' }, 1000);
        } else if (userAnswer === correctAnswer) {
            score++;
            gameWrapper.querySelector('#score').textContent = score;
            feedbackEl.textContent = 'Correct !';
            feedbackEl.className = 'feedback correct';
            feedbackTimeout = setTimeout(() => {
                if(!isGameOver) {
                    generateQuestion();
                    feedbackEl.textContent = '';
                }
            }, 300);
        }
    }

    function showGameOverScreen() {
        endGameCallback(gameId, modeName, modeIndex, score);
        gameWrapper.innerHTML = `
            <div class="game-over-screen">
                <h2>Temps écoulé !</h2>
                <div class="final-score">${score}</div>
                <p class="final-score-label">réponses en ${GAME_DURATION}s.</p>
                <div class="game-over-actions"><button id="restart-button">Rejouer</button></div>
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
        if(timerElement) timerElement.textContent = timeLeft;
        if (timeLeft <= 0) endGame();
    }

    function runGame() {
        cleanupInternals();
        score = 0;
        timeLeft = GAME_DURATION;
        isGameOver = false;

        gameWrapper.innerHTML = `
            <div class="game-stats">
                <span>Score: <span id="score">0</span></span>
                <span>Temps: <span id="time-left">${timeLeft}</span>s</span>
            </div>
            <p class="game-instruction">${getInstructionText()}</p>
            <div class="game-area">
                <div id="question-container" class="game-question"></div>
                <input type="text" pattern="[0-9-]*" inputmode="numeric" id="answer-input" autofocus autocomplete="off" />
                <div id="feedback" class="feedback"></div>
            </div>
        `;
        gameWrapper.querySelector('#answer-input').addEventListener('input', handleInput);
        generateQuestion();
        timerInterval = setInterval(updateTimer, 1000);
        gameWrapper.querySelector('#answer-input')?.focus();
    }

    container.appendChild(gameWrapper);
    runGame();
}

export function cleanup() {
    if (timerInterval) clearInterval(timerInterval);
    if (feedbackTimeout) clearTimeout(feedbackTimeout);
    timerInterval = null;
    feedbackTimeout = null;
}
