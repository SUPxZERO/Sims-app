import React from 'react';
import Card from './Card';

export const SkeletonDashboardLayout: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 p-8 shadow-lg min-h-[200px] flex items-end">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent opacity-50" />
        <div className="relative z-10 w-full">
          <div className="h-8 bg-slate-800/50 rounded-lg mb-3 w-1/3 animate-pulse" />
          <div className="h-5 bg-slate-800/50 rounded-lg w-1/2 animate-pulse" />
        </div>
      </div>

      {/* KPI Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="h-4 bg-slate-800/50 rounded-lg w-1/3 mb-2 animate-pulse" />
                <div className="h-7 bg-slate-800/50 rounded-lg w-1/2 mt-2 animate-pulse" />
              </div>
              <div className="w-10 h-10 bg-slate-800/50 rounded-lg animate-pulse" />
            </div>
            <div className="h-4 bg-slate-800/50 rounded-lg w-2/3 animate-pulse" />
          </Card>
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i} className="h-80">
            <div className="h-5 bg-slate-800/50 rounded-lg w-1/3 mb-4 animate-pulse" />
            <div className="flex items-center justify-center h-56">
              <div className="w-40 h-40 bg-slate-800/50 rounded-full animate-pulse" />
            </div>
          </Card>
        ))}
      </div>

      {/* Table skeleton */}
      <Card className="flex flex-col">
        <div className="h-5 bg-slate-800/50 rounded-lg w-1/4 mb-6 animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-slate-800/20 rounded-lg">
              <div className="h-4 bg-slate-800/50 rounded flex-1 animate-pulse" />
              <div className="h-4 bg-slate-800/50 rounded flex-1 animate-pulse" />
              <div className="h-4 bg-slate-800/50 rounded w-20 animate-pulse" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SkeletonDashboardLayout;
