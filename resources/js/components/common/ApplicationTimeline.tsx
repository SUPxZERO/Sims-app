import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Spinner from './Spinner';

interface TimelineProps {
  applicationId: number;
}

export const ApplicationTimeline: React.FC<TimelineProps> = ({ applicationId }) => {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get(`/applications/${applicationId}/history`);
        setHistory(response.data.history || []);
      } catch (error) {
        console.error('Failed to fetch history', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [applicationId]);

  if (isLoading) return <div className="p-4 flex justify-center"><Spinner size="md" /></div>;
  if (history.length === 0) return <div className="text-sm text-slate-500 p-4">No history available.</div>;

  return (
    <div className="space-y-4">
      {history.map((entry) => (
        <div key={entry.history_id} className="relative pl-6 pb-4 border-l-2 border-slate-700 last:border-transparent last:pb-0">
          <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-800 border-2 border-blue-500"></div>
          <div className="mb-1 text-sm text-slate-200">
            <span className="font-bold">{entry.to_status.replace('_', ' ')}</span>
            {entry.from_status && <span className="text-slate-500 ml-2">(was {entry.from_status.replace('_', ' ')})</span>}
          </div>
          <div className="text-xs text-slate-400">
            {new Date(entry.changed_at).toLocaleString()}
          </div>
          {entry.change_reason && (
            <div className="mt-2 text-xs text-slate-300 bg-slate-800/50 p-2 rounded italic">
              "{entry.change_reason}"
            </div>
          )}
          {entry.changer && (
            <div className="mt-1 text-[10px] text-slate-500">
              by {entry.changer.full_name}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ApplicationTimeline;
