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

const SATURATION_MAX = 50;

function calculateMP(score) {
    if (score === 0) return 0;
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
    let currentGrade = PALIERS_GRADES[0];
    for (let i = PALIERS_GRADES.length - 1; i >= 0; i--) {
        if (totalMP >= PALIERS_GRADES[i].seuil) {
            currentGrade = PALIERS_GRADES[i];
            break;
        }
    }

    const nextGradeIndex = PALIERS_GRADES.indexOf(currentGrade) + 1;
    const nextGrade = nextGradeIndex < PALIERS_GRADES.length ? PALIERS_GRADES[nextGradeIndex] : null;

    let progression = {
        currentGrade: currentGrade,
        nextGrade: nextGrade,
        mpToNext: 0,
        percentage: 100
    };

    if (nextGrade) {
        const mpInCurrentTier = totalMP - currentGrade.seuil;
        const mpForNextTier = nextGrade.seuil - currentGrade.seuil;
        progression.mpToNext = nextGrade.seuil - totalMP;
        progression.percentage = (mpInCurrentTier / mpForNextTier) * 100;
    } 

    return progression;
}

function createProgressionWidget(totalMP, gradeInfo) {
    const widget = document.createElement('div');
    widget.id = 'progression-widget';
    widget.className = 'progression-widget';

    const mpToNextText = gradeInfo.nextGrade ? `<p>${gradeInfo.mpToNext.toFixed(1)} MP restants avant ${gradeInfo.nextGrade.nom}</p>` : '<p>Vous avez atteint le plus haut grade !</p>';

    widget.innerHTML = `
        <div class="grade-info">
            <h2 style="color: ${gradeInfo.currentGrade.couleur};">${gradeInfo.currentGrade.nom}</h2>
            <span>${Math.round(totalMP)} MP</span>
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
        widget.querySelector('.grade-info span').textContent = `${Math.round(totalMP)} MP`;
        widget.querySelector('.xp-bar').style.width = `${gradeInfo.percentage}%`;
        widget.querySelector('.xp-bar').style.backgroundColor = gradeInfo.currentGrade.couleur;
        const mpToNextText = gradeInfo.nextGrade ? `<p>${gradeInfo.mpToNext.toFixed(1)} MP restants avant ${gradeInfo.nextGrade.nom}</p>` : '<p>Vous avez atteint le plus haut grade !</p>';
        widget.querySelector('.mp-to-next').innerHTML = mpToNextText;
    }
    
    // Mettre à jour la couleur de la bordure
    widget.style.borderColor = gradeInfo.currentGrade.couleur;
}
