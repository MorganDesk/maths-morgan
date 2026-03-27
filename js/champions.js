import { getGameStats, getAuthData } from './storage.js';
import { getLeaderboardTabs } from './events.js';

// --- CONFIGURATION ---
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx0wVnHtP0NQWwUX9cMjzriBrRcfBba3reE5rvwuKsNJJB2j-xlBfQ3h5qg3XGo6McE/exec";
const CACHE_KEY = 'leaderboard_cache_';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

document.addEventListener('DOMContentLoaded', async () => {
    const periodFilters = document.querySelector('.leaderboard-tabs');
    const levelBtns = document.querySelectorAll('.level-btn');
    const contentArea = document.getElementById('leaderboard-content');

    let currentPeriod = 'global';
    let currentLevel = 'tous';
    let isEventMode = false;

    // --- 1. INITIALISATION DES ONGLETS DYNAMIQUES ---
    async function initTabs() {
        const auth = getAuthData();
        const studentClass = auth ? auth.classe : "tous";
        const eventTabs = await getLeaderboardTabs(studentClass);

        if (periodFilters && eventTabs) {
            eventTabs.forEach(tab => {
                const btn = document.createElement('button');
                btn.className = 'tab-btn';
                btn.dataset.period = tab.id;
                btn.dataset.isEvent = "true";
                btn.innerHTML = tab.title;
                periodFilters.appendChild(btn);
            });
        }

        // Réattacher les événements sur les nouveaux boutons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentPeriod = btn.dataset.period;
                isEventMode = btn.dataset.isEvent === "true";
                loadLeaderboard();
            });
        });
    }

    /**
     * Charge le classement depuis l'API Google (Temps Réel)
     */
    async function loadLeaderboard() {
        showLoading();
        try {
            // APPEL DIRECT SANS CACHE
            const action = isEventMode ? 'getEventLeaderboard' : 'getLeaderboard';
            const includeProf = document.getElementById('include-prof-cb')?.checked || false;
            const response = await fetch(SCRIPT_URL, {
                method: "POST",
                body: JSON.stringify({
                    action: action,
                    period: currentPeriod,
                    classe: currentLevel,
                    includeProf: includeProf
                })
            });
            const result = await response.json();

            if (result.success) {
                renderTable(result.data, currentPeriod);
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error("Erreur Leaderboard:", error);
            contentArea.innerHTML = `
                <div style="text-align: center; color: #ef4444; padding: 2rem;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 2rem;"></i><br>
                    Impossible de charger le classement.<br>
                    <small>${error.message}</small>
                </div>
            `;
        }
    }

    function showLoading() {
        contentArea.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i> Chargement des champions...
            </div>
        `;
    }

    function renderTable(data, period) {
        if (!data || data.length === 0) {
            contentArea.innerHTML = `
                <div style="text-align: center; color: #64748b; padding: 3rem;">
                    <i class="fas fa-ghost" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i><br>
                    <strong>Aucun champion pour le moment !</strong><br>
                    <small>Dès qu'un élève de cette catégorie marquera des points, il apparaîtra ici.</small>
                </div>
            `;
            return;
        }

        let html = `
            <table class="leaderboard-table">
                <thead>
                    <tr>
                        <th style="width: 60px;">Rang</th>
                        <th>Élève</th>
                        <th style="text-align: right;">Points</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.forEach((student, index) => {
            const rank = index + 1;
            let rankDisplay = rank;
            let rankClass = "";

            if (rank === 1) rankDisplay = '<i class="fas fa-crown rank-1"></i>';
            else if (rank === 2) rankDisplay = '<i class="fas fa-medal rank-2"></i>';
            else if (rank === 3) rankDisplay = '<i class="fas fa-medal rank-3"></i>';

            if (rank <= 3) rankClass = "top-3-rank";

            // Pour les événements, le score est déjà calculé côté serveur (différentiel)
            let mpValue = student.score;
            // Pour les périodes classiques, on garde l'ancienne logique
            if (!isEventMode) {
                if (period === 'global') mpValue = student.totalMp;
                else if (period === 'weekly') mpValue = student.weeklyMp;
                else if (period === 'monthly') mpValue = student.monthlyMp;
            }

            html += `
                <tr>
                    <td class="rank-cell ${rankClass}">${rankDisplay}</td>
                    <td>
                        <div class="user-cell">
                            ${student.isGroup ? 
                                `<div class="user-avatar" style="background:${getRandomColor(student.displayName)}; border-radius:8px;"><i class="fas fa-users"></i></div>` : 
                                `<div class="user-avatar" style="background:${getRandomColor(student.displayName)}">${student.displayName.charAt(0)}</div>`
                            }
                            <div>
                                <div class="user-name">${student.displayName}</div>
                                <div class="user-class">${student.classe}</div>
                            </div>
                        </div>
                    </td>
                    <td class="mp-cell">+ ${formatMP(mpValue)}</td>
                </tr>
            `;
        });

        html += `</tbody></table>`;
        contentArea.innerHTML = html;
    }

    function formatMP(num) {
        return (num || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    function getRandomColor(str) {
        const colors = ['#4f46e5', '#7c3aed', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];
        let hash = 0;
        for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
        return colors[Math.abs(hash) % colors.length];
    }

    // -- Event Listeners for Level Filters --
    levelBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            levelBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentLevel = btn.dataset.level;
            loadLeaderboard();
        });
    });

    const includeProfCb = document.getElementById('include-prof-cb');
    if (includeProfCb) {
        includeProfCb.addEventListener('change', () => loadLeaderboard());
    }

    // Initialisation
    await initTabs();
    loadLeaderboard();
});
