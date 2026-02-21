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
	
	// Ajoutez ces deux-là pour la compatibilité avec tes fichiers actuels
    getItem: (key) => localStorage.getItem(key),
    setItem: (key, val) => localStorage.setItem(key, val)
};