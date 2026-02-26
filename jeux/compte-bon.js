
import { getHighScore, saveHighScore } from '../js/storage.js';

export function start(container, gameId, mode) {
    const gameWrapper = document.createElement('div');
    gameWrapper.id = 'compte-bon-game';
    container.appendChild(gameWrapper);

    let initialTiles = [];
    let targetNumber = 0;
    let selectedNumber1 = null;
    let selectedOperator = null;
    let historyStack = [];

    /**
     * Centralized, canonical logic for calculating all possible valid results from two numbers.
     */
    function getPossibleResults(num1, num2) {
        const [a, b] = num1 > num2 ? [num1, num2] : [num2, num1];
        const results = [];
        results.push(a + b);
        if (a > 1 && b > 1 && a * b < 20000) results.push(a * b);
        if (a - b > 0) results.push(a - b);
        if (b > 1 && a % b === 0) results.push(a / b);
        return results.filter(r => Number.isInteger(r) && r > 0);
    }

    /**
     * Generates all reachable numbers, step by step, using a breadth-first approach.
     */
    function generateAllReachableByOps(tiles, maxOps) {
        const queue = [{ nums: [...tiles], ops: 0 }];
        const visited = new Set([tiles.sort((a, b) => a - b).join(',')]);
        
        const reachableByOps = Array.from({ length: maxOps + 1 }, () => new Set());
        const allReachableNumbers = new Set(tiles);

        while (queue.length > 0) {
            const { nums, ops } = queue.shift();

            if (ops >= maxOps) continue;

            for (let i = 0; i < nums.length; i++) {
                for (let j = i + 1; j < nums.length; j++) {
                    const remaining = nums.filter((_, index) => index !== i && index !== j);
                    const possibleResults = getPossibleResults(nums[i], nums[j]);
                    
                    for (const result of possibleResults) {
                        if (!allReachableNumbers.has(result)) {
                            allReachableNumbers.add(result);
                            reachableByOps[ops + 1].add(result);

                            const newTiles = [...remaining, result].sort((a, b) => a-b);
                            const key = newTiles.join(',');
                            if (!visited.has(key)) {
                                visited.add(key);
                                queue.push({ nums: newTiles, ops: ops + 1 });
                            }
                        }
                    }
                }
            }
        }
        return reachableByOps;
    }

    /**
     * Generates a problem using the new constructive method.
     */
    function generateProblem() {
        let problemIsValid = false;
        let attempts = 0;

        while (!problemIsValid) {
            attempts++;
            if (attempts > 1000) {
                console.error("Could not generate a valid problem. Using fallback.");
                 if (mode === 'Extrême') {
                    initialTiles = [2, 4, 5, 8, 10, 25];
                    targetNumber = 891;
                } else if (mode === 'Normal') {
                    initialTiles = [1, 2, 3, 4, 10, 25];
                    targetNumber = 101;
                } else { // Facile
                    initialTiles = [1, 2, 3, 4, 5, 10];
                    targetNumber = 53; // 10 * 5 + 3
                }
                return;
            }

            // 1. Get initial tiles
            const largePlates = [10, 25, 50, 75, 100];
            const smallPlates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9];
            let candidateTiles = [];
            const numLarge = 1 + Math.floor(Math.random() * 2);
            shuffleArray(largePlates);
            for (let i = 0; i < numLarge; i++) candidateTiles.push(largePlates[i]);
            shuffleArray(smallPlates);
            for (let i = 0; i < (6 - numLarge); i++) candidateTiles.push(smallPlates[i]);

            // 2. Decide on the target number of operations and target range
            let targetOps;
            let minTarget;

            switch (mode) {
                case 'Extrême':
                    targetOps = 4 + Math.floor(Math.random() * 2); // 4 or 5 ops
                    minTarget = 101;
                    break;
                case 'Normal':
                    targetOps = 3 + Math.floor(Math.random() * 2); // 3 or 4 ops
                    minTarget = 101;
                    break;
                case 'Facile':
                default:
                    targetOps = 2 + Math.floor(Math.random() * 2); // 2 or 3 ops
                    minTarget = 50;
                    break;
            }

            // 3. Generate all reachable numbers for that depth
            const allReachable = generateAllReachableByOps(candidateTiles, targetOps);
            const candidateTargets = Array.from(allReachable[targetOps])
                                            .filter(n => n >= minTarget && n <= 999);

            // 4. If we found suitable targets, pick one.
            if (candidateTargets.length > 0) {
                targetNumber = candidateTargets[Math.floor(Math.random() * candidateTargets.length)];
                initialTiles = candidateTiles;
                problemIsValid = true;
            }
        }
    }

    function drawBoard() {
        historyStack = []; // Clear history on new board
        gameWrapper.innerHTML = `
            <div class="game-area">
                <p>Trouvez :</p>
                <div id="target-number-container" class="target-number">${targetNumber}</div>
            </div>
            <div id="tiles-container" class="tiles-container"></div>
            <div id="operators-container" class="tiles-container"></div>
            <div class="game-actions">
                <button id="undo-button" class="action-button" disabled><i class="fas fa-history"></i> Annuler</button>
                <button id="reset-board" class="reset-button" disabled><i class="fas fa-undo"></i> Réinitialiser</button>
                <button id="new-draw-button" class="action-button"><i class="fas fa-dice"></i> Nouveau tirage</button>
            </div>
        `;
        const tilesContainer = gameWrapper.querySelector('#tiles-container');
        initialTiles.forEach(val => tilesContainer.appendChild(createTile(val, 'number')));
        const opsContainer = gameWrapper.querySelector('#operators-container');
        ['+', '-', '×', '÷'].forEach(op => opsContainer.appendChild(createTile(op, 'operator')));
        gameWrapper.querySelector('#reset-board').addEventListener('click', resetBoard);
        gameWrapper.querySelector('#new-draw-button').addEventListener('click', runGame);
        gameWrapper.querySelector('#undo-button').addEventListener('click', undoLastMove);
    }
    
    function createTile(value, type) {
        const tile = document.createElement('button');
        tile.className = `tile ${type}-tile`;
        tile.textContent = value;
        tile.dataset.value = value;
        tile.addEventListener('click', onTileClick);
        return tile;
    }

    function onTileClick(e) {
        const clickedTile = e.target;
        if (clickedTile.classList.contains('number-tile')) {
            if (selectedNumber1 === clickedTile) { clickedTile.classList.remove('selected'); selectedNumber1 = null; return; }
            if (!selectedNumber1) { selectedNumber1 = clickedTile; clickedTile.classList.add('selected');
            } else if (selectedOperator && selectedNumber1 !== clickedTile) { handleCalculation(selectedNumber1, selectedOperator, clickedTile); }
        } else if (clickedTile.classList.contains('operator-tile')) {
            if (selectedOperator === clickedTile) { clickedTile.classList.remove('selected'); selectedOperator = null; return; }
            if (selectedNumber1) {
                if(selectedOperator) selectedOperator.classList.remove('selected');
                selectedOperator = clickedTile; clickedTile.classList.add('selected');
            }
        }
    }

    function handleCalculation(tile1, opTile, tile2) {
        // Save current state before calculation
        const currentTiles = Array.from(gameWrapper.querySelectorAll('#tiles-container .number-tile')).map(t => parseInt(t.dataset.value));
        historyStack.push(currentTiles);
        gameWrapper.querySelector('#undo-button').disabled = false;
        gameWrapper.querySelector('#reset-board').disabled = false;

        const num1 = parseInt(tile1.dataset.value), op = opTile.dataset.value, num2 = parseInt(tile2.dataset.value);
        let result, error = false;
        const [a, b] = num1 > num2 ? [num1, num2] : [num2, num1];
        if (op === '+') result = a + b;
        else if (op === '-') { if (a - b <= 0) error = true; else result = a - b; }
        else if (op === '×') result = a * b;
        else if (op === '÷') { if (b === 0 || a % b !== 0) error = true; else result = a / b; }
        if (error) { 
            historyStack.pop(); // Remove the state if the calculation was invalid
            if(historyStack.length === 0) {
                 gameWrapper.querySelector('#undo-button').disabled = true;
                 gameWrapper.querySelector('#reset-board').disabled = true;
            }
            resetSelection(); 
            return; 
        }
        const newTile = createTile(result, 'number');
        tile1.parentElement.appendChild(newTile);
        tile1.remove();
        tile2.remove();
        resetSelection();
        checkWin(result);
    }

    function undoLastMove() {
        if (historyStack.length === 0) return;

        const lastState = historyStack.pop();
        const tilesContainer = gameWrapper.querySelector('#tiles-container');
        tilesContainer.innerHTML = '';
        lastState.forEach(val => tilesContainer.appendChild(createTile(val, 'number')));

        const isInitialState = historyStack.length === 0;
        gameWrapper.querySelector('#undo-button').disabled = isInitialState;
        gameWrapper.querySelector('#reset-board').disabled = isInitialState;

        resetSelection();
    }
    
    function resetSelection() {
        gameWrapper.querySelectorAll('.selected').forEach(t => t.classList.remove('selected'));
        selectedNumber1 = null; selectedOperator = null;
    }

    function resetBoard() {
        gameWrapper.querySelector('#tiles-container').innerHTML = '';
        initialTiles.forEach(val => gameWrapper.querySelector('#tiles-container').appendChild(createTile(val, 'number')));
        historyStack = [];
        gameWrapper.querySelector('#undo-button').disabled = true;
        gameWrapper.querySelector('#reset-board').disabled = true;
        resetSelection();
    }
    
    function checkWin(result) {
        if (result === targetNumber) {
            const currentScore = getHighScore(gameId, mode) || 0;
            saveHighScore(gameId, mode, currentScore + 1);
            showWinScreen(currentScore + 1);
        }
    }

    function showWinScreen(score) {
        gameWrapper.innerHTML = `
            <div class="game-over-screen">
                <h2>Bravo ! Le compte est bon !</h2>
                <div class="new-record-message"><i class="fas fa-trophy"></i> Vous avez résolu ${score} puzzle(s) en mode ${mode} <i class="fas fa-trophy"></i></div>
                <div class="game-over-actions"><button id="next-puzzle-button">Prochain puzzle</button></div>
            </div>
        `;
        gameWrapper.querySelector('#next-puzzle-button').addEventListener('click', runGame);
    }
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function runGame() {
        generateProblem();
        drawBoard();
    }

    runGame();
}
