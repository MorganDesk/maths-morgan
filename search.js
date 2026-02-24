// search.js
const SearchEngine = {
    // Fonction principale qui décide quelles données charger
    obtenirDonnees: (currentPage, searchTerm, currentLevel, favoris) => {
        
        // 1. RECHERCHE GLOBALE (Index + texte saisi)
        if ((currentPage === 'index.html' || currentPage === '') && searchTerm !== "") {
            return SearchEngine.agregatToutLeSite();
        }

        // 2. ARCHIVES
        if (currentPage.includes('archives.html')) {
            return (typeof donneesArchives !== 'undefined' ? donneesArchives : [])
                   .map(l => ({...l, niveauSource: "archives"}));
        }

        // 3. FAVORIS
        if (currentPage.includes('favoris.html')) {
            const tous = SearchEngine.agregatToutLeSite(true);
            return tous.filter(l => favoris.includes(getLeconId(l, l.niveauSource)));
        }

        // 4. PAR DÉFAUT (Niveau actuel)
        const sourceMap = { 
            "6e": typeof lecons6e !== 'undefined' ? lecons6e : [], 
            "5e": typeof lecons5e !== 'undefined' ? lecons5e : [], 
            "4e": typeof lecons4e !== 'undefined' ? lecons4e : [], 
            "3e": typeof lecons3e !== 'undefined' ? lecons3e : []
        };
        return (sourceMap[currentLevel] || []).map(l => ({...l, niveauSource: currentLevel}));
    },

    // Agrège toutes les leçons de tous les niveaux
    agregatToutLeSite: (inclureArchives = false) => {
        const data = [
            ...(typeof lecons6e !== 'undefined' ? lecons6e.map(l => ({...l, niveauSource: "6e"})) : []),
            ...(typeof lecons5e !== 'undefined' ? lecons5e.map(l => ({...l, niveauSource: "5e"})) : []),
            ...(typeof lecons4e !== 'undefined' ? lecons4e.map(l => ({...l, niveauSource: "4e"})) : []),
            ...(typeof lecons3e !== 'undefined' ? lecons3e.map(l => ({...l, niveauSource: "3e"})) : [])
        ];
        if (inclureArchives && typeof donneesArchives !== 'undefined') {
            data.push(...donneesArchives.map(l => ({...l, niveauSource: "archives"})));
        }
        return data;
    },

    // --- LA FONCTION MISE À JOUR AVEC LES TAGS ---
    filtrerEtTrier: (data, searchTerm, currentSort) => {
        const term = searchTerm.toLowerCase().trim();
        
        let result = data.filter(l => {
            // On vérifie le titre, la description et la matière
            const inTitre = l.titre ? l.titre.toLowerCase().includes(term) : false;
            const inDesc = l.desc ? l.desc.toLowerCase().includes(term) : false;
            const inMatiere = l.matiere ? l.matiere.toLowerCase().includes(term) : false;
            
            // On vérifie dans le tableau des tags s'il existe
            const inTags = (l.tags && Array.isArray(l.tags)) 
                ? l.tags.some(tag => tag.toLowerCase().includes(term)) 
                : false;

            return inTitre || inDesc || inMatiere || inTags;
        });

        // Tri des résultats
        result.sort((a, b) => {
            if (currentSort === "alpha") return a.titre.localeCompare(b.titre);
            if (currentSort === "ancien") return new Date(a.date) - new Date(b.date);
            return new Date(b.date) - new Date(a.date); // "recent" par défaut
        });

        return result;
    }
};