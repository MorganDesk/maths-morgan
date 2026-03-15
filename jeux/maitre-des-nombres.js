
let timerInterval = null;
let isGameOver = false;

// Nettoyage des timers
function cleanupInternals() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
}

// Formate les nombres avec des espaces et gère les décimaux
function formatNumber(n) {
    return new Intl.NumberFormat('fr-FR', { 
        maximumFractionDigits: 3, 
        minimumFractionDigits: 0,
        useGrouping: true 
    }).format(n);
}

// Fonction principale du jeu
export function start(container, options) {
    const { gameId, modeName, modeIndex, endGameCallback } = options;

    let gameWrapper = container.querySelector(`#${gameId}-wrapper`);
    if (!gameWrapper) {
        gameWrapper = document.createElement('div');
        gameWrapper.id = `${gameId}-wrapper`;
        container.appendChild(gameWrapper);
    }

    const GAME_DURATION = 60;
    let score = 0;
    let timeLeft = GAME_DURATION;
    let currentAnswer = '';

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
            </div>`;
        gameWrapper.querySelector('#restart-button').addEventListener('click', runGame);
    }

    function endGame() {
        if (isGameOver) return;
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

    function generateNewQuestion() {
        if (isGameOver) return;
        const questionEl = gameWrapper.querySelector('#question-text');
        const numberEl = gameWrapper.querySelector('#number-display');
        const answerEl = gameWrapper.querySelector('#answer-input');
        const feedbackEl = gameWrapper.querySelector('#feedback');

        if (feedbackEl) {
            feedbackEl.textContent = '';
            feedbackEl.className = 'feedback';
        }
        if(answerEl) {
            answerEl.value = '';
            answerEl.disabled = false;
            answerEl.focus();
        }

        let number;
        const isDecimalMode = modeIndex >= 2;
        const useDecimals = isDecimalMode || (modeIndex === 4 && Math.random() < 0.5);

        if (useDecimals) {
            const intPart = Math.floor(Math.random() * 1000);
            const decimalPart = Math.floor(Math.random() * 1000);
            const precision = Math.floor(Math.random() * 3) + 1;
            number = parseFloat(`${intPart}.${(decimalPart).toString().padStart(precision, '0').slice(0,precision)}`);
        } else {
            number = Math.floor(Math.random() * (100000 - 100 + 1)) + 100;
        }

        numberEl.textContent = formatNumber(number);

        const ranks = ['unités', 'dizaines', 'centaines', 'unités de mille', 'dizaines de mille'];
        const decimalRanks = ['dixièmes', 'centièmes', 'millièmes'];
        
        let availableRanks = [];
        const isTrapQuestion = Math.random() < 0.05;

        if (isTrapQuestion) {
            const isInteger = number % 1 === 0;
            if (isInteger) {
                availableRanks = [...decimalRanks];
            } else {
                const highestRankIndex = Math.floor(Math.log10(Math.abs(Math.floor(number))));
                if(highestRankIndex < ranks.length - 2) {
                    availableRanks = ranks.slice(highestRankIndex + 2);
                }
            }
        }

        if (availableRanks.length === 0) {
            const highestRankIndex = Math.floor(Math.log10(Math.abs(Math.floor(number))));
            availableRanks = ranks.slice(0, highestRankIndex + 1);
            if (number % 1 !== 0) {
                 const decimalPartStr = number.toString().split('.')[1] || '';
                 availableRanks.push(...decimalRanks.slice(0, decimalPartStr.length));
            }
        }

        const selectedRank = availableRanks[Math.floor(Math.random() * availableRanks.length)];

        let questionType;
        switch(modeIndex) {
            case 0: case 2: questionType = 'Chiffre'; break;
            case 1: case 3: questionType = 'Nombre'; break;
            case 4: questionType = Math.random() < 0.5 ? 'Chiffre' : 'Nombre'; break;
        }
        
        questionEl.textContent = `Quel est le ${questionType.toLowerCase()} des ${selectedRank} ?`;
        
        const rankPositionInInts = ranks.indexOf(selectedRank);
        const rankPositionInDecs = decimalRanks.indexOf(selectedRank);

        if (questionType === 'Chiffre') {
            const numberStr = number.toString();
            const [integerPart, decimalPartStr] = numberStr.split('.');

            if (rankPositionInInts !== -1) { // Partie entière
                const targetIndex = integerPart.length - 1 - rankPositionInInts;
                currentAnswer = integerPart[targetIndex] || '0';
            } else { // Partie décimale
                currentAnswer = (decimalPartStr && decimalPartStr[rankPositionInDecs]) ? decimalPartStr[rankPositionInDecs] : '0';
            }
        } else { // "Nombre de"
            let exponent;
            if (rankPositionInInts !== -1) {
                exponent = rankPositionInInts;
            } else {
                exponent = -(rankPositionInDecs + 1);
            }
            const rankValue = Math.pow(10, exponent);
            currentAnswer = Math.floor(number / rankValue).toString();
        }
        if (!currentAnswer) currentAnswer = '0';
    }

    function checkAnswer(userAnswer) {
        const feedbackEl = gameWrapper.querySelector('#feedback');
        const answerEl = gameWrapper.querySelector('#answer-input');

        answerEl.disabled = true;

        if (userAnswer === currentAnswer) {
            score++;
            gameWrapper.querySelector('#score').textContent = score;
            feedbackEl.textContent = 'Correct !';
            feedbackEl.className = 'feedback correct';
            setTimeout(generateNewQuestion, 500);
        } else {
            feedbackEl.textContent = `Incorrect ! La réponse était ${currentAnswer}`;
            feedbackEl.className = 'feedback incorrect';
            setTimeout(() => {
                if (isGameOver) return;
                generateNewQuestion();
            }, 1500);
        }
    }

    function handleInput(event) {
        if(event.key === "Enter") {
             checkAnswer(event.target.value);
        }
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
                    <p id="number-display" class="game-question"></p>
                    <p id="question-text" class="game-instruction"></p>
                    <input type="number" id="answer-input" class="answer-input" autofocus />
                    <div id="feedback" class="feedback"></div>
                </div>
            </div>`;
        
        gameWrapper.querySelector('#answer-input').addEventListener('keydown', handleInput);

        generateNewQuestion();
        timerInterval = setInterval(updateTimer, 1000);
    }

    runGame();
}

export function cleanup() {
    cleanupInternals();
    isGameOver = false;
}
