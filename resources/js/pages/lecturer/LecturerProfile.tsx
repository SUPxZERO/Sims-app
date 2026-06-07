import React, { useState, useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export const LecturerProfile: React.FC = () => {
  const { data: profileData, loading, refetch } = useFetch<any>('/profile', true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    full_name: '',
    department: '',
    specialization: '',
    phone_number: '',
    office_location: '',
    max_supervision_load: ''
  });

  useEffect(() => {
    if (profileData && profileData.user) {
      const user = profileData.user;
      const profile = user.lecturer_profile || {};
      
      setFormData({
        full_name: user.full_name || '',
        department: profile.department || '',
        specialization: profile.specialization || '',
        phone_number: profile.phone_number || '',
        office_location: profile.office_location || '',
        max_supervision_load: profile.max_supervision_load?.toString() || ''
      });
    }
  }, [profileData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await api.put('/profile', {
        ...formData,
        max_supervision_load: formData.max_supervision_load ? parseInt(formData.max_supervision_load) : null
      });
      alert('Lecturer Profile updated successfully!');
      refetch();
    } catch (err: any) {
      alert('Failed to update lecturer profile: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsSaving(false);
    }
  };

  if (loading && !profileData) {
    return <div className="text-slate-400">Loading lecturer profile...</div>;
  }

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Lecturer Profile</h1>
        <p className="text-slate-400">Manage your academic profile and supervision capacity.</p>
      </div>

      <Card>
        <form onSubmit={handleSave} className="space-y-6">
          <h2 className="text-lg font-semibold text-slate-200 border-b border-slate-700 pb-2">Personal & Contact Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Full Name" 
              name="full_name" 
              value={formData.full_name} 
              onChange={handleChange} 
              required 
            />
            
            <Input 
              label="Phone Number" 
              name="phone_number" 
              placeholder="+1 (555) 000-0000"
              value={formData.phone_number} 
              onChange={handleChange} 
            />
          </div>

          <h2 className="text-lg font-semibold text-slate-200 border-b border-slate-700 pb-2 mt-8">Academic Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Department" 
              name="department" 
              value={formData.department} 
              onChange={handleChange} 
              required 
            />
             <Input 
              label="Office Location" 
              name="office_location" 
              placeholder="e.g. Building A, Room 302"
              value={formData.office_location} 
              onChange={handleChange} 
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Specialization / Research Interests</label>
            <textarea
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 h-24"
              placeholder="E.g. Artificial Intelligence, Software Engineering..."
            />
          </div>

          <h2 className="text-lg font-semibold text-slate-200 border-b border-slate-700 pb-2 mt-8">Supervision Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Max Supervision Load (Students)" 
              name="max_supervision_load" 
              type="number"
              min="1"
              max="50"
              value={formData.max_supervision_load} 
              onChange={handleChange} 
              required
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            This determines the maximum number of internship students you can supervise at any given time. This helps the system allocate students efficiently.
          </p>

          <div className="pt-6 border-t border-slate-800 flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Lecturer Profile'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default LecturerProfile;
