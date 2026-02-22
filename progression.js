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
    { seuil: 440, nom: "Légende", couleur: "#991b1b" },        // Rouge brique
    { seuil: 540, nom: "Architecte de l'Infini", couleur: "#0f172a" } // Bleu-Noir sidéral
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
		'maths_morgan_highscore_angles',
		// Fractions équivalentes
		'maths_morgan_highscore_fractions_equiv',
		'maths_morgan_highscore_fractions_expert'
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

    // Détection sécurisée de la largeur
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const isMobile = width < 768;

    // --- STYLE DU CONTENEUR FIXE ---
    container.style.position = "fixed";
    container.style.top = isMobile ? "170px" : "125px"; 
    container.style.left = "0";
    container.style.width = "100%";
    container.style.zIndex = "1000";
    container.style.padding = "5px 10px";
    container.style.display = "flex";
    container.style.justifyContent = "center";
    container.style.pointerEvents = "none";

    // --- AJUSTEMENT DE LA ZONE DE JEUX ---
    // On cherche game-zone OU main-container pour décaler le contenu
    const gameZone = document.getElementById('game-zone') || document.getElementById('main-container');
    if (gameZone) {
        gameZone.style.marginTop = isMobile ? "60px" : "80px"; 
    }

    let messageEtape = "";
    if (data.suivant) {
        const reste = (data.suivant.seuil - parseFloat(data.mastery)).toFixed(1);
        messageEtape = isMobile ? `<strong>${reste} MP</strong> avant le rang suivant` : `Encore <strong>${reste} MP</strong> pour devenir <strong>${data.suivant.nom}</strong>`;
    } else {
        messageEtape = `Prestige : Niveau ${data.niveauPrestige}`;
    }

    container.innerHTML = `
        <div style="
            background: rgba(255, 255, 255, 0.95); 
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            padding: ${isMobile ? '5px 12px' : '10px 25px'}; 
            border-radius: ${isMobile ? '12px' : '30px'}; 
            box-shadow: 0 4px 15px rgba(0,0,0,0.15); 
            border: 2px solid ${data.actuel.couleur};
            width: 95%;
            max-width: 800px; 
            pointer-events: auto;
            display: flex;
            flex-direction: column;
            gap: ${isMobile ? '1px' : '4px'};
        ">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 6px;">
                    <div style="width: 8px; height: 8px; border-radius: 50%; background: ${data.actuel.couleur};"></div>
                    <span style="font-weight: 900; color: ${data.actuel.couleur}; font-size: ${isMobile ? '0.7rem' : '0.9rem'}; text-transform: uppercase;">
                        ${data.actuel.nom}
                    </span>
                </div>
                <div style="font-weight: 800; font-size: ${isMobile ? '0.8rem' : '1rem'}; color: #1e293b;">
                    ${data.mastery} <span style="font-size: 0.6rem; color: #94a3b8;">MP</span>
                </div>
            </div>

            <div style="background: #e2e8f0; height: ${isMobile ? '4px' : '7px'}; border-radius: 10px; overflow: hidden; width: 100%;">
                <div style="background: ${data.actuel.couleur}; width: ${data.pourcentage}%; height: 100%; transition: width 1s ease-out;"></div>
            </div>

            <div style="font-size: ${isMobile ? '0.55rem' : '0.7rem'}; color: #475569; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${messageEtape}
            </div>
        </div>
    `;
}