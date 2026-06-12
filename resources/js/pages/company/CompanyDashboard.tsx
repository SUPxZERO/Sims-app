import React from 'react';
import { useFetch } from '../../hooks/useFetch';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import PageHeader from '../../components/common/PageHeader';
import SkeletonDashboardLayout from '../../components/common/SkeletonDashboardLayout';
import companyDashVideo from '../../assets/company_dash_video.mp4';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const CompanyDashboard: React.FC = () => {
  const navigate = useNavigate();
  // Using true to autoFetch on mount.
  const { data, loading, error } = useFetch<any>('/dashboard', true);

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
  const listingsOverview = data?.listings_overview || [];
  const activeInterns = data?.active_intern_details || [];
  const applicationFunnel = data?.application_funnel || { SUBMITTED: 0, UNDER_REVIEW: 0, SHORTLISTED: 0, ACCEPTED: 0, REJECTED: 0 };

  const chartOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: '#334155' }
      },
      y: {
        ticks: { color: '#94a3b8' },
        grid: { display: false }
      }
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Company Dashboard" 
        subtitle="Manage your listings and review applicants."
        mediaType="video"
        mediaSrc={companyDashVideo}
        heightClass="min-h-[250px]"
      >
        <Button onClick={() => navigate('/company/listings/new')}>Create New Listing</Button>
      </PageHeader>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-400">Active Listings</p>
              <h3 className="text-2xl font-bold text-slate-100 mt-1">{kpis.active_listings || 0}</h3>
            </div>
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
          </div>
          <p className="text-sm text-slate-500">Currently published and open</p>
        </Card>

        <Card>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-400">Pending Applicants</p>
              <h3 className="text-2xl font-bold text-slate-100 mt-1">{kpis.pending_applicants || 0}</h3>
            </div>
            <div className={`p-2 rounded-lg ${(kpis.pending_applicants || 0) > 0 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-700/50 text-slate-400'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
          </div>
          <p className="text-sm text-slate-500">Awaiting your review</p>
        </Card>

        <Card>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-400">Active Interns</p>
              <h3 className="text-2xl font-bold text-slate-100 mt-1">{kpis.active_interns || 0}</h3>
            </div>
            <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
          <p className="text-sm text-slate-500">Currently onboarded</p>
        </Card>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="h-96">
          <h2 className="text-lg font-outfit font-semibold text-slate-100 mb-4">Application Funnel</h2>
          <div className="h-80">
            <Bar 
              data={{
                labels: Object.keys(applicationFunnel).map(k => k.replace('_', ' ')),
                datasets: [{
                  label: 'Applicants',
                  data: Object.values(applicationFunnel),
                  backgroundColor: ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
                  borderRadius: 4,
                }]
              }} 
              options={chartOptions} 
            />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-outfit font-semibold text-slate-100">Listings Overview</h2>
          </div>
          
          <div className="flex-1">
            <Table
              data={listingsOverview}
              keyExtractor={(row) => row.listing_id}
              columns={[
                { header: 'Title', accessor: 'title' },
                { 
                  header: 'Status', 
                  accessor: (row) => {
                    const statusMap: any = {
                      PUBLISHED: 'success',
                      PENDING_APPROVAL: 'warning',
                      DRAFT: 'primary',
                      CLOSED: 'danger',
                    };
                    return <Badge variant={statusMap[row.status]}>{row.status.replace('_', ' ')}</Badge>;
                  }
                },
                { 
                  header: 'Quota', 
                  accessor: (row) => <span className="text-slate-400">{row.filled_count} / {row.quota}</span>
                },
                { 
                  header: 'Applicants', 
                  accessor: (row) => (
                    <div className="flex gap-2 text-xs">
                      <span className="text-yellow-400" title="Pending">P: {row.application_counts?.SUBMITTED || 0}</span>
                      <span className="text-blue-400" title="Shortlisted">S: {row.application_counts?.SHORTLISTED || 0}</span>
                    </div>
                  )
                }
              ]}
              emptyMessage="No listings created yet."
            />
          </div>
        </Card>

        <Card className="flex flex-col">
          <div className="mb-6">
            <h2 className="text-lg font-outfit font-semibold text-slate-100">Active Interns</h2>
          </div>
          
          <div className="flex-1">
            <Table
              data={activeInterns}
              keyExtractor={(row) => row.internship_id}
              columns={[
                { header: 'Student', accessor: 'student_name' },
                { header: 'Position', accessor: 'position' },
                { 
                  header: 'End Date', 
                  accessor: (row) => new Date(row.end_date).toLocaleDateString()
                },
                { 
                  header: 'Evaluation', 
                  accessor: (row) => row.evaluation_status === 'COMPLETED' ? 
                    <Badge variant="success">Done</Badge> : 
                    <Badge variant="warning">Pending</Badge>
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
                        {row.evaluation_status === 'COMPLETED' ? 'View' : 'Evaluate'}
                      </button>
                    );
                  }
                }
              ]}
              emptyMessage="No active interns at the moment."
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CompanyDashboard;
