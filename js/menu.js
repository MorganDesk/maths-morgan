export function renderFilterMenu() {
    const filterMenu = document.getElementById('filter-menu');
    if (!filterMenu) {
        console.error("L'élément #filter-menu est introuvable. Le menu ne peut pas être affiché.");
        return;
    }

    // Levels and their specific icons
    const levels = ['Tous', '6e', '5e', '4e', '3e'];
    const levelIcons = {
        'Tous': 'fa-border-all',
        '6e': 'fa-shapes',
        '5e': 'fa-ruler-combined',
        '4e': 'fa-flask-vial',
        '3e': 'fa-atom'
    };

    // Create the main level filter items
    let menuItems = levels.map(level => `
        <li>
            <a href="#" class="filter-link${level === 'Tous' ? ' active' : ''}" data-level="${level}">
                <i class="fas ${levelIcons[level]}"></i>
                <span>${level}</span>
            </a>
        </li>
    `).join('');

    // Insert the 'Parcours' button right after the levels
    const parcoursItem = `
        <li>
            <a href="#" class="filter-link" data-level="Parcours">
                <i class="fas fa-layer-group"></i>
                <span>Parcours</span>
            </a>
        </li>
    `;

    // Add the 'Favoris' button at the end
    const favorisItem = `
        <li>
            <a href="#" class="filter-link" data-level="Favoris">
                <i class="fas fa-star"></i>
                <span>Mes Favoris</span>
            </a>
        </li>
    `;

    filterMenu.innerHTML = `<ul>${menuItems}${parcoursItem}${favorisItem}</ul>`;

    function setActiveFilter(level) {
        document.querySelectorAll('#filter-menu .filter-link').forEach(l => l.classList.remove('active'));
        const linkToActivate = document.querySelector(`#filter-menu .filter-link[data-level="${level}"]`);
        if (linkToActivate) {
            linkToActivate.classList.add('active');
        }
    }

    filterMenu.addEventListener('click', (event) => {
        const link = event.target.closest('.filter-link');
        if (!link) return;

        event.preventDefault();
        
        // Clear the URL hash to prevent being stuck
        history.pushState("", document.title, window.location.pathname + window.location.search);

        const level = link.dataset.level;
        setActiveFilter(level);

        const filterChangeEvent = new CustomEvent('filterChanged', { 
            detail: { level: level }
        });
        document.dispatchEvent(filterChangeEvent);
    });

    document.addEventListener('setActiveFilter', (event) => {
        const level = event.detail.level;
        setActiveFilter(level);
    });
}
