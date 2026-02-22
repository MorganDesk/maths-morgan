// --- CONFIGURATION ---
const PALIERS_GRADES = [
    { seuil: 0,   nom: "Novice", couleur: "#475569" },         // Ardoise foncé
    { seuil: 20,  nom: "Apprenti", couleur: "#15803d" },       // Vert forêt
    { seuil: 50,  nom: "Initié", couleur: "#0369a1" },         // Bleu océan
    { seuil: 90,  nom: "Aventurier", couleur: "#1d4ed8" },     // Bleu électrique profond
    { seuil: 140, nom: "Expert", couleur: "#6d28d9" },         // Violet royal
    { seuil: 200, nom: "Maître", couleur: "#9d174d" },         // Bordeaux / Framboise
    { seuil: 270, nom: "Grand Maître", couleur: "#a16207" },   // Bronze / Ambre
    { seuil: 350, nom: "Érudit", couleur: "#9a3412" },         // Terre cuite / Cuivre
    { seuil: 430, nom: "Légende", couleur: "#991b1b" },        // Rouge brique
    { seuil: 500, nom: "Architecte de l'Infini", couleur: "#0f172a" } // Bleu-Noir sidéral
];

// --- CALCUL DU SCORE GLOBAL ---
function getGlobalMasteryLevel() {
    const categories = [
        // Relatifs
		'maths_morgan_highscore_relatifs_add',
		'maths_morgan_highscore_relatifs_sub',
		'maths_morgan_highscore_relatifs_addsub',
		'maths_morgan_highscore_relatifs_mult',
		'maths_morgan_highscore_relatifs_melange',
		// Compte est Bon
		'maths_morgan_record_cb_normal',
		'maths_morgan_record_cb_expert',
		// Symétrie
		'maths_morgan_record_sym_axial',
		'maths_morgan_record_sym_central',
		'maths_morgan_record_sym_melange',
		// Tables
		'maths_morgan_highscore_defi_tables',
		// Angles
		'maths_morgan_highscore_angles'
    ];

    const saturationMax = 50; // Points max qu'un seul mode peut rapporter

    const calculateWeightedScore = (s) => {
        if (s <= 0) return 0;
        // Formule : saturation * (score / (score + 15))
        // Un record de 15 donne 25 MP (la moitié du max du mode)
        // Un record de 45 donne 37.5 MP
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
function getProgressionData() {
    const mastery = getGlobalMasteryLevel();
    let actuel = PALIERS_GRADES[0];
    let suivant = null;
    let niveauPrestige = 0;

    for (let i = 0; i < PALIERS_GRADES.length; i++) {
        if (mastery >= PALIERS_GRADES[i].seuil) {
            actuel = PALIERS_GRADES[i];
            suivant = PALIERS_GRADES[i + 1] || null;
        }
    }

    let pourcentage = 0;
    if (suivant) {
        const plage = suivant.seuil - actuel.seuil;
        const avancee = mastery - actuel.seuil;
        pourcentage = (avancee / plage) * 100;
    } else {
        // Mode infini après 500 MP
        const depassement = mastery - 500;
        niveauPrestige = Math.floor(depassement / 50) + 1;
        pourcentage = ((depassement % 50) / 50) * 100;
    }

    return { actuel, suivant, pourcentage, mastery: mastery.toFixed(1), niveauPrestige };
}

// --- MISE À JOUR DE L'INTERFACE ---
function updateGlobalRankDisplay() {
    const data = getProgressionData();
    const container = document.getElementById('global-rank-container');
    if (!container) return;

    let messageEtape = "";
    if (data.suivant) {
        const reste = (data.suivant.seuil - parseFloat(data.mastery)).toFixed(1);
        messageEtape = `Encore <strong>${reste} MP</strong> pour devenir <strong>${data.suivant.nom}</strong>`;
    } else {
        messageEtape = `Félicitations ! Tu es au rang maximum. (Niveau Prestige ${data.niveauPrestige})`;
    }

    container.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 15px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); margin-bottom: 30px; border-left: 8px solid ${data.actuel.couleur};">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <div>
                    <div style="font-size: 0.75rem; text-transform: uppercase; color: #94a3b8; font-weight: 800; letter-spacing: 0.1em;">Ton Grade</div>
					<div style="font-size: 1.8rem; font-weight: 900; color: ${data.actuel.couleur}; text-shadow: 1px 1px 0px rgba(0,0,0,0.05);">${data.actuel.nom}</div>
				</div>
                <div style="text-align: right; background: #f8fafc; padding: 10px 15px; border-radius: 10px;">
                    <div style="font-size: 1.4rem; font-weight: 800; color: #1e293b;">${data.mastery} <span style="font-size: 0.8rem; color: #64748b;">MP</span></div>
                </div>
            </div>

            <div style="background: #f1f5f9; height: 18px; border-radius: 9px; overflow: hidden; position: relative; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);">
                <div style="background: ${data.actuel.couleur}; width: ${data.pourcentage}%; height: 100%; transition: width 1.2s cubic-bezier(0.22, 1, 0.36, 1);"></div>
            </div>

            <p style="text-align: center; margin-top: 12px; font-size: 0.9rem; color: #475569;">${messageEtape}</p>
        </div>
    `;
}