export type DocType = 'Advisory' | 'Memorandum' | 'Policy';
export type DocStatus = 'Published' | 'Draft' | 'Archived';
export type TargetAudience = 'All Employees' | 'Managers Only' | 'Specific Department';
export type AckStatus = 'Read' | 'Unread' | 'Pending';

export interface Announcement {
  id: string;
  type: DocType;
  title: string;
  refNumber: string;
  effectivityDate: string;
  publishedDate: string;
  publishedBy: string;
  targetAudience: TargetAudience;
  targetDepartments?: string[];
  status: DocStatus;
  content: string;
  attachedFile?: string;
  requiresAcknowledgement: boolean;
  totalRecipients: number;
  readCount: number;
}

export interface AcknowledgementRecord {
  employeeId: string;
  employeeName: string;
  department: string;
  role: string;
  dateRead: string | null;
  status: AckStatus;
}

export const announcements: Announcement[] = [
  {
    id: 'ANN-001',
    type: 'Advisory',
    title: 'Q2 2026 Company Performance Update',
    refNumber: 'ADV-2026-001',
    effectivityDate: '2026-06-10',
    publishedDate: '2026-06-10',
    publishedBy: 'Sofia Garcia',
    targetAudience: 'All Employees',
    status: 'Published',
    content: `Dear Team,\n\nWe are pleased to share that Corazon Travel and Tours has achieved strong Q2 2026 results. Revenue grew by 18% year-over-year, driven largely by our expanded tour packages and improved customer satisfaction scores.\n\nKey highlights:\n• Net revenue: ₱12.4M (up 18% YoY)\n• Customer satisfaction score: 4.7 / 5.0\n• New tour bookings: 1,240 (up 24% from Q1)\n• Employee headcount grew by 3 positions\n\nThank you for your hard work and dedication. We look forward to continuing this momentum in Q3.\n\nBest regards,\nOffice of the CEO`,
    requiresAcknowledgement: true,
    totalRecipients: 24,
    readCount: 18,
  },
  {
    id: 'ANN-002',
    type: 'Policy',
    title: 'Updated Flexible Work Arrangement Policy',
    refNumber: 'POL-2026-003',
    effectivityDate: '2026-07-01',
    publishedDate: '2026-06-12',
    publishedBy: 'Sofia Garcia',
    targetAudience: 'All Employees',
    status: 'Published',
    content: `Effective July 1, 2026, Corazon Travel and Tours will implement an updated Flexible Work Arrangement (FWA) policy.\n\n1. ELIGIBILITY\nAll regular employees who have been with the company for at least 6 months are eligible to apply for a flexible work arrangement.\n\n2. TYPES OF ARRANGEMENTS\n• Hybrid Work: Up to 2 days of remote work per week\n• Compressed Work Week: 4 x 10-hour days with Fridays off (subject to department approval)\n• Flexible Hours: Adjusted start/end times within the 7AM–7PM window\n\n3. APPLICATION PROCESS\nEmployees must submit a formal request through the HR portal at least 2 weeks before the desired start date. Approval is subject to business needs and manager discretion.\n\n4. PERFORMANCE STANDARDS\nAll flexible arrangement employees are expected to maintain the same performance standards as on-site employees. Failure to meet KPIs may result in the arrangement being revoked.\n\nFor questions, please contact HR at hr@corazontravel.ph.`,
    attachedFile: 'FWA_Policy_2026.pdf',
    requiresAcknowledgement: true,
    totalRecipients: 24,
    readCount: 9,
  },
  {
    id: 'ANN-003',
    type: 'Memorandum',
    title: 'Q3 2026 Budget Planning Guidelines',
    refNumber: 'MEM-2026-002',
    effectivityDate: '2026-06-16',
    publishedDate: '2026-06-14',
    publishedBy: 'Sofia Garcia',
    targetAudience: 'Managers Only',
    status: 'Published',
    content: `TO: All Department Managers\nFROM: Finance Department\nRE: Q3 2026 Budget Planning\n\nThis memorandum outlines the guidelines for Q3 2026 budget submissions.\n\nAll department heads are required to submit their budget proposals by June 30, 2026 via the Finance portal. The following categories must be addressed:\n\n1. Headcount & Compensation — include any planned hires, promotions, or salary adjustments\n2. Operational Expenses — software subscriptions, office supplies, travel\n3. Capital Expenditures — equipment, infrastructure upgrades\n4. Training & Development — workshops, certifications, conferences\n\nBudgets exceeding the prior quarter by more than 15% require a written justification signed by the department head.\n\nPlease reach out to finance@corazontravel.ph for clarification on any budget categories.`,
    requiresAcknowledgement: true,
    totalRecipients: 6,
    readCount: 4,
  },
  {
    id: 'ANN-004',
    type: 'Advisory',
    title: 'Employee Wellness Program — June 2026',
    refNumber: 'ADV-2026-002',
    effectivityDate: '2026-06-16',
    publishedDate: '2026-06-16',
    publishedBy: 'Sofia Garcia',
    targetAudience: 'All Employees',
    status: 'Published',
    content: `We are excited to launch the Corazon Travel Wellness Program for June 2026!\n\nActivities this month:\n• Mental Health Webinar — June 18, 2026, 10:00 AM via Zoom\n• Fitness Challenge — Log 30 minutes of physical activity daily and submit proof via HR portal\n• Free Flu Vaccination — June 20, 2026, 9:00 AM–12:00 PM at the Main Office\n• Healthy Meal Subsidy — ₱100 daily meal allowance for healthy food choices at partner canteens\n\nParticipation is voluntary but strongly encouraged. Employees who complete all four activities will receive a Wellness Certificate and a ₱500 HMO top-up.\n\nRegister via the HR portal by June 17, 2026.`,
    requiresAcknowledgement: false,
    totalRecipients: 24,
    readCount: 20,
  },
  {
    id: 'ANN-005',
    type: 'Policy',
    title: 'Data Privacy and Information Security Policy',
    refNumber: 'POL-2026-004',
    effectivityDate: '2026-07-15',
    publishedDate: '',
    publishedBy: 'Sofia Garcia',
    targetAudience: 'All Employees',
    status: 'Draft',
    content: `[DRAFT] This policy governs the collection, processing, storage, and disposal of personal data in compliance with the Data Privacy Act of 2012 (RA 10173).\n\n1. SCOPE\nThis policy applies to all employees, contractors, and third-party service providers who have access to company systems and personal data.\n\n2. DATA CLASSIFICATION\n• Public — information cleared for general disclosure\n• Internal — for internal use only\n• Confidential — restricted to authorized personnel\n• Strictly Confidential — requires explicit clearance\n\n3. EMPLOYEE RESPONSIBILITIES\nAll employees are required to complete the annual Data Privacy training module available on the HR portal...`,
    requiresAcknowledgement: true,
    totalRecipients: 24,
    readCount: 0,
  },
  {
    id: 'ANN-006',
    type: 'Memorandum',
    title: 'Office Closure — June 19 Eid al-Adha Holiday',
    refNumber: 'MEM-2026-003',
    effectivityDate: '2026-06-19',
    publishedDate: '2026-06-15',
    publishedBy: 'Sofia Garcia',
    targetAudience: 'All Employees',
    status: 'Published',
    content: `This is to inform all employees that the office will be CLOSED on June 19, 2026 in observance of the Eid al-Adha (Feast of Sacrifice) national holiday.\n\nEmployees who are required to render work on this date will be entitled to holiday pay in accordance with the Labor Code of the Philippines.\n\nPlease coordinate with your immediate supervisor for any work-related concerns during the holiday.\n\nThank you and enjoy the long weekend!`,
    requiresAcknowledgement: false,
    totalRecipients: 24,
    readCount: 22,
  },
];

export const acknowledgements: Record<string, AcknowledgementRecord[]> = {
  'ANN-001': [
    { employeeId: 'EMP001', employeeName: 'Maria Santos', department: 'Operations', role: 'Operations Manager', dateRead: '2026-06-10', status: 'Read' },
    { employeeId: 'EMP002', employeeName: 'Juan dela Cruz', department: 'Engineering', role: 'Software Engineer', dateRead: '2026-06-11', status: 'Read' },
    { employeeId: 'EMP003', employeeName: 'Ana Reyes', department: 'Marketing', role: 'Marketing Specialist', dateRead: '2026-06-11', status: 'Read' },
    { employeeId: 'EMP004', employeeName: 'Carlo Mendoza', department: 'Finance', role: 'Finance Analyst', dateRead: null, status: 'Unread' },
    { employeeId: 'EMP005', employeeName: 'Sofia Garcia', department: 'Human Resources', role: 'HR Specialist', dateRead: '2026-06-10', status: 'Read' },
    { employeeId: 'EMP006', employeeName: 'Miguel Torres', department: 'Sales', role: 'Sales Representative', dateRead: null, status: 'Pending' },
    { employeeId: 'EMP007', employeeName: 'Isabella Lim', department: 'Design', role: 'Product Designer', dateRead: '2026-06-12', status: 'Read' },
    { employeeId: 'EMP008', employeeName: 'Rafael Cruz', department: 'Engineering', role: 'Backend Developer', dateRead: null, status: 'Unread' },
    { employeeId: 'EMP009', employeeName: 'Camille Bautista', department: 'Finance', role: 'Accountant', dateRead: '2026-06-13', status: 'Read' },
    { employeeId: 'EMP010', employeeName: 'Jerome Villanueva', department: 'Operations', role: 'Operations Coordinator', dateRead: null, status: 'Pending' },
  ],
  'ANN-002': [
    { employeeId: 'EMP001', employeeName: 'Maria Santos', department: 'Operations', role: 'Operations Manager', dateRead: '2026-06-13', status: 'Read' },
    { employeeId: 'EMP002', employeeName: 'Juan dela Cruz', department: 'Engineering', role: 'Software Engineer', dateRead: null, status: 'Unread' },
    { employeeId: 'EMP003', employeeName: 'Ana Reyes', department: 'Marketing', role: 'Marketing Specialist', dateRead: null, status: 'Pending' },
    { employeeId: 'EMP005', employeeName: 'Sofia Garcia', department: 'Human Resources', role: 'HR Specialist', dateRead: '2026-06-12', status: 'Read' },
    { employeeId: 'EMP007', employeeName: 'Isabella Lim', department: 'Design', role: 'Product Designer', dateRead: null, status: 'Unread' },
    { employeeId: 'EMP009', employeeName: 'Camille Bautista', department: 'Finance', role: 'Accountant', dateRead: '2026-06-14', status: 'Read' },
  ],
  'ANN-003': [
    { employeeId: 'EMP001', employeeName: 'Maria Santos', department: 'Operations', role: 'Operations Manager', dateRead: '2026-06-14', status: 'Read' },
    { employeeId: 'EMP003', employeeName: 'Ana Reyes', department: 'Marketing', role: 'Marketing Specialist', dateRead: '2026-06-15', status: 'Read' },
    { employeeId: 'EMP005', employeeName: 'Sofia Garcia', department: 'Human Resources', role: 'HR Specialist', dateRead: '2026-06-14', status: 'Read' },
    { employeeId: 'EMP006', employeeName: 'Miguel Torres', department: 'Sales', role: 'Sales Representative', dateRead: null, status: 'Unread' },
    { employeeId: 'EMP009', employeeName: 'Camille Bautista', department: 'Finance', role: 'Accountant', dateRead: '2026-06-15', status: 'Read' },
    { employeeId: 'EMP010', employeeName: 'Jerome Villanueva', department: 'Operations', role: 'Operations Coordinator', dateRead: null, status: 'Pending' },
  ],
};
