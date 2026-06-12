import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { JobDetailsModal, MatchRing } from '../../components/student/JobDetailsModal';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import SkeletonJobCard from '../../components/common/SkeletonJobCard';
import { useFetch } from '../../hooks/useFetch';
import api from '../../services/api';
import heroVideo from '../../assets/hero_video.mp4';

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

// ── Main Component ────────────────────────────────────────────────────────────
export const FindJobs: React.FC = () => {
  const [searchTerm, setSearchTerm]   = useState('');
  const [workMode, setWorkMode]       = useState('ALL');
  const [applying, setApplying]       = useState<number | null>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [appliedIds, setAppliedIds]   = useState<Set<number>>(new Set());
  const [savedIds, setSavedIds]       = useState<Set<number>>(new Set());
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

    api.get('/student/saved-listings').then(res => {
      const ids = (res.data.saved_listings || []).map((s: any) => s.listing_id);
      setSavedIds(new Set(ids));
    }).catch(() => {});
  }, []);

  // Update selectedJob if data changes (e.g., after refreshing match scores)
  useEffect(() => {
    if (selectedJob && data?.listings) {
      const updatedJob = data.listings.find((j: any) => j.listing_id === selectedJob.listing_id);
      if (updatedJob && updatedJob.match_score !== selectedJob.match_score) {
        setSelectedJob(updatedJob);
      }
    }
  }, [data]);

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

  const handleToggleSave = async (e: React.MouseEvent, listingId: number) => {
    e.stopPropagation();
    try {
      if (savedIds.has(listingId)) {
        await api.delete(`/listings/${listingId}/unsave`);
        setSavedIds(prev => {
          const next = new Set(prev);
          next.delete(listingId);
          return next;
        });
        addToast('Removed from saved jobs', 'info');
      } else {
        await api.post(`/listings/${listingId}/save`);
        setSavedIds(prev => new Set([...prev, listingId]));
        addToast('Job saved for later!', 'success');
      }
    } catch {
      addToast('Failed to update save status', 'error');
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
    <div className="space-y-6">
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 p-8 md:p-14 shadow-lg min-h-[350px] flex items-end">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 w-full">
          <div className="w-full">
            <div className="h-8 bg-slate-800/50 rounded-lg mb-3 w-1/3 animate-pulse" />
            <div className="h-5 bg-slate-800/50 rounded-lg w-1/2 animate-pulse" />
          </div>
        </div>
      </div>

      <Card className="!p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 h-10 bg-slate-800/50 rounded-lg animate-pulse" />
          <div className="w-full md:w-48 h-10 bg-slate-800/50 rounded-lg animate-pulse" />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <SkeletonJobCard key={i} />
        ))}
      </div>
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
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 p-8 md:p-14 shadow-lg min-h-[350px] flex items-end">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover object-center opacity-40 mix-blend-screen">
            <source src={heroVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Find Internships</h1>
            <p className="text-blue-200 text-lg">Discover and apply to new opportunities.</p>
          </div>
          <Button variant="secondary" onClick={handleRefreshScores} disabled={refreshing} className="backdrop-blur-md bg-white/10 hover:bg-white/20 border-white/20 text-white">
            {refreshing ? 'Refreshing…' : '↻  Refresh Match Scores'}
          </Button>
        </div>
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
        {filteredJobs.map((job: any, index: number) => {
          const match = job.match_score != null ? Math.round(job.match_score) : null;
          return (
            <Card
              key={job.listing_id}
              className="flex flex-col hover:border-blue-500/50 transition-colors cursor-pointer group stagger-item"
              onClick={() => setSelectedJob(job)}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 pr-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-bold text-slate-100 group-hover:text-blue-300 transition-colors">
                      {job.title}
                    </h3>
                    <button
                      onClick={(e) => handleToggleSave(e, job.listing_id)}
                      className="text-xl leading-none opacity-60 hover:opacity-100 transition-opacity"
                      title={savedIds.has(job.listing_id) ? "Unsave" : "Save for later"}
                    >
                      {savedIds.has(job.listing_id) ? '🔖' : '🤍'}
                    </button>
                  </div>
                  <p className="text-slate-400 text-sm mt-1">{job.company_profile?.company_name || 'Company'}</p>
                </div>
                <div className="flex flex-col items-center gap-1 ml-2">
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
      <JobDetailsModal
        job={selectedJob}
        cvData={cvData}
        applying={applying}
        onClose={() => setSelectedJob(null)}
        onApply={handleApply}
        showMatchScore={true}
      />
    </div>
  );
};

export default FindJobs;
