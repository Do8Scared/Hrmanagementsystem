import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const announcements = [
  { type: 'Advisory', title: 'Office Relocation Update', refNumber: 'ADV-2026-001', effectivityDate: '2026-07-01', targetAudience: 'All Employees', targetDepartments: [], requiresAcknowledgement: true, content: 'We are moving to a new office building on July 1st.', attachedFile: 'relocation_map.pdf', status: 'Published', publishedDate: '2026-06-10', publishedBy: 'Sofia Garcia', totalRecipients: 24, readCount: 18 },
  { type: 'Memorandum', title: 'Revised Remote Work Guidelines', refNumber: 'MEM-2026-045', effectivityDate: '2026-06-15', targetAudience: 'Specific Department', targetDepartments: ['Engineering', 'Design'], requiresAcknowledgement: true, content: 'Remote work guidelines have been updated.', attachedFile: '', status: 'Published', publishedDate: '2026-06-12', publishedBy: 'Sofia Garcia', totalRecipients: 8, readCount: 8 }
];

const jobPostings = [
  { title: 'Senior React Developer', department: 'Engineering', datePosted: '2026-06-11', deadline: '2026-07-11', applicantCount: 8, status: 'Open', description: 'Join our engineering team.', qualifications: '3 years React', slots: 2, employmentType: 'Full Time', publishToBoard: true },
  { title: 'Finance Analyst', department: 'Finance', datePosted: '2026-06-09', deadline: '2026-06-30', applicantCount: 12, status: 'Open', description: 'Support finance.', qualifications: 'CPA', slots: 1, employmentType: 'Full Time', publishToBoard: true }
];

const manpowerRequests = [
  { department: 'Engineering', requestingManager: 'Maria Santos', positionTitle: 'Senior React Developer', headcount: 2, dateRequested: '2026-06-10', status: 'Pending', employmentType: 'Full Time', jobDescription: 'Need devs', qualifications: 'React', urgency: 'High', justification: 'Understaffed', preferredStartDate: '2026-07-15' }
];

async function seed() {
  await supabase.from('announcements').insert(announcements);
  await supabase.from('job_postings').insert(jobPostings);
  await supabase.from('manpower_requests').insert(manpowerRequests);
  console.log('Seeding complete.');
}
seed();
