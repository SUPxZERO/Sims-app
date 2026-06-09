import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export const ManageSkills: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Category State
  const [newCat, setNewCat] = useState({ category_name: '', description: '', sort_order: 0, is_active: true });

  // New Skill State
  const [newSkill, setNewSkill] = useState({ skill_category_id: '', skill_name: '', description: '', is_active: true });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/skills'); // Using the public/admin endpoint to fetch all
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch skills', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/skill-categories', newCat);
      setNewCat({ category_name: '', description: '', sort_order: 0, is_active: true });
      fetchData();
    } catch (error) {
      console.error('Failed to add category', error);
      alert('Error adding skill category');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Delete category? This will delete all skills inside it!')) return;
    try {
      await api.delete(`/admin/skill-categories/${id}`);
      fetchData();
    } catch (error) {
      console.error('Failed to delete category', error);
      alert('Error deleting skill category');
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/skills', newSkill);
      setNewSkill({ skill_category_id: '', skill_name: '', description: '', is_active: true });
      fetchData();
    } catch (error) {
      console.error('Failed to add skill', error);
      alert('Error adding skill');
    }
  };

  const handleDeleteSkill = async (id: number) => {
    if (!confirm('Delete skill?')) return;
    try {
      await api.delete(`/admin/skills/${id}`);
      fetchData();
    } catch (error) {
      console.error('Failed to delete skill', error);
      alert('Error deleting skill');
    }
  };

  if (isLoading) return <div className="text-center py-12 text-slate-400">Loading skills...</div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Manage Skills</h1>
        <p className="text-slate-400 text-sm mt-1">Manage skill categories and individual skills.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          {/* Add Category */}
          <Card>
            <h3 className="font-bold text-slate-200 mb-4">Add Category</h3>
            <form onSubmit={handleAddCategory} className="space-y-3">
              <input required placeholder="Category Name" className="input-field w-full text-sm p-2 bg-slate-800 rounded text-slate-200" 
                value={newCat.category_name} onChange={e => setNewCat({...newCat, category_name: e.target.value})} />
              <input placeholder="Description" className="input-field w-full text-sm p-2 bg-slate-800 rounded text-slate-200" 
                value={newCat.description} onChange={e => setNewCat({...newCat, description: e.target.value})} />
              <input required type="number" placeholder="Sort Order" className="input-field w-full text-sm p-2 bg-slate-800 rounded text-slate-200" 
                value={newCat.sort_order === 0 ?"" : newCat.sort_order ?? ""} onChange={e => setNewCat({...newCat, sort_order: parseInt(e.target.value)})} />
              <Button type="submit" variant="primary" className="w-full">Add Category</Button>
            </form>
          </Card>

          {/* Add Skill */}
          <Card>
            <h3 className="font-bold text-slate-200 mb-4">Add Skill</h3>
            <form onSubmit={handleAddSkill} className="space-y-3">
              <select required className="input-field w-full text-sm p-2 bg-slate-800 rounded text-slate-200" 
                value={newSkill.skill_category_id} onChange={e => setNewSkill({...newSkill, skill_category_id: e.target.value})}>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.skill_category_id} value={c.skill_category_id}>{c.category_name}</option>)}
              </select>
              <input required placeholder="Skill Name" className="input-field w-full text-sm p-2 bg-slate-800 rounded text-slate-200" 
                value={newSkill.skill_name} onChange={e => setNewSkill({...newSkill, skill_name: e.target.value})} />
              <input placeholder="Description" className="input-field w-full text-sm p-2 bg-slate-800 rounded text-slate-200" 
                value={newSkill.description} onChange={e => setNewSkill({...newSkill, description: e.target.value})} />
              <Button type="submit" variant="primary" className="w-full">Add Skill</Button>
            </form>
          </Card>
        </div>

        {/* List */}
        <div className="lg:col-span-2 space-y-4">
          {categories.map(cat => (
            <Card key={cat.skill_category_id}>
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800">
                <h3 className="font-bold text-lg text-slate-200">{cat.category_name}</h3>
                <button onClick={() => handleDeleteCategory(cat.skill_category_id)} className="text-red-400 hover:text-red-300 text-sm">Delete Category</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.skills && cat.skills.map((skill: any) => (
                  <div key={skill.skill_id} className="bg-slate-800/50 border border-slate-700 px-3 py-1.5 rounded-full flex items-center gap-2">
                    <span className="text-sm text-slate-300">{skill.skill_name}</span>
                    <button onClick={() => handleDeleteSkill(skill.skill_id)} className="text-red-400/50 hover:text-red-400 p-0.5 rounded-full">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                  </div>
                ))}
                {(!cat.skills || cat.skills.length === 0) && <span className="text-sm text-slate-500">No skills in this category.</span>}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageSkills;
