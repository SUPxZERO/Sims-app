import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import CvViewer from '../../components/cv/CvViewer';
import Modal from '../../components/common/Modal';
import ApplicationTimeline from '../../components/common/ApplicationTimeline';
import ScheduleInterviewModal from './ScheduleInterviewModal';
import PageHeader from '../../components/common/PageHeader';
import SkeletonDashboardLayout from '../../components/common/SkeletonDashboardLayout';
import applicationsBg from '../../assets/applications_bg.jpg';

export const ReviewApplications: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useFetch<any>(`/listings/${id}/applications`, true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [expandedApp, setExpandedApp] = useState<number | null>(null);
  const [timelineAppId, setTimelineAppId] = useState<number | null>(null);
  const [interviewAppId, setInterviewAppId] = useState<number | null>(null);

  if (loading) {
    return <SkeletonDashboardLayout />;
  }

  if (error) {
    return (
      <div className="text-red-400 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
        Error loading applicants: {error}
      </div>
    );
  }

  const applications = data?.applications || [];

  const handleStatusChange = async (appId: number, newStatus: string) => {
    try {
      setUpdating(appId);
      await api.patch(`/applications/${appId}/status`, { status: newStatus });
      await refetch();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update application status.');
    } finally {
      setUpdating(null);
    }
  };



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
        title="Review Applicants" 
        subtitle="Review and manage candidates for this listing."
        mediaType="image"
        mediaSrc={applicationsBg}
      >
        <button 
          onClick={() => navigate('/company/listings')}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-700"
        >
          &larr; Back to Listings
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6">
        {applications.length === 0 ? (
          <Card>
            <div className="py-12 text-center text-slate-500">
              No applications received for this listing yet.
            </div>
          </Card>
        ) : (
          applications.map((app: any) => (
            <Card key={app.application_id} className="flex flex-col md:flex-row gap-6 hover:border-blue-500/50 transition-colors">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-100">
                      {app.user?.full_name || app.student_profile?.user?.full_name || app.student?.full_name || 'Unknown'}
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">
                      Applied: {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(app.status)}>
                    {app.status.replace('_', ' ')}
                  </Badge>
                </div>
                
                {app.cover_letter && (
                  <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                    <h4 className="text-sm font-semibold text-slate-300 mb-2">Cover Letter</h4>
                    <p className="text-slate-400 text-sm whitespace-pre-wrap">{app.cover_letter}</p>
                  </div>
                )}

                <div className="mt-4">
                  <button
                    onClick={() => setExpandedApp(expandedApp === app.application_id ? null : app.application_id)}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                  >
                    {expandedApp === app.application_id ? 'Hide Student Profile \u25B2' : 'View Student Profile \u25BC'}
                  </button>

                  {expandedApp === app.application_id && app.cv_version?.snapshot_data && (
                    <div className="mt-4">
                      <CvViewer 
                        cvData={app.cv_version.snapshot_data} 
                        studentProfile={app.student_profile}
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 min-w-[200px]">

                <button 
                  onClick={() => handleStatusChange(app.application_id, 'ACCEPTED')}
                  disabled={updating === app.application_id || app.status === 'ACCEPTED' || app.status === 'REJECTED'}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Accept Candidate
                </button>
                
                <button 
                  onClick={() => setInterviewAppId(app.application_id)}
                  disabled={app.status === 'REJECTED'}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Schedule Interview
                </button>
                
                <button 
                  onClick={() => handleStatusChange(app.application_id, 'REJECTED')}
                  disabled={updating === app.application_id || app.status === 'REJECTED' || app.status === 'ACCEPTED'}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium rounded-lg transition-colors border border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reject
                </button>
                
                <div className="mt-4 text-center">
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

      <ScheduleInterviewModal
        isOpen={interviewAppId !== null}
        onClose={() => setInterviewAppId(null)}
        applicationId={interviewAppId}
        onScheduled={() => {
          alert('Interview scheduled successfully!');
          refetch();
        }}
      />
    </div>
  );
};

export default ReviewApplications;
