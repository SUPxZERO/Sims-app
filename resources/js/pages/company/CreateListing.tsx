import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export const CreateListing: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    work_mode: 'ONSITE',
    duration_weeks: 12,
    quota: 1,
    stipend_info: '',
    application_deadline: '',
    min_gpa: '',
    preferred_departments: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/listings', {
        ...formData,
        duration_weeks: parseInt(formData.duration_weeks as unknown as string, 10),
        quota: parseInt(formData.quota as unknown as string, 10),
        min_gpa: formData.min_gpa ? parseFloat(formData.min_gpa) : null
      });
      alert('Listing created successfully and is pending approval!');
      navigate('/company/dashboard');
    } catch (err: any) {
      alert('Failed to create listing: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/company/dashboard')}
          className="p-2 bg-slate-800 text-slate-300 hover:text-white rounded-full transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Create Internship Listing</h1>
          <p className="text-slate-400">Post a new opportunity to attract top university talent.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input 
                label="Job Title *"
                name="title"
                placeholder="e.g. Software Engineering Intern"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">Job Description *</label>
              <textarea 
                className="input-field min-h-[120px]" 
                name="description"
                placeholder="Describe the role, responsibilities, and learning opportunities..."
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">Requirements & Skills *</label>
              <textarea 
                className="input-field min-h-[100px]" 
                name="requirements"
                placeholder="List required technical skills, soft skills, or prior knowledge..."
                value={formData.requirements}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <Input 
              label="Location"
              name="location"
              placeholder="e.g. New York, NY"
              value={formData.location}
              onChange={handleChange}
            />

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Work Mode *</label>
              <select 
                className="input-field"
                name="work_mode"
                value={formData.work_mode}
                onChange={handleChange}
                required
              >
                <option value="ONSITE">On-Site</option>
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>

            <Input 
              label="Duration (Weeks) *"
              type="number"
              name="duration_weeks"
              min="4"
              max="52"
              value={formData.duration_weeks}
              onChange={handleChange}
              required
            />

            <Input 
              label="Quota (Number of Interns) *"
              type="number"
              name="quota"
              min="1"
              value={formData.quota}
              onChange={handleChange}
              required
            />

            <Input 
              label="Stipend Info (Optional)"
              name="stipend_info"
              placeholder="e.g. $20/hr, Unpaid, Monthly Allowance"
              value={formData.stipend_info}
              onChange={handleChange}
            />

            <Input 
              label="Application Deadline *"
              type="date"
              name="application_deadline"
              value={formData.application_deadline}
              onChange={handleChange}
              required
            />
          </div>

          <div className="pt-6 border-t border-slate-800">
            <h3 className="text-lg font-outfit font-medium text-slate-200 mb-4">Recommendation Engine Filters</h3>
            <p className="text-sm text-slate-400 mb-4">
              Set these parameters to help our algorithm match the best students to your listing.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Minimum GPA Requirement"
                type="number"
                step="0.01"
                min="0"
                max="4"
                name="min_gpa"
                placeholder="e.g. 3.00"
                value={formData.min_gpa}
                onChange={handleChange}
              />

              <Input 
                label="Preferred Departments"
                name="preferred_departments"
                placeholder="e.g. Computer Science, Information Systems"
                value={formData.preferred_departments}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 mt-6 border-t border-slate-800">
            <Button type="button" variant="secondary" onClick={() => navigate('/company/dashboard')}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Submit for Approval
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default CreateListing;
