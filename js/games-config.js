// js/games-config.js
const GAMES_LIST = [
    {
        id: 'fractions-equivalentes',
        title: '🎯 Chasse aux Fractions',
        category: 'Numération',
        description: 'Deviens un as des proportions ! Éclate les bulles équivalentes à la fraction cible et évite les pièges. Rapidité et précision exigées !',
        tags: ['équivalence', 'proportions', 'fractions', 'simplifier', 'numérateur', 'dénominateur', 'partage', 'chasse', 'bulles'],
        initFunction: 'chargerMenuFractions'
    },
    {
        id: 'numeration-position',
        title: '💎 Le Maître du Chiffre',
        category: 'Numération',
        description: 'Dizaine ou dixième ? Ne te laisse plus piéger par la virgule et maîtrise la valeur de chaque chiffre sur le bout des doigts.',
        tags: ['décimaux', 'position', 'quantité', 'rang', 'virgule', 'unités', 'dizaines', 'centaines', 'millièmes', 'numération'],
        initFunction: 'chargerMenuNumeration'
    },
    {
        id: 'divisibilite',
        title: '⚡ L\'Éclair de Divisibilité',
        category: 'Arithmétique',
        description: '2, 3, 5, 9 ou 10 ? Scanne les nombres à la vitesse de l\'éclair et débusque tous leurs diviseurs cachés.',
        tags: ['multiples', 'diviseurs', 'calcul', 'arithmétique', 'critères', 'division', 'expert', 'nombres'],
        initFunction: 'chargerMenuDivisibilite'
    },
    {
        id: 'jeu-tables',
        title: '🚀 Défi des Tables',
        category: 'Calcul Mental',
        description: 'Plus rapide qu\'une calculatrice ? Pulvérise ton record de multiplications avant que le temps ne s\'écoule !',
        tags: ['tables', 'vitesse', 'multiplication', 'calcul', 'mental', 'chrono', 'défi', 'score'],
        initFunction: 'chargerMenuTables'
    },
    {
        id: 'jeu-compte-bon',
        title: '🧩 Le Compte est Bon',
        category: 'Calcul Mental',
        description: 'Le casse-tête ultime ! Combine tes nombres avec ruse pour atteindre la cible exacte. Chaque opération compte.',
        tags: ['priorités', 'opérations', 'stratégie', 'calcul', 'mental', 'addition', 'soustraction', 'multiplication', 'division', 'énigme'],
        initFunction: 'chargerMenuCompteBon'
    },
    {
        id: 'jeu-symetrie',
        title: '🪞 Le Miroir Magique',
        category: 'Géométrie',
        description: 'Plonge dans le monde des reflets ! Complète les figures par symétrie sans trembler et deviens un virtuose du dessin.',
        tags: ['symétrie', 'axes', 'géométrie', 'axial', 'central', 'miroir', 'repérage', 'espace', 'reflet', 'construction'],
        initFunction: 'chargerMenuSymetrie'
    },
    {
        id: 'jeu-angles',
        title: '📐 Angle Master',
        category: 'Géométrie',
        description: 'Développe ton radar interne ! Estime les degrés avec une précision chirurgicale pour devenir le maître des angles.',
        tags: ['degrés', 'angles', 'mesure', 'rapporteur', 'géométrie', 'aigu', 'obtus', 'droit', 'estimation', 'précision'],
        initFunction: 'chargerMenuAngles'
    },
    {
        id: 'jeu-relatifs',
        title: '⚔️ Le Choc des Relatifs',
        category: 'Calcul Mental',
        description: 'Signe moins ou signe plus ? Ne laisse pas les nombres négatifs te faire perdre pied dans ce duel acharné.',
        tags: ['relatifs', 'négatifs', 'positifs', 'calcul', 'mental', 'priorités', 'signes', 'addition', 'soustraction', 'multiplication'],
        initFunction: 'chargerMenuRelatifs'
    },
	{
		id: 'batisseur-nombres',
		title: '🏗️ Le Bâtisseur de Nombres',
		category: 'Arithmétique',
		description: 'Décompose les nombres en produits de facteurs premiers. Sois précis pour bâtir la tour la plus haute !',
		tags: ['arithmétique', 'nombres premiers', 'décomposition', 'facteurs', 'divisibilité', 'calcul'],
		initFunction: 'chargerMenuBatisseur'
	}
];