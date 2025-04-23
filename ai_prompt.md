# Prompt to Set Context for `life_visualized` Project

Hello! We are working on the **`life_visualized`** project, a web application inspired by Tim Urban's "Life in Weeks". This prompt summarizes our progress and current state to provide context for continuing our work.

**1. Project Goal & Concept:**
*   Calculate a user's estimated lifespan based on birthdate, sex, and US CDC actuarial data.
*   Visualize the lifespan as a grid of weeks.
*   Allow toggling between different views (currently "Age Based" and "Calendar Year Based").
*   Color-code grid blocks based on defined life stages.
*   Implement responsive design for desktop, tablet, and mobile.
*   (Future goals include adding user milestones).

**2. Technology & Structure:**
*   **Stack:** Vanilla HTML, CSS, and modern JavaScript (ES6+ Modules).
*   **Library:** `date-fns` v4.1.0 loaded via CDN for date calculations.
*   **Structure:** Modularized code:
    *   `index.html`: Main structure, includes UI elements, explanation sections, color key.
    *   `css/style.css`: All styling, including a tiered responsive layout.
    *   `js/data.js`: Holds `lifeExpectancyData`.
    *   `js/calculator.js`: `calculateCurrentAge`, `getRemainingExpectancy`.
    *   `js/ui.js`: Handles DOM interaction, form submission, state management (`currentView`, `lastCalcData`), event listeners.
    *   `js/gridRenderer.js`: Contains logic for rendering both grid views, life stage definitions, and helper functions.
    *   `js/main.js`: Initializes the app, sets up event listeners.

**3. Core Logic & Implementation Details:**
*   **Date Handling:**
    *   User birthdate input is normalized to UTC midnight using `date.setMinutes(date.getMinutes() + date.getTimezoneOffset())` in `ui.js` before being stored or passed to renderers.
    *   `gridRenderer.js` functions consistently create and operate on UTC Date objects (`new Date(Date.UTC(...))`, `dateFns` functions with `{ timeZone: 'UTC' }`) to avoid timezone/DST issues.
*   **Grid Views (`gridRenderer.js`):**
    *   **`renderCalendarGrid`:** Rows represent ISO calendar years. Uses `dateFns.getISOWeeksInYear` (correctly yields 52 or 53 weeks). Includes `out-of-bounds` styling for weeks before birth/after estimated death within the rendered calendar years.
    *   **`renderAgeGrid`:** Rows represent years of age (0, 1, 2...). Uses `dateFns.eachWeekOfInterval` over the `[birthday, nextBirthday)` interval, followed by `.filter(isBefore(..., nextBirthday))` and a `.pop()` if the length is 54. This correctly identifies weeks starting before the next birthday and enforces a maximum of 53 weeks per row for display consistency.
*   **Life Stages:**
    *   Defined in `LIFE_STAGES` array in `gridRenderer.js` with names, `maxAge`, keys, and colors (recently updated for better contrast, including subdivided senior stages: Early/Mid/Late Senior).
    *   `getLifeStageKey(age)` determines the stage.
    *   CSS classes `.stage-[key]` are added to week blocks.
    *   CSS rules apply background colors based on stage; `.past` adds opacity, `.present` overrides background for visibility, `.future` resets background to white.
*   **Layout & Responsiveness (`css/style.css`):**
    *   Goal: Maintain "one row = one year" structure (`flex-wrap: nowrap` on `.year-row`).
    *   Grid container (`#life-grid-container`) uses `display: flex`, `flex-direction: column`, `overflow-x: auto`.
    *   **Tiered Responsive Approach:** Media queries adjust `max-width` of the grid container AND the `width`/`height`/`gap` of week blocks at different breakpoints (~655px, ~486px, ~378px) to maximize block size while minimizing horizontal scrolling. Scrolling only occurs on the narrowest screens (below ~324px).
    *   Grid container is centered on wide screens via `align-items: center` on the parent `.container`.
*   **UI Enhancements:**
    *   Added a toggle (`<fieldset>`) to switch between views.
    *   Added an expandable explanation (`<details>`) for 53-week years and Calendar View indent, styled to match page.
    *   Added a color key legend, styled to match page.

**4. Current Status:**
*   The 54-week bug in `renderAgeGrid` has been fixed using the `eachWeekOfInterval` + `filter` + `pop` approach.
*   The tiered responsive layout is implemented and working well.
*   Life stage colors and subdivisions have been refined.
*   UI explanation elements are in place and styled.
*   A comprehensive code review was just completed. The project is ready for the next steps or feature additions.

**The Ask:** Does this context successfully bring you up to speed on the `life_visualized` project, allowing us to continue from this point?
