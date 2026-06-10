import React, { useState } from 'react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import api from '../../services/api';

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: number | null;
  onScheduled: () => void;
}

export const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({
  isOpen, onClose, applicationId, onScheduled
}) => {
  const [formData, setFormData] = useState({
    scheduled_at: '',
    meeting_link: '',
    duration_minutes: 30
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicationId) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await api.post(`/applications/${applicationId}/interviews`, formData);
      onScheduled();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to schedule interview');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Schedule Interview">
      <form onSubmit={handleSubmit} className="space-y-4 pt-4">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        <Input
          label="Date and Time"
          type="datetime-local"
          name="scheduled_at"
          value={formData.scheduled_at}
          onChange={handleChange}
          required
        />

        <Input
          label="Meeting Link (Optional)"
          type="url"
          name="meeting_link"
          placeholder="https://zoom.us/j/..."
          value={formData.meeting_link}
          onChange={handleChange}
        />

        <Input
          label="Duration (Minutes)"
          type="number"
          name="duration_minutes"
          min="15"
          step="15"
          value={formData.duration_minutes}
          onChange={handleChange}
          required
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Scheduling...' : 'Schedule Interview'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ScheduleInterviewModal;
