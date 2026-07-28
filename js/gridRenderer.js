/**
 * @module gridRenderer
 * @description Generates and renders HTML for life visualization grids (weeks, months, years).
 * Handles layout logic for each view type and applies CSS classes for styling based
 * on life stage and time (past, present, future).
 *
 * Exports: `renderAgeGrid`, `renderCalendarGrid`, `renderMonthsGrid`, `renderYearsGrid`.
 *
 * Relies on the global `dateFns` object (v4.1.0+) for UTC-based date calculations.
 * Expects input `birthDate` to be pre-normalized to UTC midnight by the calling module.
 * Defines `LIFE_STAGES` and helper functions internally. Uses `DocumentFragment` for
 * efficient DOM manipulation. Renders content into a specific `gridContentAreaElement`.
 */


// --- Constants ---
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

// Helper: normalize a Date to UTC midnight deterministically, independent of local timezone.
function toUTCStartOfDay(date) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function addYearsUTC(date, years) {
    const targetMonthIndex = date.getUTCMonth() + Math.trunc(years * 12);
    const targetYear = date.getUTCFullYear() + Math.floor(targetMonthIndex / 12);
    const targetMonth = ((targetMonthIndex % 12) + 12) % 12;
    const lastDayOfTargetMonth = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate();
    return new Date(Date.UTC(
        targetYear,
        targetMonth,
        Math.min(date.getUTCDate(), lastDayOfTargetMonth)
    ));
}

function startOfISOWeekUTC(date) {
    const weekStart = toUTCStartOfDay(date);
    const daysSinceMonday = (weekStart.getUTCDay() + 6) % 7;
    weekStart.setUTCDate(weekStart.getUTCDate() - daysSinceMonday);
    return weekStart;
}

function getISOWeekYearUTC(date) {
    const thursday = startOfISOWeekUTC(date);
    thursday.setUTCDate(thursday.getUTCDate() + 3);
    return thursday.getUTCFullYear();
}

function getISOWeekStartUTC(isoYear, weekNumber = 1) {
    const firstWeekStart = startOfISOWeekUTC(new Date(Date.UTC(isoYear, 0, 4)));
    firstWeekStart.setUTCDate(firstWeekStart.getUTCDate() + ((weekNumber - 1) * 7));
    return firstWeekStart;
}

function getISOWeeksInYearUTC(isoYear) {
    const currentYearStart = getISOWeekStartUTC(isoYear);
    const nextYearStart = getISOWeekStartUTC(isoYear + 1);
    return Math.round((nextYearStart - currentYearStart) / (7 * 24 * 60 * 60 * 1000));
}

function formatUTCDate(date) {
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}

// Helper: Get stage key based on age. (Used for styling blocks)
function getLifeStageKey(age) {
    for (const stage of LIFE_STAGES) {
        if (age <= stage.maxAge) {
            return stage.key;
        }
    }
    return LIFE_STAGES[LIFE_STAGES.length - 1].key; // Default to last stage if somehow needed
}

// --- Helper: Check if date-fns is loaded ---
// Ensures the required global library is present before attempting rendering.
function checkDateFns() {
    if (typeof dateFns === 'undefined' || typeof dateFns.startOfDay === 'undefined') {
        console.error("date-fns v4.1.0 library or key functions not loaded!");
        return false;
    }
    // date-fns-tz provides timezone helpers; it's attached to global as dateFnsTz when loaded via CDN
    if (typeof dateFnsTz === 'undefined' || typeof dateFnsTz.formatInTimeZone === 'undefined') {
        console.warn('date-fns-tz not found; timezone-aware formatting may be unavailable.');
    }
    // If a version string is provided, validate it; otherwise proceed silently.
    if (typeof dateFns.version === 'string') {
        if (!dateFns.version.startsWith('4.')) {
            console.warn(`date-fns object found, but version (${dateFns.version}) might not be v4.1.0+. Ensure correct CDN script is loaded.`);
        } else {
            console.log("Using date-fns version:", dateFns.version);
        }
    } else {
        // Tests or non-CDN environments may provide a mocked dateFns without a version.
        console.log("date-fns object found (version unknown). Proceeding.");
    }
    return true;
}

// --- Helper: Calculate age at a specific date ---
// Needed for determining life stage in calendar/month views where the block's
// corresponding date changes relative to the birth date. Uses UTC methods.
function calculateAgeAtDate(currentDateUTC, birthDateUTC) {
    let age = currentDateUTC.getUTCFullYear() - birthDateUTC.getUTCFullYear();
    const monthDiff = currentDateUTC.getUTCMonth() - birthDateUTC.getUTCMonth();
    if (monthDiff < 0 || (monthDiff === 0 && currentDateUTC.getUTCDate() < birthDateUTC.getUTCDate())) {
        age--;
    }
    return Math.max(0, age);
}

/**
 * Renders the life grid based on years of age (Age View).
 * Each row represents one year of age. Uses DocumentFragment for performance.
 * @param {Date} inputBirthDate - User's birth date object (UTC normalized).
 * @param {number} totalLifespanYearsEst - Estimated lifespan in years.
 * @param {HTMLElement} gridContentAreaElement - The DOM element to render the grid blocks into.
 */
function renderAgeGrid(inputBirthDate, totalLifespanYearsEst, gridContentAreaElement) {
    if (!checkDateFns()) {
        if (gridContentAreaElement) gridContentAreaElement.innerHTML = '<p class="error-message">Error: Date library failed to load.</p>';
        return;
    }
    if (!gridContentAreaElement) { console.error("Grid content area element not provided."); return; }

    console.log("Rendering Age Grid...");
    try {
        // --- Date Setup (UTC) ---
        // Ensure all date operations use UTC to avoid timezone/DST issues.
        const birthDateUTC = inputBirthDate; // Already normalized by ui.js
        // Use date-fns-tz to ensure UTC normalization when available; fall back to core date-fns
        const nowUTC = toUTCStartOfDay(new Date());
        const currentActualWeekStartDateUTC = dateFns.startOfISOWeek(nowUTC);
        const estimatedEndDateRough = dateFns.addYears(birthDateUTC, totalLifespanYearsEst);
        const estimatedEndDateUTC = toUTCStartOfDay(estimatedEndDateRough);


        // --- Grid Rendering ---
        gridContentAreaElement.innerHTML = ''; // Clear previous content from the specific area
        // Use a DocumentFragment to batch DOM updates for better performance
        const fragment = document.createDocumentFragment();
        let totalRenderedWeeks = 0;
        const totalYearsToRender = Math.ceil(totalLifespanYearsEst);

        for (let age = 0; age < totalYearsToRender; age++) {
            const ageRow = document.createElement('div');
            ageRow.classList.add('year-row'); // Use same class for styling consistency
            ageRow.setAttribute('data-age', age);
            ageRow.setAttribute('aria-label', `Age ${age}`);

            const ageStartDateUTC = toUTCStartOfDay(dateFns.addYears(birthDateUTC, age));
            const ageEndDateExclusiveUTC = toUTCStartOfDay(dateFns.addYears(birthDateUTC, age + 1));

            const stageKey = getLifeStageKey(age);

            // === Week Generation Logic for Age View ===
            // This section ensures accurate week representation for each year of age,
            // handling the 52/53 week variation and edge cases near birthdays.
            // 1. Get all ISO weeks overlapping the interval [ageStartDate, ageEndDateExclusive).
            // 2. Filter to keep only weeks starting strictly BEFORE the next birthday (ageEndDateExclusive).
            // 3. If the filtered list has 54 weeks (rare edge case), remove the last one
            //    to enforce a visual maximum of 53 weeks per row.
            let weeksInAgeYearRaw = []; // Weeks overlapping the interval
            let weeksInAgeYearFiltered = []; // Weeks starting strictly before next birthday
            let weeksInAgeYearFinal = []; // Max 53 weeks for display

            if (dateFns.isBefore(ageStartDateUTC, ageEndDateExclusiveUTC)) {
                // Step 1: Get overlapping weeks (Monday starts)
                weeksInAgeYearRaw = dateFns.eachWeekOfInterval({
                    start: ageStartDateUTC,
                    end: ageEndDateExclusiveUTC
                }, { weekStartsOn: 1 }); // 1 = Monday for ISO

                // Step 2: Filter weeks starting before the next birthday
                weeksInAgeYearFiltered = weeksInAgeYearRaw.filter(weekStart =>
                    dateFns.isBefore(weekStart, ageEndDateExclusiveUTC)
                );

                // Step 3: Enforce max 53 weeks visually
                weeksInAgeYearFinal = [...weeksInAgeYearFiltered]; // Copy the array
                if (weeksInAgeYearFinal.length === 54) {
                    console.warn(`Age ${age}: Filtered list had 54 weeks. Removing the last week (${dateFns.format(weeksInAgeYearFinal[weeksInAgeYearFinal.length - 1], 'yyyy-MM-dd')}) to enforce max 53.`);
                    weeksInAgeYearFinal.pop(); // Remove the last element
                }
            } else {
                 console.warn(`Age ${age}: Start date not before end date. Skipping row.`);
            }

            let weekInAgeYearIndex = 0;
            for (const currentRenderWeekStartDateUTC of weeksInAgeYearFinal) {
                // Ensure the week start is not after the estimated end of life
                 if (dateFns.isAfter(currentRenderWeekStartDateUTC, estimatedEndDateUTC)) {
                    continue; // Don't render blocks past the estimated end date
                 }

                const weekBlock = document.createElement('div');
                weekBlock.classList.add('week-block');
                weekBlock.classList.add(`stage-${stageKey}`);
                let stateClass = '';
                    // Use date-fns-tz.formatInTimeZone for timezone-aware formatting if available
                    let formattedStart = (typeof dateFnsTz !== 'undefined' && dateFnsTz.formatInTimeZone)
                        ? dateFnsTz.formatInTimeZone(currentRenderWeekStartDateUTC, 'UTC', 'yyyy-MM-dd')
                        : dateFns.format(currentRenderWeekStartDateUTC, 'yyyy-MM-dd');
                    let title = `Age ${age}, Week ${weekInAgeYearIndex + 1} (Starts UTC: ${formattedStart})`;

                // Determine state (past/present/future) by comparing week start dates
                if (currentRenderWeekStartDateUTC.getTime() === currentActualWeekStartDateUTC.getTime()) {
                    stateClass = 'present'; title += ' (Current week)';
                } else if (dateFns.isBefore(currentRenderWeekStartDateUTC, currentActualWeekStartDateUTC)) {
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

        // Append the completed fragment to the specific content area
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
    if (!checkDateFns()) {
        if (gridContentAreaElement) gridContentAreaElement.innerHTML = '<p class="error-message">Error: Date library failed to load.</p>';
        return;
    }
    if (!gridContentAreaElement) { console.error("Grid content area element not provided."); return; }

    console.log("Rendering Calendar Grid...");
    try {
        // --- Date Setup (UTC) ---
        const birthDateUTC = inputBirthDate; // Already normalized by ui.js
        const nowUTC = toUTCStartOfDay(new Date());
        const estimatedEndDateUTC = addYearsUTC(birthDateUTC, totalLifespanYearsEst);
        const startISOYear = getISOWeekYearUTC(birthDateUTC);
        const endISOYear = getISOWeekYearUTC(estimatedEndDateUTC);
        // Determine the start of the ISO week containing the birth date
        const firstWeekStartDateUTC = startOfISOWeekUTC(birthDateUTC);
        // Determine the start of the current ISO week
        const currentActualWeekStartDateUTC = startOfISOWeekUTC(nowUTC);

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
                if (dateFns.isBefore(currentRenderWeekStartDateUTC, firstWeekStartDateUTC) || dateFns.isAfter(currentRenderWeekStartDateUTC, estimatedEndDateUTC)) {
                    stateClass = 'out-of-bounds'; title += ' (Outside lifespan)';
                } else { // Within lifespan, check past/present/future
                    if (currentRenderWeekStartDateUTC.getTime() === currentActualWeekStartDateUTC.getTime()) {
                        stateClass = 'present'; title += ' (Current week)';
                    } else if (dateFns.isBefore(currentRenderWeekStartDateUTC, currentActualWeekStartDateUTC)) {
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
    if (!checkDateFns()) {
        if (gridContentAreaElement) gridContentAreaElement.innerHTML = '<p class="error-message">Error: Date library failed to load.</p>';
        return;
    }
    if (!gridContentAreaElement) { console.error("Grid content area element not provided."); return; }

    console.log("Rendering Months Grid...");
    try {
        // --- Date Setup (UTC) ---
        const birthDateUTC = inputBirthDate; // Already normalized by ui.js
        const nowUTC = toUTCStartOfDay(new Date());
        const estimatedEndDateRough = dateFns.addYears(birthDateUTC, totalLifespanYearsEst);
        const estimatedEndDateUTC = toUTCStartOfDay(estimatedEndDateRough);

        // Calculate the start of the *current* month in UTC for comparison
        const currentMonthStartDateUTC = dateFns.startOfMonth(nowUTC);

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

            // Calculate the start date of this specific month in the person's life
            // Add 'monthIndex' months to the birth date, then find the start of that month.
            const monthStartDateUTC = dateFns.startOfMonth(dateFns.addMonths(birthDateUTC, monthIndex));

            // Don't render blocks for months that start after the estimated end date
            if (dateFns.isAfter(monthStartDateUTC, estimatedEndDateUTC)) {
                continue;
            }

            const monthBlock = document.createElement('div');
            monthBlock.classList.add('month-block'); // Class for month-specific styling

            // Determine life stage based on age at the START of this month
            const ageAtMonthStart = calculateAgeAtDate(monthStartDateUTC, birthDateUTC);
            const stageKey = getLifeStageKey(ageAtMonthStart);
            monthBlock.classList.add(`stage-${stageKey}`);

            let stateClass = '';
            const yearOfLife = Math.floor(monthIndex / 12); // Age year
            const monthOfLife = (monthIndex % 12) + 1; // 1-based month index within the age year
            let formattedStart = (typeof dateFnsTz !== 'undefined' && dateFnsTz.formatInTimeZone)
                ? dateFnsTz.formatInTimeZone(monthStartDateUTC, 'UTC', 'yyyy-MM-dd')
                : dateFns.format(monthStartDateUTC, 'yyyy-MM-dd');
            let title = `Age ${yearOfLife}, Month ${monthOfLife} (Starts UTC: ${formattedStart})`;

            // Determine past/present/future by comparing the start date of this month
            // with the start date of the current actual month.
            if (monthStartDateUTC.getTime() === currentMonthStartDateUTC.getTime()) {
                stateClass = 'present'; title += ' (Current month)';
            } else if (dateFns.isBefore(monthStartDateUTC, currentMonthStartDateUTC)) {
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
    if (!checkDateFns()) {
        if (gridContentAreaElement) gridContentAreaElement.innerHTML = '<p class="error-message">Error: Date library failed to load.</p>';
        return;
    }
    if (!gridContentAreaElement) { console.error("Grid content area element not provided."); return; }

    console.log("Rendering Years Grid (Decades)...");
    try {
        // --- Date Setup (UTC) ---
        const birthDateUTC = inputBirthDate; // Already normalized by ui.js
        const nowUTC = toUTCStartOfDay(new Date());
        const estimatedEndDateRough = dateFns.addYears(birthDateUTC, totalLifespanYearsEst);
        const estimatedEndDateUTC = toUTCStartOfDay(estimatedEndDateRough);

        // Calculate current age in whole years for state determination (past/present/future)
        const currentAge = calculateAgeAtDate(nowUTC, birthDateUTC);

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

            // Calculate the start date of this specific year of life
            const yearStartDateUTC = toUTCStartOfDay(dateFns.addYears(birthDateUTC, yearIndex));

            // Don't render blocks for years that start after the estimated end date
            // Note: A year block represents the *entire* year starting at yearIndex
            if (dateFns.isAfter(yearStartDateUTC, estimatedEndDateUTC)) {
                continue;
            }

            const yearBlock = document.createElement('div');
            yearBlock.classList.add('year-block'); // Class for year-specific styling

            // Determine life stage based on the age for this year block (which is yearIndex)
            const ageForThisYear = yearIndex;
            const stageKey = getLifeStageKey(ageForThisYear);
            yearBlock.classList.add(`stage-${stageKey}`);

            let stateClass = '';
            let formattedStart = (typeof dateFnsTz !== 'undefined' && dateFnsTz.formatInTimeZone)
                ? dateFnsTz.formatInTimeZone(yearStartDateUTC, 'UTC', 'yyyy-MM-dd')
                : dateFns.format(yearStartDateUTC, 'yyyy-MM-dd');
            let title = `Age ${ageForThisYear} (Starts UTC: ${formattedStart})`;

            // Determine past/present/future based on comparing the age represented by this block
            // with the pre-calculated current age.
            if (ageForThisYear < currentAge) {
                stateClass = 'past';
            } else if (ageForThisYear === currentAge) {
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
