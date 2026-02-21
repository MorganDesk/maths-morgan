// search.js
const SearchEngine = {
    // Fonction principale qui décide quelles données charger
    obtenirDonnees: (currentPage, searchTerm, currentLevel, favoris) => {
        
        // 1. RECHERCHE GLOBALE (Index + texte saisi)
        if ((currentPage === 'index.html' || currentPage === '') && searchTerm !== "") {
            return SearchEngine.agregatToutLeSite();
        }

        // 2. ARCHIVES (Local uniquement)
        if (currentPage.includes('archives.html')) {
            return (typeof donneesArchives !== 'undefined' ? donneesArchives : [])
                   .map(l => ({...l, niveauSource: "archives"}));
        }

        // 3. FAVORIS (Local aux favoris de tout le site)
        if (currentPage.includes('favoris.html')) {
            const tous = SearchEngine.agregatToutLeSite(true); // true inclut aussi les archives
            return tous.filter(l => favoris.includes(getLeconId(l, l.niveauSource)));
        }

        // 4. PAR DÉFAUT (Index sans recherche : Niveau actuel)
        const sourceMap = { 
            "6e": typeof lecons6e !== 'undefined' ? lecons6e : [], 
            "5e": typeof lecons5e !== 'undefined' ? lecons5e : [], 
            "4e": typeof lecons4e !== 'undefined' ? lecons4e : [], 
            "3e": typeof lecons3e !== 'undefined' ? lecons3e : [] 
        };
        return (sourceMap[currentLevel] || []).map(l => ({...l, niveauSource: currentLevel}));
    },

    // Utilitaire pour rassembler tous les niveaux
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

    // Applique le filtre textuel (Titre, Description, Matière) et le tri
    filtrerEtTrier: (data, searchTerm, currentSort) => {
        let result = data.filter(l => 
            l.titre.toLowerCase().includes(searchTerm) || 
            (l.desc && l.desc.toLowerCase().includes(searchTerm)) || 
            (l.matiere && l.matiere.toLowerCase().includes(searchTerm))
        );

        result.sort((a, b) => {
			if (currentSort === "recent") return new Date(b.date) - new Date(a.date);
			if (currentSort === "ancien") return new Date(a.date) - new Date(b.date); // Ajout de cette ligne
			if (currentSort === "alpha") return a.titre.localeCompare(b.titre);
			return new Date(a.date) - new Date(b.date);
		});

        return result;
    }
};