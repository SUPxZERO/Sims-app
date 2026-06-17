import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import {
  Users,
  UserCheck,
  UserX,
  AlertTriangle,
  Search,
  Filter,
  Activity,
  RefreshCw,
  Shield,
  GraduationCap,
  Building2,
  ChevronRight,
  Bell,
  Zap,
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Modal from '../../components/common/Modal';
import Spinner from '../../components/common/Spinner';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Internship {
  internship_id: number;
  status: string;
  start_date: string;
  end_date: string;
  student_name: string;
  company_name: string;
  position: string;
  lecturer_user_id: number | null;
  lecturer_name: string | null;
  lecturer_department: string | null;
  lecturer_current_load: number | null;
  lecturer_max_load: number | null;
}

interface Stats {
  total_internships: number;
  unassigned_count: number;
  at_capacity_lecturers: number;
}

interface Lecturer {
  user_id: number;
  full_name: string;
  department: string;
  specialization: string;
  current_load: number;
  max_supervision_load: number;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const SupervisionAssignments: React.FC = () => {
  // Data state
  const [internships, setInternships] = useState<Internship[]>([]);
  const [stats, setStats] = useState<Stats>({
    total_internships: 0,
    unassigned_count: 0,
    at_capacity_lecturers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [supervisorFilter, setSupervisorFilter] = useState('ALL');

  // Modal state
  const [assigningInternship, setAssigningInternship] = useState<Internship | null>(null);
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [lecturersLoading, setLecturersLoading] = useState(false);
  const [selectedLecturerId, setSelectedLecturerId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Bulk assign
  const [isBulkAssigning, setIsBulkAssigning] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // -----------------------------------------------------------------------
  // Data fetching
  // -----------------------------------------------------------------------

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/admin/supervisions');
      setInternships(response.data.internships || []);
      setStats(
        response.data.stats || {
          total_internships: 0,
          unassigned_count: 0,
          at_capacity_lecturers: 0,
        },
      );
    } catch (error) {
      console.error('Error fetching supervisions:', error);
      showToast('Failed to fetch supervision data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // -----------------------------------------------------------------------
  // Toast helper
  // -----------------------------------------------------------------------

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // -----------------------------------------------------------------------
  // Filtering
  // -----------------------------------------------------------------------

  const filteredInternships = internships.filter((item) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      item.student_name.toLowerCase().includes(term) ||
      item.company_name.toLowerCase().includes(term) ||
      (item.lecturer_name && item.lecturer_name.toLowerCase().includes(term));

    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;

    const matchesSupervisor =
      supervisorFilter === 'ALL' ||
      (supervisorFilter === 'ASSIGNED' && item.lecturer_user_id !== null) ||
      (supervisorFilter === 'UNASSIGNED' && item.lecturer_user_id === null);

    return matchesSearch && matchesStatus && matchesSupervisor;
  });

  // -----------------------------------------------------------------------
  // Assignment modal
  // -----------------------------------------------------------------------

  const openAssignModal = async (internship: Internship) => {
    setAssigningInternship(internship);
    setSelectedLecturerId(internship.lecturer_user_id);
    setLecturersLoading(true);
    try {
      const response = await api.get('/admin/supervisions/lecturers');
      setLecturers(response.data.lecturers || []);
    } catch (error) {
      console.error('Error fetching lecturers:', error);
      showToast('Failed to load lecturers.');
    } finally {
      setLecturersLoading(false);
    }
  };

  const closeAssignModal = () => {
    setAssigningInternship(null);
    setSelectedLecturerId(null);
    setLecturers([]);
  };

  const handleConfirmAssign = async () => {
    if (!assigningInternship || selectedLecturerId === null) return;
    try {
      setIsSaving(true);
      await api.put(`/admin/supervisions/${assigningInternship.internship_id}`, {
        lecturer_user_id: selectedLecturerId,
      });
      showToast(
        `Supervisor assigned to ${assigningInternship.student_name} successfully.`,
      );
      closeAssignModal();
      await fetchData();
    } catch (error) {
      console.error('Error assigning supervisor:', error);
      showToast('Failed to assign supervisor.');
    } finally {
      setIsSaving(false);
    }
  };

  // -----------------------------------------------------------------------
  // Bulk auto-assign
  // -----------------------------------------------------------------------

  const handleBulkAssign = async () => {
    try {
      setIsBulkAssigning(true);
      await api.post('/admin/supervisions/bulk-assign');
      showToast('Bulk auto-assignment completed successfully.');
      await fetchData();
    } catch (error) {
      console.error('Error with bulk assignment:', error);
      showToast('Bulk auto-assignment failed.');
    } finally {
      setIsBulkAssigning(false);
    }
  };

  // -----------------------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------------------

  const assignedCount = stats.total_internships - stats.unassigned_count;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm shadow-emerald-500/10">
            <Activity size={12} className="mr-1" />
            Active
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-sm shadow-blue-500/10">
            <Shield size={12} className="mr-1" />
            Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">
            {status}
          </span>
        );
    }
  };

  const getLoadPercent = (current: number, max: number) =>
    max > 0 ? Math.min((current / max) * 100, 100) : 0;

  const getLoadBarColor = (percent: number) => {
    if (percent >= 90) return 'bg-rose-500';
    if (percent >= 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      {/* ---- Toast Notification ---- */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-slate-800 border border-slate-700 shadow-2xl rounded-xl px-4 py-3 flex items-center gap-3 text-slate-200">
            <div className="bg-blue-500/20 text-blue-400 p-1.5 rounded-lg">
              <Bell size={18} />
            </div>
            <p className="text-sm font-medium">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* ---- Page Header ---- */}
      <PageHeader
        title="Supervision Assignments"
        subtitle="Assign and manage lecturer supervisors for student internships."
        heightClass="min-h-[220px]"
      >
        <button
          type="button"
          onClick={handleBulkAssign}
          disabled={isBulkAssigning}
          className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-medium rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/40 disabled:opacity-60 disabled:hover:scale-100"
        >
          {isBulkAssigning ? (
            <RefreshCw size={18} className="mr-2 animate-spin" />
          ) : (
            <Zap size={18} className="mr-2" />
          )}
          Bulk Auto-Assign
        </button>
        <button
          type="button"
          onClick={fetchData}
          className="inline-flex items-center justify-center p-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700/60 transition-all duration-300 hover:scale-105"
          title="Refresh data"
        >
          <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </PageHeader>

      {/* ---- Stats Cards ---- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Internships',
            value: stats.total_internships,
            icon: <Users size={20} />,
            color: 'from-blue-500/20 to-blue-600/5',
            text: 'text-blue-400',
            pulse: false,
          },
          {
            label: 'Unassigned',
            value: stats.unassigned_count,
            icon: <UserX size={20} />,
            color: 'from-amber-500/20 to-amber-600/5',
            text: 'text-amber-400',
            pulse: stats.unassigned_count > 0,
          },
          {
            label: 'Assigned',
            value: assignedCount,
            icon: <UserCheck size={20} />,
            color: 'from-emerald-500/20 to-emerald-600/5',
            text: 'text-emerald-400',
            pulse: false,
          },
          {
            label: 'Lecturers at Capacity',
            value: stats.at_capacity_lecturers,
            icon: <AlertTriangle size={20} />,
            color: 'from-rose-500/20 to-rose-600/5',
            text: 'text-rose-400',
            pulse: false,
          },
        ].map((stat, i) => (
          <div
            key={i}
            className={`p-5 rounded-2xl border border-slate-800/60 bg-gradient-to-br ${stat.color} backdrop-blur-xl relative overflow-hidden group`}
          >
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
              </div>
              <div
                className={`p-2 rounded-lg bg-slate-900/50 ${stat.text} ${stat.pulse ? 'animate-pulse' : ''}`}
              >
                {stat.icon}
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-500" />
          </div>
        ))}
      </div>

      {/* ---- Main Content Card ---- */}
      <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Filters & Search */}
        <div className="p-5 border-b border-slate-800/60 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-800/20">
          <div className="relative w-full sm:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search student, company, or lecturer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-700/50 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-slate-600 shadow-inner"
            />
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            {/* Status filter */}
            <div className="relative flex-1 sm:flex-none sm:w-44">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Activity size={16} />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 bg-slate-950/50 border border-slate-700/50 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            {/* Supervisor filter */}
            <div className="relative flex-1 sm:flex-none sm:w-44">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Filter size={16} />
              </div>
              <select
                value={supervisorFilter}
                onChange={(e) => setSupervisorFilter(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 bg-slate-950/50 border border-slate-700/50 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
              >
                <option value="ALL">All Supervisors</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="UNASSIGNED">Unassigned</option>
              </select>
            </div>
          </div>
        </div>

        {/* ---- Table ---- */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : filteredInternships.length === 0 ? (
            <div className="flex h-64 items-center justify-center">
              <div className="flex flex-col items-center justify-center text-slate-500">
                <Search size={32} className="mb-3 text-slate-600" />
                <p>No internships found matching your criteria.</p>
              </div>
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-900/80 text-slate-400 uppercase text-xs font-semibold tracking-wider">
                <tr>
                  <th className="px-6 py-4 rounded-tl-xl">Student</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Position</th>
                  <th className="px-6 py-4">Supervisor</th>
                  <th className="px-6 py-4">Load</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right rounded-tr-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredInternships.map((item) => {
                  const isAssigned = item.lecturer_user_id !== null;
                  const loadPercent =
                    isAssigned && item.lecturer_max_load
                      ? getLoadPercent(
                          item.lecturer_current_load ?? 0,
                          item.lecturer_max_load,
                        )
                      : 0;

                  return (
                    <tr
                      key={item.internship_id}
                      className="group hover:bg-slate-800/40 transition-colors duration-200"
                    >
                      {/* Student */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-blue-500/20">
                            {item.student_name.charAt(0)}
                          </div>
                          <span className="font-medium text-slate-200 group-hover:text-white transition-colors">
                            {item.student_name}
                          </span>
                        </div>
                      </td>

                      {/* Company */}
                      <td className="px-6 py-4 text-slate-300">{item.company_name}</td>

                      {/* Position */}
                      <td className="px-6 py-4 text-slate-400 max-w-[200px] truncate">
                        {item.position}
                      </td>

                      {/* Supervisor */}
                      <td className="px-6 py-4">
                        {isAssigned ? (
                          <div>
                            <p className="font-medium text-slate-200">{item.lecturer_name}</p>
                            <p className="text-xs text-slate-500">{item.lecturer_department}</p>
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-sm shadow-rose-500/10">
                            <UserX size={12} className="mr-1" />
                            Unassigned
                          </span>
                        )}
                      </td>

                      {/* Load */}
                      <td className="px-6 py-4">
                        {isAssigned && item.lecturer_max_load ? (
                          <div className="w-24">
                            <p className="text-xs text-slate-400 mb-1">
                              {item.lecturer_current_load}/{item.lecturer_max_load}
                            </p>
                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${getLoadBarColor(loadPercent)}`}
                                style={{ width: `${loadPercent}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">{getStatusBadge(item.status)}</td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            type="button"
                            onClick={() => openAssignModal(item)}
                            className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                              isAssigned
                                ? 'text-amber-400 hover:bg-amber-400/10 border border-amber-500/20'
                                : 'text-blue-400 hover:bg-blue-400/10 border border-blue-500/20'
                            }`}
                          >
                            {isAssigned ? 'Reassign' : 'Assign'}
                            <ChevronRight size={14} className="ml-1" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ---- Assignment Modal ---- */}
      <Modal
        isOpen={assigningInternship !== null}
        onClose={closeAssignModal}
        title={
          assigningInternship?.lecturer_user_id
            ? 'Reassign Supervisor'
            : 'Assign Supervisor'
        }
        size="xl"
      >
        {assigningInternship && (
          <div className="space-y-5">
            {/* Context info */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/40 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 shrink-0">
                {assigningInternship.student_name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-100 truncate">
                  {assigningInternship.student_name}
                </p>
                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <Building2 size={12} />
                  {assigningInternship.company_name}
                  <span className="text-slate-600 mx-1">·</span>
                  {assigningInternship.position}
                </p>
              </div>
            </div>

            {/* Lecturers list */}
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">
                Select a Supervisor
              </p>

              {lecturersLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Spinner size="md" />
                </div>
              ) : lecturers.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <GraduationCap size={28} className="mx-auto mb-2 text-slate-600" />
                  <p className="text-sm">No lecturers available.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
                  {lecturers.map((lec) => {
                    const atCapacity = lec.current_load >= lec.max_supervision_load;
                    const isCurrent =
                      assigningInternship.lecturer_user_id === lec.user_id;
                    const isSelected = selectedLecturerId === lec.user_id;
                    const loadPct = getLoadPercent(
                      lec.current_load,
                      lec.max_supervision_load,
                    );

                    return (
                      <button
                        key={lec.user_id}
                        type="button"
                        disabled={atCapacity && !isCurrent}
                        onClick={() => setSelectedLecturerId(lec.user_id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group/card ${
                          atCapacity && !isCurrent
                            ? 'opacity-50 cursor-not-allowed border-slate-800/40 bg-slate-900/30'
                            : isSelected
                              ? 'border-blue-500/60 bg-blue-500/10 ring-1 ring-blue-500/30 shadow-lg shadow-blue-500/10'
                              : 'border-slate-700/40 bg-slate-800/40 hover:border-slate-600/60 hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-slate-100 text-sm truncate">
                                {lec.full_name}
                              </p>
                              {isCurrent && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/15 text-blue-400 border border-blue-500/25">
                                  Current
                                </span>
                              )}
                              {atCapacity && !isCurrent && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-500/15 text-rose-400 border border-rose-500/25">
                                  At Capacity
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 truncate">
                              {lec.department}
                              {lec.specialization && (
                                <>
                                  <span className="mx-1.5 text-slate-700">·</span>
                                  {lec.specialization}
                                </>
                              )}
                            </p>
                          </div>

                          {/* Load indicator */}
                          <div className="shrink-0 w-28 text-right">
                            <p className="text-xs text-slate-400 mb-1">
                              {lec.current_load}/{lec.max_supervision_load} students
                            </p>
                            <div className="h-1.5 w-full bg-slate-900/80 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${getLoadBarColor(loadPct)}`}
                                style={{ width: `${loadPct}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Confirm button */}
            <div className="pt-3 border-t border-slate-800/60 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeAssignModal}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAssign}
                disabled={
                  selectedLecturerId === null ||
                  selectedLecturerId === assigningInternship.lecturer_user_id ||
                  isSaving
                }
                className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-medium rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <RefreshCw size={16} className="mr-2 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <UserCheck size={16} className="mr-2" />
                    Confirm Assignment
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SupervisionAssignments;
