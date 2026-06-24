
const DB_KEY_JOBS = 'hrms_jobs';
const DB_KEY_APPS = 'hrms_apps';

const initialJobs = [
  { id: 'JP-001', title: 'Senior React Developer', department: 'Engineering', datePosted: '2026-06-11', deadline: '2026-07-11', description: 'Join our engineering team...', qualifications: 'At least 3 years of React experience', slots: 2, employmentType: 'Full Time', publishToBoard: true, status: 'Open' }
];

const initialApps = [
  { id: 'APP001', name: 'Alfonso Dela Cruz', email: 'alfonso@example.com', role: 'Senior React Developer', jobId: 'JP-001', stage: 'New', appliedDate: '2026-06-15', score: 85 }
];

if (!localStorage.getItem(DB_KEY_JOBS)) {
  localStorage.setItem(DB_KEY_JOBS, JSON.stringify(initialJobs));
}
if (!localStorage.getItem(DB_KEY_APPS)) {
  localStorage.setItem(DB_KEY_APPS, JSON.stringify(initialApps));
}

const db = {
  // Missing Employee Data added here
  employees: [
    { id: 'EMP002', name: 'Alex Diaz', initials: 'AD', position: 'Senior Backend Developer', department: 'Engineering' }
  ],
  attendanceRecords: [
    { employeeId: 'EMP002', date: '2026-06-16', timeIn: '08:07', timeOut: null, status: 'Present' }
  ],
  payslips: [
    { period: 'May 16 - 31, 2026', grossPay: 45000, netPay: 39500 }
  ],
  leaveBalances: [
    { employeeId: 'EMP002', vacationLeave: 15, vacationUsed: 2, sickLeave: 15, sickUsed: 1, emergencyLeave: 5, emergencyUsed: 0 }
  ],

  // Existing Job Board Functions
  getJobs: () => JSON.parse(localStorage.getItem(DB_KEY_JOBS) || '[]'),
  saveJobs: (jobs) => localStorage.setItem(DB_KEY_JOBS, JSON.stringify(jobs)),
  
  getApps: () => JSON.parse(localStorage.getItem(DB_KEY_APPS) || '[]'),
  saveApps: (apps) => localStorage.setItem(DB_KEY_APPS, JSON.stringify(apps)),
  
  addApplication: (app) => {
    const apps = db.getApps();
    apps.unshift({
      id: `APP${String(apps.length + 1).padStart(3, '0')}`,
      ...app,
      stage: 'New',
      appliedDate: new Date().toISOString().slice(0, 10),
      score: Math.floor(Math.random() * 30) + 60
    });
    db.saveApps(apps);
  }
};