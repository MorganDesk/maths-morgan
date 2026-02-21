let scoreAngles = 0;
let timeLeftAngles = 60;
let timerAngles;
let currentAngle = 0;

function chargerMenuAngles() {
    const gameZone = document.getElementById('game-zone');
    if (!gameZone) return;

    const high = Storage.getItem('maths_morgan_highscore_angles') || 0;

    gameZone.innerHTML += `
        <div class="card game-card">
            <div class="card-header">
                <span class="tag">Géométrie</span>
                <span id="display-highscore-angles" class="tag-highscore" ${high > 0 ? '' : 'style="display:none"'}>
                    <i class="fas fa-trophy"></i> Record : <span id="valeur-record-angles">${high}</span>
                </span>
            </div>
            <h3>Angle Master</h3>
            <p>Développe ton radar interne. Précision chirurgicale exigée !</p>
            <div class="fichiers-liste-verticale">
                <button class="btn-download-full" onclick="startAnglesGame()" style="border:none; cursor:pointer;">
                    <i class="fas fa-play"></i> Lancer le défi
                </button>
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', chargerMenuAngles);

function startAnglesGame() {
    scoreAngles = 0;
    timeLeftAngles = 60;
    setupAnglesUI();
    nextAngle();
    
    timerAngles = setInterval(() => {
        timeLeftAngles--;
        const timerEl = document.getElementById('timer');
        if(timerEl) {
            timerEl.innerText = timeLeftAngles;
            if (timeLeftAngles <= 10) timerEl.classList.add('timer-low');
        }
        if (timeLeftAngles <= 0) {
            clearInterval(timerAngles);
            endGameAngles();
        }
    }, 1000);
}

function setupAnglesUI() {
    const container = document.getElementById('main-container');
    container.innerHTML = `
        <div class="game-active-container">
            <div class="game-stats">
                <span>Score : <span id="score">0</span></span>
                <span>Temps : <span id="timer">60</span>s</span>
            </div>
            <div id="game-screen">
                <h2>Angle Master</h2>
                <p>Estime la mesure de l'angle (en degrés) :</p>
                <canvas id="angleCanvas" width="250" height="200" style="margin: 20px 0;"></canvas>
                
                <div style="display:flex; justify-content:center; gap:10px; align-items:center;">
                    <input type="number" id="angle-input" class="game-input" placeholder="0-180" autofocus style="width:120px;">
                    <button class="btn-download-full" onclick="checkAngle()" style="width:auto; border:none;">Valider</button>
                </div>
                <p id="feedback-angles" style="margin-top:15px; font-weight:bold; min-height:24px;"></p>
            </div>
        </div>
    `;

    const input = document.getElementById('angle-input');
    input.focus();
	
    input.addEventListener('keypress', (e) => { if (e.key === 'Enter') checkAngle(); });
}

let lastWasAcute = Math.random() < 0.5; // Détermine au hasard le premier type d'angle

function nextAngle() {
    let newAngle;
    
    if (lastWasAcute) {
        // On génère un angle OBTUS (95 à 170)
        newAngle = Math.floor(Math.random() * 76) + 95;
        lastWasAcute = false;
    } else {
        // On génère un angle AIGU (10 à 85)
        newAngle = Math.floor(Math.random() * 76) + 10;
        lastWasAcute = true;
    }

    currentAngle = newAngle;
    drawAngle(currentAngle);
    
    const input = document.getElementById('angle-input');
    if(input) {
        input.value = '';
        input.focus();
    }
}

function drawAngle(angle) {
    const canvas = document.getElementById('angleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Animation flash pour confirmer le changement
    canvas.style.opacity = "0.3";
    setTimeout(() => { canvas.style.opacity = "1"; }, 50);

    const centerX = 50;
    const centerY = 150;
    const radius = 120;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Couleur récupérée du thème (ou bleu par défaut)
    const color = getComputedStyle(document.body).getPropertyValue('--primary').trim() || '#2563eb';
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    // Ligne horizontale de base (le côté fixe)
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + radius, centerY);
    ctx.stroke();

    // Ligne inclinée (le côté mobile)
    const angleRad = (angle * Math.PI) / 180;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + radius * Math.cos(angleRad), centerY - radius * Math.sin(angleRad));
    ctx.stroke();

    // Arc de mesure
    ctx.beginPath();
    ctx.strokeStyle = '#94a3b8'; // Couleur grise pour l'arc
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]); // Arc en pointillés pour le style
    ctx.arc(centerX, centerY, 40, 0, -angleRad, true);
    ctx.stroke();
    ctx.setLineDash([]); // Reset pointillés
}

function checkAngle() {
    const input = document.getElementById('angle-input');
    const userGuess = parseInt(input.value);
    const feedback = document.getElementById('feedback-angles');
    
    if (isNaN(userGuess)) return;

    const diff = Math.abs(userGuess - currentAngle);

    if (diff <= 5) { // Marge d'erreur de 5 degrés
        scoreAngles++;
        document.getElementById('score').innerText = scoreAngles;
        feedback.style.color = "#10b981";
        feedback.innerText = `Précis ! C'était ${currentAngle}°`;
        setTimeout(nextAngle, 800);
    } else {
        feedback.style.color = "#ef4444";
        feedback.innerText = `Manqué ! C'était ${currentAngle}°`;
        setTimeout(nextAngle, 1200);
    }
}

function endGameAngles() {
    const container = document.getElementById('main-container');
    const high = Storage.getItem('maths_morgan_highscore_angles') || 0;
    let isNewRecord = (scoreAngles > high);

    if (isNewRecord) Storage.setItem('maths_morgan_highscore_angles', scoreAngles);

    container.innerHTML = `
        <div class="game-active-container">
            <h2>${isNewRecord ? '🎉 NOUVEAU RECORD ! 🎉' : 'Fin du chrono !'}</h2>
            <div class="game-display">${scoreAngles}</div>
            <p>angles trouvés avec précision.</p>
            <div class="highscore-display">
                <i class="fas fa-trophy"></i> Record : <strong>${isNewRecord ? scoreAngles : high}</strong>
            </div>
            <button class="btn-download-full" onclick="location.reload()" style="margin-top:20px; width:100%; border:none; cursor:pointer;">
                <i class="fas fa-arrow-left"></i> Retour au menu
            </button>
        </div>
    `;
}