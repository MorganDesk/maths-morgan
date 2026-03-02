import { getTotalMP, addMP, getGameStats, updateStatsOnGameComplete, logPlayedGame } from './storage.js';
import { gamesData } from '../datas/games_data.js';
import { updateQuestProgression } from './quests.js'; // Import quest functionality

// --- Configuration des Rangs ---
const RANKS = [
    { name: 'Fer', minLevel: 0, className: 'rank-iron', icon: 'fa-shield-alt' },
    { name: 'Bronze', minLevel: 30, className: 'rank-bronze', icon: 'fa-medal' },
    { name: 'Argent', minLevel: 60, className: 'rank-silver', icon: 'fa-award' },
    { name: 'Or', minLevel: 90, className: 'rank-gold', icon: 'fa-trophy' },
    { name: 'Platine', minLevel: 120, className: 'rank-platinum', icon: 'fa-gem' },
    { name: 'Émeraude', minLevel: 150, className: 'rank-emerald', icon: 'fa-gem' },
    { name: 'Diamant', minLevel: 180, className: 'rank-diamond', icon: 'fa-gem' },
    { name: 'Maître', minLevel: 210, className: 'rank-master', icon: 'fa-crown' },
    { name: 'Grand Maître', minLevel: 240, className: 'rank-grandmaster', icon: 'fa-star' },
    { name: 'Challenger', minLevel: 270, className: 'rank-challenger', icon: 'fa-rocket' }
];

function getRank(level) {
    return RANKS.slice().reverse().find(rank => level >= rank.minLevel) || RANKS[0];
}

export function calculateGain(gameId, modeIndex, score) {
    const game = gamesData.find(g => g.id === gameId);
    if (!game) return 0;
    const baseMP = game.baseMP || 0;
    const coefficient = (game.coefficient && game.coefficient[modeIndex]) ? game.coefficient[modeIndex] : 1;
    return baseMP + Math.floor((score || 0) * coefficient);
}

function requiredMpForLevel(level) {
    return 5 * level * (level + 1);
}

export function getLevelInfo(totalMP) {
    let level = 0;
    while (totalMP >= requiredMpForLevel(level + 1)) {
        level++;
    }
    const mpForCurrentLevel = requiredMpForLevel(level);
    const mpForNextLevel = requiredMpForLevel(level + 1);
    const mpInCurrentLevel = totalMP - mpForCurrentLevel;
    const mpToNextLevel = mpForNextLevel - mpForCurrentLevel;
    const percentage = mpToNextLevel > 0 ? (mpInCurrentLevel / mpToNextLevel) * 100 : 100;
    const rank = getRank(level);

    return { level, mpInCurrentLevel, mpToNextLevel, percentage, rank };
}

function showMPGainAnimation(amount) {
    const el = document.createElement('div');
    el.textContent = `+${amount} MP`;
    el.className = 'mp-gain-animation';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
}

function showLevelUpAnimation(newLevel) {
    const el = document.createElement('div');
    el.textContent = `NIVEAU ${newLevel} !`;
    el.className = 'level-up-animation';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
}

async function animateProgression(startMP, gain) {
    const endMP = startMP + gain;
    const startInfo = getLevelInfo(startMP);
    const endInfo = getLevelInfo(endMP);

    const widget = document.getElementById('progression-widget');
    const xpBar = widget.querySelector('.xp-bar');
    const mpInfoEl = widget.querySelector('.mp-info span');
    const levelBadge = widget.querySelector('.level-badge');
    const rankIconEl = levelBadge.querySelector('.rank-icon');
    const levelTextEl = levelBadge.querySelector('span');

    const animationDuration = 800; 

    let currentMP = startInfo.mpInCurrentLevel;
    const finalMP = endInfo.mpInCurrentLevel;
    const mpIncrement = (gain) / (animationDuration / 16);

    const updateText = () => {
        if (startInfo.level < endInfo.level) return;
        currentMP += mpIncrement;
        if (currentMP < finalMP) {
            mpInfoEl.textContent = `${Math.floor(currentMP)} / ${startInfo.mpToNextLevel} MP`;
            requestAnimationFrame(updateText);
        } else {
            mpInfoEl.textContent = `${endInfo.mpInCurrentLevel} / ${endInfo.mpToNextLevel} MP`;
        }
    };
    
    if (startInfo.level === endInfo.level) {
        xpBar.style.transition = `width ${animationDuration}ms ease-out`;
        xpBar.style.width = `${endInfo.percentage}%`;
        requestAnimationFrame(updateText);
    } else {
        xpBar.style.transition = `width ${animationDuration / 2}ms linear`;
        xpBar.style.width = '100%';

        await new Promise(resolve => setTimeout(resolve, animationDuration / 2));

        for (let i = startInfo.level + 1; i <= endInfo.level; i++) {
            showLevelUpAnimation(i);
            const levelInfoForLevel = getLevelInfo(requiredMpForLevel(i));
            
            levelTextEl.textContent = `NIVEAU ${i}`;
            rankIconEl.className = `fas ${levelInfoForLevel.rank.icon} rank-icon`;
            widget.className = `progression-widget ${levelInfoForLevel.rank.className}`;

            xpBar.style.transition = 'none';
            xpBar.style.width = '0%';
            mpInfoEl.textContent = `0 / ${levelInfoForLevel.mpToNextLevel} MP`;
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        xpBar.style.transition = `width ${animationDuration / 2}ms linear`;
        xpBar.style.width = `${endInfo.percentage}%`;
        mpInfoEl.textContent = `${endInfo.mpInCurrentLevel} / ${endInfo.mpToNextLevel} MP`;
    }
    await new Promise(resolve => setTimeout(resolve, animationDuration));
}

export async function completeGame(gameId, modeIndex, score) {
    logPlayedGame(gameId); // FIX: Log the game played for the day

    const gain = calculateGain(gameId, modeIndex, score);
    if (gain <= 0) return false;

    const startMP = getTotalMP();
    addMP(gain);
    updateStatsOnGameComplete(gain);

    // Mettre à jour la progression des quêtes
    updateQuestProgression(gameId, modeIndex, score, gain);

    showMPGainAnimation(gain);
    await animateProgression(startMP, gain);
    updateProgressionWidget(); 

    const oldLevelInfo = getLevelInfo(startMP);
    const newLevelInfo = getLevelInfo(startMP + gain);
    return newLevelInfo.level > oldLevelInfo.level;
}

export function updateProgressionWidget() {
    const totalMP = getTotalMP();
    const levelInfo = getLevelInfo(totalMP);
    const stats = getGameStats();
    const progressionContainer = document.getElementById('progression-container');
    if (!progressionContainer) return;

    let widget = document.getElementById('progression-widget');
    if (!widget) {
        widget = document.createElement('div');
        widget.id = 'progression-widget';
        progressionContainer.innerHTML = '';
        progressionContainer.appendChild(widget);
    }

    widget.className = `progression-widget ${levelInfo.rank.className}`;
    widget.innerHTML = `
        <div class="progression-header">
            <div class="level-badge">
                <i class="fas ${levelInfo.rank.icon} rank-icon"></i>
                <span>NIVEAU ${levelInfo.level}</span>
            </div>
            <div class="rank-name">Rang : ${levelInfo.rank.name}</div>
        </div>
        <div class="xp-bar-container">
            <div class="xp-bar" style="width: ${levelInfo.percentage}%;"></div>
        </div>
        <div class="progression-body">
            <div class="mp-info">
                <span>${levelInfo.mpInCurrentLevel} / ${levelInfo.mpToNextLevel} MP</span>
            </div>
            <div class="stats-info">
                <span><i class="fas fa-gamepad"></i> Parties : ${stats.gamesPlayed}</span>
                <span><i class="fas fa-sun"></i> MP du jour : ${stats.mpToday}</span>
            </div>
        </div>
    `;
}
