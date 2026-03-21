export const QUEST_MODELS = [
    // --- QUÊTES DE DIVERSITÉ (Explorer le catalogue) ---
    {
        id: 'diversity_3',
        type: 'PLAY_X_GAMES',
        title: 'L\'Aventurier Naissant',
        description: 'Jouer à 3 jeux différents',
        goal: 3,
        reward: 30
    },
    {
        id: 'diversity_5',
        type: 'PLAY_X_GAMES',
        title: 'Le Vagabond des Terres',
        description: 'Jouer à 5 jeux différents',
        goal: 5,
        reward: 50
    },
    // --- QUÊTES DE GAIN DE MP ---
    {
        id: 'earn_50_mp',
        type: 'EARN_X_MP',
        title: 'La Chasse au Butin',
        description: 'Gagner 50 MP au total',
        goal: 50,
        reward: 20
    },
    {
        id: 'earn_100_mp',
        type: 'EARN_X_MP',
        title: 'Le Trésor du Dragon',
        description: 'Gagner 100 MP au total',
        goal: 100,
        reward: 50
    },
    {
        id: 'earn_150_mp',
        type: 'EARN_X_MP',
        title: 'Roi du Royaume',
        description: 'Gagner 150 MP au total',
        goal: 150,
        reward: 80
    },
    // --- QUÊTES DE RÉPÉTITION (Entraînement ciblé) ---
    // --- Le Compte est Bon ---
    {
        id: 'repeat_compte_bon_facile',
        type: 'SPECIFIC_GAME',
        gameId: 'compte-bon',
        modeIndex: 0,
        title: 'Apprenti Alchimiste',
        description: 'Terminer 3 parties de "Le Compte est Bon" (Facile)',
        goal: 3,
        reward: 30
    },
    {
        id: 'repeat_compte_bon_normal',
        type: 'SPECIFIC_GAME',
        gameId: 'compte-bon',
        modeIndex: 1,
        title: 'Mage Transmutateur',
        description: 'Terminer 2 parties de "Le Compte est Bon" (Normal)',
        goal: 2,
        reward: 40
    },
    {
        id: 'repeat_compte_bon_extreme',
        type: 'SPECIFIC_GAME',
        gameId: 'compte-bon',
        modeIndex: 2,
        title: 'Sorcier Suprême',
        description: 'Terminer 1 partie de "Le Compte est Bon" (Extrême)',
        goal: 1,
        reward: 60
    },
    // --- Miroir Magique ---
    {
        id: 'repeat_miroir_axial',
        type: 'SPECIFIC_GAME',
        gameId: 'miroir-magique',
        modeIndex: 0,
        title: 'L\'Illusionniste',
        description: 'Compléter 3 figures de "Miroir Magique" (Axiale)',
        goal: 3,
        reward: 30
    },
    {
        id: 'repeat_miroir_central',
        type: 'SPECIFIC_GAME',
        gameId: 'miroir-magique',
        modeIndex: 1,
        title: 'L\'Œil du Cyclope',
        description: 'Compléter 3 figures de "Miroir Magique" (Centrale)',
        goal: 3,
        reward: 40
    },
    {
        id: 'repeat_miroir_melange',
        type: 'SPECIFIC_GAME',
        gameId: 'miroir-magique',
        modeIndex: 2,
        title: 'Le Maître des Runes',
        description: 'Compléter 2 figures de "Miroir Magique" (Mélange)',
        goal: 2,
        reward: 40
    },
    // --- Duel des Signes ---
    {
        id: 'repeat_relatifs_add',
        type: 'SPECIFIC_GAME',
        gameId: 'duel-des-signes',
        modeIndex: 0,
        title: 'Magie Blanche',
        description: 'Terminer 3 parties du "Duel des Signes" (Addition (+))',
        goal: 3,
        reward: 30
    },
    {
        id: 'repeat_relatifs_sub',
        type: 'SPECIFIC_GAME',
        gameId: 'duel-des-signes',
        modeIndex: 1,
        title: 'Magie Noire',
        description: 'Terminer 3 parties du "Duel des Signes" (Soustraction (-))',
        goal: 3,
        reward: 30
    },
    {
        id: 'repeat_relatifs_addsub',
        type: 'SPECIFIC_GAME',
        gameId: 'duel-des-signes',
        modeIndex: 2,
        title: 'Le Mage Gris',
        description: 'Terminer 2 parties du "Duel des Signes" (Mélange (+/-))',
        goal: 2,
        reward: 40
    },
    {
        id: 'repeat_relatifs_mult',
        type: 'SPECIFIC_GAME',
        gameId: 'duel-des-signes',
        modeIndex: 3,
        title: 'L\'Incantation de Multiplication',
        description: 'Terminer 2 parties du "Duel des Signes" (Multiplication (x))',
        goal: 2,
        reward: 40
    },
    {
        id: 'repeat_relatifs_addsubmult',
        type: 'SPECIFIC_GAME',
        gameId: 'duel-des-signes',
        modeIndex: 4,
        title: 'Seigneur du Chaos',
        description: 'Terminer 1 partie du "Duel des Signes" (Mélange total (+/-/x))',
        goal: 1,
        reward: 50
    },
    // --- Multipli-Warrior ---
    {
        id: 'repeat_tables',
        type: 'SPECIFIC_GAME',
        gameId: 'multipli-warrior',
        title: 'Guerrier à l\'Épée Courte',
        description: 'Terminer 3 parties de "Multipli-Warrior"',
        goal: 3,
        reward: 30
    },

    // --- Angle Master ---
    {
        id: 'repeat_angle_master',
        type: 'SPECIFIC_GAME',
        gameId: 'angle-master',
        title: 'L\'Archer Elfique',
        description: 'Terminer 2 parties de "Angle Master"',
        goal: 2,
        reward: 30
    },

    // --- Code Brisé ---
    {
        id: 'repeat_divisibilite',
        type: 'SPECIFIC_GAME',
        gameId: 'code-brise',
        title: 'Le Voleur de la Nuit',
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
        title: 'L\'Apprenti Forgeron',
        description: 'Terminer 3 parties de "Bâtisseur de Nombres" (Facile)',
        goal: 3,
        reward: 30
    },

    {
        id: 'repeat_batisseur_normal',
        type: 'SPECIFIC_GAME',
        gameId: 'batisseur-de-nombres',
        modeIndex: 1,
        title: 'Forgeron de Fer',
        description: 'Terminer 2 parties de "Bâtisseur de Nombres" (Normal)',
        goal: 2,
        reward: 40
    },

    {
        id: 'repeat_batisseur_extreme',
        type: 'SPECIFIC_GAME',
        gameId: 'batisseur-de-nombres',
        modeIndex: 2,
        title: 'Maître Forgeron Nain',
        description: 'Terminer 1 partie de "Bâtisseur de Nombres" (Extrême)',
        goal: 1,
        reward: 60
    },

    // --- Maître des Nombres ---
    {
        id: 'repeat_maitre_chiffre_entiers',
        type: 'SPECIFIC_GAME',
        gameId: 'maitre-des-nombres',
        modeIndex: 0,
        title: 'L\'Éclaireur Gobelin',
        description: 'Terminer 3 parties de "Maître des Nombres" (Chiffre (Entiers))',
        goal: 3,
        reward: 30
    },

    {
        id: 'repeat_maitre_nombre_entiers',
        type: 'SPECIFIC_GAME',
        gameId: 'maitre-des-nombres',
        modeIndex: 1,
        title: 'L\'Éclaireur Orc',
        description: 'Terminer 3 parties de "Maître des Nombres" (Nombre (Entiers))',
        goal: 3,
        reward: 30
    },

    {
        id: 'repeat_maitre_chiffre_decimaux',
        type: 'SPECIFIC_GAME',
        gameId: 'maitre-des-nombres',
        modeIndex: 2,
        title: 'L\'Éclaireur Elfe',
        description: 'Terminer 2 parties de "Maître des Nombres" (Chiffre (Décimaux))',
        goal: 2,
        reward: 40
    },

    {
        id: 'repeat_maitre_nombre_decimaux',
        type: 'SPECIFIC_GAME',
        gameId: 'maitre-des-nombres',
        modeIndex: 3,
        title: 'L\'Assassin Silencieux',
        description: 'Terminer 2 parties de "Maître des Nombres" (Nombre (Décimaux))',
        goal: 2,
        reward: 40
    },

    {
        id: 'repeat_maitre_nombre_melange',
        type: 'SPECIFIC_GAME',
        gameId: 'maitre-des-nombres',
        modeIndex: 4,
        title: 'Le Pisteur de Légende',
        description: 'Terminer 2 parties de "Maître des Nombres" (Mélange)',
        goal: 2,
        reward: 60
    },

<<<<<<< Updated upstream
=======
    // --- L'Ascenseur des Unités ---
    {
        id: 'repeat_ascenseur_longueurs',
        type: 'SPECIFIC_GAME',
        gameId: 'ascenseur-unites',
        modeIndex: 0,
        title: 'L\'Arpenteur Elfique',
        description: 'Terminer 2 parties de "L\'Ascenseur des Unités" (Longueurs)',
        goal: 2,
        reward: 30
    },
    {
        id: 'repeat_ascenseur_aires',
        type: 'SPECIFIC_GAME',
        gameId: 'ascenseur-unites',
        modeIndex: 1,
        title: 'Le Mappeur de Terres',
        description: 'Terminer 2 parties de "L\'Ascenseur des Unités" (Aires)',
        goal: 2,
        reward: 40
    },
    {
        id: 'repeat_ascenseur_masses',
        type: 'SPECIFIC_GAME',
        gameId: 'ascenseur-unites',
        modeIndex: 2,
        title: 'Le Marchand d\'Épices',
        description: 'Terminer 2 parties de "L\'Ascenseur des Unités" (Masses)',
        goal: 2,
        reward: 30
    },
    {
        id: 'repeat_ascenseur_capacites',
        type: 'SPECIFIC_GAME',
        gameId: 'ascenseur-unites',
        modeIndex: 3,
        title: 'L\'Alchimiste des Potions',
        description: 'Terminer 2 parties de "L\'Ascenseur des Unités" (Capacités)',
        goal: 2,
        reward: 30
    },
    {
        id: 'repeat_ascenseur_volumes',
        type: 'SPECIFIC_GAME',
        gameId: 'ascenseur-unites',
        modeIndex: 4,
        title: 'L\'Architecte Royal',
        description: 'Terminer 2 parties de "L\'Ascenseur des Unités" (Volumes)',
        goal: 2,
        reward: 50
    },

>>>>>>> Stashed changes
    // --- QUÊTES DE PERFORMANCE (Dépassement de soi) ---
    // --- Multipli-Warrior ---
    {
        id: 'score_tables_15',
        type: 'SCORE_REACHED',
        gameId: 'multipli-warrior',
        title: 'Héros de la Mêlée',
        description: 'Atteindre un score de 15+ à "Multipli-Warrior"',
        goal: 15,
        reward: 30
    },
    {
        id: 'score_tables_30',
        type: 'SCORE_REACHED',
        gameId: 'multipli-warrior',
        title: 'Dieu de la Guerre',
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
        title: 'Chevalier de Lumière',
        description: 'Réaliser un score de 10+ en "Duel des Signes" (Addition (+))',
        goal: 10,
        reward: 20
    },
    {
        id: 'score_relatifs_add_20',
        type: 'SCORE_REACHED',
        gameId: 'duel-des-signes',
        modeIndex: 0,
        title: 'Paladin Céleste',
        description: 'Réaliser un score de 20+ en "Duel des Signes" (Addition (+))',
        goal: 20,
        reward: 40
    },

    // Mode Soustraction
    {
        id: 'score_relatifs_sub_10',
        type: 'SCORE_REACHED',
        gameId: 'duel-des-signes',
        modeIndex: 1,
        title: 'Chasseur d\'Ombres',
        description: 'Réaliser un score de 10+ en "Duel des Signes" (Soustraction (-))',
        goal: 10,
        reward: 30
    },
    {
        id: 'score_relatifs_sub_20',
        type: 'SCORE_REACHED',
        gameId: 'duel-des-signes',
        modeIndex: 1,
        title: 'Seigneur des Ténèbres',
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
        title: 'L\'Équilibriste des Mondes',
        description: 'Réaliser un score de 10+ en "Duel des Signes" (Mélange (+/-))',
        goal: 10,
        reward: 40
    },
    {
        id: 'score_relatifs_addsub_20',
        type: 'SCORE_REACHED',
        gameId: 'duel-des-signes',
        modeIndex: 2,
        title: 'Gardien de la Balance',
        description: 'Réaliser un score de 20+ en "Duel des Signes" (Mélange (+/-))',
        goal: 20,
        reward: 60
    },

    // Mode Multiplication
    {
        id: 'score_relatifs_mult_12',
        type: 'SCORE_REACHED',
        gameId: 'duel-des-signes',
        modeIndex: 3,
        title: 'Sorcier de Poussière',
        description: 'Réaliser un score de 12+ en "Duel des Signes" (Multiplication (x))',
        goal: 12,
        reward: 40
    },
    {
        id: 'score_relatifs_mult_25',
        type: 'SCORE_REACHED',
        gameId: 'duel-des-signes',
        modeIndex: 3,
        title: 'Archimage de la Foudre',
        description: 'Réaliser un score de 25+ en "Duel des Signes" (Multiplication (x))',
        goal: 25,
        reward: 60
    },

    // Mode Mélange Total
    {
        id: 'score_relatifs_total_10',
        type: 'SCORE_REACHED',
        gameId: 'duel-des-signes',
        modeIndex: 4,
        title: 'Le Dompteur de Démons',
        description: 'Réaliser un score de 10+ en "Duel des Signes" (Mélange Total (+/-/x))',
        goal: 10,
        reward: 50
    },
    {
        id: 'score_relatifs_total_20',
        type: 'SCORE_REACHED',
        gameId: 'duel-des-signes',
        modeIndex: 4,
        title: 'Fléau des Monstres',
        description: 'Réaliser un score de 20+ en "Duel des Signes" (Mélange Total (+/-/x))',
        goal: 20,
        reward: 80
    },

    // --- Angle Master ---
    {
        id: 'score_angle_master_5',
        type: 'SCORE_REACHED',
        gameId: 'angle-master',
        title: 'Œil de Faucon',
        description: 'Réaliser un score de 5+ en "Angle Master"',
        goal: 5,
        reward: 30
    },
    {
        id: 'score_angle_master_12',
        type: 'SCORE_REACHED',
        gameId: 'angle-master',
        title: 'Le Maître Chasseur',
        description: 'Réaliser un score de 12+ en "Angle Master"',
        goal: 12,
        reward: 60
    },

    // --- Code Brisé ---
    {
        id: 'score_code_brise_6',
        type: 'SCORE_REACHED',
        gameId: 'code-brise',
        title: 'Crocheteur de Serrures',
        description: 'Réaliser un score de 6+ en "Code Brisé"',
        goal: 6,
        reward: 30
    },
    {
        id: 'score_code_brise_10',
        type: 'SCORE_REACHED',
        gameId: 'code-brise',
        title: 'Le Briseur de Sceaux',
        description: 'Réaliser un score de 10+ en "Code Brisé"',
        goal: 10,
        reward: 60
    },

    // --- Bâtisseur de Nombres ---
    // Mode Facile
    {
        id: 'score_batisseur_facile_7',
        type: 'SCORE_REACHED',
        gameId: 'batisseur-de-nombres',
        modeIndex: 0,
        title: 'Créateur d\'Épée',
        description: 'Réaliser un score de 7+ en "Bâtisseur de Nombres" (Facile)',
        goal: 7,
        reward: 30
    },
    {
        id: 'score_batisseur_facile_15',
        type: 'SCORE_REACHED',
        gameId: 'batisseur-de-nombres',
        modeIndex: 0,
        title: 'Artisan de Boucliers',
        description: 'Réaliser un score de 15+ en "Bâtisseur de Nombres" (Facile)',
        goal: 15,
        reward: 50
    },

    // Mode Normal
    {
        id: 'score_batisseur_normal_6',
        type: 'SCORE_REACHED',
        gameId: 'batisseur-de-nombres',
        modeIndex: 1,
        title: 'Forgeron Runique',
        description: 'Réaliser un score de 6+ en "Bâtisseur de Nombres" (Normal)',
        goal: 6,
        reward: 40
    },
    {
        id: 'score_batisseur_normal_10',
        type: 'SCORE_REACHED',
        gameId: 'batisseur-de-nombres',
        modeIndex: 1,
        title: 'Créateur d\'Artefacts',
        description: 'Réaliser un score de 10+ en "Bâtisseur de Nombres" (Normal)',
        goal: 10,
        reward: 60
    },

    // Mode Extrême
    {
        id: 'score_batisseur_extreme_5',
        type: 'SCORE_REACHED',
        gameId: 'batisseur-de-nombres',
        modeIndex: 2,
        title: 'Forgeron Légendaire',
        description: 'Réaliser un score de 5+ en "Bâtisseur de Nombres" (Extrême)',
        goal: 5,
        reward: 50
    },
    {
        id: 'score_batisseur_extreme_10',
        type: 'SCORE_REACHED',
        gameId: 'batisseur-de-nombres',
        modeIndex: 2,
        title: 'Le Façonneur de Mondes',
        description: 'Réaliser un score de 10+ en "Bâtisseur de Nombres" (Extrême)',
        goal: 10,
        reward: 80
    },

    // --- Maître des Nombres ---
    // Mode Chiffre (Entiers)
    {
        id: 'score_maitre_chiffre_entiers_10',
        type: 'SCORE_REACHED',
        gameId: 'maitre-des-nombres',
        modeIndex: 0,
        title: 'Le Veilleur de Nuit',
        description: 'Réaliser un score de 10+ en "Maître des Nombres" (Chiffre (Entiers))',
        goal: 10,
        reward: 30
    },
    {
        id: 'score_maitre_chiffre_entiers_15',
        type: 'SCORE_REACHED',
        gameId: 'maitre-des-nombres',
        modeIndex: 0,
        title: 'Garde de la Cité',
        description: 'Réaliser un score de 15 en "Maître des Nombres" (Chiffre (Entiers))',
        goal: 15,
        reward: 50
    },

    // Mode Chiffre (Décimaux)
    {
        id: 'score_maitre_chiffre_decimaux_10',
        type: 'SCORE_REACHED',
        gameId: 'maitre-des-nombres',
        modeIndex: 2,
        title: 'L\'Oeil Écarlate',
        description: 'Réaliser un score de 10+ en "Maître des Nombres" (Chiffre (Décimaux))',
        goal: 10,
        reward: 40
    },
    {
        id: 'score_maitre_chiffre_entiers_15',
        type: 'SCORE_REACHED',
        gameId: 'maitre-des-nombres',
        modeIndex: 2,
        title: 'Sentinelle de Cristal',
        description: 'Réaliser un score de 15 en "Maître des Nombres" (Chiffre (Décimaux))',
        goal: 15,
        reward: 60
    },

    // Mode Nombre (Entiers)
    {
        id: 'score_maitre_nombre_entiers_7',
        type: 'SCORE_REACHED',
        gameId: 'maitre-des-nombres',
        modeIndex: 1,
        title: 'Fantassin Lourd',
        description: 'Réaliser un score de 7+ en "Maître des Nombres" (Nombre (Entiers))',
        goal: 7,
        reward: 40
    },
    {
        id: 'score_maitre_nombre_entiers_12',
        type: 'SCORE_REACHED',
        gameId: 'maitre-des-nombres',
        modeIndex: 1,
        title: 'Capitaine de la Garde',
        description: 'Réaliser un score de 12+ en "Maître des Nombres" (Nombre (Entiers))',
        goal: 12,
        reward: 60
    },
    // Mode Nombre (Décimaux)
    {
        id: 'score_maitre_nombre_decimaux_7',
        type: 'SCORE_REACHED',
        gameId: 'maitre-des-nombres',
        modeIndex: 3,
        title: 'Maître de la Guilde',
        description: 'Réaliser un score de 7+ en "Maître des Nombres" (Nombre (Décimaux))',
        goal: 7,
        reward: 50
    },
    {
        id: 'score_maitre_nombre_decimaux_12',
        type: 'SCORE_REACHED',
        gameId: 'maitre-des-nombres',
        modeIndex: 3,
        title: 'Seigneur Commandeur',
        description: 'Réaliser un score de 12+ en "Maître des Nombres" (Nombre (Décimaux))',
        goal: 12,
        reward: 80
    },
    // Mode Mélange
    {
        id: 'score_maitre_nombre_melange_8',
        type: 'SCORE_REACHED',
        gameId: 'maitre-des-nombres',
        modeIndex: 4,
        title: 'Marcheur de l\'Ombre',
        description: 'Réaliser un score de 8+ en "Maître des Nombres" (Mélange)',
        goal: 8,
        reward: 50
    },
    {
        id: 'score_maitre_nombre_melange_12',
        type: 'SCORE_REACHED',
        gameId: 'maitre-des-nombres',
        modeIndex: 4,
        title: 'L\'Œil Omniscient',
        description: 'Réaliser un score de 12+ en "Maître des Nombres" (Mélange)',
        goal: 12,
        reward: 80
<<<<<<< Updated upstream
=======
    },

    // --- L'Ascenseur des Unités ---
    {
        id: 'score_ascenseur_longueurs_8',
        type: 'SCORE_REACHED',
        gameId: 'ascenseur-unites',
        modeIndex: 0,
        title: 'Marcheur Agile',
        description: 'Réaliser un score de 8+ en "L\'Ascenseur des Unités" (Longueurs)',
        goal: 8,
        reward: 30
    },
    {
        id: 'score_ascenseur_longueurs_15',
        type: 'SCORE_REACHED',
        gameId: 'ascenseur-unites',
        modeIndex: 0,
        title: 'Maître des Distances',
        description: 'Réaliser un score de 15+ en "L\'Ascenseur des Unités" (Longueurs)',
        goal: 15,
        reward: 60
    },
    {
        id: 'score_ascenseur_aires_5',
        type: 'SCORE_REACHED',
        gameId: 'ascenseur-unites',
        modeIndex: 1,
        title: 'Seigneur du Fief',
        description: 'Réaliser un score de 5+ en "L\'Ascenseur des Unités" (Aires)',
        goal: 5,
        reward: 40
    },
    {
        id: 'score_ascenseur_aires_10',
        type: 'SCORE_REACHED',
        gameId: 'ascenseur-unites',
        modeIndex: 1,
        title: 'L\'Empereur des Surfaces',
        description: 'Réaliser un score de 10+ en "L\'Ascenseur des Unités" (Aires)',
        goal: 10,
        reward: 70
    },
    {
        id: 'score_ascenseur_masses_8',
        type: 'SCORE_REACHED',
        gameId: 'ascenseur-unites',
        modeIndex: 2,
        title: 'Poids Plume',
        description: 'Réaliser un score de 8+ en "L\'Ascenseur des Unités" (Masses)',
        goal: 8,
        reward: 30
    },
    {
        id: 'score_ascenseur_masses_15',
        type: 'SCORE_REACHED',
        gameId: 'ascenseur-unites',
        modeIndex: 2,
        title: 'Masse Immuable',
        description: 'Réaliser un score de 15+ en "L\'Ascenseur des Unités" (Masses)',
        goal: 15,
        reward: 60
    },
    {
        id: 'score_ascenseur_capacites_8',
        type: 'SCORE_REACHED',
        gameId: 'ascenseur-unites',
        modeIndex: 3,
        title: 'Buveur d\'Élixirs',
        description: 'Réaliser un score de 8+ en "L\'Ascenseur des Unités" (Capacités)',
        goal: 8,
        reward: 40
    },
    {
        id: 'score_ascenseur_capacites_15',
        type: 'SCORE_REACHED',
        gameId: 'ascenseur-unites',
        modeIndex: 3,
        title: 'Océan de Sagesse',
        description: 'Réaliser un score de 15+ en "L\'Ascenseur des Unités" (Capacités)',
        goal: 15,
        reward: 70
    },
    {
        id: 'score_ascenseur_volumes_5',
        type: 'SCORE_REACHED',
        gameId: 'ascenseur-unites',
        modeIndex: 4,
        title: 'Graveur Cristallin',
        description: 'Réaliser un score de 5+ en "L\'Ascenseur des Unités" (Volumes)',
        goal: 5,
        reward: 50
    },
    {
        id: 'score_ascenseur_volumes_10',
        type: 'SCORE_REACHED',
        gameId: 'ascenseur-unites',
        modeIndex: 4,
        title: 'Maître de la Dimension',
        description: 'Réaliser un score de 10+ en "L\'Ascenseur des Unités" (Volumes)',
        goal: 10,
        reward: 80
>>>>>>> Stashed changes
    }
];
