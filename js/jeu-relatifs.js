let scoreRelatifs = 0;
let timeLeftRelatifs = 60;
let timerRelatifs;
let currentAnswerRelatifs;
let modeRelatifs = 'add';

function chargerMenuRelatifs() {
    const gameZone = document.getElementById('game-zone');
    if (!gameZone) return;

    const highInitial = Storage.getItem('maths_morgan_highscore_relatifs_add') || 0;

    gameZone.innerHTML += `
        <div class="card game-card">
            <div class="card-header">
                <span class="tag">Calcul mental</span>
                <span id="display-highscore-relatifs" class="tag-highscore" ${highInitial > 0 ? '' : 'style="display:none"'}>
                    <i class="fas fa-trophy"></i> Record : <span id="valeur-record">${highInitial}</span>
                </span>
            </div>
            <h3>Choc des relatifs</h3>
            <p>Ne laisse pas un petit signe moins gâcher ta vie... ou ton record !</p>
            
            <div class="fichiers-liste-verticale">
                <select id="mode-select-relatifs" class="game-input" onchange="updateRecordDisplay(this.value)" style="width:100%; font-size:1rem; margin-bottom:10px; height:40px; cursor:pointer;">
                    <option value="add" selected>Additions (+)</option> 
                    <option value="sub">Soustractions (-)</option>
                    <option value="addsub">Additions & Soustractions (+/-)</option>
                    <option value="mult">Multiplications (×)</option>
                    <option value="melange">Mélange total (+/-/×)</option>
                </select>
                <button class="btn-download-full" onclick="startRelatifsGame()" style="border:none; cursor:pointer; width:100%;">
                    <i class="fas fa-play"></i> Lancer le choc
                </button>
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', chargerMenuRelatifs);

function updateRecordDisplay(selectedMode) {
    const valSpan = document.getElementById('valeur-record');
    const badge = document.getElementById('display-highscore-relatifs');
    const record = Storage.getItem(`maths_morgan_highscore_relatifs_${selectedMode}`) || 0;

    if (record > 0) {
        valSpan.innerText = record;
        badge.style.display = "inline-block";
    } else {
        badge.style.display = "none";
    }
}



function startRelatifsGame() {
    const select = document.getElementById('mode-select-relatifs');
    if (!select) return;

    scoreRelatifs = 0;
    timeLeftRelatifs = 60;
    modeRelatifs = select.value; // On récupère la valeur du bon ID
    
    setupRelatifsUI();
    nextQuestionRelatifs();
    
    // Nettoyage d'un éventuel timer précédent
    if (timerRelatifs) clearInterval(timerRelatifs);

    timerRelatifs = setInterval(() => {
        timeLeftRelatifs--;
        const timerEl = document.getElementById('timer');
        if(timerEl) {
            timerEl.innerText = timeLeftRelatifs;
            if (timeLeftRelatifs <= 10) timerEl.classList.add('timer-low');
        }
        if (timeLeftRelatifs <= 0) {
            clearInterval(timerRelatifs);
            endGameRelatifs();
        }
    }, 1000);
}

function setupRelatifsUI() {
    const container = document.getElementById('main-container');
    container.innerHTML = `
        <div class="game-active-container">
            <div class="game-stats">
                <span>Score : <span id="score">0</span></span>
                <span>Temps : <span id="timer">60</span>s</span>
            </div>
            <div id="game-screen">
                <h2 style="margin-bottom:10px;">Choc des relatifs</h2>
                <div class="game-display" id="question-text" style="font-size:3rem;">?</div>
                <input type="number" id="game-input" class="game-input" autofocus>
                <p style="margin-top:15px; font-size:0.9rem; opacity:0.7;">Signe "-" autorisé. Entrée pour valider.</p>
            </div>
        </div>
    `;
    const input = document.getElementById('game-input');
    input.focus();
	input.addEventListener('input', () => {
        const userAnswer = parseInt(input.value);
        
        // On vérifie si le nombre saisi est exactement la réponse attendue
        if (userAnswer === currentAnswerRelatifs) {
            scoreRelatifs++;
            document.getElementById('score').innerText = scoreRelatifs;
            nextQuestionRelatifs();
        }
    });
}

function nextQuestionRelatifs() {
    let a, b, op;
    
    if (modeRelatifs === 'melange') {
        const r = Math.random();
        op = r < 0.33 ? '+' : (r < 0.66 ? '-' : '×');
    } else if (modeRelatifs === 'addsub') {
        op = Math.random() > 0.5 ? '+' : '-';
    } else {
        const mapOp = { 'add': '+', 'sub': '-', 'mult': '×' };
        op = mapOp[modeRelatifs];
    }

    if (op === '×') {
        // Multiplications (2 à 12, positif ou négatif)
        a = (Math.floor(Math.random() * 11) + 2) * (Math.random() > 0.5 ? 1 : -1);
        b = (Math.floor(Math.random() * 11) + 2) * (Math.random() > 0.5 ? 1 : -1);
        currentAnswerRelatifs = a * b;
    } else {
        // Additions / Soustractions (-10 à 10)
        a = Math.floor(Math.random() * 21) - 10;
        b = Math.floor(Math.random() * 21) - 10;
        if (a === 0) a = 1; if (b === 0) b = 1;
        currentAnswerRelatifs = (op === '+') ? a + b : a - b;
    }

    const formatA = a < 0 ? `(${a})` : `(+${a})`;
    const formatB = b < 0 ? `(${b})` : `(+${b})`;
    
    document.getElementById('question-text').innerText = `${formatA} ${op} ${formatB}`;
    document.getElementById('game-input').value = '';
    document.getElementById('game-input').focus();
}

function checkResponseRelatifs() {
    const input = document.getElementById('game-input');
    if (input.value !== "" && parseInt(input.value) === currentAnswerRelatifs) {
        scoreRelatifs++;
        document.getElementById('score').innerText = scoreRelatifs;
        nextQuestionRelatifs();
    } else if (input.value !== "") {
        input.value = '';
    }
}

function endGameRelatifs() {
    const container = document.getElementById('main-container');
    const storageKey = `maths_morgan_highscore_relatifs_${modeRelatifs}`;
    const oldHigh = Storage.getItem(storageKey) || 0;
    let isNewRecord = (scoreRelatifs > oldHigh);

    if (isNewRecord) Storage.setItem(storageKey, scoreRelatifs);

    const modeNoms = { 
        'add': 'Additions', 
        'sub': 'Soustractions', 
        'addsub': 'Additions & Soustractions',
        'mult': 'Multiplications', 
        'melange': 'Mélange Total' 
    };

    container.innerHTML = `
        <div class="game-active-container">
            <h2>${isNewRecord ? '🎉 NOUVEAU RECORD ! 🎉' : 'Fin du Choc !'}</h2>
            <div style="font-size: 1.2rem; margin-bottom: 10px;">Mode : ${modeNoms[modeRelatifs]}</div>
            <div class="game-display">${scoreRelatifs}</div>
            <div class="highscore-display">
                <i class="fas fa-trophy"></i> Record (${modeNoms[modeRelatifs]}) : <strong>${isNewRecord ? scoreRelatifs : oldHigh}</strong>
            </div>
            
            <button class="btn-download-full" onclick="location.reload()" style="margin-top:20px; width:auto; padding: 12px 30px; border:none; cursor:pointer; background-color: #64748b;">
                <i class="fas fa-arrow-left"></i> Retour au menu
            </button>
        </div>
    `;
}