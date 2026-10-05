import React, { useState, useMemo } from 'react';
import {
  Compass,
  Search,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  Sparkles,
  X,
  Check,
} from 'lucide-react';
import type { Opportunity, UserProfile } from '../types/index.ts';
import { OpportunityCard } from '../components/common/OpportunityCard.tsx';
import { calculateMatchScore } from '../services/matchingEngine.ts';

interface DiscoverPageProps {
  student: UserProfile | null;
  opportunities: Opportunity[];
  savedIds: string[];
  appliedIds: string[];
  onToggleSave: (oppId: string) => void;
  onViewDetails: (opp: Opportunity) => void;
}

export const DiscoverPage: React.FC<DiscoverPageProps> = ({
  student,
  opportunities,
  savedIds,
  appliedIds,
  onToggleSave,
  onViewDetails,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMode, setSelectedMode] = useState<string>('All');
  const [paidOnly, setPaidOnly] = useState<boolean>(false);
  const [selectedSkill, setSelectedSkill] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'match' | 'deadline' | 'newest' | 'popular'>('match');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const categories = [
    'All',
    'Hackathon',
    'Internship',
    'Competition',
    'Workshop',
    'Scholarship',
    'Placement',
    'Research',
  ];

  const modes = ['All', 'Remote', 'Hybrid', 'On-site'];

  // Collect all unique skills across opportunities
  const allSkills = useMemo(() => {
    const set = new Set<string>();
    opportunities.forEach(o => (o.skills || []).forEach(s => set.add(s)));
    return ['All', ...Array.from(set).sort()];
  }, [opportunities]);

  // Filter and sort logic
  const filteredAndSorted = useMemo(() => {
    let list = opportunities.filter(opp => {
      // Category filter
      if (selectedCategory !== 'All' && opp.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      // Mode filter
      if (selectedMode !== 'All' && opp.mode.toLowerCase() !== selectedMode.toLowerCase()) {
        return false;
      }
      // Paid only filter
      if (paidOnly && !opp.isPaid) {
        return false;
      }
      // Skill filter
      if (selectedSkill !== 'All' && !opp.skills?.some(s => s.toLowerCase() === selectedSkill.toLowerCase())) {
        return false;
      }
      // Text search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = opp.title.toLowerCase().includes(q);
        const matchOrg = opp.organization.toLowerCase().includes(q);
        const matchDesc = opp.description.toLowerCase().includes(q);
        const matchSkills = opp.skills.some(s => s.toLowerCase().includes(q));
        if (!matchTitle && !matchOrg && !matchDesc && !matchSkills) {
          return false;
        }
      }
      return true;
    });

    // Sorting
    return list.sort((a, b) => {
      if (sortBy === 'match') {
        const scoreA = calculateMatchScore(student, a).totalScore;
        const scoreB = calculateMatchScore(student, b).totalScore;
        return scoreB - scoreA;
      }
      if (sortBy === 'deadline') {
        return a.deadline.localeCompare(b.deadline);
      }
      if (sortBy === 'newest') {
        return (b.createdAt || '').localeCompare(a.createdAt || '');
      }
      if (sortBy === 'popular') {
        return (b.applicantCount || 0) - (a.applicantCount || 0);
      }
      return 0;
    });
  }, [opportunities, selectedCategory, selectedMode, paidOnly, selectedSkill, search, sortBy, student]);

  const activeFilterCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    (selectedMode !== 'All' ? 1 : 0) +
    (paidOnly ? 1 : 0) +
    (selectedSkill !== 'All' ? 1 : 0);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedMode('All');
    setPaidOnly(false);
    setSelectedSkill('All');
    setSearch('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-150">
      {/* Page Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Compass className="w-7 h-7 text-blue-400" />
            <span>Discover Opportunities</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse verified campus hackathons, internships, scholarships, and hiring events.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, skill, or org..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Category Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar flex-1">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800 hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs text-slate-400 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 font-semibold focus:outline-none focus:border-blue-500"
            >
              <option value="match">Best Match</option>
              <option value="deadline">Closest Deadline</option>
              <option value="newest">Newest Added</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Second Row: Mode, Skill, Paid Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Mode Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Mode:</span>
              <div className="flex gap-1">
                {modes.map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSelectedMode(m)}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      selectedMode === m
                        ? 'bg-blue-600/20 text-blue-300 font-bold border border-blue-500/40'
                        : 'text-slate-400 hover:text-slate-200 bg-slate-950'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Skill Filter Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Skill:</span>
              <select
                value={selectedSkill}
                onChange={e => setSelectedSkill(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-300 text-xs focus:outline-none"
              >
                {allSkills.slice(0, 15).map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Paid Only Checkbox */}
            <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={paidOnly}
                onChange={e => setPaidOnly(e.target.checked)}
                className="rounded accent-blue-600 cursor-pointer"
              />
              <span>Paid / Stipend only</span>
            </label>
          </div>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs text-rose-400 hover:underline font-semibold"
            >
              Reset filters ({activeFilterCount})
            </button>
          )}
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Showing {filteredAndSorted.length} matching opportunities</span>
        {sortBy === 'match' && (
          <span className="flex items-center gap-1 text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
            Ranked by AI compatibility
          </span>
        )}
      </div>

      {/* Grid of Opportunity Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-5 sm:gap-6">
        {filteredAndSorted.map(opp => (
          <OpportunityCard
            key={opp.id}
            opportunity={opp}
            student={student}
            isSaved={savedIds.includes(opp.id)}
            onToggleSave={onToggleSave}
            onViewDetails={onViewDetails}
            isApplied={appliedIds.includes(opp.id)}
          />
        ))}
      </div>

      {filteredAndSorted.length === 0 && (
        <div className="text-center py-16 rounded-3xl bg-slate-900/40 border border-slate-800 p-8">
          <Compass className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No matching opportunities found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Try adjusting your search query, mode, or skill filter to view more opportunities.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
