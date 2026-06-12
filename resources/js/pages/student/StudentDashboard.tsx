import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useFetch } from '../../hooks/useFetch';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import SkeletonDashboardLayout from '../../components/common/SkeletonDashboardLayout';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import studentDashVideo from '../../assets/student_dash_video.mp4';

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { data, loading, error } = useFetch<any>('/dashboard', true);
  const { data: interviewData } = useFetch<any>('/student/interviews', true);

  if (loading) {
    return <SkeletonDashboardLayout />;
  }

  if (error) {
    return (
      <div className="text-red-400 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
        Error loading dashboard: {error}
      </div>
    );
  }

  const kpis = data?.kpis || {};
  const applications = data?.applications_pipeline || [];
  const recommendations = data?.top_recommendations || [];
  const internship = data?.internship || null;
  const weeklyReportStats = data?.weekly_report_stats || {};
  const reportLabels = Object.keys(weeklyReportStats);
  const reportData = Object.values(weeklyReportStats);
  const interviews = interviewData?.interviews || [];

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { color: '#cbd5e1' }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 p-8 shadow-lg min-h-[350px] flex items-end">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover object-center opacity-30 mix-blend-screen">
            <source src={studentDashVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.full_name?.split(' ')[0]} 👋</h1>
          <p className="text-blue-200">Here's your internship overview</p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-400">CV Status</p>
              <h3 className="text-2xl font-bold text-slate-100 mt-1">{kpis.cv_status || 'INCOMPLETE'}</h3>
            </div>
            <div className={`p-2 rounded-lg ${kpis.cv_status === 'COMPLETE' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
          </div>
          <p className="text-sm text-slate-500">{kpis.cv_versions || 0} snapshots saved</p>
        </Card>

        <Card>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-400">Active Applications</p>
              <h3 className="text-2xl font-bold text-slate-100 mt-1">{kpis.active_apps || 0} / 3</h3>
            </div>
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
          <p className="text-sm text-slate-500">Currently in progress</p>
        </Card>

        <Card>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-400">Weeks Logged</p>
              <h3 className="text-2xl font-bold text-slate-100 mt-1">{kpis.weeks_logged || 0} / {kpis.total_weeks || 12}</h3>
            </div>
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <p className="text-sm text-slate-500">Approved weekly reports</p>
        </Card>
      </div>

      {/* Analytics Row */}
      {internship && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="h-80">
            <h2 className="text-lg font-outfit font-semibold text-slate-100 mb-4">Internship Progress</h2>
            <div className="flex flex-col items-center justify-center h-56">
              <div className="relative w-40 h-40">
                <Doughnut 
                  data={{
                    labels: ['Completed Weeks', 'Remaining Weeks'],
                    datasets: [{
                      data: [kpis.weeks_logged || 0, Math.max((kpis.total_weeks || 0) - (kpis.weeks_logged || 0), 0)],
                      backgroundColor: ['#10b981', '#334155'],
                      borderWidth: 0,
                    }]
                  }} 
                  options={{
                    ...doughnutOptions,
                    cutout: '70%',
                  }} 
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-white">{kpis.weeks_logged || 0}</span>
                  <span className="text-xs text-slate-400">of {kpis.total_weeks || 0}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="h-80">
            <h2 className="text-lg font-outfit font-semibold text-slate-100 mb-4">Weekly Reports Status</h2>
            <div className="h-56">
              {reportLabels.length > 0 ? (
                <Doughnut 
                  data={{
                    labels: reportLabels.map(l => l.replace('_', ' ')),
                    datasets: [{
                      data: reportData,
                      backgroundColor: ['#6366f1', '#10b981', '#ef4444', '#f59e0b'],
                      borderColor: '#1e293b',
                      borderWidth: 2,
                    }]
                  }} 
                  options={doughnutOptions} 
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-500">
                  No reports logged yet
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Upcoming Interviews */}
      {interviews.length > 0 && (
        <Card>
          <div className="mb-6">
            <h2 className="text-lg font-outfit font-semibold text-slate-100">Upcoming Interviews</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {interviews.map((interview: any) => (
              <div key={interview.id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-200">{interview.application?.listing?.title}</h3>
                  <Badge variant={interview.status === 'SCHEDULED' ? 'primary' : 'success'}>
                    {interview.status}
                  </Badge>
                </div>
                <p className="text-sm text-slate-400 mb-3">{interview.application?.listing?.company?.full_name}</p>
                
                <div className="flex flex-col gap-2 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span>{new Date(interview.scheduled_at).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>⏱️</span>
                    <span>{interview.duration_minutes} mins</span>
                  </div>
                  {interview.meeting_link && (
                    <div className="flex items-center gap-2 mt-2">
                      <span>🔗</span>
                      <a href={interview.meeting_link} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                        Join Meeting
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recommendations & Applications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-outfit font-semibold text-slate-100">Top Internship Recommendations</h2>
            <Button variant="secondary" size="sm">Find More</Button>
          </div>
          
          <div className="space-y-4 flex-1">
            {recommendations.length > 0 ? (
              recommendations.map((rec: any, idx: number) => (
                <div key={idx} className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
                  <div>
                    <h4 className="text-slate-200 font-medium">{rec.title}</h4>
                    <p className="text-sm text-slate-400">{rec.company_name} • {rec.work_mode}</p>
                  </div>
                  <div className="flex items-center space-x-4">
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
                            className="text-emerald-400"
                            strokeWidth="3"
                            strokeDasharray={`${rec.composite_score}, 100`}
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <span className="absolute text-[10px] font-bold text-slate-200">{Math.round(rec.composite_score)}%</span>
                      </div>
                    </div>
                    <Button size="sm">Apply</Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                <p>Complete your CV to get recommendations</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="flex flex-col">
          <div className="mb-6">
            <h2 className="text-lg font-outfit font-semibold text-slate-100">Active Applications Pipeline</h2>
          </div>
          
          <div className="flex-1">
            <Table
              data={applications}
              keyExtractor={(row) => row.application_id}
              columns={[
                { header: 'Company', accessor: 'company_name' },
                { header: 'Position', accessor: 'listing_title' },
                { 
                  header: 'Score', 
                  accessor: (row) => <span className="text-indigo-400 font-medium">{row.match_score_at_apply}%</span> 
                },
                { 
                  header: 'Status', 
                  accessor: (row) => {
                    const statusMap: any = {
                      SUBMITTED: 'primary',
                      UNDER_REVIEW: 'warning',
                      SHORTLISTED: 'info',
                      ACCEPTED: 'success',
                      REJECTED: 'danger',
                      CONFIRMED: 'success',
                    };
                    return <Badge variant={statusMap[row.status]}>{row.status.replace('_', ' ')}</Badge>;
                  }
                },
                { 
                  header: 'Action', 
                  accessor: () => <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">View</button>
                }
              ]}
              emptyMessage="No active applications right now."
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
