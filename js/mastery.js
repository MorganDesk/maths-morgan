import { getMastery, saveMastery } from './storage.js';

// Define the states, their text, and the cycle order
const masteryStates = {
    'm-undefined': { text: 'Maîtrise à définir', next: 'm-none' },
    'm-none': { text: 'Je ne sais pas faire', next: 'm-struggle' },
    'm-struggle': { text: 'J\'ai encore du mal', next: 'm-ok' },
    'm-ok': { text: 'Je sais faire', next: 'm-pro' },
    'm-pro': { text: 'Je maîtrise', next: 'm-undefined' }
};

/**
 * Creates the mastery evaluation element for a lesson.
 * @param {string} lessonId - The unique ID of the lesson.
 * @returns {HTMLElement} The created mastery element.
 */
export function createMasteryElement(lessonId) {
    const currentStatus = getMastery(lessonId);

    const masteryElement = document.createElement('div');
    masteryElement.classList.add('mastery-banner');

    // Function to update element's state and appearance
    function updateState(status) {
        const stateInfo = masteryStates[status];
        if (!stateInfo) return; // Should not happen

        // Remove old classes
        Object.keys(masteryStates).forEach(cls => masteryElement.classList.remove(cls));

        // Add new class and set text
        masteryElement.classList.add(status);
        masteryElement.textContent = stateInfo.text;
        masteryElement.dataset.status = status;
    }

    // Set initial state
    updateState(currentStatus);

    // Add click listener to cycle through states
    masteryElement.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevents the card click event if any
        const currentStatus = masteryElement.dataset.status;
        const nextStatus = masteryStates[currentStatus].next;
        
        // Update the element visually
        updateState(nextStatus);

        // Save the new state
        saveMastery(lessonId, nextStatus);
    });

    return masteryElement;
}
