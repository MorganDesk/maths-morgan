let timerInterval = null;
let roundTimeout = null;
let resizeHandler = null;

export function start(container, options) {
    const { gameId, modeName, modeIndex, settings, endGameCallback } = options;

    let gameWrapper = container.querySelector(`#${gameId}-wrapper`);
    if (!gameWrapper) {
        gameWrapper = document.createElement('div');
        gameWrapper.id = `${gameId}-wrapper`;
        container.appendChild(gameWrapper);
    }

    const GAME_DURATION = settings.duration || 60;
    const ERROR_MARGIN = settings.errorMargin || 5;

    let score = 0;
    let timeLeft = GAME_DURATION;
    let currentAngle = 0;
    let isNextAngleAcute = true;
    let isGameOver = false;

    const ANGLE_MIN_ACUTE = 10, ANGLE_MAX_ACUTE = 89;
    const ANGLE_MIN_OBTUSE = 91, ANGLE_MAX_OBTUSE = 170;

    function cleanupInternals() {
        if (timerInterval) clearInterval(timerInterval);
        if (roundTimeout) clearTimeout(roundTimeout);
        if (resizeHandler) window.removeEventListener('resize', resizeHandler);
        timerInterval = null;
        roundTimeout = null;
        resizeHandler = null;
    }

    function showGameOverScreen() {
        endGameCallback(gameId, modeName, modeIndex, score);
        gameWrapper.innerHTML = `
            <div class="game-over-screen">
                <h2>Temps écoulé !</h2>
                <div class="final-score">${score}</div>
                <p class="final-score-label">bonnes réponses.</p>
                <div class="game-over-actions">
                     <button id="restart-button">Rejouer</button>
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
        if(timerElement) timerElement.textContent = timeLeft;
        if (timeLeft <= 0) endGame();
    }

    function drawAngle() {
        const canvas = gameWrapper.querySelector('#angle-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const containerWidth = canvas.parentElement.clientWidth;
        canvas.width = containerWidth;
        canvas.height = containerWidth * 0.6;
        const centerX = canvas.width / 2;
        const centerY = canvas.height * 0.7;
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

    function generateNewRound() {
        const answerInput = gameWrapper.querySelector('#answer-input');
        if (!answerInput) return;
        answerInput.value = '';
        answerInput.disabled = false;
        answerInput.focus();

        const feedbackEl = gameWrapper.querySelector('#feedback');
        feedbackEl.textContent = '';
        feedbackEl.className = 'feedback';

        if (modeName === 'Aigus') {
            currentAngle = Math.floor(Math.random() * (ANGLE_MAX_ACUTE - ANGLE_MIN_ACUTE + 1)) + ANGLE_MIN_ACUTE;
        } else if (modeName === 'Obtus') {
            currentAngle = Math.floor(Math.random() * (ANGLE_MAX_OBTUSE - ANGLE_MIN_OBTUSE + 1)) + ANGLE_MIN_OBTUSE;
        } else {
             if (isNextAngleAcute) {
                currentAngle = Math.floor(Math.random() * (ANGLE_MAX_ACUTE - ANGLE_MIN_ACUTE + 1)) + ANGLE_MIN_ACUTE;
            } else {
                currentAngle = Math.floor(Math.random() * (ANGLE_MAX_OBTUSE - ANGLE_MIN_OBTUSE + 1)) + ANGLE_MIN_OBTUSE;
            }
            isNextAngleAcute = !isNextAngleAcute;
        }
        drawAngle();
    }

    function checkAnswer() {
        const answerInput = gameWrapper.querySelector('#answer-input');
        if (!answerInput || isNaN(parseInt(answerInput.value, 10))) return;
        
        answerInput.disabled = true;
        const feedbackEl = gameWrapper.querySelector('#feedback');
        const difference = Math.abs(parseInt(answerInput.value, 10) - currentAngle);

        if (difference <= ERROR_MARGIN) {
            feedbackEl.textContent = `Correct ! (${currentAngle}°)`
            feedbackEl.className = 'feedback correct';
            score++;
            gameWrapper.querySelector('#score').textContent = score;
        } else {
            feedbackEl.textContent = `Raté. C'était ${currentAngle}°`;
            feedbackEl.className = 'feedback incorrect';
        }

        roundTimeout = setTimeout(() => {
            if(!isGameOver) generateNewRound();
        }, 1200);
    }

    function runGame() {
        cleanupInternals(); // Nettoyer avant de commencer
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
                <div class="game-question"><canvas id="angle-canvas"></canvas></div>
                <input type="number" pattern="[0-9]*" inputmode="numeric" id="answer-input" placeholder="Degrés" autocomplete="off" autofocus>
                <div id="feedback" class="feedback"></div>
            </div>
        `;

        gameWrapper.querySelector('#answer-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.target.disabled) checkAnswer();
        });
        
        resizeHandler = drawAngle; // Assigner pour le cleanup
        window.addEventListener('resize', resizeHandler);

        generateNewRound();
        timerInterval = setInterval(updateTimer, 1000);
    }

    runGame();
}

export function cleanup() {
    if (timerInterval) clearInterval(timerInterval);
    if (roundTimeout) clearTimeout(roundTimeout);
    if (resizeHandler) window.removeEventListener('resize', resizeHandler);
    timerInterval = null;
    roundTimeout = null;
    resizeHandler = null;
}
