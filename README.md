# HR Management System - Corazon Travel and Tours

A comprehensive, role-based Human Resources Management System designed for modern organizations. Built with React, Tailwind CSS, Vite, and Supabase.

## 🌟 Features

### 🔐 Secure Authentication & Access Control
- **Role-Based Access Control (RBAC)**: Tailored portals for Admins (HR), Managers, and Employees.
- **Encrypted Passwords**: Secure authentication using `pgcrypto` (bcrypt) natively in PostgreSQL.
- **Session Management**: Automatic 15-minute inactivity session timeout for improved security.

### 👥 Admin / HR Portal
- **Employee Management**: View, add, and manage employee records.
- **Attendance & Payroll**: Track employee time-in/out and calculate payroll deductions/net pay.
- **Leave Management**: Review and approve/reject leave requests.
- **Performance Evaluation**: Manage performance reviews and ratings.
- **Recruitment**: Manage job postings and track applicant statuses.
- **Announcements**: Publish company-wide or department-specific announcements.

### 👔 Manager Portal
- **Manpower Requests**: Submit and track requests for new hires.
- **Interview Feedback**: Provide direct feedback on interviewed candidates.
- **Announcements Hub**: Stay updated with relevant advisories.

### 🧑‍💻 Employee Portal
- **Dashboard**: Personal overview of attendance, recent payslips, and leave balances.
- **Leave Requests**: Apply for vacation, sick, or emergency leave.
- **My Profile**: View and edit personal information securely.
- **Change Password**: Built-in secure password management.

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- `npm` or `pnpm`
- A Supabase account and project (for the database backend)

### 1. Clone the repository
Ensure you have cloned or downloaded the project files to your local machine.

### 2. Install Dependencies
Navigate into the project directory and install the required packages:
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root of the project with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

*(Note: The database must have the correct schema applied and seed data populated).*

### 4. Run the Development Server
Start the Vite development server:
```bash
npm run dev
```
The application will be accessible at `http://localhost:5174` (or `5173`).

### 5. Default Login Accounts
To access the system, you can use the default seeded accounts. 
By default, existing employees are seeded with the password: **`HrmsDefault@2026`**

**Sample Admin/HR Account:**
- **Email:** sofia.garcia@hrms.ph
- **Password:** HrmsDefault@2026

**Sample Employee Account:**
- **Email:** miguel.torres@hrms.ph
- **Password:** HrmsDefault@2026