# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Complete rewrite of the HR Management System from React/Vite/Tailwind to Vanilla HTML, CSS, and JS to ensure lightweight performance and zero build-step requirement.
- Added `js/shared.js` and `css/styles.css` using Tailwind CSS via CDN.
- Built Login page (`index.html` formerly `login.html`) with interactive validations.
- Built Public Job Board (`jobboard.html`) featuring search, filtering, and application modals.
- Created robust LocalStorage-based Database Simulator (`js/db.js`) to seamlessly connect modules (e.g. Job Board applications appearing directly in Admin Recruitment).
- Created Admin Dashboard (`admin-dashboard.html`) with statistics widgets and charts layout.
- Created Admin Employee Management (`admin-employees.html`) with list and grid views, filters, and profile modals.
- Created Admin Payroll (`admin-payroll.html`) featuring tabular views and generation modals.
- Created Admin Attendance (`admin-attendance.html`) tracking timesheets and logs.
- Created Admin Leave Management (`admin-leave.html`) with calendar layouts and request approval flows.
- Created Admin Recruitment (`admin-recruitment.html`) featuring a multi-tab system:
  - Manpower Requests inbox with review pane.
  - Job Postings management list.
  - Applicant Tracker with drag-and-drop simulated Kanban boards.
  - Interview Scheduling with calendar grids.
  - Interview Feedback with scoring matrices.
- Created Admin Employee Relations (`admin-hr.html`) managing incidents and notices (NTE/NOD).
- Created Admin Announcements (`admin-announcements.html`) with creation form and acknowledgment tracking.
- Created Admin Performance Evaluation (`admin-performance.html`) with radar-style evaluation models and forms.
- Created Manager Portals (`manager-dashboard.html`, `manager-manpower.html`, `manager-interviews.html`) integrated with `localStorage`.
- Created Employee Portals (`employee-dashboard.html`, `employee-profile.html`, `employee-attendance.html`, `employee-leave.html`, `employee-payslips.html`, `employee-performance.html`, `employee-hrcases.html`) fully matching the previous React implementation with vanilla HTML/JS equivalents.

### Removed
- Removed React, Node.js, Vite, and all associated npm dependencies (`src/`, `package.json`, etc.).
- Removed component libraries (Radix UI, Shadcn, MUI).

### Changed
- Converted component-based state logic into Vanilla JS module scripts directly interacting with DOM elements and `localStorage`.
