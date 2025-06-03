/**
 * @module calculator
 * @description Provides core calculation functions: determining current age in whole
 * years and looking up estimated remaining life expectancy from actuarial data.
 *
 * Exports: `calculateCurrentAge`, `getRemainingExpectancy`.
 *
 * Relies on `lifeExpectancyData` imported from `data.js`.
 */

// Import the necessary data from data.js
import { lifeExpectancyData } from './data.js';

/**
 * Calculates the current age in whole years based on birth date.
 * Correctly handles cases where the birthday has not yet occurred in the current year.
 * @param {Date} birthDate - The user's birth date (Date object).
 * @returns {number} The current age in completed years.
 */
function calculateCurrentAge(birthDate) {
    const now = new Date();
    let age = now.getFullYear() - birthDate.getFullYear();
    const monthDiff = now.getMonth() - birthDate.getMonth();

    // Decrement age if the current date is before the birthday in the current year.
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
        age--;
    }
    // Ensure age is not negative if birthDate is somehow in the future (though ui.js validates)
    return Math.max(0, age);
}

/**
 * Looks up the estimated remaining life expectancy based on age and sex.
 * Uses the imported `lifeExpectancyData`.
 * @param {number} age - Current age in years.
 * @param {string} sex - 'male' or 'female'.
 * @returns {number|null} Estimated remaining years, or null if not found.
 */
function getRemainingExpectancy(age, sex) {
    const sexData = lifeExpectancyData[sex];
    if (!sexData) return null;
    // Ensure age used for lookup is non-negative
    const lookupAge = Math.max(0, age);
    
    // Find the applicable age bracket in the data (object keys are strings)
    // 1. Get bracket keys as numbers and sort descending (e.g., [100, 90, 80,... 0])
    const ageBrackets = Object.keys(sexData).map(Number).sort((a, b) => b - a);
    // 2. Find the highest bracket that is less than or equal to the lookupAge
    let applicableAgeBracket = ageBrackets[ageBrackets.length - 1]; // Default to lowest bracket (0)
    for (const bracket of ageBrackets) {
        if (lookupAge >= bracket) {
            applicableAgeBracket = bracket;
            break; // Found the correct bracket
        }
    }
    
    // 3. Retrieve the value using the original string key
    const remainingYears = sexData[applicableAgeBracket.toString()];

    if (typeof remainingYears !== 'number') {
        console.error(`Remaining years data not found or invalid for sex: ${sex}, age bracket: ${applicableAgeBracket}`);
        return null;
    }
    return remainingYears;
}

// Export the calculation functions
export { calculateCurrentAge, getRemainingExpectancy };
