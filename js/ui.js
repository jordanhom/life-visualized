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
const calculateBtn = document.getElementById('calculate-btn');
const startOverContainer = document.getElementById('start-over-container');
const resultsArea = document.getElementById('results-area');
// References for Progressive Reveal & Grid UI Elements
const gridGuideDetails = document.getElementById('grid-guide-details');
const gridContainer = document.getElementById('life-grid-container');
const gridContentArea = document.getElementById('grid-content-area'); // Inner container for grid blocks
// References for Grid Controls Header
const gridControlsHeader = document.getElementById('grid-controls-header');
const viewSwitcher = document.getElementById('view-switcher'); // Cache the tablist container
const viewSwitcherButtons = document.querySelectorAll('#view-switcher .view-button');
// Axis Label Elements
const gridAxisLabelTop = document.getElementById('grid-axis-label-top');
const gridAxisLabelLeft = document.getElementById('grid-axis-label-left');
const gridContentWrapper = document.getElementById('grid-content-wrapper'); // Wrapper for left label + content area


// --- State Variables ---
// Tracks the currently selected grid view type
let currentView = 'weeks-age'; // Default view ('weeks-age', 'weeks-calendar', 'months', or 'years') - Matches HTML default button data-view
// Stores results of the last calculation to allow re-rendering on view change without recalculating
let lastCalcData = {
    birthDate: null, // Stores the UTC-normalized birthDate object
    totalLifespanYearsEst: null
};

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
 * Updates the text content and visibility of the grid axis labels.
 * @param {boolean} show - Whether to show or hide the labels.
 * @param {string} [topText=''] - Text for the top axis label.
 * @param {string} [leftText=''] - Text for the left axis label.
 */
function updateAxisLabels(show, topText = '', leftText = '') {
    if (gridAxisLabelTop && gridAxisLabelLeft && gridContentWrapper) {
        if (show) {
            gridAxisLabelTop.innerHTML = `------ ${topText} -----&gt;`;
            gridAxisLabelLeft.innerHTML = `&lt;----- ${leftText} ------`;
            gridAxisLabelTop.classList.remove('hidden');
            // Show the wrapper which contains the left axis label and the grid content area.
            gridContentWrapper.classList.remove('hidden'); 
        } else { // Hiding labels
            gridAxisLabelTop.classList.add('hidden');
            gridContentWrapper.classList.add('hidden');
            gridAxisLabelTop.innerHTML = ''; // Clear text when hidden
            gridAxisLabelLeft.innerHTML = '';
        }
    }
}


/**
 * Renders the grid using the currently selected view type and stored calculation data.
 * Clears #grid-content-area, calls the appropriate renderer, and updates axis labels.
 */
function renderCurrentView() {
    // Ensure the dedicated content area exists
    if (!gridContentArea) {
        console.error("Grid content area (#grid-content-area) not found.");
        // Fallback: Clear the main container if the inner one is missing to prevent stale content.
        if (gridContainer) gridContainer.innerHTML = '<p class="error-message">Grid layout error.</p>';
        return;
    }

    // Ensure we have data from a previous calculation
    if (!lastCalcData.birthDate || lastCalcData.totalLifespanYearsEst === null) {
        console.log("No calculation data available to render grid.");
        gridContentArea.innerHTML = ''; // Clear only the content area
        // Ensure no view-specific classes remain on the main container if grid is empty.
        if (gridContainer) {
            gridContainer.classList.remove('grid-view-weeks-age', 'grid-view-weeks-calendar', 'grid-view-months', 'grid-view-years');
        }
        updateAxisLabels(false); // Hide axis labels if no data
        gridContentArea.removeAttribute('tabindex'); // Not focusable if empty
        return;
    }

    // Clear previous grid content from the dedicated area
    gridContentArea.innerHTML = '';

    // Update main container class for view-specific CSS rules (e.g., month/year block sizing/gap).
    if (gridContainer) {
        gridContainer.classList.remove('grid-view-weeks-age', 'grid-view-weeks-calendar', 'grid-view-months', 'grid-view-years'); // Clear previous
        gridContainer.classList.add(`grid-view-${currentView}`); // Add current (e.g., grid-view-weeks-age)
    }

    let topLabel = '', leftLabel = '';

    // Call the appropriate rendering function based on currentView state,
    // passing the specific gridContentArea element.
    try {
        // View names match data-view attributes on buttons.
        if (currentView === 'weeks-age') {
            topLabel = 'Weeks'; leftLabel = 'Years';
            renderAgeGrid(lastCalcData.birthDate, lastCalcData.totalLifespanYearsEst, gridContentArea);
        } else if (currentView === 'weeks-calendar') {
            topLabel = 'Weeks'; leftLabel = 'Years';
            renderCalendarGrid(lastCalcData.birthDate, lastCalcData.totalLifespanYearsEst, gridContentArea);
        } else if (currentView === 'months') {
            topLabel = 'Months'; leftLabel = 'Years';
            renderMonthsGrid(lastCalcData.birthDate, lastCalcData.totalLifespanYearsEst, gridContentArea);
        } else if (currentView === 'years') {
            topLabel = 'Years'; leftLabel = 'Decades';
            renderYearsGrid(lastCalcData.birthDate, lastCalcData.totalLifespanYearsEst, gridContentArea);
        } else {
            console.error("Unknown view type selected:", currentView);
            gridContentArea.innerHTML = '<p class="error-message">Invalid view selected.</p>';
            updateAxisLabels(false); // Hide on error
            gridContentArea.removeAttribute('tabindex'); // Not focusable on error
        }
        // If rendering was successful (no error message was set by the renderer), update and show axis labels.
        if (!gridContentArea.querySelector('.error-message')) {
            updateAxisLabels(true, topLabel, leftLabel);
            gridContentArea.setAttribute('aria-label', `Lifespan visualization grid, showing ${leftLabel} by ${topLabel}.`);
        }
        // If rendering was successful (no error thrown by renderer and content exists), make it focusable.
        if (gridContentArea.hasChildNodes() && !gridContentArea.querySelector('.error-message')) {
            gridContentArea.tabIndex = 0;
        }
    } catch (renderError) {
        console.error(`Error during ${currentView} grid rendering:`, renderError);
        gridContentArea.innerHTML = `<p class="error-message">Error generating ${currentView} grid.</p>`;
        updateAxisLabels(false); // Hide on error
        gridContentArea.removeAttribute('aria-label'); // Remove label on error
        gridContentArea.removeAttribute('tabindex'); // Not focusable on error
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
    }
    resultsArea.innerHTML = '<p>Calculating your timeline...</p>'; // Show loading in results
    resultsArea.classList.remove('error-message'); // Ensure no error styling
    resultsArea.classList.remove('hidden'); // Make results area visible for loading message

    // --- UI Reset before new calculation ---
    // Hide elements that should only show after successful calculation.
    form.classList.remove('hidden'); // Ensure form is visible for a new attempt or if resetting from error
    gridContainer.classList.add('hidden'); // Hide the main grid container
    if (startOverContainer) startOverContainer.classList.add('hidden'); // Hide Start Over button's container
    // gridControlsHeader and gridGuideDetails are children of gridContainer, so they are hidden with it.
    updateAxisLabels(false); // Hide axis labels

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
        displayResults(currentAge, remainingYears, totalEstimatedLifespan, birthDateUTC, sex); // Pass inputs for display

        // --- Render the Grid ---
        renderCurrentView(); // Renders into #grid-content-area

        // --- Progressive Reveal Logic: Show elements on success ---
        // resultsArea.classList.remove('hidden'); // Already visible
        // Reveal the main container, which now holds controls, guide, and content area
        form.classList.add('hidden'); // Hide the input form
        if (startOverContainer) startOverContainer.classList.remove('hidden'); // Show Start Over button's container
        gridContainer.classList.remove('hidden');
        // gridControlsHeader and gridGuideDetails become visible when gridContainer does.

        // Set focus to the first view switcher button after successful calculation
        if (viewSwitcherButtons && viewSwitcherButtons.length > 0) {
            viewSwitcherButtons[0].focus();
        }

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
            updateButtonState(); // Re-evaluate button's enabled/disabled state
        }
    }
}

/**
 * Displays the calculated results in the results area.
 * @param {number} currentAge - The calculated current age in years.
 * @param {number} remainingYears - The estimated remaining years.
 * @param {number} totalEstimatedLifespan - The total estimated lifespan.
 * @param {Date} birthDateObj - The UTC birth date object used for calculation.
 * @param {string} sexValue - The sex value used for calculation.
 */
function displayResults(currentAge, remainingYears, totalEstimatedLifespan, birthDateObj, sexValue) {
    // Ensure error styling is removed (handled by reset, but good practice)
    resultsArea.classList.remove('error-message');
    // Format date for display (YYYY-MM-DD)
    const formattedBirthDate = birthDateObj.getUTCFullYear() + '-' +
                            ('0' + (birthDateObj.getUTCMonth() + 1)).slice(-2) + '-' +
                            ('0' + birthDateObj.getUTCDate()).slice(-2);
    const capitalizedSex = sexValue.charAt(0).toUpperCase() + sexValue.slice(1);

    resultsArea.innerHTML = `
        <p class="results-intro">Based on your birth date (<strong>${formattedBirthDate}</strong>) and sex (<strong>${capitalizedSex}</strong>), here's your timeline overview:</p>
        <div class="results-stats-grid">
            <span class="stat-label">Current Age:</span>
            <span class="stat-value"><strong>${currentAge} years</strong></span>
            <span class="stat-label">Estimated Remaining:</span>
            <span class="stat-value"><strong>${remainingYears} years</strong></span>
            <span class="stat-label">Total Estimated Lifespan:</span>
            <span class="stat-value"><strong>${totalEstimatedLifespan} years</strong> (average)</span>
        </div>
    `;
}

/**
 * Displays an error message in the results area.
 * @param {string} message - The error message to display.
 */
function displayError(message) {
    resultsArea.innerHTML = `<p>${message}</p>`;
    resultsArea.classList.add('error-message'); // Ensure error styling is applied
    // Visibility of resultsArea itself is handled by the calling function (handleCalculation).
}


/**
 * Handles clicks on the view switcher buttons. Updates the currentView state,
 * button appearances, and triggers a re-render of the grid.
 * @param {Event} event - The click event from the view switcher button.
 */
function handleViewChange(event) {
    const clickedButton = event.target.closest('.view-button');
    if (!clickedButton || !viewSwitcherButtons) return;

    const newView = clickedButton.dataset.view;
    if (!newView || newView === currentView) {
        return; // No change needed if view is invalid or same as current
    }
    currentView = newView; // Update the state variable
    console.log("View changed to:", currentView);

    // Update button states (active class and ARIA for tablist)
    viewSwitcherButtons.forEach(button => {
        const isActive = button === clickedButton;
        button.classList.toggle('active', isActive);
        // Update ARIA attributes for tab role
        button.setAttribute('aria-selected', isActive.toString());
        button.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    // Update tabpanel's aria-labelledby to the id of the new active tab
    gridContentArea.setAttribute('aria-labelledby', clickedButton.id);

    // Re-render the grid with the new view setting, using stored `lastCalcData`.
    renderCurrentView();
}

/**
 * Handles the "Start Over" action: resets the UI to its initial state.
 */
function handleStartOver() {
    // Show the form
    form.classList.remove('hidden');

    // Hide results, grid, and the start over button itself
    resultsArea.classList.add('hidden');
    gridContainer.classList.add('hidden');
    updateAxisLabels(false); // Hide axis labels
    // gridControlsHeader and gridGuideDetails are hidden along with gridContainer
    if (startOverContainer) startOverContainer.classList.add('hidden');

    // Clear input fields
    if (birthdateInput) birthdateInput.value = '';
    if (sexInput) sexInput.value = ''; // This will reset to the "Select..." placeholder

    // Reset stored calculation data
    lastCalcData.birthDate = null;
    lastCalcData.totalLifespanYearsEst = null;

    updateButtonState(); // Disable calculate button
    if (birthdateInput) birthdateInput.focus(); // Focus on the first input field
    if (gridContentArea) gridContentArea.removeAttribute('tabindex'); // Ensure it's not focusable when empty.
    renderCurrentView(); // Clear the grid
}

/**
 * Handles keyboard navigation for the tablist.
 * Allows ArrowLeft, ArrowRight, Home, and End keys to navigate tabs.
 * @param {KeyboardEvent} event The keyboard event.
 */
function handleTablistKeydown(event) {
    // Use the cached NodeList of tab buttons
    const tabs = Array.from(viewSwitcherButtons);
    const currentTab = document.activeElement;

    // Ensure the event target is a tab within our tablist
    if (!tabs.includes(currentTab)) {
        return;
    }

    let currentIndex = tabs.indexOf(currentTab);
    let newIndex = currentIndex;

    switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown': // Supporting ArrowDown as an alternative for horizontal lists
            newIndex = (currentIndex + 1) % tabs.length;
            break;
        case 'ArrowLeft':
        case 'ArrowUp': // Supporting ArrowUp
            newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
            break;
        case 'Home':
            newIndex = 0;
            break;
        case 'End':
            newIndex = tabs.length - 1;
            break;
        default:
            return; // Key not handled
    }

    event.preventDefault(); // Prevent default browser action (e.g., scrolling)
    tabs[newIndex].focus(); // Move focus to the new tab
    tabs[newIndex].click(); // Activate the new tab (triggers handleViewChange)
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

    // Attach delegated click listener and keydown listener to the viewSwitcher container
    if (viewSwitcher) {
        viewSwitcher.addEventListener('click', handleViewChange);
        viewSwitcher.addEventListener('keydown', handleTablistKeydown);
    } else {
        console.error("View switcher container (#view-switcher) not found.");
    }

    // Attach listener to the actual "Start Over" button, even though its container is used for show/hide
    const startOverBtn = document.getElementById('start-over-btn');
    if (startOverBtn && startOverContainer) { // Check both button and its container exist
        startOverBtn.addEventListener('click', handleStartOver);
    } else {
        console.error("Start Over button (#start-over-btn) or its container (#start-over-container) not found.");
    }


    // Set initial view state based on the default active button in HTML
    const activeButton = document.querySelector('#view-switcher .view-button.active[role="tab"]');
    if (activeButton && activeButton.dataset.view) {
        currentView = activeButton.dataset.view;
        // Initial ARIA attributes (aria-selected, tabindex for buttons; aria-labelledby for panel)
        // are assumed to be correctly set in the HTML for the default active tab.
    } else if (viewSwitcherButtons.length > 0) { // Fallback if no .active class in HTML or HTML is malformed
        console.warn("No default active view button found in HTML. Defaulting to 'weeks-age'.");
        currentView = viewSwitcherButtons[0].dataset.view || 'weeks-age'; // Use first button's view or hardcoded default
        // Note: This fallback doesn't enforce ARIA states if HTML is malformed; relies on first interaction to sync.
    }
    console.log("Initial view set to:", currentView);

    // Set initial button state on page load
    updateButtonState();
}

// Export setup function to be called by main.js
export { setupEventListeners };
