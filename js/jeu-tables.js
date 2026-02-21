// js/jeu-tables.js
let scoreTables = 0; // Nommé spécifiquement pour éviter les conflits
let timeLeftTables = 60;
let timerTables;
let currentAnswerTables;

function chargerMenuTables() {
    const gameZone = document.getElementById('game-zone');
    if (!gameZone) return;

    // Récupération du record via l'objet Storage
    const high = Storage.getItem('maths_morgan_highscore_defi_tables') || 0;

    // Utilisation de += pour AJOUTER la carte
    gameZone.innerHTML += `
        <div class="card game-card">
            <div class="card-header">
                <span class="tag">Calcul mental</span>
                <span id="display-highscore-tables" class="tag-highscore" ${high > 0 ? '' : 'style="display:none"'}>
                    <i class="fas fa-trophy"></i> Record : <span id="valeur-record-tables">${high}</span>
                </span>
            </div>
            <h3>Défi des Tables</h3>
            <p>Deviens plus rapide qu'une calculatrice et pulvérise ton record.</p>
            <div class="fichiers-liste-verticale">
                <button class="btn-download-full" onclick="startTablesGame()" style="border:none; cursor:pointer; width:100%;">
                    <i class="fas fa-play"></i> Lancer le défi
                </button>
            </div>
        </div>`;
}

// On écoute le chargement du DOM
document.addEventListener('DOMContentLoaded', chargerMenuTables);

function startTablesGame() {
    scoreTables = 0;
    timeLeftTables = 60;
    setupTablesUI();
    nextQuestionTables();
    
    timerTables = setInterval(() => {
        timeLeftTables--;
        document.getElementById('timer').innerText = timeLeftTables;
        if (timeLeftTables <= 0) endGameTables();
    }, 1000);
}

function setupTablesUI() {
    const container = document.getElementById('main-container');
    container.innerHTML = `
        <div class="game-active-container">
            <div class="game-stats">
                <span>Score : <strong id="score">0</strong></span>
                <span>Temps : <strong id="timer">60</strong>s</span>
            </div>
            <div id="question" class="game-display">Prêt ?</div>
            <input type="number" id="game-input" class="game-input" placeholder="?" autocomplete="off">
        </div>`;
    
    const input = document.getElementById('game-input');
    input.focus();
    // Validation instantanée (ton nouveau comportement préféré)
    input.addEventListener('input', checkResponseTables);
}

function nextQuestionTables() {
    const a = Math.floor(Math.random() * 9) + 2;
    const b = Math.floor(Math.random() * 9) + 2;
    currentAnswerTables = a * b;
    document.getElementById('question').innerText = `${a} × ${b}`;
    document.getElementById('game-input').value = '';
    document.getElementById('game-input').focus();
}

function checkResponseTables() {
    const input = document.getElementById('game-input');
    const userAnswer = parseInt(input.value);
    
    if (userAnswer === currentAnswerTables) {
        scoreTables++;
        document.getElementById('score').innerText = scoreTables;
        nextQuestionTables();
    }
}

function endGameTables() {
    clearInterval(timerTables);
    const container = document.getElementById('main-container');
    const high = Storage.getItem('maths_morgan_highscore_defi_tables') || 0;
    let isNewRecord = (scoreTables > high);

    if (isNewRecord) {
        Storage.setItem('maths_morgan_highscore_defi_tables', scoreTables);
    }

    container.innerHTML = `
        <div class="game-active-container">
            <h2>${isNewRecord ? '🎉 NOUVEAU RECORD ! 🎉' : 'Fin du Défi !'}</h2>
            <div class="game-display">${scoreTables}</div>
            <p>réponses correctes en 60 secondes.</p>
            <div class="highscore-display">
                <i class="fas fa-trophy"></i> Meilleur score : <strong>${isNewRecord ? scoreTables : high}</strong>
            </div>
            <button class="btn-download-full" onclick="location.reload()" style="margin-top:20px; border:none; cursor:pointer;">
                <i class="fas fa-redo"></i> Retour au menu
            </button>
        </div>`;
}