// storage.js
const Storage = {
    getFavs: () => JSON.parse(localStorage.getItem('maths_morgan_favs')) || [],
    saveFavs: (favs) => localStorage.setItem('maths_morgan_favs', JSON.stringify(favs)),
    
    getStatuts: () => JSON.parse(localStorage.getItem('maths_morgan_statuts')) || {},
    saveStatuts: (statuts) => localStorage.setItem('maths_morgan_statuts', JSON.stringify(statuts)),
    
    getPlaylists: () => JSON.parse(localStorage.getItem('maths_morgan_playlists')) || {},
    savePlaylists: (pl) => localStorage.setItem('maths_morgan_playlists', JSON.stringify(pl)),

    getTheme: () => localStorage.getItem('theme') || 'light',
    setTheme: (theme) => localStorage.setItem('theme', theme),
	
	// Gestion des Highscores
    getHighscore: (jeuId) => {
        return localStorage.getItem(`maths_morgan_highscore_${jeuId}`) || 0;
    },
    saveHighscore: (jeuId, score) => {
        localStorage.setItem(`maths_morgan_highscore_${jeuId}`, score);
    },
	
	getItem: (key) => localStorage.getItem(key),
    setItem: (key, val) => localStorage.setItem(key, val),

    resetAllHighscores: () => {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('maths_morgan_highscore_')) {
                localStorage.removeItem(key);
            }
        });
    },
	
	getTotalRecords: () => {
        // On récupère chaque score proprement
        const tables = parseInt(localStorage.getItem('maths_morgan_highscore_defi_tables')) || 0;
        const angles = parseInt(localStorage.getItem('maths_morgan_highscore_angles')) || 0;
        
        // Pour les relatifs, on peut additionner le record du mode 'add' par défaut
        const relatifs = parseInt(localStorage.getItem('maths_morgan_highscore_relatifs_add')) || 0;

        return tables + angles + relatifs;
    }
};