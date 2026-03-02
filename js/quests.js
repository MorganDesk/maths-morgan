import { getActiveQuests, saveActiveQuests, getGameStats, addMP } from './storage.js';
import { QUEST_MODELS } from '../datas/quests_data.js';
import { gamesData } from '../datas/games_data.js';

let activeQuests = [];
const QUESTS_COLLAPSED_KEY = 'questsCollapsed'; // Key to store user's preference

function showQuestCompletedAnimation(title, reward) {
    const el = document.createElement('div');
    el.className = 'level-up-animation';
    el.innerHTML = `Quête Accomplie !<br><span style="font-size: 1.5rem; font-weight: normal;">${title} (+${reward} MP)</span>`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3500);
}

function generateNewQuests() {
    const selectedQuests = [];
    const availableQuests = [...QUEST_MODELS];

    const validQuests = availableQuests.filter(quest => {
        // For quests tied to a specific game mode.
        if (quest.gameId && quest.modeIndex !== undefined) {
            const game = gamesData.find(g => g.id === quest.gameId);
            if (!game) return false; // Game does not exist.

            // Case 1: The game has an explicit 'modes' array.
            if (game.modes) {
                return game.modes[quest.modeIndex] !== undefined;
            }
            
            // Case 2: The game has an implicit mode via 'coefficient' array.
            if (game.coefficient) {
                return game.coefficient[quest.modeIndex] !== undefined;
            }

            // If neither condition is met, the mode is invalid for this game.
            return false;
        }
        // For all other quests (not mode-specific), they are always valid.
        return true;
    });

    for (let i = 0; i < 3; i++) {
        if (validQuests.length === 0) break;
        const randomIndex = Math.floor(Math.random() * validQuests.length);
        const newQuest = { ...validQuests[randomIndex], progress: 0, completed: false };
        selectedQuests.push(newQuest);
        validQuests.splice(randomIndex, 1);
    }
    return selectedQuests;
}

// Specific update function for PLAY_X_GAMES quests
function updatePlayXGamesQuests() {
    const stats = getGameStats();
    const gamesPlayedCount = stats.gamesPlayedToday.length;
    let needsSave = false;

    activeQuests.forEach(quest => {
        if (quest.type === 'PLAY_X_GAMES' && !quest.completed) {
            quest.progress = gamesPlayedCount;
            if (quest.progress >= quest.goal) {
                quest.completed = true;
                addMP(quest.reward);
                showQuestCompletedAnimation(quest.title, quest.reward);
            }
            needsSave = true;
        }
    });
    return needsSave;
}

export function updateQuestProgression(gameId, modeIndex, score, mpGained) {
    if (!activeQuests) return;
    let needsRender = false;
    activeQuests.forEach(quest => {
        if (quest.completed) return;
        let progressMade = false;
        switch (quest.type) {
            case 'EARN_X_MP':
                quest.progress += mpGained;
                progressMade = true;
                break;
            case 'SPECIFIC_GAME':
                if (quest.gameId === gameId && (quest.modeIndex === undefined || quest.modeIndex === modeIndex)) {
                    quest.progress += 1;
                    progressMade = true;
                }
                break;
            case 'SCORE_REACHED':
                if (quest.gameId === gameId && (quest.modeIndex === undefined || quest.modeIndex === modeIndex)) {
                    if (score > quest.progress) {
                        quest.progress = score;
                        progressMade = true;
                    }
                }
                break;
        }

        if (progressMade) {
            needsRender = true; // Mark that a save and re-render is needed

            // Now, check if this progress also means completion
            if (quest.progress >= quest.goal && !quest.completed) {
                quest.completed = true;
                addMP(quest.reward);
                showQuestCompletedAnimation(quest.title, quest.reward);
            }
        }
    });

    if (needsRender) {
        saveActiveQuests(activeQuests);
        renderQuestsWidget();
    }
}

export function renderQuestsWidget() {
    const container = document.getElementById('quests-container');
    if (!container) return;

    const isCollapsed = localStorage.getItem(QUESTS_COLLAPSED_KEY) === 'true';

    if (!activeQuests || activeQuests.length === 0) {
        container.innerHTML = '<p>Aucune quête pour aujourd\'hui.</p>';
        return;
    }

    const questsListHTML = activeQuests.map(quest => {
        const progressPercent = Math.min((quest.progress / quest.goal) * 100, 100);
        return `
            <div class="card quest-card ${quest.completed ? 'completed' : ''}">
                <div class="quest-header">
                    <span class="quest-title">${quest.title}</span>
                    <span class="quest-reward">+${quest.reward} MP</span>
                </div>
                <p class="quest-description">${quest.description}</p>
                <div class="quest-progress-bar-container">
                    <div class="quest-progress-bar" style="width: ${progressPercent}%;"></div>
                </div>
                <span class="quest-progress-text">${quest.completed ? 'Terminé !' : `${quest.progress} / ${quest.goal}`}</span>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <div class="quest-widget-header">
            <h2>Quêtes du Jour</h2>
            <i class="fas fa-chevron-down"></i>
        </div>
        <div class="quests-list">
            ${questsListHTML}
        </div>
    `;

    const header = container.querySelector('.quest-widget-header');
    const list = container.querySelector('.quests-list');
    const icon = header.querySelector('i');

    if (isCollapsed) {
        list.classList.add('collapsed');
        icon.classList.add('collapsed');
    }

    header.addEventListener('click', () => {
        const currentlyCollapsed = list.classList.toggle('collapsed');
        icon.classList.toggle('collapsed');
        localStorage.setItem(QUESTS_COLLAPSED_KEY, currentlyCollapsed);
    });
}

export function checkDailyQuests() {
    const stats = getGameStats(); // Make sure we have latest stats
    const storedQuests = getActiveQuests();
    const lastQuestDate = localStorage.getItem('lastQuestDate');
    const today = new Date().toISOString().split('T')[0];
    let questsChanged = false;

    if (!storedQuests || lastQuestDate !== today) {
        activeQuests = generateNewQuests();
        localStorage.setItem('lastQuestDate', today);
        questsChanged = true;
    } else {
        activeQuests = storedQuests;
    }

    // Always check the progress for PLAY_X_GAMES quests as it depends on external state
    const playQuestsUpdated = updatePlayXGamesQuests();

    if (questsChanged || playQuestsUpdated) {
        saveActiveQuests(activeQuests);
    }

    renderQuestsWidget();
}
