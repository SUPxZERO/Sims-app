import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export const ManageGrading: React.FC = () => {
  const [scales, setScales] = useState<any[]>([]);
  const [criteria, setCriteria] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Scale form state
  const [newScale, setNewScale] = useState({
    letter_grade: '', min_score: 0, max_score: 0, grade_point: 0, sort_order: 0
  });

  // New Criteria form state
  const [newCriteria, setNewCriteria] = useState({
    criteria_name: '', description: '', weight: 0.0, sort_order: 0, is_active: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [scalesRes, criteriaRes] = await Promise.all([
        api.get('/admin/grading-scales'),
        api.get('/admin/evaluation-criteria')
      ]);
      setScales(scalesRes.data.scales || []);
      setCriteria(criteriaRes.data.criteria || []);
    } catch (error) {
      console.error('Failed to fetch grading data', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddScale = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/grading-scales', newScale);
      setNewScale({ letter_grade: '', min_score: 0, max_score: 0, grade_point: 0, sort_order: 0 });
      fetchData();
    } catch (error) {
      console.error('Failed to add grading scale', error);
      alert('Failed to add grading scale');
    }
  };

  const handleDeleteScale = async (id: number) => {
    if (!confirm('Are you sure you want to delete this grading scale?')) return;
    try {
      await api.delete(`/admin/grading-scales/${id}`);
      fetchData();
    } catch (error) {
      console.error('Failed to delete grading scale', error);
      alert('Failed to delete grading scale');
    }
  };

  const handleAddCriteria = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/evaluation-criteria', newCriteria);
      setNewCriteria({ criteria_name: '', description: '', weight: 0.0, sort_order: 0, is_active: true });
      fetchData();
    } catch (error) {
      console.error('Failed to add criteria', error);
      alert('Failed to add criteria');
    }
  };

  const handleDeleteCriteria = async (id: number) => {
    if (!confirm('Are you sure you want to delete this criteria?')) return;
    try {
      await api.delete(`/admin/evaluation-criteria/${id}`);
      fetchData();
    } catch (error) {
      console.error('Failed to delete criteria', error);
      alert('Failed to delete criteria');
    }
  };

  if (isLoading) return <div className="text-center py-12 text-slate-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Manage Grading & Criteria</h1>
          <p className="text-slate-400 text-sm mt-1">Configure grading scales and evaluation criteria weights</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grading Scales */}
        <Card>
          <h3 className="text-lg font-bold text-slate-200 mb-4">Grading Scales</h3>
          
          <form onSubmit={handleAddScale} className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 mb-6 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Letter Grade</label>
                <input required type="text" className="input-field w-full text-sm p-2 bg-slate-800 rounded text-slate-200" 
                  value={newScale.letter_grade} onChange={e => setNewScale({...newScale, letter_grade: e.target.value})} placeholder="e.g. A+" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Min Score</label>
                <input required type="number" step="0.01" className="input-field w-full text-sm p-2 bg-slate-800 rounded text-slate-200" 
                  value={newScale.min_score} onChange={e => setNewScale({...newScale, min_score: parseFloat(e.target.value)})} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Max Score</label>
                <input required type="number" step="0.01" className="input-field w-full text-sm p-2 bg-slate-800 rounded text-slate-200" 
                  value={newScale.max_score} onChange={e => setNewScale({...newScale, max_score: parseFloat(e.target.value)})} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Grade Point</label>
                <input type="number" step="0.01" className="input-field w-full text-sm p-2 bg-slate-800 rounded text-slate-200" 
                  value={newScale.grade_point} onChange={e => setNewScale({...newScale, grade_point: parseFloat(e.target.value)})} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Sort Order</label>
                <input required type="number" className="input-field w-full text-sm p-2 bg-slate-800 rounded text-slate-200" 
                  value={newScale.sort_order} onChange={e => setNewScale({...newScale, sort_order: parseInt(e.target.value)})} />
              </div>
            </div>
            <Button type="submit" variant="primary" size="sm">Add Scale</Button>
          </form>

          <div className="space-y-2">
            {scales.map(scale => (
              <div key={scale.grade_scale_id} className="flex items-center justify-between bg-slate-800/30 p-3 rounded-lg border border-slate-700">
                <div>
                  <span className="font-bold text-slate-200">{scale.letter_grade}</span>
                  <span className="text-sm text-slate-400 ml-3">Score: {scale.min_score} - {scale.max_score}</span>
                  <span className="text-sm text-slate-400 ml-3">Point: {scale.grade_point}</span>
                </div>
                <button onClick={() => handleDeleteScale(scale.grade_scale_id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
              </div>
            ))}
            {scales.length === 0 && <p className="text-sm text-slate-500">No grading scales configured.</p>}
          </div>
        </Card>

        {/* Evaluation Criteria */}
        <Card>
          <h3 className="text-lg font-bold text-slate-200 mb-4">Evaluation Criteria</h3>
          
          <form onSubmit={handleAddCriteria} className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 mb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Criteria Name</label>
                <input required type="text" className="input-field w-full text-sm p-2 bg-slate-800 rounded text-slate-200" 
                  value={newCriteria.criteria_name} onChange={e => setNewCriteria({...newCriteria, criteria_name: e.target.value})} placeholder="e.g. Technical Skills" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Description</label>
                <input type="text" className="input-field w-full text-sm p-2 bg-slate-800 rounded text-slate-200" 
                  value={newCriteria.description} onChange={e => setNewCriteria({...newCriteria, description: e.target.value})} placeholder="Optional description" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Weight (0.0 - 1.0)</label>
                <input required type="number" step="0.01" min="0" max="1" className="input-field w-full text-sm p-2 bg-slate-800 rounded text-slate-200" 
                  value={newCriteria.weight} onChange={e => setNewCriteria({...newCriteria, weight: parseFloat(e.target.value)})} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Sort Order</label>
                <input required type="number" className="input-field w-full text-sm p-2 bg-slate-800 rounded text-slate-200" 
                  value={newCriteria.sort_order} onChange={e => setNewCriteria({...newCriteria, sort_order: parseInt(e.target.value)})} />
              </div>
            </div>
            <Button type="submit" variant="primary" size="sm">Add Criteria</Button>
          </form>

          <div className="space-y-2">
            {criteria.map(crit => (
              <div key={crit.criteria_id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-800/30 p-3 rounded-lg border border-slate-700 gap-3">
                <div>
                  <div className="font-medium text-slate-200">{crit.criteria_name} <span className="text-xs ml-2 text-indigo-400 font-bold bg-indigo-400/10 px-2 py-0.5 rounded">Weight: {crit.weight}</span></div>
                  {crit.description && <p className="text-xs text-slate-400 mt-1">{crit.description}</p>}
                </div>
                <button onClick={() => handleDeleteCriteria(crit.criteria_id)} className="text-red-400 hover:text-red-300 text-sm whitespace-nowrap">Delete</button>
              </div>
            ))}
            {criteria.length === 0 && <p className="text-sm text-slate-500">No evaluation criteria configured.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ManageGrading;
