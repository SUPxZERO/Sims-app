import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import { useFetch } from '../../hooks/useFetch';
import api from '../../services/api';

export const FindJobs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [workMode, setWorkMode] = useState('ALL');
  const [applying, setApplying] = useState<number | null>(null);
  
  const { data, loading, error } = useFetch<any>('/listings', true);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
        Error loading listings: {error}
      </div>
    );
  }

  const jobs = data?.listings || [];

  const filteredJobs = jobs.filter((job: any) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (job.company_profile?.company_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMode = workMode === 'ALL' || job.work_mode === workMode;
    
    return matchesSearch && matchesMode;
  });

  const handleApply = async (listingId: number) => {
    try {
      setApplying(listingId);
      await api.post(`/listings/${listingId}/apply`);
      alert('Application submitted successfully!');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to apply. You may have already applied.');
    } finally {
      setApplying(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Find Internships</h1>
          <p className="text-slate-400">Discover and apply to new opportunities.</p>
        </div>
      </div>

      <Card className="!p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input 
              placeholder="Search by role or company..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <select 
              className="w-full bg-slate-900/50 border border-slate-700/50 text-slate-200 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-500"
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
            >
              <option value="ALL">All Work Modes</option>
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
              <option value="ONSITE">On-Site</option>
            </select>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job: any) => {
          const match = 85; // Placeholder for recommendation score
          return (
            <Card key={job.listing_id} className="flex flex-col hover:border-blue-500/50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-100">{job.title}</h3>
                  <p className="text-slate-400">{job.company_profile?.company_name || 'Company'}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-slate-400 mb-1">Match</span>
                  <div className="relative w-10 h-10 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-700"
                        strokeWidth="3"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className={match >= 80 ? "text-emerald-400" : match >= 60 ? "text-yellow-400" : "text-red-400"}
                        strokeWidth="3"
                        strokeDasharray={`${match}, 100`}
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute text-[10px] font-bold text-slate-200">{match}%</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mb-6">
                <Badge variant="primary">{job.work_mode}</Badge>
                <Badge variant="info">{job.location}</Badge>
              </div>
              
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-800/50">
                <span className="text-sm text-slate-400">
                  Deadline: {new Date(job.application_deadline).toLocaleDateString()}
                </span>
                <Button 
                  size="sm" 
                  onClick={() => handleApply(job.listing_id)}
                  disabled={applying === job.listing_id}
                >
                  {applying === job.listing_id ? 'Applying...' : 'Apply Now'}
                </Button>
              </div>
            </Card>
          );
        })}
        
        {filteredJobs.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            No internships found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default FindJobs;
