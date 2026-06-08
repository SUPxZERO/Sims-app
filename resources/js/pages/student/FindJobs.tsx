import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import { useFetch } from '../../hooks/useFetch';
import api from '../../services/api';

// ── Toast notification component ─────────────────────────────────────────────
interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

const ToastContainer: React.FC<{ toasts: Toast[]; onRemove: (id: number) => void }> = ({ toasts, onRemove }) => {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <div className="fixed top-6 right-6 z-[99999] flex flex-col gap-3 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl border backdrop-blur-md transition-all duration-300 min-w-[280px]
            ${t.type === 'success' ? 'bg-emerald-900/80 border-emerald-500/40 text-emerald-200' : ''}
            ${t.type === 'error'   ? 'bg-red-900/80    border-red-500/40    text-red-200'     : ''}
            ${t.type === 'info'    ? 'bg-blue-900/80   border-blue-500/40   text-blue-200'    : ''}
          `}
        >
          <span className="text-xl">
            {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'}
          </span>
          <span className="flex-1 text-sm font-medium">{t.message}</span>
          <button onClick={() => onRemove(t.id)} className="text-current opacity-60 hover:opacity-100 text-lg leading-none">×</button>
        </div>
      ))}
    </div>,
    document.body
  );
};

// ── Match ring SVG ────────────────────────────────────────────────────────────
const MatchRing: React.FC<{ score: number | null }> = ({ score }) => {
  const color = score === null ? '' : score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400';
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
        <path className="text-slate-700" strokeWidth="3" stroke="currentColor" fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
        {score !== null && (
          <path className={color} strokeWidth="3" strokeDasharray={`${score}, 100`}
            stroke="currentColor" fill="none" strokeLinecap="round"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
        )}
      </svg>
      <span className={`absolute text-[10px] font-bold ${score !== null ? color : 'text-slate-500'}`}>
        {score !== null ? `${score}%` : 'N/A'}
      </span>
    </div>
  );
};

// ── Sub-score mini bar ────────────────────────────────────────────────────────
const ScoreBar: React.FC<{ label: string; value: number; weight: string; color: string }> = ({ label, value, weight, color }) => (
  <div className={`p-4 rounded-xl border ${color}`}>
    <div className="flex justify-between items-center mb-2">
      <div className="text-xs font-semibold opacity-80">{label}</div>
      <div className="text-xs opacity-60">{weight}</div>
    </div>
    <div className="text-2xl font-bold">{Math.round(value)}%</div>
    <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, background: 'currentColor', opacity: 0.6 }} />
    </div>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
export const FindJobs: React.FC = () => {
  const [searchTerm, setSearchTerm]   = useState('');
  const [workMode, setWorkMode]       = useState('ALL');
  const [applying, setApplying]       = useState<number | null>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [appliedIds, setAppliedIds]   = useState<Set<number>>(new Set());
  const [toasts, setToasts]           = useState<Toast[]>([]);
  const [refreshing, setRefreshing]   = useState(false);

  const { data, loading, error, refetch } = useFetch<any>('/listings', true) as any;
  const { data: cvData }                  = useFetch<any>('/cv', true);

  // Load the student's already-applied listing IDs once on mount
  useEffect(() => {
    api.get('/applications/student').then(res => {
      const ids = (res.data.applications || []).map((a: any) => a.listing_id);
      setAppliedIds(new Set(ids));
    }).catch(() => {});
  }, []);

  // ── Toast helpers ───────────────────────────────────────────────────────────
  const addToast = (message: string, type: Toast['type']) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };
  const removeToast = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleApply = async (listingId: number) => {
    try {
      setApplying(listingId);
      await api.post(`/listings/${listingId}/apply`);
      setAppliedIds(prev => new Set([...prev, listingId]));
      setSelectedJob(null);
      addToast('Application submitted successfully! 🎉', 'success');
    } catch (err: any) {
      addToast(err.response?.data?.error || 'Failed to apply. Please try again.', 'error');
    } finally {
      setApplying(null);
    }
  };

  const handleRefreshScores = async () => {
    try {
      setRefreshing(true);
      await api.post('/recommendations/my/recalculate');
      addToast('Match scores refreshed!', 'success');
      if (refetch) refetch(); else window.location.reload();
    } catch {
      addToast('Failed to refresh match scores.', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  // ── Loading / error states ──────────────────────────────────────────────────
  if (loading) return (
    <div className="flex h-full items-center justify-center">
      <Spinner size="lg" />
    </div>
  );

  if (error) return (
    <div className="text-red-400 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
      Error loading listings: {error}
    </div>
  );

  // ── Filter jobs: exclude already-applied, then apply search/workmode ────────
  const jobs: any[] = (data?.listings || []).filter((j: any) => !appliedIds.has(j.listing_id));

  const filteredJobs = jobs.filter((job: any) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.company_profile?.company_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMode = workMode === 'ALL' || job.work_mode === workMode;
    return matchesSearch && matchesMode;
  });

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Page header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Find Internships</h1>
          <p className="text-slate-400">Discover and apply to new opportunities.</p>
        </div>
        <Button variant="secondary" onClick={handleRefreshScores} disabled={refreshing}>
          {refreshing ? 'Refreshing…' : '↻  Refresh Match Scores'}
        </Button>
      </div>

      {/* Filters */}
      <Card className="!p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by role or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <select
              className="w-full bg-slate-900/50 border border-slate-700/50 text-slate-200 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
            >
              <option value="ALL">All Work Modes</option>
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
              <option value="ONSITE">On-Site</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Job cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job: any) => {
          const match = job.match_score != null ? Math.round(job.match_score) : null;
          return (
            <Card
              key={job.listing_id}
              className="flex flex-col hover:border-blue-500/50 transition-colors cursor-pointer group"
              onClick={() => setSelectedJob(job)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 pr-3">
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-blue-300 transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-slate-400 text-sm">{job.company_profile?.company_name || 'Company'}</p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] text-slate-500">Match</span>
                  <MatchRing score={match} />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="primary">{job.work_mode}</Badge>
                <Badge variant="info">{job.location}</Badge>
              </div>

              <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-800/50">
                <span className="text-xs text-slate-400">
                  Deadline: {new Date(job.application_deadline).toLocaleDateString()}
                </span>
                <button
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                  onClick={(e) => { e.stopPropagation(); setSelectedJob(job); }}
                >
                  View Details →
                </button>
              </div>
            </Card>
          );
        })}

        {filteredJobs.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-500">
            {jobs.length === 0 && appliedIds.size > 0
              ? "You've applied to all available internships! Check My Applications for status."
              : 'No internships found matching your criteria.'}
          </div>
        )}
      </div>

      {/* ── Detail Modal ── */}
      {selectedJob && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setSelectedJob(null)}
        >
          <div
            className="bg-[#0f1623] border border-slate-700/60 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex justify-between items-start p-6 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-slate-100">{selectedJob.title}</h2>
                <p className="text-slate-400 text-sm">{selectedJob.company_profile?.company_name}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="primary">{selectedJob.work_mode}</Badge>
                  <Badge variant="info">{selectedJob.location}</Badge>
                </div>
              </div>
              <div className="flex flex-col items-center gap-1 ml-4">
                <span className="text-[10px] text-slate-500">Match</span>
                <MatchRing score={selectedJob.match_score != null ? Math.round(selectedJob.match_score) : null} />
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="ml-4 text-slate-500 hover:text-slate-200 text-2xl leading-none transition-colors self-start"
              >×</button>
            </div>

            {/* Modal body */}
            <div className="p-6 overflow-y-auto space-y-8 flex-1">

              {/* Score breakdown */}
              <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Match Breakdown
                </h3>
                {selectedJob.match_details ? (
                  <div className="grid grid-cols-3 gap-3">
                    <ScoreBar label="Skills" weight="60% weight"
                      value={selectedJob.match_details.skill_match_score}
                      color="border-blue-500/20 bg-blue-500/5 text-blue-400" />
                    <ScoreBar label="GPA" weight="20% weight"
                      value={selectedJob.match_details.gpa_match_score}
                      color="border-emerald-500/20 bg-emerald-500/5 text-emerald-400" />
                    <ScoreBar label="Preferences" weight="20% weight"
                      value={selectedJob.match_details.preference_match_score}
                      color="border-purple-500/20 bg-purple-500/5 text-purple-400" />
                  </div>
                ) : (
                  <div className="text-slate-500 text-sm p-4 bg-slate-800/50 rounded-lg">
                    Scores not calculated yet — click <strong>Refresh Match Scores</strong> on the main page.
                  </div>
                )}
              </div>

              {/* Skill analysis */}
              {selectedJob.listing_required_skills?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    Required Skills
                    <span className="ml-2 text-slate-500 normal-case font-normal text-xs">
                      ({selectedJob.match_details?.matched_skills_count ?? '?'} / {selectedJob.listing_required_skills.length} matched)
                    </span>
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedJob.listing_required_skills.map((reqSkill: any) => {
                      const hasSkill = cvData?.skills?.some((cvs: any) => cvs.skill_id === reqSkill.skill_id);
                      const studentSkill = cvData?.skills?.find((cvs: any) => cvs.skill_id === reqSkill.skill_id);
                      return (
                        <div
                          key={reqSkill.listing_skill_id}
                          className={`flex items-center gap-3 p-3 rounded-lg border ${
                            hasSkill
                              ? 'border-emerald-500/25 bg-emerald-500/10'
                              : 'border-slate-700/40 bg-slate-800/30'
                          }`}
                        >
                          <span className="text-lg shrink-0">{hasSkill ? '✅' : '❌'}</span>
                          <div className="min-w-0">
                            <div className={`font-semibold text-sm truncate ${hasSkill ? 'text-emerald-300' : 'text-slate-400'}`}>
                              {reqSkill.skill?.skill_name}
                            </div>
                            <div className="text-[11px] text-slate-500 flex gap-2">
                              <span>{reqSkill.importance}</span>
                              {hasSkill && studentSkill?.pivot?.proficiency_level && (
                                <span className="text-emerald-600">· {studentSkill.pivot.proficiency_level}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Internship details */}
              <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Details
                </h3>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-[11px] text-slate-500 block mb-1">Duration</span>
                    <span className="text-sm font-semibold text-slate-200">{selectedJob.duration_weeks} Weeks</span>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-[11px] text-slate-500 block mb-1">Quota</span>
                    <span className="text-sm font-semibold text-slate-200">{selectedJob.quota} slots</span>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-[11px] text-slate-500 block mb-1">Min. GPA</span>
                    <span className="text-sm font-semibold text-slate-200">{selectedJob.min_gpa ?? 'No requirement'}</span>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-[11px] text-slate-500 block mb-1">Deadline</span>
                    <span className="text-sm font-semibold text-slate-200">{new Date(selectedJob.application_deadline).toLocaleDateString()}</span>
                  </div>
                </div>
                <p className="whitespace-pre-wrap text-slate-300 leading-relaxed text-sm">
                  {selectedJob.description}
                </p>
              </div>
            </div>

            {/* Modal footer */}
            <div className="p-5 border-t border-slate-800 bg-slate-900/60 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setSelectedJob(null)}>Close</Button>
              <Button
                onClick={() => handleApply(selectedJob.listing_id)}
                disabled={applying === selectedJob.listing_id}
              >
                {applying === selectedJob.listing_id ? 'Submitting…' : 'Apply Now'}
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default FindJobs;
