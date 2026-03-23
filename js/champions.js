import { getGameStats } from './storage.js';

// --- CONFIGURATION ---
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxPCaEX5-yxWkcLYBLXG94tOFi1M2jBNoxTcAVnXjY6iI6k_XptXeRWX7LQ4dg7JI8u/exec"; 
const CACHE_KEY = 'leaderboard_cache_';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const levelBtns = document.querySelectorAll('.level-btn');
    const contentArea = document.getElementById('leaderboard-content');

    let currentPeriod = 'global';
    let currentLevel = 'tous';

    /**
     * Charge le classement depuis le cache ou l'API Google
     */
    async function loadLeaderboard() {
        const cacheKey = `${CACHE_KEY}${currentPeriod}_${currentLevel}`;
        
        const cacheEntry = localStorage.getItem(cacheKey);
        if (cacheEntry) {
            const { timestamp, data } = JSON.parse(cacheEntry);
            if (Date.now() - timestamp < CACHE_DURATION) {
                renderTable(data, currentPeriod);
                return;
            }
        }

        showLoading();
        try {
            const url = `${SCRIPT_URL}?action=getLeaderboard&period=${currentPeriod}&classe=${currentLevel}`;
            const response = await fetch(url);
            const result = await response.json();

            if (result.success) {
                const cacheData = { timestamp: Date.now(), data: result.data };
                localStorage.setItem(cacheKey, JSON.stringify(cacheData));
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
                    <small>Dès qu'un élève de cette catégorie synchronisera ses points, il apparaîtra ici.</small>
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

            let mpValue = student.totalMp;
            if (period === 'weekly') mpValue = student.weeklyMp;
            if (period === 'monthly') mpValue = student.monthlyMp;

            html += `
                <tr>
                    <td class="rank-cell ${rankClass}">${rankDisplay}</td>
                    <td>
                        <div class="user-cell">
                            <div class="user-avatar">${student.displayName.charAt(0)}</div>
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
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentPeriod = btn.dataset.period;
            loadLeaderboard();
        });
    });

    levelBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            levelBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentLevel = btn.dataset.level;
            loadLeaderboard();
        });
    });

    loadLeaderboard();
});
