// db.js - Simulated Database using localStorage to connect JobBoard and HR Admin
const DB_KEY_JOBS = 'hrms_jobs';
const DB_KEY_APPS = 'hrms_apps';

const initialJobs = [
  { id: 'JP-001', title: 'Senior React Developer', department: 'Engineering', datePosted: '2026-06-11', deadline: '2026-07-11', description: 'Join our engineering team to build high-performance web applications. You will collaborate with product designers and backend engineers to deliver features that power our platform.', qualifications: 'At least 3 years of React experience, proficiency in TypeScript, experience with REST APIs and state management libraries such as Redux or Zustand. Familiarity with testing frameworks is a plus.', slots: 2, employmentType: 'Full Time', publishToBoard: true, status: 'Open' },
  { id: 'JP-002', title: 'Finance Analyst', department: 'Finance', datePosted: '2026-06-09', deadline: '2026-06-30', description: 'Support our financial planning and analysis function. You will prepare reports, analyze financial data, and provide insights to help drive business decisions across departments.', qualifications: 'CPA license preferred. At least 2 years of experience in financial analysis. Proficient in Excel and financial modeling tools.', slots: 1, employmentType: 'Full Time', publishToBoard: true, status: 'Open' },
  { id: 'JP-003', title: 'UI/UX Design Intern', department: 'Design', datePosted: '2026-06-01', deadline: '2026-06-20', description: 'Assist our design team with wireframing, prototyping, and user research to improve our product experience.', qualifications: 'Currently enrolled in IT, Computer Science, or Design. Proficiency in Figma required.', slots: 2, employmentType: 'Internship', publishToBoard: false, status: 'Closed' },
  { id: 'JP-004', title: 'Part-time Data Encoder', department: 'Operations', datePosted: '2026-06-05', deadline: '2026-06-25', description: 'Responsible for accurate data entry into our systems. Work remotely on a flexible schedule.', qualifications: 'Fast typing speed (50+ WPM), attention to detail, basic computer literacy.', slots: 3, employmentType: 'Part Time', publishToBoard: true, status: 'Open' },
  { id: 'JP-005', title: 'Digital Marketing Specialist', department: 'Marketing', datePosted: '2026-06-12', deadline: '2026-07-15', description: 'Manage our social media channels, run paid digital campaigns, and analyze performance metrics to improve brand visibility and lead generation.', qualifications: 'At least 2 years of digital marketing experience. Familiarity with Google Ads, Facebook Business Manager, SEO/SEM practices.', slots: 1, employmentType: 'Full Time', publishToBoard: true, status: 'Open' },
  { id: 'JP-006', title: 'Customer Support Specialist', department: 'Operations', datePosted: '2026-06-13', deadline: '2026-07-20', description: 'Handle customer inquiries and provide excellent support across email, chat, and phone channels. You will be the frontline of our customer experience team.', qualifications: 'Strong communication and empathy. Previous support or customer service experience is a plus.', slots: 2, employmentType: 'Full Time', publishToBoard: true, status: 'Open' },
  { id: 'JP-007', title: 'Tour Package Coordinator', department: 'Operations', datePosted: '2026-06-14', deadline: '2026-07-10', description: 'Coordinate domestic and international tour packages, liaise with accommodation and transport partners, and ensure smooth trip execution.', qualifications: 'At least 1 year in travel, hospitality, or event coordination. Excellent organizational skills and attention to detail.', slots: 2, employmentType: 'Contractual', publishToBoard: true, status: 'Open' },
];

const initialApps = [
  { id: 'APP001', name: 'Alfonso Dela Cruz', email: 'alfonso@example.com', role: 'Senior React Developer', jobId: 'JP-001', stage: 'New', appliedDate: '2026-06-15', score: 85 },
  { id: 'APP002', name: 'Maria Santos', email: 'maria@example.com', role: 'Finance Analyst', jobId: 'JP-002', stage: 'Screening', appliedDate: '2026-06-14', score: 92 },
  { id: 'APP003', name: 'Juan Garcia', email: 'juan@example.com', role: 'Finance Analyst', jobId: 'JP-002', stage: 'Interview', appliedDate: '2026-06-10', score: 78 },
  { id: 'APP004', name: 'Liza Fernandez', email: 'liza.f@email.com', role: 'Senior React Developer', jobId: 'JP-001', stage: 'Shortlisted', appliedDate: '2026-06-12', score: 88 },
  { id: 'APP005', name: 'Kevin Tan', email: 'kevin.t@email.com', role: 'Senior React Developer', jobId: 'JP-001', stage: 'Interview Scheduled', appliedDate: '2026-06-13', score: 91 },
  { id: 'APP006', name: 'Grace Uy', email: 'grace.u@email.com', role: 'Senior React Developer', jobId: 'JP-001', stage: 'Job Offer', appliedDate: '2026-06-16', score: 95 },
  { id: 'APP007', name: 'Ryan Diaz', email: 'ryan.d@email.com', role: 'Finance Analyst', jobId: 'JP-002', stage: 'Hired', appliedDate: '2026-06-10', score: 94 },
  { id: 'APP008', name: 'Alex Ramos', email: 'alex.r@email.com', role: 'Finance Analyst', jobId: 'JP-002', stage: 'Shortlisted', appliedDate: '2026-06-12', score: 80 },
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
      score: Math.floor(Math.random() * 30) + 60,
    });
    db.saveApps(apps);
  },

  // ── Employee directory ───────────────────────────────────────────────────────
  employees: [
    { id: 'EMP001', name: 'Maria Santos',      department: 'Operations',       position: 'Operations Manager',      status: 'Active',   email: 'maria.santos@corazon.ph',    phone: '+63 917 123 4567', joinDate: '2019-03-15', initials: 'MS', salary: 85000, gender: 'Female', birthDate: '1985-07-22', address: '123 Rizal St., Makati City',        emergencyContact: 'Jose Santos — +63 917 999 0000' },
    { id: 'EMP002', name: 'Juan dela Cruz',    department: 'Engineering',      position: 'Software Engineer',       status: 'Active',   email: 'juan.delacruz@corazon.ph',  phone: '+63 918 234 5678', joinDate: '2021-06-01', initials: 'JD', salary: 75000, gender: 'Male',   birthDate: '1993-11-05', address: '456 Mabini Ave., Quezon City',     emergencyContact: 'Rosa dela Cruz — +63 918 888 1111' },
    { id: 'EMP003', name: 'Ana Reyes',         department: 'Marketing',        position: 'Marketing Specialist',    status: 'Active',   email: 'ana.reyes@corazon.ph',      phone: '+63 919 345 6789', joinDate: '2020-09-10', initials: 'AR', salary: 55000, gender: 'Female', birthDate: '1995-03-18', address: '789 Luna St., Pasig City',         emergencyContact: 'Pedro Reyes — +63 919 777 2222' },
    { id: 'EMP004', name: 'Carlo Mendoza',     department: 'Finance',          position: 'Finance Analyst',         status: 'On Leave', email: 'carlo.mendoza@corazon.ph',  phone: '+63 920 456 7890', joinDate: '2022-01-20', initials: 'CM', salary: 60000, gender: 'Male',   birthDate: '1990-06-14', address: '321 Aguinaldo Blvd., Manila',      emergencyContact: 'Liza Mendoza — +63 920 666 3333' },
    { id: 'EMP005', name: 'Sofia Garcia',      department: 'Human Resources',  position: 'HR Specialist',           status: 'Active',   email: 'sofia.garcia@corazon.ph',   phone: '+63 921 567 8901', joinDate: '2018-11-05', initials: 'SG', salary: 65000, gender: 'Female', birthDate: '1988-09-30', address: '654 Bonifacio St., Taguig City',   emergencyContact: 'Marco Garcia — +63 921 555 4444' },
    { id: 'EMP006', name: 'Miguel Torres',     department: 'Sales',            position: 'Sales Representative',    status: 'Active',   email: 'miguel.torres@corazon.ph',  phone: '+63 922 678 9012', joinDate: '2023-02-14', initials: 'MT', salary: 45000, gender: 'Male',   birthDate: '1997-01-25', address: '987 Del Pilar St., Mandaluyong',   emergencyContact: 'Carmen Torres — +63 922 444 5555' },
    { id: 'EMP007', name: 'Isabella Lim',      department: 'Design',           position: 'Product Designer',        status: 'Active',   email: 'isabella.lim@corazon.ph',   phone: '+63 923 789 0123', joinDate: '2021-08-30', initials: 'IL', salary: 70000, gender: 'Female', birthDate: '1992-04-12', address: '147 Quezon Ave., Caloocan',        emergencyContact: 'Victor Lim — +63 923 333 6666' },
    { id: 'EMP008', name: 'Rafael Cruz',       department: 'Engineering',      position: 'Backend Developer',       status: 'Inactive', email: 'rafael.cruz@corazon.ph',    phone: '+63 924 890 1234', joinDate: '2020-04-22', initials: 'RC', salary: 72000, gender: 'Male',   birthDate: '1991-12-08', address: '258 Katipunan Ave., Quezon City',  emergencyContact: 'Elena Cruz — +63 924 222 7777' },
    { id: 'EMP009', name: 'Camille Bautista',  department: 'Finance',          position: 'Accountant',              status: 'Active',   email: 'camille.bautista@corazon.ph', phone: '+63 925 901 2345', joinDate: '2019-07-08', initials: 'CB', salary: 58000, gender: 'Female', birthDate: '1994-08-17', address: '369 Shaw Blvd., Mandaluyong',     emergencyContact: 'Tony Bautista — +63 925 111 8888' },
    { id: 'EMP010', name: 'Jerome Villanueva', department: 'Operations',       position: 'Operations Coordinator',  status: 'Active',   email: 'jerome.villanueva@corazon.ph', phone: '+63 926 012 3456', joinDate: '2022-10-17', initials: 'JV', salary: 52000, gender: 'Male',   birthDate: '1996-02-28', address: '741 Commonwealth Ave., Quezon City', emergencyContact: 'Grace Villanueva — +63 926 000 9999' },
  ],

  // ── Performance Evaluations ──────────────────────────────────────────────────
  performanceEvaluations: [
    { id: 'EVAL001', employeeId: 'EMP002', employeeName: 'Juan dela Cruz',    department: 'Engineering',     period: 'Q1 2026', criteria: { attendance: 4, productivity: 5, teamwork: 4, communication: 4, initiative: 5 }, overallRating: 4.4, evaluator: 'Maria Santos',       date: '2026-04-05', comments: 'Excellent technical work. Shows strong initiative in proposing solutions and consistently delivers on time. Minor improvements needed on documentation habits.' },
    { id: 'EVAL002', employeeId: 'EMP003', employeeName: 'Ana Reyes',         department: 'Marketing',       period: 'Q1 2026', criteria: { attendance: 5, productivity: 4, teamwork: 5, communication: 5, initiative: 4 }, overallRating: 4.6, evaluator: 'Sofia Garcia',       date: '2026-04-08', comments: 'Outstanding team player with excellent communication. Campaign results exceeded targets by 18%. Highly recommended for a leadership track.' },
    { id: 'EVAL003', employeeId: 'EMP005', employeeName: 'Sofia Garcia',      department: 'Human Resources', period: 'Q1 2026', criteria: { attendance: 5, productivity: 5, teamwork: 5, communication: 5, initiative: 4 }, overallRating: 4.8, evaluator: 'Maria Santos',       date: '2026-04-10', comments: 'Exceptional HR performance. Streamlined onboarding processes and improved employee satisfaction scores by 22% this quarter.' },
    { id: 'EVAL004', employeeId: 'EMP007', employeeName: 'Isabella Lim',      department: 'Design',          period: 'Q1 2026', criteria: { attendance: 4, productivity: 5, teamwork: 4, communication: 4, initiative: 5 }, overallRating: 4.4, evaluator: 'Maria Santos',       date: '2026-04-07', comments: 'Creative and innovative. Delivered a redesigned product UI that increased user engagement by 23%. Great collaboration with the engineering team.' },
    { id: 'EVAL005', employeeId: 'EMP001', employeeName: 'Maria Santos',      department: 'Operations',      period: 'Q1 2026', criteria: { attendance: 5, productivity: 5, teamwork: 5, communication: 5, initiative: 5 }, overallRating: 5.0, evaluator: 'Board of Directors', date: '2026-04-12', comments: 'Exemplary leadership. Successfully led the operations team through a major system migration with zero downtime. Sets the standard for all managers.' },
    { id: 'EVAL006', employeeId: 'EMP006', employeeName: 'Miguel Torres',     department: 'Sales',           period: 'Q1 2026', criteria: { attendance: 3, productivity: 4, teamwork: 4, communication: 4, initiative: 3 }, overallRating: 3.6, evaluator: 'Sofia Garcia',       date: '2026-04-09', comments: 'Good sales performance and positive attitude. Attendance has been inconsistent — 8 late incidents recorded. Prior verbal warning on file.' },
    { id: 'EVAL007', employeeId: 'EMP009', employeeName: 'Camille Bautista',  department: 'Finance',         period: 'Q1 2026', criteria: { attendance: 5, productivity: 4, teamwork: 4, communication: 5, initiative: 4 }, overallRating: 4.4, evaluator: 'Maria Santos',       date: '2026-04-11', comments: 'Reliable and detail-oriented. Completed all monthly financial reports ahead of schedule with zero errors. Strong candidate for a senior role.' },
    { id: 'EVAL008', employeeId: 'EMP010', employeeName: 'Jerome Villanueva', department: 'Operations',      period: 'Q1 2026', criteria: { attendance: 4, productivity: 3, teamwork: 4, communication: 3, initiative: 3 }, overallRating: 3.4, evaluator: 'Maria Santos',       date: '2026-04-13', comments: 'Average performance this quarter. Needs to take more ownership of tasks and improve written communication. A development plan has been recommended.' },
    { id: 'EVAL009', employeeId: 'EMP002', employeeName: 'Juan dela Cruz',    department: 'Engineering',     period: 'Q4 2025', criteria: { attendance: 3, productivity: 4, teamwork: 4, communication: 4, initiative: 4 }, overallRating: 3.8, evaluator: 'Maria Santos',       date: '2026-01-10', comments: 'Good overall performance. Areas for improvement: punctuality and documentation. Showed marked improvement in teamwork compared to Q3.' },
    { id: 'EVAL010', employeeId: 'EMP003', employeeName: 'Ana Reyes',         department: 'Marketing',       period: 'Q4 2025', criteria: { attendance: 5, productivity: 4, teamwork: 5, communication: 4, initiative: 4 }, overallRating: 4.4, evaluator: 'Sofia Garcia',       date: '2026-01-12', comments: 'Consistent performer. Led the year-end digital campaign that drove a 14% increase in brand mentions. Great attitude and team spirit.' },
  ],

  // ── Interview Feedback ───────────────────────────────────────────────────────
  interviewFeedbacks: [
    {
      id: 'FB-001',
      applicantId: 'APP001',
      applicantName: 'Alfonso Dela Cruz',
      position: 'Senior React Developer',
      interviewerId: 'EMP005',
      evaluatorName: 'Sofia Garcia',
      overallImpression: 4,
      communicationSkills: 4,
      technicalKnowledge: 5,
      cultureFit: 4,
      problemSolving: 5,
      strengths: 'Strong TypeScript skills. Excellent understanding of React patterns and performance optimization. Communicates clearly under pressure.',
      areasOfConcern: 'Limited experience with backend integration. Could improve on system design concepts for large-scale applications.',
      recommendation: 'Hire',
      submittedDate: '2026-06-20',
    },
    {
      id: 'FB-002',
      applicantId: 'APP002',
      applicantName: 'Maria Santos',
      position: 'Finance Analyst',
      interviewerId: 'EMP005',
      evaluatorName: 'Sofia Garcia',
      overallImpression: 5,
      communicationSkills: 5,
      technicalKnowledge: 4,
      cultureFit: 5,
      problemSolving: 4,
      strengths: 'Exceptional communication and confident demeanor. Strong grasp of financial reporting and analysis. Shows genuine enthusiasm for the company and its culture.',
      areasOfConcern: 'No CPA license yet, currently reviewing for the board exam. Limited exposure to IFRS standards.',
      recommendation: 'Hire',
      submittedDate: '2026-06-21',
    },
    {
      id: 'FB-003',
      applicantId: 'APP003',
      applicantName: 'Juan Garcia',
      position: 'Finance Analyst',
      interviewerId: 'EMP005',
      evaluatorName: 'Sofia Garcia',
      overallImpression: 3,
      communicationSkills: 3,
      technicalKnowledge: 3,
      cultureFit: 4,
      problemSolving: 3,
      strengths: 'Friendly and easy to work with. Has foundational accounting knowledge and is eager to learn.',
      areasOfConcern: 'Lacks confidence when answering technical questions. No formal finance training beyond college. Struggled with case-based financial analysis questions.',
      recommendation: 'For Further Interview',
      submittedDate: '2026-06-15',
    },
    {
      id: 'FB-004',
      applicantId: 'APP005',
      applicantName: 'Kevin Tan',
      position: 'Senior React Developer',
      interviewerId: 'EMP001',
      evaluatorName: 'Maria Santos',
      overallImpression: 5,
      communicationSkills: 4,
      technicalKnowledge: 5,
      cultureFit: 5,
      problemSolving: 5,
      strengths: 'Outstanding technical skills — solved the live coding challenge with optimal time complexity. Great culture fit, very collaborative. 5 years of React and TypeScript experience.',
      areasOfConcern: 'Salary expectation is slightly above budget. No experience with our current stack (Vite + Zustand) but expressed willingness to adapt quickly.',
      recommendation: 'Hire',
      submittedDate: '2026-06-22',
    },
    {
      id: 'FB-005',
      applicantId: 'APP004',
      applicantName: 'Liza Fernandez',
      position: 'Senior React Developer',
      interviewerId: 'EMP001',
      evaluatorName: 'Maria Santos',
      overallImpression: 4,
      communicationSkills: 5,
      technicalKnowledge: 4,
      cultureFit: 4,
      problemSolving: 4,
      strengths: 'Excellent verbal communication. Demonstrates a solid understanding of component architecture and state management. Brings 3 years of React experience plus a strong portfolio.',
      areasOfConcern: 'Some gaps in TypeScript generics and advanced patterns. Needs onboarding support on testing practices (Vitest/Playwright).',
      recommendation: 'Hire',
      submittedDate: '2026-06-19',
    },
    {
      id: 'FB-006',
      applicantId: 'APP008',
      applicantName: 'Alex Ramos',
      position: 'Finance Analyst',
      interviewerId: 'EMP009',
      evaluatorName: 'Camille Bautista',
      overallImpression: 4,
      communicationSkills: 4,
      technicalKnowledge: 4,
      cultureFit: 3,
      problemSolving: 4,
      strengths: 'Solid financial modeling background. CPA board passer with 2 years of experience in a mid-sized firm. Analytical and detail-focused.',
      areasOfConcern: 'Seems hesitant about the travel industry context. Took longer than expected on the Excel test. Culture fit score is moderate — may need more team integration effort.',
      recommendation: 'For Further Interview',
      submittedDate: '2026-06-23',
    },
  ],

  // ── Other stubs ──────────────────────────────────────────────────────────────
  attendanceRecords: [],
  leaveRequests: [],
  leaveBalances: [
    { employeeId: 'EMP001', vacation: 15, vacationUsed: 3, sick: 10, sickUsed: 1 },
    { employeeId: 'EMP002', vacation: 15, vacationUsed: 5, sick: 10, sickUsed: 2 },
    { employeeId: 'EMP003', vacation: 15, vacationUsed: 7, sick: 10, sickUsed: 3 },
    { employeeId: 'EMP005', vacation: 15, vacationUsed: 4, sick: 10, sickUsed: 0 },
  ],
  manpowerRequests: [],
  interviews: [
    { id: 'INT-001', applicantId: 'APP001', applicantName: 'Alfonso Dela Cruz', jobTitle: 'Senior React Developer', date: '2026-06-25', time: '10:00', format: 'Virtual',  interviewer: 'Sofia Garcia',    status: 'Upcoming' },
    { id: 'INT-002', applicantId: 'APP002', applicantName: 'Maria Santos',      jobTitle: 'Finance Analyst',       date: '2026-06-20', time: '14:00', format: 'In-Person', interviewer: 'Sofia Garcia',    status: 'Done'     },
    { id: 'INT-003', applicantId: 'APP005', applicantName: 'Kevin Tan',         jobTitle: 'Senior React Developer', date: '2026-06-21', time: '11:00', format: 'Virtual',  interviewer: 'Maria Santos',    status: 'Done'     },
    { id: 'INT-004', applicantId: 'APP004', applicantName: 'Liza Fernandez',    jobTitle: 'Senior React Developer', date: '2026-06-19', time: '09:00', format: 'Virtual',  interviewer: 'Maria Santos',    status: 'Done'     },
    { id: 'INT-005', applicantId: 'APP008', applicantName: 'Alex Ramos',        jobTitle: 'Finance Analyst',       date: '2026-06-23', time: '13:00', format: 'In-Person', interviewer: 'Camille Bautista', status: 'Done'     },
    { id: 'INT-006', applicantId: 'APP003', applicantName: 'Juan Garcia',       jobTitle: 'Finance Analyst',       date: '2026-06-28', time: '15:00', format: 'Virtual',  interviewer: 'Camille Bautista', status: 'Upcoming' },
  ],
  nteRecords: [],
  nodRecords: [],
  payslips: [
    { id: 'PAY-001', employeeId: 'EMP002', period: 'June 1-15, 2026', basicSalary: 37500, overtime: 0, grossPay: 37500, sss: 450, philhealth: 750, pagibig: 100, tax: 4900, netPay: 31300, totalDeductions: 6200, status: 'Paid' },
    { id: 'PAY-002', employeeId: 'EMP002', period: 'May 16-31, 2026', basicSalary: 37500, overtime: 1500, grossPay: 39000, sss: 450, philhealth: 750, pagibig: 100, tax: 4900, netPay: 32800, totalDeductions: 6200, status: 'Paid' },
  ],
  save: function() { console.log('db.save() called'); },
};
