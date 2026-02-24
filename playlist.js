// playlist.js

// 1. CONFIGURATION DES COULEURS PAR NIVEAU
const NIVEAU_COLORS = {
    "6e": "#0284c7", // Bleu
    "5e": "#059669", // Vert
    "4e": "#d97706", // Orange
    "3e": "#dc2626", // Rouge
    "default": "#6366f1" // Indigo
};

// 2. PONT DE COMPATIBILITÉ App (inchangé mais nécessaire)
window.App = {
    handleToggleFav: (event, id) => {
        if (event) event.stopPropagation();
        let favs = JSON.parse(localStorage.getItem('maths_morgan_favs')) || [];
        if (favs.includes(id)) favs = favs.filter(f => f !== id);
        else favs.push(id);
        localStorage.setItem('maths_morgan_favs', JSON.stringify(favs));
        window.favoris = favs;
        PlaylistManager.init();
    },
    handleCycleStatus: (id) => {
        const ordres = ['neutre', 'rouge', 'jaune', 'vert-clair', 'vert-fonce'];
        let stats = JSON.parse(localStorage.getItem('maths_morgan_statuts')) || {};
        let actuel = stats[id] || 'neutre';
        let suivant = ordres[(ordres.indexOf(actuel) + 1) % ordres.length];
        stats[id] = suivant;
        localStorage.setItem('maths_morgan_statuts', JSON.stringify(stats));
        window.statuts = stats;
        PlaylistManager.init();
    },
    handleShare: (event, titre, id) => {
    if (event) event.stopPropagation();
    
    // 1. On récupère le niveau au début de l'ID (ex: "5e" depuis "5e-2025-...")
    const niveauExtrait = id.split('-')[0]; 
    
    // 2. On construit l'URL avec le paramètre ?lvl=
    const baseUrl = window.location.origin + window.location.pathname.replace('playlist.html', 'index.html');
    const shareUrl = `${baseUrl}?lvl=${niveauExtrait}#${id}`;
    
    // 3. Copie et notification
    navigator.clipboard.writeText(shareUrl).then(() => {
        if (typeof UI !== 'undefined' && UI.showToast) {
            UI.showToast(`Lien de la leçon copié !`);
        } else {
            alert("Lien de la leçon copié !");
        }
    });
}
};

const PlaylistManager = {
    currentFilter: 'tous',

    init: () => {
        window.favoris = JSON.parse(localStorage.getItem('maths_morgan_favs')) || [];
        window.statuts = JSON.parse(localStorage.getItem('maths_morgan_statuts')) || {};

        const urlParams = new URLSearchParams(window.location.search);
        const plId = urlParams.get('id');

        if (plId) {
            PlaylistManager.renderOne(plId);
        } else {
            PlaylistManager.renderFilters(); // Affiche les boutons 6e, 5e...
            PlaylistManager.renderAll();
        }
		PlaylistManager.checkDataIntegrity();
    },

    renderFilters: () => {
        const container = document.getElementById('playlist-breadcrumb');
        if (!container) return;
        
        const niveaux = ['tous', '6e', '5e', '4e', '3e'];
        container.innerHTML = `<div class="filter-tags">` + 
            niveaux.map(n => `
                <button class="filter-btn ${PlaylistManager.currentFilter === n ? 'active' : ''}" 
                        onclick="PlaylistManager.filterByLevel('${n}')">
                    ${n === 'tous' ? 'Tous les parcours' : n.toUpperCase()}
                </button>
            `).join('') + `</div>`;
    },

    filterByLevel: (lvl) => {
        PlaylistManager.currentFilter = lvl;
        PlaylistManager.renderFilters();
        PlaylistManager.renderAll();
    },

    renderAll: () => {
        const container = document.getElementById('content');
        if (!container) return;
        document.getElementById('playlist-title').innerText = "Parcours de révisions";
        
        // Filtrage des données
        const filteredData = PlaylistManager.currentFilter === 'tous' 
            ? PLAYLISTS_DATA 
            : PLAYLISTS_DATA.filter(p => p.niveau === PlaylistManager.currentFilter);

        container.innerHTML = filteredData.map(pl => {
            const borderColor = NIVEAU_COLORS[pl.niveau] || NIVEAU_COLORS.default;
            return `
                <div class="card playlist-card-item" data-id="${pl.id}" style="border-top: 5px solid ${borderColor}; cursor:pointer;" onclick="window.location.href='playlist.html?id=${pl.id}'">
                    <div class="card-header">
                        <span class="tag" style="background:${borderColor}; color:white">${pl.niveau}</span>
                        <span class="tag" style="background:var(--bg-body); color:var(--text-main)">${pl.items.length} leçons</span>
                    </div>
                    <h3>${pl.titre}</h3>
                    <p>${pl.desc}</p>
                    <div class="fichiers-liste-verticale">
                        <span class="btn-download-full"><i class="fas fa-play-circle"></i> Voir le parcours</span>
                    </div>
                </div>
            `;
        }).join('');
    },

    renderOne: (id) => {
        const pl = PLAYLISTS_DATA.find(p => p.id === id);
        if (!pl) return PlaylistManager.renderAll();

        document.getElementById('playlist-title').innerText = pl.titre;
        const breadcrumb = document.getElementById('playlist-breadcrumb');
        if (breadcrumb) {
            breadcrumb.innerHTML = `<a href="playlist.html" class="tab-btn" style="display:inline-block; margin-bottom:1rem;">
                <i class="fas fa-chevron-left"></i> Retour aux parcours
            </a>`;
        }

        const toutesLecons = SearchEngine.agregatToutLeSite(true);
        const leconsFiltrees = pl.items.map(itemId => 
            toutesLecons.find(l => getLeconId(l, l.niveauSource) === itemId)
        ).filter(l => l !== undefined);

        const container = document.getElementById('content');
        container.innerHTML = leconsFiltrees.map(l => {
            const leconId = getLeconId(l, l.niveauSource);
            return UI.createCard(l, leconId, window.favoris.includes(leconId), STATUTS_CONFIG[window.statuts[leconId] || 'neutre']);
        }).join('');
    },

    handleSearch: () => {
        const term = document.getElementById('globalSearch').value.toLowerCase().trim();
        const cards = document.querySelectorAll('.playlist-card-item');
        const toutesLecons = SearchEngine.agregatToutLeSite(true);

        cards.forEach(card => {
            const plId = card.getAttribute('data-id');
            const pl = PLAYLISTS_DATA.find(p => p.id === plId);
            
            // Recherche dans le titre/desc de la playlist
            const inPlaylistInfo = pl.titre.toLowerCase().includes(term) || pl.desc.toLowerCase().includes(term);
            
            // Recherche dans le contenu (titres et tags des leçons incluses)
            const inLeçonsContenues = pl.items.some(itemId => {
                const lecon = toutesLecons.find(l => getLeconId(l, l.niveauSource) === itemId);
                if (!lecon) return false;
                const inTitre = lecon.titre.toLowerCase().includes(term);
                const inTags = lecon.tags ? lecon.tags.some(t => t.toLowerCase().includes(term)) : false;
                return inTitre || inTags;
            });

            card.style.display = (inPlaylistInfo || inLeçonsContenues) ? "flex" : "none";
        });
    },
	checkDataIntegrity: () => {
        const toutesLecons = SearchEngine.agregatToutLeSite(true);
        const allAvailableIds = toutesLecons.map(l => getLeconId(l, l.niveauSource));
        let errors = [];

        console.log("--- 🛠️ VÉRIFICATION DES PLAYLISTS ---");
        
        PLAYLISTS_DATA.forEach(pl => {
            pl.items.forEach(itemId => {
                if (!allAvailableIds.includes(itemId)) {
                    errors.push(`❌ Erreur dans [${pl.titre}] : L'ID "${itemId}" est introuvable.`);
                }
            });
        });

        if (errors.length > 0) {
            console.error("Problèmes détectés :\n" + errors.join('\n'));
            // Optionnel : afficher une alerte discrète pour toi en mode dev
            const debugBanner = document.createElement('div');
            debugBanner.style = "background:#fee2e2; color:#b91c1c; padding:10px; text-align:center; font-weight:bold; border-bottom:2px solid #ef4444;";
            debugBanner.innerText = `⚠️ ${errors.length} erreur(s) d'ID détectée(s) dans les parcours. Regarde la console (F12).`;
            document.body.prepend(debugBanner);
        } else {
            console.log("✅ Toutes les playlists sont valides !");
        }
    }
};

document.addEventListener('DOMContentLoaded', PlaylistManager.init);