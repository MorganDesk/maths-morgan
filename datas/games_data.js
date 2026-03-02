export const gamesData = [
    {
        id: 'multipli-warrior',
        title: 'Multipli-Warrior',
        matiere: 'Calcul mental',
        description: 'Multiplie à la vitesse de l\'éclair ! Donne un maximum de bonnes réponses avant la fin du chrono.',
        tags: ['calcul', 'multiplication', 'vitesse'],
        entryPoint: 'jeux/defi-des-tables.js',
        baseMP: 5,
        coefficient: [1]
    },
    {
        id: 'duel-des-signes',
        title: 'Duel des Signes',
        matiere: 'Calcul mental',
        description: 'Maîtrise les nombres négatifs. Calcule le résultat en respectant la règle des signes avant la fin du chrono.',
        tags: ['addition', 'soustraction', 'multiplication', 'vitesse', 'relatifs'],
        entryPoint: 'jeux/choc-des-relatifs.js',
        baseMP: 5,
        coefficient: [1, 1.2, 1.5, 1.2, 2],
        modes: [
            { name: 'Addition (+)', settings: { operators: ['+'] } },
            { name: 'Soustraction (-)', settings: { operators: ['-'] } },
            { name: 'Mélange (+/-)', settings: { operators: ['+', '-'] } },
            { name: 'Multiplication (x)', settings: { operators: ['*'] } },
            { name: 'Mélange total (+/-/x)', settings: { operators: ['+', '-', '*'] } }
        ]
    },
    {
        id: 'compte-bon',
        title: 'Le Compte est Bon',
        matiere: 'Logique',
        description: 'Atteins le nombre cible ! Combine 6 plaques avec les 4 opérations sans utiliser deux fois le même nombre.',
        tags: ['logique', 'calcul', 'stratégie'],
        entryPoint: 'jeux/compte-bon.js',
        baseMP: 5,
        coefficient: [1, 2, 5],
        modes: [
            { name: 'Facile' },
            { name: 'Normal' },
            { name: 'Extrême' }
        ]
    },
    {
        id: 'miroir-magique',
        title: 'Miroir Magique',
        matiere: 'Géométrie',
        description: 'Dompte la symétrie ! Colorie les cases pour reproduire la figure par reflet axial ou central.',
        tags: ['géométrie', 'symétrie', 'logique'],
        entryPoint: 'jeux/miroir-magique.js',
        baseMP: 5,
        coefficient: [1, 1, 1.2],
        modes: [
            { name: 'Axiale' },
            { name: 'Centrale' },
            { name: 'Mélange' }
        ]
    },
    {
        id: 'angle-master',
        title: 'Angle Master',
        matiere: 'Géométrie',
        description: 'Devine la mesure de l\'angle ! Estime les degrés à l\'œil nu le plus précisément possible.',
        tags: ['géométrie', 'estimation', 'angles', 'degrés', 'vitesse'],
        entryPoint: 'jeux/angle-master.js',
        baseMP: 5,
        coefficient: [2.5]
    },
    {
        id: 'code-brise',
        title: 'Code Brisé',
        matiere: 'Calcul mental',
        description: 'Scanne le nombre ! Coche instantanément tous ses diviseurs (2, 3, 5, 9 ou 10) pour gagner.',
        tags: ['calcul', 'divisibilité', 'logique', 'vitesse'],
        entryPoint: 'jeux/divisibilite.js',
        baseMP: 5,
        coefficient: [2.5]
    }
];
