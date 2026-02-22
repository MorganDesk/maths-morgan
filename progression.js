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

    // --- CONFIGURATION DE LA BARRE FIXE ---
    container.style.position = "fixed";
    container.style.top = "120px"; // Se place sous votre header
    container.style.left = "0";
    container.style.width = "100%";
    container.style.zIndex = "999"; // Juste en dessous des éventuels menus d'alerte
    container.style.padding = "10px";
    container.style.display = "flex";
    container.style.justifyContent = "center";
    container.style.pointerEvents = "none"; // Important : permet de cliquer sur les jeux derrière

    // --- CORRECTION DU CHEVAUCHEMENT ---
    // On force le décalage de la zone de jeux pour qu'elle commence SOUS la barre
    const gameZone = document.getElementById('game-zone');
    if (gameZone) {
        gameZone.style.marginTop = "80px"; 
    }

    let messageEtape = "";
    if (data.suivant) {
        const reste = (data.suivant.seuil - parseFloat(data.mastery)).toFixed(1);
        messageEtape = `Encore <strong>${reste} MP</strong> pour <strong>${data.suivant.nom}</strong>`;
    } else {
        messageEtape = `Rang Maximum (Niveau Prestige ${data.niveauPrestige})`;
    }

    container.innerHTML = `
        <div style="
            background: rgba(255, 255, 255, 0.9); 
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            padding: 8px 18px; 
            border-radius: 30px; 
            box-shadow: 0 8px 20px rgba(0,0,0,0.12); 
            border: 2px solid ${data.actuel.couleur};
            width: 90%;
            max-width: 800px; 
            pointer-events: auto;
            display: flex;
            flex-direction: column;
            gap: 4px;
        ">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 12px; height: 12px; border-radius: 50%; background: ${data.actuel.couleur}; box-shadow: 0 0 8px ${data.actuel.couleur}66;"></div>
                    <span style="font-weight: 900; color: ${data.actuel.couleur}; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px;">
                        ${data.actuel.nom} ${data.niveauPrestige > 0 ? '✦' + data.niveauPrestige : ''}
                    </span>
                </div>
                <div style="font-weight: 800; font-size: 1rem; color: #1e293b;">
                    ${data.mastery} <span style="font-size: 0.7rem; color: #64748b; font-weight: 600;">MP</span>
                </div>
            </div>

            <div style="background: #e2e8f0; height: 6px; border-radius: 10px; overflow: hidden; width: 100%;">
                <div style="background: ${data.actuel.couleur}; width: ${data.pourcentage}%; height: 100%; transition: width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);"></div>
            </div>

            <div style="font-size: 0.7rem; color: #475569; text-align: center; letter-spacing: 0.2px;">
                ${messageEtape}
            </div>
        </div>
    `;
}