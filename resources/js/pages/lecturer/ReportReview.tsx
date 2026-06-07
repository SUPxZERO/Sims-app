import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export const ReportReview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await api.get(`/reports/${id}`);
        setReport(response.data.report || response.data);
      } catch (error) {
        console.error("Failed to fetch report details", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchReport();
    }
  }, [id]);

  const handleAction = async (action: 'approve' | 'revise') => {
    try {
      const decision = action === 'approve' ? 'APPROVED' : 'REVISION_REQUESTED';
      await api.post(`/reports/${id}/review`, {
        decision,
        comments: feedback || 'No comments provided.'
      });
      alert(`Report ${decision.replace('_', ' ').toLowerCase()} successfully!`);
      navigate('/lecturer/dashboard');
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Error submitting review. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="text-center py-12 text-slate-400">Loading report details...</div>;
  }

  if (!report) {
    return <div className="text-center py-12 text-slate-400">Report details not found.</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/lecturer/dashboard')}
          className="p-2 bg-slate-800 text-slate-300 hover:text-white rounded-full transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Review Weekly Report</h1>
          <p className="text-slate-400">{report.internship?.student_profile?.user?.full_name || 'Student'} • Week {report.week_number}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                  {(report.internship?.student_profile?.user?.full_name || 'S').charAt(0)}
                </div>
                <div>
                  <h3 className="text-slate-200 font-medium">{report.internship?.student_profile?.user?.full_name || 'Student Name'}</h3>
                  <p className="text-xs text-slate-400">{report.internship?.company_profile?.company_name || 'Company'}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant={report.is_late ? "warning" : "success"} className="mb-1">
                  {report.is_late ? "Late Submission" : "On Time"}
                </Badge>
                <p className="text-xs text-slate-400">Submitted: {report.submitted_at ? new Date(report.submitted_at).toLocaleDateString() : '-'}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-2">Activities Performed</h4>
                <div className="bg-slate-900/50 p-4 rounded-lg text-slate-300 text-sm leading-relaxed border border-slate-800">
                  {report.activities || 'No activities logged.'}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-2">Challenges Encountered</h4>
                <div className="bg-slate-900/50 p-4 rounded-lg text-slate-300 text-sm leading-relaxed border border-slate-800">
                  {report.challenges || 'No challenges logged.'}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-2">Key Learnings</h4>
                <div className="bg-slate-900/50 p-4 rounded-lg text-slate-300 text-sm leading-relaxed border border-slate-800">
                  {report.learnings || 'No learnings logged.'}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="font-outfit font-semibold text-slate-100 mb-4">Evaluation</h3>
            
            <div className="mb-6 flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-slate-800">
              <span className="text-sm text-slate-400">Hours Logged</span>
              <span className="font-bold text-slate-200">{report.hours_logged || 0} hrs</span>
            </div>

            {report.status === 'SUBMITTED' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Feedback / Revision Notes
                  </label>
                  <textarea 
                    className="input-field min-h-[120px] w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500" 
                    placeholder="Enter feedback for the student..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  ></textarea>
                  <p className="text-xs text-slate-500 mt-2">
                    Required if requesting a revision. (Current revisions: {report.revision_count || 0}/3)
                  </p>
                </div>

                <div className="flex flex-col gap-3 pt-4 border-t border-slate-800">
                  <Button 
                    variant="success" 
                    className="w-full"
                    onClick={() => handleAction('approve')}
                  >
                    Approve Report
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="w-full"
                    disabled={!feedback.trim() || (report.revision_count || 0) >= 3}
                    onClick={() => handleAction('revise')}
                  >
                    Request Revision
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 text-center">
                <p className="text-slate-400 text-sm">
                  {report.status === 'NOT_STARTED' && "This report has not been started by the student yet."}
                  {report.status === 'DRAFT' && "This report is currently being drafted by the student."}
                  {report.status === 'APPROVED' && "This report has already been approved."}
                  {report.status === 'REVISION_REQUESTED' && "A revision has been requested for this report."}
                  {report.status === 'REJECTED' && "This report has been rejected."}
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportReview;
