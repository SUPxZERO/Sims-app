import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import PageHeader from '../../components/common/PageHeader';
import studentEvalBg from '../../assets/student_eval_bg.jpg';

export const StudentEvaluation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Fetch internship details
  const { data: internshipData, loading: internshipLoading, error: internshipError } = useFetch<any>(`/internships/${id}`, true);
  
  // Fetch existing grade data if available
  const { data: gradeData, refetch: refetchGrade } = useFetch<any>(`/internships/${id}/grade`, true);

  const [scores, setScores] = useState({
    report_quality_score: '',
    presentation_score: '',
    engagement_score: '',
    overall_comments: '',
  });
  const [submitting, setSubmitting] = useState(false);
  
  const internship = internshipData?.internship;
  const existingEval = internship?.lecturer_grade;
  const finalGrade = gradeData?.final_score;

  // Initialize form if there is a drafted evaluation
  useEffect(() => {
    if (existingEval && !scores.report_quality_score) {
      setScores({
        report_quality_score: existingEval.report_quality_score?.toString() || '',
        presentation_score: existingEval.presentation_score?.toString() || '',
        engagement_score: existingEval.engagement_score?.toString() || '',
        overall_comments: existingEval.overall_comments || '',
      });
    }
  }, [existingEval]);

  const isSubmitted = existingEval?.status === 'SUBMITTED';
  const companyEval = internship?.company_evaluation?.status === 'SUBMITTED' ? internship.company_evaluation : null;

  if (internshipLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (internshipError) {
    return (
      <div className="text-red-400 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
        Error loading student details: {internshipError}
      </div>
    );
  }

  const handleSave = async (status: 'DRAFT' | 'SUBMITTED') => {
    try {
      setSubmitting(true);
      await api.post(`/internships/${id}/evaluations/lecturer`, {
        ...scores,
        status
      });
      alert(status === 'SUBMITTED' ? 'Final grade submitted successfully!' : 'Draft saved.');
      if (status === 'SUBMITTED') {
        refetchGrade();
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to save evaluation.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Student Evaluation" 
        subtitle={`Submit final grades for ${internship?.student_profile?.user?.full_name || internship?.student?.full_name || 'Unknown'}.`}
        mediaType="image"
        mediaSrc={studentEvalBg}
        heightClass="min-h-[250px]"
      >
        <div className="flex gap-4 items-center flex-col md:flex-row">
          <button 
            onClick={() => navigate('/lecturer/students')}
            className="text-slate-400 hover:text-slate-300 text-sm flex items-center transition-colors"
          >
            &larr; Back to Student Roster
          </button>
          {isSubmitted && <Badge variant="success">Evaluation Submitted</Badge>}
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Evaluation Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-lg font-bold text-slate-100 mb-4">Grading Rubric</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Report Quality Score (0-100)</label>
                <Input 
                  type="number" 
                  min="0" max="100"
                  value={scores.report_quality_score}
                  onChange={(e) => setScores({...scores, report_quality_score: e.target.value})}
                  disabled={isSubmitted}
                  placeholder="e.g. 85"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Presentation Score (0-100)</label>
                <Input 
                  type="number" 
                  min="0" max="100"
                  value={scores.presentation_score}
                  onChange={(e) => setScores({...scores, presentation_score: e.target.value})}
                  disabled={isSubmitted}
                  placeholder="e.g. 90"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Engagement & Professionalism Score (0-100)</label>
                <Input 
                  type="number" 
                  min="0" max="100"
                  value={scores.engagement_score}
                  onChange={(e) => setScores({...scores, engagement_score: e.target.value})}
                  disabled={isSubmitted}
                  placeholder="e.g. 95"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Overall Comments</label>
                <textarea 
                  className="w-full bg-slate-900/50 border border-slate-700/50 text-slate-200 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  rows={4}
                  value={scores.overall_comments}
                  onChange={(e) => setScores({...scores, overall_comments: e.target.value})}
                  disabled={isSubmitted}
                  placeholder="Provide comprehensive feedback on the student's performance..."
                ></textarea>
              </div>
            </div>

            {!isSubmitted && (
              <div className="flex gap-4 mt-6">
                <Button 
                  variant="secondary" 
                  onClick={() => handleSave('DRAFT')}
                  disabled={submitting}
                >
                  Save as Draft
                </Button>
                <Button 
                  variant="primary" 
                  onClick={() => handleSave('SUBMITTED')}
                  disabled={submitting || !scores.report_quality_score || !scores.presentation_score || !scores.engagement_score}
                >
                  {submitting ? 'Submitting...' : 'Submit Final Grade'}
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {finalGrade && isSubmitted && (
            <Card className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 border-indigo-500/30">
              <h3 className="text-sm font-medium text-indigo-300 mb-2 uppercase tracking-wider">Final Computed Grade</h3>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-bold text-white">{finalGrade.letter_grade}</span>
                <span className="text-xl font-medium text-indigo-200 mb-1">({finalGrade.total_score}%)</span>
              </div>
            </Card>
          )}

          <Card>
            <h3 className="font-bold text-slate-100 mb-3">Internship Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-slate-500 block">Company</span>
                <span className="text-slate-300 font-medium">{internship?.company_profile?.company_name || 'Unknown'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Role</span>
                <span className="text-slate-300 font-medium">{internship?.listing?.title}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Duration</span>
                <span className="text-slate-300 font-medium">
                  {new Date(internship?.start_date).toLocaleDateString()} - {new Date(internship?.end_date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>

          {companyEval ? (
            <Card>
              <h3 className="font-bold text-slate-100 mb-3 flex justify-between items-center">
                <span>Company Evaluation</span>
                <Badge variant="success">Received</Badge>
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-slate-500 block">Composite Score</span>
                  <span className="text-slate-300 font-medium">{companyEval.composite_score}/100</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Hiring Recommendation</span>
                  <span className="text-slate-300 font-medium">{companyEval.hiring_recommendation?.replace(/_/g, ' ')}</span>
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <h3 className="font-bold text-slate-100 mb-3">Company Evaluation</h3>
              <div className="text-sm text-slate-500 italic">
                The company has not submitted their evaluation yet.
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentEvaluation;
