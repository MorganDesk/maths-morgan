import { getHighScore, saveHighScore } from '../js/storage.js';
import { completeGame } from '../js/progression.js';

export function start(container, gameId, mode, modeIndex) {
    const GRID_SIZE = 14;
    let sourceCells = [];
    let expectedSolutionCoords = [];
    let symmetry = {};

    const gameWrapper = document.createElement('div');
    gameWrapper.id = 'miroir-magique-game';
    container.appendChild(gameWrapper);

    function runGame() {
        generateProblem();
        drawBoard();
    }

    /**
     * Détermine le type de symétrie à utiliser en fonction du mode de jeu.
     * @param {string} mode - Le mode de jeu sélectionné ('Axiale', 'Centrale', 'Mélange').
     * @returns {object} Un objet décrivant la symétrie.
     */
    function determineSymmetry(mode) {
        const axialAxes = ['vertical', 'horizontal', 'diagonal-main', 'diagonal-anti'];
        let effectiveMode = mode;

        if (mode === 'Mélange') {
            effectiveMode = Math.random() < 0.5 ? 'Axiale' : 'Centrale';
        }

        if (effectiveMode === 'Centrale') {
            return { type: 'central' };
        } else { // 'Axiale'
            const axis = axialAxes[Math.floor(Math.random() * axialAxes.length)];
            return { type: 'axial', axis: axis };
        }
    }

    function generateProblem() {
        sourceCells = [];
        expectedSolutionCoords = [];
        
        // On détermine la symétrie avant de générer la figure.
        symmetry = determineSymmetry(mode);
        
        const numCells = 6 + Math.floor(Math.random() * 4);
        const G = GRID_SIZE - 1;
        const isValid = (x, y) => x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE;

        let currentAttempts = 0;
        while (sourceCells.length < numCells && currentAttempts < 1000) {
            currentAttempts++;
            let newCell;
            if (sourceCells.length === 0) {
                newCell = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
            } else {
                let randomSourceCell = sourceCells[Math.floor(Math.random() * sourceCells.length)];
                const neighbors = [
                    { x: randomSourceCell.x + 1, y: randomSourceCell.y }, { x: randomSourceCell.x - 1, y: randomSourceCell.y },
                    { x: randomSourceCell.x, y: randomSourceCell.y + 1 }, { x: randomSourceCell.x, y: randomSourceCell.y - 1 }
                ];
                newCell = neighbors[Math.floor(Math.random() * neighbors.length)];
            }

            if (isValid(newCell.x, newCell.y) && !sourceCells.some(c => c.x === newCell.x && c.y === newCell.y)) {
                sourceCells.push(newCell);
                
                let symmetricPoint;
                if (symmetry.type === 'central') {
                    symmetricPoint = { x: G - newCell.x, y: G - newCell.y };
                } else {
                    switch (symmetry.axis) {
                        case 'vertical':   symmetricPoint = { x: G - newCell.x, y: newCell.y }; break;
                        case 'horizontal': symmetricPoint = { x: newCell.x, y: G - newCell.y }; break;
                        case 'diagonal-main': symmetricPoint = { x: G - newCell.y, y: G - newCell.x }; break;
                        case 'diagonal-anti': symmetricPoint = { x: newCell.y, y: newCell.x }; break;
                    }
                }
                expectedSolutionCoords.push(symmetricPoint);
            }
        }
    }

    function drawBoard() {
        let gridHtml = '';
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                gridHtml += `<div class="cell" data-x="${x}" data-y="${y}"></div>`;
            }
        }

        // Le texte est maintenant basé sur le type de symétrie réellement choisi.
        const symmetryText = symmetry.type === 'central' ? 'centrale' : 'axiale';

        gameWrapper.innerHTML = `
            <div class="game-area">
                <p class="game-instruction">Reproduisez la figure par symétrie ${symmetryText}.</p>
                <div id="grid-container" style="--grid-size: ${GRID_SIZE}">${gridHtml}</div>
                <div class="feedback-message"></div>
            </div>
            <div class="game-actions">
                <button id="check-button" class="action-button">Vérifier</button>
                <button id="new-puzzle-button" class="action-button">Nouveau Puzzle</button>
            </div>
        `;

        const gridContainer = gameWrapper.querySelector('#grid-container');
        sourceCells.forEach(c => gridContainer.querySelector(`[data-x='${c.x}'][data-y='${c.y}']`).classList.add('source'));
        drawSymmetryElement(gridContainer);

        gridContainer.addEventListener('click', onCellClick);
        gameWrapper.querySelector('#check-button').addEventListener('click', checkSolution);
        gameWrapper.querySelector('#new-puzzle-button').addEventListener('click', runGame);
    }
    
    function drawSymmetryElement(container) {
        const el = document.createElement('div');
        if (symmetry.type === 'central') el.className = 'center-point';
        else el.className = `axis ${symmetry.axis}`;
        container.appendChild(el);
    }

    function onCellClick(e) {
        if (e.target.classList.contains('cell') && !e.target.classList.contains('source')) {
            e.target.classList.toggle('user-cell');
        }
    }

    function checkSolution() {
        const userSet = new Set(Array.from(gameWrapper.querySelectorAll('.user-cell')).map(c => `${c.dataset.x},${c.dataset.y}`));
        const sourceSet = new Set(sourceCells.map(c => `${c.x},${c.y}`));
        const requiredSet = new Set(expectedSolutionCoords.map(c => `${c.x},${c.y}`).filter(coordStr => !sourceSet.has(coordStr)));
    
        const areSetsEqual = (a, b) => a.size === b.size && [...a].every(value => b.has(value));
    
        if (areSetsEqual(userSet, requiredSet)) {
            completeGame(gameId, modeIndex, 1);
            const currentScore = getHighScore(gameId, mode) || 0;
            saveHighScore(gameId, mode, currentScore + 1);
            showWinScreen(currentScore + 1);
        } else {
            showFeedback('Ce n\'est pas tout à fait ça. Essayez encore !', false);
        }
    }

    function showFeedback(message, isSuccess) {
        const feedbackEl = gameWrapper.querySelector('.feedback-message');
        feedbackEl.textContent = message;
        feedbackEl.style.color = isSuccess ? 'green' : 'red';
        setTimeout(() => feedbackEl.textContent = '', 3000);
    }

    function showWinScreen(newScore) {
        gameWrapper.innerHTML = `
            <div class="game-over-screen">
                <h2>Bravo ! C'est la bonne symétrie !</h2>
                <div class="new-record-message">
                    <i class="fas fa-trophy"></i> Vous avez résolu ${newScore} puzzle(s) en mode ${mode} <i class="fas fa-trophy"></i>
                </div>
                <div class="game-over-actions">
                    <button id="next-puzzle-button">Prochain puzzle</button>
                </div>
            </div>
        `;
        gameWrapper.querySelector('#next-puzzle-button').addEventListener('click', runGame);
    }

    runGame();
}
