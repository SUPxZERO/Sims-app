import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import CvViewer from '../../components/cv/CvViewer';
import api from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import myStudentsBg from '../../assets/my_students_bg.jpg';

export const MyStudents: React.FC = () => {
  const navigate = useNavigate();
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [selectedCv, setSelectedCv] = useState<any>(null);
  const [loadingCv, setLoadingCv] = useState(false);

  // Fetch internships assigned to this lecturer
  const { data, loading, error } = useFetch<any>('/internships', true);

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
        Error loading students: {error}
      </div>
    );
  }

  const internships = data?.internships || [];

  const handleViewCv = async (studentId: number) => {
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

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Students" 
        subtitle="View and evaluate the interns assigned to you."
        mediaType="image"
        mediaSrc={myStudentsBg}
      />

      <Card className="flex flex-col">
        <div className="flex-1">
          <Table
            data={internships}
            keyExtractor={(row) => row.internship_id}
            columns={[
              { 
                header: 'Student Name', 
                accessor: (row) => row.student_profile?.user?.full_name || row.student?.full_name || 'Unknown'
              },
              { 
                header: 'Company', 
                accessor: (row) => row.company_profile?.company_name || 'Unknown'
              },
              { 
                header: 'Role', 
                accessor: (row) => row.listing?.title || 'Intern'
              },
              { 
                header: 'End Date', 
                accessor: (row) => row.end_date ? new Date(row.end_date).toLocaleDateString() : 'N/A'
              },
              { 
                header: 'Evaluation Status', 
                accessor: (row) => {
                  const status = row.lecturer_grade?.status;
                  if (status === 'SUBMITTED') {
                    return <Badge variant="success">Completed</Badge>;
                  } else if (status === 'DRAFT') {
                    return <Badge variant="info">Draft</Badge>;
                  }
                  return <Badge variant="warning">Pending</Badge>;
                }
              },
              {
                header: 'Actions',
                accessor: (row) => (
                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleViewCv(row.student_profile?.user_id || row.student?.user_id)}
                      className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
                    >
                      View CV
                    </button>
                    <button 
                      onClick={() => navigate(`/lecturer/interns/${row.internship_id}/evaluate`)}
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                    >
                      Evaluate
                    </button>
                  </div>
                )
              }
            ]}
            emptyMessage="No students currently assigned to you."
          />
        </div>
      </Card>

      {/* CV Modal */}
      {selectedStudentId && (
        <Modal 
          isOpen={true} 
          onClose={closeCvModal} 
          title={`Student CV`}
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

export default MyStudents;
