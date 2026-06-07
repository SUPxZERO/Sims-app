import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';

export const ReviewApplications: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useFetch<any>(`/listings/${id}/applications`, true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [expandedApp, setExpandedApp] = useState<number | null>(null);

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
      <div className="flex justify-between items-center">
        <div>
          <button 
            onClick={() => navigate('/company/listings')}
            className="text-slate-400 hover:text-slate-300 text-sm flex items-center mb-2 transition-colors"
          >
            &larr; Back to Listings
          </button>
          <h1 className="text-2xl font-bold text-slate-100">Review Applicants</h1>
          <p className="text-slate-400">Review and manage candidates for this listing.</p>
        </div>
      </div>

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
                    <div className="mt-4 space-y-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      {app.cv_version.snapshot_data.personal_summary && (
                        <div>
                          <h4 className="text-sm font-semibold text-slate-200 mb-1">About</h4>
                          <p className="text-sm text-slate-400">{app.cv_version.snapshot_data.personal_summary}</p>
                        </div>
                      )}

                      {app.cv_version.snapshot_data.skills && app.cv_version.snapshot_data.skills.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-slate-200 mb-2">Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {app.cv_version.snapshot_data.skills.map((skill: any) => (
                              <Badge key={skill.skill_id || skill.name} variant="info">
                                {skill.name} ({skill.proficiency_level})
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {app.cv_version.snapshot_data.educations && app.cv_version.snapshot_data.educations.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-slate-200 mb-2">Education</h4>
                          <div className="space-y-3">
                            {app.cv_version.snapshot_data.educations.map((edu: any, i: number) => (
                              <div key={i} className="border-l-2 border-blue-500/50 pl-3">
                                <h5 className="text-sm font-bold text-slate-200">{edu.degree} in {edu.field_of_study}</h5>
                                <p className="text-xs text-slate-400">{edu.institution_name}</p>
                                <p className="text-xs text-slate-500">{new Date(edu.start_date).getFullYear()} - {edu.end_date ? new Date(edu.end_date).getFullYear() : 'Present'}</p>
                                {edu.description && <p className="text-xs text-slate-400 mt-1">{edu.description}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {app.cv_version.snapshot_data.experiences && app.cv_version.snapshot_data.experiences.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-slate-200 mb-2">Experience</h4>
                          <div className="space-y-3">
                            {app.cv_version.snapshot_data.experiences.map((exp: any, i: number) => (
                              <div key={i} className="border-l-2 border-emerald-500/50 pl-3">
                                <h5 className="text-sm font-bold text-slate-200">{exp.position_title}</h5>
                                <p className="text-xs text-slate-400">{exp.company_name}</p>
                                <p className="text-xs text-slate-500">{new Date(exp.start_date).toLocaleDateString()} - {exp.end_date ? new Date(exp.end_date).toLocaleDateString() : 'Present'}</p>
                                {exp.description && <p className="text-xs text-slate-400 mt-1">{exp.description}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {app.student_profile && (
                        <div className="grid grid-cols-2 gap-4 text-sm mt-4 pt-4 border-t border-slate-700">
                          <div>
                            <span className="text-slate-500 block text-xs uppercase">Major</span>
                            <span className="text-slate-300">{app.student_profile.major || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-xs uppercase">GPA</span>
                            <span className="text-slate-300">{app.student_profile.gpa || 'N/A'}</span>
                          </div>
                        </div>
                      )}
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
                  onClick={() => handleStatusChange(app.application_id, 'REJECTED')}
                  disabled={updating === app.application_id || app.status === 'REJECTED' || app.status === 'ACCEPTED'}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium rounded-lg transition-colors border border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reject
                </button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewApplications;
