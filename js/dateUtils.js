// @ts-check

/**
 * Encodes a local calendar date as UTC midnight for deterministic date-only arithmetic.
 * @param {Date} [instant=new Date()] - Instant whose local calendar date should be encoded.
 * @returns {Date}
 */
function getLocalDateUTC(instant = new Date()) {
    return new Date(Date.UTC(
        instant.getFullYear(),
        instant.getMonth(),
        instant.getDate()
    ));
}

/**
 * Returns the browser's resolved IANA timezone for diagnostics.
 * @returns {string}
 */
function getBrowserTimeZone() {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    } catch {
        return 'UTC';
    }
}

/**
 * Adds whole calendar months using UTC components and clamps to the target month end.
 * @param {Date} date
 * @param {number} months
 * @returns {Date}
 */
function addMonthsUTC(date, months) {
    const targetMonthIndex = date.getUTCMonth() + months;
    const targetYear = date.getUTCFullYear() + Math.floor(targetMonthIndex / 12);
    const targetMonth = ((targetMonthIndex % 12) + 12) % 12;
    const lastDayOfTargetMonth = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate();
    return new Date(Date.UTC(
        targetYear,
        targetMonth,
        Math.min(date.getUTCDate(), lastDayOfTargetMonth)
    ));
}

/**
 * Adds years with month precision. February 29 clamps to February 28 in non-leap years.
 * @param {Date} date
 * @param {number} years
 * @returns {Date}
 */
function addYearsUTC(date, years) {
    return addMonthsUTC(date, Math.trunc(years * 12));
}

/**
 * @param {Date} date
 * @returns {Date}
 */
function startOfMonthUTC(date) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

/**
 * @param {Date} date
 * @returns {Date}
 */
function startOfISOWeekUTC(date) {
    const weekStart = new Date(Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate()
    ));
    const daysSinceMonday = (weekStart.getUTCDay() + 6) % 7;
    weekStart.setUTCDate(weekStart.getUTCDate() - daysSinceMonday);
    return weekStart;
}

/**
 * @param {Date} date
 * @returns {number}
 */
function getISOWeekYearUTC(date) {
    const thursday = startOfISOWeekUTC(date);
    thursday.setUTCDate(thursday.getUTCDate() + 3);
    return thursday.getUTCFullYear();
}

/**
 * @param {number} isoYear
 * @param {number} [weekNumber=1]
 * @returns {Date}
 */
function getISOWeekStartUTC(isoYear, weekNumber = 1) {
    const firstWeekStart = startOfISOWeekUTC(new Date(Date.UTC(isoYear, 0, 4)));
    firstWeekStart.setUTCDate(firstWeekStart.getUTCDate() + ((weekNumber - 1) * 7));
    return firstWeekStart;
}

/**
 * @param {number} isoYear
 * @returns {number}
 */
function getISOWeeksInYearUTC(isoYear) {
    const currentYearStart = getISOWeekStartUTC(isoYear);
    const nextYearStart = getISOWeekStartUTC(isoYear + 1);
    return Math.round((nextYearStart.getTime() - currentYearStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
}

/**
 * @param {Date} date
 * @returns {string}
 */
function formatUTCDate(date) {
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}

/**
 * Calculates completed years between two UTC-encoded calendar dates.
 * @param {Date} currentDateUTC
 * @param {Date} birthDateUTC
 * @returns {number}
 */
function calculateAgeAtDateUTC(currentDateUTC, birthDateUTC) {
    let age = currentDateUTC.getUTCFullYear() - birthDateUTC.getUTCFullYear();
    if (currentDateUTC < addYearsUTC(birthDateUTC, age)) {
        age--;
    }
    return Math.max(0, age);
}

export {
    addMonthsUTC,
    addYearsUTC,
    calculateAgeAtDateUTC,
    formatUTCDate,
    getBrowserTimeZone,
    getISOWeekStartUTC,
    getISOWeeksInYearUTC,
    getISOWeekYearUTC,
    getLocalDateUTC,
    startOfISOWeekUTC,
    startOfMonthUTC
};
