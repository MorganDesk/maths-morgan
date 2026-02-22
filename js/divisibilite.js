// js/divisibilite.js
let scoreDiv = 0;
let timeLeftDiv = 60;
let timerDiv;
let currentNumberDiv = 0;
let selectedDivisors = new Set();
const CRITERES = [2, 3, 5, 9, 10];

function chargerMenuDivisibilite(target, gameConfig) {
    const destination = target || document.getElementById('game-zone');
    const high = Storage.getItem('maths_morgan_highscore_divisibilite') || 0;

    destination.innerHTML += `
        <div class="card game-card">
            <div class="card-header">
                <span class="tag">${gameConfig.category}</span>
                <span id="display-highscore-div" class="tag-highscore" ${high > 0 ? '' : 'style="display:none"'}>
                    <i class="fas fa-trophy"></i> Record : <span id="valeur-record-div">${high}</span>
                </span>
            </div>
            <h3>${gameConfig.title}</h3>
            <p>${gameConfig.description}</p>
            <div class="fichiers-liste-verticale">
                <button class="btn-download-full" onclick="startDivGame()" style="border:none; cursor:pointer; width:100%;">
                    <i class="fas fa-play"></i> Lancer le défi
                </button>
            </div>
        </div>`;
}


function startDivGame() {
    scoreDiv = 0;
    timeLeftDiv = 60;
    setupDivUI();
    nextQuestionDiv();
    
    timerDiv = setInterval(() => {
        timeLeftDiv--;
        document.getElementById('timer').innerText = timeLeftDiv;
        if (timeLeftDiv <= 0) endGameDiv();
    }, 1000);
}

function setupDivUI() {
    const container = document.getElementById('main-container');
    container.innerHTML = `
        <div class="game-active-container">
            <div class="game-stats">
                <span>Score : <strong id="score">0</strong></span>
                <span>Temps : <strong id="timer">60</strong>s</span>
            </div>
            <div id="num-display" class="game-display" style="font-size: 3.5rem;">0</div>
            <p style="margin-bottom: 20px; font-weight: 600;">Est divisible par :</p>
            
            <div id="divisors-grid" style="display: flex; justify-content: center; gap: 10px; margin-bottom: 30px; flex-wrap: wrap;">
                ${CRITERES.map(d => `<div class="plate" onclick="toggleDivisor(${d}, this)">${d}</div>`).join('')}
            </div>

            <button class="btn-download-full" onclick="validateDiv()" style="border:none; cursor:pointer; background: var(--primary);">
                Valider (Entrée)
            </button>
        </div>`;

    // Écoute de la touche Entrée
    document.addEventListener('keydown', handleDivKeyDown);
}

function handleDivKeyDown(e) {
    if (e.key === "Enter") validateDiv();
}

function toggleDivisor(d, el) {
    if (selectedDivisors.has(d)) {
        selectedDivisors.delete(d);
        el.classList.remove('selected');
    } else {
        selectedDivisors.add(d);
        el.classList.add('selected');
    }
}

function nextQuestionDiv() {
    // 1. On choisit un critère "garanti" au hasard
    const garanti = CRITERES[Math.floor(Math.random() * CRITERES.length)];
    
    // 2. On définit la plage de recherche (3 à 6 chiffres)
    const digits = Math.floor(Math.random() * 4) + 3; 
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;

    // 3. On génère un nombre aléatoire dans la plage
    let tempNum = Math.floor(Math.random() * (max - min + 1)) + min;

    // 4. On l'ajuste pour qu'il soit divisible par notre critère garanti
    // On enlève le reste de la division euclidienne
    currentNumberDiv = tempNum - (tempNum % garanti);

    // Sécurité : si l'ajustement nous a fait descendre en dessous du min (ex: 100 - 2 = 98)
    if (currentNumberDiv < min) {
        currentNumberDiv += garanti;
    }

    // 5. Affichage avec formatage des classes
    document.getElementById('num-display').innerText = currentNumberDiv.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    
    // Reset de l'interface
    selectedDivisors.clear();
    document.querySelectorAll('.plate').forEach(p => p.classList.remove('selected'));
}

function validateDiv() {
    // Calcul des diviseurs attendus
    const expected = CRITERES.filter(d => currentNumberDiv % d === 0);
    
    // Comparaison avec la sélection
    const isCorrect = expected.length === selectedDivisors.size && 
                      expected.every(d => selectedDivisors.has(d));

    if (isCorrect) {
        scoreDiv++;
        document.getElementById('score').innerText = scoreDiv;
        
        // Feedback flash vert
        const display = document.getElementById('num-display');
        display.style.color = "#10b981";
        setTimeout(() => {
            display.style.color = "";
            nextQuestionDiv();
        }, 200);
    } else {
        // Feedback erreur
        const container = document.querySelector('.game-active-container');
        container.classList.add('shake');
        
        // On colore brièvement en rouge les tuiles sélectionnées qui sont fausses
        selectedDivisors.forEach(d => {
            if (currentNumberDiv % d !== 0) {
                const plates = document.querySelectorAll('.plate');
                plates.forEach(p => {
                    if (p.innerText == d) p.style.backgroundColor = "#fee2e2";
                });
            }
        });

        setTimeout(() => {
            container.classList.remove('shake');
            document.querySelectorAll('.plate').forEach(p => p.style.backgroundColor = "");
        }, 300);
    }
}

function endGameDiv() {
    clearInterval(timerDiv);
    document.removeEventListener('keydown', handleDivKeyDown);
    
    const container = document.getElementById('main-container');
    const high = Storage.getItem('maths_morgan_highscore_divisibilite') || 0;
    const isNewRecord = (scoreDiv > high);

    if (isNewRecord) Storage.setItem('maths_morgan_highscore_divisibilite', scoreDiv);

    container.innerHTML = `
        <div class="game-active-container">
            <h2>${isNewRecord ? '🎉 RECORD BATTU ! 🎉' : 'Fin du temps !'}</h2>
            <div class="game-display">${scoreDiv}</div>
            <p>Nombres correctement analysés.</p>
            <div class="highscore-display">Record : <strong>${isNewRecord ? scoreDiv : high}</strong></div>
            <button class="btn-download-full" onclick="location.reload()" style="margin-top:20px; border:none; cursor:pointer;">
                Retour au menu
            </button>
        </div>`;
}