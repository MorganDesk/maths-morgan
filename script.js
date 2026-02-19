// --- CONFIGURATION ---
const niveaux = [
    { id: "6e", nom: '<i class="fas fa-seedling"></i> 6ème', data: typeof lecons6e !== 'undefined' ? lecons6e : [] },
    { id: "5e", nom: '<i class="fas fa-leaf"></i> 5ème', data: typeof lecons5e !== 'undefined' ? lecons5e : [] },
    { id: "4e", nom: '<i class="fas fa-tree"></i> 4ème', data: typeof lecons4e !== 'undefined' ? lecons4e : [] },
    { id: "3e", nom: '<i class="fas fa-graduation-cap"></i> 3ème', data: typeof lecons3e !== 'undefined' ? lecons3e : [] },
    { id: "archives", nom: '<i class="fas fa-box-archive"></i> Archives', data: typeof donneesArchives !== 'undefined' ? donneesArchives : [] },
    { id: "favoris", nom: '<i class="fas fa-star"></i> Favoris', data: [] }
];

const STATUTS_CONFIG = {
    'neutre': { label: 'Statut : À définir', class: '' },
    'rouge': { label: "Je n'ai pas compris", class: 'rouge' },
    'jaune': { label: 'À approfondir', class: 'jaune' },
    'vert-clair': { label: "J'ai compris", class: 'vert-clair' },
    'vert-fonce': { label: 'Je maîtrise', class: 'vert-fonce' }
};

let currentLevel = "6e";
let currentSort = "recent";
let favoris = JSON.parse(localStorage.getItem('maths_morgan_favs')) || [];
let statuts = JSON.parse(localStorage.getItem('maths_morgan_statuts')) || {};

// --- GÉNÉRATEUR D'ID UNIQUE ---
function getLeconId(l) {
    const slug = l.titre.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    return `${l.niveau || currentLevel}-${l.date || '0000'}-${slug}`;
}

// --- RENDU PRINCIPAL ---
function render(levelId) {
    currentLevel = levelId;
    
    // 1. Mise à jour de la navigation (onglets)
    const nav = document.getElementById('navigation');
    if (nav) {
        nav.innerHTML = niveaux.map(n => `
            <button onclick="render('${n.id}')" class="tab-btn ${currentLevel === n.id ? 'active' : ''}">
                ${n.nom}
            </button>
        `).join('');
    }

    const content = document.getElementById('content');
    const searchTerm = document.getElementById('globalSearch').value.toLowerCase().trim();

    let data = [];

    // 2. Sélection de la source de données
    if (searchTerm !== "") {
        // Mode Recherche : On prend tout
        data = [
            ...lecons6e.map(l => ({...l, niveauSource: "6e"})),
            ...lecons5e.map(l => ({...l, niveauSource: "5e"})),
            ...lecons4e.map(l => ({...l, niveauSource: "4e"})),
            ...lecons3e.map(l => ({...l, niveauSource: "3e"})),
            ...(typeof donneesArchives !== 'undefined' ? donneesArchives.map(l => ({...l, niveauSource: "archives"})) : [])
        ];
    } else if (levelId === 'favoris') {
        // Mode Favoris : On fusionne tout et on filtre par IDs sauvegardés
        const allData = [
            ...lecons6e.map(l => ({...l, niveauSource: "6e"})),
            ...lecons5e.map(l => ({...l, niveauSource: "5e"})),
            ...lecons4e.map(l => ({...l, niveauSource: "4e"})),
            ...lecons3e.map(l => ({...l, niveauSource: "3e"})),
            ...(typeof donneesArchives !== 'undefined' ? donneesArchives.map(l => ({...l, niveauSource: "archives"})) : [])
        ];
        data = allData.filter(l => favoris.includes(getLeconId(l)));
    } else {
        // Mode Niveau simple
        const source = niveaux.find(n => n.id === levelId);
        data = (source ? source.data : []).map(l => ({...l, niveauSource: levelId}));
    }

    // 3. Filtrage par texte
    let filtered = data.filter(l => 
        l.titre.toLowerCase().includes(searchTerm) || 
        l.desc.toLowerCase().includes(searchTerm) ||
        (l.matiere && l.matiere.toLowerCase().includes(searchTerm))
    );

    // 4. Tri (Niveau d'abord, puis Date/Alpha)
    const ordreNiveaux = { "6e": 1, "5e": 2, "4e": 3, "3e": 4, "archives": 5 };
    filtered.sort((a, b) => {
        const diffNiveau = (ordreNiveaux[a.niveauSource] || 99) - (ordreNiveaux[b.niveauSource] || 99);
        if (diffNiveau !== 0) return diffNiveau;
        if (currentSort === "recent") return new Date(b.date) - new Date(a.date);
        if (currentSort === "alpha") return a.titre.localeCompare(b.titre);
        return new Date(a.date) - new Date(b.date);
    });

    // 5. Regroupement par Section
    if (filtered.length === 0) {
        content.innerHTML = `<div class="empty-msg">Aucun résultat trouvé pour "${searchTerm}".</div>`;
        return;
    }

    const groupes = {};
    filtered.forEach(l => {
        if (!groupes[l.niveauSource]) groupes[l.niveauSource] = [];
        groupes[l.niveauSource].push(l);
    });

    // 6. Génération du HTML
    let htmlFinal = "";
    const ordreAffichage = ["6e", "5e", "4e", "3e", "archives"];
    
    ordreAffichage.forEach(nivId => {
        if (groupes[nivId] && groupes[nivId].length > 0) {
            // On affiche le titre de section si on cherche partout ou si on est dans les favoris
            if (searchTerm !== "" || levelId === 'favoris') {
                const labelNiveau = niveaux.find(n => n.id === nivId).nom;
                htmlFinal += `<h2 class="section-title">${labelNiveau}</h2>`;
            }
            
            // Ajout des cartes du groupe
            htmlFinal += groupes[nivId].map(l => {
                const leconId = getLeconId(l);
                const isFav = favoris.includes(leconId);
                const config = STATUTS_CONFIG[statuts[leconId] || 'neutre'];
                
                return `
                <div class="card">
                    <div class="card-header">
                        <span class="tag">${l.matiere || 'Maths'}</span>
                        <div class="actions">
                            <button onclick="shareLecon(event, '${l.titre}')" class="icon-btn" title="Partager"><i class="fas fa-share-nodes"></i></button>
                            <button onclick="toggleFav(event, '${leconId}')" class="icon-btn ${isFav ? 'fav-active' : ''}">
                                <i class="${isFav ? 'fas' : 'far'} fa-star"></i>
                            </button>
                        </div>
                    </div>
                    <h3>${l.titre}</h3>
                    <p>${l.desc}</p>
                    <div class="status-badge ${config.class}" onclick="cycleStatus('${leconId}')">
                        <i class="fas fa-circle"></i> ${config.label}
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
    });

    content.innerHTML = htmlFinal;
}

// --- FONCTIONS ACTIONS ---
function toggleFav(e, leconId) {
    e.stopPropagation();
    favoris = favoris.includes(leconId) ? favoris.filter(id => id !== leconId) : [...favoris, leconId];
    localStorage.setItem('maths_morgan_favs', JSON.stringify(favoris));
    render(currentLevel);
}

function cycleStatus(leconId) {
    const ordres = ['neutre', 'rouge', 'jaune', 'vert-clair', 'vert-fonce'];
    let index = ordres.indexOf(statuts[leconId] || 'neutre');
    statuts[leconId] = ordres[(index + 1) % ordres.length];
    localStorage.setItem('maths_morgan_statuts', JSON.stringify(statuts));
    render(currentLevel);
}

function updateSort(val) {
    currentSort = val;
    render(currentLevel);
}

function shareLecon(e, titre) {
    e.stopPropagation();
    const url = window.location.href;
    if (navigator.share) {
        navigator.share({ title: titre, url: url });
    } else {
        navigator.clipboard.writeText(`${titre} : ${url}`);
        showToast("Lien copié !");
    }
}

function showToast(message) {
    const t = document.getElementById("toast");
    t.innerText = message;
    t.className = "show";
    setTimeout(() => { t.className = t.className.replace("show", ""); }, 3000);
}

// --- THEME & UI ---
function toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.querySelector('.theme-toggle-btn i').className = isDark ? 'fas fa-sun' : 'fas fa-moon';
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// --- MODAL PDF ---
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
window.onscroll = () => {
    const btn = document.getElementById("back-to-top");
    if(btn) btn.style.display = (window.scrollY > 300) ? "block" : "none";
};

window.onclick = (e) => {
    if (e.target == document.getElementById("pdfModal")) closePDF();
};

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        const icon = document.querySelector('.theme-toggle-btn i');
        if(icon) icon.className = 'fas fa-sun';
    }
    render('6e');
});