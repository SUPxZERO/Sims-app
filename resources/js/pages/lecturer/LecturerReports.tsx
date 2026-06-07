import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Table from '../../components/common/Table';
import Spinner from '../../components/common/Spinner';

export const LecturerReports: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/reports/lecturer');
      setReports(response.data.reports || []);
    } catch (error) {
      console.error('Error fetching lecturer reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredReports = reports.filter(report => {
    if (filter === 'ALL') return true;
    if (filter === 'PENDING') return report.status === 'SUBMITTED';
    if (filter === 'LATE') return report.is_late;
    return report.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">All Weekly Reports</h1>
          <p className="text-slate-400">Track and review reports from all your supervised students.</p>
        </div>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <button 
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === 'ALL' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              All Reports
            </button>
            <button 
              onClick={() => setFilter('PENDING')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === 'PENDING' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              Needs Review
            </button>
            <button 
              onClick={() => setFilter('APPROVED')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === 'APPROVED' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              Approved
            </button>
            <button 
              onClick={() => setFilter('LATE')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === 'LATE' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              Late Submissions
            </button>
          </div>
          <button onClick={fetchReports} className="text-slate-400 hover:text-white transition-colors p-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : (
          <Table
            data={filteredReports}
            keyExtractor={(row) => row.report_id}
            columns={[
              { 
                header: 'Student', 
                accessor: (row) => (
                  <div>
                    <div className="font-medium text-slate-200">{row.internship?.student_profile?.user?.full_name || 'Student'}</div>
                    <div className="text-xs text-slate-500">{row.internship?.company_profile?.company_name || 'Company'}</div>
                  </div>
                )
              },
              { header: 'Week', accessor: (row) => `Week ${row.week_number}` },
              { 
                header: 'Submitted', 
                accessor: (row) => row.submitted_at ? new Date(row.submitted_at).toLocaleDateString() : '-' 
              },
              { 
                header: 'Status', 
                accessor: (row) => {
                  const statusMap: any = {
                    DRAFT: 'primary',
                    SUBMITTED: 'warning',
                    APPROVED: 'success',
                    REVISION_REQUESTED: 'danger',
                  };
                  return (
                    <div className="flex flex-col gap-1 items-start">
                      <Badge variant={statusMap[row.status] || 'primary'}>{row.status.replace('_', ' ')}</Badge>
                      {row.is_late === 1 && <Badge variant="danger">Late</Badge>}
                    </div>
                  );
                }
              },
              { header: 'Hours', accessor: (row) => `${row.hours_logged || 0} hrs` },
              { 
                header: 'Action', 
                accessor: (row) => {
                  if (row.status === 'DRAFT') return <span className="text-slate-600 text-sm">Not Submitted</span>;
                  return (
                    <button 
                      onClick={() => navigate(`/lecturer/reports/${row.report_id}`)}
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                    >
                      {row.status === 'SUBMITTED' ? 'Review' : 'View'}
                    </button>
                  );
                }
              }
            ]}
            emptyMessage="No reports found matching the selected filter."
          />
        )}
      </Card>
    </div>
  );
};

export default LecturerReports;
