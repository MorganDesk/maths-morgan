import { getHighScore, saveHighScore } from '../js/storage.js';
import { completeGame } from '../js/progression.js';

export function start(container, gameId, mode, modeIndex) {
    let gameWrapper = container.querySelector(`#${gameId}-wrapper`);
    if (!gameWrapper) {
        gameWrapper = document.createElement('div');
        gameWrapper.id = `${gameId}-wrapper`;
        container.appendChild(gameWrapper);
    }

    const GAME_DURATION = 60;
    let score = 0;
    let timeLeft = GAME_DURATION;
    let timerInterval = null;
    let currentAngle = 0;
    let isNextAngleAcute = true;
    let isGameOver = false;

    const ANGLE_MIN_ACUTE = 10, ANGLE_MAX_ACUTE = 89;
    const ANGLE_MIN_OBTUSE = 91, ANGLE_MAX_OBTUSE = 170;
    const ERROR_MARGIN = 5;

    function endGame() {
        if(isGameOver) return;
        isGameOver = true;
        clearInterval(timerInterval);
        window.removeEventListener('resize', drawAngle);
        
        completeGame(gameId, modeIndex, score);

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
    }

    function updateTimer() {
        timeLeft--;
        const timerElement = gameWrapper.querySelector('#time-left');
        if(timerElement) timerElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame();
        }
    }

    function generateNewRound() {
        const answerInput = gameWrapper.querySelector('#answer-input');
        answerInput.value = '';
        answerInput.disabled = false;
        answerInput.focus();

        const feedbackEl = gameWrapper.querySelector('#feedback');
        feedbackEl.textContent = '';
        feedbackEl.className = 'feedback';

        if (isNextAngleAcute) {
            currentAngle = Math.floor(Math.random() * (ANGLE_MAX_ACUTE - ANGLE_MIN_ACUTE + 1)) + ANGLE_MIN_ACUTE;
        } else {
            currentAngle = Math.floor(Math.random() * (ANGLE_MAX_OBTUSE - ANGLE_MIN_OBTUSE + 1)) + ANGLE_MIN_OBTUSE;
        }
        isNextAngleAcute = !isNextAngleAcute;

        drawAngle();
    }
    
    function drawAngle() {
        const canvas = gameWrapper.querySelector('#angle-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const containerWidth = canvas.parentElement.clientWidth;
        canvas.width = containerWidth;
        canvas.height = containerWidth * 0.6; // Ratio pour le canvas

        const centerX = canvas.width / 2;
        const centerY = canvas.height * 0.7; // Abaisser pour visibilité
        const radius = containerWidth * 0.3;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.beginPath();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 4;

        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + radius, centerY);

        const angleInRadians = currentAngle * (Math.PI / 180);
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + radius * Math.cos(angleInRadians), centerY - radius * Math.sin(angleInRadians));
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = '#4f46e5';
        ctx.lineWidth = 2;
        ctx.arc(centerX, centerY, radius / 2.5, 0, -angleInRadians, true);
        ctx.stroke();
    }

    function checkAnswer() {
        const answerInput = gameWrapper.querySelector('#answer-input');
        const userAnswer = parseInt(answerInput.value, 10);

        if (isNaN(userAnswer)) return;
        
        answerInput.disabled = true;
        const feedbackEl = gameWrapper.querySelector('#feedback');
        const difference = Math.abs(userAnswer - currentAngle);

        if (difference <= ERROR_MARGIN) {
            feedbackEl.textContent = `Correct ! (${currentAngle}°)`
            feedbackEl.className = 'feedback correct';
            score++;
            gameWrapper.querySelector('#score').textContent = score;
        } else {
            feedbackEl.textContent = `Raté. C'était ${currentAngle}°`;
            feedbackEl.className = 'feedback incorrect';
        }

        setTimeout(() => {
            if(!isGameOver) generateNewRound();
        }, 1200);
    }

    function runGame() {
        score = 0;
        timeLeft = GAME_DURATION;
        isNextAngleAcute = true;
        isGameOver = false;

        gameWrapper.innerHTML = `
            <div class="game-stats">
                <span>Score: <span id="score">0</span></span>
                <span>Temps: <span id="time-left">${GAME_DURATION}</span>s</span>
            </div>
            <div class="game-area">
                <p class="game-instruction">Estimez la valeur de cet angle :</p>
                <div class="game-question">
                    <canvas id="angle-canvas"></canvas>
                </div>
                <input type="number" pattern="[0-9]*" inputmode="numeric" id="answer-input" placeholder="Degrés" autocomplete="off" autofocus>
                <div id="feedback" class="feedback"></div>
            </div>
        `;

        const answerInput = gameWrapper.querySelector('#answer-input');
        
        answerInput.addEventListener('input', () => {
            const requiredLength = String(currentAngle).length;
            const currentLength = answerInput.value.length;

            if (currentLength === requiredLength && !answerInput.disabled) {
                checkAnswer();
            }
        });

        window.addEventListener('resize', drawAngle);

        generateNewRound();
        clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 1000);
    }

    runGame();
}
