import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import PageHeader from '../../components/common/PageHeader';
import createListingBg from '../../assets/create_listing_bg.jpg';

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

  const [skills, setSkills] = useState<{ skill_id: number; skill_name: string; importance: string }[]>([]);
  const { data: categoriesData } = useFetch<any[]>('/skills', true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newSkillId, setNewSkillId] = useState('');
  const [importance, setImportance] = useState('REQUIRED');

  const handleAddSkill = () => {
    if (newSkillId && !skills.find(s => s.skill_id.toString() === newSkillId)) {
      const category = categoriesData?.find((c: any) => c.skill_category_id.toString() === selectedCategory);
      const skill = category?.skills.find((s: any) => s.skill_id.toString() === newSkillId);
      if (skill) {
        setSkills([...skills, { skill_id: skill.skill_id, skill_name: skill.skill_name, importance }]);
        setNewSkillId('');
      }
    }
  };

  const removeSkill = (id: number) => {
    setSkills(skills.filter(s => s.skill_id !== id));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/listings', {
        ...formData,
        skills: skills.map(s => ({ 
          skill_id: s.skill_id, 
          importance: s.importance,
          importance_weight: s.importance === 'REQUIRED' ? 1.0 : 0.5
        })),
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
      <PageHeader 
        title="Create Internship Listing" 
        subtitle="Post a new opportunity to attract top university talent."
        mediaType="image"
        mediaSrc={createListingBg}
      >
        <Button variant="secondary" onClick={() => navigate('/company/dashboard')}>
          Back to Dashboard
        </Button>
      </PageHeader>

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
              <label className="block text-sm font-medium text-slate-300 mb-1">General Requirements (Optional)</label>
              <textarea 
                className="input-field min-h-[100px]" 
                name="requirements"
                placeholder="Additional details not covered by specific skills..."
                value={formData.requirements}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="md:col-span-2 space-y-4">
              <label className="block text-sm font-medium text-slate-300 mb-1">Required Skills *</label>
              
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-xs text-slate-400 mb-1">Category</label>
                  <select 
                    className="input-field"
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setNewSkillId('');
                    }}
                  >
                    <option value="">Select Category</option>
                    {categoriesData?.map((cat: any) => (
                      <option key={cat.skill_category_id} value={cat.skill_category_id}>
                        {cat.category_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-slate-400 mb-1">Skill</label>
                  <select 
                    className="input-field"
                    value={newSkillId}
                    onChange={(e) => setNewSkillId(e.target.value)}
                    disabled={!selectedCategory}
                  >
                    <option value="">Select Skill</option>
                    {categoriesData?.find((c: any) => c.skill_category_id.toString() === selectedCategory)?.skills.map((skill: any) => (
                      <option key={skill.skill_id} value={skill.skill_id}>
                        {skill.skill_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-48">
                  <label className="block text-xs text-slate-400 mb-1">Importance</label>
                  <select 
                    className="input-field"
                    value={importance}
                    onChange={(e) => setImportance(e.target.value)}
                  >
                    <option value="REQUIRED">Required</option>
                    <option value="PREFERRED">Preferred</option>
                  </select>
                </div>
                <Button type="button" onClick={handleAddSkill} disabled={!newSkillId}>Add</Button>
              </div>

              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map(skill => (
                    <div key={skill.skill_id} className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-full text-sm">
                      <span className="text-slate-200">{skill.skill_name}</span>
                      <span className="text-xs text-blue-400">({skill.importance})</span>
                      <button type="button" onClick={() => removeSkill(skill.skill_id)} className="text-slate-400 hover:text-red-400 ml-1">
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
