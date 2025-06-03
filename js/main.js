/**
 * @module main
 * @description The main entry point for the Life Visualized web application.
 * Imports and calls the UI setup function to initialize the application.
 *
 * Exports: None. Executes initialization logic upon loading.
 */

// Import the setup function from ui.js
import { setupEventListeners } from './ui.js';

/**
 * Initializes the application by setting up event listeners.
 */
function initializeApp() {
    // Delegate all UI setup and event binding to the ui.js module.
    setupEventListeners();
    console.log("Life Visualized App Initialized with Event Listeners.");
}

// Run the initialization function when the script loads and the DOM is ready.
// (Module scripts are deferred by default, so DOM should be ready)
initializeApp();
