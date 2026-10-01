import React, { useState, useEffect } from 'react';
import { Building2, Plus, Globe, MapPin, CheckCircle2, AlertCircle, Eye } from 'lucide-react';
import { companyService } from '../../services/companyService';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Pagination } from '../../components/common/Pagination';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const ManageCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [pageData, setPageData] = useState({ page: 0, totalPages: 1, totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: '',
    location: '',
    website: '',
    logo: '',
  });

  const fetchCompanies = async (page = 0) => {
    setLoading(true);
    try {
      const res = await companyService.getCompanies({ page, size: 10 });
      if (res.success && res.data) {
        setCompanies(res.data);
        setPageData({
          page: res.page,
          totalPages: res.totalPages,
          totalElements: res.totalElements,
        });
      }
    } catch (err) {
      console.error('Failed to load companies', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies(0);
  }, []);

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    setSuccess('');

    try {
      const res = await companyService.createCompany(formData);
      if (res.success) {
        setSuccess('Company registered successfully!');
        setFormData({
          name: '',
          description: '',
          industry: '',
          location: '',
          website: '',
          logo: '',
        });
        await fetchCompanies(0);
        setTimeout(() => setIsAddModalOpen(false), 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create company');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Manage Companies 🏢
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Browse registered employer partners and register new organizations
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
          Register Company
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching company directory..." />
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-5">Organization</th>
                    <th className="py-3.5 px-4">Industry</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Recruiters</th>
                    <th className="py-3.5 px-4">Open Jobs</th>
                    <th className="py-3.5 px-5 text-right">Website</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {companies.map((comp) => (
                    <tr key={comp.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                            {comp.logo ? (
                              <img src={comp.logo} alt={comp.name} className="w-full h-full object-cover" />
                            ) : (
                              <Building2 className="w-5 h-5 text-indigo-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{comp.name}</p>
                            <p className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">{comp.description}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-semibold text-slate-700">
                        {comp.industry || 'Technology'}
                      </td>

                      <td className="py-4 px-4 text-slate-500">
                        {comp.location || 'Remote'}
                      </td>

                      <td className="py-4 px-4 font-bold text-slate-800">
                        {comp.recruitersCount} Recruiters
                      </td>

                      <td className="py-4 px-4 font-bold text-indigo-600">
                        {comp.openJobsCount} Openings
                      </td>

                      <td className="py-4 px-5 text-right">
                        {comp.website && (
                          <a
                            href={comp.website}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center space-x-1 text-indigo-600 hover:underline text-xs font-semibold"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <span>Visit</span>
                          </a>
                        )}
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
            onPageChange={(p) => fetchCompanies(p)}
          />
        </div>
      )}

      {/* Add Company Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Company"
        subtitle="Add a corporate partner to CareerSync ecosystem"
      >
        {success ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{success}</span>
          </div>
        ) : (
          <form onSubmit={handleCreateCompany} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Input
              label="Company Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Industry"
                placeholder="e.g. AI & Cloud"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              />

              <Input
                label="Headquarters"
                placeholder="e.g. Seattle, WA"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <Input
              label="Website"
              type="url"
              placeholder="https://company.com"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 uppercase">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
              <Button type="button" variant="secondary" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={creating}>
                Register Organization
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
