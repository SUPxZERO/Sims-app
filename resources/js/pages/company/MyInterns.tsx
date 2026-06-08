import React from 'react';
import { useFetch } from '../../hooks/useFetch';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import Table from '../../components/common/Table';
import { useNavigate } from 'react-router-dom';

export const MyInterns: React.FC = () => {
  const navigate = useNavigate();
  const { data, loading, error } = useFetch<any>('/internships', true);

  if (loading) return <div className="flex justify-center p-8"><Spinner size="lg" /></div>;
  if (error) return <div className="text-red-400 p-4 bg-red-500/10 rounded-lg">{error}</div>;

  const internships = data?.internships || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">My Interns</h1>
        <p className="text-slate-400">View and evaluate your assigned interns.</p>
      </div>

      <Card>
        <Table
          data={internships}
          keyExtractor={(row) => row.internship_id}
          columns={[
            { 
              header: 'Student', 
              accessor: (row) => {
                const user = row.student_profile?.user || row.studentProfile?.user;
                return user ? user.full_name : 'Unknown Student';
              }
            },
            { header: 'Position', accessor: (row) => row.listing?.title || 'Intern' },
            { 
              header: 'Start Date', 
              accessor: (row) => new Date(row.start_date).toLocaleDateString()
            },
            { 
              header: 'End Date', 
              accessor: (row) => new Date(row.end_date).toLocaleDateString()
            },
            { 
              header: 'Status', 
              accessor: (row) => <Badge variant={row.status === 'COMPLETED' ? 'success' : 'primary'}>{row.status}</Badge>
            },
            { 
              header: 'Action', 
              accessor: (row) => {
                if (row.status !== 'COMPLETED') {
                  return <span className="text-slate-500 text-xs italic">Awaiting Completion</span>;
                }
                return (
                  <button 
                    onClick={() => navigate(`/company/interns/${row.internship_id}/evaluate`)}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                  >
                    {row.company_evaluation ? 'View' : 'Evaluate'}
                  </button>
                );
              }
            }
          ]}
          emptyMessage="No interns assigned yet."
        />
      </Card>
    </div>
  );
};

export default MyInterns;
