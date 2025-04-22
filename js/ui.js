// js/ui.js

// Import calculation functions
import { calculateCurrentAge, getRemainingExpectancy } from './calculator.js';
// Import BOTH grid rendering functions
import { renderAgeGrid, renderCalendarGrid } from './gridRenderer.js';

// --- DOM Element References ---
const form = document.getElementById('life-input-form');
const birthdateInput = document.getElementById('birthdate');
const sexInput = document.getElementById('sex');
const resultsArea = document.getElementById('results-area');
const gridContainer = document.getElementById('life-grid-container');
// Add references for view toggle radio buttons
const viewToggleRadios = document.querySelectorAll('input[name="viewType"]');

// --- State Variables ---
let currentView = 'age'; // Default view ('age' or 'calendar')
let lastCalcData = { // Store last calculation results to re-render on view change
    birthDate: null,
    totalLifespanYearsEst: null
};

/**
 * Renders the grid using the currently selected view type.
 */
function renderCurrentView() {
    if (!lastCalcData.birthDate || lastCalcData.totalLifespanYearsEst === null) {
        console.log("No calculation data available to render grid.");
        gridContainer.innerHTML = ''; // Clear grid if no data
        return;
    }

    // Clear previous grid content before rendering new view
    gridContainer.innerHTML = '';

    // Call the appropriate rendering function based on currentView state
    if (currentView === 'age') {
        renderAgeGrid(lastCalcData.birthDate, lastCalcData.totalLifespanYearsEst, gridContainer);
    } else if (currentView === 'calendar') {
        renderCalendarGrid(lastCalcData.birthDate, lastCalcData.totalLifespanYearsEst, gridContainer);
    } else {
        console.error("Unknown view type selected:", currentView);
        gridContainer.innerHTML = '<p class="error-message">Invalid view selected.</p>';
    }
}


/**
 * Handles the form submission, performs calculations, updates results, and renders the grid.
 * @param {Event} event - The form submission event.
 */
function handleCalculation(event) {
    event.preventDefault();
    const birthdateStr = birthdateInput.value;
    const sex = sexInput.value;
    resultsArea.innerHTML = '';
    // Clear previous calculation data
    lastCalcData.birthDate = null;
    lastCalcData.totalLifespanYearsEst = null;

    // --- Input Validation ---
    if (!birthdateStr || !sex) {
        resultsArea.innerHTML = '<p class="error-message">Please fill in both your birth date and sex.</p>';
        return;
     }
    const birthDate = new Date(birthdateStr);
    // IMPORTANT: Normalize date to UTC midnight to avoid timezone issues BEFORE storing/using
    birthDate.setMinutes(birthDate.getMinutes() + birthDate.getTimezoneOffset());
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Compare against today's midnight local (age calc is fine with this)
    // Re-check date validity after potential normalization
    if (isNaN(birthDate.getTime()) || birthDate >= now) {
        resultsArea.innerHTML = '<p class="error-message">Please enter a valid birth date in the past.</p>';
        return;
    }

    // --- Perform Calculations ---
    // calculateCurrentAge works fine with the normalized date object
    const currentAge = calculateCurrentAge(birthDate);
    const remainingYears = getRemainingExpectancy(currentAge, sex);
    if (remainingYears === null) {
        resultsArea.innerHTML = `<p class="error-message">Could not retrieve life expectancy data for the selected sex or age (${currentAge}). Please check the input.</p>`;
        return;
     }
    const totalEstimatedLifespan = parseFloat((currentAge + remainingYears).toFixed(1));

    // --- Store Calculation Results ---
    // Store the Date object that represents UTC midnight of the birthdate
    lastCalcData.birthDate = birthDate;
    lastCalcData.totalLifespanYearsEst = totalEstimatedLifespan;

    // --- Display Results ---
    resultsArea.innerHTML = `
        <p>Your current age: <strong>${currentAge} years</strong></p>
        <p>Estimated remaining lifespan (avg., based on US 2021 data): <strong>${remainingYears} years</strong></p>
        <p>Total estimated lifespan (avg.): <strong>${totalEstimatedLifespan} years</strong></p>
    `;

    // --- Render the Grid using the current view setting ---
    renderCurrentView(); // Call the function that decides which grid to render
}

/**
 * Handles changes to the view type radio buttons.
 * @param {Event} event - The change event from the radio button.
 */
function handleViewChange(event) {
    currentView = event.target.value; // Update the state variable
    console.log("View changed to:", currentView);
    // Re-render the grid with the new view setting, using stored calculation data
    renderCurrentView();
}

// --- Event Listeners Setup ---
function setupEventListeners() {
    if (form) {
        form.addEventListener('submit', handleCalculation);
    } else {
        console.error("Form element not found.");
    }

    // Add listeners to radio buttons
    viewToggleRadios.forEach(radio => {
        radio.addEventListener('change', handleViewChange);
    });

    // Set initial view based on checked radio (optional, belt-and-suspenders)
    const checkedRadio = document.querySelector('input[name="viewType"]:checked');
    if (checkedRadio) {
        currentView = checkedRadio.value;
    }
    console.log("Initial view set to:", currentView);
}

// Export setup function to be called by main.js
export { setupEventListeners };
