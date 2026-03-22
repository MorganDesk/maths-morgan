// --- Configuration ---
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxTg04GvGkVEetjyIvk6sbFNQmB0FY5rJ4USDmiQlUND9fC8uJQKL0I50M2Wew8rQWi/exec";
const SESSION_KEY = "cloud_session";

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

    // Aspirer tout le localStorage de l'application (Sauf la session elle-même)
    let appData = {};
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if (key !== SESSION_KEY) {
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
        return result;
    } catch (err) {
        return { success: false, message: "Erreur réseau de synchronisation." };
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
                <span class="cloud-user-info"><i class="fas fa-user-check"></i> ${displayName}${displayClass}</span>
                <div class="cloud-actions">
                    <button class="cloud-btn sync-btn" id="cloud-sync-btn"><i class="fas fa-cloud-upload-alt"></i> Sauvegarder</button>
                    <button class="cloud-btn logout-btn" id="cloud-logout-btn"><i class="fas fa-sign-out-alt"></i></button>
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

        document.getElementById('cloud-sync-btn').addEventListener('click', async () => {
            const btn = document.getElementById('cloud-sync-btn');
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sauvegarde...';
            btn.disabled = true;
            let result = await syncToCloud();
            btn.innerHTML = result.success ? '<i class="fas fa-check"></i> Sauvegardé' : '<i class="fas fa-times"></i> Erreur';
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Sauvegarder';
                btn.disabled = false;
            }, 3000);
            if (!result.success) alert(result.message);
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
    if (!login || !pass) return alert("Veuillez remplir les champs");

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
                const appData = JSON.parse(result.dataJSON);
                for (let key in appData) {
                    localStorage.setItem(key, appData[key]);
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

            alert("Connexion réussie et progression restaurée !");
            window.location.reload();
        } else {
            document.getElementById('cloud-login-btn').innerHTML = 'Connexion';
            alert(result.message);
        }
    } catch (err) {
        document.getElementById('cloud-login-btn').innerHTML = 'Connexion';
        alert("Erreur de connexion Serveur.");
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

        const hash = await hashPassword(pw);
        try {
            let res = await fetch(SCRIPT_URL, {
                method: "POST",
                body: JSON.stringify({ action: "register", login: l, hash: hash, nom: n, prenom: p, classe: c })
            });
            let result = await res.json();

            btn.innerHTML = 'Créer la demande';
            alert(result.message);
            if (result.success) modal.remove();
        } catch (e) {
            btn.innerHTML = 'Créer la demande';
            alert("Erreur réseau");
        }
    });
}

// Lancement automatique du rendu
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", renderCloudUI);
} else {
    renderCloudUI();
}
