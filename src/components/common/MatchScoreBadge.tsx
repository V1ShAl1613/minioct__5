import React from 'react';
import { Sparkles } from 'lucide-react';

interface MatchScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const MatchScoreBadge: React.FC<MatchScoreBadgeProps> = ({
  score,
  size = 'md',
  showLabel = true,
}) => {
  // Color calculation based on match tier
  let badgeColors = 'from-blue-600 to-indigo-600 text-white shadow-blue-500/20';
  let ringColor = 'border-blue-400/30';
  let textColor = 'text-blue-400';

  if (score >= 90) {
    badgeColors = 'from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-teal-500/30';
    ringColor = 'border-emerald-400/40';
    textColor = 'text-emerald-400';
  } else if (score >= 80) {
    badgeColors = 'from-blue-600 via-indigo-600 to-violet-600 text-white shadow-blue-500/30';
    ringColor = 'border-blue-400/40';
    textColor = 'text-blue-400';
  } else if (score >= 65) {
    badgeColors = 'from-amber-500 to-orange-500 text-white shadow-amber-500/25';
    ringColor = 'border-amber-400/40';
    textColor = 'text-amber-400';
  } else {
    badgeColors = 'from-slate-600 to-slate-700 text-slate-200';
    ringColor = 'border-slate-500/30';
    textColor = 'text-slate-400';
  }

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r ${badgeColors} shadow-sm border ${ringColor}`}>
        <Sparkles className="w-3 h-3" />
        <span>{score}%</span>
      </span>
    );
  }

  if (size === 'lg') {
    return (
      <div className="flex items-center gap-3">
        <div className={`flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${badgeColors} shadow-lg border ${ringColor}`}>
          <span className="text-xl font-bold tracking-tight">{score}%</span>
        </div>
        {showLabel && (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Sparkles className={`w-3.5 h-3.5 ${textColor}`} />
              AI Match Score
            </div>
            <div className="text-sm font-medium text-slate-200">
              {score >= 90 ? 'Exceptional Fit' : score >= 80 ? 'Strong Match' : score >= 65 ? 'Good Alignment' : 'General Match'}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${badgeColors} shadow-md border ${ringColor}`}>
      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
      <span>{score}% Match</span>
    </div>
  );
};
