import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import SkeletonDashboardLayout from '../../components/common/SkeletonDashboardLayout';

export const ManageListings: React.FC = () => {
  const navigate = useNavigate();
  const { data, loading, error } = useFetch<any>('/dashboard', true);

  if (loading) {
    return <SkeletonDashboardLayout />;
  }

  if (error) {
    return (
      <div className="text-red-400 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
        Error loading listings: {error}
      </div>
    );
  }

  // Dashboard returns listings_overview
  const listings = data?.listings_overview || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Manage Listings</h1>
          <p className="text-slate-400">View your active job postings and review applicants.</p>
        </div>
        <Button onClick={() => navigate('/company/listings/new')}>Create New Listing</Button>
      </div>

      <Card className="flex flex-col">
        <div className="flex-1">
          <Table
            data={listings}
            keyExtractor={(row) => row.listing_id}
            columns={[
              { header: 'Title', accessor: 'title' },
              { 
                header: 'Status', 
                accessor: (row) => {
                  const statusMap: Record<string, 'success' | 'warning' | 'primary' | 'danger'> = {
                    PUBLISHED: 'success',
                    PENDING_APPROVAL: 'warning',
                    DRAFT: 'primary',
                    CLOSED: 'danger',
                  };
                  return <Badge variant={statusMap[row.status] || 'primary'}>{row.status.replace('_', ' ')}</Badge>;
                }
              },
              { 
                header: 'Quota', 
                accessor: (row) => <span className="text-slate-400">{row.filled_count} / {row.quota}</span>
              },
              { 
                header: 'Pending Applicants', 
                accessor: (row) => (
                  <span className={`font-bold ${row.application_counts?.SUBMITTED > 0 ? 'text-yellow-400' : 'text-slate-500'}`}>
                    {row.application_counts?.SUBMITTED || 0}
                  </span>
                )
              },
              {
                header: 'Actions',
                accessor: (row) => (
                  <div className="flex gap-3">
                    <button 
                      onClick={() => navigate(`/company/listings/${row.listing_id}/applications`)}
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                    >
                      Review Applicants
                    </button>
                  </div>
                )
              }
            ]}
            emptyMessage="No listings created yet. Create your first listing to start accepting interns!"
          />
        </div>
      </Card>
    </div>
  );
};

export default ManageListings;
