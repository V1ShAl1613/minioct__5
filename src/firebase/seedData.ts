import type { Opportunity, Announcement, UserProfile } from '../types/index.ts';

export const DEMO_STUDENT: UserProfile = {
  id: 'demo-student-alex',
  name: 'Alex Rivera',
  email: 'alex.rivera@campus.edu',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  role: 'student',
  college: 'National Institute of Technology',
  department: 'Computer Science and Engineering',
  degree: 'Bachelor of Technology (B.Tech)',
  year: '3rd Year',
  semester: '6th Semester',
  skills: [
    'Python',
    'AI/ML',
    'React',
    'Cloud',
    'SQL',
    'Generative AI',
    'JavaScript',
    'Git',
    'Data Science'
  ],
  interests: [
    'Artificial Intelligence',
    'Machine Learning',
    'Hackathons',
    'Internships',
    'Web Development',
    'Open Source'
  ],
  careerGoals: [
    'AI Engineer',
    'Software Engineer',
    'Machine Learning Scientist'
  ],
  preferences: {
    workModes: ['Remote', 'Hybrid'],
    opportunityTypes: ['Internship', 'Hackathon', 'Workshop', 'Placement'],
    isPaidOnly: false,
    relocationOpen: true
  },
  createdAt: '2026-09-01T09:00:00Z',
  updatedAt: '2026-10-04T12:00:00Z'
};

export const SEED_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'AI Innovation Hackathon 2026',
    organization: 'Apex AI Foundation & TechSphere',
    description: 'A flagship 48-hour global student hackathon challenging teams to architect production-ready Agentic AI and Generative AI applications for real-world social impact and enterprise automation. Mentored by top engineers from leading research labs.',
    category: 'Hackathon',
    location: 'Virtual / Online',
    mode: 'Remote',
    deadline: '2026-10-18',
    eligibility: {
      allowedYears: ['2nd Year', '3rd Year', '4th Year'],
      allowedDepartments: ['Computer Science and Engineering', 'Information Technology', 'Data Science', 'Electronics'],
      minGpa: 6.5,
      experienceRequired: false,
      additionalCriteria: 'Teams of 2 to 4 undergraduate and postgraduate students.'
    },
    skills: ['Python', 'AI/ML', 'Generative AI', 'React', 'FastAPI'],
    benefits: [
      '$15,000 Total Prize Pool',
      'Fast-track interview rounds at sponsor AI startups',
      'Cloud compute credits worth $500 per team',
      'Global verified digital credential'
    ],
    applicationUrl: 'https://hackathon.campusconnect.dev/ai-2026',
    department: 'Computer Science and Engineering',
    status: 'active',
    isPaid: false,
    featured: true,
    applicantCount: 342,
    createdAt: '2026-09-28T10:00:00Z'
  },
  {
    id: 'opp-2',
    title: 'Google AI & Machine Learning Summer Internship',
    organization: 'Google',
    description: 'Join the Google Core AI research and infrastructure team as a Software Engineering Intern. You will design scalable ML pipelines, optimize model inference architectures, and collaborate with world-class engineers.',
    category: 'Internship',
    location: 'Mountain View, CA / Bangalore',
    mode: 'Hybrid',
    deadline: '2026-10-25',
    eligibility: {
      allowedYears: ['3rd Year', 'Pre-Final Year'],
      allowedDepartments: ['Computer Science and Engineering', 'Information Technology', 'Mathematics and Computing'],
      minGpa: 7.5,
      experienceRequired: false,
      additionalCriteria: 'Expected graduation in 2027 or late 2026.'
    },
    skills: ['Python', 'AI/ML', 'Data Structures & Algorithms', 'C++', 'TensorFlow/PyTorch'],
    benefits: [
      'Competitive monthly stipend ($7,500 / month equivalent)',
      'Housing allowance and relocation support',
      'Direct conversion to full-time Pre-Placement Offer (PPO)',
      '1:1 Senior Staff Engineer mentorship'
    ],
    applicationUrl: 'https://careers.google.com/students',
    department: 'Computer Science and Engineering',
    status: 'active',
    isPaid: true,
    stipendAmount: '$7,500 / month',
    featured: true,
    applicantCount: 1250,
    createdAt: '2026-09-20T14:30:00Z'
  },
  {
    id: 'opp-3',
    title: 'Python Developer Internship (Full Stack Backend)',
    organization: 'Nexora Cloud Technologies',
    description: 'Nexora is seeking an ambitious Python developer intern to assist in scaling our microservices backend, building REST & GraphQL endpoints, and integrating PostgreSQL and Redis caching layers.',
    category: 'Internship',
    location: 'Remote',
    mode: 'Remote',
    deadline: '2026-10-08',
    eligibility: {
      allowedYears: ['2nd Year', '3rd Year', '4th Year'],
      allowedDepartments: ['Any Engineering Discipline'],
      minGpa: 6.0,
      experienceRequired: false,
      additionalCriteria: 'Strong fundamentals in OOP and database queries.'
    },
    skills: ['Python', 'Django', 'FastAPI', 'SQL', 'Git', 'Docker'],
    benefits: [
      'Stipend: $1,800 / month',
      'Flexible working hours compatible with college schedule',
      'Letter of Recommendation & Performance Bonus',
      'Opportunity for full-time junior engineer offer'
    ],
    applicationUrl: 'https://nexora.tech/careers/python-intern',
    department: 'Computer Science and Engineering',
    status: 'active',
    isPaid: true,
    stipendAmount: '$1,800 / month',
    featured: false,
    applicantCount: 180,
    createdAt: '2026-09-29T11:00:00Z'
  },
  {
    id: 'opp-4',
    title: 'Global GenAI Student Challenge 2026',
    organization: 'Microsoft Learn Student Ambassadors',
    description: 'Build breakthrough generative AI solutions leveraging Azure OpenAI Service, multimodal agents, and open-source models. Showcase your project to industry leaders and compete for global recognition.',
    category: 'Competition',
    location: 'Online',
    mode: 'Remote',
    deadline: '2026-10-30',
    eligibility: {
      allowedYears: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
      allowedDepartments: ['All Departments'],
      minGpa: 0,
      experienceRequired: false
    },
    skills: ['Generative AI', 'Python', 'React', 'Cloud', 'Prompt Engineering'],
    benefits: [
      '$25,000 Global Grand Prize',
      'Invitation to Microsoft Seattle Student Summit',
      'Complimentary Azure AI Certification Vouchers',
      'Direct interview with Microsoft Recruitment'
    ],
    applicationUrl: 'https://studentambassadors.microsoft.com/genai-challenge',
    department: 'Information Technology',
    status: 'active',
    isPaid: false,
    featured: true,
    applicantCount: 890,
    createdAt: '2026-09-15T08:00:00Z'
  },
  {
    id: 'opp-5',
    title: 'Cybersecurity Defense Hackathon & CTF',
    organization: 'CyberShield National Security Council',
    description: 'An intensive 36-hour Capture The Flag (CTF) and defense scenario competition focusing on web security, network penetration testing, cryptography, and securing cloud deployments.',
    category: 'Hackathon',
    location: 'Campus Auditorium / Hybrid',
    mode: 'Hybrid',
    deadline: '2026-10-15',
    eligibility: {
      allowedYears: ['2nd Year', '3rd Year', '4th Year'],
      allowedDepartments: ['Computer Science and Engineering', 'Information Technology', 'Cybersecurity'],
      minGpa: 6.5,
      experienceRequired: false
    },
    skills: ['Cybersecurity', 'Python', 'Linux', 'Networking', 'SQL'],
    benefits: [
      'Cash awards of $5,000 for top 3 teams',
      'Sponsored CEH / CompTIA Security+ exam voucher',
      'Internship opportunities with elite defense contractors',
      'Campus trophy and certificate of distinction'
    ],
    applicationUrl: 'https://cybershield.edu/ctf-2026',
    department: 'Computer Science and Engineering',
    status: 'active',
    isPaid: false,
    featured: false,
    applicantCount: 215,
    createdAt: '2026-09-25T16:00:00Z'
  },
  {
    id: 'opp-6',
    title: 'Data Science & Predictive Analytics Internship',
    organization: 'FinTech Pulse Analytics',
    description: 'Analyze multi-million financial transaction datasets, train customer churn and fraud detection neural networks, and deploy automated monitoring dashboards for enterprise banking clients.',
    category: 'Internship',
    location: 'New York, NY / Hybrid',
    mode: 'Hybrid',
    deadline: '2026-10-22',
    eligibility: {
      allowedYears: ['3rd Year', '4th Year'],
      allowedDepartments: ['Computer Science and Engineering', 'Data Science', 'Statistics', 'Mathematics'],
      minGpa: 7.0,
      experienceRequired: false
    },
    skills: ['Data Science', 'Python', 'SQL', 'AI/ML', 'Pandas', 'Tableau'],
    benefits: [
      'Stipend: $2,500 / month',
      'Hands-on experience with production-scale financial data',
      'Executive mentorship and weekly skill clinics',
      'High conversion to full-time Associate Data Scientist'
    ],
    applicationUrl: 'https://fintechpulse.io/internships',
    department: 'Data Science',
    status: 'active',
    isPaid: true,
    stipendAmount: '$2,500 / month',
    featured: false,
    applicantCount: 410,
    createdAt: '2026-09-22T09:30:00Z'
  },
  {
    id: 'opp-7',
    title: 'Cross-Platform Flutter Mobile App Challenge',
    organization: 'DevCommunity International',
    description: 'Design and engineer an accessible, cross-platform mobile application in Flutter addressing student campus life, productivity, or mental well-being. Evaluated on UI/UX polish, architecture, and responsiveness.',
    category: 'Competition',
    location: 'Online',
    mode: 'Remote',
    deadline: '2026-11-05',
    eligibility: {
      allowedYears: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
      allowedDepartments: ['All Departments'],
      minGpa: 0,
      experienceRequired: false
    },
    skills: ['Flutter', 'Dart', 'UI/UX', 'Firebase', 'Mobile Development'],
    benefits: [
      '$8,000 Prize Pool',
      'App store publication sponsorship',
      'Featured showcase on DevCommunity mobile portal',
      'Swag kit and certificate'
    ],
    applicationUrl: 'https://flutterchallenge.dev',
    department: 'Information Technology',
    status: 'active',
    isPaid: false,
    featured: false,
    applicantCount: 165,
    createdAt: '2026-09-30T13:00:00Z'
  },
  {
    id: 'opp-8',
    title: 'Undergraduate AI Research Fellowship 2026-27',
    organization: 'Center for Computational Intelligence',
    description: 'A prestigious 6-month research fellowship for undergraduate students to publish peer-reviewed papers on trustworthy generative AI, model alignment, and low-resource language processing under faculty supervision.',
    category: 'Research',
    location: 'Campus AI Research Lab',
    mode: 'On-site',
    deadline: '2026-10-20',
    eligibility: {
      allowedYears: ['3rd Year', '4th Year'],
      allowedDepartments: ['Computer Science and Engineering', 'Data Science', 'Electrical Engineering'],
      minGpa: 8.0,
      experienceRequired: true,
      additionalCriteria: 'Must have completed coursework in Data Structures, Probability, and Machine Learning.'
    },
    skills: ['Python', 'AI/ML', 'Research', 'Mathematics', 'PyTorch'],
    benefits: [
      '$1,200 / month academic grant',
      'Co-authorship on peer-reviewed international conference papers (NeurIPS/ICML)',
      'Dedicated GPU workstation access in campus lab',
      'Strong recommendation letter for top US/EU Master and PhD programs'
    ],
    applicationUrl: 'https://research.campus.edu/ai-fellowship',
    department: 'Computer Science and Engineering',
    status: 'active',
    isPaid: true,
    stipendAmount: '$1,200 / month',
    featured: true,
    applicantCount: 95,
    createdAt: '2026-09-18T15:00:00Z'
  },
  {
    id: 'opp-9',
    title: 'Cloud Computing & DevOps Masterclass Workshop',
    organization: 'AWS Cloud Student Academy',
    description: 'A 3-day hands-on intensive workshop covering containerization with Docker, Kubernetes cluster orchestration, Terraform Infrastructure-as-Code, and automated CI/CD deployment pipelines on AWS.',
    category: 'Workshop',
    location: 'Computer Center Seminar Hall & Live Stream',
    mode: 'Hybrid',
    deadline: '2026-10-12',
    eligibility: {
      allowedYears: ['2nd Year', '3rd Year', '4th Year'],
      allowedDepartments: ['Computer Science and Engineering', 'Information Technology', 'Electronics'],
      minGpa: 0,
      experienceRequired: false
    },
    skills: ['Cloud', 'Docker', 'Kubernetes', 'Linux', 'DevOps', 'AWS'],
    benefits: [
      'Official AWS Academy Certificate of Training',
      'Free AWS Cloud Practitioner Exam Voucher ($100 value)',
      'Free hands-on sandbox labs during the workshop',
      'Live Q&A with AWS Solutions Architects'
    ],
    applicationUrl: 'https://awsacademy.campus.edu/masterclass',
    department: 'Computer Science and Engineering',
    status: 'active',
    isPaid: false,
    featured: false,
    applicantCount: 520,
    createdAt: '2026-09-26T12:00:00Z'
  },
  {
    id: 'opp-10',
    title: 'Campus Startup Pitch & Venture Seed Competition',
    organization: 'E-Cell & Institutional Innovation Council',
    description: 'Have a startup idea or tech prototype? Pitch in front of angel investors, venture capitalists, and alumni founders. Selected startups receive equity-free seed grants, legal incorporation assistance, and incubator office space.',
    category: 'Competition',
    location: 'Innovation & Incubation Hub, Main Campus',
    mode: 'On-site',
    deadline: '2026-10-28',
    eligibility: {
      allowedYears: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
      allowedDepartments: ['All Departments'],
      minGpa: 0,
      experienceRequired: false,
      additionalCriteria: 'Open to solo founders or teams of up to 5 students.'
    },
    skills: ['Entrepreneurship', 'Pitching', 'Product Design', 'UI/UX', 'Business Strategy'],
    benefits: [
      'Up to $20,000 Equity-Free Seed Funding',
      '1 Year free physical incubation space and high-speed fiber',
      'Access to university legal and IP patent filing support',
      'Direct pitch meeting with partner Angel Networks'
    ],
    applicationUrl: 'https://ecell.campus.edu/venture-pitch-2026',
    department: 'Multidisciplinary',
    status: 'active',
    isPaid: false,
    featured: true,
    applicantCount: 140,
    createdAt: '2026-09-12T10:00:00Z'
  },
  {
    id: 'opp-11',
    title: 'Women in Tech Merit Scholarship 2026',
    organization: 'Ada Lovelace Global STEM Initiative',
    description: 'Annual scholarship honoring excellence in computer science and technology. Provides academic tuition sponsorship and 1-year executive leadership mentoring for high-achieving female engineering students.',
    category: 'Scholarship',
    location: 'National / Online',
    mode: 'Remote',
    deadline: '2026-11-15',
    eligibility: {
      allowedYears: ['2nd Year', '3rd Year'],
      allowedDepartments: ['Computer Science and Engineering', 'Information Technology', 'Data Science', 'Electronics'],
      minGpa: 7.5,
      experienceRequired: false
    },
    skills: ['Academic Excellence', 'Python', 'Leadership', 'Community Impact'],
    benefits: [
      '$5,000 One-time Tuition Grant',
      'Laptop allowance and technical book stipend',
      'Quarterly 1:1 sessions with VP-level tech leaders',
      'All-expenses-paid trip to the Grace Hopper Celebration'
    ],
    applicationUrl: 'https://adalovelace.org/scholarship-2026',
    department: 'Computer Science and Engineering',
    status: 'active',
    isPaid: true,
    stipendAmount: '$5,000 Scholarship',
    featured: false,
    applicantCount: 310,
    createdAt: '2026-09-10T11:00:00Z'
  },
  {
    id: 'opp-12',
    title: 'Campus Placement Drive: Cloud Platform Engineer',
    organization: 'Oracle Corporation',
    description: 'On-campus recruitment drive for 2026-27 graduating batch. Hiring Cloud Platform and Distributed Systems engineers for next-gen Autonomous Database and OCI cloud infrastructure.',
    category: 'Placement',
    location: 'Campus Placement Cell & On-site Assessment',
    mode: 'On-site',
    deadline: '2026-10-14',
    eligibility: {
      allowedYears: ['3rd Year', '4th Year'],
      allowedDepartments: ['Computer Science and Engineering', 'Information Technology'],
      minGpa: 7.0,
      experienceRequired: false,
      additionalCriteria: 'No active academic backlogs at the time of joining.'
    },
    skills: ['Java', 'Cloud', 'SQL', 'Data Structures & Algorithms', 'Linux', 'Operating Systems'],
    benefits: [
      'Full-time CTC: $32,000 / annum (Equivalent entry tier)',
      'Comprehensive medical insurance and wellness allowance',
      'ESOP stock grants with 4-year vesting schedule',
      'Joining bonus and relocation package'
    ],
    applicationUrl: 'https://placement.campus.edu/oracle-2026',
    department: 'Computer Science and Engineering',
    status: 'active',
    isPaid: true,
    stipendAmount: '$32,000 / year',
    featured: true,
    applicantCount: 680,
    createdAt: '2026-09-27T08:00:00Z'
  }
];

export const SEED_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Mandatory Placement Registration & Resume Verification Portal Opens',
    description: 'All pre-final and final year students (3rd and 4th year B.Tech) intending to participate in the 2026-2027 On-Campus Placement Drives must complete profile registration and upload university-verified resumes by October 15, 2026 at 11:59 PM. Late submissions will result in disqualification from Tier-1 corporate visits.',
    summary: 'Placement registration closes on October 15. Eligible 3rd and 4th-year students must complete verification on the placement portal to attend Tier-1 company drives.',
    category: 'Placement',
    department: 'Training and Placement Cell',
    priority: 'Urgent',
    author: 'Prof. David Vance, Head of Placements',
    attachments: ['Placement_Guidelines_2026.pdf', 'Resume_Template_Standard.docx'],
    published: true,
    createdAt: '2026-10-02T09:00:00Z'
  },
  {
    id: 'ann-2',
    title: 'Internal Hackathon for Smart India & Global Hackathon Nominations',
    description: 'The Department of Computer Science is hosting the college internal hackathon on October 16 in the Central Computing Labs. Shortlisted teams will represent the university at national hackathons with fully sponsored travel and hardware allowances.',
    summary: 'Internal hackathon scheduled for October 16 in Central Labs. Top teams win direct national nominations and travel sponsorship.',
    category: 'Events',
    department: 'Computer Science and Engineering',
    priority: 'High',
    author: 'Dr. Sarah Jenkins, Faculty Coordinator',
    attachments: ['Hackathon_Problem_Statements.pdf'],
    published: true,
    createdAt: '2026-10-01T14:20:00Z'
  },
  {
    id: 'ann-3',
    title: 'Hands-on Workshop: Building Large Language Model Agents with LangChain',
    description: 'Join the Google Developer Student Club (GDSC) this Saturday, October 11, for an in-depth practical lab on architecting autonomous LLM agents, vector memory with ChromaDB, and tool execution. Free lunch and stickers for all attendees.',
    summary: 'GDSC hands-on LLM Agents workshop this Saturday, Oct 11. Hands-on code with LangChain and vector DBs.',
    category: 'Workshops',
    department: 'Clubs & Student Chapters',
    priority: 'Medium',
    author: 'GDSC Student Chapter',
    attachments: ['Workshop_Prerequisites_Setup.pdf'],
    published: true,
    createdAt: '2026-10-03T11:00:00Z'
  },
  {
    id: 'ann-4',
    title: 'Mid-Semester Examination Schedule & Seating Arrangement Published',
    description: 'The Office of the Controller of Examinations has published the revised timetable for B.Tech Mid-Semester Theory and Practical examinations starting October 22. Hall tickets can be downloaded from the student portal starting Monday.',
    summary: 'Mid-term exams begin October 22. Download digital hall tickets from the student ERP starting Monday.',
    category: 'Exams',
    department: 'Examination Branch',
    priority: 'High',
    author: 'Controller of Examinations',
    attachments: ['MidSem_Schedule_Oct2026.pdf'],
    published: true,
    createdAt: '2026-09-30T16:45:00Z'
  },
  {
    id: 'ann-5',
    title: 'Bi-Weekly Competitive Programming League: Contest #4 Announced',
    description: 'The Campus Coding Club is hosting its fourth round of the CP league on HackerRank this Wednesday at 8:00 PM. Top 10 rankers receive Codeforces merchandise and priority recommendation for ICPC regionals training team.',
    summary: 'Round 4 of CP League takes place Wednesday 8:00 PM on HackerRank. Qualifies for ICPC team selection.',
    category: 'Clubs',
    department: 'Campus Coding Club',
    priority: 'Medium',
    author: 'Lead Coordinator, Coding Club',
    attachments: [],
    published: true,
    createdAt: '2026-10-03T18:00:00Z'
  },
  {
    id: 'ann-6',
    title: 'Summer Internship Orientation & Resume Clinic for 2nd and 3rd Years',
    description: 'Join alumni working at Microsoft, Amazon, and Uber as they review student resumes live, share cold emailing tactics, and outline tech interview preparation roadmaps. Thursday, Oct 9 at 6:00 PM in the Main Auditorium.',
    summary: 'Alumni internship roadmap and live resume review on Oct 9 at 6:00 PM in Main Auditorium.',
    category: 'Academic',
    department: 'Alumni Relations & Career Guidance',
    priority: 'Medium',
    author: 'Career Advisory Board',
    attachments: ['Alumni_Panel_Speakers.pdf'],
    published: true,
    createdAt: '2026-09-28T10:15:00Z'
  },
  {
    id: 'ann-7',
    title: 'Library Extended Hours During Examination Fortnight',
    description: 'The Central University Library will remain open 24 hours a day from October 15 through November 5 to facilitate exam preparation. High-speed Wi-Fi, quiet discussion pods, and cafeteria access will be available overnight.',
    summary: 'Central Library will be open 24/7 from October 15 to November 5 for examination preparation.',
    category: 'General',
    department: 'Central University Library',
    priority: 'Low',
    author: 'Chief Librarian',
    attachments: [],
    published: true,
    createdAt: '2026-10-02T13:00:00Z'
  },
  {
    id: 'ann-8',
    title: 'Call for Student Submissions: Annual TechFest 2026 Branding & Website',
    description: 'The organizing committee of Innovatia 2026 invites student UI/UX designers and web developers to submit design prototypes for the official festival portal. Selected team will lead the official media development.',
    summary: 'Design submissions open for Innovatia 2026 techfest portal. Winners become official web leads.',
    category: 'Events',
    department: 'Student Affairs Council',
    priority: 'Low',
    author: 'TechFest Organizing Committee',
    attachments: ['Design_Brief_Innovatia.pdf'],
    published: true,
    createdAt: '2026-09-27T15:30:00Z'
  },
  {
    id: 'ann-9',
    title: 'Special Elective Subject Selection for Upcoming Spring Semester',
    description: 'Window for opting into open departmental electives (Cloud Architecture, Advanced Deep Learning, Quantum Computing, or FinTech Engineering) opens Friday at 10:00 AM on the student portal. Seats are allocated on a first-come, first-served basis.',
    summary: 'Elective course selection opens Friday 10:00 AM. First-come, first-served allocation on student portal.',
    category: 'Academic',
    department: 'Academic Dean Office',
    priority: 'High',
    author: 'Dean of Academic Affairs',
    attachments: ['Electives_Syllabus_Spring2027.pdf'],
    published: true,
    createdAt: '2026-10-04T08:30:00Z'
  },
  {
    id: 'ann-10',
    title: 'Campus Incubation Center: Grant Proposals for Student Hardware Projects',
    description: 'Student hardware and IoT research groups can apply for up to $3,000 prototyping grants funded by the State Innovation Grant. Proposals must include component bill of materials and faculty advisor endorsement.',
    summary: 'Hardware prototyping grants up to $3,000 now open for student IoT/embedded projects. Deadline Oct 31.',
    category: 'Department',
    department: 'Institutional Innovation Council',
    priority: 'Medium',
    author: 'Dr. Michael Chang, IIC Director',
    attachments: ['Grant_Application_Template.docx'],
    published: true,
    createdAt: '2026-09-24T12:00:00Z'
  }
];
