// js/batisseur-nombres.js

let scoreBN = 0;
let timeLeftBN = 120;
let timerBN;
let currentTargetBN = 0; 
let gameModeBN = 'facile';

const PRIMES_SMALL = [2, 3, 5, 7, 11];
const PRIMES_LARGE = [13, 17, 19, 23, 29];
const PRIMES_ALL = [...PRIMES_SMALL, ...PRIMES_LARGE];

function chargerMenuBatisseur(target, gameConfig) {
    const destination = target || document.getElementById('game-zone');
    const highFacile = parseInt(Storage.getItem('maths_morgan_highscore_bn_facile')) || 0;

    destination.innerHTML += `
        <div class="card game-card">
            <div class="card-header">
                <span class="tag">${gameConfig.category}</span>
                <span id="badge-record-bn" class="tag-highscore" ${highFacile > 0 ? '' : 'style="display:none"'}>
                    <i class="fas fa-trophy"></i> Record : <span id="valeur-record-bn">${highFacile}</span>
                </span>
            </div>
            <h3>${gameConfig.title}</h3>
            <p>${gameConfig.description}</p>
            <div class="fichiers-liste-verticale">
                <select id="select-mode-bn" class="game-input-select" style="width:100%; margin-bottom:12px;" onchange="updateRecordBN(this.value)">
                    <option value="facile">Mode : Facile</option>
                    <option value="normal">Mode : Normal</option>
                    <option value="expert">Mode : Expert</option>
                </select>
                <button class="btn-download-full" onclick="startBNGame()" style="border:none; cursor:pointer; width:100%;">
                    <i class="fas fa-play"></i> Lancer le défi
                </button>
            </div>
        </div>`;
}

function updateRecordBN(mode) {
    gameModeBN = mode;
    const storageKey = `maths_morgan_highscore_bn_${mode}`;
    const high = parseInt(Storage.getItem(storageKey)) || 0;
    const badge = document.getElementById('badge-record-bn');
    const valeur = document.getElementById('valeur-record-bn');
    if (valeur) valeur.innerText = high;
    if (badge) badge.style.display = high > 0 ? '' : 'none';
}

function startBNGame() {
    const modeSelect = document.getElementById('select-mode-bn');
    if (modeSelect) gameModeBN = modeSelect.value;

    scoreBN = 0;
    timeLeftBN = 120;
    setupBNUI();
    generateNewTargetBN();
    
    timerBN = setInterval(() => {
        timeLeftBN--;
        const timerEl = document.getElementById('timer');
        if (timerEl) {
            timerEl.innerText = timeLeftBN;
            if (timeLeftBN <= 10) timerEl.classList.add('timer-low');
        }
        if (timeLeftBN <= 0) endGameBN();
    }, 1000);
}

function setupBNUI() {
    const container = document.getElementById('main-container');
    const primesToShow = (gameModeBN === 'expert') ? PRIMES_ALL : PRIMES_SMALL;

    container.innerHTML = `
        <div class="game-active-container">
            <div class="game-stats">
                <span>Score : <span id="current-score">0</span></span>
                <span>Temps : <span id="timer">120</span>s</span>
            </div>
            <p style="margin-bottom:5px; color:var(--text-light)">Divise le nombre jusqu'à obtenir 1 :</p>
            <div id="target-display" class="game-display">0</div>
            
            <div id="factors-chain" style="min-height:45px; margin-bottom:25px; display:flex; gap:8px; justify-content:center; flex-wrap:wrap; align-items:center;">
            </div>

            <div id="primes-grid" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; max-width: 500px; margin: 0 auto;">
                ${primesToShow.map(p => `
                    <div class="plate" id="prime-${p}" onclick="checkFactorBN(${p})" 
                         style="display:flex; align-items:center; justify-content:center; font-size:1.5rem; font-weight:bold; cursor:pointer; aspect-ratio:1/1;">
                        ${p}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function generateNewTargetBN() {
    let factors = [];
    let numFactors = 0;
    currentTargetBN = 1;

    if (gameModeBN === 'facile') {
        numFactors = Math.floor(Math.random() * 2) + 3; // 3 ou 4 facteurs
        for (let i = 0; i < numFactors; i++) {
            factors.push(PRIMES_SMALL[Math.floor(Math.random() * PRIMES_SMALL.length)]);
        }
    } 
    else if (gameModeBN === 'normal') {
        numFactors = Math.floor(Math.random() * 3) + 5; // 5 à 7 facteurs
        for (let i = 0; i < numFactors; i++) {
            factors.push(PRIMES_SMALL[Math.floor(Math.random() * PRIMES_SMALL.length)]);
        }
    } 
    else if (gameModeBN === 'expert') {
        numFactors = Math.floor(Math.random() * 3) + 5; // 5 à 7 facteurs total
        let largeCount = 0;
        
        for (let i = 0; i < numFactors; i++) {
            // Si on a déjà 2 grands nombres (>11), on force un petit nombre.
            // Sinon, on a 30% de chance d'en avoir un grand.
            if (largeCount < 2 && Math.random() < 0.3) {
                factors.push(PRIMES_LARGE[Math.floor(Math.random() * PRIMES_LARGE.length)]);
                largeCount++;
            } else {
                factors.push(PRIMES_SMALL[Math.floor(Math.random() * PRIMES_SMALL.length)]);
            }
        }
    }

    factors.forEach(f => currentTargetBN *= f);
    document.getElementById('target-display').innerText = currentTargetBN;
    document.getElementById('factors-chain').innerHTML = "";
}

function checkFactorBN(p) {
    const tile = document.getElementById(`prime-${p}`);
    
    if (currentTargetBN % p === 0) {
        currentTargetBN = currentTargetBN / p;
        
        const chain = document.getElementById('factors-chain');
        const factorBadge = document.createElement('span');
        factorBadge.className = "tag";
        factorBadge.style.background = "var(--primary)";
        factorBadge.style.color = "white";
        factorBadge.style.fontSize = "1.1rem";
        factorBadge.innerText = p;
        chain.appendChild(factorBadge);

        document.getElementById('target-display').innerText = currentTargetBN;

        if (currentTargetBN === 1) {
            scoreBN++;
            document.getElementById('current-score').innerText = scoreBN;
            document.getElementById('target-display').style.color = "#059669";
            setTimeout(() => {
                document.getElementById('target-display').style.color = "var(--primary)";
                generateNewTargetBN();
            }, 600);
        }
    } else {
        timeLeftBN = Math.max(0, timeLeftBN - 5);
        document.getElementById('timer').innerText = timeLeftBN;
        
        if (tile) {
            tile.style.backgroundColor = "#e11d48";
            tile.style.borderColor = "#e11d48";
            tile.style.color = "white";
            setTimeout(() => {
                tile.style.backgroundColor = "";
                tile.style.borderColor = "";
                tile.style.color = "";
            }, 300);
        }

        const display = document.getElementById('target-display');
        display.style.color = "#e11d48";
        display.animate([
            { transform: 'translateX(-5px)' },
            { transform: 'translateX(5px)' },
            { transform: 'translateX(-5px)' },
            { transform: 'translateX(0)' }
        ], { duration: 200 });
        
        setTimeout(() => { display.style.color = "var(--primary)"; }, 200);
    }
}

function endGameBN() {
    clearInterval(timerBN);
    const storageKey = `maths_morgan_highscore_bn_${gameModeBN}`;
    const high = parseInt(Storage.getItem(storageKey)) || 0;
    const isNewRecord = (scoreBN > high);
    if (isNewRecord) Storage.setItem(storageKey, scoreBN);

    const container = document.getElementById('main-container');
    container.innerHTML = `
        <div class="game-active-container">
            <h2>${isNewRecord ? '🎉 NOUVEAU RECORD ! 🎉' : 'Fin du chantier !'}</h2>
            <div class="game-display">${scoreBN}</div>
            <p>Nombre(s) décomposé(s) en mode <strong>${gameModeBN.toUpperCase()}</strong></p>
            <div class="highscore-display" style="margin-bottom:20px;">Record : <strong>${isNewRecord ? scoreBN : high}</strong></div>
            <button class="btn-download-full" onclick="location.reload()" style="border:none; cursor:pointer; width:100%;">
                <i class="fas fa-redo"></i> Retour au menu
            </button>
        </div>`;
}