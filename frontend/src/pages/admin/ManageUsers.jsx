import React, { useState, useEffect } from 'react';
import { Users, Filter, CheckCircle2, XCircle, Shield } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Badge } from '../../components/common/Badge';
import { Pagination } from '../../components/common/Pagination';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/helpers';
import { ROLES } from '../../utils/constants';

export const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [pageData, setPageData] = useState({ page: 0, totalPages: 1, totalElements: 0 });
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchUsers(0, selectedRole);
  }, [selectedRole]);

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

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            User Access Management 👥
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Audit platform users, filter by assigned roles, and toggle account activation
          </p>
        </div>

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
    </div>
  );
};
