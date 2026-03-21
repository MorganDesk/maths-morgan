let timerInterval = null;
let isGameOver = false;

const MODES = [
    { name: 'Longueurs', units: ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm'], base: 10 },
    { name: 'Aires (m²)', units: ['km²', 'hm²', 'dam²', 'm²', 'dm²', 'cm²', 'mm²'], base: 100 },
    { name: 'Masses (g)', units: ['t', 'q', '-', 'kg', 'hg', 'dag', 'g', 'dg', 'cg', 'mg'], base: 10 },
    { name: 'Capacités (L)', units: ['kL', 'hL', 'daL', 'L', 'dL', 'cL', 'mL'], base: 10 },
    { name: 'Volumes (m³)', units: ['km³', 'hm³', 'dam³', 'm³', 'dm³', 'cm³', 'mm³'], base: 1000 }
];

function cleanupInternals() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
}

function isValidNumber(n) {
    if (n === 0) return true;
    let str = n.toString();
    if (str.includes('e')) return false; // On exclut la notation scientifique qui dépasserait les 5 chiffres
    let parts = str.split('.');
    let intPart = parts[0].replace('-', '');
    let decPart = parts[1] || '';
    
    // Max 5 chiffres au total
    if (intPart.length + decPart.length > 5) return false;
    // Max 2 décimales
    if (decPart.length > 2) return false;
    
    return true;
}

function generateQuestion(modeObj) {
    let units = modeObj.units;
    let base = modeObj.base;
    let attempts = 0;
    
    while (attempts < 1000) {
        attempts++;
        let idx1 = Math.floor(Math.random() * units.length);
        let idx2 = Math.floor(Math.random() * units.length);
        if (idx1 === idx2 || units[idx1] === '-' || units[idx2] === '-') continue;

        let dist = idx2 - idx1;
        let multiplier = Math.pow(base, dist);

        let isDecimal = Math.random() < 0.3; // 30% chance de décimal au départ
        let num;
        
        if (isDecimal) {
            let decCount = Math.random() < 0.5 ? 1 : 2;
            let maxVal = Math.pow(10, 5 - decCount) - 1;
            let baseInt = Math.floor(Math.random() * maxVal);
            if (baseInt === 0 && Math.random() < 0.5) baseInt = 1;
            let decPart = Math.floor(Math.random() * Math.pow(10, decCount));
            num = parseFloat(baseInt + '.' + decPart.toString().padStart(decCount, '0'));
            if (num === 0) continue;
        } else {
            let digitsCount = Math.floor(Math.random() * 4) + 1; // 1 à 4 chiffres max en entrée entière pour laisser de la marge
            num = Math.floor(Math.random() * Math.pow(10, digitsCount)) + 1;
        }

        let result = num * multiplier;
        // Gérer les imprécisions JS (0.1 + 0.2)
        result = parseFloat(result.toPrecision(10));

        if (isValidNumber(num) && isValidNumber(result)) {
            // Check limits again after toPrecision just in case
            if (isValidNumber(result)) {
                return {
                    startVal: num,
                    startUnit: units[idx1],
                    targetVal: result,
                    targetUnit: units[idx2]
                };
            }
        }
    }
    // Fallback de sécurité
    return {
        startVal: 1,
        startUnit: units[0],
        targetVal: base,
        targetUnit: units[1]
    };
}

export function start(container, options) {
    const { gameId, modeName, modeIndex, endGameCallback } = options;

    let gameWrapper = container.querySelector(`#${gameId}-wrapper`);
    if (!gameWrapper) {
        gameWrapper = document.createElement('div');
        gameWrapper.id = `${gameId}-wrapper`;
        container.appendChild(gameWrapper);
    }

    const GAME_DURATION = 120; // 120s demandées
    const modeObj = MODES[modeIndex];
    
    let score = 0;
    let timeLeft = GAME_DURATION;
    let currentQuestion = null;

    function showGameOverScreen() {
        endGameCallback(gameId, modeName, modeIndex, score);
        gameWrapper.innerHTML = `
            <div class="game-container">
                <div class="game-over-screen">
                    <h2>Temps écoulé !</h2>
                    <div class="final-score">${score}</div>
                    <p class="final-score-label">bonnes conversions.</p>
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
        if (isGameOver) return;
        timeLeft--;
        const timerElement = gameWrapper.querySelector('#time-left');
        if (timerElement) timerElement.textContent = timeLeft;
        if (timeLeft <= 0) endGame();
    }

    function buildTableHTML() {
        const colsHTML = modeObj.units.map(u => {
            if (u === '-') {
                return `
                <div class="conv-cell">
                    <div class="conv-header">-</div>
                    <div class="conv-subcols"><div class="conv-subcol"></div></div>
                </div>`;
            }
            let subColsCount = modeObj.base === 10 ? 1 : (modeObj.base === 100 ? 2 : 3);
            let subColsHTML = Array(subColsCount).fill('<div class="conv-subcol"></div>').join('');
            return `
            <div class="conv-cell">
                <div class="conv-header">${u}</div>
                <div class="conv-subcols">${subColsHTML}</div>
            </div>`;
        }).join('');

        return `<div class="conv-table">${colsHTML}</div>`;
    }

    function nextQuestion() {
        if (isGameOver) return;
        currentQuestion = generateQuestion(modeObj);
        
        gameWrapper.querySelector('#start-val').textContent = currentQuestion.startVal.toString().replace('.', ',');
        gameWrapper.querySelector('#start-unit').textContent = currentQuestion.startUnit;
        gameWrapper.querySelector('#target-unit').textContent = currentQuestion.targetUnit;
        
        const answerInput = gameWrapper.querySelector('#answer-input');
        answerInput.value = '';
        answerInput.disabled = false;
        
        const feedbackEl = gameWrapper.querySelector('#feedback');
        if (feedbackEl) {
            feedbackEl.textContent = '';
            feedbackEl.className = 'feedback';
        }
        
        // Timeout pour éviter un bug de focus sur mobile lors d'un restart ou validation Enter
        setTimeout(() => answerInput.focus(), 50);
    }

    function handleValidation() {
        if(isGameOver) return;
        
        const answerInput = gameWrapper.querySelector('#answer-input');
        const feedbackEl = gameWrapper.querySelector('#feedback');
        if(!answerInput.value.trim()) return;

        // On remplace les virgules par des points pour lire un float valide
        let rawValue = answerInput.value.replace(',', '.').trim();
        let userAnswer = parseFloat(rawValue);

        if (isNaN(userAnswer)) return;

        answerInput.disabled = true;

        if (userAnswer === currentQuestion.targetVal) {
            score++;
            gameWrapper.querySelector('#score').textContent = score;
            feedbackEl.textContent = 'Correct !';
            feedbackEl.className = 'feedback correct';
            setTimeout(nextQuestion, 500);
        } else {
            feedbackEl.textContent = \`Faux ! La réponse était \${currentQuestion.targetVal.toString().replace('.', ',')}\`;
            feedbackEl.className = 'feedback incorrect';
            setTimeout(nextQuestion, 1500);
        }
    }

    function runGame() {
        cleanupInternals();
        score = 0;
        timeLeft = GAME_DURATION;
        isGameOver = false;

        const tableHTML = buildTableHTML();

        gameWrapper.innerHTML = `
            <div class="game-container">
                <div class="game-stats">
                    <span>Score: <span id="score">0</span></span>
                    <span>Temps: <span id="time-left">${GAME_DURATION}</span>s</span>
                </div>
                <div class="game-area">
                    <div class="au-question">
                        <span id="start-val" class="au-val"></span> <span id="start-unit" class="au-unit"></span>
                        <span class="au-arrow"><i class="fas fa-arrow-right"></i></span>
                        <input type="text" inputmode="decimal" id="answer-input" class="au-input" placeholder="..." autocomplete="off" autofocus />
                        <span id="target-unit" class="au-unit target"></span>
                    </div>
                    <div id="feedback" class="feedback"></div>
                    
                    <div class="conversion-table-container">
                        ${tableHTML}
                    </div>
                </div>
            </div>`;
        
        const answerInput = gameWrapper.querySelector('#answer-input');
        answerInput.addEventListener('keydown', (e) => {
            if (e.key === "Enter") handleValidation();
        });

        nextQuestion();
        timerInterval = setInterval(updateTimer, 1000);
    }

    runGame();
}

export function cleanup() {
    cleanupInternals();
    isGameOver = false;
}
