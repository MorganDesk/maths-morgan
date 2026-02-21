// ui.js
const UI = {
    createCard: (l, leconId, isFav, configStatut) => {
        return `
        <div class="card" id="${leconId}">
            <div class="card-header">
                <span class="tag">${l.matiere || 'Maths'}</span>
                <div class="actions">
                    <button onclick="App.handleShare(event, '${l.titre}', '${leconId}')" class="icon-btn" title="Partager">
                        <i class="fas fa-share-nodes"></i>
                    </button>
                    <button onclick="App.handleToggleFav(event, '${leconId}')" class="icon-btn ${isFav ? 'fav-active' : ''}">
                        <i class="${isFav ? 'fas' : 'far'} fa-star"></i>
                    </button>
                </div>
            </div>
            <h3>${l.titre}</h3>
            <p>${l.desc}</p>
            <div class="status-badge ${configStatut.class}" onclick="App.handleCycleStatus('${leconId}')">
                <i class="fas fa-circle"></i> ${configStatut.label}
            </div>
            <div class="fichiers-liste-verticale">
                ${(l.fichiers || []).map(f => `
                    <a href="javascript:void(0)" class="btn-download-full" onclick="openPDF('${f.url}')">
                        <i class="fas fa-file-pdf"></i> <span>${f.nom}</span>
                    </a>`).join('')}
            </div>
        </div>`;
    },

    showToast: (message) => {
        const t = document.getElementById("toast") || document.createElement('div');
        if(!t.id) { t.id = "toast"; document.body.appendChild(t); }
        t.innerText = message;
        t.className = "show";
        setTimeout(() => { t.className = ""; }, 3000);
    }
};