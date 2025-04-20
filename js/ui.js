// Import the calculation functions we need
import { calculateCurrentAge, getRemainingExpectancy } from './calculator.js';

// --- DOM Element References ---
// Get references to the elements this module interacts with
const form = document.getElementById('life-input-form');
const birthdateInput = document.getElementById('birthdate');
const sexInput = document.getElementById('sex');
const resultsArea = document.getElementById('results-area');
const gridContainer = document.getElementById('life-grid-container'); // For later

/**
 * Handles the form submission, performs calculations, and updates the results area.
 * @param {Event} event - The form submission event.
 */
function handleCalculation(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    const birthdateStr = birthdateInput.value;
    const sex = sexInput.value;
    resultsArea.innerHTML = ''; // Clear previous results

    // --- Input Validation ---
    if (!birthdateStr || !sex) {
        resultsArea.innerHTML = '<p class="error-message">Please fill in both your birth date and sex.</p>';
        return;
    }

    const birthDate = new Date(birthdateStr);
    // IMPORTANT: Normalize date to UTC midnight to avoid timezone issues
    birthDate.setMinutes(birthDate.getMinutes() + birthDate.getTimezoneOffset());
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Compare against today's midnight

    if (isNaN(birthDate.getTime()) || birthDate >= now) {
        resultsArea.innerHTML = '<p class="error-message">Please enter a valid birth date in the past.</p>';
        return;
    }

    // --- Perform Calculations (using imported functions) ---
    const currentAge = calculateCurrentAge(birthDate);
    const remainingYears = getRemainingExpectancy(currentAge, sex);

    if (remainingYears === null) {
        resultsArea.innerHTML = `<p class="error-message">Could not retrieve life expectancy data for the selected sex or age (${currentAge}). Please check the input.</p>`;
        return;
    }

    const totalEstimatedLifespan = parseFloat((currentAge + remainingYears).toFixed(1));

    // --- Display Results ---
    resultsArea.innerHTML = `
        <p>Your current age: <strong>${currentAge} years</strong></p>
        <p>Estimated remaining lifespan (avg., based on US 2021 data): <strong>${remainingYears} years</strong></p>
        <p>Total estimated lifespan (avg.): <strong>${totalEstimatedLifespan} years</strong></p>
        <hr>
        <p><em>(Grid visualization coming soon!)</em></p>
    `;

    // --- Prepare for Grid Rendering (Next Step) ---
    gridContainer.innerHTML = ''; // Clear any previous grid
    console.log("Ready to render grid with:", { birthDate, totalEstimatedLifespan });
    // TODO: Call the grid rendering function here in the next step
    // renderLifeGrid(birthDate, totalEstimatedLifespan);
}

// Export the form element (so main.js can attach the listener)
// and the handler function
export { form, handleCalculation };
