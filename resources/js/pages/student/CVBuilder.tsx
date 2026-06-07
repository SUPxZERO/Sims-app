import React, { useState, useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export const CVBuilder: React.FC = () => {
  const [personalSummary, setPersonalSummary] = useState('');
  const [skills, setSkills] = useState<{ name: string; proficiency: string }[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [proficiency, setProficiency] = useState('BEGINNER');

  const [educations, setEducations] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);

  // Education form state
  const [eduForm, setEduForm] = useState({ institution_name: '', degree: '', field_of_study: '', start_date: '', end_date: '', description: '' });
  
  // Experience form state
  const [expForm, setExpForm] = useState({ company_name: '', position_title: '', start_date: '', end_date: '', description: '' });

  const { data, loading, refetch } = useFetch<any>('/cv', true);

  useEffect(() => {
    if (data) {
      setPersonalSummary(data.personal_summary || '');
      
      if (data.skills) {
        setSkills(data.skills.map((s: any) => ({
          name: s.skill_name,
          proficiency: s.pivot.proficiency_level
        })));
      }

      if (data.educations) {
        setEducations(data.educations);
      }

      if (data.experiences) {
        setExperiences(data.experiences);
      }
    }
  }, [data]);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.find(s => s.name.toLowerCase() === newSkill.toLowerCase())) {
      setSkills([...skills, { name: newSkill.trim(), proficiency }]);
      setNewSkill('');
    }
  };

  const removeSkill = (name: string) => {
    setSkills(skills.filter(s => s.name !== name));
  };

  const handleSaveProfile = async () => {
    try {
      // Save Personal Summary
      await api.post('/cv/personal-summary', { personal_summary: personalSummary });
      
      // Save Skills
      await api.post('/cv/skills', { 
        skills: skills.map(s => ({ name: s.name, proficiency_level: s.proficiency }))
      });
      
      alert('Profile saved successfully!');
      refetch();
    } catch (err: any) {
      alert('Failed to save profile: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleAddEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/cv/educations', eduForm);
      setEduForm({ institution_name: '', degree: '', field_of_study: '', start_date: '', end_date: '', description: '' });
      refetch();
    } catch (err: any) {
      alert('Failed to add education: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteEducation = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this education entry?')) return;
    try {
      await api.delete(`/cv/educations/${id}`);
      refetch();
    } catch (err: any) {
      alert('Failed to delete education: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleAddExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/cv/experiences', expForm);
      setExpForm({ company_name: '', position_title: '', start_date: '', end_date: '', description: '' });
      refetch();
    } catch (err: any) {
      alert('Failed to add experience: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteExperience = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this experience entry?')) return;
    try {
      await api.delete(`/cv/experiences/${id}`);
      refetch();
    } catch (err: any) {
      alert('Failed to delete experience: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">CV Builder</h1>
        <p className="text-slate-400">Manage your skills and profile to improve match recommendations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          {/* About Me */}
          <Card>
            <h2 className="text-lg font-outfit font-semibold text-slate-100 mb-4">About Me</h2>
            <textarea
              value={personalSummary}
              onChange={(e) => setPersonalSummary(e.target.value)}
              placeholder="Write a brief professional summary..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 h-24 resize-y"
            />
          </Card>

          {/* Experience */}
          <Card>
            <h2 className="text-lg font-outfit font-semibold text-slate-100 mb-4">Experience</h2>
            
            {experiences.length > 0 && (
              <div className="space-y-4 mb-6">
                {experiences.map((exp: any) => (
                  <div key={exp.cv_experience_id} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 relative group">
                    <button 
                      onClick={() => handleDeleteExperience(exp.cv_experience_id)}
                      className="absolute top-4 right-4 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      &times; Delete
                    </button>
                    <h3 className="font-bold text-slate-200">{exp.position_title}</h3>
                    <p className="text-slate-400 text-sm">{exp.company_name}</p>
                    <p className="text-slate-500 text-xs mt-1">
                      {exp.start_date} - {exp.end_date || 'Present'}
                    </p>
                    {exp.description && <p className="text-slate-300 text-sm mt-3">{exp.description}</p>}
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-slate-800 pt-6 mt-6">
              <h3 className="text-sm font-semibold text-slate-300 mb-4">Add New Experience</h3>
              <form onSubmit={handleAddExperience} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Company Name" required value={expForm.company_name} onChange={e => setExpForm({...expForm, company_name: e.target.value})} />
                  <Input label="Position Title" required value={expForm.position_title} onChange={e => setExpForm({...expForm, position_title: e.target.value})} />
                  <Input type="date" label="Start Date" required value={expForm.start_date} onChange={e => setExpForm({...expForm, start_date: e.target.value})} />
                  <Input type="date" label="End Date" value={expForm.end_date} onChange={e => setExpForm({...expForm, end_date: e.target.value})} />
                </div>
                <textarea
                  placeholder="Describe your responsibilities and achievements..."
                  value={expForm.description}
                  onChange={e => setExpForm({...expForm, description: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 h-20"
                />
                <Button type="submit" variant="secondary" className="w-full">Add Experience</Button>
              </form>
            </div>
          </Card>

          {/* Education */}
          <Card>
            <h2 className="text-lg font-outfit font-semibold text-slate-100 mb-4">Education</h2>
            
            {educations.length > 0 && (
              <div className="space-y-4 mb-6">
                {educations.map((edu: any) => (
                  <div key={edu.cv_education_id} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 relative group">
                    <button 
                      onClick={() => handleDeleteEducation(edu.cv_education_id)}
                      className="absolute top-4 right-4 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      &times; Delete
                    </button>
                    <h3 className="font-bold text-slate-200">{edu.degree} in {edu.field_of_study}</h3>
                    <p className="text-slate-400 text-sm">{edu.institution_name}</p>
                    <p className="text-slate-500 text-xs mt-1">
                      {edu.start_date} - {edu.end_date || 'Present'}
                    </p>
                    {edu.description && <p className="text-slate-300 text-sm mt-3">{edu.description}</p>}
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-slate-800 pt-6 mt-6">
              <h3 className="text-sm font-semibold text-slate-300 mb-4">Add New Education</h3>
              <form onSubmit={handleAddEducation} className="space-y-4">
                <Input label="Institution Name" required value={eduForm.institution_name} onChange={e => setEduForm({...eduForm, institution_name: e.target.value})} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Degree (e.g. BS, MS)" required value={eduForm.degree} onChange={e => setEduForm({...eduForm, degree: e.target.value})} />
                  <Input label="Field of Study" required value={eduForm.field_of_study} onChange={e => setEduForm({...eduForm, field_of_study: e.target.value})} />
                  <Input type="date" label="Start Date" required value={eduForm.start_date} onChange={e => setEduForm({...eduForm, start_date: e.target.value})} />
                  <Input type="date" label="End Date" value={eduForm.end_date} onChange={e => setEduForm({...eduForm, end_date: e.target.value})} />
                </div>
                <textarea
                  placeholder="Additional details (optional)..."
                  value={eduForm.description}
                  onChange={e => setEduForm({...eduForm, description: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 h-16"
                />
                <Button type="submit" variant="secondary" className="w-full">Add Education</Button>
              </form>
            </div>
          </Card>

          {/* Skills */}
          <Card>
            <h2 className="text-lg font-outfit font-semibold text-slate-100 mb-4">Skills</h2>
            <form onSubmit={handleAddSkill} className="flex gap-4 items-end">
              <div className="flex-1">
                <Input
                  label="Skill Name"
                  placeholder="e.g. React, Python, Data Analysis"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                />
              </div>
              <div className="w-48">
                <label className="block text-sm font-medium text-slate-300 mb-1">Proficiency</label>
                <select 
                  className="input-field"
                  value={proficiency}
                  onChange={(e) => setProficiency(e.target.value)}
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>
              <Button type="submit" disabled={!newSkill.trim()}>Add</Button>
            </form>

            <div className="mt-6 flex flex-wrap gap-2">
              {skills.map(skill => (
                <div key={skill.name} className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-full text-sm">
                  <span className="text-slate-200">{skill.name}</span>
                  <span className="text-xs text-blue-400">({skill.proficiency.charAt(0)})</span>
                  <button onClick={() => removeSkill(skill.name)} className="text-slate-400 hover:text-red-400 ml-1">
                    &times;
                  </button>
                </div>
              ))}
              {skills.length === 0 && (
                <p className="text-slate-500 text-sm">No skills added yet. Add at least 3 skills to complete your profile.</p>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-outfit font-semibold text-slate-100 mb-4">Profile Completion</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Overall</span>
                  <span className="text-slate-200">
                    {Math.min(100, Math.floor((skills.length / 3) * 100))}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (skills.length / 3) * 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <ul className="text-sm space-y-2 text-slate-400">
                <li className="flex items-center gap-2">
                  <span className={personalSummary ? "text-green-500" : "text-slate-600"}>
                    {personalSummary ? "✓" : "○"}
                  </span> About Me Summary
                </li>
                <li className="flex items-center gap-2">
                  <span className={educations.length > 0 ? "text-green-500" : "text-slate-600"}>
                    {educations.length > 0 ? "✓" : "○"}
                  </span> Education Added
                </li>
                <li className="flex items-center gap-2">
                  <span className={skills.length >= 3 ? "text-green-500" : "text-slate-600"}>
                    {skills.length >= 3 ? "✓" : "○"}
                  </span> 
                  Minimum 3 Skills (Current: {skills.length})
                </li>
              </ul>

              <Button className="w-full mt-4" disabled={loading} onClick={handleSaveProfile}>
                Save Profile Changes
              </Button>
              <p className="text-xs text-slate-500 text-center mt-2">
                Note: Education and Experience entries are saved immediately when added.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CVBuilder;
