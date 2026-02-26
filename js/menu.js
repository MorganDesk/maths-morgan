document.addEventListener('DOMContentLoaded', () => {
    const menuContainer = document.getElementById('filter-menu');

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

    // 1. Create and inject menu buttons
    menuItems.forEach(item => {
        const button = document.createElement('button');
        button.id = `filter-${item.id}`;
        button.className = 'file-button';
        button.dataset.filter = item.id;
        button.innerHTML = `<i class="${item.icon}"></i> ${item.text}`;
        menuContainer.appendChild(button);
    });

    // 2. Function to update the active button based on the current URL
    function updateActiveButton() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const currentHash = window.location.hash.replace('#', '');

        let activeFilterId = null;

        if (currentPage === 'jeux.html') {
            activeFilterId = 'jeux';
        } else if (currentPage === 'index.html') {
            // If there's a valid hash, use it. Otherwise, default to 'tous'.
            activeFilterId = menuItems.some(item => item.id === currentHash) ? currentHash : 'tous';
        }

        // Deactivate all buttons
        menuContainer.querySelectorAll('.file-button').forEach(btn => btn.classList.remove('active'));

        // Activate the correct button if an active filter was determined
        if (activeFilterId) {
            const activeButton = document.getElementById(`filter-${activeFilterId}`);
            if (activeButton) {
                activeButton.classList.add('active');
            }
        }
    }

    // 3. Handle menu clicks for navigation and filtering
    menuContainer.addEventListener('click', (event) => {
        const button = event.target.closest('.file-button');
        if (!button) return;

        event.preventDefault();
        const filter = button.dataset.filter;
        const targetItem = menuItems.find(item => item.id === filter);

        if (!targetItem) return;

        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const isIndexPage = currentPage === 'index.html';
        const targetIsIndex = targetItem.href.startsWith('index.html');

        if (isIndexPage && targetIsIndex) {
            // Internal navigation on the index page
            const newHash = targetItem.href.split('#')[1] || '';
            window.history.pushState({ filter }, '', `#${newHash}`);
            document.dispatchEvent(new CustomEvent('filterChange', { detail: { filter } }));
            updateActiveButton(); // Update button state immediately
        } else {
            // Navigate to a different page
            window.location.href = targetItem.href;
        }
    });

    // 4. Listen for browser back/forward navigation changes
    window.addEventListener('popstate', updateActiveButton);

    // 5. Set the initial active button on page load
    updateActiveButton();
});
