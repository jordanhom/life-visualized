# Project Brief: Life Visualized

## 1. Core Concept & Goal

This project, **`life-visualized`**, aims to create a web application inspired by Tim Urban's "Life in Weeks". The primary goal is to provide users with a visual representation of their estimated lifespan, broken down into different time units (weeks, months, years), to offer perspective on time.

## 2. Core Requirements

*   **Input:** Accept user's birth date and sex.
*   **Calculation:**
    *   Calculate the user's current age.
    *   Estimate remaining lifespan based on age, sex, and actuarial data (US CDC 2021 Period Life Table).
    *   Calculate total estimated lifespan.
*   **Visualization:**
    *   Display the estimated lifespan as a grid of blocks.
    *   Support multiple grid views:
        *   Weeks (arranged by Age Year)
        *   Weeks (arranged by Calendar Year)
        *   Months (arranged by Age Year, 12 per row)
        *   Years (arranged by Decade, 10 per row)
    *   Color-code grid blocks based on defined life stages (Infancy to Late Senior).
    *   Visually distinguish past, present, and future blocks.
    *   Handle edge cases like 52/53 week years appropriately in relevant views.
*   **User Interface:**
    *   Provide clear input fields and a calculation trigger.
    *   Display calculated results (current age, remaining years, total estimate).
    *   Allow users to easily toggle between the different grid views.
    *   Include a color key explaining the life stage colors.
    *   Include an explanation for visualization nuances (e.g., 53-week years, calendar view start).
    *   Include a disclaimer about the nature of the estimates.
*   **Technical:**
    *   Implement using HTML, CSS, and modern vanilla JavaScript (ES Modules).
    *   Utilize the `date-fns` library (v4.1.0+) for reliable date calculations, loaded via CDN.
    *   Ensure consistent and accurate date handling, primarily using UTC.
    *   Employ a modular JavaScript structure (`calculator`, `data`, `gridRenderer`, `ui`, `main`).
    *   Implement a responsive design suitable for desktop, tablet, and mobile devices.
    *   Maintain clean, well-documented code.

## 3. Scope

*   **In Scope:** The core requirements listed above.
*   **Out of Scope (Currently):** User accounts, saving data, adding custom milestones, using different actuarial datasets, advanced customization options.

## 4. Source of Truth

This document serves as the foundational definition of the project's scope and core requirements. All other Memory Bank files build upon this brief.
