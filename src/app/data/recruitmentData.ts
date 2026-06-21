export type ManpowerRequestStatus = 'Pending' | 'Approved' | 'Rejected';
export type EmploymentType = 'Full Time' | 'Part Time' | 'Contractual' | 'Internship';
export type UrgencyLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type JobPostingStatus = 'Open' | 'Closed' | 'Draft';
export type ApplicantStage = 'Applied' | 'Shortlisted' | 'Interview Scheduled' | 'Interviewed' | 'Job Offer' | 'Hired' | 'Rejected';
export type InterviewFormat = 'On-site' | 'Virtual';
export type InterviewStatus = 'Upcoming' | 'Done' | 'Cancelled';
export type FeedbackRecommendation = 'Hire' | 'For Further Interview' | 'Reject';

export interface ManpowerRequest {
  id: string;
  department: string;
  requestingManager: string;
  positionTitle: string;
  headcount: number;
  dateRequested: string;
  status: ManpowerRequestStatus;
  employmentType: EmploymentType;
  jobDescription: string;
  qualifications: string;
  urgency: UrgencyLevel;
  justification: string;
  preferredStartDate: string;
}

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  datePosted: string;
  deadline: string;
  applicantCount: number;
  status: JobPostingStatus;
  description: string;
  qualifications: string;
  slots: number;
  employmentType: EmploymentType;
  publishToBoard: boolean;
  manpowerRequestId?: string;
}

export interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobPostingId: string;
  jobTitle: string;
  applicationDate: string;
  stage: ApplicantStage;
  resumeFile: string;
}

export interface Interview {
  id: string;
  applicantId: string;
  applicantName: string;
  jobTitle: string;
  date: string;
  time: string;
  format: InterviewFormat;
  interviewer: string;
  notes: string;
  status: InterviewStatus;
}

export interface InterviewFeedback {
  id: string;
  applicantId: string;
  applicantName: string;
  position: string;
  interviewerId: string;
  evaluatorName: string;
  overallImpression: number;
  communicationSkills: number;
  technicalKnowledge: number;
  cultureFit: number;
  problemSolving: number;
  strengths: string;
  areasOfConcern: string;
  recommendation: FeedbackRecommendation;
  submittedDate: string;
}

export const manpowerRequests: ManpowerRequest[] = [
  { id: 'MR-001', department: 'Engineering', requestingManager: 'Maria Santos', positionTitle: 'Senior React Developer', headcount: 2, dateRequested: '2026-06-10', status: 'Pending', employmentType: 'Full Time', jobDescription: 'We need two experienced React developers to join our growing engineering team. The candidates will work on our flagship web application, collaborating closely with designers and backend engineers to deliver high-quality features on time.', qualifications: 'At least 3 years of React experience, proficiency in TypeScript, experience with REST APIs and state management libraries such as Redux or Zustand. Familiarity with testing frameworks is a plus.', urgency: 'High', justification: 'Current team is understaffed and we have two major product launches planned for Q3 2026.', preferredStartDate: '2026-07-15' },
  { id: 'MR-002', department: 'Finance', requestingManager: 'Camille Bautista', positionTitle: 'Finance Analyst', headcount: 1, dateRequested: '2026-06-08', status: 'Approved', employmentType: 'Full Time', jobDescription: 'Support our financial planning and analysis function. You will prepare reports, analyze financial data, and provide insights to help drive business decisions across departments.', qualifications: 'CPA license preferred. At least 2 years of experience in financial analysis. Proficient in Excel and financial modeling tools.', urgency: 'Medium', justification: 'Replacement hire for Carlo Mendoza who is on extended leave.', preferredStartDate: '2026-07-01' },
  { id: 'MR-003', department: 'Marketing', requestingManager: 'Ana Reyes', positionTitle: 'Digital Marketing Specialist', headcount: 1, dateRequested: '2026-06-12', status: 'Pending', employmentType: 'Full Time', jobDescription: 'Manage our social media channels, run paid digital campaigns, and analyze performance metrics to improve brand visibility and lead generation.', qualifications: 'At least 2 years of digital marketing experience. Familiarity with Google Ads, Facebook Business Manager, SEO/SEM practices.', urgency: 'Low', justification: 'New budget allocation for digital marketing campaigns in H2 2026.', preferredStartDate: '2026-08-01' },
  { id: 'MR-004', department: 'Sales', requestingManager: 'Miguel Torres', positionTitle: 'Sales Account Executive', headcount: 3, dateRequested: '2026-06-14', status: 'Rejected', employmentType: 'Full Time', jobDescription: 'Seeking aggressive and target-driven Sales Account Executives to expand our client base and manage existing accounts.', qualifications: '1-3 years of B2B sales experience, strong communication skills, proven track record of hitting sales targets.', urgency: 'Critical', justification: 'Sales team needs reinforcement to hit Q3 revenue targets.', preferredStartDate: '2026-07-01' },
];

export const jobPostings: JobPosting[] = [
  { id: 'JP-001', title: 'Senior React Developer', department: 'Engineering', datePosted: '2026-06-11', deadline: '2026-07-11', applicantCount: 8, status: 'Open', description: 'Join our engineering team to build high-performance web applications. You will collaborate with product designers and backend engineers to deliver features that power our platform.', qualifications: 'At least 3 years of React experience, proficiency in TypeScript, experience with REST APIs and state management. Experience with testing frameworks is a plus.', slots: 2, employmentType: 'Full Time', publishToBoard: true, manpowerRequestId: 'MR-001' },
  { id: 'JP-002', title: 'Finance Analyst', department: 'Finance', datePosted: '2026-06-09', deadline: '2026-06-30', applicantCount: 12, status: 'Open', description: 'Support financial planning and analysis. Prepare monthly reports, build financial models, and provide data-driven insights to leadership.', qualifications: 'CPA license preferred. At least 2 years in financial analysis. Strong Excel and financial modeling skills.', slots: 1, employmentType: 'Full Time', publishToBoard: true, manpowerRequestId: 'MR-002' },
  { id: 'JP-003', title: 'UI/UX Design Intern', department: 'Design', datePosted: '2026-06-01', deadline: '2026-06-20', applicantCount: 24, status: 'Closed', description: 'Assist our design team with wireframing, prototyping, and user research to improve our product experience.', qualifications: 'Currently enrolled in IT, Computer Science, or Design. Proficiency in Figma required.', slots: 2, employmentType: 'Internship', publishToBoard: false },
  { id: 'JP-004', title: 'Customer Support Specialist', department: 'Operations', datePosted: '', deadline: '2026-07-15', applicantCount: 0, status: 'Draft', description: 'Handle customer inquiries and provide excellent support across email, chat, and phone channels.', qualifications: 'Strong communication and empathy. Previous support experience is a plus.', slots: 2, employmentType: 'Full Time', publishToBoard: false },
  { id: 'JP-005', title: 'Part-time Data Encoder', department: 'Operations', datePosted: '2026-06-05', deadline: '2026-06-25', applicantCount: 5, status: 'Open', description: 'Responsible for accurate data entry into our systems. Work remotely on a flexible schedule.', qualifications: 'Fast typing speed (50+ WPM), attention to detail, basic computer literacy.', slots: 3, employmentType: 'Part Time', publishToBoard: true },
];

export const applicants: Applicant[] = [
  { id: 'APP-001', name: 'Liza Fernandez', email: 'liza.f@email.com', phone: '+63 917 111 2222', jobPostingId: 'JP-001', jobTitle: 'Senior React Developer', applicationDate: '2026-06-12', stage: 'Shortlisted', resumeFile: 'liza_fernandez_resume.pdf' },
  { id: 'APP-002', name: 'Kevin Tan', email: 'kevin.t@email.com', phone: '+63 918 222 3333', jobPostingId: 'JP-001', jobTitle: 'Senior React Developer', applicationDate: '2026-06-13', stage: 'Interview Scheduled', resumeFile: 'kevin_tan_resume.pdf' },
  { id: 'APP-003', name: 'Donna Cruz', email: 'donna.c@email.com', phone: '+63 919 333 4444', jobPostingId: 'JP-001', jobTitle: 'Senior React Developer', applicationDate: '2026-06-14', stage: 'Applied', resumeFile: 'donna_cruz_resume.pdf' },
  { id: 'APP-004', name: 'Mark Aquino', email: 'mark.a@email.com', phone: '+63 920 444 5555', jobPostingId: 'JP-001', jobTitle: 'Senior React Developer', applicationDate: '2026-06-15', stage: 'Interviewed', resumeFile: 'mark_aquino_resume.pdf' },
  { id: 'APP-005', name: 'Grace Uy', email: 'grace.u@email.com', phone: '+63 921 555 6666', jobPostingId: 'JP-001', jobTitle: 'Senior React Developer', applicationDate: '2026-06-16', stage: 'Job Offer', resumeFile: 'grace_uy_resume.pdf' },
  { id: 'APP-006', name: 'Ryan Diaz', email: 'ryan.d@email.com', phone: '+63 922 666 7777', jobPostingId: 'JP-002', jobTitle: 'Finance Analyst', applicationDate: '2026-06-10', stage: 'Hired', resumeFile: 'ryan_diaz_resume.pdf' },
  { id: 'APP-007', name: 'Pia Santos', email: 'pia.s@email.com', phone: '+63 923 777 8888', jobPostingId: 'JP-002', jobTitle: 'Finance Analyst', applicationDate: '2026-06-11', stage: 'Rejected', resumeFile: 'pia_santos_resume.pdf' },
  { id: 'APP-008', name: 'Alex Ramos', email: 'alex.r@email.com', phone: '+63 924 888 9999', jobPostingId: 'JP-002', jobTitle: 'Finance Analyst', applicationDate: '2026-06-12', stage: 'Shortlisted', resumeFile: 'alex_ramos_resume.pdf' },
  { id: 'APP-009', name: 'Nina Garcia', email: 'nina.g@email.com', phone: '+63 925 999 0000', jobPostingId: 'JP-005', jobTitle: 'Part-time Data Encoder', applicationDate: '2026-06-06', stage: 'Applied', resumeFile: 'nina_garcia_resume.pdf' },
  { id: 'APP-010', name: 'Ben Lopez', email: 'ben.l@email.com', phone: '+63 926 000 1111', jobPostingId: 'JP-005', jobTitle: 'Part-time Data Encoder', applicationDate: '2026-06-07', stage: 'Shortlisted', resumeFile: 'ben_lopez_resume.pdf' },
];

export const interviews: Interview[] = [
  { id: 'INT-001', applicantId: 'APP-002', applicantName: 'Kevin Tan', jobTitle: 'Senior React Developer', date: '2026-06-18', time: '10:00', format: 'Virtual', interviewer: 'Maria Santos', notes: 'Technical interview focusing on React and TypeScript. Prepare a live coding challenge.', status: 'Upcoming' },
  { id: 'INT-002', applicantId: 'APP-004', applicantName: 'Mark Aquino', jobTitle: 'Senior React Developer', date: '2026-06-14', time: '14:00', format: 'On-site', interviewer: 'Maria Santos', notes: 'Final round technical interview.', status: 'Done' },
  { id: 'INT-003', applicantId: 'APP-008', applicantName: 'Alex Ramos', jobTitle: 'Finance Analyst', date: '2026-06-19', time: '11:00', format: 'Virtual', interviewer: 'Camille Bautista', notes: 'Initial HR screening interview.', status: 'Upcoming' },
  { id: 'INT-004', applicantId: 'APP-007', applicantName: 'Pia Santos', jobTitle: 'Finance Analyst', date: '2026-06-13', time: '09:00', format: 'Virtual', interviewer: 'Camille Bautista', notes: 'Initial screening.', status: 'Done' },
];

export const interviewFeedbacks: InterviewFeedback[] = [
  { id: 'FB-001', applicantId: 'APP-004', applicantName: 'Mark Aquino', position: 'Senior React Developer', interviewerId: 'EMP001', evaluatorName: 'Maria Santos', overallImpression: 4, communicationSkills: 4, technicalKnowledge: 5, cultureFit: 4, problemSolving: 5, strengths: 'Strong TypeScript skills. Excellent understanding of React patterns and performance optimization. Communicates clearly under pressure.', areasOfConcern: 'Limited experience with backend integration. Could improve on system design concepts for large-scale applications.', recommendation: 'Hire', submittedDate: '2026-06-15' },
];

export const APPLICANT_STAGES: ApplicantStage[] = ['Applied', 'Shortlisted', 'Interview Scheduled', 'Interviewed', 'Job Offer', 'Hired', 'Rejected'];
