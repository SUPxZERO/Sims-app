import React, { useState } from 'react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export const SendNotification: React.FC = () => {
  const [formData, setFormData] = useState({
    user_id: 'all',
    title: '',
    message: '',
    type: 'INFO',
    priority: 'NORMAL'
  });
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const response = await api.post('/admin/notifications', formData);
      alert(`Successfully sent ${response.data.count} notifications.`);
      setFormData({ ...formData, title: '', message: '' }); // Reset text but keep targeting
    } catch (error) {
      console.error('Failed to send notification', error);
      alert('Failed to send notification.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Send Notification</h1>
        <p className="text-slate-400 text-sm mt-1">Broadcast system alerts or updates to users</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Target Audience</label>
            <select 
              className="input-field w-full p-2 bg-slate-900 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-blue-500"
              value={formData.user_id}
              onChange={e => setFormData({ ...formData, user_id: e.target.value })}
            >
              <option value="all">All Active Users (Broadcast)</option>
              {/* Future: Add 'roles' or specific user fetching here if needed */}
              <option disabled value="">--- Specific Roles (Coming soon) ---</option>
              <option disabled value="">--- Specific Users (Coming soon) ---</option>
            </select>
            <p className="text-xs text-slate-500 mt-1">Select who should receive this notification.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Type</label>
              <select 
                className="input-field w-full p-2 bg-slate-900 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-blue-500"
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="INFO">Information</option>
                <option value="ALERT">Alert</option>
                <option value="SYSTEM">System Update</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Priority</label>
              <select 
                className="input-field w-full p-2 bg-slate-900 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-blue-500"
                value={formData.priority}
                onChange={e => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="LOW">Low</option>
                <option value="NORMAL">Normal</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Notification Title</label>
            <input 
              required
              type="text"
              maxLength={150}
              placeholder="e.g., Scheduled System Maintenance"
              className="input-field w-full p-2 bg-slate-900 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-blue-500"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Message Content</label>
            <textarea 
              required
              rows={4}
              maxLength={1000}
              placeholder="Enter the notification message here..."
              className="input-field w-full p-2 bg-slate-900 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-blue-500"
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
            ></textarea>
            <p className="text-xs text-slate-500 mt-1 text-right">{formData.message.length}/1000 characters</p>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <Button 
              type="submit" 
              variant="primary" 
              disabled={isSending || !formData.title.trim() || !formData.message.trim()}
            >
              {isSending ? 'Sending...' : 'Send Notification'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SendNotification;
