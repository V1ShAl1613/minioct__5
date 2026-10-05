import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  ArrowRight,
  Send,
  CheckCircle2,
  HelpCircle,
  Clock,
  Compass,
} from 'lucide-react';
import type { Opportunity, UserProfile } from '../types/index.ts';
import { OpportunityCard } from '../components/common/OpportunityCard.tsx';
import { searchOpportunitiesAI, type AISearchResult } from '../services/aiService.ts';

interface AISearchPageProps {
  student: UserProfile | null;
  opportunities: Opportunity[];
  savedIds: string[];
  appliedIds: string[];
  onToggleSave: (oppId: string) => void;
  onViewDetails: (opp: Opportunity) => void;
}

export const AISearchPage: React.FC<AISearchPageProps> = ({
  student,
  opportunities,
  savedIds,
  appliedIds,
  onToggleSave,
  onViewDetails,
}) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<AISearchResult | null>(null);

  const sampleQueries = [
    'Find hackathons related to AI.',
    'Show me remote internships.',
    'What opportunities are closing this week?',
    'Find opportunities that require Python.',
    'Show scholarships I may be eligible for.',
    'Find AI internships for third-year IT students that don\'t require previous experience.',
  ];

  const handleSearch = async (queryText?: string) => {
    const q = queryText || query;
    if (!q.trim() || isLoading) return;

    setIsLoading(true);
    setQuery(q);

    try {
      const result = await searchOpportunitiesAI(q, student, opportunities);
      setSearchResult(result);
    } catch (e) {
      console.error('AI search failure', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Map result IDs to full opportunity models
  const matchingOpportunities = searchResult
    ? searchResult.results
        .map(r => {
          const found = opportunities.find(o => o.id === r.opportunityId);
          return found ? { opp: found, reason: r.reason, score: r.relevanceScore } : null;
        })
        .filter(Boolean)
    : [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-150">
      {/* Search Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemini Natural Language Semantic Search</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Ask CampusConnect
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Ask questions in natural English. Gemini interprets your academic background, checks real
          database eligibility, and surfaces ranked opportunities with zero hallucinations.
        </p>
      </div>

      {/* Main Search Bar */}
      <div className="relative max-w-3xl mx-auto">
        <div className="relative flex items-center rounded-2xl bg-slate-900 border-2 border-blue-500/50 shadow-xl shadow-blue-500/10 p-1.5 focus-within:border-blue-400 transition-all">
          <Search className="w-5 h-5 text-blue-400 ml-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Find AI internships for third-year IT students that don't require previous experience..."
            className="w-full bg-transparent px-3 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => handleSearch()}
            disabled={!query.trim() || isLoading}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 disabled:opacity-40 cursor-pointer shrink-0"
          >
            {isLoading ? (
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Thinking...
              </span>
            ) : (
              <>
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Example Prompts */}
      <div className="max-w-3xl mx-auto">
        <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 block mb-2">
          Try asking one of these:
        </span>
        <div className="flex flex-wrap gap-2">
          {sampleQueries.map((promptText, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSearch(promptText)}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors text-left cursor-pointer"
            >
              "{promptText}"
            </button>
          ))}
        </div>
      </div>

      {/* AI Interpretation Result Banner */}
      {searchResult && (
        <div className="rounded-2xl bg-blue-950/40 border border-blue-500/30 p-4 sm:p-5 text-xs sm:text-sm space-y-1">
          <div className="flex items-center gap-2 text-blue-400 font-bold">
            <Sparkles className="w-4 h-4" />
            <span>AI Interpretation & Reasoning</span>
          </div>
          <p className="text-slate-200">
            {searchResult.interpretedIntent} • Found {matchingOpportunities.length} opportunities in the database matching your criteria.
          </p>
        </div>
      )}

      {/* Search Results Grid */}
      {matchingOpportunities.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-white">
            Matching Opportunities ({matchingOpportunities.length})
          </h3>
          <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
            {matchingOpportunities.map(item => {
              if (!item) return null;
              return (
                <div key={item.opp.id} className="relative flex flex-col">
                  {/* Semantic AI Match Callout */}
                  <div className="mb-2 px-3 py-1.5 rounded-xl bg-indigo-950/70 border border-indigo-500/30 text-xs text-indigo-200 flex items-center justify-between">
                    <span className="truncate">
                      <strong>AI Match:</strong> {item.reason}
                    </span>
                    <span className="font-bold text-cyan-400 shrink-0 ml-2">
                      {item.score}% match
                    </span>
                  </div>

                  <OpportunityCard
                    opportunity={item.opp}
                    student={student}
                    isSaved={savedIds.includes(item.opp.id)}
                    onToggleSave={onToggleSave}
                    onViewDetails={onViewDetails}
                    isApplied={appliedIds.includes(item.opp.id)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {searchResult && matchingOpportunities.length === 0 && !isLoading && (
        <div className="text-center py-12 rounded-3xl bg-slate-900 border border-slate-800 p-8">
          <HelpCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-white">No opportunities matched this query</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try a broader query such as "Find hackathons" or "Show me software internships".
          </p>
        </div>
      )}
    </div>
  );
};
