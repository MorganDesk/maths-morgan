import { getAuthData } from './storage.js';

// --- CONFIGURATION ---
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx0wVnHtP0NQWwUX9cMjzriBrRcfBba3reE5rvwuKsNJJB2j-xlBfQ3h5qg3XGo6McE/exec";
const EVENT_CACHE_KEY = 'maths_morgan_events';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

/**
 * Initialise le système d'événements au chargement de la page
 */
export async function initEvents() {
    console.log("🚀 [Events] Initialisation...");
    const auth = getAuthData();
    if (!auth || !auth.classe) {
        console.warn("⚠️ [Events] Aucun utilisateur connecté ou pas de classe définie.");
        return;
    }

    const events = await fetchActiveEvents(auth.classe);
    if (!events || events.length === 0) return;

    // ATTENTE : On s'assure que le widget de progression est bien rendu (max 2 secondes)
    let attempts = 0;
    const checkWidget = setInterval(() => {
        const widget = document.getElementById('progression-widget');
        attempts++;

        if (widget) {
            clearInterval(checkWidget);
            console.log("🏗️ [Events] Widget trouvé après " + (attempts * 100) + "ms. Injection...");
            renderEventBanners(events, widget);
        } else if (attempts > 20) {
            clearInterval(checkWidget);
            console.error("❌ [Events] Abandon : #progression-widget introuvable après 2s.");
        }
    }, 100);
}

/**
 * Récupère les événements actifs/terminés via l'API GAS avec gestion du cache
 */
async function fetchActiveEvents(studentClass) {
    const cached = localStorage.getItem(EVENT_CACHE_KEY);
    if (cached) {
        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
            // Filtrage ULTRA-SOUPLE : On ignore la casse et on normalise les formats (6e vs 6ème)
            const normalize = (s) => (s || "").toString().toLowerCase().trim().replace(/èm[ei]/, "e");
            const filtered = data.filter(ev => {
                const targetUser = (studentClass || "").toString().trim().toLowerCase();

                // 🃏 JOKER PROF : On affiche tout !
                if (targetUser === "prof") return true;

                const rawClass = (ev.targetClass || ev.target || ev.classe || "").toString().trim().toLowerCase();

                if (rawClass === "" || rawClass === "tous" || rawClass === "toutes" || rawClass === "all") return true;
                return rawClass === targetUser || rawClass.includes(targetUser) || targetUser.includes(rawClass);
            });

            console.log("📦 [Events] Cache : " + data.length + " totaux, " + filtered.length + " pour " + studentClass);

            // SI le cache est vide mais qu'on a déjà eu des événements par le passé, on peut choisir de forcer le rafraîchissement
            if (filtered.length > 0 || data.length > 0) return filtered;
            console.log("♻️ [Events] Cache vide ou expiré, rafraîchissement forcé...");
        }
    }

    try {
        console.log("🌐 [Events] Appel API Google pour " + studentClass + "...");
        const url = `${SCRIPT_URL}?action=getActiveEvents&classe=${encodeURIComponent(studentClass)}`;
        const response = await fetch(url);
        const result = await response.json();

        if (result.success) {
            console.log("✅ [Events] Reçu :", result.data);
            localStorage.setItem(EVENT_CACHE_KEY, JSON.stringify({
                timestamp: Date.now(),
                data: result.data
            }));
            return result.data;
        } else {
            console.error("❌ [Events] Erreur API :", result.message);
        }
    } catch (error) {
        console.error("❌ [Events] Échec de la connexion réseau :", error);
    }
    return [];
}

/**
 * Affiche les bannières d'événements sur le dashboard
 */
function renderEventBanners(events, container) {
    // Nettoyage : On ne prend que les événements réellement actifs (indépendants de la casse/espaces)
    const activeEvents = events.filter(ev => {
        const s = (ev.status || "").toString().trim().toLowerCase();
        return s === "actif";
    });

    console.log("🎨 [Events] Tentative de rendu de " + activeEvents.length + " bannières.");

    activeEvents.forEach(event => {
        if (document.getElementById(`event-banner-${event.id}`)) return;

        console.log("📍 [Events] Injection de la bannière : " + event.title);
        const banner = document.createElement('div');
        banner.id = `event-banner-${event.id}`;
        banner.className = 'event-banner-notification';

        const timeRemaining = calculateTimeRemaining(event.endDate);

        banner.innerHTML = `
            <div class="event-banner-icon">⚔️</div>
            <div class="event-banner-content">
                <div class="event-banner-title">ÉVÉNEMENT : ${event.title}</div>
                <div class="event-banner-desc">Cumule des points sur <strong>${event.gameId} (${event.gameMode})</strong> !</div>
                <div class="event-banner-timer" data-endtime="${event.endDate}">
                    Fini dans : ${timeRemaining}
                </div>
            </div>
            <a href="champions.html" class="event-banner-btn">Voir le défi</a>
        `;

        // Insertion en haut du widget
        container.prepend(banner);
        startLocalTimer(banner.querySelector('.event-banner-timer'));
    });
}

/**
 * Gère le compte à rebours sans appel API
 */
function startLocalTimer(element) {
    const endTime = new Date(element.dataset.endtime).getTime();

    const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = endTime - now;

        if (distance < 0) {
            clearInterval(timer);
            element.innerHTML = "Événement terminé !";
            return;
        }

        element.innerHTML = "Fini dans : " + calculateTimeRemaining(element.dataset.endtime);
    }, 60000);
}

function calculateTimeRemaining(endDate) {
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const diff = end - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}j ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}

/**
 * Utilisé par champions.js pour ajouter les onglets dynamiques
 */
export async function getLeaderboardTabs(studentClass) {
    const events = await fetchActiveEvents(studentClass);
    return events.map(ev => ({
        id: ev.id,
        title: ev.title + (ev.status === 'Actif' ? ' 🔥' : ' ⌛'),
        isEvent: true
    }));
}
