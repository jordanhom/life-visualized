/**
 * @module data
 * @description Defines and exports the `lifeExpectancyData` object containing
 * actuarial estimates based on US CDC/NCHS 2021 Period Life Table data.
 *
 * Exports: `lifeExpectancyData`.
 *
 * Note: Data represents average *remaining* lifespan under 2021 mortality conditions.
 * It's a statistical snapshot, not an individual prediction.
 */

// --- Refined Actuarial Data (Remaining Years by Current Age/Sex) ---
// Source: Based on CDC/NCHS National Vital Statistics Reports, Vol. 72, No. 12
// Data: U.S. Period Life Table, 2021 (Table 1)
// Structure: Object keyed by sex ('male'/'female'), then by age bracket lower bound (string).
// Values: Average remaining years for someone entering that age bracket in 2021.
const lifeExpectancyData = {
    'male': {
        0: 73.5, 10: 64.0, 20: 54.5, 30: 45.3, 40: 36.2, 50: 27.6, 60: 19.7, 70: 12.8, 80: 7.3, 90: 3.7, 100: 2.1
    },
    'female': {
        0: 79.3, 10: 69.7, 20: 60.0, 30: 50.3, 40: 40.8, 50: 31.6, 60: 23.0, 70: 15.1, 80: 8.6, 90: 4.4, 100: 2.4
    }
};

// Export the data so it can be imported by other modules
export { lifeExpectancyData };
