import React, { useState, useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import companyCoverVideo from '../../assets/company_cover_video.mp4';

export const CompanyProfile: React.FC = () => {
  const { data: profileData, loading, refetch } = useFetch<any>('/profile', true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    company_name: '',
    industry_sector: '',
    company_size: '',
    company_website: '',
    company_address: '',
    company_city: '',
    company_description: '',
    contact_person_name: '',
    contact_phone: ''
  });

  useEffect(() => {
    if (profileData && profileData.user) {
      const user = profileData.user;
      const profile = user.company_profile || {};
      
      setFormData({
        company_name: profile.company_name || '',
        industry_sector: profile.industry_sector || '',
        company_size: profile.company_size || '',
        company_website: profile.company_website || '',
        company_address: profile.company_address || '',
        company_city: profile.company_city || '',
        company_description: profile.company_description || '',
        contact_person_name: profile.contact_person_name || '',
        contact_phone: profile.contact_phone || ''
      });
    }
  }, [profileData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await api.put('/profile', formData);
      alert('Company Profile updated successfully!');
      refetch();
    } catch (err: any) {
      alert('Failed to update company profile: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsSaving(false);
    }
  };

  if (loading && !profileData) {
    return <div className="text-slate-400">Loading company profile...</div>;
  }

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Company Profile</h1>
        <p className="text-slate-400 mb-6">Manage your organization's details, visible to students when they view your listings.</p>
        
        {/* Cover Banner */}
        <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden mb-6 border border-slate-800 shadow-lg min-h-[300px]">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover object-center opacity-80">
            <source src={companyCoverVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-90"></div>
          <div className="absolute bottom-4 left-6 flex items-center gap-4">
            <div className="w-20 h-20 bg-slate-800 rounded-lg border-4 border-slate-950 flex items-center justify-center text-3xl font-bold text-indigo-400 shadow-xl">
              {formData.company_name ? formData.company_name.charAt(0) : 'C'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white shadow-sm">{formData.company_name || 'Your Company Name'}</h2>
              <p className="text-indigo-300 font-medium">{formData.industry_sector || 'Industry'}</p>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSave} className="space-y-6">
          <h2 className="text-lg font-semibold text-slate-200 border-b border-slate-700 pb-2">Organization Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Company Name" 
              name="company_name" 
              value={formData.company_name} 
              onChange={handleChange} 
              required 
            />
            
            <Input 
              label="Industry Sector" 
              name="industry_sector" 
              value={formData.industry_sector} 
              onChange={handleChange} 
              required 
              placeholder="e.g. Technology, Finance, Healthcare"
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Company Size</label>
              <select 
                name="company_size"
                value={formData.company_size}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="">Select Size...</option>
                <option value="STARTUP">Startup (1-50)</option>
                <option value="SMALL">Small (51-200)</option>
                <option value="MEDIUM">Medium (201-1000)</option>
                <option value="LARGE">Large (1001-5000)</option>
                <option value="ENTERPRISE">Enterprise (5000+)</option>
              </select>
            </div>

            <Input 
              label="Website" 
              name="company_website" 
              type="url"
              placeholder="https://www.example.com"
              value={formData.company_website} 
              onChange={handleChange} 
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Company Description</label>
            <textarea
              name="company_description"
              value={formData.company_description}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 h-32"
              placeholder="Describe your company's mission, culture, and what you do..."
            />
          </div>

          <h2 className="text-lg font-semibold text-slate-200 border-b border-slate-700 pb-2 mt-8">Location & Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="City" 
              name="company_city" 
              value={formData.company_city} 
              onChange={handleChange} 
              required 
            />
             <Input 
              label="Address" 
              name="company_address" 
              value={formData.company_address} 
              onChange={handleChange} 
              required 
            />
            <Input 
              label="Primary Contact Person" 
              name="contact_person_name" 
              placeholder="Full Name"
              value={formData.contact_person_name} 
              onChange={handleChange} 
            />
            <Input 
              label="Contact Phone" 
              name="contact_phone" 
              placeholder="+1 (555) 000-0000"
              value={formData.contact_phone} 
              onChange={handleChange} 
            />
          </div>

          <div className="pt-6 border-t border-slate-800 flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Company Profile'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CompanyProfile;
