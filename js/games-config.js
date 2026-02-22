// js/games-config.js
const GAMES_LIST = [
    {
        id: 'fractions-equivalentes',
        title: 'Chasse aux Fractions',
        category: 'Numération',
        description: 'Éclate les bulles équivalentes à la cible. Attention aux pièges !',
        tags: ['équivalence', 'proportions', 'fractions'],
        initFunction: 'chargerMenuFractions'
    },
    {
        id: 'numeration-position',
        title: 'Chiffre ou Nombre de...',
        category: 'Numération',
        description: 'Ne confonds plus la position et la quantité dans les nombres décimaux.',
        tags: ['décimaux', 'position', 'quantité'],
        initFunction: 'chargerMenuNumeration'
    },
    {
        id: 'divisibilite',
        title: 'Critères de Divisibilité',
        category: 'Arithmétique',
        description: 'Sélectionne tous les diviseurs valides pour le nombre affiché.',
        tags: ['multiples', 'diviseurs', 'calcul'],
        initFunction: 'chargerMenuDivisibilite'
    },
    {
        id: 'jeu-tables',
        title: 'Défi des Tables',
        category: 'Calcul Mental',
        description: 'Réponds le plus vite possible aux multiplications. 60s top chrono !',
        tags: ['tables', 'vitesse', 'multiplication'],
        initFunction: 'chargerMenuTables'
    },
    {
        id: 'jeu-compte-bon',
        title: 'Le Compte est Bon',
        category: 'Calcul Mental',
        description: 'Atteins le nombre cible en utilisant les opérations de base.',
        tags: ['priorités', 'opérations', 'stratégie'],
        initFunction: 'chargerMenuCompteBon'
    },
    {
        id: 'jeu-symetrie',
        title: 'Le Miroir Magique',
        category: 'Géométrie',
        description: 'Identifie ou complète des figures par symétrie axiale.',
        tags: ['symétrie', 'axes', 'géométrie'],
        initFunction: 'chargerMenuSymetrie'
    },
    {
        id: 'jeu-angles',
        title: 'Expert des Angles',
        category: 'Géométrie',
        description: 'Estime ou mesure des angles le plus précisément possible.',
        tags: ['degrés', 'angles', 'mesure'],
        initFunction: 'chargerMenuAngles'
    },
    {
        id: 'jeu-relatifs',
        title: 'Le Choc des Relatifs',
        category: 'Calcul Mental',
        description: 'Domine les nombres positifs et négatifs dans des duels rapides.',
        tags: ['relatifs', 'signes', 'somme'],
        initFunction: 'chargerMenuRelatifs'
    }
];