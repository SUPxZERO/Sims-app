import React, { useState, useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export const JobPreferencesForm: React.FC = () => {
  const { data: prefData, loading, refetch } = useFetch<any>('/student/preferences', true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    preferred_locations: '',
    preferred_work_modes: '',
    preferred_industries: ''
  });

  useEffect(() => {
    if (prefData && prefData.preference) {
      const pref = prefData.preference;
      setFormData({
        preferred_locations: pref.preferred_locations ? pref.preferred_locations.join(', ') : '',
        preferred_work_modes: pref.preferred_work_modes ? pref.preferred_work_modes.join(', ') : '',
        preferred_industries: pref.preferred_industries ? pref.preferred_industries.join(', ') : ''
      });
    }
  }, [prefData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const payload = {
        preferred_locations: formData.preferred_locations.split(',').map(s => s.trim()).filter(s => s),
        preferred_work_modes: formData.preferred_work_modes.split(',').map(s => s.trim()).filter(s => s),
        preferred_industries: formData.preferred_industries.split(',').map(s => s.trim()).filter(s => s),
      };

      await api.put('/student/preferences', payload);
      alert('Preferences updated successfully!');
      refetch();
    } catch (err: any) {
      alert('Failed to update preferences: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsSaving(false);
    }
  };

  if (loading && !prefData) {
    return <div className="text-slate-400">Loading preferences...</div>;
  }

  return (
    <Card>
      <form onSubmit={handleSave} className="space-y-6">
        <h2 className="text-lg font-bold text-slate-100 mb-4">Job Match Preferences</h2>
        <p className="text-sm text-slate-400 mb-6">Enter comma-separated values to improve your internship recommendations.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="Preferred Locations" 
            name="preferred_locations" 
            placeholder="e.g. New York, Remote"
            value={formData.preferred_locations} 
            onChange={handleChange} 
          />
          <Input 
            label="Preferred Work Modes" 
            name="preferred_work_modes" 
            placeholder="e.g. Remote, Hybrid, On-site"
            value={formData.preferred_work_modes} 
            onChange={handleChange} 
          />
          <Input 
            label="Preferred Industries" 
            name="preferred_industries" 
            placeholder="e.g. Tech, Finance, Healthcare"
            value={formData.preferred_industries} 
            onChange={handleChange} 
          />
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default JobPreferencesForm;
