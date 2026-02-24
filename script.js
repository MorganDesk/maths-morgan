// --- ÉTAT GLOBAL ---
// Récupère le dernier niveau consulté ou défaut sur 6ème
let currentLevel = localStorage.getItem('maths_morgan_last_lvl') || "6e";
let currentSort = "recent";
let favoris = JSON.parse(localStorage.getItem('maths_morgan_favs')) || [];
let statuts = JSON.parse(localStorage.getItem('maths_morgan_statuts')) || {};

// Configuration des pastilles de progression
const STATUTS_CONFIG = {
    'neutre': { label: 'Maîtrise : À définir', class: '' },
    'rouge': { label: "Je n'ai pas compris", class: 'rouge' },
    'jaune': { label: 'À approfondir', class: 'jaune' },
    'vert-clair': { label: "J'ai compris", class: 'vert-clair' },
    'vert-fonce': { label: 'Je maîtrise', class: 'vert-fonce' }
};

// --- UTILITAIRES ---
// Génère un ID unique pour chaque leçon afin de stocker favoris et statuts
function getLeconId(l, niveauFallback) {
    // 1. On normalise pour séparer les accents (ex: 'é' devient 'e' + '´')
    // 2. On supprime les accents via l'expression régulière Unicode
    // 3. On passe en minuscules et on remplace les espaces par des tirets
    const titreNettoye = l.titre
        .normalize("NFD") 
        .replace(/[\u0300-\u036f]/g, "") 
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, ''); // On ne garde que l'essentiel
    
    const anneeLecon = l.annee || "0000";
    const niv = l.niveau || niveauFallback || "inconnu";
    
    return `${niv}-${anneeLecon}-${titreNettoye}`;
}

// --- RENDU PRINCIPAL ---
function render() {
    const content = document.getElementById('content');
    const searchInput = document.getElementById('globalSearch');
    const searchTerm = (searchInput?.value || "").toLowerCase().trim();
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // 1. Appel au moteur de recherche (search.js) pour obtenir les données
    // Le moteur gère si la recherche est globale (index) ou locale (archives/favoris)
    const rawData = SearchEngine.obtenirDonnees(currentPage, searchTerm, currentLevel, favoris);
    
    // 2. Filtrage textuel et tri des résultats
    const filtered = SearchEngine.filtrerEtTrier(rawData, searchTerm, currentSort);

    // 3. Mise à jour des onglets de navigation
    updateNavTabs(currentPage, searchTerm);

    // 4. Affichage des leçons
    if (filtered.length === 0) {
        content.innerHTML = `<div class="empty-msg">Aucun résultat trouvé pour "${searchTerm}".</div>`;
        return;
    }

    content.innerHTML = filtered.map(l => {
        const leconId = getLeconId(l, l.niveauSource);
        const isFav = favoris.includes(leconId);
        const configStatut = STATUTS_CONFIG[statuts[leconId] || 'neutre'];
        
        return `
        <div class="card" id="${leconId}">
			<div class="card-header">
				<div class="tags-container">
					<span class="tag tag-lvl">${l.niveauSource.toUpperCase()}</span>
					<span class="tag tag-matiere">${l.matiere || 'Maths'}</span>
				</div>
				<div class="actions">
					<button onclick="shareLecon(event, '${l.titre}', '${leconId}')" class="icon-btn" title="Partager">
						<i class="fas fa-share-nodes"></i>
					</button>
					<button onclick="toggleFav(event, '${leconId}')" class="icon-btn ${isFav ? 'fav-active' : ''}">
						<i class="${isFav ? 'fas' : 'far'} fa-star"></i>
					</button>
				</div>
			</div>
            <h3>${l.titre}</h3>
            <p>${l.desc}</p>
            <div class="status-badge ${configStatut.class}" onclick="cycleStatus('${leconId}')">
                <i class="fas fa-circle"></i> ${configStatut.label}
            </div>
            <div class="fichiers-liste-verticale">
                ${(l.fichiers || []).map(f => `
                    <a href="javascript:void(0)" class="btn-download-full" onclick="openPDF('${f.url}')">
                        <i class="fas fa-file-pdf"></i> <span>${f.nom}</span>
                    </a>`).join('')}
            </div>
        </div>`;
    }).join('');
}

// Gère l'apparence des onglets de navigation selon la page active
function updateNavTabs(page, searchTerm) {
    const nav = document.getElementById('navigation');
    if (!nav) return;

    // Si on est sur l'index avec une recherche active, on affiche un titre spécial
    if ((page === 'index.html' || page === '') && searchTerm !== "") {
        nav.innerHTML = `<h2 class="section-title"><i class="fas fa-search"></i> Résultats de la recherche globale</h2>`;
        return;
    }

    // Sinon on génère les onglets à partir du fichier config.js
    nav.innerHTML = NAV_MENU.map(item => {
        // Détermine si l'onglet correspond à la page actuelle ou au niveau actuel
        const isCurrentLevel = page.includes('index.html') && item.url.includes(`lvl=${currentLevel}`);
        const isCurrentPage = page === item.url;
        const isActive = (isCurrentLevel || isCurrentPage) ? 'active' : '';
        
        return `<button onclick="window.location.href='${item.url}'" class="tab-btn ${isActive}">${item.nom}</button>`;
    }).join('');
}

// --- ACTIONS UTILISATEUR ---
function toggleFav(e, leconId) {
    e.stopPropagation();
    favoris = favoris.includes(leconId) ? favoris.filter(id => id !== leconId) : [...favoris, leconId];
    localStorage.setItem('maths_morgan_favs', JSON.stringify(favoris));
    render();
}

function cycleStatus(leconId) {
    const ordres = ['neutre', 'rouge', 'jaune', 'vert-clair', 'vert-fonce'];
    let index = ordres.indexOf(statuts[leconId] || 'neutre');
    statuts[leconId] = ordres[(index + 1) % ordres.length];
    localStorage.setItem('maths_morgan_statuts', JSON.stringify(statuts));
    render();
}

function updateSort(val) {
    currentSort = val;
    render();
}

function shareLecon(e, titre, leconId) {
    e.stopPropagation();
    const niveau = leconId.split('-')[0];
    const baseUrl = window.location.origin + window.location.pathname.replace(/(archives|favoris|playlist)\.html/, 'index.html');
    
    const urlPartage = `${baseUrl}?lvl=${niveau}#${leconId}`;
    
    navigator.clipboard.writeText(urlPartage);
    showToast("Lien de la leçon copié !");
}

function showToast(message) {
    const t = document.getElementById("toast") || document.createElement('div');
    if (!t.id) { t.id = "toast"; document.body.appendChild(t); }
    t.innerText = message;
    t.className = "show";
    setTimeout(() => { t.className = ""; }, 3000);
}

// --- THEME & PDF ---
function toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    const icon = document.querySelector('.theme-toggle-btn i');
    if(icon) icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
}

function openPDF(u) { 
    document.getElementById("pdf-frame").src = u; 
    document.getElementById("pdfModal").style.display = "block"; 
    document.body.style.overflow = "hidden";
}

function closePDF() { 
    document.getElementById("pdfModal").style.display = "none"; 
    document.getElementById("pdf-frame").src = "";
    document.body.style.overflow = "auto";
}

// --- INITIALISATION ---
document.addEventListener('DOMContentLoaded', () => {
    // Applique le thème sauvegardé
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        const icon = document.querySelector('.theme-toggle-btn i');
        if(icon) icon.className = 'fas fa-sun';
    }

    // Récupère le niveau via l'URL (ex: ?lvl=4e)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('lvl')) {
        currentLevel = urlParams.get('lvl');
        localStorage.setItem('maths_morgan_last_lvl', currentLevel);
    }

    render();

    // Gestion de l'ancre (#) pour scroller vers une leçon précise
    const hash = window.location.hash.replace('#', '');
    if (hash) {
        setTimeout(() => {
            const el = document.getElementById(hash);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
                el.style.boxShadow = "0 0 30px var(--primary)";
                setTimeout(() => el.style.boxShadow = "none", 3000);
            }
        }, 500);
    }
});