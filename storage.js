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
		let total = 0;
		
		// Tables
        total += parseInt(localStorage.getItem('maths_morgan_highscore_defi_tables')) || 0;
		// Angles
        total += parseInt(localStorage.getItem('maths_morgan_highscore_angles')) || 0;
        // Relatifs
		const modesRelatifs = ['add', 'sub', 'addsub', 'mult', 'melange'];
		modesRelatifs.forEach(mode => {
			total += parseInt(Storage.getItem(`maths_morgan_highscore_relatifs_${mode}`)) || 0;
		});
		// Compte est bon
		total += parseInt(Storage.getItem('maths_morgan_record_cb_normal')) || 0;
		total += parseInt(Storage.getItem('maths_morgan_record_cb_expert')) || 0;
		// Symétrie
		const modesSym = ['axial', 'central', 'melange'];
		modesSym.forEach(mode => {
			total += parseInt(Storage.getItem(`maths_morgan_record_sym_${mode}`)) || 0;
		});

        return total;
    }
};