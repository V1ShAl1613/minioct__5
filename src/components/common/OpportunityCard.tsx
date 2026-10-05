import React from 'react';
import {
  Calendar,
  MapPin,
  Bookmark,
  ExternalLink,
  CheckCircle2,
  Building2,
  Sparkles,
  ArrowRight,
  Clock,
} from 'lucide-react';
import type { Opportunity, UserProfile } from '../../types/index.ts';
import { MatchScoreBadge } from './MatchScoreBadge.tsx';
import { calculateMatchScore } from '../../services/matchingEngine.ts';

interface OpportunityCardProps {
  opportunity: Opportunity;
  student: UserProfile | null;
  isSaved?: boolean;
  onToggleSave?: (oppId: string) => void;
  onViewDetails: (opp: Opportunity) => void;
  isApplied?: boolean;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  student,
  isSaved = false,
  onToggleSave,
  onViewDetails,
  isApplied = false,
}) => {
  const matchResult = calculateMatchScore(student, opportunity);

  // Calculate days remaining to deadline
  const deadlineDate = new Date(opportunity.deadline);
  const now = new Date('2026-10-04T23:45:00Z');
  const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 3600 * 24));

  const isUrgent = diffDays > 0 && diffDays <= 4;
  const isExpired = diffDays < 0;

  const categoryColors: Record<string, string> = {
    Hackathon: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    Internship: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    Competition: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    Research: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    Workshop: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    Placement: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    Scholarship: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
  };

  const badgeClass =
    categoryColors[opportunity.category] || 'bg-slate-500/10 text-slate-300 border-slate-500/30';

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-slate-900/80 border border-slate-800/80 p-5 sm:p-6 transition-all duration-300 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 backdrop-blur-sm">
      {/* Top row: Category badge + Deadline / Save */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeClass}`}
            >
              {opportunity.category}
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700/60">
              {opportunity.mode}
            </span>
            {opportunity.isPaid && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Paid
              </span>
            )}
            {isApplied && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/40 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-blue-400" />
                Applied
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <MatchScoreBadge score={matchResult.totalScore} size="sm" />
            {onToggleSave && (
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  onToggleSave(opportunity.id);
                }}
                className={`p-2 rounded-xl transition-colors ${
                  isSaved
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
                title={isSaved ? 'Remove from saved' : 'Save opportunity'}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Title & Organization */}
        <h3
          onClick={() => onViewDetails(opportunity)}
          className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1 cursor-pointer"
        >
          {opportunity.title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-slate-400 mt-1 mb-3">
          <Building2 className="w-4 h-4 shrink-0 text-slate-500" />
          <span className="font-medium text-slate-300 truncate">{opportunity.organization}</span>
          <span>•</span>
          <span className="flex items-center gap-1 truncate text-xs text-slate-400">
            <MapPin className="w-3 h-3 shrink-0" />
            {opportunity.location}
          </span>
        </div>

        {/* Short description */}
        <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {opportunity.description}
        </p>

        {/* Required skills tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(opportunity.skills || []).slice(0, 4).map((skill, idx) => {
            const isMatched = matchResult.matchedSkills.some(
              ms => ms.toLowerCase() === skill.toLowerCase()
            );
            return (
              <span
                key={idx}
                className={`text-xs px-2.5 py-0.5 rounded-md font-mono transition-colors ${
                  isMatched
                    ? 'bg-blue-950/80 text-blue-300 border border-blue-500/40 font-semibold'
                    : 'bg-slate-800/80 text-slate-400 border border-slate-700/50'
                }`}
              >
                {skill}
              </span>
            );
          })}
          {(opportunity.skills || []).length > 4 && (
            <span className="text-xs px-1.5 py-0.5 rounded-md bg-slate-800/60 text-slate-500 font-mono">
              +{(opportunity.skills || []).length - 4}
            </span>
          )}
        </div>

        {/* "Why this matches you" preview section */}
        <div className="rounded-xl bg-slate-950/60 border border-slate-800/90 p-3 mb-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Why this matches you</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {matchResult.reasons.slice(0, 3).map((reason, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer: Deadline info + Action button */}
      <div className="pt-3 border-t border-slate-800/70 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs">
          <Clock className={`w-3.5 h-3.5 ${isUrgent ? 'text-rose-400 animate-pulse' : 'text-slate-500'}`} />
          <span className={isUrgent ? 'text-rose-400 font-semibold' : 'text-slate-400'}>
            {isExpired ? 'Closed' : isUrgent ? `Closing in ${diffDays}d!` : `Deadline: ${opportunity.deadline}`}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onViewDetails(opportunity)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600 hover:text-white border border-blue-500/30 transition-all cursor-pointer"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
