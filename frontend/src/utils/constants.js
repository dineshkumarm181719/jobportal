export const ROLES = {
  CANDIDATE: 'CANDIDATE',
  RECRUITER: 'RECRUITER',
  COMPANY_ADMIN: 'COMPANY_ADMIN',
  SYSTEM_ADMIN: 'SYSTEM_ADMIN',
};

export const APPLICATION_STATUS = {
  APPLIED: 'APPLIED',
  SHORTLISTED: 'SHORTLISTED',
  INTERVIEW_SCHEDULED: 'INTERVIEW_SCHEDULED',
  SELECTED: 'SELECTED',
  REJECTED: 'REJECTED',
  WITHDRAWN: 'WITHDRAWN',
};

export const JOB_STATUS = {
  DRAFT: 'DRAFT',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
};

export const EMPLOYMENT_TYPES = [
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'INTERNSHIP', label: 'Internship' },
  { value: 'REMOTE', label: 'Remote' },
];

export const EXPERIENCE_LEVELS = [
  'Entry Level (0-2 yrs)',
  'Mid Level (3-5 yrs)',
  'Senior Level (5-8 yrs)',
  'Lead / Principal (8+ yrs)',
];

export const DEMO_CREDENTIALS = [
  { role: 'Candidate', email: 'alex.turner@gmail.com', pass: 'Candidate@123', label: 'Alex Turner (Senior Full Stack)' },
  { role: 'Candidate', email: 'priya.sharma@gmail.com', pass: 'Candidate@123', label: 'Priya Sharma (Frontend Architect)' },
  { role: 'Recruiter', email: 'sarah.recruiter@techcorp.com', pass: 'Recruiter@123', label: 'Sarah (TechCorp Recruiter)' },
  { role: 'Recruiter', email: 'david.recruiter@cloudscale.com', pass: 'Recruiter@123', label: 'David (CloudScale Recruiter)' },
  { role: 'Company Admin', email: 'techcorp.admin@careersync.com', pass: 'Admin@123', label: 'Marcus (TechCorp Admin)' },
  { role: 'System Admin', email: 'admin@careersync.com', pass: 'Admin@123', label: 'Platform System Admin' },
];
