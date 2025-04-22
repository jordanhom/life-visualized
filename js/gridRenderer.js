// js/gridRenderer.js

// --- Constants ---
const UTC_TIMEZONE = 'UTC';

// --- Helper: Check if date-fns is loaded ---
function checkDateFns() {
    if (typeof dateFns === 'undefined' || typeof dateFns.startOfDay === 'undefined') {
        console.error("date-fns v4.1.0 library or key functions not loaded!");
        return false;
    }
    // Use optional chaining and check for a specific function expected in v4.1.0
    if (!dateFns?.version?.startsWith('4.')) {
         console.warn(`date-fns object found, but version (${dateFns?.version}) might not be v4.1.0+. Ensure correct CDN script is loaded.`);
         // Allow proceeding but be cautious
    } else {
        console.log("Using date-fns version:", dateFns.version);
    }
    return true;
}

/**
 * Renders the life grid based on years of age (Age View).
 * Each row represents one year of age (e.g., Age 0, Age 1, ...).
 * @param {Date} inputBirthDate - User's birth date object.
 * @param {number} totalLifespanYearsEst - Estimated lifespan in years.
 * @param {HTMLElement} gridContainerElement - The DOM element for the grid.
 */
function renderAgeGrid(inputBirthDate, totalLifespanYearsEst, gridContainerElement) {
    if (!checkDateFns()) {
        if (gridContainerElement) gridContainerElement.innerHTML = '<p class="error-message">Error: Date library failed to load.</p>';
        return;
    }
    if (!gridContainerElement) { console.error("Grid container not provided."); return; }

    console.log("Rendering Age Grid...");
    try {
        // --- Date Setup (UTC) ---
        const year = inputBirthDate.getFullYear();
        const month = inputBirthDate.getMonth();
        const day = inputBirthDate.getDate();
        const birthDateUTC = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
        const nowUTC = dateFns.startOfDay(new Date(), { timeZone: UTC_TIMEZONE });
        const currentActualWeekStartDateUTC = dateFns.startOfISOWeek(nowUTC);
        const estimatedEndDateRough = dateFns.addYears(birthDateUTC, totalLifespanYearsEst);
        const estimatedEndDateUTC = dateFns.startOfDay(estimatedEndDateRough, { timeZone: UTC_TIMEZONE });

        // --- Grid Rendering ---
        gridContainerElement.innerHTML = '';
        const fragment = document.createDocumentFragment();
        let totalRenderedWeeks = 0;
        const totalYearsToRender = Math.ceil(totalLifespanYearsEst);

        for (let age = 0; age < totalYearsToRender; age++) {
            const ageRow = document.createElement('div');
            ageRow.classList.add('year-row'); // Use same class for styling consistency
            ageRow.setAttribute('data-age', age);

            const ageStartDateUTC = dateFns.startOfDay(dateFns.addYears(birthDateUTC, age), { timeZone: UTC_TIMEZONE });
            const ageEndDateExclusiveUTC = dateFns.startOfDay(dateFns.addYears(birthDateUTC, age + 1), { timeZone: UTC_TIMEZONE });

            let weeksInAgeYear = [];
            if (dateFns.isBefore(ageStartDateUTC, ageEndDateExclusiveUTC)) {
                // End the interval on the day *before* the next birthday
                const ageIntervalEndDateUTC = dateFns.subDays(ageEndDateExclusiveUTC, 1);

                // Use eachWeekOfInterval with the adjusted end date
                weeksInAgeYear = dateFns.eachWeekOfInterval({
                    start: ageStartDateUTC,
                    end: ageIntervalEndDateUTC // Use the day BEFORE the next birthday
                }, { weekStartsOn: 1 }); // 1 = Monday for ISO

                // Add logging to check the count right after generation
                if (weeksInAgeYear.length > 53) {
                    console.warn(`Age ${age}: Unexpected week count (${weeksInAgeYear.length}) AFTER interval adjustment. Start: ${dateFns.format(ageStartDateUTC, 'yyyy-MM-dd')}, End: ${dateFns.format(ageIntervalEndDateUTC, 'yyyy-MM-dd')}`);
                    // Log the generated dates if the count is still wrong
                    console.log("Generated week dates:", weeksInAgeYear.map(d => dateFns.format(d, 'yyyy-MM-dd')));
                }

                // === NO LONGER NEED THE FILTER ===
                // Since the interval now correctly excludes the next birthday,
                // the filter is likely redundant. Let's remove it for now.
                // weeksInAgeYear = weeksInAgeYear.filter(weekStart =>
                //     dateFns.isBefore(weekStart, ageEndDateExclusiveUTC)
                // );
            } else {
                 console.warn(`Age ${age}: Start date not before end date. Skipping row.`);
            }

            let weekInAgeYearIndex = 0;
            for (const currentRenderWeekStartDateUTC of weeksInAgeYear) {
                // Ensure the week start is not after the estimated end of life
                 if (dateFns.isAfter(currentRenderWeekStartDateUTC, estimatedEndDateUTC)) {
                    continue; // Don't render blocks past the estimated end date
                 }

                const weekBlock = document.createElement('div');
                weekBlock.classList.add('week-block');
                let stateClass = '';
                let title = `Age ${age}, Week ${weekInAgeYearIndex + 1} (Starts UTC: ${dateFns.format(currentRenderWeekStartDateUTC, 'yyyy-MM-dd', { timeZone: UTC_TIMEZONE })})`;

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

        gridContainerElement.appendChild(fragment);
        gridContainerElement.setAttribute('aria-label', `Life grid (Age View) showing estimated lifespan from Age 0 to ${totalYearsToRender - 1}.`);
        console.log(`Total weeks rendered in age grid: ${totalRenderedWeeks}`);

    } catch (error) {
        console.error("Error during age-based grid rendering:", error);
        gridContainerElement.innerHTML = '<p class="error-message">Error generating age-based grid.</p>';
    }
}


/**
 * Renders the life grid based on ISO Calendar Years (Calendar View).
 * Each row represents one ISO year (e.g., 2023, 2024, ...).
 * Includes 'out-of-bounds' styling for weeks outside the lifespan.
 * @param {Date} inputBirthDate - User's birth date object.
 * @param {number} totalLifespanYearsEst - Estimated lifespan in years.
 * @param {HTMLElement} gridContainerElement - The DOM element for the grid.
 */
function renderCalendarGrid(inputBirthDate, totalLifespanYearsEst, gridContainerElement) {
    if (!checkDateFns()) {
        if (gridContainerElement) gridContainerElement.innerHTML = '<p class="error-message">Error: Date library failed to load.</p>';
        return;
    }
     if (!gridContainerElement) { console.error("Grid container not provided."); return; }

    console.log("Rendering Calendar Grid...");
    try {
        // --- Date Setup (UTC) ---
        const year = inputBirthDate.getFullYear();
        const month = inputBirthDate.getMonth();
        const day = inputBirthDate.getDate();
        const birthDateUTC = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
        const nowUTC = dateFns.startOfDay(new Date(), { timeZone: UTC_TIMEZONE });
        const estimatedEndDateRough = dateFns.addYears(birthDateUTC, totalLifespanYearsEst);
        const estimatedEndDateUTC = dateFns.startOfDay(estimatedEndDateRough, { timeZone: UTC_TIMEZONE });
        const startISOYear = dateFns.getISOWeekYear(birthDateUTC);
        const endISOYear = dateFns.getISOWeekYear(estimatedEndDateUTC);
        const firstWeekStartDateUTC = dateFns.startOfISOWeek(birthDateUTC);
        const currentActualWeekStartDateUTC = dateFns.startOfISOWeek(nowUTC);

        // --- Grid Rendering ---
        gridContainerElement.innerHTML = '';
        const fragment = document.createDocumentFragment();
        let totalRenderedWeeks = 0;

        for (let isoYear = startISOYear; isoYear <= endISOYear; isoYear++) {
            const yearRow = document.createElement('div');
            yearRow.classList.add('year-row'); // Use same class
            yearRow.setAttribute('data-year', isoYear); // Add calendar year data attribute

            const dateForYearContext = new Date(Date.UTC(isoYear, 0, 4));
            const weeksInThisYear = dateFns.getISOWeeksInYear(dateForYearContext);

            for (let weekNum = 1; weekNum <= weeksInThisYear; weekNum++) {
                let currentRenderWeekStartDateUTC;
                try {
                    let tempDate = dateFns.setISOWeekYear(dateForYearContext, isoYear);
                    tempDate = dateFns.setISOWeek(tempDate, weekNum);
                    currentRenderWeekStartDateUTC = dateFns.startOfISOWeek(tempDate);
                } catch (e) {
                    currentRenderWeekStartDateUTC = null;
                }

                if (!currentRenderWeekStartDateUTC) continue;

                const weekBlock = document.createElement('div');
                weekBlock.classList.add('week-block');
                let stateClass = '';
                let title = `Year ${isoYear}, Week ${weekNum} (Starts UTC: ${dateFns.format(currentRenderWeekStartDateUTC, 'yyyy-MM-dd', { timeZone: UTC_TIMEZONE })})`;

                // Check Out of Bounds first
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

        gridContainerElement.appendChild(fragment);
        gridContainerElement.setAttribute('aria-label', `Life grid (Calendar View) showing estimated lifespan from ${startISOYear} to ${endISOYear}.`);
        console.log(`Total weeks rendered in calendar grid: ${totalRenderedWeeks}`);

    } catch (error) {
        console.error("Error during calendar-based grid rendering:", error);
        gridContainerElement.innerHTML = '<p class="error-message">Error generating calendar-based grid.</p>';
    }
}

// Export both rendering functions
export { renderAgeGrid, renderCalendarGrid };
