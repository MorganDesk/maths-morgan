const gamesData = [
    {
        id: 'defi-des-tables',
        title: 'Défi des tables',
        matiere: 'Calcul mental',
        description: 'Plus rapide qu\'une calculatrice ? Pulvérise ton record de multiplications avant que le temps ne s\'écoule !',
        tags: ['calcul', 'multiplication', 'vitesse'],
        entryPoint: 'jeux/defi-des-tables.js' // Chemin vers le module du jeu
    },
    {
        id: 'choc-des-relatifs',
        title: 'Choc des Relatifs',
        matiere: 'Calcul mental',
        description: 'Signe moins ou signe plus ? Ne laisse pas les nombres négatifs te faire perdre pied dans ce duel acharné.',
        tags: ['addition', 'soustraction', 'multiplication', 'vitesse', 'relatifs'],
        modes: ['Addition (+)', 'Soustraction (-)', 'Mélange (+/-)', 'Multiplication (x)', 'Mélange total (+/-/x)'],
        entryPoint: 'jeux/choc-des-relatifs.js'
    },
    {
        id: 'compte-bon',
        title: 'Le Compte est Bon',
        matiere: 'Logique',
        description: 'Trouvez le nombre cible en utilisant les 6 plaques et les 4 opérations. Un casse-tête classique !',
        tags: ['logique', 'calcul', 'stratégie'],
        modes: ['Facile', 'Normal', 'Extrême'],
        entryPoint: 'jeux/compte-bon.js'
    }
];