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

    // --- Bâtisseur de nombres ---
    {
        id: 'repeat_batisseur_facile',
        type: 'SPECIFIC_GAME',
        gameId: 'batisseur-de-nombres',
        modeIndex: 0,
        title: 'Ouvrier des nombres',
        description: 'Terminer 3 parties de "Bâtisseur de Nombres" (Facile)',
        goal: 3,
        reward: 30
    },

    {
        id: 'repeat_batisseur_normal',
        type: 'SPECIFIC_GAME',
        gameId: 'batisseur-de-nombres',
        modeIndex: 1,
        title: 'Batisseur de nombres',
        description: 'Terminer 3 parties de "Bâtisseur de Nombres" (Normal)',
        goal: 3,
        reward: 40
    },

    {
        id: 'repeat_batisseur_extreme',
        type: 'SPECIFIC_GAME',
        gameId: 'batisseur-de-nombres',
        modeIndex: 2,
        title: 'Architecte des nombres',
        description: 'Terminer 3 partie de "Bâtisseur de Nombres" (Extrême)',
        goal: 3,
        reward: 50
    },

    // --- Maître des Nombres ---
    {
        id: 'repeat_maitre_chiffre_entiers',
        type: 'SPECIFIC_GAME',
        gameId: 'maitre-des-nombres',
        modeIndex: '0',
        title: 'Unité retrouvée',
        description: 'Terminer 3 parties de "Maître des Nombres" (Chiffre (Entiers))',
        goal: 3,
        reward: 30
    },

    {
        id: 'repeat_maitre_nombre_entiers',
        type: 'SPECIFIC_GAME',
        gameId: 'maitre-des-nombres',
        modeIndex: '1',
        title: 'Dizaines gagnantes',
        description: 'Terminer 3 parties de "Maître des Nombres" (Nombre (Entiers))',
        goal: 3,
        reward: 30
    },

    {
        id: 'repeat_maitre_chiffre_decimaux',
        type: 'SPECIFIC_GAME',
        gameId: 'maitre-des-nombres',
        modeIndex: '2',
        title: 'TOP 0.1\%',
        description: 'Terminer 3 parties de "Maître des Nombres" (Chiffre (Décimaux))',
        goal: 3,
        reward: 50
    },

    {
        id: 'repeat_maitre_nombre_decimaux',
        type: 'SPECIFIC_GAME',
        gameId: 'maitre-des-nombres',
        modeIndex: '3',
        title: 'En plein dans le mille',
        description: 'Terminer 3 parties de "Maître des Nombres" (Nombre (Décimaux))',
        goal: 3,
        reward: 50
    },

    {
        id: 'repeat_maitre_nombre_melange',
        type: 'SPECIFIC_GAME',
        gameId: 'maitre-des-nombres',
        modeIndex: '4',
        title: 'Unité d\'élite',
        description: 'Terminer 2 parties de "Maître des Nombres" (Mélange)',
        goal: 2,
        reward: 70
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
    },

    // --- Bâtisseur de Nombres ---
    // Mode Facile
    {
        id: 'score_batisseur_facile_7',
        type: 'SCORE_REACHED',
        gameId: 'batisseur-de-nombres',
        modeIndex: '0',
        title: 'Bâtisseur débutant',
        description: 'Réaliser un score de 7+ en "Bâtisseur de Nombres" (Facile)',
        goal: 7,
        reward: 30
    },
    {
        id: 'score_batisseur_facile_15',
        type: 'SCORE_REACHED',
        gameId: 'batisseur-de-nombres',
        modeIndex: '0',
        title: 'Bâtisseur Amateur',
        description: 'Réaliser un score de 15+ en "Bâtisseur de Nombres" (Facile)',
        goal: 15,
        reward: 50
    },

    // Mode Normal
    {
        id: 'score_batisseur_normal_6',
        type: 'SCORE_REACHED',
        gameId: 'batisseur-de-nombres',
        modeIndex: '1',
        title: 'Bâtisseur Confirmé',
        description: 'Réaliser un score de 6+ en "Bâtisseur de Nombres" (Normal)',
        goal: 6,
        reward: 30
    },
    {
        id: 'score_batisseur_normal_10',
        type: 'SCORE_REACHED',
        gameId: 'batisseur-de-nombres',
        modeIndex: '1',
        title: 'Bâtisseur Expert',
        description: 'Réaliser un score de 10+ en "Bâtisseur de Nombres" (Normal)',
        goal: 10,
        reward: 50
    },

    // Mode Extrême
    {
        id: 'score_batisseur_extreme_5',
        type: 'SCORE_REACHED',
        gameId: 'batisseur-de-nombres',
        modeIndex: '2',
        title: 'Bâtisseur Master',
        description: 'Réaliser un score de 5+ en "Bâtisseur de Nombres" (Extrême)',
        goal: 5,
        reward: 40
    },
    {
        id: 'score_batisseur_extreme_10',
        type: 'SCORE_REACHED',
        gameId: 'batisseur-de-nombres',
        modeIndex: '2',
        title: 'Bâtisseur Extrême',
        description: 'Réaliser un score de 10+ en "Bâtisseur de Nombres" (Extrême)',
        goal: 10,
        reward: 70
    },
    
    // --- Maître des Nombres ---
    // Mode Chiffre (Entiers)
    {
        id: 'score_maitre_chiffre_entiers_10',
        type: 'SCORE_REACHED',
        gameId: 'maitre-des-nombres',
        modeIndex: '0',
        title: 'Débutant en chiffres',
        description: 'Réaliser un score de 10+ en "Maître des Nombres" (Chiffre (Entiers))',
        goal: 10,
        reward: 30
    },
    {
        id: 'score_maitre_chiffre_entiers_15',
        type: 'SCORE_REACHED',
        gameId: 'maitre-des-nombres',
        modeIndex: '0',
        title: 'Initié en chiffres',
        description: 'Réaliser un score de 15 en "Maître des Nombres" (Chiffre (Entiers))',
        goal: 15,
        reward: 50
    },

    // Mode Chiffre (Décimaux)
    {
        id: 'score_maitre_chiffre_decimaux_10',
        type: 'SCORE_REACHED',
        gameId: 'maitre-des-nombres',
        modeIndex: '2',
        title: 'Confirmé en chiffres',
        description: 'Réaliser un score de 10+ en "Maître des Nombres" (Chiffre (Décimaix))',
        goal: 10,
        reward: 30
    },
    {
        id: 'score_maitre_chiffre_entiers_15',
        type: 'SCORE_REACHED',
        gameId: 'maitre-des-nombres',
        modeIndex: '2',
        title: 'Expert en chiffres',
        description: 'Réaliser un score de 15 en "Maître des Nombres" (Chiffre (Décimaux))',
        goal: 15,
        reward: 50
    },

    // Mode Nombre (Entiers)
    {
        id: 'score_maitre_nombre_entiers_7',
        type: 'SCORE_REACHED',
        gameId: 'maitre-des-nombres',
        modeIndex: '1',
        title: 'Débutant en nombres',
        description: 'Réaliser un score de 7+ en "Maître des Nombres" (Nombre (Entiers))',
        goal: 7,
        reward: 40
    },
    {
        id: 'score_maitre_nombre_entiers_12',
        type: 'SCORE_REACHED',
        gameId: 'maitre-des-nombres',
        modeIndex: '1',
        title: 'Initié en nombres',
        description: 'Réaliser un score de 12+ en "Maître des Nombres" (Nombre (Entiers))',
        goal: 12,
        reward: 60
    },
    // Mode Nombre (Décimaux)
    {
        id: 'score_maitre_nombre_decimaux_7',
        type: 'SCORE_REACHED',
        gameId: 'maitre-des-nombres',
        modeIndex: '3',
        title: 'Confirmé en nombres',
        description: 'Réaliser un score de 7+ en "Maître des Nombres" (Nombre (Décimaux))',
        goal: 7,
        reward: 50
    },
    {
        id: 'score_maitre_nombre_decimaux_12',
        type: 'SCORE_REACHED',
        gameId: 'maitre-des-nombres',
        modeIndex: '3',
        title: 'Expert en nombres',
        description: 'Réaliser un score de 12+ en "Maître des Nombres" (Nombre (Décimaux))',
        goal: 12,
        reward: 70
    },
    // Mode Mélange
    {
        id: 'score_maitre_nombre_melange_8',
        type: 'SCORE_REACHED',
        gameId: 'maitre-des-nombres',
        modeIndex: '4',
        title: 'Mix \'n Match Amateur',
        description: 'Réaliser un score de 8+ en "Maître des Nombres" (Mélange)',
        goal: 8,
        reward: 40
    },
    {
        id: 'score_maitre_nombre_melange_12',
        type: 'SCORE_REACHED',
        gameId: 'maitre-des-nombres',
        modeIndex: '4',
        title: 'Mix \'n Match Expert',
        description: 'Réaliser un score de 12+ en "Maître des Nombres" (Mélange)',
        goal: 12,
        reward: 70
    }
];
