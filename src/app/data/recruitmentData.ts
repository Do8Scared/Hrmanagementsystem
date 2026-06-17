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

export const APPLICANT_STAGES: ApplicantStage[] = ['Applied', 'Shortlisted', 'Interview Scheduled', 'Interviewed', 'Job Offer', 'Hired', 'Rejected'];
