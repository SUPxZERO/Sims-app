import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Table from '../../components/common/Table';

export const WeeklyReports: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [activities, setActivities] = useState('');
  const [challenges, setChallenges] = useState('');
  const [learnings, setLearnings] = useState('');
  const [hoursLogged, setHoursLogged] = useState<string | number>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !selectedReport) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const id = selectedReport.report_id || selectedReport.id;
      await api.post(`/reports/${id}/attachments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const res = await api.get('/reports/my');
      setReports(res.data.reports || []);
      const updated = (res.data.reports || []).find((r: any) => (r.report_id || r.id) === id);
      if (updated) setSelectedReport(updated);
      
      alert('Attachment uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file', error);
      alert('Failed to upload file.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteAttachment = async (attachmentId: number) => {
    if (!confirm('Are you sure you want to delete this attachment?')) return;
    try {
      await api.delete(`/reports/attachments/${attachmentId}`);
      const id = selectedReport.report_id || selectedReport.id;
      const res = await api.get('/reports/my');
      setReports(res.data.reports || []);
      const updated = (res.data.reports || []).find((r: any) => (r.report_id || r.id) === id);
      if (updated) setSelectedReport(updated);
    } catch (error) {
      console.error('Error deleting attachment', error);
      alert('Failed to delete attachment.');
    }
  };

  const handleDownloadAttachment = async (attachment: any) => {
    try {
      const response = await api.get(`/reports/attachments/${attachment.attachment_id || attachment.id}/download`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', attachment.file_name);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading attachment', error);
      alert('Failed to download attachment.');
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/reports/my');
      setReports(response.data.reports || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (report: any) => {
    setSelectedReport(report);
    setActivities(report.activities || '');
    setChallenges(report.challenges || '');
    setLearnings(report.learnings || '');
    setHoursLogged(report.hours_logged || 0);
  };

  const handleSaveAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;

    try {
      const id = selectedReport.report_id || selectedReport.id;
      await api.put(`/reports/${id}`, {
        status: 'SUBMITTED',
        activities,
        challenges,
        learnings,
        hours_logged: Number(hoursLogged)
      });
      alert('Report submitted successfully!');
      setSelectedReport(null);
      fetchReports();
    } catch (error) {
      console.error('Failed to submit report', error);
      alert('Error submitting report. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Weekly Reports</h1>
          <p className="text-slate-400">Log your internship activities and track attendance</p>
        </div>
        <Button onClick={fetchReports}>Refresh</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-lg font-outfit font-semibold text-slate-100 mb-4">Submission History</h2>
            {isLoading ? (
              <div className="text-center py-8 text-slate-500">Loading reports...</div>
            ) : (
              <Table
                data={reports}
                keyExtractor={(row) => row.id || row.report_id}
                columns={[
                  { header: 'Week', accessor: (row) => `Week ${row.week_number}` },
                  { 
                    header: 'Status', 
                    accessor: (row) => {
                      const statusMap: any = {
                        DRAFT: 'primary',
                        SUBMITTED: 'warning',
                        APPROVED: 'success',
                        REVISION_REQUESTED: 'danger',
                      };
                      const s = row.status || 'DRAFT';
                      return <Badge variant={statusMap[s] || 'primary'}>{s.replace('_', ' ')}</Badge>;
                    }
                  },
                  { header: 'Hours', accessor: (row) => `${row.hours_logged || 0} hrs` },
                  { header: 'Submitted', accessor: (row) => row.submitted_at ? new Date(row.submitted_at).toLocaleDateString() : '-' },
                  { 
                    header: 'Action', 
                    accessor: (row) => (
                      <button 
                        onClick={() => handleEditClick(row)}
                        className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                      >
                        {row.status === 'DRAFT' || row.status === 'REVISION_REQUESTED' ? 'Edit' : 'View'}
                      </button>
                    ) 
                  }
                ]}
              />
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-outfit font-semibold text-slate-100 mb-4">
              {selectedReport ? `Week ${selectedReport.week_number} Details` : 'Select a Report'}
            </h2>
            
            {selectedReport ? (
              <form className="space-y-4" onSubmit={handleSaveAndSubmit}>
                <Input 
                  label="Activities Performed" 
                  value={activities}
                  onChange={(e) => setActivities(e.target.value)}
                  disabled={selectedReport.status === 'APPROVED' || selectedReport.status === 'SUBMITTED'}
                />
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Challenges & Learnings</label>
                  <textarea 
                    className="input-field min-h-[100px] w-full p-2 bg-slate-800 text-white rounded border border-slate-700 focus:border-blue-500 focus:outline-none" 
                    value={challenges}
                    onChange={(e) => setChallenges(e.target.value)}
                    disabled={selectedReport.status === 'APPROVED' || selectedReport.status === 'SUBMITTED'}
                  ></textarea>
                </div>
                
                <Input 
                  label="Hours Logged" 
                  type="number"
                  value={hoursLogged}
                  onChange={(e) => setHoursLogged(e.target.value)}
                  disabled={selectedReport.status === 'APPROVED' || selectedReport.status === 'SUBMITTED'}
                />

                <div className="pt-4 border-t border-slate-800">
                  <h3 className="text-sm font-medium text-slate-300 mb-3">Attachments</h3>
                  {selectedReport.attachments && selectedReport.attachments.length > 0 ? (
                    <ul className="space-y-2 mb-4">
                      {selectedReport.attachments.map((att: any) => (
                        <li key={att.attachment_id || att.id} className="flex items-center justify-between bg-slate-900/50 p-2 rounded border border-slate-700">
                          <span className="text-sm text-slate-200 truncate pr-4">{att.file_name}</span>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button 
                              type="button" 
                              onClick={() => handleDownloadAttachment(att)}
                              className="text-xs text-blue-400 hover:text-blue-300"
                            >
                              Download
                            </button>
                            {(selectedReport.status === 'DRAFT' || selectedReport.status === 'REVISION_REQUESTED') && (
                              <button 
                                type="button" 
                                onClick={() => handleDeleteAttachment(att.attachment_id || att.id)}
                                className="text-xs text-red-400 hover:text-red-300"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500 mb-4">No attachments uploaded yet.</p>
                  )}

                  {(selectedReport.status === 'DRAFT' || selectedReport.status === 'REVISION_REQUESTED') && (
                    <div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileUpload} 
                        className="hidden" 
                      />
                      <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Upload Attachment
                      </Button>
                    </div>
                  )}
                </div>

                {(selectedReport.status === 'DRAFT' || selectedReport.status === 'REVISION_REQUESTED') && (
                  <Button type="submit" className="w-full mt-4">Save & Submit</Button>
                )}
              </form>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <p>Click "Edit" or "View" on a report to see details here.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReports;
