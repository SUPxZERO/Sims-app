import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export const RecommendationConfig: React.FC = () => {
  // config variable removed since it was unused
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    skill_weight: 0.60,
    gpa_weight: 0.20,
    preference_weight: 0.20,
    min_score_threshold: 30.00,
    max_recommendations: 10
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await api.get('/admin/matching-config');
      if (response.data.config) {
        setFormData({
          skill_weight: response.data.config.skill_weight,
          gpa_weight: response.data.config.gpa_weight,
          preference_weight: response.data.config.preference_weight,
          min_score_threshold: response.data.config.min_score_threshold,
          max_recommendations: response.data.config.max_recommendations
        });
      }
    } catch (error) {
      console.error('Failed to fetch matching config', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const sum = formData.skill_weight + formData.gpa_weight + formData.preference_weight;
    if (Math.abs(sum - 1.0) > 0.001) {
      alert(`The sum of the weights must be exactly 1.00. Current sum: ${sum.toFixed(2)}`);
      return;
    }

    try {
      await api.put('/admin/matching-config', formData);
      alert('Recommendation configuration updated successfully!');
      fetchConfig();
    } catch (error: any) {
      console.error('Failed to update config', error);
      alert(error.response?.data?.error || 'Failed to update configuration.');
    }
  };

  if (isLoading) return <div className="text-center py-12 text-slate-400">Loading...</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">AI Recommendation Engine</h1>
          <p className="text-slate-400 text-sm mt-1">Configure weights and thresholds for internship matching</p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSave} className="space-y-6">
          
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
            <h3 className="font-bold text-slate-200 mb-4">Weight Distribution</h3>
            <p className="text-xs text-slate-400 mb-4">These weights determine how much each factor contributes to the final composite score. They must sum to exactly 1.00.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Skills Weight</label>
                <input required type="number" step="0.01" min="0" max="1" className="input-field w-full text-sm p-2 bg-slate-800 rounded text-slate-200" 
                  value={formData.skill_weight} onChange={e => setFormData({...formData, skill_weight: parseFloat(e.target.value)})} />
                <p className="text-xs text-slate-500 mt-1">Match between student skills and listing requirements.</p>
              </div>
              
              <div>
                <label className="block text-sm text-slate-300 mb-1">GPA Weight</label>
                <input required type="number" step="0.01" min="0" max="1" className="input-field w-full text-sm p-2 bg-slate-800 rounded text-slate-200" 
                  value={formData.gpa_weight} onChange={e => setFormData({...formData, gpa_weight: parseFloat(e.target.value)})} />
                <p className="text-xs text-slate-500 mt-1">Student GPA compared to required minimum GPA.</p>
              </div>
              
              <div>
                <label className="block text-sm text-slate-300 mb-1">Preferences Weight</label>
                <input required type="number" step="0.01" min="0" max="1" className="input-field w-full text-sm p-2 bg-slate-800 rounded text-slate-200" 
                  value={formData.preference_weight} onChange={e => setFormData({...formData, preference_weight: parseFloat(e.target.value)})} />
                <p className="text-xs text-slate-500 mt-1">Match between student department and preferred departments.</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
            <h3 className="font-bold text-slate-200 mb-4">Thresholds</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Minimum Score Threshold</label>
                <input required type="number" step="0.01" min="0" max="100" className="input-field w-full text-sm p-2 bg-slate-800 rounded text-slate-200" 
                  value={formData.min_score_threshold} onChange={e => setFormData({...formData, min_score_threshold: parseFloat(e.target.value)})} />
                <p className="text-xs text-slate-500 mt-1">Minimum composite score (0-100) required to be recommended.</p>
              </div>
              
              <div>
                <label className="block text-sm text-slate-300 mb-1">Max Recommendations per User</label>
                <input required type="number" min="1" max="50" className="input-field w-full text-sm p-2 bg-slate-800 rounded text-slate-200" 
                  value={formData.max_recommendations} onChange={e => setFormData({...formData, max_recommendations: parseInt(e.target.value)})} />
                <p className="text-xs text-slate-500 mt-1">Maximum number of listings to recommend per student.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <Button type="submit" variant="primary">Save Configuration</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default RecommendationConfig;
