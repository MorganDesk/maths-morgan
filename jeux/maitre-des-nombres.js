
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
            if (isInteger && useDecimals) {
                availableRanks = [...decimalRanks];
            } else if (!isInteger) {
                const highestRankIndex = Math.floor(Math.log10(Math.abs(number)));
                if(highestRankIndex < ranks.length -1) {
                    availableRanks = ranks.slice(highestRankIndex + 2);
                }
            }
        }

        if (availableRanks.length === 0) {
            const highestRankIndex = Math.floor(Math.log10(Math.abs(number)));
            availableRanks = ranks.slice(0, highestRankIndex + 1);
            if(highestRankIndex < ranks.length -1) availableRanks.push(ranks[highestRankIndex + 1]);
            if (number % 1 !== 0) {
                 availableRanks.push(...decimalRanks);
            }
        }

        const selectedRank = availableRanks[Math.floor(Math.random() * availableRanks.length)];

        let exponent;
        let rankPosition = ranks.indexOf(selectedRank);
        if (rankPosition !== -1) {
            exponent = rankPosition;
        } else {
            rankPosition = decimalRanks.indexOf(selectedRank);
            exponent = -(rankPosition + 1);
        }
        const rankValue = Math.pow(10, exponent);

        let questionType;
        switch(modeIndex) {
            case 0: case 2: questionType = 'Chiffre'; break;
            case 1: case 3: questionType = 'Nombre'; break;
            case 4: questionType = Math.random() < 0.5 ? 'Chiffre' : 'Nombre'; break;
        }
        
        questionEl.textContent = `Quel est le ${questionType.toLowerCase()} des ${selectedRank} ?`;

        if (questionType === 'Chiffre') {
            currentAnswer = Math.floor((number / rankValue) % 10).toString();
        } else {
            currentAnswer = Math.floor(number / rankValue).toString();
        }
    }

    function checkAnswer(userAnswer) {
        const feedbackEl = gameWrapper.querySelector('#feedback');
        const answerEl = gameWrapper.querySelector('#answer-input');

        answerEl.disabled = true; // Désactive l'input pendant la validation

        if (userAnswer === currentAnswer) {
            score++;
            gameWrapper.querySelector('#score').textContent = score;
            feedbackEl.textContent = 'Correct !';
            feedbackEl.className = 'feedback correct';
            setTimeout(generateNewQuestion, 500); // Passe à la question suivante
        } else {
            feedbackEl.textContent = 'Incorrect !';
            feedbackEl.className = 'feedback incorrect';
            setTimeout(() => {
                if (isGameOver) return;
                feedbackEl.textContent = '';
                feedbackEl.className = 'feedback';
                answerEl.value = ''; // Vide l'input
                answerEl.disabled = false; // Réactive l'input
                answerEl.focus(); // Remet le focus
            }, 500);
        }
    }

    function handleInput(event) {
        const input = event.target;
        if (input.value.length >= currentAnswer.length) {
            checkAnswer(input.value);
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
        
        gameWrapper.querySelector('#answer-input').addEventListener('input', handleInput);

        generateNewQuestion();
        timerInterval = setInterval(updateTimer, 1000);
    }

    runGame();
}

export function cleanup() {
    cleanupInternals();
    isGameOver = false;
}
