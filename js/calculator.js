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
 * @returns {number|null} Estimated remaining years, or null if not found.
 */
let __test_lifeExpectancyDataOverride = null;

/**
 * Test helper: inject a deterministic lifeExpectancyData object for tests.
 * Pass `null` to clear the override.
 * @param {object|null} val
 */
function __setLifeExpectancyDataOverride(val) {
    __test_lifeExpectancyDataOverride = val;
}

async function getRemainingExpectancy(age, sex) {
    // Prefer injected override for unit tests; otherwise dynamically import real data.
    const lifeExpectancyData = __test_lifeExpectancyDataOverride ?? (await import('./data.js')).lifeExpectancyData;
    const sexData = lifeExpectancyData[sex];
    if (!sexData) return null;
    // Ensure age used for lookup is non-negative
    const lookupAge = Math.max(0, age);

    // Build sorted, numeric age bracket list ascending (e.g., [0, 10, 20, ... 100])
    const ageBracketsAsc = Object.keys(sexData)
        .map(Number)
        .filter(Number.isFinite)
        .sort((a, b) => a - b);

    // Find the highest bracket that is less than or equal to lookupAge.
    // Start with the lowest bracket as a sensible default.
    let applicableAgeBracket = ageBracketsAsc.length ? ageBracketsAsc[0] : null;
    for (const bracket of ageBracketsAsc) {
        if (lookupAge >= bracket) {
            applicableAgeBracket = bracket;
        } else {
            break;
        }
    }

    // 3. Retrieve the value using the original string key
    let remainingYearsRaw = sexData[applicableAgeBracket.toString()];

    // Fallback: if the direct lookup failed (undefined), attempt to find the nearest lower bracket key
    if (remainingYearsRaw === undefined) {
        let candidate = null;
        for (const k of Object.keys(sexData)) {
            const n = Number(k);
            if (!Number.isFinite(n)) continue;
            if (n <= lookupAge && (candidate === null || n > candidate)) {
                candidate = n;
            }
        }
        if (candidate !== null) {
            remainingYearsRaw = sexData[candidate.toString()];
        } else {
            // As a last resort, pick the lowest defined bracket
            const keys = Object.keys(sexData).map(Number).filter(Number.isFinite).sort((a, b) => a - b);
            if (keys.length > 0) {
                remainingYearsRaw = sexData[keys[0].toString()];
            }
        }
    }

    // Coerce numeric-like values to Number and validate
    const remainingYears = Number(remainingYearsRaw);
    if (!Number.isFinite(remainingYears)) {
        console.error(`Remaining years data not found or invalid for sex: ${sex}, age bracket: ${applicableAgeBracket}`);
        return null;
    }
    return remainingYears;
}
 
// Export the calculation functions
export { calculateCurrentAge, getRemainingExpectancy, __setLifeExpectancyDataOverride };
