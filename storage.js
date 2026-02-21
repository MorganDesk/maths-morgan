// storage.js
const Storage = {
    getFavs: () => JSON.parse(localStorage.getItem('maths_morgan_favs')) || [],
    saveFavs: (favs) => localStorage.setItem('maths_morgan_favs', JSON.stringify(favs)),
    
    getStatuts: () => JSON.parse(localStorage.getItem('maths_morgan_statuts')) || {},
    saveStatuts: (statuts) => localStorage.setItem('maths_morgan_statuts', JSON.stringify(statuts)),
    
    getPlaylists: () => JSON.parse(localStorage.getItem('maths_morgan_playlists')) || {},
    savePlaylists: (pl) => localStorage.setItem('maths_morgan_playlists', JSON.stringify(pl)),

    getTheme: () => localStorage.getItem('theme') || 'light',
    setTheme: (theme) => localStorage.setItem('theme', theme)
};