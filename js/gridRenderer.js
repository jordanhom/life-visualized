// js/gridRenderer.js

// --- Constants ---
const UTC_TIMEZONE = 'UTC'; // Define UTC timezone identifier as per IANA standard

/**
 * Renders the life grid with accurate weeks per year (52 or 53).
 * Each row represents one ISO week-numbering year.
 * Uses date-fns v4.1.0 (via global `dateFns` object from CDN) and UTC for internal calculations.
 *
 * @param {Date} inputBirthDate - The user's birth date object (from input, local time).
 * @param {number} totalLifespanYearsEst - Total estimated lifespan in years.
 * @param {HTMLElement} gridContainerElement - The DOM element to render the grid into.
 */
function renderWeekGrid(inputBirthDate, totalLifespanYearsEst, gridContainerElement) {
    // --- Check if date-fns is loaded ---
    if (typeof dateFns === 'undefined' || typeof dateFns.startOfDay === 'undefined') {
        console.error("date-fns v4.1.0 library or key functions not loaded! Check CDN link and integrity hash in index.html.");
        if (gridContainerElement) {
            gridContainerElement.innerHTML = '<p class="error-message">Error: Date library failed to load.</p>';
        }
        return;
    }
    if (!gridContainerElement) {
        console.error("Grid container element not provided.");
        return;
    }

    console.log("Using date-fns version:", dateFns.version); // Log the loaded version

    try {
        // --- Date Setup (Using UTC) ---

        // 1. Normalize Birth Date to UTC Midnight
        // Construct Date object representing midnight UTC for the given birth date parts.
        // Date.UTC() returns a timestamp, new Date() converts it back to a Date object in UTC context.
        const year = inputBirthDate.getFullYear();
        const month = inputBirthDate.getMonth(); // 0-indexed
        const day = inputBirthDate.getDate();
        const birthDateUTC = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));

        // 2. Get Current Date as UTC Midnight
        // Use startOfDay with UTC timezone option (confirmed in v4 docs)
        const nowUTC = dateFns.startOfDay(new Date(), { timeZone: UTC_TIMEZONE });

        // 3. Calculate Estimated End Date in UTC
        // addYears works on the Date object representing UTC time
        const estimatedEndDateRough = dateFns.addYears(birthDateUTC, totalLifespanYearsEst);
        // Ensure the end date is also considered at UTC midnight
        const estimatedEndDateUTC = dateFns.startOfDay(estimatedEndDateRough, { timeZone: UTC_TIMEZONE });

        // 4. Determine ISO Year Range (based on UTC dates)
        // getISOWeekYear works on Date objects; assumes UTC context is maintained
        const startISOYear = dateFns.getISOWeekYear(birthDateUTC);
        const endISOYear = dateFns.getISOWeekYear(estimatedEndDateUTC);

        // 5. Find Start of Birth Week and Current Week in UTC
        // startOfISOWeek works on Date objects; assumes UTC context is maintained
        const firstWeekStartDateUTC = dateFns.startOfISOWeek(birthDateUTC);
        const currentActualWeekStartDateUTC = dateFns.startOfISOWeek(nowUTC);

        // Logging for verification (format confirmed to accept timezone option in v4)
        console.log(`Rendering Grid (UTC): Birth=${dateFns.format(birthDateUTC, 'yyyy-MM-dd', { timeZone: UTC_TIMEZONE })}, Now=${dateFns.format(nowUTC, 'yyyy-MM-dd', { timeZone: UTC_TIMEZONE })}, Est. End=${dateFns.format(estimatedEndDateUTC, 'yyyy-MM-dd', { timeZone: UTC_TIMEZONE })}`);
        console.log(`ISO Year Range: ${startISOYear} to ${endISOYear}`);

        // --- Grid Rendering ---
        gridContainerElement.innerHTML = ''; // Clear previous grid
        const fragment = document.createDocumentFragment(); // Use fragment for performance
        let totalRenderedWeeks = 0;

        // Loop through each ISO year in the estimated lifespan
        for (let isoYear = startISOYear; isoYear <= endISOYear; isoYear++) {
            const yearRow = document.createElement('div');
            yearRow.classList.add('year-row');

            // Get weeks in this ISO year. Need a date within the target year for context.
            // Jan 4th is always in week 1. Use UTC date.
            const dateForYearContext = new Date(Date.UTC(isoYear, 0, 4)); // Jan 4th UTC
            const weeksInThisYear = dateFns.getISOWeeksInYear(dateForYearContext); // Assumes v4 function exists

            // Loop through each week of the current ISO year
            for (let weekNum = 1; weekNum <= weeksInThisYear; weekNum++) {
                // Calculate the start date of the specific week (in UTC)
                let currentRenderWeekStartDateUTC;
                try {
                    // Set the ISO year and week number on our context date
                    let tempDate = dateFns.setISOWeekYear(dateForYearContext, isoYear); // Assumes v4 function exists
                    tempDate = dateFns.setISOWeek(tempDate, weekNum); // Assumes v4 function exists
                    // Get the start of that ISO week (should maintain UTC context)
                    currentRenderWeekStartDateUTC = dateFns.startOfISOWeek(tempDate);
                } catch (e) {
                    console.error(`Error calculating UTC date for Year ${isoYear}, Week ${weekNum}`, e);
                    currentRenderWeekStartDateUTC = null; // Handle potential errors during date calculation
                }

                // Skip rendering if date calculation failed
                if (!currentRenderWeekStartDateUTC) continue;

                const weekBlock = document.createElement('div');
                weekBlock.classList.add('week-block');

                // --- Determine State & Apply Classes (Comparing UTC dates) ---
                let stateClass = '';
                // Tooltip formatting (use format with UTC timezone)
                let title = `Year ${isoYear}, Week ${weekNum} (Starts UTC: ${dateFns.format(currentRenderWeekStartDateUTC, 'yyyy-MM-dd', { timeZone: UTC_TIMEZONE })})`;

                // 1. Check Out of Bounds (using UTC dates)
                // isBefore/isAfter compare timestamps
                if (dateFns.isBefore(currentRenderWeekStartDateUTC, firstWeekStartDateUTC) || dateFns.isAfter(currentRenderWeekStartDateUTC, estimatedEndDateUTC)) {
                    stateClass = 'out-of-bounds';
                    title += ' (Outside lifespan)';
                } else {
                    // 2. Check Past, Present, Future (comparing UTC week start timestamps)
                    // Use getTime() for precise comparison of the exact moment the week starts
                    if (currentRenderWeekStartDateUTC.getTime() === currentActualWeekStartDateUTC.getTime()) {
                         stateClass = 'present';
                         title += ' (Current week)';
                    } else if (dateFns.isBefore(currentRenderWeekStartDateUTC, currentActualWeekStartDateUTC)) {
                        stateClass = 'past';
                    } else {
                        stateClass = 'future';
                    }
                }

                // Apply the determined state class
                if (stateClass) {
                    weekBlock.classList.add(stateClass);
                }
                // Set the tooltip
                weekBlock.title = title;

                // Add the week block to the current year row
                yearRow.appendChild(weekBlock);
                totalRenderedWeeks++;
            } // End week loop

            // Add the completed year row to the fragment
            fragment.appendChild(yearRow);
        } // End year loop

        // Append the entire fragment to the grid container in one DOM operation
        gridContainerElement.appendChild(fragment);

        // --- Accessibility ---
        // Update ARIA label with formatted UTC dates
        gridContainerElement.setAttribute('aria-label', `Life grid showing estimated lifespan from ${dateFns.format(birthDateUTC, 'yyyy', { timeZone: UTC_TIMEZONE })} to ${dateFns.format(estimatedEndDateUTC, 'yyyy', { timeZone: UTC_TIMEZONE })} (UTC). Each row represents a year (${startISOYear}-${endISOYear}), containing 52 or 53 weeks.`);
        console.log(`Total weeks rendered in grid structure: ${totalRenderedWeeks}`);

    } catch (error) {
        // Catch errors during the entire rendering process
        console.error("Error during grid rendering with date-fns v4.1.0:", error);
        gridContainerElement.innerHTML = '<p class="error-message">Sorry, an error occurred while generating the life grid. Check console for details.</p>';
    }
}

// Export the main function for use in ui.js
export { renderWeekGrid };
