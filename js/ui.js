/**
 * @module ui
 * @description Manages UI interactions, state, and orchestrates the application flow.
 * Connects user inputs (form, view toggle) to calculations and grid rendering.
 * Handles progressive reveal of UI elements after calculation.
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
const calculateBtn = document.getElementById('calculate-btn'); // Get reference to the button
const resultsArea = document.getElementById('results-area');
// References for Progressive Reveal & Moved Elements
const gridGuideDetails = document.getElementById('grid-guide-details'); // Now inside gridContainer
const gridContainer = document.getElementById('life-grid-container'); // The main container
const gridContentArea = document.getElementById('grid-content-area'); // Inner container for grid blocks
// References for New Header Bar (replaces old radio buttons)
const gridControlsHeader = document.getElementById('grid-controls-header'); // Now inside gridContainer
const viewSwitcherButtons = document.querySelectorAll('#view-switcher .view-button'); // Select new buttons


// --- State Variables ---
// Tracks the currently selected grid view type
let currentView = 'weeks-age'; // Default view ('weeks-age', 'weeks-calendar', 'months', or 'years') - Matches HTML default button data-view
// Stores results of the last calculation to allow re-rendering on view change without recalculating
let lastCalcData = {
    birthDate: null, // Stores the UTC-normalized birthDate object
    totalLifespanYearsEst: null
};

// DELETED: updateGridViewTitle function (no longer needed)

/**
 * Checks if the necessary form inputs are valid for enabling the calculate button.
 * @returns {boolean} True if inputs are valid, false otherwise.
 */
function areInputsValid() {
    // Ensure elements exist before accessing their properties
    const birthdateFilled = birthdateInput && birthdateInput.value !== '';
    const sexSelected = sexInput && sexInput.value !== ''; // "Select..." option has value=""
    return birthdateFilled && sexSelected;
}

/**
 * Updates the enabled/disabled state and title of the calculate button
 * based on input validity.
 */
function updateButtonState() {
    if (!calculateBtn) return; // Guard clause if button not found

    const isValid = areInputsValid();
    calculateBtn.disabled = !isValid;
    calculateBtn.title = isValid ? '' : 'Please fill in both fields.';
}


/**
 * Renders the grid using the currently selected view type and stored calculation data.
 * Clears the specific grid content area and calls the appropriate function from gridRenderer.js.
 * Assumes the main gridContainer and its children (header, guide) are already visible.
 */
function renderCurrentView() {
    // Ensure the dedicated content area exists
    if (!gridContentArea) {
        console.error("Grid content area (#grid-content-area) not found.");
        // Optionally clear the main container if the inner one is missing
        if (gridContainer) gridContainer.innerHTML = '<p class="error-message">Grid layout error.</p>';
        return;
    }

    // Ensure we have data from a previous calculation
    if (!lastCalcData.birthDate || lastCalcData.totalLifespanYearsEst === null) {
        console.log("No calculation data available to render grid.");
        gridContentArea.innerHTML = ''; // Clear only the content area
        // Ensure no view-specific classes remain on the main container if grid is empty
        if (gridContainer) {
            gridContainer.classList.remove('grid-view-weeks-age', 'grid-view-weeks-calendar', 'grid-view-months', 'grid-view-years');
        }
        return;
    }

    // Clear previous grid content from the dedicated area
    gridContentArea.innerHTML = '';

    // Update main container class for potential view-specific CSS rules (e.g., block sizing/gap)
    // These classes might affect how the gridContentArea itself behaves if needed
    if (gridContainer) {
        gridContainer.classList.remove('grid-view-weeks-age', 'grid-view-weeks-calendar', 'grid-view-months', 'grid-view-years'); // Clear previous
        gridContainer.classList.add(`grid-view-${currentView}`); // Add current (e.g., grid-view-weeks-age)
    }

    // Call the appropriate rendering function based on currentView state,
    // passing the specific gridContentArea element.
    try {
        // Use new view names matching data-view attributes
        if (currentView === 'weeks-age') {
            renderAgeGrid(lastCalcData.birthDate, lastCalcData.totalLifespanYearsEst, gridContentArea);
        } else if (currentView === 'weeks-calendar') {
            renderCalendarGrid(lastCalcData.birthDate, lastCalcData.totalLifespanYearsEst, gridContentArea);
        } else if (currentView === 'months') {
            renderMonthsGrid(lastCalcData.birthDate, lastCalcData.totalLifespanYearsEst, gridContentArea);
        } else if (currentView === 'years') {
            renderYearsGrid(lastCalcData.birthDate, lastCalcData.totalLifespanYearsEst, gridContentArea);
        } else {
            console.error("Unknown view type selected:", currentView);
            gridContentArea.innerHTML = '<p class="error-message">Invalid view selected.</p>';
        }
    } catch (renderError) {
        console.error(`Error during ${currentView} grid rendering:`, renderError);
        gridContentArea.innerHTML = `<p class="error-message">Error generating ${currentView} grid.</p>`;
    }
}


/**
 * Handles the form submission: validates input, performs calculations,
 * updates results display, stores data, triggers grid render, and manages
 * progressive reveal of UI elements.
 * @param {Event} event - The form submission event.
 */
function handleCalculation(event) {
    event.preventDefault(); // Prevent default form submission
    const birthdateStr = birthdateInput.value;
    const sex = sexInput.value;

    // --- Start Loading State ---
    if (calculateBtn) {
        calculateBtn.disabled = true; // Disable button immediately
        calculateBtn.textContent = 'Calculating...'; // Change button text
        // Optionally, add a class for CSS spinner: calculateBtn.classList.add('loading');
    }
    resultsArea.innerHTML = '<p>Calculating your timeline...</p>'; // Show loading in results
    resultsArea.classList.remove('error-message'); // Ensure no error styling
    resultsArea.classList.remove('hidden'); // Make results area visible for loading message

    // --- Progressive Reveal Logic: Reset UI before new calculation ---
    // Hide elements that should only show after successful calculation.
    gridContainer.classList.add('hidden'); // Hide the main container
    // Also explicitly hide the inner elements in case they were somehow visible
    if (gridControlsHeader) gridControlsHeader.classList.add('hidden');
    if (gridGuideDetails) gridGuideDetails.classList.add('hidden');

    // Clear previous results/errors visually and ensure results area is ready.
    resultsArea.innerHTML = '';
    // resultsArea.classList.remove('error-message'); // Already handled above
    
    // Clear previous calculation data before starting new calculation
    lastCalcData.birthDate = null;
    lastCalcData.totalLifespanYearsEst = null;

    // --- Input Validation ---
    if (!birthdateStr || !sex) {
        displayError('Please fill in both your birth date and sex.');
        // resultsArea.classList.remove('hidden'); // Already visible from loading state
        renderCurrentView(); // Clear grid content area if validation fails
        return; // Exit, leaving only results area visible
    }

    // Create Date object from input string
    const birthDateLocal = new Date(birthdateStr);

    // **CRITICAL: Normalize date to UTC midnight.**
    const birthDateUTC = new Date(birthDateLocal.getTime()); // Clone first
    birthDateUTC.setMinutes(birthDateUTC.getMinutes() + birthDateUTC.getTimezoneOffset());

    const now = new Date();
    const nowLocalMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Check validity *after* potential normalization and ensure date is in the past.
    if (isNaN(birthDateUTC.getTime()) || birthDateUTC >= nowLocalMidnight) {
        displayError('Please enter a valid birth date in the past (YYYY-MM-DD).');
        // resultsArea.classList.remove('hidden'); // Already visible
        renderCurrentView(); // Clear grid content area if validation fails
        return; // Exit, leaving only results area visible
    }

    // --- Perform Calculations (Wrapped in try/catch) ---
    try {
        const currentAge = calculateCurrentAge(birthDateUTC);
        const remainingYears = getRemainingExpectancy(currentAge, sex);

        if (remainingYears === null) {
            throw new Error(`Could not retrieve life expectancy data for the selected sex or age (${currentAge}). Please check the input.`);
        }
        const totalEstimatedLifespan = parseFloat((currentAge + remainingYears).toFixed(1));

        // --- Store Calculation Results ---
        lastCalcData.birthDate = birthDateUTC;
        lastCalcData.totalLifespanYearsEst = totalEstimatedLifespan;

        // --- Display Results ---
        displayResults(currentAge, remainingYears, totalEstimatedLifespan); // Updates resultsArea CONTENT

        // --- Render the Grid ---
        renderCurrentView(); // Renders into #grid-content-area

        // --- Progressive Reveal Logic: Show elements on success ---
        // resultsArea.classList.remove('hidden'); // Already visible
        // Reveal the main container, which now holds controls, guide, and content area
        gridContainer.classList.remove('hidden');
        // Explicitly reveal header and guide as they also have .hidden initially
        if (gridControlsHeader) gridControlsHeader.classList.remove('hidden');
        if (gridGuideDetails) gridGuideDetails.classList.remove('hidden');

        // DELETED: Call to updateGridViewTitle (title element removed)

    } catch (error) {
        // --- Handle Errors from Calculation or Rendering ---
        console.error("Calculation or Display Error:", error);
        displayError(error.message || 'An unexpected error occurred.');
        // resultsArea.classList.remove('hidden'); // Already visible
        renderCurrentView(); // Clear grid content area on error
        // Other elements (gridContainer, etc.) remain hidden (handled by reset at start)
    } finally {
        // --- End Loading State (always executed) ---
        if (calculateBtn) {
            calculateBtn.textContent = 'Calculate & Visualize'; // Revert button text
            // Optionally, remove loading class: calculateBtn.classList.remove('loading');
            updateButtonState(); // Re-evaluate button's enabled/disabled state
        }
    }
}

/**
 * Displays the calculated results in the results area.
 * @param {number} currentAge - The calculated current age in years.
 * @param {number} remainingYears - The estimated remaining years.
 * @param {number} totalEstimatedLifespan - The total estimated lifespan.
 */
function displayResults(currentAge, remainingYears, totalEstimatedLifespan) {
    // Ensure error styling is removed (handled by reset, but good practice)
    resultsArea.classList.remove('error-message');
    resultsArea.innerHTML = `
        <p>Your current age: <strong>${currentAge} years</strong></p>
        <p>Estimated remaining lifespan (avg., based on US 2021 data): <strong>${remainingYears} years</strong></p>
        <p>Total estimated lifespan (avg.): <strong>${totalEstimatedLifespan} years</strong></p>
    `;
}

/**
 * Displays an error message in the results area.
 * @param {string} message - The error message to display.
 */
function displayError(message) {
    resultsArea.innerHTML = `<p>${message}</p>`;
    resultsArea.classList.add('error-message'); // Ensure error styling is applied
    // Visibility of resultsArea is handled in handleCalculation
}


/**
 * Handles clicks on the view switcher buttons. Updates the currentView state,
 * button appearances, and triggers a re-render of the grid.
 * @param {Event} event - The click event from the view switcher button.
 */
function handleViewChange(event) {
    // Ensure the click came from a button within the switcher
    const clickedButton = event.target.closest('.view-button');
    if (!clickedButton || !viewSwitcherButtons) return;

    const newView = clickedButton.dataset.view;
    if (!newView || newView === currentView) {
        return; // No change needed if view is invalid or same as current
    }

    currentView = newView; // Update the state variable
    console.log("View changed to:", currentView);

    // Update button states (active class and aria-checked)
    viewSwitcherButtons.forEach(button => {
        const isActive = button === clickedButton;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-checked', isActive ? 'true' : 'false');
    });

    // DELETED: Call to updateGridViewTitle (title element removed)

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

    // Add event listeners to form inputs to update button state
    if (birthdateInput) {
        birthdateInput.addEventListener('input', updateButtonState);
    } else {
        console.error("Birthdate input element (#birthdate) not found.");
    }
    if (sexInput) {
        sexInput.addEventListener('change', updateButtonState); // 'change' is suitable for select
    } else {
        console.error("Sex input element (#sex) not found.");
    }

    // Attach listeners to all view switcher buttons
    if (viewSwitcherButtons.length > 0) {
        viewSwitcherButtons.forEach(button => {
            // Use 'click' event for buttons instead of 'change'
            button.addEventListener('click', handleViewChange);
        });
    } else {
        console.error("View switcher buttons (.view-button) not found.");
    }


    // Set initial view state based on the default active button in HTML
    const activeButton = document.querySelector('#view-switcher .view-button.active');
    if (activeButton && activeButton.dataset.view) {
        currentView = activeButton.dataset.view;
    } else {
        // Fallback if HTML doesn't have a default active button (should not happen)
        console.warn("No default active view button found in HTML. Defaulting to 'weeks-age'.");
        currentView = 'weeks-age';
        // Attempt to visually set the default if needed (though HTML/CSS should handle initial state)
        const defaultButton = document.querySelector('#view-switcher .view-button[data-view="weeks-age"]');
        if (defaultButton && !activeButton) {
            defaultButton.classList.add('active');
            defaultButton.setAttribute('aria-checked', 'true');
        }
    }
    console.log("Initial view set to:", currentView);
    // No need to call updateGridViewTitle here, as it's called in handleCalculation on success (or rather, it's not needed at all now)

    // Set initial button state on page load
    updateButtonState();
}

// Export setup function to be called by main.js
export { setupEventListeners };
