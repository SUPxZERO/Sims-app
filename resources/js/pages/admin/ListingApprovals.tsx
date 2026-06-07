import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';

export const ListingApprovals: React.FC = () => {
  const { data, loading, error, refetch } = useFetch<any>('/listings?status=PENDING_APPROVAL', true);
  const [reviewing, setReviewing] = useState<number | null>(null);

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
        Error loading pending listings: {error}
      </div>
    );
  }

  const listings = data?.listings || [];

  const handleReview = async (id: number, status: 'PUBLISHED' | 'REJECTED') => {
    let feedback = '';
    if (status === 'REJECTED') {
      const reason = window.prompt("Please provide a reason for rejecting this listing:");
      if (reason === null) return; // User cancelled
      feedback = reason;
    }

    try {
      setReviewing(id);
      await api.patch(`/listings/${id}/review`, { status, feedback });
      await refetch();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to submit review.');
    } finally {
      setReviewing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Listing Approvals</h1>
          <p className="text-slate-400">Review and approve job listings submitted by companies.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {listings.length === 0 ? (
          <Card>
            <div className="py-12 text-center text-slate-500">
              No listings currently pending approval.
            </div>
          </Card>
        ) : (
          listings.map((listing: any) => (
            <Card key={listing.listing_id} className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-100">{listing.title}</h3>
                    <p className="text-slate-400 font-medium text-lg mt-1">{listing.company_profile?.company_name || 'Unknown Company'}</p>
                  </div>
                  <Badge variant="warning">Pending Approval</Badge>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="primary">{listing.work_mode}</Badge>
                  <Badge variant="info">{listing.location}</Badge>
                  <Badge variant="primary">{listing.duration_weeks} Weeks</Badge>
                  <Badge variant="primary">Quota: {listing.quota}</Badge>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                  <h4 className="text-sm font-semibold text-slate-300 mb-2">Job Description</h4>
                  <p className="text-slate-400 text-sm whitespace-pre-wrap">{listing.description}</p>
                </div>
                
                {listing.listing_required_skills && listing.listing_required_skills.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-300 mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {listing.listing_required_skills.map((skillObj: any) => (
                        <span key={skillObj.listing_skill_id} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded-md border border-slate-700">
                          {skillObj.skill?.skill_name || 'Skill'} ({skillObj.importance})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col justify-start gap-3 border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-6 min-w-[200px]">
                <div className="mb-4">
                  <span className="block mb-1 text-xs uppercase tracking-wider text-slate-500">Submitted On</span>
                  <span className="text-sm text-slate-300">{new Date(listing.created_at).toLocaleDateString()}</span>
                </div>
                
                <button 
                  onClick={() => handleReview(listing.listing_id, 'PUBLISHED')}
                  disabled={reviewing === listing.listing_id}
                  className="w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Approve Listing
                </button>
                
                <button 
                  onClick={() => handleReview(listing.listing_id, 'REJECTED')}
                  disabled={reviewing === listing.listing_id}
                  className="w-full px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium rounded-lg transition-colors border border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reject...
                </button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ListingApprovals;
