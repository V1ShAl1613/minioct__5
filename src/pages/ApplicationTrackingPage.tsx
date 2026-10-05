import React, { useState, useMemo } from 'react';
import {
  Layers,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Edit3,
  Calendar,
  Building2,
  Plus,
  ChevronRight,
  Filter,
} from 'lucide-react';
import type { Opportunity, ApplicationRecord, ApplicationStatus } from '../types/index.ts';

interface ApplicationTrackingPageProps {
  opportunities: Opportunity[];
  applications: ApplicationRecord[];
  onUpdateApplication: (record: ApplicationRecord) => void;
  onViewOpportunity: (opp: Opportunity) => void;
}

export const ApplicationTrackingPage: React.FC<ApplicationTrackingPageProps> = ({
  opportunities,
  applications,
  onUpdateApplication,
  onViewOpportunity,
}) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState<ApplicationStatus>('Applied');

  const allStatuses: ApplicationStatus[] = [
    'Saved',
    'Planning to Apply',
    'Applied',
    'Interview',
    'Selected',
    'Rejected',
    'Completed',
  ];

  // Statistics calculation
  const stats = useMemo(() => {
    const total = applications.length;
    const applied = applications.filter(a => a.status === 'Applied').length;
    const interview = applications.filter(a => a.status === 'Interview').length;
    const selected = applications.filter(a => a.status === 'Selected').length;
    const rejected = applications.filter(a => a.status === 'Rejected').length;
    return { total, applied, interview, selected, rejected };
  }, [applications]);

  // Combine application with opportunity details
  const enrichedApplications = useMemo(() => {
    return applications
      .map(app => {
        const opp = opportunities.find(o => o.id === app.opportunityId);
        return { ...app, opportunity: opp };
      })
      .filter(item => {
        if (selectedStatusFilter === 'All') return true;
        return item.status === selectedStatusFilter;
      });
  }, [applications, opportunities, selectedStatusFilter]);

  const handleStartEdit = (app: ApplicationRecord) => {
    setEditingAppId(app.id);
    setEditNotes(app.notes || '');
    setEditStatus(app.status);
  };

  const handleSaveEdit = (app: ApplicationRecord) => {
    onUpdateApplication({
      ...app,
      status: editStatus,
      notes: editNotes,
      updatedAt: new Date().toISOString(),
    });
    setEditingAppId(null);
  };

  const statusBadgeColors: Record<ApplicationStatus, string> = {
    Saved: 'bg-slate-800 text-slate-300 border-slate-700',
    'Planning to Apply': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    Applied: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    Interview: 'bg-amber-500/10 text-amber-400 border-amber-500/30 font-semibold',
    Selected: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-bold',
    Rejected: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    Completed: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Layers className="w-7 h-7 text-blue-400" />
          <span>My Applications</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Track interview rounds, submission notes, and candidate statuses across all opportunities.
        </p>
      </div>

      {/* Summary Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Total Tracked
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-white mt-1 block">
            {stats.total}
          </span>
        </div>

        <div className="rounded-2xl bg-indigo-950/40 border border-indigo-500/30 p-4">
          <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider block">
            Applied
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-indigo-400 mt-1 block">
            {stats.applied}
          </span>
        </div>

        <div className="rounded-2xl bg-amber-950/40 border border-amber-500/30 p-4">
          <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider block">
            Interviewing
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1 block">
            {stats.interview}
          </span>
        </div>

        <div className="rounded-2xl bg-emerald-950/40 border border-emerald-500/30 p-4">
          <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider block">
            Selected
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1 block">
            {stats.selected}
          </span>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 col-span-2 sm:col-span-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Rejected
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-300 mt-1 block">
            {stats.rejected}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSelectedStatusFilter('All')}
          className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            selectedStatusFilter === 'All'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'
          }`}
        >
          All Applications ({applications.length})
        </button>
        {allStatuses.map(status => {
          const count = applications.filter(a => a.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setSelectedStatusFilter(status)}
              className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedStatusFilter === status
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              {status} ({count})
            </button>
          );
        })}
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {enrichedApplications.map(app => {
          const opp = app.opportunity;
          const isEditing = editingAppId === app.id;

          return (
            <div
              key={app.id}
              className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 sm:p-6 transition-all hover:border-slate-700/80 space-y-4 backdrop-blur-sm"
            >
              {/* Top row */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs border font-medium ${
                      statusBadgeColors[app.status] || 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {app.status}
                  </span>
                  {opp?.category && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
                      {opp.category}
                    </span>
                  )}
                  {opp?.mode && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-950 text-slate-400 border border-slate-800">
                      {opp.mode}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Title & Organization */}
              <div>
                <h3
                  onClick={() => opp && onViewOpportunity(opp)}
                  className="text-base sm:text-lg font-bold text-white hover:text-blue-400 cursor-pointer transition-colors"
                >
                  {opp?.title || 'Untitled Opportunity'}
                </h3>
                {opp?.organization && (
                  <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>{opp.organization}</span>
                    <span>•</span>
                    <span>Deadline: {opp.deadline}</span>
                  </p>
                )}
              </div>

              {/* Notes / Edit Section */}
              {isEditing ? (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Application Status
                      </label>
                      <select
                        value={editStatus}
                        onChange={e => setEditStatus(e.target.value as ApplicationStatus)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      >
                        {allStatuses.map(s => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Stage Notes / Interview Details
                      </label>
                      <input
                        type="text"
                        value={editNotes}
                        onChange={e => setEditNotes(e.target.value)}
                        placeholder="e.g. Round 2 technical test scheduled for Friday"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingAppId(null)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(app)}
                      className="px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white"
                    >
                      Save Status
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                  <div className="text-slate-300">
                    <span className="font-semibold text-slate-400 mr-2">Interview / Status Notes:</span>
                    <span>{app.notes || 'No notes added yet.'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleStartEdit(app)}
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold shrink-0 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Update Status</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {enrichedApplications.length === 0 && (
        <div className="text-center py-16 rounded-3xl bg-slate-900 border border-slate-800 p-8">
          <Layers className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No applications in this category</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Apply to opportunities from your Dashboard or Discover page to track them here.
          </p>
        </div>
      )}
    </div>
  );
};
