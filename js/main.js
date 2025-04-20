// Import the necessary UI elements and the handler function from ui.js
import { form, handleCalculation } from './ui.js';

/**
 * Initializes the application.
 * Currently, just attaches the event listener to the form.
 */
function initializeApp() {
    if (form) {
        form.addEventListener('submit', handleCalculation);
        console.log("Life Visualized App Initialized.");
    } else {
        console.error("Initialization failed: Form element not found.");
    }
}

// Run the initialization function when the script loads
initializeApp();
