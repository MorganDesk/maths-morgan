// js/jeu-tables.js
let score = 0;
let timeLeft = 60;
let timer;
let currentAnswer;
// On utilise une clé spécifique pour le "Défi des Tables"
let highScore = Storage.getItem('maths_morgan_highscore_defi_tables') || 0;

function chargerMenuJeux() {
    const mainContainer = document.getElementById('main-container');
    if (!mainContainer) return;

    // SUPPRIME OU COMMENTE CETTE LIGNE :
    // mainContainer.innerHTML = `<div id="game-zone" class="grid-lecons"></div>`;
    
    // À la place, on vérifie si game-zone existe, sinon on le crée
    let gameZone = document.getElementById('game-zone');
    if (!gameZone) {
        gameZone = document.createElement('div');
        gameZone.id = 'game-zone';
        gameZone.className = 'grid-lecons';
        mainContainer.appendChild(gameZone);
    }

    const currentHigh = Storage.getItem('maths_morgan_highscore_defi_tables') || 0;

    gameZone.innerHTML += `
        <div class="card game-card">
            <div class="card-header">
                <span class="tag">Calcul mental</span>
                ${currentHigh > 0 ? `<span class="tag-highscore"><i class="fas fa-trophy"></i> Record : ${currentHigh}</span>` : ''}
            </div>
            <h3>Défi des Tables</h3>
            <p>Deviens plus rapide qu'une calculatrice (et beaucoup plus stylé).</p>
            <div class="fichiers-liste-verticale">
                <button class="btn-download-full" onclick="startTablesGame()" style="border:none; cursor:pointer; width:100%;">
                    <i class="fas fa-play"></i> Lancer le défi
                </button>
            </div>
        </div>
    `;
}

// Lancement automatique du menu
document.addEventListener('DOMContentLoaded', chargerMenuJeux);

function startTablesGame() {
    score = 0;
    timeLeft = 60;
    setupGameUI();
    nextQuestion();
    
    timer = setInterval(() => {
        timeLeft--;
        const timerEl = document.getElementById('timer');
        if(timerEl) {
            timerEl.innerText = timeLeft;
            if (timeLeft <= 10) timerEl.classList.add('timer-low');
        }
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

function setupGameUI() {
    const container = document.getElementById('main-container');
    container.innerHTML = `
        <div class="game-active-container">
            <div class="game-stats">
                <span>Score : <span id="score">0</span></span>
                <span>Temps : <span id="timer">60</span>s</span>
            </div>
            <div id="game-screen">
                <h2 style="margin-bottom:10px;">Défi des Tables</h2>
                <div class="game-display" id="question-text">? x ?</div>
                <input type="number" id="game-input" class="game-input" autofocus>
                <p style="margin-top:15px; font-size:0.9rem; opacity:0.7;">Appuie sur Entrée pour valider</p>
            </div>
        </div>
    `;

    const input = document.getElementById('game-input');
    input.focus();
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkResponse();
    });
}

function nextQuestion() {
    // On évite la table de 0 et 1 pour que ce soit un vrai défi
    const a = Math.floor(Math.random() * 11) + 2; 
    const b = Math.floor(Math.random() * 11) + 2;
    currentAnswer = a * b;
    document.getElementById('question-text').innerText = `${a} × ${b}`;
    document.getElementById('game-input').value = '';
    document.getElementById('game-input').focus();
}

function checkResponse() {
    const input = document.getElementById('game-input');
    const userAnswer = parseInt(input.value);
    
    if (userAnswer === currentAnswer) {
        score++;
        document.getElementById('score').innerText = score;
        nextQuestion();
    } else {
        // Optionnel : on vide juste l'input si c'est faux
        input.value = '';
    }
}

function endGame() {
    const container = document.getElementById('main-container');
    let isNewRecord = false;

    if (score > highScore) {
        highScore = score;
        Storage.setItem('maths_morgan_highscore_defi_tables', highScore);
        isNewRecord = true;
    }

    container.innerHTML = `
        <div class="game-active-container">
            <h2>${isNewRecord ? '🎉 NOUVEAU RECORD ! 🎉' : 'Fin du Défi !'}</h2>
            <div class="game-display">${score}</div>
            <p>réponses correctes en 60 secondes.</p>
            
            <div class="highscore-display">
                <i class="fas fa-trophy"></i> Meilleur score au Défi : <strong>${highScore}</strong>
            </div>

            <button class="btn-download-full" onclick="location.reload()" style="margin-top:20px; width:100%; border:none; cursor:pointer;">
                <i class="fas fa-arrow-left"></i> Retour au menu
            </button>
        </div>
    `;
}