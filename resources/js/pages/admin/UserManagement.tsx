import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Search, Plus, Filter, Shield, User, GraduationCap, Building2, CheckCircle2, XCircle, Clock, Users, Activity, Edit2, Ban, Play, X, Save, Bell } from 'lucide-react';

export const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [editingUser, setEditingUser] = useState<any>(null);
  const [invitingUser, setInvitingUser] = useState<boolean>(false);
  const [newUser, setNewUser] = useState({ first_name: '', last_name: '', email: '', role: 'STUDENT' });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const [usersData, setUsersData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/users');
      setUsersData(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      showToast('Failed to fetch users from database.');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const filteredUsers = usersData.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'ALL' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'ALL' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleStatusChange = async (userId: number, newStatus: string) => {
    try {
      await api.patch(`/users/${userId}/status`, { status: newStatus });
      setUsersData(prev => prev.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
      showToast(`User status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Failed to update status in database.');
    }
  };

  const handleEdit = (user: any) => {
    setEditingUser({ ...user });
  };

  const handleSaveEdit = async () => {
    try {
      const response = await api.put(`/users/${editingUser.id}`, {
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
        status: editingUser.status
      });
      
      setUsersData(prev => prev.map(user => 
        user.id === editingUser.id ? response.data.user : user
      ));
      setEditingUser(null);
      showToast(`Profile for ${editingUser.name} updated successfully`);
    } catch (error) {
      console.error('Error updating user:', error);
      showToast('Failed to update user profile in database.');
    }
  };

  const handleInvite = async () => {
    if (!newUser.first_name || !newUser.last_name || !newUser.email) {
      showToast('Please fill out all fields.');
      return;
    }
    
    try {
      const response = await api.post('/users', newUser);
      setUsersData(prev => [response.data.user, ...prev]);
      setInvitingUser(false);
      setNewUser({ first_name: '', last_name: '', email: '', role: 'STUDENT' });
      showToast('User invited successfully! Default password is: password123');
    } catch (error: any) {
      console.error('Error inviting user:', error);
      showToast(error.response?.data?.error || 'Failed to invite new user.');
    }
  };

  const getRoleIcon = (role: string) => {
    switch(role) {
      case 'STUDENT': return <GraduationCap size={16} className="mr-1.5" />;
      case 'COMPANY': return <Building2 size={16} className="mr-1.5" />;
      case 'LECTURER': return <User size={16} className="mr-1.5" />;
      case 'ADMIN': return <Shield size={16} className="mr-1.5" />;
      default: return <User size={16} className="mr-1.5" />;
    }
  };

  const getStatusDisplay = (status: string) => {
    switch(status) {
      case 'ACTIVE': return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm shadow-emerald-500/10"><CheckCircle2 size={12} className="mr-1" /> Active</span>;
      case 'SUSPENDED': return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-sm shadow-rose-500/10"><XCircle size={12} className="mr-1" /> Suspended</span>;
      case 'PENDING': return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm shadow-amber-500/10"><Clock size={12} className="mr-1" /> Pending</span>;
      default: return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">{status}</span>;
    }
  };

  const totalUsers = usersData.length;
  const activeUsers = usersData.filter(u => u.status === 'ACTIVE').length;
  const pendingUsers = usersData.filter(u => u.status === 'PENDING').length;
  const suspendedUsers = usersData.filter(u => u.status === 'SUSPENDED').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      
      {/* Toast Notification */}
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

      {/* Edit Modal Overlay */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-slate-800">
              <h2 className="text-xl font-semibold text-white">Edit User Profile</h2>
              <button type="button" onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  value={editingUser.name}
                  onChange={e => setEditingUser({...editingUser, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700/50 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  value={editingUser.email}
                  onChange={e => setEditingUser({...editingUser, email: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700/50 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Role</label>
                  <select 
                    value={editingUser.role}
                    onChange={e => setEditingUser({...editingUser, role: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700/50 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="STUDENT">Student</option>
                    <option value="COMPANY">Company</option>
                    <option value="LECTURER">Lecturer</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Status</label>
                  <select 
                    value={editingUser.status}
                    onChange={e => setEditingUser({...editingUser, status: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700/50 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING">Pending</option>
                    <option value="SUSPENDED">Suspended</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-slate-800 bg-slate-800/20 flex justify-end gap-3">
              <button 
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleSaveEdit}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-medium rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
              >
                <Save size={16} className="mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal Overlay */}
      {invitingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-slate-800">
              <h2 className="text-xl font-semibold text-white">Invite New User</h2>
              <button type="button" onClick={() => setInvitingUser(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">First Name</label>
                  <input 
                    type="text" 
                    value={newUser.first_name}
                    onChange={e => setNewUser({...newUser, first_name: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700/50 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    placeholder="Jane"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Last Name</label>
                  <input 
                    type="text" 
                    value={newUser.last_name}
                    onChange={e => setNewUser({...newUser, last_name: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700/50 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  value={newUser.email}
                  onChange={e => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700/50 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="jane.doe@suims.edu"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Role</label>
                <select 
                  value={newUser.role}
                  onChange={e => setNewUser({...newUser, role: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700/50 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="STUDENT">Student</option>
                  <option value="COMPANY">Company</option>
                  <option value="LECTURER">Lecturer</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mt-2">
                <p className="text-xs text-blue-300 flex items-start gap-2">
                  <Shield size={16} className="shrink-0" />
                  The user will be created immediately with an ACTIVE status and the default password "password123". Please communicate this to the user securely.
                </p>
              </div>
            </div>

            <div className="p-5 border-t border-slate-800 bg-slate-800/20 flex justify-end gap-3">
              <button 
                type="button"
                onClick={() => setInvitingUser(false)}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleInvite}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-medium rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
              >
                <Plus size={16} className="mr-2" />
                Invite User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">User Management</h1>
          <p className="text-slate-400 mt-1 text-sm">Monitor, approve, and manage system users across all roles.</p>
        </div>
        <button type="button" onClick={() => setInvitingUser(true)} className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-medium rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/40">
          <Plus size={18} className="mr-2" />
          Invite New User
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: totalUsers, icon: <Users size={20} />, color: 'from-blue-500/20 to-blue-600/5', text: 'text-blue-400' },
          { label: 'Active Now', value: activeUsers, icon: <Activity size={20} />, color: 'from-emerald-500/20 to-emerald-600/5', text: 'text-emerald-400' },
          { label: 'Pending Approval', value: pendingUsers, icon: <Clock size={20} />, color: 'from-amber-500/20 to-amber-600/5', text: 'text-amber-400' },
          { label: 'Suspended', value: suspendedUsers, icon: <XCircle size={20} />, color: 'from-rose-500/20 to-rose-600/5', text: 'text-rose-400' }
        ].map((stat, i) => (
          <div key={i} className={`p-5 rounded-2xl border border-slate-800/60 bg-gradient-to-br ${stat.color} backdrop-blur-xl relative overflow-hidden group`}>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
              </div>
              <div className={`p-2 rounded-lg bg-slate-900/50 ${stat.text}`}>
                {stat.icon}
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-500" />
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Filters & Search */}
        <div className="p-5 border-b border-slate-800/60 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-800/20">
          <div className="relative w-full sm:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-700/50 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-slate-600 shadow-inner"
            />
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none sm:w-48">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Filter size={16} />
              </div>
              <select 
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 bg-slate-950/50 border border-slate-700/50 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
              >
                <option value="ALL">All Roles</option>
                <option value="STUDENT">Students</option>
                <option value="COMPANY">Companies</option>
                <option value="LECTURER">Lecturers</option>
                <option value="ADMIN">Admins</option>
              </select>
            </div>
            <div className="relative flex-1 sm:flex-none sm:w-48">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Activity size={16} />
              </div>
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 bg-slate-950/50 border border-slate-700/50 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="PENDING">Pending</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        {/* Custom Data Grid */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <span className="text-slate-400">Loading users...</span>
            </div>
          ) : (
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-900/80 text-slate-400 uppercase text-xs font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl">User Profile</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Login</th>
                <th className="px-6 py-4 text-right rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <Search size={32} className="mb-3 text-slate-600" />
                      <p>No users found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="group hover:bg-slate-800/40 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${user.avatar}`}>
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-slate-200 group-hover:text-white transition-colors">{user.name}</div>
                          <div className="text-xs text-slate-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-slate-300">
                        {getRoleIcon(user.role)}
                        <span className="font-medium">{user.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusDisplay(user.status)}
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {user.last_login}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button type="button" onClick={() => handleEdit(user)} className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" title="Edit User">
                          <Edit2 size={16} />
                        </button>
                        {user.status === 'PENDING' && (
                          <button type="button" onClick={() => handleStatusChange(user.id, 'ACTIVE')} className="p-1.5 text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors" title="Approve User">
                            <CheckCircle2 size={16} />
                          </button>
                        )}
                        {user.status === 'ACTIVE' && (
                          <button type="button" onClick={() => handleStatusChange(user.id, 'SUSPENDED')} className="p-1.5 text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors" title="Suspend User">
                            <Ban size={16} />
                          </button>
                        )}
                        {user.status === 'SUSPENDED' && (
                          <button type="button" onClick={() => handleStatusChange(user.id, 'ACTIVE')} className="p-1.5 text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors" title="Activate User">
                            <Play size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
