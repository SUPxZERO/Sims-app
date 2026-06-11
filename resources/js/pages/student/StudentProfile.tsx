import React, { useState, useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import JobPreferencesForm from './JobPreferencesForm';
import studentCoverReal from '../../assets/student_cover_real.jpg';

export const StudentProfile: React.FC = () => {
  const { data: profileData, loading, refetch } = useFetch<any>('/profile', true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    full_name: '',
    department: '',
    expected_graduation: '',
    gpa: '',
    phone_number: '',
    address: '',
    linkedin_url: '',
    bio: ''
  });

  useEffect(() => {
    if (profileData && profileData.user) {
      const user = profileData.user;
      const profile = user.student_profile || {};
      
      setFormData({
        full_name: user.full_name || '',
        department: profile.department || '',
        expected_graduation: profile.expected_graduation?.toString() || '',
        gpa: profile.gpa?.toString() || '',
        phone_number: profile.phone_number || '',
        address: profile.address || '',
        linkedin_url: profile.linkedin_url || '',
        bio: profile.bio || ''
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
        expected_graduation: formData.expected_graduation ? parseInt(formData.expected_graduation) : null,
        gpa: formData.gpa ? parseFloat(formData.gpa) : null
      });
      alert('Profile updated successfully!');
      refetch();
    } catch (err: any) {
      alert('Failed to update profile: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsSaving(false);
    }
  };

  if (loading && !profileData) {
    return <div className="text-slate-400">Loading profile...</div>;
  }

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">My Profile</h1>
        <p className="text-slate-400">Manage your personal and academic information.</p>
      </div>

      {/* Cover Banner */}
      <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden mb-6 border border-slate-800 shadow-lg min-h-[300px]">
        <img src={studentCoverReal} alt="Profile Cover" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-90"></div>
        <div className="absolute bottom-4 left-6 flex items-center gap-4">
          <div className="w-20 h-20 bg-slate-800 rounded-full border-4 border-slate-950 flex items-center justify-center text-3xl font-bold text-blue-400 shadow-xl">
            {formData.full_name ? formData.full_name.charAt(0) : 'S'}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white shadow-sm">{formData.full_name || 'Student Name'}</h2>
            <p className="text-blue-300 font-medium">{formData.department || 'Department'}</p>
          </div>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Full Name" 
              name="full_name" 
              value={formData.full_name} 
              onChange={handleChange} 
              required 
            />
            
            <Input 
              label="Department" 
              name="department" 
              value={formData.department} 
              onChange={handleChange} 
              required 
            />

            <Input 
              label="Phone Number" 
              name="phone_number" 
              value={formData.phone_number} 
              onChange={handleChange} 
            />

            <Input 
              label="Expected Graduation Year" 
              name="expected_graduation" 
              type="number"
              placeholder="e.g. 2026"
              value={formData.expected_graduation} 
              onChange={handleChange} 
            />

            <Input 
              label="Current GPA" 
              name="gpa" 
              type="number"
              step="0.01"
              min="0"
              max="4"
              placeholder="e.g. 3.50"
              value={formData.gpa} 
              onChange={handleChange} 
            />

            <Input 
              label="LinkedIn URL" 
              name="linkedin_url" 
              type="url"
              placeholder="https://linkedin.com/in/..."
              value={formData.linkedin_url} 
              onChange={handleChange} 
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 h-20"
              placeholder="Your full address..."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 h-32"
              placeholder="Tell us a bit more about yourself..."
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </Card>

      <JobPreferencesForm />
    </div>
  );
};

export default StudentProfile;
