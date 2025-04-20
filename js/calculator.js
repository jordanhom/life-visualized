// Import the necessary data from data.js
import { lifeExpectancyData } from './data.js';

/**
 * Calculates the current age in whole years based on birth date.
 * @param {Date} birthDate - The user's birth date.
 * @returns {number} The current age in years.
 */
function calculateCurrentAge(birthDate) {
    const now = new Date();
    let age = now.getFullYear() - birthDate.getFullYear();
    const monthDiff = now.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
        age--;
    }
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
    const lookupAge = Math.max(0, age);
    const ageBrackets = Object.keys(sexData).map(Number).sort((a, b) => b - a);
    let applicableAgeBracket = ageBrackets[ageBrackets.length - 1]; // Default to lowest bracket (0)
    for (const bracket of ageBrackets) {
        if (lookupAge >= bracket) {
            applicableAgeBracket = bracket;
            break;
        }
    }
    return sexData[applicableAgeBracket.toString()] || null;
}

// Export the calculation functions
export { calculateCurrentAge, getRemainingExpectancy };
