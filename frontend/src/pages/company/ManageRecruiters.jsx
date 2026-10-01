import React, { useState, useEffect } from 'react';
import { Users, Plus, Mail, Phone, Briefcase, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { companyService } from '../../services/companyService';
import { recruiterService } from '../../services/recruiterService';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/helpers';

export const ManageRecruiters = () => {
  const { user } = useAuth();
  const companyId = user?.companyId || 1;

  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    designation: 'Technical Recruiter',
  });

  const fetchRecruiters = async () => {
    setLoading(true);
    try {
      const res = await companyService.getCompanyRecruiters(companyId, { size: 50 });
      if (res.success && res.data) {
        setRecruiters(res.data);
      }
    } catch (err) {
      console.error('Failed to load recruiters', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiters();
  }, [companyId]);

  const handleCreateRecruiter = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    setSuccess('');

    try {
      const res = await recruiterService.addRecruiter({
        ...formData,
        companyId,
      });

      if (res.success) {
        setSuccess('Recruiter account provisioned successfully!');
        setFormData({
          name: '',
          email: '',
          password: '',
          phone: '',
          designation: 'Technical Recruiter',
        });
        await fetchRecruiters();
        setTimeout(() => setIsAddModalOpen(false), 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create recruiter');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Manage Corporate Recruiters 👥
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Provision and view recruitment team members authorized to post jobs
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => {
            setIsAddModalOpen(true);
            setError('');
            setSuccess('');
          }}
        >
          Add New Recruiter
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading recruiters team..." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-5">Recruiter</th>
                  <th className="py-3.5 px-4">Designation</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Published Jobs</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recruiters.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">
                          {rec.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{rec.name}</p>
                          <p className="text-[11px] text-slate-400">{rec.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-semibold text-slate-700">
                      {rec.designation}
                    </td>

                    <td className="py-4 px-4 text-slate-500">
                      {rec.phone || 'N/A'}
                    </td>

                    <td className="py-4 px-4 font-bold text-indigo-600">
                      {rec.postedJobsCount} Positions
                    </td>

                    <td className="py-4 px-4 text-slate-500">
                      {formatDate(rec.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Recruiter Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Provision Recruiter Account"
        subtitle="Add a new talent acquisition specialist to your company"
      >
        {success ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{success}</span>
          </div>
        ) : (
          <form onSubmit={handleCreateRecruiter} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Input
              label="Full Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <Input
              label="Work Email *"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Input
              label="Initial Password *"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Min 6 characters"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Designation"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              />

              <Input
                label="Direct Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
              <Button type="button" variant="secondary" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={creating}>
                Create Account
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
