import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import Table from '../../components/common/Table';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import lecturerDashVideo from '../../assets/lecturer_dash_video.mp4';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const LecturerDashboard: React.FC = () => {
  const navigate = useNavigate();
  // Using true to autoFetch on mount. Assuming backend role handles data filtering.
  const { data, loading, error } = useFetch<any>('/dashboard', true);

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
        Error loading dashboard: {error}
      </div>
    );
  }

  const kpis = data?.kpis || {};
  const studentRoster = data?.student_roster || [];
  const pendingReports = data?.pending_report_details || [];

  const gradingStatus = studentRoster.reduce((acc: any, student: any) => {
    if (student.letter_grade) {
      acc.Graded = (acc.Graded || 0) + 1;
    } else {
      acc.Pending = (acc.Pending || 0) + 1;
    }
    return acc;
  }, { Graded: 0, Pending: 0 });

  const progressLabels = studentRoster.map((s: any) => s.student_name);
  const reportsApproved = studentRoster.map((s: any) => s.reports_approved);
  const totalWeeks = studentRoster.map((s: any) => s.total_weeks);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#cbd5e1' } } },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 p-8 shadow-lg min-h-[350px] flex items-center">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover object-center opacity-30 mix-blend-screen">
            <source src={lecturerDashVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
        </div>
        <div className="relative z-10 flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-slate-100 font-outfit">Lecturer Dashboard</h1>
          <p className="text-slate-400 text-lg max-w-2xl">Manage your student roster and review pending reports.</p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-400">Supervised Students</p>
              <h3 className="text-2xl font-bold text-slate-100 mt-1">
                {kpis.active_supervised || 0} / {kpis.max_capacity || 10}
              </h3>
            </div>
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
             <div 
               className="bg-blue-500 h-1.5 rounded-full" 
               style={{ width: `${Math.min(100, ((kpis.active_supervised || 0) / (kpis.max_capacity || 10)) * 100)}%` }}
             ></div>
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-400">Pending Reviews</p>
              <h3 className="text-2xl font-bold text-slate-100 mt-1">{kpis.pending_reviews || 0}</h3>
            </div>
            <div className={`p-2 rounded-lg ${(kpis.pending_reviews || 0) > 0 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-700/50 text-slate-400'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
              </svg>
            </div>
          </div>
          <p className="text-sm text-slate-500">Weekly reports awaiting approval</p>
        </Card>
      </div>

      {/* Analytics Row */}
      {studentRoster.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 h-80">
            <h2 className="text-lg font-outfit font-semibold text-slate-100 mb-4">Student Report Progress</h2>
            <div className="h-64">
              <Bar 
                data={{
                  labels: progressLabels,
                  datasets: [
                    {
                      label: 'Approved Reports',
                      data: reportsApproved,
                      backgroundColor: '#10b981',
                      borderRadius: 4,
                    },
                    {
                      label: 'Total Weeks',
                      data: totalWeeks,
                      backgroundColor: '#334155',
                      borderRadius: 4,
                    }
                  ]
                }} 
                options={chartOptions} 
              />
            </div>
          </Card>

          <Card className="h-80">
            <h2 className="text-lg font-outfit font-semibold text-slate-100 mb-4">Grading Status</h2>
            <div className="h-64">
              <Doughnut 
                data={{
                  labels: Object.keys(gradingStatus),
                  datasets: [{
                    data: Object.values(gradingStatus),
                    backgroundColor: ['#6366f1', '#f59e0b'],
                    borderColor: '#1e293b',
                    borderWidth: 2,
                  }]
                }} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom' as const,
                      labels: { color: '#cbd5e1' }
                    }
                  }
                }} 
              />
            </div>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="flex flex-col">
          <div className="mb-6">
            <h2 className="text-lg font-outfit font-semibold text-slate-100">Review Queue</h2>
          </div>
          
          <div className="flex-1">
            <Table
              data={pendingReports}
              keyExtractor={(row) => row.report_id}
              columns={[
                { header: 'Student', accessor: 'student_name' },
                { header: 'Week', accessor: (row) => `Wk ${row.week_number}` },
                { 
                  header: 'Submitted', 
                  accessor: (row) => new Date(row.submitted_at).toLocaleDateString()
                },
                { 
                  header: 'Status', 
                  accessor: (row) => row.is_late ? <Badge variant="warning">Late</Badge> : <Badge variant="success">On Time</Badge>
                },
                { 
                  header: 'Action', 
                  accessor: (row) => <button onClick={() => navigate(`/lecturer/reports/${row.report_id}`)} className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">Review</button>
                }
              ]}
              emptyMessage="No pending reports to review."
            />
          </div>
        </Card>

        <Card className="flex flex-col">
          <div className="mb-6">
            <h2 className="text-lg font-outfit font-semibold text-slate-100">Student Roster Overview</h2>
          </div>
          
          <div className="flex-1">
            <Table
              data={studentRoster}
              keyExtractor={(row) => row.internship_id}
              columns={[
                { header: 'Student', accessor: 'student_name' },
                { header: 'Company', accessor: 'company_name' },
                { 
                  header: 'Progress', 
                  accessor: (row) => (
                    <div className="flex items-center gap-2">
                       <span className="text-xs text-slate-400">{row.reports_approved}/{row.total_weeks}</span>
                       <div className="w-16 bg-slate-800 rounded-full h-1.5">
                         <div 
                           className="bg-indigo-500 h-1.5 rounded-full" 
                           style={{ width: `${Math.min(100, (row.reports_approved / row.total_weeks) * 100)}%` }}
                         ></div>
                       </div>
                    </div>
                  )
                },
                { 
                  header: 'Grade', 
                  accessor: (row) => row.letter_grade ? <Badge variant="primary">{row.letter_grade}</Badge> : <span className="text-slate-500">-</span>
                }
              ]}
              emptyMessage="No active students assigned."
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LecturerDashboard;
