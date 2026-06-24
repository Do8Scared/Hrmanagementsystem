// db.js - Simulated Database using localStorage to connect JobBoard and HR Admin
const DB_KEY_JOBS = 'hrms_jobs';
const DB_KEY_APPS = 'hrms_apps';

const initialJobs = [
  { id: 'JP-001', title: 'Senior React Developer', department: 'Engineering', datePosted: '2026-06-11', deadline: '2026-07-11', description: 'Join our engineering team to build high-performance web applications...', qualifications: 'At least 3 years of React experience', slots: 2, employmentType: 'Full Time', publishToBoard: true, status: 'Open' },
  { id: 'JP-002', title: 'Finance Analyst', department: 'Finance', datePosted: '2026-06-09', deadline: '2026-06-30', description: 'Support financial planning and analysis...', qualifications: 'CPA license preferred.', slots: 1, employmentType: 'Full Time', publishToBoard: true, status: 'Open' },
  { id: 'JP-003', title: 'UI/UX Design Intern', department: 'Design', datePosted: '2026-06-01', deadline: '2026-06-20', description: 'Assist our design team...', qualifications: 'Figma proficiency.', slots: 2, employmentType: 'Internship', publishToBoard: false, status: 'Closed' }
];

const initialApps = [
  { id: 'APP001', name: 'Alfonso Dela Cruz', email: 'alfonso@example.com', role: 'Senior React Developer', jobId: 'JP-001', stage: 'New', appliedDate: '2026-06-15', score: 85 },
  { id: 'APP002', name: 'Maria Santos', email: 'maria@example.com', role: 'Finance Analyst', jobId: 'JP-002', stage: 'Screening', appliedDate: '2026-06-14', score: 92 },
  { id: 'APP003', name: 'Juan Garcia', email: 'juan@example.com', role: 'Finance Analyst', jobId: 'JP-002', stage: 'Interview', appliedDate: '2026-06-10', score: 78 }
];

// Initialize LocalStorage if empty
if (!localStorage.getItem(DB_KEY_JOBS)) {
  localStorage.setItem(DB_KEY_JOBS, JSON.stringify(initialJobs));
}
if (!localStorage.getItem(DB_KEY_APPS)) {
  localStorage.setItem(DB_KEY_APPS, JSON.stringify(initialApps));
}

export const db = {
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
      score: Math.floor(Math.random() * 30) + 60 // Mock score
    });
    db.saveApps(apps);
  },

  // Mocks for employee/manager portals
  employees: [
    { id: 'EMP001', name: 'Maria Santos', department: 'Human Resources', role: 'HR Manager' },
    { id: 'EMP002', name: 'Juan dela Cruz', department: 'Engineering', role: 'Software Engineer' }
  ],
  attendanceRecords: [],
  leaveRequests: [],
  leaveBalances: [
    { employeeId: 'EMP002', vacation: 10, sick: 10 }
  ],
  manpowerRequests: [],
  interviews: [
    { id: 'INT-001', applicantId: 'APP001', applicantName: 'Alfonso Dela Cruz', jobTitle: 'Senior React Developer', date: '2026-06-25', time: '10:00', format: 'Virtual', interviewer: 'Maria Santos', status: 'Upcoming' },
    { id: 'INT-002', applicantId: 'APP002', applicantName: 'Maria Santos', jobTitle: 'Finance Analyst', date: '2026-06-20', time: '14:00', format: 'In-Person', interviewer: 'Maria Santos', status: 'Done' }
  ],
  interviewFeedbacks: [],
  nteRecords: [],
  nodRecords: [],
  payslips: [
    { id: 'PAY-001', employeeId: 'EMP002', period: 'June 1-15, 2026', basicSalary: 25000, netPay: 22000, totalDeductions: 3000, status: 'Paid' }
  ],
  performanceEvaluations: [],
  save: function() { console.log("db.save() called"); },

};
