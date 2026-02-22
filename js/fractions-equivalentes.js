// js/fractions-equivalentes.js
let scoreFractions = 0;
let timeLeftFractions = 60;
let timerFractions;
let bubbleInterval;
let targetFraction = { num: 1, den: 2 };
let gameMode = 'classique';

function chargerMenuFractions(target, gameConfig) {
    const destination = target || document.getElementById('game-zone');
    const highClassique = parseInt(Storage.getItem('maths_morgan_highscore_fractions_equiv')) || 0;

    destination.innerHTML += `
        <div class="card game-card">
            <div class="card-header">
                <span class="tag">${gameConfig.category}</span>
                <span id="badge-record-fractions" class="tag-highscore" ${(highClassique > 0) ? '' : 'style="display:none"'}>
                    <i class="fas fa-trophy"></i> Record : <span id="valeur-record-fractions">${highClassique}</span>
                </span>
            </div>
            <h3>${gameConfig.title}</h3>
            <p>${gameConfig.description}</p>
            <div class="fichiers-liste-verticale">
                <select id="select-mode-fractions" class="game-input-select" style="width:100%; margin-bottom:10px;" onchange="updateRecordFractions()">
                    <option value="classique">Mode Classique</option>
                    <option value="expert">Mode Expert</option>
                </select>
                <button class="btn-download-full" onclick="startFractionsGame()" style="border:none; cursor:pointer; width:100%;">
                    <i class="fas fa-play"></i> Lancer le défi
                </button>
            </div>
        </div>`;
}


function updateRecordDisplay() {
    const mode = document.getElementById('select-mode-fractions').value;
    const badge = document.getElementById('badge-record-fractions');
    const valeurSpan = document.getElementById('valeur-record-fractions');
    
    // On définit la clé de stockage selon le mode
    const storageKey = (mode === 'expert') ? 'maths_morgan_highscore_fractions_expert' : 'maths_morgan_highscore_fractions_equiv';
    const record = Storage.getItem(storageKey) || 0;

    if (record > 0) {
        badge.style.display = ''; // Affiche le badge
        valeurSpan.innerText = record;
    } else {
        badge.style.display = 'none'; // Cache si pas de record pour ce mode
    }
}

function preStartFractions() {
    const select = document.getElementById('select-mode-fractions');
    gameMode = select.value;
    startFractionsGame();
}

function startFractionsGame() {
    scoreFractions = 0;
    timeLeftFractions = 60;
    setupFractionsUI();
    generateTarget();
    
    timerFractions = setInterval(() => {
        timeLeftFractions--;
        const timerEl = document.getElementById('timer');
        if(timerEl) {
            timerEl.innerText = timeLeftFractions;
            if (timeLeftFractions <= 10) timerEl.classList.add('timer-low');
        }

        // Mode Expert : Change la cible à 30s
        if (gameMode === 'expert' && timeLeftFractions === 30) {
            flashTargetChange();
            generateTarget();
        }

        if (timeLeftFractions <= 0) endGameFractions();
    }, 1000);

    bubbleInterval = setInterval(createFractionBubble, 1100);
}

function flashTargetChange() {
    const targetDisplay = document.getElementById('target-display');
    targetDisplay.style.animation = "pulse 0.5s 2";
    targetDisplay.style.color = "#7c3aed"; 
    setTimeout(() => { targetDisplay.style.color = "var(--primary)"; }, 1000);
}

function setupFractionsUI() {
    const container = document.getElementById('main-container');
    container.innerHTML = `
        <div class="game-active-container">
            <div class="game-stats">
                <span>Score : <strong id="score">0</strong></span>
                <div style="text-align:center;">
                    <span style="font-size:0.7rem; color:#64748b; text-transform:uppercase; letter-spacing:1px;">Cible</span>
                    <div id="target-display" style="color:var(--primary); font-size:1.8rem; transition: all 0.3s ease;"></div>
                </div>
                <span>Temps : <strong id="timer">60</strong>s</span>
            </div>
            <div id="bubble-area"></div>
        </div>`;
}

function generateTarget() {
    let n = Math.floor(Math.random() * 8) + 1;
    let d = Math.floor(Math.random() * 8) + 2; 
    if (n === d) n = 1; 
    targetFraction = { num: n, den: d };
    
    document.getElementById('target-display').innerHTML = `
        <div style="display:inline-flex; flex-direction:column; align-items:center; vertical-align:middle;">
            <span>${n}</span>
            <div style="width:25px; height:3px; background:currentColor; margin:2px 0;"></div>
            <span>${d}</span>
        </div>`;
}

function createFractionBubble() {
    const area = document.getElementById('bubble-area');
    if (!area) return;

    const bubble = document.createElement('div');
    bubble.className = 'fraction-bubble';
    
    const isCorrect = Math.random() < 0.4;
    let bNum, bDen;

    if (isCorrect) {
        const factor = Math.floor(Math.random() * 5) + 2; 
        bNum = targetFraction.num * factor;
        bDen = targetFraction.den * factor;
    } else {
        // --- RETOUR DES FAUX POSITIFS (PIÈGES) ---
        const trapType = Math.random();
        const factor = Math.floor(Math.random() * 5) + 2;
        
        if (trapType < 0.4) { // Piège numérateur multiple
            bNum = targetFraction.num * factor;
            bDen = targetFraction.den * factor + (Math.random() < 0.5 ? 1 : -1); 
        } else if (trapType < 0.8) { // Piège dénominateur multiple
            bNum = targetFraction.num * factor + (Math.random() < 0.5 ? 1 : -1);
            bDen = targetFraction.den * factor;
        } else { // Aléatoire complet
            bNum = Math.floor(Math.random() * 15) + 1;
            bDen = Math.floor(Math.random() * 15) + 2;
        }

        if (bNum * targetFraction.den === bDen * targetFraction.num) bNum++;
    }

    bubble.innerHTML = `<span>${bNum}</span><div style="width:20px; height:2px; background:#475569; margin:2px 0;"></div><span>${bDen}</span>`;
    
    const posX = Math.random() * (area.clientWidth - 70);
    bubble.style.left = `${posX}px`;
    bubble.style.top = `-80px`;

    bubble.onclick = () => {
        if (isCorrect) {
            scoreFractions++;
            document.getElementById('score').innerText = scoreFractions;
            bubble.style.background = "#dcfce7";
            bubble.style.borderColor = "#22c55e";
            bubble.style.transform = "scale(0)";
            setTimeout(() => bubble.remove(), 150);
        } else {
            timeLeftFractions -= 2;
            const timerEl = document.getElementById('timer');
            if (timerEl) {
                timerEl.style.color = "#ef4444";
                timerEl.style.transform = "scale(1.4)";
                setTimeout(() => { timerEl.style.color = ""; timerEl.style.transform = ""; }, 300);
            }
            bubble.style.background = "#fee2e2";
            bubble.classList.add('shake');
            setTimeout(() => bubble.remove(), 300);
        }
    };

    area.appendChild(bubble);

    let posTop = -80;
    const speed = 1.3 + (Math.random() * 0.7);
    const moveInterval = setInterval(() => {
        if (timeLeftFractions <= 0) { clearInterval(moveInterval); bubble.remove(); return; }
        posTop += speed;
        bubble.style.top = `${posTop}px`;
        if (posTop > area.clientHeight) { clearInterval(moveInterval); bubble.remove(); }
    }, 20);
}

function endGameFractions() {
    clearInterval(timerFractions);
    clearInterval(bubbleInterval);
    
    const storageKey = gameMode === 'expert' ? 'maths_morgan_highscore_fractions_expert' : 'maths_morgan_highscore_fractions_equiv';
    const high = Storage.getItem(storageKey) || 0;
    const isNewRecord = (scoreFractions > high);

    if (isNewRecord) Storage.setItem(storageKey, scoreFractions);

    const container = document.getElementById('main-container');
    container.innerHTML = `
        <div class="game-active-container">
            <h2>${isNewRecord ? '🎉 RECORD (' + gameMode.toUpperCase() + ') ! 🎉' : 'Fin de la chasse !'}</h2>
            <div class="game-display">${scoreFractions}</div>
            <p>Score final en mode <strong>${gameMode}</strong></p>
            <div class="highscore-display">Record actuel : <strong>${isNewRecord ? scoreFractions : high}</strong></div>
            <button class="btn-download-full" onclick="location.reload()" style="margin-top:20px; border:none; cursor:pointer;">
                <i class="fas fa-arrow-left"></i> Menu Principal
            </button>
        </div>`;
}