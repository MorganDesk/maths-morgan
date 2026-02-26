document.addEventListener('DOMContentLoaded', () => {
    const menuContainer = document.getElementById('filter-menu');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    const menuItems = [
        { id: 'tous', text: 'Tout', icon: 'fa-solid fa-infinity', href: 'index.html#tous' },
        { id: '6e', text: '6e', icon: 'fa-solid fa-shapes', href: 'index.html#6e' },
        { id: '5e', text: '5e', icon: 'fa-solid fa-ruler-combined', href: 'index.html#5e' },
        { id: '4e', text: '4e', icon: 'fa-solid fa-calculator', href: 'index.html#4e' },
        { id: '3e', text: '3e', icon: 'fa-solid fa-flask', href: 'index.html#3e' },
        { id: 'parcours', text: 'Parcours', icon: 'fa-solid fa-map-signs', href: 'index.html#parcours' },
        { id: 'favoris', text: 'Favoris', icon: 'fa-solid fa-star', href: 'index.html#favoris' },
        { id: 'jeux', text: 'Jeux', icon: 'fa-solid fa-gamepad', href: 'jeux.html' }
    ];

    // 1. Créer et injecter les boutons du menu
    menuItems.forEach(item => {
        const button = document.createElement('button');
        button.id = `filter-${item.id}`;
        button.className = 'file-button';
        button.dataset.filter = item.id;
        button.innerHTML = `<i class="${item.icon}"></i> ${item.text}`;
        menuContainer.appendChild(button);
    });

    // 2. Écouter l'événement pour définir le bouton actif
    document.addEventListener('setActiveFilter', (event) => {
        const filter = event.detail.filter;
        menuContainer.querySelectorAll('.file-button').forEach(btn => btn.classList.remove('active'));
        const activeButton = document.getElementById(`filter-${filter}`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    });

    // 3. Gérer les clics sur le menu pour la navigation/filtrage
    menuContainer.addEventListener('click', (event) => {
        const button = event.target.closest('.file-button');
        if (!button) return;

        event.preventDefault();
        const filter = button.dataset.filter;
        const targetItem = menuItems.find(item => item.id === filter);

        if (!targetItem) return;

        const isIndexPage = currentPage === 'index.html';
        const targetIsIndex = targetItem.href.startsWith('index.html');

        if (isIndexPage && targetIsIndex) {
            // Clic sur un filtre de la page d'accueil
            window.history.pushState({}, '', `#${filter}`);
            document.dispatchEvent(new CustomEvent('filterChange', { detail: { filter } }));
            document.dispatchEvent(new CustomEvent('setActiveFilter', { detail: { filter } }));
        } else {
            // Naviguer vers une autre page
            window.location.href = targetItem.href;
        }
    });
});
