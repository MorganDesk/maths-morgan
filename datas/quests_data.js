export const QUEST_MODELS = [
    // --- QUÊTES DE DIVERSITÉ (Explorer le catalogue) ---
    {
        id: 'diversity_3',
        type: 'PLAY_X_GAMES',
        title: 'Explorateur en herbe',
        description: 'Jouer à 3 jeux différents',
        goal: 3,
        reward: 30
    },
    {
        id: 'diversity_5',
        type: 'PLAY_X_GAMES',
        title: 'Touche-à-tout',
        description: 'Jouer à 5 jeux différents',
        goal: 5,
        reward: 50
    },
    // --- QUÊTES DE GAIN DE MP ---
    {
        id: 'earn_50_mp',
        type: 'EARN_X_MP',
        title: 'Premiers pas',
        description: 'Gagner 50 MP au total',
        goal: 50,
        reward: 20
    },
    {
        id: 'earn_100_mp',
        type: 'EARN_X_MP',
        title: 'Foulée de Géant',
        description: 'Gagner 100 MP au total',
        goal: 100,
        reward: 40
    },
    {
        id: 'earn_150_mp',
        type: 'EARN_X_MP',
        title: 'Course vers l\'infini',
        description: 'Gagner 150 MP au total',
        goal: 150,
        reward: 70
    },
    // --- QUÊTES DE RÉPÉTITION (Entraînement ciblé) ---
    // --- Le Compte est Bon ---
    {
        id: 'repeat_compte_bon_facile',
        type: 'SPECIFIC_GAME',
        gameId: 'compte-bon',
        modeIndex: 0, 
        title: 'Premier tirage',
        description: 'Terminer 3 parties de "Le Compte est Bon" (Facile)',
        goal: 3,
        reward: 30
    },
    {
        id: 'repeat_compte_bon_normal',
        type: 'SPECIFIC_GAME',
        gameId: 'compte-bon',
        modeIndex: 1, 
        title: 'Stratège des nombres',
        description: 'Terminer 2 parties de "Le Compte est Bon" (Normal)',
        goal: 2,
        reward: 40
    },
    {
        id: 'repeat_compte_bon_extreme',
        type: 'SPECIFIC_GAME',
        gameId: 'compte-bon',
        modeIndex: 2, 
        title: 'Le Compte est Parfait',
        description: 'Terminer 1 partie de "Le Compte est Bon" (Extrême)',
        goal: 1,
        reward: 50
    },
    // --- Miroir Magique ---
    {
        id: 'repeat_miroir_axial',
        type: 'SPECIFIC_GAME',
        gameId: 'miroir-magique',
        modeIndex: 0,
        title: 'Reflet Cristallin',
        description: 'Compléter 3 figures de "Miroir Magique" (Axiale)',
        goal: 3,
        reward: 25
    },
    {
        id: 'repeat_miroir_central',
        type: 'SPECIFIC_GAME',
        gameId: 'miroir-magique',
        modeIndex: 1,
        title: 'Pivot de Précision',
        description: 'Compléter 3 figures de "Miroir Magique" (Centrale)',
        goal: 3,
        reward: 35
    },
    {
        id: 'repeat_miroir_melange',
        type: 'SPECIFIC_GAME',
        gameId: 'miroir-magique',
        modeIndex: 2,
        title: 'Kaléidoscope Maîtrisé',
        description: 'Compléter 3 figures de "Miroir Magique" (Mélange)',
        goal: 3,
        reward: 35
    },
    // --- Duel des Signes ---
    {
        id: 'repeat_relatifs_add',
        type: 'SPECIFIC_GAME',
        gameId: 'duel-des-signes',
        modeIndex: 0,
        title: 'Le Signe Amical',
        description: 'Terminer 3 parties du "Duel des Signes" (Addition (+))"',
        goal: 3,
        reward: 30
    },
    {
        id: 'repeat_relatifs_sub',
        type: 'SPECIFIC_GAME',
        gameId: 'duel-des-signes',
        modeIndex: 1, // Soustraction (-)
        title: 'Duel Négatif',
        description: 'Terminer 3 parties du "Duel des Signes" (Soustraction (-))"',
        goal: 3,
        reward: 30
    },
    {
        id: 'repeat_relatifs_addsub',
        type: 'SPECIFIC_GAME',
        gameId: 'duel-des-signes',
        modeIndex: 2, // Mélange (+/-)
        title: 'Valse des Signes',
        description: 'Terminer 2 parties du "Duel des Signes" (Mélange (+/-))"',
        goal: 2,
        reward: 30
    },
    {
        id: 'repeat_relatifs_mult',
        type: 'SPECIFIC_GAME',
        gameId: 'duel-des-signes',
        modeIndex: 3, // Multiplication (x)
        title: 'Puissance Relative',
        description: 'Terminer 2 parties du "Duel des Signes" (Multiplication (x))"',
        goal: 2,
        reward: 30
    },
    {
        id: 'repeat_relatifs_addsubmult',
        type: 'SPECIFIC_GAME',
        gameId: 'duel-des-signes',
        modeIndex: 4, // Mélange total (+/-/x)
        title: 'Maître du Chaos',
        description: 'Terminer 1 partie du "Duel des Signes" (Mélange total (+/-/x))"',
        goal: 1,
        reward: 30
    },
    // --- Multipli-Warrior ---
    {
        id: 'repeat_tables',
        type: 'SPECIFIC_GAME',
        gameId: 'multipli-warrior',
        title:  'Calculatrice Ambulante',
        description: 'Terminer 3 parties de "Multipli-Warrior"',
        goal: 3,
        reward: 30
    },

    // --- Angle Master ---
    {
        id: 'repeat_angle_master',
        type: 'SPECIFIC_GAME',
        gameId: 'angle-master',
        title: 'Sens Aiguisé',
        description: 'Terminer 2 parties de "Angle Master"',
        goal: 2,
        reward: 30
    },

    // --- Code Brisé ---
    {
        id: 'repeat_divisibilite',
        type: 'SPECIFIC_GAME',
        gameId: 'code-brise',
        title: 'Hacker',
        description: 'Terminer 2 parties de "Code Brisé"',
        goal: 2,
        reward: 30
    },

    // --- QUÊTES DE PERFORMANCE (Dépassement de soi) ---
    // --- Multipli-Warrior ---
    {
        id: 'score_tables_15',
        type: 'SCORE_REACHED',
        gameId: 'multipli-warrior',
        title: 'Recrue des Tables',
        description: 'Atteindre un score de 15+ à "Multipli-Warrior"',
        goal: 15,
        reward: 25
    },
    {
        id: 'score_tables_30',
        type: 'SCORE_REACHED',
        gameId: 'multipli-warrior',
        title: 'As des Tables',
        description: 'Réaliser un score de 30+ à "Multipli-Warrior"',
        goal: 30,
        reward: 60
    },

    // --- Duel des Signes ---
    // Mode Addition
    {
        id: 'score_relatifs_add_10',
        type: 'SCORE_REACHED',
        gameId: 'duel-des-signes',
        modeIndex: 0,
        title: 'Petit Positif',
        description: 'Réaliser un score de 10+ en "Duel des Signes" (Addition (+))',
        goal: 10,
        reward: 20
    },
    {
        id: 'score_relatifs_add_20',
        type: 'SCORE_REACHED',
        gameId: 'duel-des-signes',
        modeIndex: 0,
        title: 'Expert Positif',
        description: 'Réaliser un score de 20+ en "Duel des Signes" (Addition (+))',
        goal: 20,
        reward: 45
    },

    // Mode Soustraction
    {
        id: 'score_relatifs_sub_10',
        type: 'SCORE_REACHED',
        gameId: 'duel-des-signes',
        modeIndex: 1,
        title: 'Apprenti Négatif',
        description: 'Réaliser un score de 10+ en "Duel des Signes" (Soustraction (-))',
        goal: 10,
        reward: 25
    },
    {
        id: 'score_relatifs_sub_20',
        type: 'SCORE_REACHED',
        gameId: 'duel-des-signes',
        modeIndex: 1,
        title: 'Maître du Négatif',
        description: 'Réaliser un score de 20+ en "Duel des Signes" (Soustraction (-))',
        goal: 20,
        reward: 50
    },

    // Mode Mélange +/-
    {
        id: 'score_relatifs_addsub_10',
        type: 'SCORE_REACHED',
        gameId: 'duel-des-signes',
        modeIndex: 2,
        title: 'Équilibriste',
        description: 'Réaliser un score de 10+ en "Duel des Signes" (Mélange (+/-))',
        goal: 10,
        reward: 30
    },
    {
        id: 'score_relatifs_addsub_20',
        type: 'SCORE_REACHED',
        gameId: 'duel-des-signes',
        modeIndex: 2,
        title: 'Virtuose du +/-',
        description: 'Réaliser un score de 20+ en "Duel des Signes" (Mélange (+/-))',
        goal: 20,
        reward: 55
    },

    // Mode Multiplication
    {
        id: 'score_relatifs_mult_12',
        type: 'SCORE_REACHED',
        gameId: 'duel-des-signes',
        modeIndex: 3,
        title: 'Calculateur Relatif',
        description: 'Réaliser un score de 12+ en "Duel des Signes" (Multiplication (x))',
        goal: 12,
        reward: 30
    },
    {
        id: 'score_relatifs_mult_25',
        type: 'SCORE_REACHED',
        gameId: 'duel-des-signes',
        modeIndex: 3,
        title: 'Pro de la Multiplication',
        description: 'Réaliser un score de 25+ en "Duel des Signes" (Multiplication (x))',
        goal: 25,
        reward: 50
    },

    // Mode Mélange Total
    {
        id: 'score_relatifs_total_10',
        type: 'SCORE_REACHED',
        gameId: 'duel-des-signes',
        modeIndex: 4,
        title: 'Survivant du Chaos',
        description: 'Réaliser un score de 10+ en "Duel des Signes" (Mélange Total (+/-/x))',
        goal: 10,
        reward: 40
    },
    {
        id: 'score_relatifs_total_20',
        type: 'SCORE_REACHED',
        gameId: 'duel-des-signes',
        modeIndex: 4, 
        title: 'Infaillible',
        description: 'Réaliser un score de 20+ en "Duel des Signes" (Mélange Total (+/-/x))',
        goal: 20,
        reward: 75
    },

    // --- Angle Master ---
    {
        id: 'score_angle_master_5',
        type: 'SCORE_REACHED',
        gameId: 'angle-master',
        title: 'Coup d\'œil',
        description: 'Réaliser un score de 5+ en "Angle Master"',
        goal: 5,
        reward: 25
    },
    {
        id: 'score_angle_master_12',
        type: 'SCORE_REACHED',
        gameId: 'angle-master',
        title: 'L\'Oeil du Compas',
        description: 'Réaliser un score de 12+ en "Angle Master"',
        goal: 12,
        reward: 60
    },

    // --- Code Brisé ---
    {
        id: 'score_code_brise_6',
        type: 'SCORE_REACHED',
        gameId: 'code-brise',
        title: 'Petit Scanneur',
        description: 'Réaliser un score de 6+ en "Code Brisé"',
        goal: 6,
        reward: 30
    },
    {
        id: 'score_code_brise_10',
        type: 'SCORE_REACHED',
        gameId: 'code-brise',
        title: 'Briseur de Verrous',
        description: 'Réaliser un score de 10+ en "Code Brisé"',
        goal: 10,
        reward: 65
    }
    
];
