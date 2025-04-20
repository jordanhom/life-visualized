// js/gridRenderer.js

// --- Constants ---
// Using a more precise average number of weeks in a year
const WEEKS_PER_YEAR_AVG = 365.2425 / 7; // ~52.1775

// --- Helper Functions ---

/**
 * Calculates the total estimated number of weeks in a lifespan.
 * @param {number} totalYearsEst - Total estimated lifespan in years.
 * @returns {number} Total estimated weeks, rounded to the nearest whole number.
 */
function calculateTotalWeeks(totalYearsEst) {
    return Math.round(totalYearsEst * WEEKS_PER_YEAR_AVG);
}

/**
 * Calculates the number of full weeks passed since the birth date.
 * @param {Date} birthDate - The user's birth date (normalized to UTC midnight).
 * @param {Date} nowDate - The current date (normalized to UTC midnight).
 * @returns {number} The number of full weeks passed.
 */
function calculateWeeksPassed(birthDate, nowDate) {
    const millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
    const diffMilliseconds = nowDate.getTime() - birthDate.getTime();
    // Ensure we don't return negative weeks if dates are somehow inverted
    if (diffMilliseconds < 0) return 0;
    return Math.floor(diffMilliseconds / millisecondsPerWeek);
}

// --- Core Rendering Function ---

/**
 * Renders the life grid (currently only weeks view).
 * @param {Date} birthDate - The user's birth date (normalized).
 * @param {number} totalLifespanYearsEst - Total estimated lifespan in years.
 * @param {HTMLElement} gridContainerElement - The DOM element to render the grid into.
 */
function renderWeekGrid(birthDate, totalLifespanYearsEst, gridContainerElement) {
    if (!gridContainerElement) {
        console.error("Grid container element not provided.");
        return;
    }

    const now = new Date();
    // Normalize 'now' to midnight UTC for consistent week calculation
    now.setUTCHours(0, 0, 0, 0);
    // Ensure birthDate is also treated as midnight UTC (should be already normalized from input)
    const normalizedBirthDate = new Date(birthDate);
    normalizedBirthDate.setUTCHours(0,0,0,0);


    const totalWeeks = calculateTotalWeeks(totalLifespanYearsEst);
    const weeksPassed = calculateWeeksPassed(normalizedBirthDate, now);
    const currentWeekNumber = weeksPassed + 1; // Weeks are 1-indexed

    console.log(`Rendering Grid: Total Weeks=${totalWeeks}, Weeks Passed=${weeksPassed}, Current Week=${currentWeekNumber}`);

    // Clear previous grid content
    gridContainerElement.innerHTML = '';

    // Use a DocumentFragment for performance when adding many elements
    const fragment = document.createDocumentFragment();

    for (let week = 1; week <= totalWeeks; week++) {
        const weekBlock = document.createElement('div');
        weekBlock.classList.add('week-block');

        // Determine state: past, present, or future
        if (week < currentWeekNumber) {
            weekBlock.classList.add('past');
        } else if (week === currentWeekNumber) {
            weekBlock.classList.add('present');
        } else {
            weekBlock.classList.add('future');
        }

        // Add tooltip for basic info
        weekBlock.title = `Week ${week} of ~${totalWeeks}`;

        fragment.appendChild(weekBlock);
    }

    // Append the completed fragment to the DOM
    gridContainerElement.appendChild(fragment);

    // Optional: Add accessibility attributes or further info to the container
    gridContainerElement.setAttribute('aria-label', `Life grid showing approximately ${totalWeeks} weeks.`);
    // You could add more descriptive text or counts here if desired.
}

// Export the main function needed by other modules
export { renderWeekGrid };
