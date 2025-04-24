/**
 * @module ui
 * @description Manages UI interactions, state, and orchestrates the application flow.
 * Connects user inputs (form, view toggle) to calculations and grid rendering.
 *
 * Exports: `setupEventListeners`.
 *
 * Manages `currentView` and `lastCalcData` state. Normalizes input birthdate to UTC
 * midnight before storing or passing to renderers.
 */

// Import calculation functions
import { calculateCurrentAge, getRemainingExpectancy } from './calculator.js';
// Import grid rendering functions
import { renderAgeGrid, renderCalendarGrid, renderMonthsGrid, renderYearsGrid } from './gridRenderer.js';

// --- DOM Element References (Cached for performance) ---
const form = document.getElementById('life-input-form');
const birthdateInput = document.getElementById('birthdate');
const sexInput = document.getElementById('sex');
const resultsArea = document.getElementById('results-area');
const gridContainer = document.getElementById('life-grid-container');
const viewToggleRadios = document.querySelectorAll('input[name="viewType"]');

// --- State Variables ---
// Tracks the currently selected grid view type
let currentView = 'age'; // Default view ('age', 'calendar', 'months', or 'years')
// Stores results of the last calculation to allow re-rendering on view change without recalculating
let lastCalcData = {
    birthDate: null, // Stores the UTC-normalized birthDate object
    totalLifespanYearsEst: null
};

/**
 * Renders the grid using the currently selected view type and stored calculation data.
 * Clears the grid container and calls the appropriate function from gridRenderer.js.
 */
function renderCurrentView() {
    // Ensure we have data from a previous calculation
    if (!lastCalcData.birthDate || lastCalcData.totalLifespanYearsEst === null) {
        console.log("No calculation data available to render grid.");
        gridContainer.innerHTML = ''; // Clear grid if no data
        // Ensure no view-specific classes remain if grid is empty
        gridContainer.classList.remove('grid-view-age', 'grid-view-calendar', 'grid-view-months', 'grid-view-years');
        return;
    }

    // Clear previous grid content before rendering new view
    gridContainer.innerHTML = '';
    // Update container class for potential view-specific CSS rules (e.g., block sizing/gap)
    gridContainer.classList.remove('grid-view-age', 'grid-view-calendar', 'grid-view-months', 'grid-view-years'); // Clear previous
    gridContainer.classList.add(`grid-view-${currentView}`); // Add current

    // Call the appropriate rendering function based on currentView state
    if (currentView === 'age') {
        renderAgeGrid(lastCalcData.birthDate, lastCalcData.totalLifespanYearsEst, gridContainer);
    } else if (currentView === 'calendar') {
        renderCalendarGrid(lastCalcData.birthDate, lastCalcData.totalLifespanYearsEst, gridContainer);
    } else if (currentView === 'months') {
        renderMonthsGrid(lastCalcData.birthDate, lastCalcData.totalLifespanYearsEst, gridContainer);
    } else if (currentView === 'years') {
        renderYearsGrid(lastCalcData.birthDate, lastCalcData.totalLifespanYearsEst, gridContainer);
    } else {
        console.error("Unknown view type selected:", currentView);
        gridContainer.innerHTML = '<p class="error-message">Invalid view selected.</p>';
    }
}


/**
 * Handles the form submission: validates input, performs calculations,
 * updates results display, stores data, and triggers the initial grid render.
 * @param {Event} event - The form submission event.
 */
function handleCalculation(event) {
    event.preventDefault(); // Prevent default form submission
    const birthdateStr = birthdateInput.value;
    const sex = sexInput.value;
    resultsArea.innerHTML = ''; // Clear previous results/errors

    // Clear previous calculation data before starting new calculation
    lastCalcData.birthDate = null;
    lastCalcData.totalLifespanYearsEst = null;

    // --- Input Validation ---
    if (!birthdateStr || !sex) {
        resultsArea.innerHTML = '<p class="error-message">Please fill in both your birth date and sex.</p>';
        renderCurrentView(); // Clear grid if validation fails
        return;
     }

    // Create Date object from input string
    const birthDateLocal = new Date(birthdateStr);

    // **CRITICAL: Normalize date to UTC midnight.**
    // The input 'YYYY-MM-DD' is parsed as local time midnight.
    // We adjust it by the timezone offset to get the Date object representing
    // midnight UTC on that calendar day. This ensures consistency when passing
    // the date to gridRenderer, which performs calculations in UTC.
    const birthDateUTC = new Date(birthDateLocal.getTime()); // Clone first
    birthDateUTC.setMinutes(birthDateUTC.getMinutes() + birthDateUTC.getTimezoneOffset());

    const now = new Date();
    // Use local 'now' for comparison, as user enters date relative to their local time.
    const nowLocalMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Check validity *after* potential normalization and ensure date is in the past.
    if (isNaN(birthDateUTC.getTime()) || birthDateUTC >= nowLocalMidnight) {
        resultsArea.innerHTML = '<p class="error-message">Please enter a valid birth date in the past.</p>';
        renderCurrentView(); // Clear grid if validation fails
        return;
    }

    // --- Perform Calculations ---
    // calculateCurrentAge works correctly with the UTC date object representing the birth day.
    const currentAge = calculateCurrentAge(birthDateUTC);
    const remainingYears = getRemainingExpectancy(currentAge, sex);

    if (remainingYears === null) {
        resultsArea.innerHTML = `<p class="error-message">Could not retrieve life expectancy data for the selected sex or age (${currentAge}). Please check the input.</p>`;
        renderCurrentView(); // Clear grid if calculation fails
        return;
     }
    // Calculate total lifespan, rounding for display might be slightly different than internal use
    const totalEstimatedLifespan = parseFloat((currentAge + remainingYears).toFixed(1));

    // --- Store Calculation Results ---
    // Store the UTC-normalized Date object and the calculated lifespan
    lastCalcData.birthDate = birthDateUTC;
    lastCalcData.totalLifespanYearsEst = totalEstimatedLifespan;

    // --- Display Results ---
    resultsArea.innerHTML = `
        <p>Your current age: <strong>${currentAge} years</strong></p>
        <p>Estimated remaining lifespan (avg., based on US 2021 data): <strong>${remainingYears} years</strong></p>
        <p>Total estimated lifespan (avg.): <strong>${totalEstimatedLifespan} years</strong></p>
    `;

    // --- Render the Grid ---
    // Use the currently selected view setting (or default 'age')
    renderCurrentView();
}

/**
 * Handles changes to the view type radio buttons. Updates the currentView state
 * and triggers a re-render of the grid using the stored calculation data.
 * @param {Event} event - The change event from the radio button.
 */
function handleViewChange(event) {
    currentView = event.target.value; // Update the state variable
    console.log("View changed to:", currentView);
    // Re-render the grid with the new view setting.
    // This uses the data stored in `lastCalcData`, avoiding recalculation.
    renderCurrentView();
}

/**
 * Sets up all necessary event listeners for the application UI.
 * Called once by main.js on initialization.
 */
function setupEventListeners() {
    // Attach listener to the main form
    if (form) {
        form.addEventListener('submit', handleCalculation);
    } else {
        console.error("Form element (#life-input-form) not found.");
    }

    // Attach listeners to all view toggle radio buttons
    if (viewToggleRadios.length > 0) {
        viewToggleRadios.forEach(radio => {
            radio.addEventListener('change', handleViewChange);
        });
    } else {
        console.error("View toggle radio buttons not found.");
    }


    // Set initial view state based on the default checked radio button in HTML
    const checkedRadio = document.querySelector('input[name="viewType"]:checked');
    if (checkedRadio) {
        currentView = checkedRadio.value;
    } else {
        // Fallback if HTML doesn't have a default checked (should not happen)
        console.warn("No default view type checked in HTML. Defaulting to 'age'.");
        currentView = 'age';
        const ageRadio = document.getElementById('view-age');
        if (ageRadio) ageRadio.checked = true; // Attempt to check the default
    }
    console.log("Initial view set to:", currentView);
}

// Export setup function to be called by main.js
export { setupEventListeners };
