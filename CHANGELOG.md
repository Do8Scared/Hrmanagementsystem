# Changelog

All notable changes to the HR Management System will be documented in this file.

## [Unreleased] / Recent Updates
- **Recruitment & Applicant Tracking**
  - Replaced the job selector dropdown in the Applicant Tracker with an accordion view, allowing multiple Kanban boards to be viewed by scrolling.
  - Added "View" and "Edit" functionality for Job Postings, saving changes directly to Supabase.
  - Automated the applicant stage update: scheduling an interview now automatically moves the applicant to the "Interview Scheduled" stage.
  - Fully integrated public `JobBoard.tsx` with Supabase to save new applicant submissions to the database.

- **Admin & Manager Dashboards**
  - Refined Admin Dashboard metrics to accurately calculate the average attendance rate.
  - Updated Today's Attendance list to automatically mark employees as "Absent" if they have not timed in by 9:00 AM.
  - Ordered Today's Attendance list logically.
  - Implemented the Manager Portal (`ManagerDashboard.tsx`) with role-based routing restrict manager views to manager-specific tabs.
  - Updated the Layout sidebar to reflect correct navigation items for Managers.

- **Security & Authentication**
  - Implemented secure password authentication using `pgcrypto` (bcrypt hashing).
  - Added backend password verification through Supabase RPC (`verify_password`).
  - Added secure change password functionality through Supabase RPC (`change_password`).
  - Migrated `employees` table to include `password_hash` column.
  - Replaced simulated login and role selection with actual database authentication.
  - Implemented 15-minute session inactivity timeout.
  
- **Database & Data Layer**
  - Integrated Supabase as the backend database.
  - Created tables and RLS (Row Level Security) policies for:
    - Employees
    - Attendance Records
    - Payroll Records
    - Leave Requests
    - Leave Balances
    - Performance Evaluations
    - Announcements
    - Job Postings
    - Manpower Requests
  - Created seed data scripts to populate the database with initial mock data.
  - Fixed issues with converting empty string date fields to `null` for Postgres date columns.

- **Frontend Features & Refactoring**
  - Built out full suite of Role-Based Dashboards:
    - **Admin/HR**: Employee Management, Attendance, Payroll, Leave Management, Performance Evaluation, Recruitment, Announcements.
    - **Manager**: Dashboard, Manpower Requests, Interview Feedback, Announcements.
    - **Employee**: Dashboard, My Attendance, My Payslips, Leave Request, My Performance, Announcements.
  - Converted hardcoded local state mock data to real-time queries using Supabase client.
  - Fixed announcement and recruitment list rendering logic.
  - Enhanced layout with dynamic routing based on user roles and active sessions.

## [Initial Commit]
- **Base Project Setup**
  - Scaffolding generated from Figma UI designs.
  - Configured Vite, React, and Tailwind CSS.
  - Added essential UI components (Layout, Navigation).

