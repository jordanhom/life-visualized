// js/main.js

// Import the setup function from ui.js
import { setupEventListeners } from './ui.js';

/**
 * Initializes the application.
 */
function initializeApp() {
    // Call the function that sets up all event listeners
    setupEventListeners();
    console.log("Life Visualized App Initialized with Event Listeners.");
}

// Run the initialization function when the script loads
initializeApp();
