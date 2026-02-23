// --- CONFIGURATION ---
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

// --- CALCUL DU SCORE GLOBAL ---
function calculateTotalMasteryPoints() {
    const categories = [
		'maths_morgan_highscore_relatifs_add',
		'maths_morgan_highscore_relatifs_sub',
		'maths_morgan_highscore_relatifs_addsub',
		'maths_morgan_highscore_relatifs_mult',
		'maths_morgan_highscore_relatifs_melange',
		'maths_morgan_record_cb_normal',
		'maths_morgan_record_cb_expert',
		'maths_morgan_record_sym_axial',
		'maths_morgan_record_sym_central',
		'maths_morgan_record_sym_melange',
		'maths_morgan_highscore_defi_tables',
		'maths_morgan_highscore_angles',
		'maths_morgan_highscore_fractions_equiv',
		'maths_morgan_highscore_fractions_expert',
		'maths_morgan_highscore_num_chiffre',
		'maths_morgan_highscore_num_nombre',
		'maths_morgan_highscore_num_expert',
		'maths_morgan_highscore_divisibilite',
		'maths_morgan_highscore_bn_facile',
		'maths_morgan_highscore_bn_normal',
		'maths_morgan_highscore_bn_expert'
    ];

    const saturationMax = 50; 

    const calculateWeightedScore = (s) => {
        if (s <= 0) return 0;
        return saturationMax * (s / (s + 15)); 
    };

    let totalPoints = 0;
    categories.forEach(key => {
        const score = parseInt(Storage.getItem(key)) || 0;
        totalPoints += calculateWeightedScore(score);
    });

    return totalPoints;
}

// --- LOGIQUE DE PROGRESSION ---
function calculateMasteryData(totalPoints) {
    let actuel = PALIERS_GRADES[0];
    let suivant = null;
    let niveauPrestige = 0;

    for (let i = 0; i < PALIERS_GRADES.length; i++) {
        if (totalPoints >= PALIERS_GRADES[i].seuil) {
            actuel = PALIERS_GRADES[i];
            suivant = PALIERS_GRADES[i + 1] || null;
        }
    }

    let pourcentage = 0;
    let pointsRestants = 0;

    if (suivant) {
        const plage = suivant.seuil - actuel.seuil;
        const avancee = totalPoints - actuel.seuil;
        pourcentage = (avancee / plage) * 100;
        pointsRestants = Math.ceil(suivant.seuil - totalPoints);
    } else {
        // Mode prestige après le dernier grade (tous les 50 MP)
        const dernierSeuil = PALIERS_GRADES[PALIERS_GRADES.length - 1].seuil;
        const depassement = totalPoints - dernierSeuil;
        niveauPrestige = Math.floor(depassement / 50) + 1;
        pourcentage = ((depassement % 50) / 50) * 100;
        pointsRestants = Math.ceil(50 - (depassement % 50));
    }

    return { 
        mastery: totalPoints.toFixed(1), 
        actuel, 
        suivant, 
        pourcentage, 
        pointsRestants, 
        niveauPrestige 
    };
}

// --- MISE À JOUR DE L'INTERFACE ---
function updateGlobalRankDisplay() {
    const container = document.getElementById('rank-display-container');
    if (!container) return;

    const points = calculateTotalMasteryPoints();
    const data = calculateMasteryData(points);
    const isMobile = window.innerWidth <= 480;

    container.innerHTML = `
        <div class="rank-card-standard" style="
            padding: ${isMobile ? '12px' : '15px 25px'};
            display: flex;
            flex-direction: column;
            gap: 8px;
        ">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 12px; height: 12px; border-radius: 50%; background: ${data.actuel.couleur};"></div>
                    <span style="font-weight: 900; color: ${data.actuel.couleur}; font-size: ${isMobile ? '0.8rem' : '1rem'}; text-transform: uppercase;">
                        ${data.actuel.nom} ${data.niveauPrestige > 0 ? `(Prestige ${data.niveauPrestige})` : ''}
                    </span>
                </div>
                <div style="font-weight: 800; font-size: ${isMobile ? '1rem' : '1.2rem'}; color: var(--text-main);">
                    ${data.mastery} <span style="font-size: 0.7rem; color: var(--text-light);">MP</span>
                </div>
            </div>

            <div style="background: var(--border-color); height: ${isMobile ? '8px' : '12px'}; border-radius: 10px; overflow: hidden; width: 100%;">
                <div style="
                    background: ${data.actuel.couleur}; 
                    width: ${data.pourcentage}%; 
                    height: 100%; 
                    transition: width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
                "></div>
            </div>

            <div style="display: flex; justify-content: space-between; font-size: ${isMobile ? '0.65rem' : '0.75rem'}; font-weight: 700; color: var(--text-light);">
                ${data.suivant 
                    ? `<span>Prochain : <span style="color:var(--text-main)">${data.suivant.nom}</span></span>` 
                    : `<span>Mode Prestige Infini</span>`
                }
                <span>Encore <span style="color:${data.actuel.couleur}">${data.pointsRestants} MP</span></span>
            </div>
        </div>
    `;
}