import { getAllScores } from './storage.js';

const PALIERS_GRADES = [
    { seuil: 0,   nom: "Novice", couleur: "#475569" },
    { seuil: 20,  nom: "Apprenti", couleur: "#15803d" },
    { seuil: 50,  nom: "Initié", couleur: "#0369a1" },
    { seuil: 90,  nom: "Aventurier", couleur: "#1d4ed8" },
    { seuil: 140, nom: "Expert", couleur: "#6d28d9" },
    { seuil: 200, nom: "Maître", couleur: "#9d174d" },
    { seuil: 270, nom: "Grand Maître", couleur: "#a16207" },
    { seuil: 350, nom: "Érudit", couleur: "#9a3412" },
    { seuil: 440, nom: "Légende", couleur: "#991b1b" },
    { seuil: 540, nom: "Architecte de l'Infini", couleur: "#0f172a" }
];

const SATURATION_MAX = 60;

function calculateMP(score) {
    if (score === 0) return 0;
    // Utilise une courbe de saturation pour que chaque point de score rapporte de moins en moins de MP.
    // Atteint environ 46 MP pour un score de 150, se rapprochant de 50 sans jamais l'atteindre.
    return SATURATION_MAX * (score / (score + 15));
}

function calculateTotalMP() {
    const allScores = getAllScores();
    let totalMP = 0;
    for (const key in allScores) {
        totalMP += calculateMP(allScores[key]);
    }
    return totalMP;
}

function getCurrentGrade(totalMP) {
    const finalGrade = PALIERS_GRADES[PALIERS_GRADES.length - 1];

    // Gère les niveaux avant le prestige
    if (totalMP < finalGrade.seuil) {
        let currentGrade = PALIERS_GRADES[0];
        for (let i = PALIERS_GRADES.length - 1; i >= 0; i--) {
            if (totalMP >= PALIERS_GRADES[i].seuil) {
                currentGrade = PALIERS_GRADES[i];
                break;
            }
        }
        
        const nextGradeIndex = PALIERS_GRADES.indexOf(currentGrade) + 1;
        const nextGrade = PALIERS_GRADES[nextGradeIndex];

        const mpInCurrentTier = totalMP - currentGrade.seuil;
        const mpForNextTier = nextGrade.seuil - currentGrade.seuil;

        return {
            currentGrade: currentGrade,
            nextGrade: nextGrade,
            mpToNext: nextGrade.seuil - totalMP,
            percentage: (mpInCurrentTier / mpForNextTier) * 100
        };
    }

    // Gère les niveaux de prestige
    const prestigeBaseMP = totalMP - finalGrade.seuil; // MP gagnés après avoir atteint le dernier grade
    let prestigeLevel = 0;
    let costForNextLevel = 50; // Coût pour le Prestige 1
    let mpLeftForPrestigeCalc = prestigeBaseMP;

    // Calcule le niveau de prestige actuel
    while (mpLeftForPrestigeCalc >= costForNextLevel) {
        mpLeftForPrestigeCalc -= costForNextLevel;
        prestigeLevel++;
        costForNextLevel *= 2; // Double le coût pour le niveau suivant
    }

    const currentGradeName = prestigeLevel > 0 
        ? `${finalGrade.nom} (Prestige ${prestigeLevel})`
        : finalGrade.nom;
        
    // Calcule la progression vers le prochain niveau de prestige
    return {
        currentGrade: {
            nom: currentGradeName,
            couleur: finalGrade.couleur
        },
        nextGrade: {
            nom: `Prestige ${prestigeLevel + 1}`
        },
        mpToNext: costForNextLevel - mpLeftForPrestigeCalc,
        percentage: (mpLeftForPrestigeCalc / costForNextLevel) * 100
    };
}


function createProgressionWidget(totalMP, gradeInfo) {
    const widget = document.createElement('div');
    widget.id = 'progression-widget';
    widget.className = 'progression-widget';

    // Adapte le message pour le prestige
    const mpToNextText = gradeInfo.nextGrade 
        ? `<p>${gradeInfo.mpToNext.toFixed(1)} MP restants avant ${gradeInfo.nextGrade.nom}</p>` 
        : '<p>Vous avez atteint le plus haut grade !</p>';

    widget.innerHTML = `
        <div class="grade-info">
            <h2 style="color: ${gradeInfo.currentGrade.couleur};">${gradeInfo.currentGrade.nom}</h2>
            <span>${totalMP.toFixed(1)} MP</span>
        </div>
        <div class="xp-bar-container">
            <div class="xp-bar" style="width: ${gradeInfo.percentage}%; background-color: ${gradeInfo.currentGrade.couleur};"></div>
        </div>
        <div class="mp-to-next">
            ${mpToNextText}
        </div>
    `;
    return widget;
}

export function updateProgressionWidget() {
    const totalMP = calculateTotalMP();
    const gradeInfo = getCurrentGrade(totalMP);
    
    const progressionContainer = document.getElementById('progression-container');
    if (!progressionContainer) return;

    let widget = document.getElementById('progression-widget');
    if (!widget) {
        widget = createProgressionWidget(totalMP, gradeInfo);
        progressionContainer.innerHTML = ''; // Clear container before adding
        progressionContainer.appendChild(widget);
    } else {
        widget.querySelector('.grade-info h2').textContent = gradeInfo.currentGrade.nom;
        widget.querySelector('.grade-info h2').style.color = gradeInfo.currentGrade.couleur;
        widget.querySelector('.grade-info span').textContent = `${totalMP.toFixed(1)} MP`;
        widget.querySelector('.xp-bar').style.width = `${gradeInfo.percentage}%`;
        widget.querySelector('.xp-bar').style.backgroundColor = gradeInfo.currentGrade.couleur;
        const mpToNextText = gradeInfo.nextGrade 
            ? `<p>${gradeInfo.mpToNext.toFixed(1)} MP restants avant ${gradeInfo.nextGrade.nom}</p>` 
            : '<p>Vous avez atteint le plus haut grade !</p>';
        widget.querySelector('.mp-to-next').innerHTML = mpToNextText;
    }
    
    // Mettre à jour la couleur de la bordure
    widget.style.borderColor = gradeInfo.currentGrade.couleur;
}
