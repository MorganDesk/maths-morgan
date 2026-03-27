// --- Configuration ---
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx0wVnHtP0NQWwUX9cMjzriBrRcfBba3reE5rvwuKsNJJB2j-xlBfQ3h5qg3XGo6McE/exec";
const SESSION_KEY = "cloud_session";
import { showToastQueue } from './toast.js';

// Exporte les infos de session pour le reste de l'app si besoin
export function getCloudSession() {
    const s = localStorage.getItem(SESSION_KEY);
    return s ? JSON.parse(s) : null;
}

// Fonction utilitaire de hachage SHA-256
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Sauvegarde dans le cloud
export async function syncToCloud() {
    const session = getCloudSession();
    if (!session) return { success: false, message: "Non connecté." };

    // SÉCURITÉ : Ne pas uploader si les données vitales (gameStats) sont absentes du local
    if (!localStorage.getItem('gameStats')) return { success: false, message: "Aucune donnée locale à synchroniser." };

    // 🔒 SECURITÉ : Aspirer le localStorage, UNIQUEMENT les clés de données vitales
    let appData = {};
    const INCLUDED_KEYS = ['gameStats', 'cours'];

    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if (INCLUDED_KEYS.includes(key)) {
            appData[key] = localStorage.getItem(key);
        }
    }

    const payload = {
        action: "sync",
        login: session.login,
        hash: session.hash,
        dataJSON: JSON.stringify(appData)
    };

    try {
        let res = await fetch(SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify(payload) // Envoi en mode text/plain implicite
        });
        let result = await res.json();
        if (result.success && result.lastUpdated) {
            localStorage.setItem('cloud_last_updated', result.lastUpdated);
        }
        return result;
    } catch (err) {
        return { success: false, message: "Erreur réseau de synchronisation." };
    }
}

/**
 * 📦 SAUVEGARDE AUTOMATIQUE (Silence)
 * Ajoute un délai aléatoire (Jitter) de 0-4s pour éviter les pics de charge
 * sur Google Apps Script quand 500 élèves finissent un jeu en même temps.
 */
export async function autoSync() {
    const session = getCloudSession();
    if (!session) return; // Ne rien faire si non connecté

    // On attend entre 0 et 4 secondes pour "lisser" les 30 slots simultanés
    const jitter = Math.floor(Math.random() * 4000);
    setTimeout(async () => {
        try {
            console.log("☁️ [Cloud] Synchro auto... Envoi silencieux.");
            let result = await syncToCloud();
            if (result && result.success) showToastQueue("<span>💾 Progression sauvegardée dans le cloud.</span>");
        } catch (e) {
            console.warn("☁️ [Cloud] Échec synchro auto silencieuse.");
        }
    }, jitter);
}

/**
 * 🛡️ ENREGISTREMENT DIFFÉRÉ (Debounce)
 * Sauvegarde automatiquement la progression 10 secondes APRÈS la dernière action.
 * Idéal pour les favoris et maîtrises : si l'élève en change 5 à la suite,
 * il n'y aura qu'une seule sauvegarde 10s après son dernier clic.
 */
let throttledTimeout = null;
export function autoSyncThrottled() {
    const session = getCloudSession();
    if (!session) return;

    // Si un enregistrement était déjà prévu, on l'annule pour recommencer le décompte
    if (!throttledTimeout) {
        showToastQueue("<span>⏳ Sauvegarde en ligne dans 10 secondes...</span>");
    } else {
        clearTimeout(throttledTimeout);
    }

    throttledTimeout = setTimeout(() => {
        throttledTimeout = null;
        autoSync();
    }, 10000);
}

// Restauration depuis le cloud (sans déconnexion)
export async function restoreFromCloud() {
    const session = getCloudSession();
    if (!session) return { success: false, message: "Non connecté." };

    try {
        let res = await fetch(SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify({ action: "login", login: session.login, hash: session.hash })
        });
        let result = await res.json();

        if (result.success && result.dataJSON) {
            // Nettoyage de tout SAUF la session
            const sessionData = localStorage.getItem(SESSION_KEY);
            localStorage.clear();
            localStorage.setItem(SESSION_KEY, sessionData);

            // Importation des données
            if (result.dataJSON !== "{}") {
                let appData = JSON.parse(result.dataJSON);
                appData = migrateOldCloudData(appData); // APPLIQUE MIGRATION
                for (let key in appData) {
                    localStorage.setItem(key, typeof appData[key] === 'object' ? JSON.stringify(appData[key]) : appData[key]);
                }
            }
            return { success: true };
        } else {
            return { success: false, message: result.message || "Erreur de récupération." };
        }
    } catch (err) {
        return { success: false, message: "Erreur réseau." };
    }
}

// Injection et gestion de l'UI Cloud
function renderCloudUI() {
    let cloudBar = document.getElementById('cloud-bar');
    if (!cloudBar) {
        cloudBar = document.createElement('div');
        cloudBar.id = 'cloud-bar';

        // On l'insère juste après le header
        const header = document.querySelector('header');
        if (header && header.nextSibling) {
            header.parentNode.insertBefore(cloudBar, header.nextSibling);
        } else {
            document.body.prepend(cloudBar);
        }
    }

    const session = getCloudSession();

    if (session) {
        // Mode Connecté
        const displayName = session.prenom ? `${session.nom.toUpperCase()} ${session.prenom}` : session.nom.toUpperCase();
        const displayClass = session.classe ? ` (${session.classe})` : '';

        cloudBar.innerHTML = `
            <div class="cloud-connected">
                <div class="cloud-main">
                    <span class="cloud-user-info"><i class="fas fa-user-check"></i> ${displayName}${displayClass}</span>
                    <div class="cloud-actions">
                        <button class="cloud-btn restore-btn" id="cloud-restore-btn" title="Récupérer ma dernière sauvegarde en ligne (écrase les données actuelles)" style="background:#f59e0b;"><i class="fas fa-cloud-download-alt"></i> Restaurer</button>
                        <button class="cloud-btn logout-btn" id="cloud-logout-btn" title="Se déconnecter"><i class="fas fa-sign-out-alt"></i></button>
                    </div>
                </div>
                <div class="cloud-help-text">
                    <i class="fas fa-info-circle"></i><strong> Restaurer</strong> récupère ta progression si tu changes d'appareil. La <strong>progression</strong> est sauvegardée automatiquement.
                </div>
            </div>
        `;

        document.getElementById('cloud-logout-btn').addEventListener('click', () => {
            if (confirm("Êtes-vous sûr de vouloir vous déconnecter ? Les données locales seront effacées de cet appareil.")) {
                localStorage.clear();
                alert("Déconnexion réussie.");
                window.location.reload();
            }
        });



        document.getElementById('cloud-restore-btn').addEventListener('click', async () => {
            if (confirm("Attention : Restaurer votre progression va ÉCRASER ce que vous avez fait sur cet appareil pour le remplacer par ce qui est dans le nuage. Continuer ?")) {
                const btn = document.getElementById('cloud-restore-btn');
                const oldHTML = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>...';
                btn.disabled = true;

                let result = await restoreFromCloud();

                if (result.success) {
                    btn.innerHTML = '<i class="fas fa-check"></i> OK';
                    setTimeout(() => window.location.reload(), 800);
                } else {
                    alert(result.message);
                    btn.innerHTML = oldHTML;
                    btn.disabled = false;
                }
            }
        });

    } else {
        // Mode Invité
        cloudBar.innerHTML = `
            <div class="cloud-disconnected">
                <input type="text" id="cloud-login-input" placeholder="Login">
                <input type="password" id="cloud-pass-input" placeholder="Mot de passe">
                <button class="cloud-btn" id="cloud-login-btn">Connexion</button>
                <div class="cloud-divider">|</div>
                <button class="cloud-btn outline" id="cloud-open-register-btn">Créer un compte</button>
            </div>
        `;

        document.getElementById('cloud-login-btn').addEventListener('click', doLogin);
        document.getElementById('cloud-open-register-btn').addEventListener('click', renderRegisterModal);
    }
}

async function doLogin() {
    const login = document.getElementById('cloud-login-input').value.trim();
    const pass = document.getElementById('cloud-pass-input').value.trim();
    if (!login || !pass) {
        showToastQueue("⚠️ Veuillez remplir les champs.");
        return;
    }

    document.getElementById('cloud-login-btn').innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    const hash = await hashPassword(pass);

    try {
        let res = await fetch(SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify({ action: "login", login: login, hash: hash })
        });
        let result = await res.json();

        if (result.success) {
            // Nettoyage complet
            localStorage.clear();

            // On restaure le Data_JSON
            if (result.dataJSON && result.dataJSON !== "{}") {
                let appData = JSON.parse(result.dataJSON);
                appData = migrateOldCloudData(appData); // APPLIQUE MIGRATION
                for (let key in appData) {
                    localStorage.setItem(key, typeof appData[key] === 'object' ? JSON.stringify(appData[key]) : appData[key]);
                }
            }

            // On décrypte virtuellement le Nom Prénom Classe pour l'affichage via un autre fetch ou on l'inclut en attendant
            // Note: Côté GAS, on n'a renvoyé que dataJSON. On va faire une petite session light sans Nom pour l'instant si on ne l'a pas.
            // On le réclammera à l'API plus tard si besoin, ou l'élève tapera son nom.
            // Pour l'instant on met juste le login dans l'UI:
            // Pour faire parfait, on va juste utiliser le login comme nom. Si l'élève modifie, il sauvera.
            // ATTENTION: modifions plutôt le script GAS ! On en parlera si on veut le nom complet.

            localStorage.setItem(SESSION_KEY, JSON.stringify({
                login: login,
                hash: hash,
                nom: result.nom || login.toUpperCase(),
                prenom: result.prenom || "",
                classe: result.classe || ""
            }));

            window.location.reload();
        } else {
            document.getElementById('cloud-login-btn').innerHTML = 'Connexion';
            showToastQueue(`⚠️ ${result.message}`);
        }
    } catch (err) {
        document.getElementById('cloud-login-btn').innerHTML = 'Connexion';
        showToastQueue("❌ Erreur de connexion Serveur.");
    }
}

function renderRegisterModal() {
    let modal = document.createElement('div');
    modal.className = 'cloud-modal';
    modal.id = 'cloud-register-modal';

    const classesOptions = [
        '<option value="6e">Niveau 6e</option>',
        '<option value="5e">Niveau 5e</option>',
        '<option value="4e">Niveau 4e</option>',
        '<option value="3e">Niveau 3e</option>',
        '<option value="Lycée">Lycée (Anciens Élèves)</option>',
        '<option value="Autre">Autre / Invité</option>'
    ];

    modal.innerHTML = `
        <div class="cloud-modal-content">
            <h2>Créer un compte</h2>
            <div class="cloud-form">
                <input type="text" id="reg-nom" placeholder="Nom" required>
                <input type="text" id="reg-prenom" placeholder="Prénom" required>
                <input type="text" id="reg-login" placeholder="Identifiant (Login)" required>
                <input type="password" id="reg-pass" placeholder="Mot de passe" required>
                <select id="reg-classe">
                    <option value="">-- Choix de la classe --</option>
                    ${classesOptions.join('')}
                </select>
            </div>
            <div class="cloud-modal-actions">
                <button class="cloud-btn outline" id="reg-cancel">Annuler</button>
                <button class="cloud-btn" id="reg-submit">Créer la demande</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('reg-cancel').addEventListener('click', () => modal.remove());
    document.getElementById('reg-submit').addEventListener('click', async () => {
        const n = document.getElementById('reg-nom').value.trim();
        const p = document.getElementById('reg-prenom').value.trim();
        const l = document.getElementById('reg-login').value.trim();
        const pw = document.getElementById('reg-pass').value.trim();
        const c = document.getElementById('reg-classe').value;

        if (!n || !p || !l || !pw || !c) return alert("Remplissez tous les champs !");

        const btn = document.getElementById('reg-submit');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

        // --- NOUVEAU : Aspiration du localStorage existant pour ne rien perdre ! ---
        // -- Préparation d'une sauvegarde PLATE et LÉGÈRE --
        const data = {};
        const keysToSave = [
            'gameStats', 'activeQuests', 'cours'
        ];

        keysToSave.forEach(key => {
            const value = localStorage.getItem(key);
            if (value) {
                try { data[key] = JSON.parse(value); }
                catch (e) { data[key] = value; }
            }
        });

        // SÉCURITÉ : On s'assure qu'AUCUN token admin n'est envoyé (parfois présent dans gameStats)
        if (data.gameStats && data.gameStats.admin_token) delete data.gameStats.admin_token;

        const hash = await hashPassword(pw);
        try {
            let res = await fetch(SCRIPT_URL, {
                method: "POST",
                body: JSON.stringify({
                    action: "register",
                    login: l,
                    hash: hash,
                    nom: n,
                    prenom: p,
                    classe: c,
                    dataJSON: JSON.stringify(data) // <-- On envoie la progression actuelle !
                })
            });
            let result = await res.json();

            btn.innerHTML = 'Créer la demande';
            
            if (result.success) {
                showToastQueue("✔️ " + result.message);
                modal.remove();
            } else {
                showToastQueue("⚠️ " + result.message);
            }
        } catch (e) {
            btn.innerHTML = 'Créer la demande';
            showToastQueue("❌ Erreur réseau");
        }
    });
}

// Lancement automatique du rendu et de la synchro initiale
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", () => {
        renderCloudUI();
        syncOnPageLoad();
    });
} else {
    renderCloudUI();
    syncOnPageLoad();
}

/**
 * 🔄 COMPARATEUR DE DONNÉES ROBUSTE
 * Ignore l'ordre des clés pour ne recharger que si nécessaire (évite les boucles infinies).
 */
function isDataDifferent(localObj, remoteJSON) {
    if (!remoteJSON) return false;
    try {
        const remoteObj = typeof remoteJSON === 'string' ? JSON.parse(remoteJSON) : remoteJSON;
        // Tri des clés pour une comparaison stable
        const localSorted = JSON.stringify(localObj, Object.keys(localObj).sort());
        const remoteSorted = JSON.stringify(remoteObj, Object.keys(remoteObj).sort());
        return localSorted !== remoteSorted;
    } catch (e) {
        return true;
    }
}

/**
 * 🚀 SYNCHRONISATION AU CHARGEMENT DE LA PAGE
 * Récupère les données cloud et les écrit dans le localStorage SANS recharger la page.
 * La page vient juste d'être chargée, les modules liront les données mises à jour naturellement.
 */
async function syncOnPageLoad() {
    const session = getCloudSession();
    if (!session) return;

    try {
        const localLastUpdated = localStorage.getItem('cloud_last_updated');
        
        // Fast-check API call
        const checkRes = await fetch(SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify({ action: "checkUpdate", login: session.login, hash: session.hash })
        });
        const checkResult = await checkRes.json();
        
        if (checkResult.success && checkResult.lastUpdated && localLastUpdated) {
            const remoteDate = new Date(checkResult.lastUpdated).getTime();
            const localDate = new Date(localLastUpdated).getTime();
            
            if (remoteDate <= localDate) {
                // On s'assure d'initialiser les hooks/événements
                if (document.getElementById('progression-container')) {
                    try {
                        const { initEvents } = await import('./events.js');
                        initEvents();
                    } catch (e) { console.warn('☁️ [Cloud] Erreur chargement événements:', e.message); }
                }
                return;
            }
        }
        

        const response = await fetch(SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify({ action: "sync", login: session.login, hash: session.hash, dataJSON: null })
        });
        const result = await response.json();

        if (result.success && result.dataJSON && result.dataJSON !== "{}") {
            const INCLUDED_KEYS = ['gameStats', 'cours'];
            let currentLocal = {};
            for (let i = 0; i < localStorage.length; i++) {
                let key = localStorage.key(i);
                if (INCLUDED_KEYS.includes(key)) {
                    currentLocal[key] = localStorage.getItem(key);
                }
            }

            if (isDataDifferent(currentLocal, result.dataJSON)) {
                let cloudData = JSON.parse(result.dataJSON);
                cloudData = migrateOldCloudData(cloudData); // APPLIQUE MIGRATION
                for (const key in cloudData) {
                    if (INCLUDED_KEYS.includes(key)) {
                        localStorage.setItem(key, typeof cloudData[key] === 'object' ? JSON.stringify(cloudData[key]) : cloudData[key]);
                    }
                }
                if (result.lastUpdated) {
                    localStorage.setItem('cloud_last_updated', result.lastUpdated);
                }
                showToastQueue("☁️ Progression appliquée depuis le serveur !");
                // Rafraîchir le widget avec les nouvelles données
                if (document.getElementById('progression-container')) {
                    try {
                        const { updateProgressionWidget } = await import('./progression.js');
                        updateProgressionWidget();
                    } catch (e) { console.warn('☁️ [Cloud] Erreur refresh widget:', e.message); }
                }
            }
        }

        // Dans tous les cas : injecter les bannières événements
        if (document.getElementById('progression-container')) {
            try {
                const { initEvents } = await import('./events.js');
                initEvents();
            } catch (e) { console.warn('☁️ [Cloud] Erreur chargement événements:', e.message); }
        }

    } catch (e) {
        console.warn("☁️ [Cloud] Échec de la récupération au démarrage :", e.message);
    }
}

/**
 * 🔄 RÉCUPÉRATION MANUELLE (utilisée par games_manager avant de jouer)
 * Alias vers syncOnPageLoad pour compatibilité.
 */
export async function autoRestore(shouldReload = false) {
    await syncOnPageLoad();
}

/**
 * MIGRATION V2 POUR LES DONNEES CLOUD
 * Si l'ancien format est détecté côté Cloud, on convertit l'objet appData à la volée.
 */
export function migrateOldCloudData(cloudData) {
    let parsedStats = cloudData.gameStats ? (typeof cloudData.gameStats === 'string' ? JSON.parse(cloudData.gameStats) : cloudData.gameStats) : {};
    
    if (parsedStats.format_v2) {
        return cloudData;
    }
    
    const oldTotalMp = cloudData.total_mp;
    const oldHighScores = cloudData.gameHighScores;
    const oldCoursF = cloudData.coursFavorites;
    const oldCoursM = cloudData.coursMastery;
    const oldActiveQuests = cloudData.activeQuests;
    
    let needsMigration = false;
    if (oldTotalMp !== undefined || oldHighScores !== undefined || oldCoursF !== undefined || oldCoursM !== undefined || (oldActiveQuests && typeof oldActiveQuests === 'string' && oldActiveQuests.startsWith('['))) {
        needsMigration = true;
    }
    
    if (needsMigration) {
        parsedStats.total_mp = oldTotalMp !== undefined ? parseInt(oldTotalMp, 10) : (parsedStats.total_mp || 0);
        if (!parsedStats.games) parsedStats.games = {};
        
        if (oldHighScores) {
            const parsedHS = (typeof oldHighScores === 'string') ? JSON.parse(oldHighScores) : oldHighScores;
            for (const key in parsedHS) {
                const lastUnderscore = key.lastIndexOf('_');
                let gameId = key, mode = '0';
                if (lastUnderscore !== -1) {
                    gameId = key.substring(0, lastUnderscore);
                    mode = key.substring(lastUnderscore + 1);
                    if (mode === 'default') mode = '0';
                }
                if (!parsedStats.games[gameId]) parsedStats.games[gameId] = { total_mp: 0, modes: {} };
                if (!parsedStats.games[gameId].modes[mode]) parsedStats.games[gameId].modes[mode] = { mp: 0, highscore: 0 };
                parsedStats.games[gameId].modes[mode].highscore = parsedHS[key];
            }
        }

        if (oldActiveQuests) {
            const parsedArray = (typeof oldActiveQuests === 'string') ? JSON.parse(oldActiveQuests) : oldActiveQuests;
            if (Array.isArray(parsedArray)) {
                parsedStats.activeQuests = { bonus_given_today: false, quests: parsedArray };
            } else {
                parsedStats.activeQuests = parsedArray; 
            }
        }
        
        const cours = { favoris: [], maitrises: {} };
        if (oldCoursF) cours.favoris = (typeof oldCoursF === 'string') ? JSON.parse(oldCoursF) : oldCoursF;
        if (oldCoursM) cours.maitrises = (typeof oldCoursM === 'string') ? JSON.parse(oldCoursM) : oldCoursM;
        
        cloudData.cours = JSON.stringify(cours);
        
        delete cloudData.total_mp;
        delete cloudData.gameHighScores;
        delete cloudData.coursFavorites;
        delete cloudData.coursMastery;
        delete cloudData.activeQuests;
        delete cloudData.lastQuestDate;
        
        parsedStats.format_v2 = true;
        cloudData.gameStats = JSON.stringify(parsedStats);
    }
    
    return cloudData;
}

