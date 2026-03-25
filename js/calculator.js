/**
 * @module calculator
 * @description Provides core calculation functions: determining current age in whole
 * years and looking up estimated remaining life expectancy from actuarial data.
 *
 * Exports: `calculateCurrentAge`, `getRemainingExpectancy`.
 *
 * Relies on `lifeExpectancyData` imported from `data.js`.
 */

/**
 * Calculates current age in whole years using UTC components.
 *
 * NOTE: The project uses UTC-normalized dates across modules to avoid
 * timezone and DST-related inconsistencies. Tests freeze system time
 * (vitest fake timers), and using UTC getters ensures behavior is
 * deterministic regardless of the machine's local timezone.
 *
 * @param {Date} birthDate - UTC-normalized birth date (Date).
 * @returns {number} Age in completed years (>= 0).
 */
function calculateCurrentAge(birthDate) {
    // Validate input
    if (!(birthDate instanceof Date) || isNaN(birthDate)) {
        throw new Error('Invalid birthDate provided to calculateCurrentAge');
    }
    
    // Use UTC-based components to avoid timezone/DST surprises and to match
    // the rest of the codebase (gridRenderer uses UTC date-fns helpers).
    const now = new Date();
    let age = now.getUTCFullYear() - birthDate.getUTCFullYear();
    const monthDiff = now.getUTCMonth() - birthDate.getUTCMonth();

    // Decrement age if the current UTC date is before the birthday in the current year.
    // Using UTC dates prevents off-by-one results when local timezone shifts the local date
    // relative to the intended UTC midnight stored in birthDate.
    if (monthDiff < 0 || (monthDiff === 0 && now.getUTCDate() < birthDate.getUTCDate())) {
        age--;
    }

    // Ensure non-negative age for future birth dates; caller (ui.js) should validate input,
    // but this guard keeps the function robust and easy to test.
    return Math.max(0, age);
}

/**
 * Looks up the estimated remaining life expectancy based on age and sex.
 * Uses the imported `lifeExpectancyData`.
 * @param {number} age - Current age in years.
 * @param {string} sex - 'male' or 'female'.
 * @param {object|null} [dataOverride=null] - Optional explicit dataset override for tests.
 * @returns {Promise<number|null>} Estimated remaining years, or null if not found.
 */

/**
 * Helper function to find the applicable age bracket efficiently
 * @private
 * @param {number[]} sortedBrackets - Sorted array of age brackets
 * @param {number} lookupAge - Age to look up
 * @returns {number|null} The highest bracket <= lookupAge, or null if none found
 */
function _findApplicableBracket(sortedBrackets, lookupAge) {
    // Binary search for the largest bracket <= lookupAge
    let left = 0;
    let right = sortedBrackets.length - 1;
    let result = null;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (sortedBrackets[mid] <= lookupAge) {
            result = sortedBrackets[mid];
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return result;
}

async function getRemainingExpectancy(age, sex, dataOverride = null) {
    // Validate inputs
    if (typeof age !== 'number' || !Number.isFinite(age)) {
        throw new Error('Invalid age provided to getRemainingExpectancy');
    }
    
    if (typeof sex !== 'string' || !['male', 'female'].includes(sex)) {
        throw new Error('Invalid sex provided to getRemainingExpectancy. Must be "male" or "female"');
    }

    const lifeExpectancyData = dataOverride ?? (await import('./data.js')).lifeExpectancyData;
    
    const sexData = lifeExpectancyData[sex];
    if (!sexData) {
        return null;
    }
    
    // Ensure age used for lookup is non-negative
    const lookupAge = Math.max(0, age);

    // Build sorted, numeric age bracket list ascending (e.g., [0, 10, 20, ... 100])
    const ageBracketsAsc = Object.keys(sexData)
        .map(Number)
        .filter(Number.isFinite)
        .sort((a, b) => a - b);

    if (ageBracketsAsc.length === 0) {
        return null;
    }

    // Find the highest bracket that is less than or equal to lookupAge.
    // If none exists (all defined brackets are greater than lookupAge),
    // fall back to the lowest defined bracket to provide a deterministic value.
    let applicableAgeBracket = _findApplicableBracket(ageBracketsAsc, lookupAge);
    
    if (applicableAgeBracket === null) {
        // No bracket <= lookupAge; use the lowest defined bracket as a deterministic fallback.
        applicableAgeBracket = ageBracketsAsc[0];
    }

    // Retrieve the value using the original string key
    let remainingYearsRaw = sexData[applicableAgeBracket.toString()];

    // Fallback: if the direct lookup failed (undefined), attempt to find the nearest lower bracket key
    if (remainingYearsRaw === undefined) {
        // Use the same efficient approach for fallback search
        const fallbackBracket = _findApplicableBracket(ageBracketsAsc, lookupAge);
        if (fallbackBracket !== null) {
            remainingYearsRaw = sexData[fallbackBracket.toString()];
        } else {
            // As a last resort, pick the lowest defined bracket
            const minBracket = ageBracketsAsc[0];
            remainingYearsRaw = sexData[minBracket.toString()];
        }
    }

    // Coerce numeric-like values to Number and validate
    const remainingYears = Number(remainingYearsRaw);
    if (!Number.isFinite(remainingYears)) {
        throw new Error(`Remaining years data not found or invalid for sex: ${sex}, age bracket: ${applicableAgeBracket}`);
    }
    
    return remainingYears;
}

// Export the calculation functions
export { calculateCurrentAge, getRemainingExpectancy };
