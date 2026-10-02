import React, { useState, useEffect } from 'react';
import { Users, Filter, CheckCircle2, XCircle, Shield, Plus, UserPlus, Building2, AlertCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { companyService } from '../../services/companyService';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Pagination } from '../../components/common/Pagination';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/helpers';
import { ROLES } from '../../utils/constants';

export const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [pageData, setPageData] = useState({ page: 0, totalPages: 1, totalElements: 0 });
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(true);

  // Add User State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: ROLES.COMPANY_ADMIN,
    companyId: '',
    designation: '',
  });

  const fetchUsers = async (page = 0, role = selectedRole) => {
    setLoading(true);
    try {
      const res = await adminService.getUsers(role || null, page, 10);
      if (res.success && res.data) {
        setUsers(res.data);
        setPageData({
          page: res.page,
          totalPages: res.totalPages,
          totalElements: res.totalElements,
        });
      }
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await companyService.getCompanies({ size: 100 });
      if (res.content) {
        setCompanies(res.content);
        if (res.content.length > 0 && !newUser.companyId) {
          setNewUser((prev) => ({ ...prev, companyId: res.content[0].id }));
        }
      }
    } catch (err) {
      console.error('Failed to load companies for dropdown', err);
    }
  };

  useEffect(() => {
    fetchUsers(0, selectedRole);
  }, [selectedRole]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const res = await adminService.updateUserStatus(user.id, newStatus);
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
        );
      }
    } catch (err) {
      console.error('Failed to update user status', err);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreating(true);
    setCreateError('');
    setCreateSuccess('');

    try {
      const payload = {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        phone: newUser.phone,
        role: newUser.role,
        companyId: newUser.companyId ? Number(newUser.companyId) : null,
        designation: newUser.designation,
      };

      const res = await adminService.createUser(payload);
      if (res.success) {
        setCreateSuccess(`${newUser.role.replace('_', ' ')} created successfully!`);
        setNewUser({
          name: '',
          email: '',
          password: '',
          phone: '',
          role: ROLES.COMPANY_ADMIN,
          companyId: companies.length > 0 ? companies[0].id : '',
          designation: '',
        });
        await fetchUsers(0, selectedRole);
        setTimeout(() => setIsAddModalOpen(false), 1200);
      }
    } catch (err) {
      setCreateError(err.response?.data?.message || err.message || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            User Access Management 👥
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Audit platform users, provision Company Admins or System Admins, and toggle account activation
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Roles</option>
              <option value={ROLES.CANDIDATE}>Candidates</option>
              <option value={ROLES.RECRUITER}>Recruiters</option>
              <option value={ROLES.COMPANY_ADMIN}>Company Admins</option>
              <option value={ROLES.SYSTEM_ADMIN}>System Admins</option>
            </select>
          </div>

          <Button
            variant="primary"
            icon={Plus}
            onClick={() => {
              setIsAddModalOpen(true);
              setCreateError('');
              setCreateSuccess('');
            }}
          >
            Provision User
          </Button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching platform users..." />
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-5">User</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Phone</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Created Date</th>
                    <th className="py-3.5 px-5 text-right">Access Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{u.name}</p>
                            <p className="text-[11px] text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <Badge variant="indigo">{u.role.replace('_', ' ')}</Badge>
                      </td>

                      <td className="py-4 px-4 text-slate-500">
                        {u.phone || 'N/A'}
                      </td>

                      <td className="py-4 px-4">
                        <Badge status={u.status}>{u.status}</Badge>
                      </td>

                      <td className="py-4 px-4 text-slate-500">
                        {formatDate(u.createdAt)}
                      </td>

                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => handleToggleStatus(u)}
                          className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl font-bold text-[11px] border transition-colors ${
                            u.status === 'ACTIVE'
                              ? 'text-rose-700 bg-rose-50 border-rose-200 hover:bg-rose-100'
                              : 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                          }`}
                        >
                          {u.status === 'ACTIVE' ? (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Deactivate</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Activate</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination
            currentPage={pageData.page}
            totalPages={pageData.totalPages}
            totalElements={pageData.totalElements}
            onPageChange={(p) => fetchUsers(p)}
          />
        </div>
      )}

      {/* Provision User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Provision Platform User"
        subtitle="Create a new administrator, recruiter, or candidate account"
      >
        {createSuccess ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold text-xs">{createSuccess}</span>
          </div>
        ) : (
          <form onSubmit={handleCreateUser} className="space-y-4">
            {createError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{createError}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Account Role *</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={ROLES.COMPANY_ADMIN}>Company Admin (Corporate Administrator)</option>
                <option value={ROLES.SYSTEM_ADMIN}>System Admin (Platform Root Administrator)</option>
                <option value={ROLES.RECRUITER}>Recruiter (Talent Acquisition Specialist)</option>
                <option value={ROLES.CANDIDATE}>Candidate (Job Seeker)</option>
              </select>
            </div>

            <Input
              label="Full Name *"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              placeholder="e.g. John Doe"
              required
            />

            <Input
              label="Email Address *"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              placeholder="user@example.com"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Password *"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="Min 6 chars"
                required
              />

              <Input
                label="Phone (Optional)"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                placeholder="+1 555-0100"
              />
            </div>

            {(newUser.role === ROLES.COMPANY_ADMIN || newUser.role === ROLES.RECRUITER) && (
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
                <div className="flex items-center space-x-1.5 text-slate-700 text-xs font-bold">
                  <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Company Association</span>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-600">Assigned Company</label>
                  <select
                    value={newUser.companyId}
                    onChange={(e) => setNewUser({ ...newUser, companyId: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {companies.map((comp) => (
                      <option key={comp.id} value={comp.id}>
                        {comp.name} ({comp.location || 'Remote'})
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Designation / Title"
                  value={newUser.designation}
                  onChange={(e) => setNewUser({ ...newUser, designation: e.target.value })}
                  placeholder={newUser.role === ROLES.COMPANY_ADMIN ? 'Company Administrator' : 'Technical Recruiter'}
                />
              </div>
            )}

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
              <Button type="button" variant="secondary" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={creating}>
                Provision User
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
