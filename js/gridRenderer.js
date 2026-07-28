/**
 * @module gridRenderer
 * @description Generates and renders HTML for life visualization grids (weeks, months, years).
 * Handles layout logic for each view type and applies CSS classes for styling based
 * on life stage and time (past, present, future).
 *
 * Exports: `renderAgeGrid`, `renderCalendarGrid`, `renderMonthsGrid`, `renderYearsGrid`.
 *
 * Expects input `birthDate` to be pre-normalized to UTC midnight by the calling module.
 * Defines `LIFE_STAGES` and helper functions internally. Uses `DocumentFragment` for
 * efficient DOM manipulation. Renders content into a specific `gridContentAreaElement`.
 */

import {
    addMonthsUTC,
    addYearsUTC,
    calculateAgeAtDateUTC,
    formatUTCDate,
    getISOWeekStartUTC,
    getISOWeeksInYearUTC,
    getISOWeekYearUTC,
    getLocalDateUTC,
    startOfISOWeekUTC,
    startOfMonthUTC
} from './dateUtils.js';

// Life Stage Definitions (Used for styling blocks)
// Defines the age boundaries and corresponding CSS class keys for different life stages.
// Colors are applied via CSS using the '.stage-{key}' classes.
const LIFE_STAGES = [
    // Life stages are year-age inclusive.
    { key: 'infancy', name: 'Infancy', maxAge: 0 },                     // (Age 0)
    { key: 'toddler', name: 'Toddlerhood', maxAge: 2 },                 // (Ages 1-2)
    { key: 'earlychildhood', name: 'Early Childhood', maxAge: 5 },      // (Ages 3-5)
    { key: 'middlechildhood', name: 'Middle Childhood', maxAge: 11 },   // (Ages 6-11)
    { key: 'adolescence', name: 'Adolescence', maxAge: 17 },            // (Ages 12-17)
    { key: 'youngadult', name: 'Young Adulthood', maxAge: 25 },         // (Ages 18-25)
    { key: 'adulthood', name: 'Adulthood', maxAge: 39 },                // (Ages 26-39)
    { key: 'middleadulthood', name: 'Middle Adulthood', maxAge: 59 },   // (Ages 40-59)
    { key: 'earlysenior', name: 'Early Senior', maxAge: 74 },           // (Ages 60-74)
    { key: 'midsenior', name: 'Mid-Senior', maxAge: 84 },               // (Ages 75-84)
    { key: 'latesenior', name: 'Late Senior', maxAge: Infinity }        // (Ages 85+)
];

// Helper: Get stage key based on age. (Used for styling blocks)
function getLifeStageKey(age) {
    for (const stage of LIFE_STAGES) {
        if (age <= stage.maxAge) {
            return stage.key;
        }
    }
    return LIFE_STAGES[LIFE_STAGES.length - 1].key; // Default to last stage if somehow needed
}

// --- Helper: Calculate age at a specific date ---
// Needed for determining life stage in calendar/month views where the block's
// corresponding date changes relative to the birth date. Uses UTC methods.
function calculateAgeAtDate(currentDateUTC, birthDateUTC) {
    return calculateAgeAtDateUTC(currentDateUTC, birthDateUTC);
}

/**
 * Renders the life grid based on years of age (Age View).
 * Each row represents one year of age. Uses DocumentFragment for performance.
 * @param {Date} inputBirthDate - User's birth date object (UTC normalized).
 * @param {number} totalLifespanYearsEst - Estimated lifespan in years.
 * @param {HTMLElement} gridContentAreaElement - The DOM element to render the grid blocks into.
 */
function renderAgeGrid(inputBirthDate, totalLifespanYearsEst, gridContentAreaElement) {
    if (!gridContentAreaElement) { console.error("Grid content area element not provided."); return; }

    console.log("Rendering Age Grid...");
    try {
        const birthDateUTC = inputBirthDate; // Already normalized by ui.js
        const currentActualWeekStartDateUTC = startOfISOWeekUTC(getLocalDateUTC());
        const estimatedEndDateUTC = addYearsUTC(birthDateUTC, totalLifespanYearsEst);

        gridContentAreaElement.innerHTML = '';
        const fragment = document.createDocumentFragment();
        let totalRenderedWeeks = 0;
        const totalYearsToRender = Math.ceil(totalLifespanYearsEst);

        for (let age = 0; age < totalYearsToRender; age++) {
            const ageRow = document.createElement('div');
            ageRow.classList.add('year-row'); // Use same class for styling consistency
            ageRow.setAttribute('data-age', age);
            ageRow.setAttribute('aria-label', `Age ${age}`);

            const ageStartDateUTC = addYearsUTC(birthDateUTC, age);
            const ageEndDateExclusiveUTC = addYearsUTC(birthDateUTC, age + 1);
            const stageKey = getLifeStageKey(age);

            const weeksInAgeYear = [];
            let weekStartDateUTC = startOfISOWeekUTC(ageStartDateUTC);
            while (weekStartDateUTC < ageEndDateExclusiveUTC) {
                weeksInAgeYear.push(weekStartDateUTC);
                weekStartDateUTC = new Date(weekStartDateUTC.getTime());
                weekStartDateUTC.setUTCDate(weekStartDateUTC.getUTCDate() + 7);
            }
            if (weeksInAgeYear.length > 53) {
                console.warn(`Age ${age}: Generated ${weeksInAgeYear.length} weeks. Removing the last week (${formatUTCDate(weeksInAgeYear[weeksInAgeYear.length - 1])}) to enforce max 53.`);
                weeksInAgeYear.length = 53;
            }

            let weekInAgeYearIndex = 0;
            for (const currentRenderWeekStartDateUTC of weeksInAgeYear) {
                if (currentRenderWeekStartDateUTC > estimatedEndDateUTC) continue;

                const weekBlock = document.createElement('div');
                weekBlock.classList.add('week-block');
                weekBlock.classList.add(`stage-${stageKey}`);
                let stateClass = '';
                const formattedStart = formatUTCDate(currentRenderWeekStartDateUTC);
                let title = `Age ${age}, Week ${weekInAgeYearIndex + 1} (Starts UTC: ${formattedStart})`;

                if (currentRenderWeekStartDateUTC.getTime() === currentActualWeekStartDateUTC.getTime()) {
                    stateClass = 'present'; title += ' (Current week)';
                } else if (currentRenderWeekStartDateUTC < currentActualWeekStartDateUTC) {
                    stateClass = 'past';
                } else {
                    stateClass = 'future';
                }

                if (stateClass) weekBlock.classList.add(stateClass);
                weekBlock.title = title;
                ageRow.appendChild(weekBlock);
                totalRenderedWeeks++;
                weekInAgeYearIndex++;
            }

            if (ageRow.hasChildNodes()) fragment.appendChild(ageRow);
        }

        gridContentAreaElement.appendChild(fragment);
        console.log(`Total weeks rendered in age grid: ${totalRenderedWeeks}`);

    } catch (error) {
        console.error("Error during age-based grid rendering:", error);
        gridContentAreaElement.innerHTML = '<p class="error-message">Error generating age-based grid.</p>';
    }
}


/**
 * Renders the life grid based on ISO Calendar Years (Calendar View).
 * Each row represents one ISO year. Includes 'out-of-bounds' styling.
 * Uses DocumentFragment for performance.
 * @param {Date} inputBirthDate - User's birth date object (UTC normalized).
 * @param {number} totalLifespanYearsEst - Estimated lifespan in years.
 * @param {HTMLElement} gridContentAreaElement - The DOM element to render the grid blocks into.
 */
function renderCalendarGrid(inputBirthDate, totalLifespanYearsEst, gridContentAreaElement) {
    if (!gridContentAreaElement) { console.error("Grid content area element not provided."); return; }

    console.log("Rendering Calendar Grid...");
    try {
        // --- Date Setup (UTC) ---
        const birthDateUTC = inputBirthDate; // Already normalized by ui.js
        const todayUTC = getLocalDateUTC();
        const estimatedEndDateUTC = addYearsUTC(birthDateUTC, totalLifespanYearsEst);
        const startISOYear = getISOWeekYearUTC(birthDateUTC);
        const endISOYear = getISOWeekYearUTC(estimatedEndDateUTC);
        // Determine the start of the ISO week containing the birth date
        const firstWeekStartDateUTC = startOfISOWeekUTC(birthDateUTC);
        // Determine the start of the current ISO week
        const currentActualWeekStartDateUTC = startOfISOWeekUTC(todayUTC);

        // --- Grid Rendering ---
        gridContentAreaElement.innerHTML = ''; // Clear previous content from the specific area
        // Use a DocumentFragment to batch DOM updates for better performance
        const fragment = document.createDocumentFragment();
        let totalRenderedWeeks = 0;

        // Loop through each ISO calendar year from birth year to estimated end year
        for (let isoYear = startISOYear; isoYear <= endISOYear; isoYear++) {
            const yearRow = document.createElement('div');
            yearRow.classList.add('year-row'); // Use same class
            yearRow.setAttribute('data-year', isoYear); // Add calendar year data attribute
            yearRow.setAttribute('aria-label', `Calendar Year ${isoYear}`); // Add row label

            // Determine number of ISO weeks in this specific calendar year (can be 52 or 53)
            const weeksInThisYear = getISOWeeksInYearUTC(isoYear);

            // Loop through each week number within the ISO year
            for (let weekNum = 1; weekNum <= weeksInThisYear; weekNum++) {
                const currentRenderWeekStartDateUTC = getISOWeekStartUTC(isoYear, weekNum);

                const weekBlock = document.createElement('div');
                weekBlock.classList.add('week-block');

                // Determine age during this week using helper
                const ageDuringWeek = calculateAgeAtDate(currentRenderWeekStartDateUTC, birthDateUTC);
                const stageKey = getLifeStageKey(ageDuringWeek);
                weekBlock.classList.add(`stage-${stageKey}`);

                let stateClass = '';
                const formattedStart = formatUTCDate(currentRenderWeekStartDateUTC);
                let title = `Year ${isoYear}, Week ${weekNum} (Starts UTC: ${formattedStart})`;

                // Check Out of Bounds: Is this week before the first week containing birth OR after estimated end?
                if (currentRenderWeekStartDateUTC < firstWeekStartDateUTC || currentRenderWeekStartDateUTC > estimatedEndDateUTC) {
                    stateClass = 'out-of-bounds'; title += ' (Outside lifespan)';
                } else { // Within lifespan, check past/present/future
                    if (currentRenderWeekStartDateUTC.getTime() === currentActualWeekStartDateUTC.getTime()) {
                        stateClass = 'present'; title += ' (Current week)';
                    } else if (currentRenderWeekStartDateUTC < currentActualWeekStartDateUTC) {
                        stateClass = 'past';
                    } else {
                        stateClass = 'future';
                    }
                }

                if (stateClass) weekBlock.classList.add(stateClass);
                weekBlock.title = title;
                yearRow.appendChild(weekBlock);
                totalRenderedWeeks++;
            }
            // Only append row if it has content (prevents empty rows at end if lifespan ends mid-year)
            if (yearRow.hasChildNodes()) {
                fragment.appendChild(yearRow);
            }
        }

        // Append the completed fragment to the specific content area
        gridContentAreaElement.appendChild(fragment);
        console.log(`Total weeks rendered in calendar grid: ${totalRenderedWeeks}`);

    } catch (error) {
        console.error("Error during calendar-based grid rendering:", error);
        gridContentAreaElement.innerHTML = '<p class="error-message">Error generating calendar-based grid.</p>';
    }
}

/**
 * Renders the life grid based on months (Months View).
 * Each row represents one year (12 months). Uses DocumentFragment for performance.
 * @param {Date} inputBirthDate - User's birth date object (UTC normalized).
 * @param {number} totalLifespanYearsEst - Estimated lifespan in years.
 * @param {HTMLElement} gridContentAreaElement - The DOM element to render the grid blocks into.
 */
function renderMonthsGrid(inputBirthDate, totalLifespanYearsEst, gridContentAreaElement) {
    if (!gridContentAreaElement) { console.error("Grid content area element not provided."); return; }

    console.log("Rendering Months Grid...");
    try {
        // --- Date Setup (UTC) ---
        const birthDateUTC = inputBirthDate; // Already normalized by ui.js
        const currentMonthStartDateUTC = startOfMonthUTC(getLocalDateUTC());

        // Calculate total months to potentially render based on estimated lifespan
        const totalEstimatedMonths = Math.ceil(totalLifespanYearsEst * 12);

        // --- Grid Rendering ---
        gridContentAreaElement.innerHTML = ''; // Clear previous content from the specific area
        // Use a DocumentFragment to batch DOM updates for better performance
        const fragment = document.createDocumentFragment();
        let totalRenderedMonths = 0;
        let currentMonthRow = null;

        // Loop through each month index from birth (0) up to the total estimated months
        for (let monthIndex = 0; monthIndex < totalEstimatedMonths; monthIndex++) {
            // Create a new row every 12 months (start of a new year of life)
            if (monthIndex % 12 === 0) {
                currentMonthRow = document.createElement('div');
                // Add classes for styling: generic row layout and month-specific rules
                currentMonthRow.classList.add('year-row', 'month-row');
                const yearNum = Math.floor(monthIndex / 12); // Age year (0, 1, 2...)
                currentMonthRow.setAttribute('data-year-num', yearNum);
                currentMonthRow.setAttribute('aria-label', `Age ${yearNum}`);
                fragment.appendChild(currentMonthRow);
            }

            const monthStartDateUTC = startOfMonthUTC(addMonthsUTC(birthDateUTC, monthIndex));

            const monthBlock = document.createElement('div');
            monthBlock.classList.add('month-block'); // Class for month-specific styling

            // Determine life stage based on age at the START of this month
            const ageAtMonthStart = calculateAgeAtDate(monthStartDateUTC, birthDateUTC);
            const stageKey = getLifeStageKey(ageAtMonthStart);
            monthBlock.classList.add(`stage-${stageKey}`);

            let stateClass = '';
            const yearOfLife = Math.floor(monthIndex / 12); // Age year
            const monthOfLife = (monthIndex % 12) + 1; // 1-based month index within the age year
            const formattedStart = formatUTCDate(monthStartDateUTC);
            let title = `Age ${yearOfLife}, Month ${monthOfLife} (Starts UTC: ${formattedStart})`;

            // Determine past/present/future by comparing the start date of this month
            // with the start date of the current actual month.
            if (monthStartDateUTC.getTime() === currentMonthStartDateUTC.getTime()) {
                stateClass = 'present'; title += ' (Current month)';
            } else if (monthStartDateUTC < currentMonthStartDateUTC) {
                stateClass = 'past';
            } else {
                stateClass = 'future';
            }

            // Apply state class (past/present/future)
            if (stateClass) monthBlock.classList.add(stateClass);

            monthBlock.title = title;
            // Append the block to the current row (created every 12 iterations)
            if (currentMonthRow) {
                currentMonthRow.appendChild(monthBlock);
                totalRenderedMonths++;
            } else {
                console.warn("Trying to append month block but currentMonthRow is null. MonthIndex:", monthIndex);
            }
        }

        // Append the completed fragment to the specific content area
        gridContentAreaElement.appendChild(fragment);
        console.log(`Total months rendered in grid: ${totalRenderedMonths}`);

    } catch (error) {
        console.error("Error during months-based grid rendering:", error);
        gridContentAreaElement.innerHTML = '<p class="error-message">Error generating months-based grid.</p>';
    }
}

/**
 * Renders the life grid based on years (Years View).
 * Each row represents one decade (10 years). Uses DocumentFragment for performance.
 * @param {Date} inputBirthDate - User's birth date object (UTC normalized).
 * @param {number} totalLifespanYearsEst - Estimated lifespan in years.
 * @param {HTMLElement} gridContentAreaElement - The DOM element to render the grid blocks into.
 */
function renderYearsGrid(inputBirthDate, totalLifespanYearsEst, gridContentAreaElement) {
    if (!gridContentAreaElement) { console.error("Grid content area element not provided."); return; }

    console.log("Rendering Years Grid (Decades)...");
    try {
        // --- Date Setup (UTC) ---
        const birthDateUTC = inputBirthDate; // Already normalized by ui.js
        const todayUTC = getLocalDateUTC();

        // Calculate total years to potentially render (ceiling of estimated lifespan)
        const totalEstimatedYears = Math.ceil(totalLifespanYearsEst);

        // --- Grid Rendering ---
        gridContentAreaElement.innerHTML = ''; // Clear previous content from the specific area
        // Use a DocumentFragment to batch DOM updates for better performance
        const fragment = document.createDocumentFragment();
        let totalRenderedYears = 0;
        let currentDecadeRow = null;

        // Loop through each year index from birth (0) up to the total estimated years
        for (let yearIndex = 0; yearIndex < totalEstimatedYears; yearIndex++) {
            // Create a new row every 10 years (start of a new decade)
            if (yearIndex % 10 === 0) {
                currentDecadeRow = document.createElement('div');
                // Add classes for styling: generic row layout and decade-specific rules
                currentDecadeRow.classList.add('year-row', 'decade-row');
                const decadeStart = Math.floor(yearIndex / 10) * 10; // e.g., 0, 10, 20
                currentDecadeRow.setAttribute('data-decade-start', decadeStart);
                currentDecadeRow.setAttribute('aria-label', `Decade starting Age ${decadeStart}`);
                fragment.appendChild(currentDecadeRow);
            }

            const yearStartDateUTC = addYearsUTC(birthDateUTC, yearIndex);
            const nextYearStartDateUTC = addYearsUTC(birthDateUTC, yearIndex + 1);

            const yearBlock = document.createElement('div');
            yearBlock.classList.add('year-block'); // Class for year-specific styling

            // Determine life stage based on the age for this year block (which is yearIndex)
            const ageForThisYear = yearIndex;
            const stageKey = getLifeStageKey(ageForThisYear);
            yearBlock.classList.add(`stage-${stageKey}`);

            let stateClass = '';
            const formattedStart = formatUTCDate(yearStartDateUTC);
            let title = `Age ${ageForThisYear} (Starts UTC: ${formattedStart})`;

            if (nextYearStartDateUTC <= todayUTC) {
                stateClass = 'past';
            } else if (yearStartDateUTC <= todayUTC) {
                stateClass = 'present'; title += ' (Current year)';
            } else {
                stateClass = 'future';
            }

            // Apply state class
            if (stateClass) yearBlock.classList.add(stateClass);

            yearBlock.title = title;
            // Append the block to the current decade row (created every 10 iterations)
            if (currentDecadeRow) {
                currentDecadeRow.appendChild(yearBlock);
                totalRenderedYears++;
            } else {
                console.warn("Trying to append year block but currentDecadeRow is null. YearIndex:", yearIndex);
            }
        }

        // Append the completed fragment to the specific content area
        gridContentAreaElement.appendChild(fragment);
        console.log(`Total years rendered in grid: ${totalRenderedYears}`);

    } catch (error) {
        console.error("Error during years-based grid rendering:", error);
        gridContentAreaElement.innerHTML = '<p class="error-message">Error generating years-based grid.</p>';
    }
}

// Export ALL rendering functions and select helpers for testing/pure logic
export { renderAgeGrid, renderCalendarGrid, renderMonthsGrid, renderYearsGrid, getLifeStageKey, calculateAgeAtDate };
