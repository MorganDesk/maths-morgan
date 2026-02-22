// js/numeration-positions.js
let scoreNum = 0;
let timeLeftNum = 60;
let timerNum;
let currentQuestion = { number: "0", targetType: "", positionName: "", answer: "" };
let gameModeNum = 'chiffre'; // 'chiffre', 'nombre', 'expert'

const POSITIONS = [
    { name: "centaines de mille", power: 5 },
    { name: "dizaines de mille", power: 4 },
    { name: "unités de mille", power: 3 },
    { name: "centaines", power: 2 },
    { name: "dizaines", power: 1 },
    { name: "unités", power: 0 },
    { name: "dixièmes", power: -1 },
    { name: "centièmes", power: -2 },
    { name: "millièmes", power: -3 }
];

function chargerMenuNumeration(target, gameConfig) {
    const destination = target || document.getElementById('game-zone');
    const highChiffre = Storage.getItem('maths_morgan_highscore_num_chiffre') || 0;
    const highNombre = Storage.getItem('maths_morgan_highscore_num_nombre') || 0;
    const highExpert = Storage.getItem('maths_morgan_highscore_num_expert') || 0;
    const maxHigh = Math.max(highChiffre, highNombre, highExpert);

    destination.innerHTML += `
        <div class="card game-card">
            <div class="card-header">
                <span class="tag">${gameConfig.category}</span>
                <span id="badge-record-num" class="tag-highscore" ${maxHigh > 0 ? '' : 'style="display:none"'}>
                    <i class="fas fa-trophy"></i> Record : <span id="valeur-record-num">${highChiffre}</span>
                </span>
            </div>
            <h3>${gameConfig.title}</h3>
            <p>${gameConfig.description}</p>
            <div class="fichiers-liste-verticale">
                <select id="select-mode-num" class="game-input-select" style="width:100%; margin-bottom:10px;" onchange="updateRecordNum()">
                    <option value="chiffre">Mode "Chiffre de..."</option>
                    <option value="nombre">Mode "Nombre de..."</option>
                    <option value="expert">Mode Expert (Mixte)</option>
                </select>
                <button class="btn-download-full" onclick="startNumGame()" style="border:none; cursor:pointer; width:100%;">
                    <i class="fas fa-play"></i> Lancer le défi
                </button>
            </div>
        </div>`;
}


function updateRecordNum() {
    const mode = document.getElementById('select-mode-num').value;
    const record = Storage.getItem(`maths_morgan_highscore_num_${mode}`) || 0;
    const badge = document.getElementById('badge-record-num');
    const val = document.getElementById('valeur-record-num');
    if(record > 0) { badge.style.display = ''; val.innerText = record; }
    else { badge.style.display = 'none'; }
}

function startNumGame() {
    gameModeNum = document.getElementById('select-mode-num').value;
    scoreNum = 0;
    timeLeftNum = 60;
    setupNumUI();
    generateQuestion();

    timerNum = setInterval(() => {
        timeLeftNum--;
        document.getElementById('timer').innerText = timeLeftNum;
        if (timeLeftNum <= 0) endGameNum();
    }, 1000);
}

function setupNumUI() {
    const container = document.getElementById('main-container');
    container.innerHTML = `
        <div class="game-active-container">
            <div class="game-stats">
                <span>Score : <strong id="score">0</strong></span>
                <span>Temps : <strong id="timer">60</strong>s</span>
            </div>
            <div id="num-display" class="game-display" style="font-size: 3.5rem; letter-spacing: 2px;">0</div>
            <p id="num-question" style="font-size: 1.2rem; margin-bottom: 20px; font-weight: 600; min-height: 1.5em;"></p>
            <input type="text" id="num-input" class="game-input" autocomplete="off" inputmode="numeric" pattern="[0-9]*">
        </div>`;
    
    const input = document.getElementById('num-input');
    input.focus();
    input.addEventListener('input', checkNumResponse);
}

function generateQuestion() {
    // 1. Déterminer le type de question en premier pour adapter le nombre
    let type = gameModeNum;
    if (gameModeNum === 'expert') type = Math.random() > 0.5 ? 'chiffre' : 'nombre';

    // 2. Génération du nombre adaptée
    let maxPuissanceEntiere = (type === 'nombre') ? 3 : 6; // Limite à 999 si c'est un "nombre de"
    
    const maxEntier = Math.pow(10, Math.floor(Math.random() * maxPuissanceEntiere) + 1);
    const intPart = Math.floor(Math.random() * maxEntier);
    let numStr = intPart.toString();
    
    // Partie décimale (jusqu'aux millièmes)
    if (Math.random() > 0.2) {
        const decPart = Math.floor(Math.random() * 999) + 1;
        numStr += "." + decPart.toString().replace(/0+$/, "");
    }
    const finalNum = parseFloat(numStr);

    // 3. Sélection de la position (10% de pièges)
    let pos;
    const isTrapAttempt = Math.random() < 0.10;

    if (!isTrapAttempt) {
        const validPositions = POSITIONS.filter(p => {
            const valueAtPos = Math.floor(Math.round(finalNum * 1000) / (Math.pow(10, p.power) * 1000));
            return valueAtPos > 0; 
        });
        pos = validPositions.length > 0 
              ? validPositions[Math.floor(Math.random() * validPositions.length)]
              : POSITIONS[Math.floor(Math.random() * POSITIONS.length)];
    } else {
        pos = POSITIONS[Math.floor(Math.random() * POSITIONS.length)];
    }

    // 4. Calcul de la réponse
    let answer;
    if (type === 'chiffre') {
        const shifted = Math.floor(Math.round(finalNum * 1000) / Math.pow(10, pos.power + 3));
        answer = (shifted % 10).toString();
    } else {
        answer = Math.floor(Math.round(finalNum * 1000) / (Math.pow(10, pos.power) * 1000)).toString();
    }

    // 5. Interface
    currentQuestion = { number: numStr, targetType: type, positionName: pos.name, answer: answer };
    document.getElementById('num-display').innerText = formatNumberWithSpaces(numStr);
    document.getElementById('num-question').innerHTML = `Quel est le <strong>${type} de ${pos.name}</strong> ?`;
    document.getElementById('num-input').value = "";
}

function formatNumberWithSpaces(numStr) {
    let [entier, decimal] = numStr.split('.');
    // Ajoute un espace tous les 3 chiffres en partant de la droite
    entier = entier.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return decimal ? `${entier},${decimal}` : entier;
}

function checkNumResponse() {
    const input = document.getElementById('num-input');
    if (input.value === currentQuestion.answer) {
        scoreNum++;
        document.getElementById('score').innerText = scoreNum;
        
        // Petit effet de zoom sur le score pour le côté "Satisfaisant"
        const scoreEl = document.getElementById('score');
        scoreEl.style.transform = "scale(1.3)";
        setTimeout(() => scoreEl.style.transform = "scale(1)", 200);

        input.style.backgroundColor = "#dcfce7";
        setTimeout(() => {
            input.style.backgroundColor = "";
            generateQuestion();
        }, 100);
    }
}

function endGameNum() {
    clearInterval(timerNum);
    const storageKey = `maths_morgan_highscore_num_${gameModeNum}`;
    const high = Storage.getItem(storageKey) || 0;
    const isNewRecord = (scoreNum > high);
    if (isNewRecord) Storage.setItem(storageKey, scoreNum);

    const container = document.getElementById('main-container');
    container.innerHTML = `
        <div class="game-active-container">
            <h2>${isNewRecord ? '🎉 NOUVEAU RECORD ! 🎉' : 'Fin du défi !'}</h2>
            <div class="game-display">${scoreNum}</div>
            <p>réponses correctes en mode ${gameModeNum}.</p>
            <div class="highscore-display">Record : <strong>${isNewRecord ? scoreNum : high}</strong></div>
            <button class="btn-download-full" onclick="location.reload()" style="margin-top:20px; border:none; cursor:pointer;">
                <i class="fas fa-undo"></i> Menu
            </button>
        </div>`;
}