import { getActiveQuests, saveActiveQuests, getGameStats, addMP } from './storage.js';
import { QUEST_MODELS } from '../datas/quests_data.js';
import { gamesData } from '../datas/games_data.js';
import { showToastQueue } from './toast.js';

// Active quests state contains both the array and metadata now
let activeQuestsState = { bonus_given_today: false, quests: [] };
const QUESTS_COLLAPSED_KEY = 'questsCollapsed'; // Key to store user's preference

function showQuestCompletedAnimation(title, reward) {
    showToastQueue(`<span>🏆 Quête accomplie : ${title} (+<strong>${reward} MP</strong>)</span>`);
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

    activeQuestsState.quests.forEach(quest => {
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
    if (!activeQuestsState || !activeQuestsState.quests) return;
    let needsRender = false;
    activeQuestsState.quests.forEach(quest => {
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

    if (activeQuestsState.quests.every(q => q.completed) && !activeQuestsState.bonus_given_today) {
        activeQuestsState.bonus_given_today = true;
        addMP(20);
        showToastQueue(`<span>🎁 <strong>Défi Quotidien Réussi !</strong> Bonus de +20 MP !</span>`);
        needsRender = true;
    }

    if (needsRender) {
        saveActiveQuests(activeQuestsState);
        renderQuestsWidget();
    }
}

export function renderQuestsWidget() {
    const container = document.getElementById('quests-container');
    if (!container) return;

    if (!activeQuestsState || !activeQuestsState.quests || activeQuestsState.quests.length === 0) {
        container.innerHTML = '<p>Aucune quête pour aujourd\'hui.</p>';
        return;
    }

    const questsListHTML = activeQuestsState.quests.map(quest => {
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

    let bonusMessage = '';
    if (activeQuestsState.bonus_given_today) {
        bonusMessage = `<div style="margin-top: 10px; padding: 10px; background: #dcfce7; color: #166534; border-radius: 8px; text-align: center; font-size: 0.9rem; border: 1px solid #bbf7d0;">
            🌟 <strong>Bonus Quotidien (+20 MP) Récupéré !</strong>
        </div>`;
    } else {
        bonusMessage = `<div style="margin-top: 10px; padding: 10px; background: #e0e7ff; color: #3730a3; border-radius: 8px; text-align: center; font-size: 0.9rem; border: 1px solid #c7d2fe;">
            🎁 Termine toutes tes quêtes pour gagner <strong>+20 MP Bonus</strong> !
        </div>`;
    }

    container.innerHTML = `
        <div class="quests-list">
            ${questsListHTML}
            ${bonusMessage}
        </div>
    `;
}

export function checkDailyQuests() {
    const stats = getGameStats(); // This automatically handles daily reset by setting activeQuests to null if day changed!
    const storedQuests = getActiveQuests();
    let questsChanged = false;

    if (!storedQuests || !storedQuests.quests || storedQuests.quests.length === 0) {
        activeQuestsState = {
            bonus_given_today: false,
            quests: generateNewQuests()
        };
        questsChanged = true;
    } else {
        activeQuestsState = storedQuests;
    }

    // Always check the progress for PLAY_X_GAMES quests as it depends on external state
    const playQuestsUpdated = updatePlayXGamesQuests();

    if (questsChanged || playQuestsUpdated) {
        saveActiveQuests(activeQuestsState);
    }

    renderQuestsWidget();
}
