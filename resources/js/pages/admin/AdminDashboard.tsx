import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import Table from '../../components/common/Table';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import adminDashVideo from '../../assets/admin_dash_video.mp4';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
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
  const pendingListingBoard = data?.pending_listing_board || [];
  
  const userDistribution = data?.user_distribution || { STUDENT: 0, COMPANY: 0, LECTURER: 0, ADMIN: 0 };
  const gradeDistribution = data?.grade_distribution || {};
  const placementGrowth = data?.placement_growth || [];

  // Chart configurations
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#cbd5e1' } // text-slate-300
      }
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8' }, // text-slate-400
        grid: { color: '#334155' } // border-slate-700
      },
      y: {
        ticks: { color: '#94a3b8' },
        grid: { color: '#334155' }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: { color: '#cbd5e1' }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 p-8 shadow-lg min-h-[350px] flex items-center">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover object-center opacity-30 mix-blend-screen">
            <source src={adminDashVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
            <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">System Administrator</h1>
            <p className="text-indigo-200">Platform overview and pending approvals queue.</p>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Users</p>
              <h3 className="text-2xl font-bold text-slate-100 mt-1">{kpis.total_users || 0}</h3>
            </div>
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm font-medium text-slate-400">Active Placements</p>
              <h3 className="text-2xl font-bold text-slate-100 mt-1">{kpis.active_placements || 0}</h3>
            </div>
            <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm font-medium text-slate-400">Pending Listings</p>
              <h3 className="text-2xl font-bold text-slate-100 mt-1">{kpis.pending_listings || 0}</h3>
            </div>
            <div className={`p-2 rounded-lg ${(kpis.pending_listings || 0) > 0 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-700/50 text-slate-400'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm font-medium text-slate-400">Audit Logs</p>
              <h3 className="text-2xl font-bold text-slate-100 mt-1">{kpis.audit_log_count || 0}</h3>
            </div>
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card className="flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-outfit font-semibold text-slate-100">Review Board: Pending Listings</h2>
            </div>
            
            <div className="flex-1">
              <Table
                data={pendingListingBoard}
                keyExtractor={(row: any) => row.listing_id}
                columns={[
                  { header: 'Company', accessor: 'company_official_name' },
                  { header: 'Position', accessor: 'title' },
                  { header: 'Quota', accessor: 'quota' },
                  { 
                    header: 'Submitted', 
                    accessor: (row: any) => new Date(row.created_at).toLocaleDateString() 
                  },
                  { 
                    header: 'Action', 
                    accessor: () => (
                      <button 
                        onClick={() => navigate('/admin/approvals')}
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                      >
                        Review Full Details
                      </button>
                    )
                  }
                ]}
                emptyMessage="No listings currently pending approval."
              />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="h-80">
            <h2 className="text-lg font-outfit font-semibold text-slate-100 mb-4">User Demographics</h2>
            <div className="h-64">
              <Doughnut 
                data={{
                  labels: Object.keys(userDistribution),
                  datasets: [{
                    data: Object.values(userDistribution),
                    backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444'],
                    borderColor: '#1e293b',
                    borderWidth: 2,
                  }]
                }} 
                options={doughnutOptions} 
              />
            </div>
          </Card>
          
          <Card className="h-80">
            <h2 className="text-lg font-outfit font-semibold text-slate-100 mb-4">Grade Distribution</h2>
            <div className="h-64">
              <Bar 
                data={{
                  labels: Object.keys(gradeDistribution).length > 0 ? Object.keys(gradeDistribution) : ['No Data'],
                  datasets: [{
                    label: 'Students',
                    data: Object.keys(gradeDistribution).length > 0 ? Object.values(gradeDistribution) : [0],
                    backgroundColor: '#8b5cf6',
                    borderRadius: 4,
                  }]
                }} 
                options={chartOptions} 
              />
            </div>
          </Card>
        </div>
      </div>
      
      {/* Analytics Row */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="h-96">
          <h2 className="text-lg font-outfit font-semibold text-slate-100 mb-4">Placement Growth (Last 6 Months)</h2>
          <div className="h-80">
            <Line 
              data={{
                labels: placementGrowth.map((item: any) => item.month),
                datasets: [{
                  label: 'New Placements',
                  data: placementGrowth.map((item: any) => item.count),
                  borderColor: '#3b82f6',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  fill: true,
                  tension: 0.4,
                }]
              }} 
              options={chartOptions} 
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
