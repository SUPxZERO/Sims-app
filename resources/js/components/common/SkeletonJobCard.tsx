import React from 'react';
import Card from './Card';

export const SkeletonJobCard: React.FC = () => {
  return (
    <Card className="flex flex-col">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="h-5 bg-slate-800/50 rounded-lg mb-2 w-3/4 animate-pulse" />
          <div className="h-4 bg-slate-800/50 rounded-lg w-1/2 animate-pulse" />
        </div>
        <div className="w-10 h-10 bg-slate-800/50 rounded-full ml-2 animate-pulse" />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="h-6 bg-slate-800/50 rounded-full w-20 animate-pulse" />
        <div className="h-6 bg-slate-800/50 rounded-full w-20 animate-pulse" />
      </div>

      <div className="mt-auto pt-4 border-t border-slate-800/50">
        <div className="h-9 bg-slate-800/50 rounded-lg animate-pulse" />
      </div>
    </Card>
  );
};

export default SkeletonJobCard;
