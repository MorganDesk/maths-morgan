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
        matiere: 'Calcul mental',
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
        matiere: 'Arithmétique',
        description: 'Scanne le nombre ! Coche instantanément tous ses diviseurs (2, 3, 5, 9 ou 10) pour gagner.',
        tags: ['calcul', 'divisibilité', 'logique', 'vitesse'],
        entryPoint: 'jeux/divisibilite.js',
        baseMP: 5,
        coefficient: [2.5]
    },
    {
        id: 'batisseur-de-nombres',
        title: 'Bâtisseur de Nombres',
        matiere: 'Arithmétique',
        description: 'Décomposez le nombre cible en un produit de facteurs premiers en cliquant sur les bonnes tuiles avant la fin du temps imparti.',
        tags: ['calcul', 'arithmétique', 'nombres premiers', 'logique'],
        entryPoint: 'jeux/batisseur-de-nombres.js',
        baseMP: 5,
        coefficient: [1, 2, 4],
        modes: [
            { name: 'Facile' },
            { name: 'Normal' },
            { name: 'Extrême' }
        ]
    },
    {
        id: 'maitre-des-nombres',
        title: 'Maître des Nombres',
        matiere: 'Numération',
        description: 'Scanne le nombre ! Trouve les chiffres ou nombres correspondant à la question posée le plus rapidement !',
        tags: ['numération', 'vitesse', 'lecture', 'chiffre des', 'nombre de'],
        entryPoint: 'jeux/maitre-des-nombres.js',
        baseMP: 5,
        coefficient: [1, 1, 1.5, 1.5, 2.5],
        modes: [
            { name: 'Chiffre (Entiers)' },
            { name: 'Nombre (Entiers)' },
            { name: 'Chiffre (Décimaux)' },
            { name: 'Nombre (Décimaux)' },
            { name: 'Mélange' }
        ]
<<<<<<< Updated upstream
=======
    },
    {
        id: 'ascenseur-unites',
        title: 'L\'Ascenseur des Unités',
        description: 'Transforme les mètres en kilomètres et les litres en centilitres à toute vitesse !',
        matiere: "Grandeurs et mesures",
        tags: ['conversions', 'unités', 'grandeurs', 'mesures', 'vitesse'],
        entryPoint: 'jeux/ascenseur-unites.js',
        baseMP: 5,
        coefficient: [1, 1.5, 1, 1, 2],
        modes: [
            { name: 'Longueurs' },
            { name: 'Aires (m²)' },
            { name: 'Masses (g)' },
            { name: 'Capacités (L)' },
            { name: 'Volumes (m³)' }
        ]
>>>>>>> Stashed changes
    }
];
