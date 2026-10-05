import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Bookmark,
  Share2,
  Gift,
  GraduationCap,
  Briefcase,
  Layers,
  Clock,
  Send,
} from 'lucide-react';
import type { Opportunity, UserProfile, ApplicationRecord } from '../../types/index.ts';
import { MatchScoreBadge } from './MatchScoreBadge.tsx';
import { calculateMatchScore, getAIMatchExplanation } from '../../services/matchingEngine.ts';

interface OpportunityModalProps {
  opportunity: Opportunity | null;
  student: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved?: boolean;
  onToggleSave?: (oppId: string) => void;
  onApply?: (opp: Opportunity, status?: any) => void;
  applicationRecord?: ApplicationRecord;
}

export const OpportunityModal: React.FC<OpportunityModalProps> = ({
  opportunity,
  student,
  isOpen,
  onClose,
  isSaved = false,
  onToggleSave,
  onApply,
  applicationRecord,
}) => {
  const [aiReasons, setAiReasons] = useState<string[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (opportunity && student) {
      const match = calculateMatchScore(student, opportunity);
      setAiReasons(match.reasons);
      setIsLoadingAI(true);
      getAIMatchExplanation(student, opportunity)
        .then(reasons => {
          setAiReasons(reasons);
        })
        .finally(() => setIsLoadingAI(false));
    }
  }, [opportunity, student]);

  if (!isOpen || !opportunity) return null;

  const match = calculateMatchScore(student, opportunity);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyClick = () => {
    if (opportunity.applicationUrl) {
      window.open(opportunity.applicationUrl, '_blank', 'noopener,noreferrer');
    }
    if (onApply) {
      onApply(opportunity, 'Applied');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl shadow-blue-500/10 text-slate-100 p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tags & Match Badge */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pr-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
              {opportunity.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700/60">
              {opportunity.mode}
            </span>
            {opportunity.isPaid && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {opportunity.stipendAmount || 'Paid Opportunity'}
              </span>
            )}
          </div>
          <MatchScoreBadge score={match.totalScore} size="lg" />
        </div>

        {/* Title & Organization */}
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-tight">
          {opportunity.title}
        </h2>
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-6">
          <div className="flex items-center gap-1.5 font-medium text-slate-300">
            <Building2 className="w-4 h-4 text-blue-400" />
            {opportunity.organization}
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-slate-500" />
            {opportunity.location}
          </div>
          <div className="flex items-center gap-1.5 text-rose-400 font-medium">
            <Calendar className="w-4 h-4" />
            Deadline: {opportunity.deadline}
          </div>
        </div>

        {/* AI Match Explanation Box */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-950/70 via-slate-900 to-indigo-950/60 border border-blue-500/30 p-5 mb-6 shadow-inner">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-blue-400">
              <Sparkles className="w-4 h-4 animate-spin text-blue-400" />
              <span>Why this matches you</span>
            </div>
            {isLoadingAI && (
              <span className="text-xs text-slate-400 animate-pulse">Refining with Gemini AI...</span>
            )}
          </div>

          <div className="space-y-2 mb-4">
            {aiReasons.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{reason}</span>
              </div>
            ))}
          </div>

          {/* Structured Score Breakdown Meter */}
          <div className="pt-3 border-t border-blue-500/20 grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Skills (40%)</span>
              <span className="font-bold text-white text-sm">{match.skillScore}/40</span>
            </div>
            <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Interest (25%)</span>
              <span className="font-bold text-white text-sm">{match.interestScore}/25</span>
            </div>
            <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Eligibility (20%)</span>
              <span className="font-bold text-white text-sm">{match.eligibilityScore}/20</span>
            </div>
            <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Career (10%)</span>
              <span className="font-bold text-white text-sm">{match.careerScore}/10</span>
            </div>
            <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Mode (5%)</span>
              <span className="font-bold text-white text-sm">{match.preferenceScore}/5</span>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-6 text-sm text-slate-300 mb-8">
          <div>
            <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">
              Description & Overview
            </h4>
            <p className="leading-relaxed whitespace-pre-line text-slate-300">
              {opportunity.description}
            </p>
          </div>

          {/* Required Skills */}
          <div>
            <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2.5">
              Required / Target Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {opportunity.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg text-xs font-mono font-medium bg-slate-800 border border-slate-700 text-blue-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Eligibility Criteria */}
          {opportunity.eligibility && (
            <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-4">
              <div className="flex items-center gap-2 text-xs uppercase font-bold text-slate-400 tracking-wider mb-3">
                <GraduationCap className="w-4 h-4 text-blue-400" />
                Eligibility Requirements
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {opportunity.eligibility.allowedYears && (
                  <li>
                    <strong className="text-white">Eligible Academic Years:</strong>{' '}
                    {opportunity.eligibility.allowedYears.join(', ')}
                  </li>
                )}
                {opportunity.eligibility.allowedDepartments && (
                  <li>
                    <strong className="text-white">Eligible Departments:</strong>{' '}
                    {opportunity.eligibility.allowedDepartments.join(', ')}
                  </li>
                )}
                {opportunity.eligibility.minGpa !== undefined && opportunity.eligibility.minGpa > 0 && (
                  <li>
                    <strong className="text-white">Minimum GPA:</strong> {opportunity.eligibility.minGpa}
                  </li>
                )}
                {opportunity.eligibility.additionalCriteria && (
                  <li>
                    <strong className="text-white">Notes:</strong>{' '}
                    {opportunity.eligibility.additionalCriteria}
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Benefits & Perks */}
          {opportunity.benefits && opportunity.benefits.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs uppercase font-bold text-slate-400 tracking-wider mb-2.5">
                <Gift className="w-4 h-4 text-emerald-400" />
                Perks & Benefits
              </div>
              <ul className="grid sm:grid-cols-2 gap-2 text-xs">
                {opportunity.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {onToggleSave && (
              <button
                type="button"
                onClick={() => onToggleSave(opportunity.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs border transition-all ${
                  isSaved
                    ? 'bg-blue-600/20 text-blue-300 border-blue-500/40'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                <span>{isSaved ? 'Saved in List' : 'Save Opportunity'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl font-medium text-xs bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition-colors"
              title="Copy link to clipboard"
            >
              <Share2 className="w-4 h-4" />
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleApplyClick}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 transition-all"
            >
              <span>Apply Now</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
