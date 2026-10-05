import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Bookmark,
  Send,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Filter,
  Search,
} from 'lucide-react';
import type { Opportunity, Announcement, UserProfile, ApplicationRecord } from '../types/index.ts';
import { OpportunityCard } from '../components/common/OpportunityCard.tsx';
import { calculateMatchScore } from '../services/matchingEngine.ts';

interface StudentDashboardProps {
  student: UserProfile | null;
  opportunities: Opportunity[];
  announcements: Announcement[];
  savedIds: string[];
  applications: ApplicationRecord[];
  onToggleSave: (oppId: string) => void;
  onViewDetails: (opp: Opportunity) => void;
  onNavigate: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  opportunities,
  announcements,
  savedIds,
  applications,
  onToggleSave,
  onViewDetails,
  onNavigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamic greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const studentFirstName = student?.name ? student.name.split(' ')[0] : 'Student';

  // Urgent announcement banner
  const urgentAnnouncement = announcements.find(
    a => a.published && (a.priority === 'Urgent' || a.priority === 'High')
  );

  // Deadlines soon count (< 7 days)
  const deadlinesSoonCount = useMemo(() => {
    const now = new Date('2026-10-04T23:45:00Z').getTime();
    return opportunities.filter(o => {
      const diff = new Date(o.deadline).getTime() - now;
      const days = diff / (1000 * 3600 * 24);
      return days > 0 && days <= 7;
    }).length;
  }, [opportunities]);

  // Rank opportunities by AI match score
  const rankedOpportunities = useMemo(() => {
    return [...opportunities].sort((a, b) => {
      const scoreA = calculateMatchScore(student, a).totalScore;
      const scoreB = calculateMatchScore(student, b).totalScore;
      return scoreB - scoreA;
    });
  }, [opportunities, student]);

  // Filtered by selected category and search query
  const filteredOpportunities = useMemo(() => {
    return rankedOpportunities.filter(opp => {
      const matchCat =
        selectedCategory === 'All' ||
        opp.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        !searchQuery.trim() ||
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [rankedOpportunities, selectedCategory, searchQuery]);

  const categories = [
    'All',
    'Hackathon',
    'Internship',
    'Competition',
    'Workshop',
    'Scholarship',
    'Placement',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Urgent Announcement Alert Banner */}
      {urgentAnnouncement && (
        <div className="rounded-2xl bg-gradient-to-r from-rose-950/70 via-slate-900 to-amber-950/60 border border-rose-500/40 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-lg shadow-rose-950/30">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/30 text-rose-300">
                  {urgentAnnouncement.priority} Campus Alert
                </span>
                <span className="text-xs text-slate-400">{urgentAnnouncement.department}</span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white mt-1">
                {urgentAnnouncement.title}
              </h4>
              <p className="text-xs text-rose-200/90 line-clamp-1 mt-0.5">
                {urgentAnnouncement.summary || urgentAnnouncement.description}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('campus-updates')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer shrink-0"
          >
            View Circular
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {greeting}, {studentFirstName} 👋
          </h1>
          <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400 inline" />
            <span>Here are opportunities selected for you by AI based on your profile.</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('ai-search')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-300 border border-blue-500/30 text-xs font-semibold transition-all cursor-pointer"
        >
          <Search className="w-4 h-4 text-blue-400" />
          <span>Ask CampusConnect AI</span>
        </button>
      </div>

      {/* Summary KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Recommended */}
        <div
          onClick={() => setSelectedCategory('All')}
          className="rounded-2xl bg-slate-900/80 border border-slate-800/80 p-4 sm:p-5 hover:border-blue-500/40 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Recommended</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {opportunities.length}
          </div>
          <span className="text-[11px] text-blue-400 font-medium">Ranked by Gemini AI</span>
        </div>

        {/* Saved */}
        <div
          onClick={() => onNavigate('saved')}
          className="rounded-2xl bg-slate-900/80 border border-slate-800/80 p-4 sm:p-5 hover:border-purple-500/40 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Saved</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">{savedIds.length}</div>
          <span className="text-[11px] text-purple-400 font-medium">Ready to apply</span>
        </div>

        {/* Applied */}
        <div
          onClick={() => onNavigate('applications')}
          className="rounded-2xl bg-slate-900/80 border border-slate-800/80 p-4 sm:p-5 hover:border-emerald-500/40 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Applied</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {applications.length}
          </div>
          <span className="text-[11px] text-emerald-400 font-medium">In application pipeline</span>
        </div>

        {/* Deadlines Soon */}
        <div
          onClick={() => onNavigate('saved')}
          className="rounded-2xl bg-slate-900/80 border border-slate-800/80 p-4 sm:p-5 hover:border-amber-500/40 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Deadlines Soon</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">
            {deadlinesSoonCount}
          </div>
          <span className="text-[11px] text-amber-400/90 font-medium">Within next 7 days</span>
        </div>
      </div>

      {/* Main Section Header with Filters */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Recommended For You</span>
              <span className="text-xs font-normal text-slate-400">
                ({filteredOpportunities.length} opportunities)
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Personalized matching against your {student?.department || 'tech'} coursework and career goals.
            </p>
          </div>

          {/* Quick Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter by skill or title..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities Grid Feed */}
      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-5 sm:gap-6">
        {filteredOpportunities.map(opp => (
          <OpportunityCard
            key={opp.id}
            opportunity={opp}
            student={student}
            isSaved={savedIds.includes(opp.id)}
            onToggleSave={onToggleSave}
            onViewDetails={onViewDetails}
            isApplied={applications.some(a => a.opportunityId === opp.id)}
          />
        ))}
      </div>

      {filteredOpportunities.length === 0 && (
        <div className="text-center py-12 rounded-2xl bg-slate-900/50 border border-slate-800 p-8">
          <Sparkles className="w-8 h-8 text-blue-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No matching opportunities found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
            Try choosing a different category or refining your search keywords.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
