import { getHighScore, saveHighScore } from '../js/storage.js';

export function start(container, gameId, mode) {
    const gameWrapper = document.createElement('div');
    gameWrapper.id = 'choc-des-relatifs-game';

    const GAME_DURATION = 60;
    let score = 0;
    let timeLeft = GAME_DURATION;
    let timerInterval = null;

    function formatNumber(num) {
        return num >= 0 ? `(+${num})` : `(${num})`;
    }

    function getOperator(currentMode) {
        const operators = [];
        if (currentMode.includes('+')) operators.push('+');
        if (currentMode.includes('-')) operators.push('-');
        if (currentMode.includes('x')) operators.push('*');

        if (operators.length === 0) return '+'; // Fallback
        return operators[Math.floor(Math.random() * operators.length)];
    }

    function generateQuestion() {
        const num1 = Math.floor(Math.random() * 21) - 10;
        const num2 = Math.floor(Math.random() * 21) - 10;
        const questionContainer = gameWrapper.querySelector('#question-container');
        const answerInput = gameWrapper.querySelector('#answer-input');
        const operator = getOperator(mode);
        
        let correctAnswer;
        switch (operator) {
            case '+': correctAnswer = num1 + num2; break;
            case '-': correctAnswer = num1 - num2; break;
            case '*': correctAnswer = num1 * num2; break;
        }

        questionContainer.textContent = `${formatNumber(num1)} ${operator} ${formatNumber(num2)}`;
        answerInput.dataset.answer = correctAnswer;
        answerInput.value = '';
        answerInput.focus();
    }
    
    function handleInput() {
        const answerInput = gameWrapper.querySelector('#answer-input');
        const feedbackEl = gameWrapper.querySelector('#feedback');
        const correctAnswer = parseInt(answerInput.dataset.answer, 10);
        const userAnswer = parseInt(answerInput.value, 10);

        if (answerInput.value.length >= String(correctAnswer).length) {
             if (userAnswer === correctAnswer) {
                score++;
                gameWrapper.querySelector('#score').textContent = score;
                feedbackEl.textContent = 'Correct !';
                feedbackEl.className = 'feedback correct';
                setTimeout(() => {
                    generateQuestion();
                    feedbackEl.textContent = '';
                }, 300);
            } else {
                feedbackEl.textContent = 'Incorrect !';
                feedbackEl.className = 'feedback incorrect';
                answerInput.value = '';
                setTimeout(() => { feedbackEl.textContent = '' }, 1000);
            }
        }
    }

    function endGame() {
        clearInterval(timerInterval);
        const oldHighScore = getHighScore(gameId, mode);
        let isNewRecord = false;

        if (score > oldHighScore) {
            saveHighScore(gameId, mode, score);
            isNewRecord = true;
        }
        const finalHighScore = isNewRecord ? score : oldHighScore;

        let gameOverHTML = `
            <div class="game-over-screen">
                <h2>Temps écoulé !</h2>
                ${isNewRecord ? '<div class="new-record-message"><i class="fas fa-trophy"></i> Nouveau Record !</div>' : ''}
                <div class="final-score">${score}</div>
                <p class="final-score-label">réponses en ${GAME_DURATION}s pour le mode ${mode}</p>
                <div class="game-over-actions">
                     <div class="highscore-info"><i class="fas fa-trophy"></i> Record : ${finalHighScore}</div>
                     <button id="restart-button">Rejouer</button>
                </div>
            </div>
        `;
        gameWrapper.innerHTML = gameOverHTML;
        gameWrapper.querySelector('#restart-button').addEventListener('click', runGame);
    }

    function updateTimer() {
        timeLeft--;
        const timerElement = gameWrapper.querySelector('#time-left');
        if(timerElement) timerElement.textContent = timeLeft;
        if (timeLeft <= 0) endGame();
    }

    function runGame() {
        score = 0;
        timeLeft = GAME_DURATION;
        gameWrapper.innerHTML = `
            <div class="game-stats">
                <span>Score: <span id="score">0</span></span>
                <span>Temps: <span id="time-left">${timeLeft}</span>s</span>
            </div>
            <div class="game-area">
                <div id="question-container" class="game-question"></div>
                <input type="number" pattern="[0-9-]*" inputmode="numeric" id="answer-input" autofocus autocomplete="off" />
                <div id="feedback" class="feedback"></div>
            </div>
        `;
        gameWrapper.querySelector('#answer-input').addEventListener('input', handleInput);
        generateQuestion();
        clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 1000);
        const answerInput = gameWrapper.querySelector('#answer-input');
        if (answerInput) answerInput.focus();
    }

    container.appendChild(gameWrapper);
    runGame();
}
