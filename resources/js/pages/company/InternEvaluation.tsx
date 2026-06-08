import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export const InternEvaluation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [intern, setIntern] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [criteriaList, setCriteriaList] = useState<any[]>([]);
  const [scores, setScores] = useState<Record<number, number>>({});

  const [feedback, setFeedback] = useState('');
  const [wouldHire, setWouldHire] = useState(false);

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const response = await api.get(`/internships/${id}`);
        setIntern(response.data.internship || response.data);
      } catch (error) {
        console.error("Failed to fetch internship details", error);
      }
    };
    
    const fetchCriteria = async () => {
      try {
        const response = await api.get('/evaluations/criteria');
        const list = response.data.criteria || [];
        setCriteriaList(list);
        const initialScores: Record<number, number> = {};
        list.forEach((c: any) => initialScores[c.criteria_id] = 5);
        setScores(initialScores);
      } catch (error) {
        console.error("Failed to fetch criteria", error);
      }
    };

    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchInternship(), fetchCriteria()]);
      setIsLoading(false);
    };

    if (id) {
      loadData();
    }
  }, [id]);

  const handleScoreChange = (criteriaId: number, value: string) => {
    setScores(prev => ({ ...prev, [criteriaId]: parseInt(value) || 0 }));
  };

  // Calculate composite percentage
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const maxPossible = criteriaList.length > 0 ? criteriaList.length * 10 : 10;
  const percentage = maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const criteriaScoresPayload = Object.keys(scores).map(key => ({
        criteria_id: parseInt(key),
        score: scores[parseInt(key)]
      }));

      await api.post(`/internships/${id}/evaluations/company`, {
        composite_score: percentage,
        strengths: feedback, 
        improvements: '',
        overall_comments: feedback,
        hiring_recommendation: wouldHire ? 'WOULD_HIRE' : 'WOULD_NOT_HIRE',
        status: 'SUBMITTED',
        criteria_scores: criteriaScoresPayload
      });
      alert('Evaluation submitted successfully!');
      navigate('/company/dashboard');
    } catch (error) {
      console.error('Error submitting evaluation:', error);
      alert('Failed to submit evaluation. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="text-center py-12 text-slate-400">Loading intern details...</div>;
  }

  if (!intern) {
    return <div className="text-center py-12 text-slate-400">Internship details not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button 
          type="button"
          onClick={() => navigate('/company/dashboard')}
          className="p-2 bg-slate-800 text-slate-300 hover:text-white rounded-full transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Final Intern Evaluation</h1>
          <p className="text-slate-400">Evaluate {intern.student_name || 'the intern'}'s performance</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <h2 className="text-lg font-outfit font-semibold text-slate-100 mb-6">Performance Rubric (1-10)</h2>
              
              <div className="space-y-6">
                {criteriaList.map(criteria => (
                  <div key={criteria.criteria_id} className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <label className="font-medium text-slate-200">{criteria.criteria_name}</label>
                        <p className="text-xs text-slate-500">{criteria.description}</p>
                      </div>
                      <div className="w-20">
                        <Input 
                          type="number"
                          min="1"
                          max="10"
                          value={scores[criteria.criteria_id] || 5}
                          onChange={(e) => handleScoreChange(criteria.criteria_id, e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      value={scores[criteria.criteria_id] || 5} 
                      onChange={(e) => handleScoreChange(criteria.criteria_id, e.target.value)}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-outfit font-semibold text-slate-100 mb-4">Qualitative Feedback</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Additional Comments *</label>
                  <textarea 
                    className="input-field min-h-[120px] w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500" 
                    placeholder="Provide a detailed summary of the intern's strengths, areas for improvement, and overall contribution..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="flex items-center gap-3 bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                  <input 
                    type="checkbox" 
                    id="wouldHire"
                    checked={wouldHire}
                    onChange={(e) => setWouldHire(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-700 text-blue-500 focus:ring-blue-500 bg-slate-800"
                  />
                  <label htmlFor="wouldHire" className="text-sm font-medium text-slate-200">
                    We would consider hiring this intern for a full-time role in the future.
                  </label>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <h3 className="font-outfit font-semibold text-slate-100 mb-4">Evaluation Summary</h3>
              
              <div className="mb-6 bg-slate-900/50 p-6 rounded-lg border border-slate-800 text-center">
                <span className="block text-sm text-slate-400 mb-2">Composite Score</span>
                <div className="relative inline-flex items-center justify-center w-24 h-24">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-800"
                      strokeWidth="4"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={percentage >= 80 ? "text-emerald-400" : percentage >= 60 ? "text-yellow-400" : "text-red-400"}
                      strokeWidth="4"
                      strokeDasharray={`${percentage}, 100`}
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-xl font-bold text-slate-100">{percentage}%</span>
                </div>
                <span className="block mt-2 text-xs text-slate-500">Points: {totalScore} / {maxPossible}</span>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <p className="text-xs text-slate-400 mb-4">
                  This evaluation will be sent to the university and factored into the student's final academic grade.
                </p>
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="w-full"
                >
                  Submit Evaluation
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InternEvaluation;
