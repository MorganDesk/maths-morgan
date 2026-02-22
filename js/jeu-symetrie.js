// --- VARIABLES GLOBALES ---
let symGridData = []; 
let symSolutionData = []; 
let symCurrentConfig = {}; 
let symCurrentMode = 'axial';
let symCurrentStreak = 0;
const SYM_GRID_SIZE = 14;

// --- INITIALISATION DU MENU ---
function chargerMenuSymetrie(target, gameConfig) {
    const destination = target || document.getElementById('game-zone');
    const recordInitial = Storage.getItem('maths_morgan_record_sym_axial') || 0;

    destination.innerHTML += `
        <div class="card game-card">
            <div class="card-header">
                <span class="tag">${gameConfig.category}</span>
                <span id="record-tag-sym" class="tag-highscore" ${recordInitial > 0 ? '' : 'style="display:none"'}>
                    <i class="fas fa-trophy"></i> Record : <span id="sym-record-val">${recordInitial}</span>
                </span>
            </div>
            <h3>${gameConfig.title}</h3>
            <p>${gameConfig.description}</p>
            <div class="fichiers-liste-verticale">
                <select id="mode-select-sym" class="game-input-select" onchange="updateSymRecordDisplay(this.value)" style="width:100%; margin-bottom:10px;">
                    <option value="axial">Symétrie Axiale</option>
                    <option value="central">Symétrie Centrale</option>
                    <option value="central">Mélange des deux</option>					
                </select>
                <button class="btn-download-full" onclick="startSymetrie()" style="border:none; cursor:pointer; width:100%;">
                    <i class="fas fa-play"></i> Lancer le défi
                </button>
            </div>
        </div>`;
}

// Mise à jour de l'affichage du record selon le mode choisi dans le menu
function updateSymRecordDisplay(mode) {
    const record = Storage.getItem(`maths_morgan_record_sym_${mode}`) || 0;
    const tag = document.getElementById('record-tag-sym');
    const val = document.getElementById('sym-record-val');
    
    if (record > 0) {
        tag.style.display = 'inline-block';
        val.innerText = record;
    } else {
        tag.style.display = 'none';
    }
}

function startSymetrie() {
    const select = document.getElementById('mode-select-sym');
    if (select) symCurrentMode = select.value;
    symCurrentStreak = 0;
    setupSymetrieUI();
    generateSymLevel();
}

// --- LOGIQUE DE GÉNÉRATION (FORMES ADJACENTES) ---
function generateSymLevel() {
    symGridData = Array(SYM_GRID_SIZE).fill().map(() => Array(SYM_GRID_SIZE).fill(0));
    symSolutionData = [];
    
    const msgZone = document.getElementById('sym-message');
    if (msgZone) msgZone.innerHTML = '';

    let type = symCurrentMode;
    if (type === 'melange') type = Math.random() < 0.5 ? 'axial' : 'central';
    
    if (type === 'axial') {
        const axes = ['V', 'H', 'D1', 'D2'];
        symCurrentConfig = { type: 'axial', axis: axes[Math.floor(Math.random() * axes.length)] };
    } else {
        symCurrentConfig = { type: 'central', axis: 'C' };
    }

    let sources = [];
    let attempts = 0;
    while (sources.length < 6 && attempts < 1000) {
        let r, c;
        if (sources.length === 0) {
            r = Math.floor(Math.random() * SYM_GRID_SIZE);
            c = Math.floor(Math.random() * SYM_GRID_SIZE);
        } else {
            let base = sources[Math.floor(Math.random() * sources.length)];
            let dirs = [{r:0,c:1},{r:0,c:-1},{r:1,c:0},{r:-1,c:0}];
            let dir = dirs[Math.floor(Math.random() * 4)];
            r = base.r + dir.r;
            c = base.c + dir.c;
        }

        if (r >= 0 && r < SYM_GRID_SIZE && c >= 0 && c < SYM_GRID_SIZE) {
            let sym = getSymPos(r, c);
            if (sym && (sym.r !== r || sym.c !== c) && symGridData[r][c] === 0 && symGridData[sym.r][sym.c] === 0) {
                sources.push({r, c});
                symGridData[r][c] = 1;
                symSolutionData.push(sym);
            }
        }
        attempts++;
    }
    renderSymGrid();
    updateSymInstruction();
}

function getSymPos(r, c) {
    const max = SYM_GRID_SIZE - 1;
    switch (symCurrentConfig.axis) {
        case 'V': return { r: r, c: max - c };
        case 'H': return { r: max - r, c: c };
        case 'C': return { r: max - r, c: max - c };
        case 'D1': return { r: c, c: r };
        case 'D2': return { r: max - c, c: max - r };
    }
    return null;
}

// --- INTERFACE ---
function setupSymetrieUI() {
    const container = document.getElementById('main-container');
    container.innerHTML = `
        <div class=\"game-active-container\" style=\"max-width: 550px;\">
            <div class=\"game-header\">
                <button class=\"btn-download-full\" onclick=\"location.reload()\" style=\"width:auto; padding: 8px 20px; background-color: #64748b;\">
                    <i class=\"fas fa-arrow-left\"></i> Retour
                </button>
                <div style=\"text-align:right;\">
                    <div style=\"font-weight:bold; color:var(--primary);\">Série (${symCurrentMode}) : <span id=\"sym-streak-val\">0</span></div>
                </div>
            </div>
            
            <h2 id=\"sym-instr\" style=\"margin-top:10px; font-size: 1.1rem; text-align:center;\">Analyse...</h2>
            <div id=\"sym-message\" style=\"min-height: 60px; margin: 10px 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;\"></div>
            
            <div id=\"sym-grid\" style=\"display: grid; grid-template-columns: repeat(${SYM_GRID_SIZE}, 1fr); gap: 1px; background: #cbd5e1; border: 2px solid #64748b; margin: 0 auto; aspect-ratio: 1/1; cursor: pointer; position: relative; user-select: none;\">
            </div>

            <div id=\"sym-controls\" style=\"display:flex; justify-content:center; gap:12px; margin-top: 20px;\">
                <button class=\"btn-download-full\" onclick=\"checkSymSolution()\" style=\"width:auto; background-color: var(--primary); padding: 12px 20px;\">
                    <i class=\"fas fa-check\"></i> Valider
                </button>
                <button class=\"btn-download-full\" onclick=\"generateSymLevel()\" style=\"width:auto; background-color: #64748b; padding: 12px 20px;\">
                    <i class=\"fas fa-sync-alt\"></i> Nouveau puzzle
                </button>
            </div>
        </div>
    `;
}

function updateSymInstruction() {
    const el = document.getElementById('sym-instr');
    const dict = { 'V': 'Axiale (Verticale)', 'H': 'Axiale (Horizontale)', 'D1': 'Axiale (Diagonale ◥)', 'D2': 'Axiale (Diagonale ◤)', 'C': 'Centrale (Centre)' };
    el.innerText = `Objectif : Symétrie ${dict[symCurrentConfig.axis]}`;
    document.getElementById('sym-streak-val').innerText = symCurrentStreak;
}

function renderSymGrid() {
    const gridEl = document.getElementById('sym-grid');
    if (!gridEl) return;
    gridEl.innerHTML = '';
    addSymMarkers(gridEl);

    for (let r = 0; r < SYM_GRID_SIZE; r++) {
        for (let c = 0; c < SYM_GRID_SIZE; c++) {
            const cell = document.createElement('div');
            cell.style.background = 'white';
            if (symGridData[r][c] === 1) cell.style.background = 'var(--primary)'; 
            if (symGridData[r][c] === 2) cell.style.background = '#fbbf24'; 
            cell.onclick = () => toggleSymCell(r, c);
            gridEl.appendChild(cell);
        }
    }
}

function addSymMarkers(gridEl) {
    const marker = document.createElement('div');
    marker.style.position = 'absolute';
    marker.style.pointerEvents = 'none';
    marker.style.background = 'rgba(239, 68, 68, 0.4)'; 
    marker.style.zIndex = '10';
    
    if (symCurrentConfig.axis === 'V') {
        marker.style.width = '2px'; marker.style.height = '100%'; marker.style.left = '50%';
    } else if (symCurrentConfig.axis === 'H') {
        marker.style.height = '2px'; marker.style.width = '100%'; marker.style.top = '50%';
    } else if (symCurrentConfig.axis === 'C') {
        marker.style.width = '12px'; marker.style.height = '12px'; marker.style.borderRadius = '50%';
        marker.style.left = 'calc(50% - 6px)'; marker.style.top = 'calc(50% - 6px)';
        marker.style.border = '2px solid white';
    } else if (symCurrentConfig.axis === 'D1' || symCurrentConfig.axis === 'D2') {
        marker.style.width = '140%'; marker.style.height = '2px'; marker.style.top = '50%'; marker.style.left = '-20%';
        marker.style.transform = symCurrentConfig.axis === 'D1' ? 'rotate(45deg)' : 'rotate(-45deg)';
    }
    gridEl.appendChild(marker);
}

function toggleSymCell(r, c) {
    if (symGridData[r][c] === 1) return; 
    symGridData[r][c] = (symGridData[r][c] === 2) ? 0 : 2;
    renderSymGrid();
}

function checkSymSolution() {
    let errors = 0;
    let missing = 0;
    const msgZone = document.getElementById('sym-message');
    
    symSolutionData.forEach(pos => {
        if (symGridData[pos.r][pos.c] !== 2) missing++;
    });
    
    for (let r = 0; r < SYM_GRID_SIZE; r++) {
        for (let c = 0; c < SYM_GRID_SIZE; c++) {
            if (symGridData[r][c] === 2) {
                const isCorrect = symSolutionData.some(p => p.r === r && p.c === c);
                if (!isCorrect) errors++;
            }
        }
    }

    if (errors === 0 && missing === 0) {
        symCurrentStreak++;
        const storageKey = `maths_morgan_record_sym_${symCurrentMode}`;
        const record = Storage.getItem(storageKey) || 0;
        if (symCurrentStreak > record) {
            Storage.setItem(storageKey, symCurrentStreak);
        }
        
        msgZone.innerHTML = `
            <div style=\"color: #059669; font-weight: bold; font-size: 1.2rem;\">🎉 Bravo ! Série (${symCurrentMode}) : ${symCurrentStreak}</div>
            <button class=\"btn-download-full\" onclick=\"generateSymLevel()\" style=\"width:auto; background-color: var(--primary); padding: 8px 20px;\">
                <i class=\"fas fa-play\"></i> Continuer
            </button>
        `;
    } else {
        symCurrentStreak = 0; 
        msgZone.innerHTML = `
            <div style=\"color: #e11d48; font-weight: bold;\">
                ❌ Erreur ! La série retombe à 0.
            </div>
        `;
        document.getElementById('sym-streak-val').innerText = "0";
        setTimeout(() => { if(symCurrentStreak === 0) msgZone.innerHTML = ''; }, 3000);
    }
}