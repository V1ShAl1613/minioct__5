import React, { useMemo } from 'react';
import {
  Bookmark,
  Calendar,
  ExternalLink,
  Trash2,
  Clock,
  Sparkles,
  ArrowRight,
  Building2,
  MapPin,
} from 'lucide-react';
import type { Opportunity, UserProfile } from '../types/index.ts';
import { MatchScoreBadge } from '../components/common/MatchScoreBadge.tsx';
import { calculateMatchScore } from '../services/matchingEngine.ts';

interface SavedOpportunitiesPageProps {
  student: UserProfile | null;
  opportunities: Opportunity[];
  savedIds: string[];
  appliedIds: string[];
  onToggleSave: (oppId: string) => void;
  onViewDetails: (opp: Opportunity) => void;
  onNavigate: (tab: string) => void;
}

export const SavedOpportunitiesPage: React.FC<SavedOpportunitiesPageProps> = ({
  student,
  opportunities,
  savedIds,
  appliedIds,
  onToggleSave,
  onViewDetails,
  onNavigate,
}) => {
  const savedOpportunities = useMemo(() => {
    return opportunities.filter(o => savedIds.includes(o.id));
  }, [opportunities, savedIds]);

  const now = new Date('2026-10-04T23:45:00Z').getTime();

  const getDeadlineStatus = (deadlineStr: string) => {
    const diff = new Date(deadlineStr).getTime() - now;
    const days = Math.ceil(diff / (1000 * 3600 * 24));

    if (days <= 0) {
      return {
        label: 'Deadline Passed',
        color: 'bg-slate-800 text-slate-400 border-slate-700',
        dot: 'bg-slate-500',
        daysText: 'Closed',
      };
    }
    if (days <= 3) {
      return {
        label: 'Deadline Approaching',
        color: 'bg-rose-500/10 text-rose-400 border-rose-500/30 font-bold',
        dot: 'bg-rose-500 animate-ping',
        daysText: `🔴 ${days} day${days > 1 ? 's' : ''} left!`,
      };
    }
    if (days <= 7) {
      return {
        label: 'Within 7 Days',
        color: 'bg-amber-500/10 text-amber-400 border-amber-500/30 font-semibold',
        dot: 'bg-amber-400',
        daysText: `🟡 ${days} days remaining`,
      };
    }
    return {
      label: 'More than 7 Days',
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      dot: 'bg-emerald-400',
      daysText: `🟢 ${days} days left`,
    };
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Bookmark className="w-7 h-7 text-blue-400 fill-current" />
            <span>Saved Opportunities</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track bookmarks and monitor deadlines with traffic-light status urgency.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-2xl">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            &gt;7d
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            ≤7d
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            Approaching
          </span>
        </div>
      </div>

      {/* Saved Opportunities List */}
      <div className="space-y-4">
        {savedOpportunities.map(opp => {
          const match = calculateMatchScore(student, opp);
          const deadlineStatus = getDeadlineStatus(opp.deadline);
          const isApplied = appliedIds.includes(opp.id);

          return (
            <div
              key={opp.id}
              className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 sm:p-6 transition-all hover:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-sm"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                    {opp.category}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs border flex items-center gap-1.5 ${deadlineStatus.color}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${deadlineStatus.dot}`} />
                    {deadlineStatus.daysText}
                  </span>
                  <MatchScoreBadge score={match.totalScore} size="sm" />
                  {isApplied && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Applied
                    </span>
                  )}
                </div>

                <h3
                  onClick={() => onViewDetails(opp)}
                  className="text-base sm:text-lg font-bold text-white hover:text-blue-400 cursor-pointer transition-colors"
                >
                  {opp.title}
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-slate-300">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    {opp.organization}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {opp.location} ({opp.mode})
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    Deadline: {opp.deadline}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                <button
                  type="button"
                  onClick={() => onToggleSave(opp.id)}
                  className="p-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 transition-colors"
                  title="Remove from saved"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onViewDetails(opp)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>View & Apply</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {savedOpportunities.length === 0 && (
        <div className="text-center py-16 rounded-3xl bg-slate-900 border border-slate-800 p-8">
          <Bookmark className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No saved opportunities yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Bookmark interesting hackathons, internships, and scholarships to track them here.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('discover')}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500"
          >
            Explore Opportunities
          </button>
        </div>
      )}
    </div>
  );
};
