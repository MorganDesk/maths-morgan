// --- VARIABLES GLOBALES ---
let initialNumbers = [];
let currentNumbers = [];
let targetCB = 0;
let selectedIndices = []; 
let currentOp = null; 
let currentDifficulty = 3; // Par défaut : Normal (min 3)

const POSSIBLES = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 25, 50, 75, 100];

// --- INITIALISATION ---
let cbCurrentStreak = 0; // Nouvelle variable pour la série en cours
let currentModeCB = 'normal'; // Pour suivre le mode sélectionné

function chargerMenuCompteBon(target, gameConfig) {
    const destination = target || document.getElementById('game-zone');
    // Record par défaut pour le mode normal
    const recordInitial = parseInt(Storage.getItem('maths_morgan_record_cb_normal')) || 0;

    destination.innerHTML += `
        <div class="card game-card">
            <div class="card-header">
                <span class="tag">${gameConfig.category}</span>
                <span id="record-tag-cb" class="tag-highscore" ${recordInitial > 0 ? '' : 'style="display:none"'}>
                    <i class="fas fa-trophy"></i> Record : <span id="cb-record-val">${recordInitial}</span>
                </span>
            </div>
            <h3>${gameConfig.title}</h3>
            <p>${gameConfig.description}</p>
            <div class="fichiers-liste-verticale">
                <select id="diff-select-cb" class="game-input-select" onchange="updateCBRecordDisplay(this.value)" style="width:100%; margin-bottom:12px;">
                    <option value="normal">Mode : Normal</option>
                    <option value="expert">Mode : Expert</option>
                </select>
                <button class="btn-download-full" onclick="preStartCompteBon()" style="border:none; cursor:pointer; width:100%;">
                    <i class="fas fa-play"></i> Lancer le défi
                </button>
            </div>
        </div>`;
}

// Fonction de mise à jour corrigée
function updateCBRecordDisplay(mode) {
    const storageKey = `maths_morgan_record_cb_${mode}`;
    const high = parseInt(Storage.getItem(storageKey)) || 0;
    
    const badge = document.getElementById('record-tag-cb');
    const valeur = document.getElementById('cb-record-val');
    
    if (valeur) valeur.innerText = high;
    if (badge) badge.style.display = high > 0 ? '' : 'none';
}


function preStartCompteBon() {
    const select = document.getElementById('diff-select-cb');
    if (!select) return;

    currentModeCB = select.value;
    cbCurrentStreak = 0;
    currentDifficulty = (currentModeCB === 'normal') ? 3 : 4;
    
    setupCompteBonUI();
    generatePuzzle();
}

// --- LOGIQUE DE CALCUL ET VÉRIFICATION ---

function calculate(n1, n2, op) {
    if (op === '+') return n1 + n2;
    if (op === '-') return Math.abs(n1 - n2);
    if (op === '*') return n1 * n2;
    if (op === '/') {
        if (n2 !== 0 && n1 % n2 === 0 && n2 > 1) return n1 / n2;
        if (n1 !== 0 && n2 % n1 === 0 && n1 > 1) return n2 / n1;
    }
    return 0;
}

function getShortestPath(numbers, target) {
    for (let limit = 1; limit <= 5; limit++) {
        if (canSolveInNSteps(numbers, target, limit)) return limit;
    }
    return 6; 
}

function canSolveInNSteps(currentNumbers, target, stepsLeft) {
    for (let i = 0; i < currentNumbers.length; i++) {
        for (let j = i + 1; j < currentNumbers.length; j++) {
            const n1 = currentNumbers[i];
            const n2 = currentNumbers[j];
            for (let op of ['+', '-', '*', '/']) {
                let res = calculate(n1, n2, op);
                if (res <= 1 || res === n1 || res === n2) continue;
                if (res === target) return true;
                if (stepsLeft > 1) {
                    let nextNumbers = currentNumbers.filter((_, idx) => idx !== i && idx !== j);
                    nextNumbers.push(res);
                    if (canSolveInNSteps(nextNumbers, target, stepsLeft - 1)) return true;
                }
            }
        }
    }
    return false;
}

// --- GÉNÉRATION ---

function generatePuzzle() {
    initialNumbers = [];
    let tempPossibles = [...POSSIBLES];
    while (initialNumbers.length < 6) {
        let tirage = tempPossibles[Math.floor(Math.random() * tempPossibles.length)];
        let count = initialNumbers.filter(n => n === tirage).length;
        let maxAllowed = (tirage >= 1 && tirage <= 9) ? 2 : 1;
        if (count < maxAllowed) initialNumbers.push(tirage);
    }

    let result = 0;
    let attempts = 0;

    // On cherche jusqu'à trouver un puzzle qui respecte STRICTEMENT le seuil
    while (attempts < 3000) { 
        let pool = [...initialNumbers];
        // On simule une construction complexe (5 étapes)
        for (let i = 0; i < 5; i++) {
            if (pool.length < 2) break;
            let idx1 = Math.floor(Math.random() * pool.length);
            let n1 = pool.splice(idx1, 1)[0];
            let idx2 = Math.floor(Math.random() * pool.length);
            let n2 = pool.splice(idx2, 1)[0];
            let op = ['+', '-', '*', '*', '/'][Math.floor(Math.random() * 5)];
            let res = calculate(n1, n2, op);
            if (res > 1 && res !== n1 && res !== n2) pool.push(res);
            else pool.push(n1, n2);
        }

        const pot = pool.find(n => n >= 150 && n <= 999 && !initialNumbers.includes(n));
        if (pot) {
            // VERIFICATION : On n'accepte QUE si le chemin le plus court est >= difficulté
            if (getShortestPath(initialNumbers, pot) >= currentDifficulty) {
                result = pot;
                break;
            }
        }
        attempts++;
    }

    // Si vraiment rien n'est trouvé après 3000 essais (cas rarissime), on recommence
    if (result === 0) return generatePuzzle(); 
    
    const msgZone = document.getElementById('cb-message');
    if (msgZone) msgZone.innerHTML = '';
    
    const grid = document.getElementById('numbers-grid');
    if (grid) {
        grid.style.opacity = "1";
        grid.style.pointerEvents = "auto";
    }

    targetCB = result;
    resetPuzzle();
}

// --- INTERFACE ---

function setupCompteBonUI() {
    const container = document.getElementById('main-container');
    container.innerHTML = `
        <div class="game-active-container">
            <div class="game-header">
                <button class="btn-download-full" onclick="location.reload()" style="width:auto; padding: 8px 20px; background-color: #64748b;">
                    <i class="fas fa-arrow-left"></i> Retour
                </button>
                <div style="text-align:right;">
                    <div style="font-weight:bold; color:var(--primary);">Série (${currentModeCB}) : <span id="cb-streak-val">0</span></div>
                </div>
            </div>
            
            <div id="cb-message" style="min-height: 60px; margin: 10px 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;"></div>

            <div class="game-display" id="target-cb">0</div>
            
            <div id="numbers-grid" style="display:grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px auto; max-width: 320px;"></div>
            
            <div class="operators-row" style="display:flex; justify-content:center; gap:10px; margin-bottom:25px;">
                <button class="op-btn" onclick="setOp('+')">+</button>
                <button class="op-btn" onclick="setOp('-')">−</button>
                <button class="op-btn" onclick="setOp('*')">×</button>
                <button class="op-btn" onclick="setOp('/')">÷</button>
            </div>
            
            <div id="cb-controls" style="display:flex; justify-content:center; gap:12px; flex-wrap: wrap;">
                <button class="btn-download-full" onclick="resetPuzzle()" style="width:auto; background-color: #ef4444; padding: 12px 20px;">
                    <i class="fas fa-undo"></i> Réinitialiser
                </button>
                <button class="btn-download-full" onclick="generatePuzzle()" style="width:auto; background-color: #64748b; padding: 12px 20px;">
                    <i class="fas fa-sync-alt"></i> Nouveau puzzle
                </button>
            </div>
        </div>
    `;
}

function updateUI() {
    document.getElementById('target-cb').innerText = targetCB;
    const grid = document.getElementById('numbers-grid');
    grid.innerHTML = '';
    
    currentNumbers.forEach((num, idx) => {
        const btn = document.createElement('button');
        btn.className = 'plate'; 
        if (selectedIndices.includes(idx)) btn.classList.add('selected');
        btn.innerText = num;
        btn.onclick = () => selectNumber(idx);
        grid.appendChild(btn);
    });

    document.querySelectorAll('.op-btn').forEach(btn => {
        const opStr = btn.innerText;
        const opMapped = (opStr === '×' ? '*' : opStr === '÷' ? '/' : opStr === '−' ? '-' : opStr);
        btn.classList.toggle('active', currentOp === opMapped);
    });
}

function selectNumber(idx) {
    if (selectedIndices.includes(idx)) {
        selectedIndices = selectedIndices.filter(i => i !== idx);
    } else {
        selectedIndices.push(idx);
        if (selectedIndices.length > 2) selectedIndices.shift();
    }
    
    if (selectedIndices.length === 2 && currentOp) {
        applyOperation();
    }
    updateUI();
}

function setOp(op) {
    currentOp = (currentOp === op) ? null : op;
    if (selectedIndices.length === 2 && currentOp) {
        applyOperation();
    }
    updateUI();
}

function applyOperation() {
    const idx1 = selectedIndices[0];
    const idx2 = selectedIndices[1];
    const n1 = currentNumbers[idx1];
    const n2 = currentNumbers[idx2];
    
    let res = calculate(n1, n2, currentOp);
    
    if (res === 0) {
        selectedIndices = [];
        currentOp = null;
        return;
    }

    const i1 = Math.max(idx1, idx2);
    const i2 = Math.min(idx1, idx2);
    currentNumbers.splice(i1, 1);
    currentNumbers.splice(i2, 1);
    currentNumbers.push(res);
    
    selectedIndices = [];
    currentOp = null;
    
    if (res === targetCB) {
        updateUI();
        setTimeout(displayWin, 500);
    } else {
        updateUI();
    }
}

function resetPuzzle() {
    currentNumbers = [...initialNumbers];
    selectedIndices = [];
    currentOp = null;
    updateUI();
}

function displayWin() {
    cbCurrentStreak++;
    
    // Sauvegarde du record par mode
    const storageKey = `maths_morgan_record_cb_${currentModeCB}`;
    const oldRecord = parseInt(Storage.getItem(storageKey)) || 0;
    if (cbCurrentStreak > oldRecord) {
        Storage.setItem(storageKey, cbCurrentStreak);
    }

    // Mise à jour de l'affichage de la série
    document.getElementById('cb-streak-val').innerText = cbCurrentStreak;

    // Affichage du message et du bouton Rejouer
    const msgZone = document.getElementById('cb-message');
    msgZone.innerHTML = `
        <div style="color: #059669; font-weight: bold; font-size: 1.2rem;">🎉 Bravo ! Le compte est bon.</div>
        <button class="btn-download-full" onclick="generatePuzzle()" style="width:auto; background-color: var(--primary); padding: 8px 20px;">
            <i class="fas fa-play"></i> Continuer la série
        </button>
    `;

    // Cacher la grille pour forcer l'usage du bouton
    document.getElementById('numbers-grid').style.opacity = "0.3";
    document.getElementById('numbers-grid').style.pointerEvents = "none";
}