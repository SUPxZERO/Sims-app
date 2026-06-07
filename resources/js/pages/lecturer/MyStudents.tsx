import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import Table from '../../components/common/Table';

export const MyStudents: React.FC = () => {
  const navigate = useNavigate();
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">My Students</h1>
          <p className="text-slate-400">View and evaluate the interns assigned to you.</p>
        </div>
      </div>

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
                  const hasLecturerEvaluation = row.evaluations?.some((e: any) => e.evaluator_type === 'LECTURER' && e.status === 'SUBMITTED');
                  return hasLecturerEvaluation ? (
                    <Badge variant="success">Completed</Badge>
                  ) : (
                    <Badge variant="warning">Pending</Badge>
                  );
                }
              },
              {
                header: 'Actions',
                accessor: (row) => (
                  <button 
                    onClick={() => navigate(`/lecturer/interns/${row.internship_id}/evaluate`)}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                  >
                    Evaluate
                  </button>
                )
              }
            ]}
            emptyMessage="No students currently assigned to you."
          />
        </div>
      </Card>
    </div>
  );
};

export default MyStudents;
