/**
 * toast.js
 * Système de notifications "Toast" empilées (Carousel / Stack) en haut à droite.
 */

export function showToastQueue(messages) {
    let msgs = Array.isArray(messages) ? messages : [messages];
    msgs.forEach(m => createToastElement(m));
}

function createToastElement(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        // Styles globaux du conteneur en haut à droite
        Object.assign(container.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: '9999',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            pointerEvents: 'none'
        });
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerHTML = message;
    
    // Style en ligne pour fonctionner partout (admin.html, jeux.html, index.html)
    Object.assign(toast.style, {
        backgroundColor: '#2c3e50',
        color: '#ffffff',
        padding: '12px 20px',
        borderRadius: '8px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
        opacity: '0',
        transform: 'translateX(40px) scale(0.9)',
        transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
        pointerEvents: 'auto',
        maxWidth: '350px',
        wordWrap: 'break-word',
        borderLeft: '4px solid #3498db',
        fontSize: '0.95rem'
    });

    // Empilement: prepend ajoute la notification en haut de la liste
    container.prepend(toast); 

    // Force le rendu (reflow) pour déclencher l'animation
    void toast.offsetWidth;

    // Animation d'entrée
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0) scale(1)';

    // Chrono d'expiration
    setTimeout(() => {
        // Animation de sortie (Carousel: fondu vers le haut/droite)
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px) scale(0.9)';
        toast.style.marginTop = `-${toast.offsetHeight}px`; // Diminue l'espace pour remonter les suivants doucement
        toast.style.marginBottom = '0';
        
        setTimeout(() => toast.remove(), 400); // Nettoyage DOM
    }, 4000); // Affiche le toast pendant 4 secondes
}

window.showToastQueue = showToastQueue;
