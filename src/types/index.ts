export type UserRole = 'student' | 'admin';

export type OpportunityMode = 'Remote' | 'On-site' | 'Hybrid';

export type OpportunityStatus = 'active' | 'closed' | 'draft';

export type ApplicationStatus =
  | 'Saved'
  | 'Planning to Apply'
  | 'Applied'
  | 'Interview'
  | 'Selected'
  | 'Rejected'
  | 'Completed';

export type AnnouncementPriority = 'Urgent' | 'High' | 'Medium' | 'Low';

export type NotificationType =
  | 'match'
  | 'deadline'
  | 'announcement'
  | 'application'
  | 'recommendation';

export interface StudentPreferences {
  workModes?: OpportunityMode[];
  opportunityTypes?: string[];
  isPaidOnly?: boolean;
  relocationOpen?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  role: UserRole;
  college?: string;
  department?: string;
  degree?: string;
  year?: string;
  semester?: string;
  skills: string[];
  interests: string[];
  careerGoals: string[];
  preferences: StudentPreferences;
  createdAt?: string;
  updatedAt?: string;
}

export interface OpportunityEligibility {
  allowedYears?: string[];
  allowedDepartments?: string[];
  minGpa?: number;
  experienceRequired?: boolean;
  additionalCriteria?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  description: string;
  category: string; // 'Internship' | 'Hackathon' | 'Scholarship' | 'Workshop' | 'Competition' | 'Placement' | 'Research'
  location: string;
  mode: OpportunityMode;
  deadline: string; // YYYY-MM-DD or readable
  eligibility: OpportunityEligibility;
  skills: string[];
  benefits: string[];
  applicationUrl: string;
  department?: string;
  createdBy?: string;
  status: OpportunityStatus;
  isPaid?: boolean;
  stipendAmount?: string;
  featured?: boolean;
  applicantCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  summary?: string;
  category: string; // 'Academic' | 'Placement' | 'Department' | 'Clubs' | 'Events' | 'Exams' | 'Workshops' | 'General'
  department?: string;
  priority: AnnouncementPriority;
  author: string;
  attachments?: string[];
  published: boolean;
  createdAt: string;
}

export interface SavedOpportunity {
  id: string;
  userId: string;
  opportunityId: string;
  createdAt: string;
}

export interface ApplicationRecord {
  id: string;
  userId: string;
  opportunityId: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
  notes?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface MatchScoreBreakdown {
  totalScore: number;
  skillScore: number; // 40%
  interestScore: number; // 25%
  eligibilityScore: number; // 20%
  careerScore: number; // 10%
  preferenceScore: number; // 5%
  reasons: string[];
  matchedSkills: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedActions?: { label: string; action: string }[];
}
