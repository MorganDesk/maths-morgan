export const gamesData = [
    {
        id: 'defi-des-tables',
        title: 'Défi des tables',
        matiere: 'Calcul mental',
        description: 'Plus rapide qu\'une calculatrice ? Pulvérise ton record de multiplications avant que le temps ne s\'écoule !',
        tags: ['calcul', 'multiplication', 'vitesse'],
        entryPoint: 'jeux/defi-des-tables.js',
        baseMP: 5,
        coefficient: [1]
    },
    {
        id: 'choc-des-relatifs',
        title: 'Choc des Relatifs',
        matiere: 'Calcul mental',
        description: 'Signe moins ou signe plus ? Ne laisse pas les nombres négatifs te faire perdre pied dans ce duel acharné.',
        tags: ['addition', 'soustraction', 'multiplication', 'vitesse', 'relatifs'],
        modes: ['Addition (+)', 'Soustraction (-)', 'Mélange (+/-)', 'Multiplication (x)', 'Mélange total (+/-/x)'],
        entryPoint: 'jeux/choc-des-relatifs.js',
        baseMP: 5,
        coefficient: [1, 1.2, 1.5, 1.2, 2]
    },
    {
        id: 'compte-bon',
        title: 'Le Compte est Bon',
        matiere: 'Logique',
        description: 'Trouvez le nombre cible en utilisant les 6 plaques et les 4 opérations. Un casse-tête classique !',
        tags: ['logique', 'calcul', 'stratégie'],
        modes: ['Facile', 'Normal', 'Extrême'],
        entryPoint: 'jeux/compte-bon.js',
        baseMP: 5,
        coefficient: [1, 2, 5]
    },
    {
        id: 'miroir-magique',
        title: 'Miroir Magique',
        matiere: 'Géométrie',
        description: 'Reproduis la figure en utilisant la symétrie axiale ou centrale. Un test de précision et de vision géométrique !',
        tags: ['géométrie', 'symétrie', 'logique'],
        modes: ['Axiale', 'Centrale', 'Mélange'],
        entryPoint: 'jeux/miroir-magique.js',
        baseMP: 5,
        coefficient: [1, 1, 1.2]
    },
    {
        id: 'angle-master',
        title: 'Angle Master',
        matiere: 'Géométrie',
        description: 'Estime la mesure de l\'angle affiché à l\'œil nu. Prouve que tu as le compas dans l\'œil !',
        tags: ['géométrie', 'estimation', 'angles', 'degrés', 'vitesse'],
        entryPoint: 'jeux/angle-master.js',
        baseMP: 5,
        coefficient: [2.5]
    },
    {
        id: 'criteres-divisibilite',
        title: 'Critères de Divisibilité',
        matiere: 'Calcul mental',
        description: 'Ce nombre est-il divisible par 2, 3, 5, 9, 10 ? Coche les bonnes cases et montre ta maîtrise des critères de divisibilité.',
        tags: ['calcul', 'divisibilité', 'logique', 'vitesse'],
        entryPoint: 'jeux/divisibilite.js',
        baseMP: 5,
        coefficient: [2.5]
    }
];
