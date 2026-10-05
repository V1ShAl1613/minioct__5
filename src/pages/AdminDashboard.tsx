import React, { useState, useMemo } from 'react';
import {
  Shield,
  Plus,
  Trash2,
  Edit,
  Sparkles,
  BarChart3,
  Users,
  Layers,
  Calendar,
  Building,
  CheckCircle2,
  FileText,
  AlertCircle,
  Briefcase,
  ExternalLink,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import type { Opportunity, Announcement, ApplicationRecord, UserProfile } from '../types/index.ts';
import { extractMetadataAI, summarizeAnnouncementAI } from '../services/aiService.ts';

interface AdminDashboardProps {
  opportunities: Opportunity[];
  announcements: Announcement[];
  applications: ApplicationRecord[];
  onSaveOpportunity: (opp: Opportunity) => Promise<void>;
  onDeleteOpportunity: (id: string) => Promise<void>;
  onSaveAnnouncement: (ann: Announcement) => Promise<void>;
  onDeleteAnnouncement: (id: string) => Promise<void>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  opportunities,
  announcements,
  applications,
  onSaveOpportunity,
  onDeleteOpportunity,
  onSaveAnnouncement,
  onDeleteAnnouncement,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'opportunities' | 'announcements' | 'students'>('analytics');

  // Opportunity Form State
  const [isOppModalOpen, setIsOppModalOpen] = useState(false);
  const [oppTitle, setOppTitle] = useState('');
  const [oppOrg, setOppOrg] = useState('');
  const [oppDesc, setOppDesc] = useState('');
  const [oppCategory, setOppCategory] = useState('Internship');
  const [oppLocation, setOppLocation] = useState('Remote');
  const [oppMode, setOppMode] = useState<'Remote' | 'On-site' | 'Hybrid'>('Remote');
  const [oppDeadline, setOppDeadline] = useState('2026-11-15');
  const [oppSkills, setOppSkills] = useState('Python, AI/ML, SQL');
  const [oppBenefits, setOppBenefits] = useState('Stipend: $2,000/mo, Certificate, Mentorship');
  const [oppUrl, setOppUrl] = useState('https://careers.company.com/apply');
  const [oppDepartment, setOppDepartment] = useState('Computer Science and Engineering');
  const [oppStatus, setOppStatus] = useState<'active' | 'closed' | 'draft'>('active');
  const [isPaid, setIsPaid] = useState(true);
  const [editingOppId, setEditingOppId] = useState<string | null>(null);
  const [isExtractingAI, setIsExtractingAI] = useState(false);

  // Announcement Form State
  const [isAnnModalOpen, setIsAnnModalOpen] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annDesc, setAnnDesc] = useState('');
  const [annSummary, setAnnSummary] = useState('');
  const [annCategory, setAnnCategory] = useState('Academic');
  const [annDept, setAnnDept] = useState('Dean of Academic Affairs');
  const [annPriority, setAnnPriority] = useState<'Urgent' | 'High' | 'Medium' | 'Low'>('Medium');
  const [annAuthor, setAnnAuthor] = useState('Office of Student Affairs');
  const [isSummarizingAI, setIsSummarizingAI] = useState(false);

  // Analytics Data for Recharts
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    opportunities.forEach(o => {
      counts[o.category] = (counts[o.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [opportunities]);

  const applicationTimelineData = [
    { date: 'Sep 25', applications: 24, views: 180 },
    { date: 'Sep 27', applications: 45, views: 320 },
    { date: 'Sep 29', applications: 68, views: 490 },
    { date: 'Oct 01', applications: 92, views: 640 },
    { date: 'Oct 03', applications: 124, views: 820 },
    { date: 'Oct 04', applications: 168, views: 1150 },
  ];

  const popularCategoryColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];

  // AI Skill Extraction
  const handleAIExtract = async () => {
    if (!oppTitle && !oppDesc) return;
    setIsExtractingAI(true);
    try {
      const extracted = await extractMetadataAI(oppTitle, oppDesc);
      if (extracted.skills && Array.isArray(extracted.skills)) {
        setOppSkills(extracted.skills.join(', '));
      }
      if (extracted.category) {
        setOppCategory(extracted.category);
      }
      if (extracted.benefits && Array.isArray(extracted.benefits)) {
        setOppBenefits(extracted.benefits.join(', '));
      }
    } finally {
      setIsExtractingAI(false);
    }
  };

  // AI Announcement Summary
  const handleAISummarize = async () => {
    if (!annTitle && !annDesc) return;
    setIsSummarizingAI(true);
    try {
      const summary = await summarizeAnnouncementAI(annTitle, annDesc);
      setAnnSummary(summary);
    } finally {
      setIsSummarizingAI(false);
    }
  };

  const handleSaveOppSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = oppSkills.split(',').map(s => s.trim()).filter(Boolean);
    const benefitsArray = oppBenefits.split(',').map(b => b.trim()).filter(Boolean);

    await onSaveOpportunity({
      id: editingOppId || `opp-${Date.now()}`,
      title: oppTitle,
      organization: oppOrg,
      description: oppDesc,
      category: oppCategory,
      location: oppLocation,
      mode: oppMode,
      deadline: oppDeadline,
      skills: skillsArray,
      benefits: benefitsArray,
      applicationUrl: oppUrl,
      department: oppDepartment,
      status: oppStatus,
      isPaid,
      eligibility: {
        allowedYears: ['2nd Year', '3rd Year', '4th Year'],
        allowedDepartments: [oppDepartment],
      },
    });

    setIsOppModalOpen(false);
    setEditingOppId(null);
  };

  const handleSaveAnnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveAnnouncement({
      id: `ann-${Date.now()}`,
      title: annTitle,
      description: annDesc,
      summary: annSummary,
      category: annCategory,
      department: annDept,
      priority: annPriority,
      author: annAuthor,
      published: true,
      createdAt: new Date().toISOString(),
    });
    setIsAnnModalOpen(false);
  };

  const openEditOpp = (opp: Opportunity) => {
    setEditingOppId(opp.id);
    setOppTitle(opp.title);
    setOppOrg(opp.organization);
    setOppDesc(opp.description);
    setOppCategory(opp.category);
    setOppLocation(opp.location);
    setOppMode(opp.mode);
    setOppDeadline(opp.deadline);
    setOppSkills(opp.skills.join(', '));
    setOppBenefits(opp.benefits.join(', '));
    setOppUrl(opp.applicationUrl);
    setOppDepartment(opp.department || 'Computer Science and Engineering');
    setOppStatus(opp.status);
    setIsPaid(opp.isPaid || false);
    setIsOppModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-150">
      {/* Admin Banner & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              Administrator Control Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            CampusConnect Admin
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Publish college circulars, curate AI-matched opportunities, and evaluate student engagement.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setEditingOppId(null);
              setOppTitle('');
              setOppOrg('');
              setOppDesc('');
              setIsOppModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Post Opportunity</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAnnTitle('');
              setAnnDesc('');
              setAnnSummary('');
              setIsAnnModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Broadcast Circular</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        {[
          { id: 'analytics', label: 'Analytics & Trends', icon: BarChart3 },
          { id: 'opportunities', label: `Opportunities (${opportunities.length})`, icon: Briefcase },
          { id: 'announcements', label: `Campus Circulars (${announcements.length})`, icon: FileText },
          { id: 'students', label: 'Students Overview', icon: Users },
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === t.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ANALYTICS & RECHARTS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Total Students
              </span>
              <span className="text-3xl font-extrabold text-white mt-1 block">1,480</span>
              <span className="text-[11px] text-emerald-400">+12% this month</span>
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Active Opportunities
              </span>
              <span className="text-3xl font-extrabold text-blue-400 mt-1 block">
                {opportunities.length}
              </span>
              <span className="text-[11px] text-blue-400/80">All departments</span>
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Tracked Applications
              </span>
              <span className="text-3xl font-extrabold text-indigo-400 mt-1 block">
                {applications.length * 8 + 32}
              </span>
              <span className="text-[11px] text-indigo-400/80">38 interviews active</span>
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Circulars Broadcasted
              </span>
              <span className="text-3xl font-extrabold text-amber-400 mt-1 block">
                {announcements.length}
              </span>
              <span className="text-[11px] text-amber-400/80">100% with AI summaries</span>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Chart 1: Application Trends */}
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Student Applications Over Time</h3>
                  <p className="text-xs text-slate-400">Total student applications and profile views</p>
                </div>
                <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg">
                  Fall 2026 Drive
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={applicationTimelineData}>
                    <defs>
                      <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="applications"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorApp)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Opportunities by Category */}
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Opportunities by Category</h3>
                  <p className="text-xs text-slate-400">Distribution across internships, hackathons & more</p>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={popularCategoryColors[index % popularCategoryColors.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OPPORTUNITIES MANAGEMENT */}
      {activeTab === 'opportunities' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Active Opportunities</h3>
            <span className="text-xs text-slate-400">Showing {opportunities.length} listings</span>
          </div>

          <div className="space-y-3">
            {opportunities.map(opp => (
              <div
                key={opp.id}
                className="rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                      {opp.category}
                    </span>
                    <span className="text-xs text-slate-400">{opp.mode}</span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-400">Deadline: {opp.deadline}</span>
                  </div>
                  <h4 className="text-base font-bold text-white">{opp.title}</h4>
                  <p className="text-xs text-slate-400 truncate">{opp.organization} • {opp.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditOpp(opp)}
                    className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors"
                    title="Edit opportunity"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteOpportunity(opp.id)}
                    className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 transition-colors"
                    title="Delete opportunity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ANNOUNCEMENTS MANAGEMENT */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Campus Circulars & Notices</h3>
            <span className="text-xs text-slate-400">Total {announcements.length} circulars</span>
          </div>

          <div className="space-y-3">
            {announcements.map(ann => (
              <div
                key={ann.id}
                className="rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                      {ann.priority} Priority
                    </span>
                    <span className="text-xs text-blue-400 font-semibold">{ann.category}</span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-400">{ann.department}</span>
                  </div>
                  <h4 className="text-base font-bold text-white">{ann.title}</h4>
                  <p className="text-xs text-slate-300 italic line-clamp-1">
                    AI Summary: {ann.summary || ann.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteAnnouncement(ann.id)}
                  className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 transition-colors"
                  title="Delete circular"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: STUDENTS OVERVIEW */}
      {activeTab === 'students' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4">
          <h3 className="text-base font-bold text-white">Registered Student Profiles</h3>
          <div className="space-y-3">
            {[
              {
                name: 'Alex Rivera',
                email: 'alex.rivera@campus.edu',
                dept: 'Computer Science and Engineering',
                year: '3rd Year',
                skills: ['Python', 'AI/ML', 'React'],
                goal: 'AI Engineer',
              },
              {
                name: 'Priya Sharma',
                email: 'priya.sharma@campus.edu',
                dept: 'Information Technology',
                year: '4th Year',
                skills: ['Java', 'Cloud', 'SQL'],
                goal: 'Cloud Platform Architect',
              },
              {
                name: 'Marcus Chen',
                email: 'marcus.chen@campus.edu',
                dept: 'Data Science and AI',
                year: '2nd Year',
                skills: ['Python', 'Statistics', 'Pandas'],
                goal: 'Data Scientist',
              },
            ].map((st, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-white text-sm">{st.name}</div>
                  <div className="text-slate-400">{st.email} • {st.dept} ({st.year})</div>
                  <div className="flex gap-1.5 mt-2">
                    {st.skills.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-blue-300 font-mono">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block text-[11px]">Goal Target</span>
                  <span className="font-bold text-emerald-400">{st.goal}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* OPPORTUNITY MODAL (Create / Edit) */}
      {isOppModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 text-slate-100 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-1">
              {editingOppId ? 'Edit Opportunity' : 'Post New Opportunity'}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Create a listing that will be matched by Gemini AI against eligible students.
            </p>

            <form onSubmit={handleSaveOppSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Opportunity Title</label>
                  <input
                    type="text"
                    required
                    value={oppTitle}
                    onChange={e => setOppTitle(e.target.value)}
                    placeholder="e.g. AI Innovation Hackathon 2026"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Organization / Host</label>
                  <input
                    type="text"
                    required
                    value={oppOrg}
                    onChange={e => setOppOrg(e.target.value)}
                    placeholder="e.g. Google, Microsoft, Student Club"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">Description</label>
                  <button
                    type="button"
                    onClick={handleAIExtract}
                    disabled={isExtractingAI || (!oppTitle && !oppDesc)}
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isExtractingAI ? 'Extracting with AI...' : 'AI Auto-Extract Skills'}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  required
                  value={oppDesc}
                  onChange={e => setOppDesc(e.target.value)}
                  placeholder="Paste opportunity description or requirements..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                  <select
                    value={oppCategory}
                    onChange={e => setOppCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option>Internship</option>
                    <option>Hackathon</option>
                    <option>Competition</option>
                    <option>Workshop</option>
                    <option>Scholarship</option>
                    <option>Placement</option>
                    <option>Research</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Mode</label>
                  <select
                    value={oppMode}
                    onChange={e => setOppMode(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Deadline</label>
                  <input
                    type="date"
                    required
                    value={oppDeadline}
                    onChange={e => setOppDeadline(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Required Skills (Comma separated)
                </label>
                <input
                  type="text"
                  value={oppSkills}
                  onChange={e => setOppSkills(e.target.value)}
                  placeholder="e.g. Python, AI/ML, Fastapi, React"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Benefits & Perks (Comma separated)
                </label>
                <input
                  type="text"
                  value={oppBenefits}
                  onChange={e => setOppBenefits(e.target.value)}
                  placeholder="e.g. Stipend: $2,500/mo, PPO Opportunity, Certificate"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Application URL</label>
                <input
                  type="url"
                  required
                  value={oppUrl}
                  onChange={e => setOppUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsOppModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                >
                  {editingOppId ? 'Update Opportunity' : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ANNOUNCEMENT MODAL */}
      {isAnnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 text-slate-100 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-1">Broadcast Campus Circular</h3>
            <p className="text-xs text-slate-400 mb-6">
              Post official circulars with automated Gemini AI summarization for students.
            </p>

            <form onSubmit={handleSaveAnnSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Circular Title</label>
                <input
                  type="text"
                  required
                  value={annTitle}
                  onChange={e => setAnnTitle(e.target.value)}
                  placeholder="e.g. Placement Registration Portal Opens"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Full Circular Content</label>
                <textarea
                  rows={4}
                  required
                  value={annDesc}
                  onChange={e => setAnnDesc(e.target.value)}
                  placeholder="Enter full text of circular..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">AI Summary (TL;DR)</label>
                  <button
                    type="button"
                    onClick={handleAISummarize}
                    disabled={isSummarizingAI || (!annTitle && !annDesc)}
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isSummarizingAI ? 'Generating...' : 'Generate with Gemini'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={annSummary}
                  onChange={e => setAnnSummary(e.target.value)}
                  placeholder="1-2 sentences summarizing key deadline and eligibility..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Priority</label>
                  <select
                    value={annPriority}
                    onChange={e => setAnnPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                  <select
                    value={annCategory}
                    onChange={e => setAnnCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option>Academic</option>
                    <option>Placement</option>
                    <option>Exams</option>
                    <option>Events</option>
                    <option>Clubs</option>
                    <option>Workshops</option>
                    <option>General</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAnnModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                >
                  Broadcast Circular
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
