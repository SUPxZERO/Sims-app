import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { JobDetailsModal } from '../../components/student/JobDetailsModal';
import { useFetch } from '../../hooks/useFetch';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import api from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import emptyStateImg from '../../assets/empty_state.png';
import savedListingsBg from '../../assets/saved_listings_bg.jpg';

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

export const SavedListings: React.FC = () => {
  const { data, loading, error, refetch } = useFetch<any>('/student/saved-listings', true);
  const { data: cvData }                  = useFetch<any>('/cv', true);
  
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [applying, setApplying]       = useState<number | null>(null);
  const [toasts, setToasts]           = useState<Toast[]>([]);

  const addToast = (message: string, type: Toast['type']) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };
  const removeToast = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

  const handleApply = async (listingId: number) => {
    try {
      setApplying(listingId);
      await api.post(`/listings/${listingId}/apply`);
      setSelectedJob(null);
      addToast('Application submitted successfully! 🎉', 'success');
    } catch (err: any) {
      addToast(err.response?.data?.error || 'Failed to apply. Please try again.', 'error');
    } finally {
      setApplying(null);
    }
  };

  const handleUnsave = async (e: React.MouseEvent, listingId: number) => {
    e.stopPropagation();
    try {
      await api.delete(`/listings/${listingId}/unsave`);
      addToast('Removed from saved jobs', 'info');
      if (refetch) refetch();
    } catch {
      addToast('Failed to remove saved job', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
        Error loading saved listings: {error}
      </div>
    );
  }

  const savedListings = data?.saved_listings || [];

  return (
    <div className="space-y-6 max-w-5xl">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      <PageHeader 
        title="Saved Internships" 
        subtitle="Internships you have bookmarked for later."
        mediaType="image"
        mediaSrc={savedListingsBg}
      />

      {savedListings.length === 0 ? (
        <Card className="text-center py-16 flex flex-col items-center justify-center">
          <img src={emptyStateImg} alt="No saved listings" className="w-64 h-64 object-contain mb-6 opacity-80 mix-blend-screen" />
          <h3 className="text-xl font-bold text-slate-200 mb-2">No Saved Internships</h3>
          <p className="text-slate-500 max-w-md mx-auto">You haven't bookmarked any internships yet. Explore the job board and save opportunities that interest you!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedListings.map((saved: any) => {
            const job = saved.listing;
            if (!job) return null;
            
            return (
              <Card 
                key={saved.id} 
                className="flex flex-col hover:border-blue-500/50 transition-colors cursor-pointer group"
                onClick={() => setSelectedJob(job)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 pr-3">
                    <h3 className="text-base font-bold text-slate-100 group-hover:text-blue-300 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-slate-400 text-sm">{job.company_profile?.company_name || job.company?.full_name || 'Company'}</p>
                  </div>
                  <button
                    onClick={(e) => handleUnsave(e, job.listing_id)}
                    className="text-xl leading-none opacity-100 hover:opacity-60 transition-opacity"
                    title="Remove from saved"
                  >
                    🔖
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="primary">{job.work_mode}</Badge>
                  <Badge variant="info">{job.location}</Badge>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-800/50">
                  <span className="text-xs text-slate-400">
                    Saved on: {new Date(saved.created_at).toLocaleDateString()}
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
        </div>
      )}
      
      {/* ── Detail Modal ── */}
      <JobDetailsModal
        job={selectedJob}
        cvData={cvData}
        applying={applying}
        onClose={() => setSelectedJob(null)}
        onApply={handleApply}
        showMatchScore={false}
      />
    </div>
  );
};

export default SavedListings;
