# Grid Utilities - Example Tests and Console Harness

Purpose
Provide runnable console/unit-style examples to validate behaviors expected from the planned [`js/gridUtils.js`](js/gridUtils.js:1) helpers before implementation.

References
- [`js/gridRenderer.js`](js/gridRenderer.js:1)
- [`js/ui.js`](js/ui.js:1)
- [`docs/gridUtils-api.md`](docs/gridUtils-api.md:1)

How to use
1. Open the site served via a local dev server or open the test HTML harness below.
2. Open DevTools Console and paste the provided snippets, or load the module via an ES module script.

Console assertions
- Use console.assert(condition, message) to fail loudly in console when a behavior mismatches.
- Use deterministic UTC dates to avoid timezone flakiness.

Example: getISOWeekStart
// Expected: start of ISO week for 2025-W01 is 2024-12-30 (Monday)
const isoTestDate = new Date(Date.UTC(2025,0,4)); // Jan 4 2025
const week1Start = getISOWeekStart(2025,1); // (implementation will be in js/gridUtils.js)
console.log('week1Start (UTC):', week1Start.toISOString());
console.assert(week1Start.toISOString().startsWith('2024-12-30'), 'getISOWeekStart: wrong start date for 2025-W01');

Example: getWeeksForInterval
// Setup
const start = new Date(Date.UTC(2023,2,15)); // 2023-03-15 UTC
const end = new Date(Date.UTC(2023,5,10)); // 2023-06-10 UTC
const weeks = getWeeksForInterval(start, end, { weekStartsOn: 1 });
console.log('weeks count:', weeks.length, weeks.map(d=>d.toISOString().slice(0,10)));
console.assert(Array.isArray(weeks) && weeks.length > 0, 'getWeeksForInterval: expected non-empty array');

Example: getWeeksForAgeYear (birthday-aligned rows)
const birthUTC = new Date(Date.UTC(1990,5,10)); // 1990-06-10
const age3Weeks = getWeeksForAgeYear(birthUTC, 3);
console.assert(Array.isArray(age3Weeks), 'getWeeksForAgeYear: should return array');
console.log('Age 3 weeks (count):', age3Weeks.length);

Example: getMonthsForLifespan
const months = getMonthsForLifespan(birthUTC, 3); // 3 years => 36 months
console.assert(months.length >= 36, 'getMonthsForLifespan: expected at least total months');
console.log('First 3 month starts:', months.slice(0,3).map(m=>m.start.toISOString().slice(0,10)));

Example: classifyBlockByDate
const estimatedEnd = new Date(Date.UTC(2060,0,1));
const now = new Date(Date.UTC(2025,10,10));
// Simulate: classify month at 2025-11-01
const blockDate = new Date(Date.UTC(2025,10,1));
const classification = classifyBlockByDate(blockDate, birthUTC, estimatedEnd, { nowUTC: now });
console.log('classification:', classification);
console.assert(['past','present','future','out-of-bounds'].includes(classification.state), 'classifyBlockByDate: invalid state');

Example: makeBlockElement
const blockEl = makeBlockElement({ type: 'month', startDateUTC: blockDate, age: 35, stageKey: 'adulthood', state: 'past', title: 'Test block' });
console.assert(blockEl instanceof HTMLElement && blockEl.classList.contains('month-block'), 'makeBlockElement: expected month-block element');
console.log('Element classes:', blockEl.className);

HTML Test Harness (save as `tests/gridUtils.test.html`)
<pre><code><!doctype html>
<html><head><meta charset="utf-8"><title>GridUtils Test</title></head><body>
<script type="module">
  import * as utils from '../js/gridUtils.js';
  // Expose helpers for console
  window.getISOWeekStart = utils.getISOWeekStart;
  window.getWeeksForInterval = utils.getWeeksForInterval;
  window.getWeeksForAgeYear = utils.getWeeksForAgeYear;
  window.getMonthsForLifespan = utils.getMonthsForLifespan;
  window.classifyBlockByDate = utils.classifyBlockByDate;
  window.makeBlockElement = utils.makeBlockElement;
  console.log('gridUtils module loaded');
</script>
<p>Open the DevTools console and run the examples from this document.</p>
</body></html></code></pre>

Notes & Recommendations
- Use fixed UTC dates in tests to avoid local DST/timezone affecting results.
- Keep helper functions pure; allow injection of 'now' for deterministic tests.
- Once [`js/gridUtils.js`](js/gridUtils.js:1) exists, add a minimal `tests/gridUtils.test.html` in the repo to run quickly in browser.

Next steps
- Approve and I will implement [`js/gridUtils.js`](js/gridUtils.js:1) and create the actual `tests/gridUtils.test.html`.