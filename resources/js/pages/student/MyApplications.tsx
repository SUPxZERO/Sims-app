import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import ApplicationTimeline from '../../components/common/ApplicationTimeline';
import PageHeader from '../../components/common/PageHeader';
import SkeletonDashboardLayout from '../../components/common/SkeletonDashboardLayout';
import emptyStateImg from '../../assets/empty_state.png';
import applicationsBg from '../../assets/applications_bg.jpg';

export const MyApplications: React.FC = () => {
  const { data, loading, error, refetch } = useFetch<any>('/applications/student', true);
  const [timelineAppId, setTimelineAppId] = useState<number | null>(null);

  const handleConfirmOffer = async (applicationId: number) => {
    try {
      await api.patch(`/applications/${applicationId}/status`, { status: 'CONFIRMED' });
      alert('Offer confirmed successfully!');
      refetch();
    } catch (err: any) {
      alert('Failed to confirm offer: ' + (err.response?.data?.error || err.message));
    }
  };

  if (loading) {
    return <SkeletonDashboardLayout />;
  }

  if (error) {
    return (
      <div className="text-red-400 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
        Error loading applications: {error}
      </div>
    );
  }

  const applications = data?.applications || [];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
        return 'warning';
      case 'SHORTLISTED':
        return 'info';
      case 'ACCEPTED':
      case 'CONFIRMED':
        return 'success';
      case 'REJECTED':
      case 'WITHDRAWN':
        return 'danger';
      default:
        return 'primary';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Applications" 
        subtitle="Track the status of your internship applications."
        mediaType="image"
        mediaSrc={applicationsBg}
      />

      <div className="grid grid-cols-1 gap-6">
        {applications.length === 0 ? (
          <Card className="text-center py-16 flex flex-col items-center justify-center">
            <img src={emptyStateImg} alt="No applications" className="w-64 h-64 object-contain mb-6 opacity-80 mix-blend-screen" />
            <h3 className="text-xl font-bold text-slate-200 mb-2">No Applications Yet</h3>
            <p className="text-slate-500 max-w-md mx-auto">You haven't applied to any internships yet. Start exploring the job board to find your next opportunity!</p>
          </Card>
        ) : (
          applications.map((app: any) => (
            <Card key={app.application_id} className="flex flex-col md:flex-row gap-6 hover:border-blue-500/50 transition-colors">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-slate-100">{app.listing?.title || 'Unknown Position'}</h3>
                    <p className="text-slate-400">{app.listing?.company_profile?.company_name || 'Unknown Company'}</p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(app.status)}>
                    {app.status.replace('_', ' ')}
                  </Badge>
                </div>
                
                <div className="flex gap-4 mt-4">
                  {app.listing?.work_mode && (
                    <Badge variant="primary">{app.listing.work_mode}</Badge>
                  )}
                  {app.listing?.location && (
                    <Badge variant="info">{app.listing.location}</Badge>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col justify-between md:items-end border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 min-w-[200px]">
                <div className="text-sm text-slate-400">
                  <span className="block mb-1 text-xs uppercase tracking-wider text-slate-500">Applied On</span>
                  {new Date(app.created_at).toLocaleDateString()}
                </div>
                
                {app.status === 'ACCEPTED' && (
                  <div className="mt-4">
                    <button 
                      onClick={() => handleConfirmOffer(app.application_id)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-green-900/20 w-full mb-2"
                    >
                      Confirm Offer
                    </button>
                  </div>
                )}
                <div className="mt-2 text-right">
                    <button 
                      onClick={() => setTimelineAppId(app.application_id)}
                      className="text-xs text-blue-400 hover:text-blue-300 underline"
                    >
                      View History
                    </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <Modal 
        isOpen={timelineAppId !== null} 
        onClose={() => setTimelineAppId(null)} 
        title="Application History"
      >
        {timelineAppId && <ApplicationTimeline applicationId={timelineAppId} />}
      </Modal>
    </div>
  );
};

export default MyApplications;
