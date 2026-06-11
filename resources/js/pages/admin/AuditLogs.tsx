import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import PageHeader from '../../components/common/PageHeader';
import auditLogsBg from '../../assets/audit_logs_bg.jpg';

export const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<any>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await api.get('/admin/audit-logs');
      setLogs(response.data.logs || []);
    } catch (error) {
      console.error('Failed to fetch audit logs', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActionColor = (action: string) => {
    switch (action.toUpperCase()) {
      case 'INSERT': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'UPDATE': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'DELETE': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const parseJsonSafe = (data: any) => {
    if (!data) return null;
    if (typeof data === 'object') return data;
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  };

  if (isLoading) return <div className="text-center py-12 text-slate-400">Loading audit logs...</div>;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Audit Logs" 
        subtitle="System-wide history tracking of record changes"
        mediaType="image"
        mediaSrc={auditLogsBg}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="overflow-x-auto max-h-[70vh]">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="text-xs text-slate-400 bg-slate-800/50 uppercase sticky top-0">
                  <tr>
                    <th className="px-4 py-3 font-medium">Timestamp</th>
                    <th className="px-4 py-3 font-medium">Action</th>
                    <th className="px-4 py-3 font-medium">Table</th>
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {logs.map((log) => (
                    <tr 
                      key={log.audit_id} 
                      className={`hover:bg-slate-800/30 cursor-pointer ${selectedLog?.audit_id === log.audit_id ? 'bg-slate-800/50' : ''}`}
                      onClick={() => setSelectedLog(log)}
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-400">
                        {new Date(log.changed_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">
                        {log.table_name} <span className="text-slate-500">#{log.record_id}</span>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {log.user ? log.user.full_name : <span className="text-slate-500">System</span>}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button className="text-blue-400 hover:text-blue-300 text-xs">View</button>
                      </td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                        No audit logs found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Details Panel */}
        <div className="lg:col-span-1">
          <Card className="h-full sticky top-24">
            <h3 className="font-bold text-slate-200 mb-4 border-b border-slate-800 pb-2">Log Details</h3>
            
            {!selectedLog ? (
              <div className="text-center text-slate-500 py-12 text-sm">
                Select a log entry to view details
              </div>
            ) : (
              <div className="space-y-4 text-sm">
                <div>
                  <label className="text-xs text-slate-500 block">Context</label>
                  <p className="text-slate-300">
                    <span className="font-bold text-slate-200">{selectedLog.user?.full_name || 'System'}</span> performed <span className="font-mono text-xs bg-slate-800 px-1 rounded">{selectedLog.action}</span> on <span className="font-mono text-xs text-indigo-400">{selectedLog.table_name}</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">IP: {selectedLog.ip_address || 'N/A'}</p>
                </div>

                {selectedLog.old_values && (
                  <div>
                    <label className="text-xs text-red-400 block mb-1 font-bold">Old Values</label>
                    <pre className="bg-red-950/30 border border-red-900/50 p-2 rounded text-xs text-red-200 overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(parseJsonSafe(selectedLog.old_values), null, 2)}
                    </pre>
                  </div>
                )}

                {selectedLog.new_values && (
                  <div>
                    <label className="text-xs text-green-400 block mb-1 font-bold">New Values</label>
                    <pre className="bg-green-950/30 border border-green-900/50 p-2 rounded text-xs text-green-200 overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(parseJsonSafe(selectedLog.new_values), null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
