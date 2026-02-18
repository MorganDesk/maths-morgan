// Configuration des niveaux
const niveaux = [
    { id: "6e", nom: '<i class="fas fa-seedling"></i> 6ème', data: typeof lecons6e !== 'undefined' ? lecons6e : [] },
    { id: "5e", nom: '<i class="fas fa-leaf"></i> 5ème', data: typeof lecons5e !== 'undefined' ? lecons5e : [] },
    { id: "4e", nom: '<i class="fas fa-tree"></i> 4ème', data: typeof lecons4e !== 'undefined' ? lecons4e : [] },
    { id: "3e", nom: '<i class="fas fa-graduation-cap"></i> 3ème', data: typeof lecons3e !== 'undefined' ? lecons3e : [] },
    { id: "archives", nom: '<i class="fas fa-box-archive"></i> Archives', data: typeof donneesArchives !== 'undefined' ? donneesArchives : [] },
    { id: "favoris", nom: '<i class="fas fa-star"></i> Favoris', data: [] }
];

// Configuration des statuts de compétence
const STATUTS_CONFIG = {
    'neutre': { label: 'Statut : À définir', class: '' },
    'rouge': { label: "Je n'ai pas compris", class: 'rouge' },
    'jaune': { label: 'À approfondir', class: 'jaune' },
    'vert-clair': { label: "J'ai compris", class: 'vert-clair' },
    'vert-fonce': { label: 'Je maîtrise', class: 'vert-fonce' }
};

// Variables d'état globales
let currentLevel = "6e";
let currentSort = "recent";
let filterMatiere = "";

// Éléments DOM fréquemment utilisés
const nav = document.getElementById('navigation');
const filtersContainer = document.getElementById('filters-container');
const content = document.getElementById('content');
const searchInput = document.getElementById('globalSearch');
const backToTopBtn = document.getElementById("back-to-top");

// --- GESTION DES STATUTS ---
function getStatus(leconId) {
    const statuses = JSON.parse(localStorage.getItem('maths-suivi') || '{}');
    return statuses[leconId] || 'neutre';
}

function cycleStatus(leconId) {
    const order = ['neutre', 'rouge', 'jaune', 'vert-clair', 'vert-fonce'];
    const current = getStatus(leconId);
    const next = order[(order.indexOf(current) + 1) % order.length];
    const statuses = JSON.parse(localStorage.getItem('maths-suivi') || '{}');
    statuses[leconId] = next;
    localStorage.setItem('maths-suivi', JSON.stringify(statuses));
    render(currentLevel);
}

// --- LOGIQUE DE TRI ---
function applySort(data) {
    let sortedData = [...data];
    if (currentSort === "alpha") return sortedData.sort((a, b) => a.titre.localeCompare(b.titre));
    return sortedData.sort((a, b) => {
        const dateA = a.date ? new Date(a.date) : new Date(0);
        const dateB = b.date ? new Date(b.date) : new Date(0);
        return currentSort === "recent" ? dateB - dateA : dateA - dateB;
    });
}

function updateSort(val) {
    currentSort = val;
    render(currentLevel);
}

// --- FAVORIS ---
function generateId(l) {
    return `${l.titre}-${l.niveau || currentLevel}-${l.annee || ''}`.replace(/\s+/g, '-').toLowerCase();
}

function getFavoris() {
    return JSON.parse(localStorage.getItem('maths-favoris-v2') || '[]');
}

function toggleFavori(leconJson) {
    const lecon = JSON.parse(decodeURIComponent(leconJson));
    const leconId = generateId(lecon);
    let favs = getFavoris();
    const index = favs.findIndex(f => generateId(f) === leconId);
    if (index > -1) favs.splice(index, 1); else favs.push(lecon);
    localStorage.setItem('maths-favoris-v2', JSON.stringify(favs));
    render(currentLevel);
}

// --- PARTAGE & PDF ---
function shareLecon(titre, niveau) {
    const shareUrl = `${window.location.origin}${window.location.pathname}?search=${encodeURIComponent(titre)}`;
    const shareText = `Leçon de Maths (${niveau}) : ${titre}`;
    if (navigator.share) {
        navigator.share({ title: 'Maths Morgan', text: shareText, url: shareUrl }).catch(console.error);
    } else {
        navigator.clipboard.writeText(`${shareText} - ${shareUrl}`).then(() => showToast());
    }
}

function openPDF(url) {
    document.getElementById("pdf-frame").src = url;
    document.getElementById("pdfModal").style.display = "block";
    document.body.classList.add("modal-open");
}

function closePDF() {
    document.getElementById("pdfModal").style.display = "none";
    document.getElementById("pdf-frame").src = "";
    document.body.classList.remove("modal-open");
}

// --- MOTEUR DE RENDU ---
function render(levelId) {
    currentLevel = levelId;
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    // Rendu de la navigation
    nav.innerHTML = niveaux.map(n => `
        <button onclick="resetFilters(); render('${n.id}')" class="tab-btn ${currentLevel === n.id ? 'active' : ''}">
            ${n.nom}
        </button>
    `).join('');

    let finalHTML = "";

    if (searchTerm) {
        filtersContainer.innerHTML = "";
        niveaux.forEach(niveau => {
            if(niveau.id === 'favoris') return;
            let results = applySort(niveau.data.filter(l => 
                l.titre.toLowerCase().includes(searchTerm) || 
                l.desc.toLowerCase().includes(searchTerm) ||
                l.matiere.toLowerCase().includes(searchTerm)
            ));
            if (results.length > 0) {
                finalHTML += `<div style="grid-column: 1/-1; margin-top: 2rem;"><h2 style="font-size: 1.1rem; border-left: 4px solid var(--primary); padding-left: 10px; color: var(--text-light)">${niveau.nom}</h2></div>`;
                finalHTML += results.map(l => createCardHTML(l, niveau.id)).join('');
            }
        });
        if (finalHTML === "") finalHTML = `<p class="empty-msg">Aucun résultat pour "${searchTerm}".</p>`;
    } 
    else if (levelId === 'favoris') {
        filtersContainer.innerHTML = "";
        const favs = applySort(getFavoris());
        finalHTML = favs.map(l => createCardHTML(l, l.niveau)).join('') || `<p class="empty-msg">Aucun favori enregistré.</p>`;
    } 
    else {
        const selected = niveaux.find(n => n.id === levelId);
        let list = selected ? [...selected.data] : [];

        if (levelId === 'archives') {
            const mats = [...new Set(list.map(l => l.matiere))].sort();
            filtersContainer.innerHTML = `
                <div class="filter-bar">
                    <select onchange="filterMatiere=this.value; render('archives')">
                        <option value="">Tous les domaines</option>
                        ${mats.map(m => `<option value="${m}" ${filterMatiere === m ? 'selected' : ''}>${m}</option>`).join('')}
                    </select>
                </div>`;
            list = list.filter(l => (filterMatiere === "" || l.matiere === filterMatiere));
        } else {
            filtersContainer.innerHTML = "";
        }
        finalHTML = applySort(list).map(l => createCardHTML(l, levelId)).join('') || `<p class="empty-msg">Aucune leçon ici pour le moment.</p>`;
    }
    content.innerHTML = finalHTML;
}

function createCardHTML(l, levelId) {
    const tempLecon = {...l, niveau: l.niveau || levelId};
    const leconId = generateId(tempLecon);
    const isFav = getFavoris().some(f => generateId(f) === leconId);
    const config = STATUTS_CONFIG[getStatus(leconId)];
    const leconData = encodeURIComponent(JSON.stringify(tempLecon));

    const filesHTML = l.fichiers && l.fichiers.length > 0 
        ? l.fichiers.map(f => `<a href="javascript:void(0)" class="btn-download" onclick="openPDF('${f.url}')"><i class="fas fa-file-pdf"></i> ${f.nom}</a>`).join('')
        : `<span>Aucun fichier</span>`;

    return `
        <div class="card">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem">
                <small>${l.matiere} (${tempLecon.niveau})</small>
                <div style="display:flex; align-items:center">
                    <span class="year-badge">${l.annee || ''}</span>
                    <button class="share-btn" onclick="shareLecon('${l.titre}', '${tempLecon.niveau}')"><i class="fas fa-share-nodes"></i></button>
                    <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavori('${leconData}')"><i class="${isFav ? 'fas' : 'far'} fa-star"></i></button>
                </div>
            </div>
            <h3>${l.titre}</h3>
            <p>${l.desc}</p>
            <div class="status-badge ${config.class}" onclick="cycleStatus('${leconId}')"><i class="fas fa-circle"></i> ${config.label}</div>
            <div class="fichiers-container">${filesHTML}</div>
        </div>`;
}

// --- UTILITAIRES ---
function showToast() {
    const t = document.getElementById("toast");
    t.className = "show";
    setTimeout(() => t.className = "", 3000);
}

function resetFilters() { filterMatiere = ""; }

function toggleDarkMode() {
    const isD = document.body.classList.toggle('dark-theme');
    const icon = document.querySelector('#theme-toggle i');
    icon.className = isD ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('theme', isD ? 'dark' : 'light');
}

function scrollToTop() { window.scrollTo({ top: 0, behavior: "smooth" }); }

// --- ÉVÉNEMENTS ---
window.onscroll = () => { backToTopBtn.style.display = (window.scrollY > 300) ? "block" : "none"; };

window.onclick = (e) => {
    if (e.target == document.getElementById("pdfModal")) closePDF();
};

// --- INITIALISATION ---
document.addEventListener('DOMContentLoaded', () => {
    const s = new URLSearchParams(window.location.search).get('search');
    if (s) searchInput.value = s;
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        document.querySelector('#theme-toggle i').className = 'fas fa-sun';
    }
    render('6e');
});