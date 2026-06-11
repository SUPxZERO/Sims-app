import React, { useState, useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import CvViewer from '../../components/cv/CvViewer';
import Modal from '../../components/common/Modal';
import api from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import talentPoolVideo from '../../assets/talent_pool_video.mp4';

export const TalentPool: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [selectedCv, setSelectedCv] = useState<any>(null);
  const [loadingCv, setLoadingCv] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, loading, error } = useFetch<any>(
    `/cv/talent-pool${debouncedSearch ? `?search=${encodeURIComponent(debouncedSearch)}` : ''}`,
    true
  );

  const fetchStudentCv = async (studentId: number) => {
    try {
      setLoadingCv(true);
      setSelectedStudentId(studentId);
      const response = await api.get(`/cv/student/${studentId}`);
      setSelectedCv(response.data);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to fetch student CV.');
      setSelectedStudentId(null);
    } finally {
      setLoadingCv(false);
    }
  };

  const closeCvModal = () => {
    setSelectedStudentId(null);
    setSelectedCv(null);
  };

  if (loading && !data) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
        Error loading talent pool: {error}
      </div>
    );
  }

  const cvs = Array.isArray(data) ? data : (data?.data || []);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Talent Pool" 
        subtitle="Discover and recruit top talent with complete professional profiles."
        mediaType="video"
        mediaSrc={talentPoolVideo}
        heightClass="min-h-[250px]"
      />

      <Card>
        <div className="mb-6">
          <label htmlFor="search" className="block text-sm font-medium text-slate-400 mb-2">
            Search Talent (Name, Skills)
          </label>
          <input
            type="text"
            id="search"
            className="w-full md:w-1/2 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 text-slate-200"
            placeholder="e.g. John Doe, React, Python..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {cvs.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            No candidates found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cvs.map((cv: any) => (
              <div 
                key={cv.cv_id} 
                onClick={() => fetchStudentCv(cv.user_id)}
                className="bg-slate-900/50 rounded-lg border border-slate-800 p-5 hover:border-blue-500/50 hover:-translate-y-1 transition-all cursor-pointer shadow-lg hover:shadow-blue-900/20 flex flex-col h-full"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-slate-100 mb-1">
                    {cv.user?.full_name || 'Anonymous Student'}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {cv.user?.student_profile?.major || 'No Major Specified'}
                    {cv.user?.student_profile?.gpa ? ` | GPA: ${cv.user?.student_profile?.gpa}` : ''}
                  </p>
                </div>
                
                {cv.personal_summary && (
                  <p className="text-xs text-slate-500 mb-4 line-clamp-3 flex-grow">
                    {cv.personal_summary}
                  </p>
                )}

                {cv.skills && cv.skills.length > 0 && (
                  <div className="mt-auto pt-4 border-t border-slate-800 flex flex-wrap gap-1">
                    {cv.skills.slice(0, 4).map((skill: any) => (
                      <Badge key={skill.skill_id} variant="info" className="text-[10px] px-1.5 py-0.5">
                        {skill.skill_name}
                      </Badge>
                    ))}
                    {cv.skills.length > 4 && (
                      <Badge variant="info" className="text-[10px] px-1.5 py-0.5">
                        +{cv.skills.length - 4} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* CV Modal */}
      {selectedStudentId && (
        <Modal 
          isOpen={true} 
          onClose={closeCvModal} 
          title={`Candidate Profile: ${selectedCv?.user?.full_name || 'Loading...'}`}
          size="4xl"
        >
          {loadingCv ? (
            <div className="flex h-64 items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : selectedCv ? (
            <div className="max-h-[70vh] overflow-y-auto px-1 py-4">
               <CvViewer cvData={selectedCv} studentProfile={selectedCv.user?.student_profile} />
            </div>
          ) : (
            <div className="text-center text-red-400 py-10">Failed to load CV data.</div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default TalentPool;
