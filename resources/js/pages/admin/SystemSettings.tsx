import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import PageHeader from '../../components/common/PageHeader';
import systemSettingsBg from '../../assets/system_settings_bg.jpg';

export const SystemSettings: React.FC = () => {
  const [configs, setConfigs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingConfigId, setEditingConfigId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const response = await api.get('/admin/system-configs');
      setConfigs(response.data.configs);
    } catch (error) {
      console.error('Failed to fetch system configs', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (config: any) => {
    setEditingConfigId(config.config_id);
    setEditValue(config.config_value);
  };

  const handleSave = async (id: number) => {
    try {
      await api.put(`/admin/system-configs/${id}`, { config_value: editValue });
      alert('Configuration updated successfully!');
      setEditingConfigId(null);
      fetchConfigs();
    } catch (error) {
      console.error('Failed to update config', error);
      alert('Error updating configuration.');
    }
  };

  if (isLoading) {
    return <div className="text-center py-12 text-slate-400">Loading configurations...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="System Configurations" 
        subtitle="Manage global settings and variables for the platform"
        mediaType="image"
        mediaSrc={systemSettingsBg}
      />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs text-slate-400 bg-slate-800/50 uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Config Key</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Value</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {configs.map((config) => (
                <tr key={config.config_id} className="hover:bg-slate-800/30">
                  <td className="px-4 py-4 font-mono text-xs text-slate-200">
                    {config.config_key}
                  </td>
                  <td className="px-4 py-4">
                    {config.description}
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-2 py-1 text-[10px] bg-slate-700 rounded text-slate-300 font-mono">
                      {config.config_type}
                    </span>
                  </td>
                  <td className="px-4 py-4 w-1/3">
                    {editingConfigId === config.config_id ? (
                      <input
                        type="text"
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      />
                    ) : (
                      <span className="text-slate-300">{config.config_value}</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right">
                    {editingConfigId === config.config_id ? (
                      <div className="flex space-x-2 mt-2 md:mt-0">
                        <Button size="sm" variant="success" onClick={() => handleSave(config.config_id)}>Save</Button>
                        <Button size="sm" variant="secondary" onClick={() => setEditingConfigId(null)}>Cancel</Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="secondary" onClick={() => handleEditClick(config)}>Edit</Button>
                    )}
                  </td>
                </tr>
              ))}
              
              {configs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    No configurations found in the system.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default SystemSettings;
