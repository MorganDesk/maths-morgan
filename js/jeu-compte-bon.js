// --- VARIABLES GLOBALES ---
let initialNumbers = [];
let currentNumbers = [];
let targetCB = 0;
let selectedIndices = []; 
let currentOp = null; 

const POSSIBLES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 25, 50, 75, 100];

// --- INITIALISATION ---
function chargerMenuCompteBon() {
    const gameZone = document.getElementById('game-zone');
    if (!gameZone) return;

    gameZone.innerHTML += `
        <div class="card game-card">
            <div class="card-header">
                <span class="tag">Calcul & Logique</span>
            </div>
            <h3>Le Compte est Bon</h3>
            <p>Ton cerveau a plus de puissance que ton smartphone, prouve-le.</p>
            <div class="fichiers-liste-verticale">
                <button class="btn-download-full" onclick="startCompteBon()" style="border:none; cursor:pointer;">
                    <i class="fas fa-play"></i> Lancer le défi
                </button>
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', chargerMenuCompteBon);

// --- LOGIQUE DU JEU ---
function startCompteBon() {
    setupCompteBonUI();
    generatePuzzle();
}

function setupCompteBonUI() {
    const container = document.getElementById('main-container');
    container.innerHTML = `
        <div class="game-active-container" style="max-width: 600px; padding: 1.5rem;">
            <div id="game-screen">
                <div id="win-message" style="min-height: 45px; margin-bottom: 5px;"></div>
                
                <h2 style="margin-bottom:5px; font-size: 1.5rem;">Le Compte est Bon</h2>
                
                <div style="display: flex; justify-content: center; align-items: center; margin: 15px 0;">
                    <div style="text-align:center;">
                        <p style="margin:0; font-weight:bold; opacity:0.6; text-transform:uppercase; font-size: 0.8rem;">Cible</p>
                        <div class="game-display" id="target-cb" style="font-size:3.5rem; margin:0; line-height:1;">0</div>
                    </div>
                </div>

                <div id="plates-container" style="display:flex; flex-wrap:wrap; justify-content:center; gap:10px; min-height:80px; margin-bottom:20px; padding:5px;">
                    </div>

                <div class="operators-container" style="display:flex; justify-content:center; gap:10px; margin-bottom:20px;">
                    <button class="op-btn" onclick="selectOp('+')">+</button>
                    <button class="op-btn" onclick="selectOp('-')">−</button>
                    <button class="op-btn" onclick="selectOp('*')">×</button>
                    <button class="op-btn" onclick="selectOp('/')">÷</button>
                </div>

                <div style="display:flex; justify-content:center; gap:12px;">
                    <button class="btn-download-full" onclick="resetPuzzle()" style="background:#64748b; border:none; width: auto; padding: 10px 20px;">
                        <i class="fas fa-undo"></i> Réinitialiser
                    </button>
                    <button class="btn-download-full" onclick="generatePuzzle()" style="background:#10b981; border:none; width: auto; padding: 10px 20px;">
                        <i class="fas fa-dice"></i> Nouveau tirage
                    </button>
                </div>
            </div>
        </div>
    `;
}

function generatePuzzle() {
    initialNumbers = [];
    for(let i=0; i<6; i++) {
        initialNumbers.push(POSSIBLES[Math.floor(Math.random() * POSSIBLES.length)]);
    }
    targetCB = Math.floor(Math.random() * 899) + 101; 
    resetPuzzle();
}

function resetPuzzle() {
    currentNumbers = [...initialNumbers];
    selectedIndices = [];
    currentOp = null;
    document.getElementById('target-cb').innerText = targetCB;
    document.getElementById('win-message').innerHTML = "";
    selectOp(null);
    renderPlates();
}

function renderPlates() {
    const container = document.getElementById('plates-container');
    container.innerHTML = currentNumbers.map((n, idx) => `
        <button class="plate ${selectedIndices.includes(idx) ? 'selected' : ''}" 
                onclick="selectPlate(${idx})"
                style="padding: 10px 18px; font-size: 1.4rem; min-width: 60px;">
            ${n}
        </button>
    `).join('');
    
    if (currentNumbers.includes(targetCB)) {
        displayWin();
    }
}

// ... Les fonctions selectPlate, selectOp, applyOperation et displayWin restent identiques ...

function selectPlate(idx) {
    if (selectedIndices.includes(idx)) {
        selectedIndices = [];
    } else {
        selectedIndices.push(idx);
    }
    if (selectedIndices.length === 2) {
        if (currentOp) {
            applyOperation();
        } else {
            selectedIndices.shift(); 
        }
    }
    renderPlates();
}

function selectOp(op) {
    currentOp = op;
    document.querySelectorAll('.op-btn').forEach(btn => {
        const btnChar = btn.innerText;
        const targetChar = (op === '*' ? '×' : op === '/' ? '÷' : op === '-' ? '−' : op);
        btn.classList.toggle('active', btnChar === targetChar);
    });
}

function applyOperation() {
    const idx1 = selectedIndices[0];
    const idx2 = selectedIndices[1];
    const n1 = currentNumbers[idx1];
    const n2 = currentNumbers[idx2];
    let res = 0;

    if (currentOp === '+') res = n1 + n2;
    if (currentOp === '-') res = Math.abs(n1 - n2);
    if (currentOp === '*') res = n1 * n2;
    if (currentOp === '/') {
        if (n1 % n2 === 0 && n2 !== 0) res = n1 / n2;
        else if (n2 % n1 === 0 && n1 !== 0) res = n2 / n1;
        else { selectedIndices = []; return; }
    }
    if (res === 0) { selectedIndices = []; return; }

    const i1 = Math.max(idx1, idx2);
    const i2 = Math.min(idx1, idx2);
    currentNumbers.splice(i1, 1);
    currentNumbers.splice(i2, 1);
    currentNumbers.push(res);
    selectedIndices = [];
    currentOp = null;
    selectOp(null);
    renderPlates();
}

function displayWin() {
    const winZone = document.getElementById('win-message');
    winZone.innerHTML = `<div class="win-banner" style="font-size: 1rem; padding: 8px;">🎉 BRAVO ! LE COMPTE EST BON ! 🎉</div>`;
    document.getElementById('plates-container').style.pointerEvents = "none";
    setTimeout(() => {
        document.getElementById('plates-container').style.pointerEvents = "auto";
        generatePuzzle();
    }, 2000);
}