// js/games-manager.js
let currentSearch = "";
let currentCategory = "Tous";

/**
 * Initialise le catalogue de jeux dans la zone dédiée
 */
function initGamesManager() {
    const gameZone = document.getElementById('game-zone');
    if (!gameZone) {
        console.error("Erreur : L'élément #game-zone est introuvable.");
        return;
    }

    // Sécurité : Vérifier que la liste des jeux est chargée
    if (typeof GAMES_LIST === 'undefined') {
        console.error("Erreur : GAMES_LIST n'est pas défini. Vérifiez l'import de games-config.js");
        gameZone.innerHTML = "<p style='text-align:center; padding:2rem;'>Erreur de chargement de la configuration des jeux.</p>";
        return;
    }

    // Structure de l'interface : Recherche -> Filtres -> Grille de cartes
    gameZone.innerHTML = `
        <div class="games-header" style="width: 100%; max-width: 800px; margin: 0 auto 2.5rem auto; display: flex; flex-direction: column; align-items: center;">
            
            <div class="search-bar-container" style="position: relative; margin-bottom: 1.5rem; width: 100%; max-width: 500px;">
                <input type="text" id="game-search" class="game-input-select" 
                       placeholder="Rechercher une notion (ex: fractions, angles...)" 
                       oninput="handleSearch(this.value)" 
                       style="padding-left: 42px; height: 42px; width: 100%; font-size: 0.95rem; border-radius: 10px;">
                <i class="fas fa-search" style="position: absolute; left: 15px; top: 13px; color: var(--text-light); font-size: 1rem;"></i>
            </div>

            <div id="categories-container" class="categories-filter" style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; width: 100%;">
                ${generateCategoryButtons()}
            </div>
        </div>

        <div id="games-grid" class="grid-lecons" 
			 style="width: 100%; 
					display: grid; 
					grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
					gap: 20px; 
					justify-content: center;
					max-width: 1200px; 
					margin: 0 auto;">
		</div>
    `;
    
    renderGames();
}

/**
 * Génère les boutons de catégories dynamiquement
 */
function generateCategoryButtons() {
    const categories = ["Tous", ...new Set(GAMES_LIST.map(g => g.category))];
    return categories.map(cat => {
        const isActive = currentCategory === cat;
        return `
            <button class="tag ${isActive ? 'tag-active' : ''}" 
                    onclick="filterByCategory('${cat}')" 
                    style="cursor:pointer; border:none; padding: 8px 16px; transition: all 0.3s ease; 
                           background: ${isActive ? 'var(--primary)' : 'var(--card-bg)'}; 
                           color: ${isActive ? 'white' : 'var(--text-main)'};
                           border: 1px solid ${isActive ? 'var(--primary)' : 'var(--border-color)'};
                           border-radius: 20px; font-size: 0.9rem;">
                ${cat}
            </button>
        `;
    }).join('');
}

/**
 * Met à jour la recherche en temps réel
 */
function handleSearch(val) {
    currentSearch = val.toLowerCase();
    renderGames();
}

/**
 * Filtre les jeux par catégorie
 */
function filterByCategory(cat) {
    currentCategory = cat;
    initGamesManager(); // Relance l'init pour mettre à jour l'état visuel des boutons
}

/**
 * Affiche les jeux filtrés dans la grille
 */
async function renderGames() {
    const grid = document.getElementById('games-grid');
    if (!grid) return;
    grid.innerHTML = "";

    const filtered = GAMES_LIST.filter(game => {
        const searchPool = (game.title + " " + game.category + " " + game.tags.join(' ')).toLowerCase();
        const matchesSearch = searchPool.includes(currentSearch);
        const matchesCat = currentCategory === "Tous" || game.category === currentCategory;
        return matchesSearch && matchesCat;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; opacity: 0.5;">Aucun jeu trouvé.</div>`;
        return;
    }

    // Pour chaque jeu filtré
    for (const game of filtered) {
        // 1. Charger le script si nécessaire
        await loadGameScript(game.id);
        
        // 2. Afficher la carte
        if (typeof window[game.initFunction] === 'function') {
            window[game.initFunction](grid, game);
        }
    }
}

/**
 * Charge un fichier JS dynamiquement s'il n'est pas déjà présent
 */
function loadGameScript(gameId) {
    return new Promise((resolve) => {
        const scriptId = `script-${gameId}`;
        
        // Si le script est déjà chargé, on résout immédiatement
        if (document.getElementById(scriptId)) {
            resolve();
            return;
        }

        // Sinon, on crée la balise script
        const script = document.createElement('script');
        script.id = scriptId;
        
        // On récupère le nom du fichier depuis une nouvelle propriété dans GAMES_LIST
        // ou on le déduit (ex: js/divisibilite.js)
        script.src = `js/${gameId}.js`; 
        
        script.onload = () => resolve();
        script.onerror = () => {
            console.error(`Impossible de charger le script : js/${gameId}.js`);
            resolve(); // On résout quand même pour ne pas bloquer tout l'affichage
        };
        
        document.head.appendChild(script);
    });
}