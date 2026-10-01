import React, { useState, useEffect } from 'react';
import { Building2, MapPin, Globe, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { companyService } from '../../services/companyService';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const CompanyProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    location: '',
    industry: '',
    logo: '',
  });

  const companyId = user?.companyId || 1;

  useEffect(() => {
    companyService.getCompanyById(companyId).then((res) => {
      if (res.success && res.data) {
        setFormData({
          name: res.data.name || '',
          description: res.data.description || '',
          website: res.data.website || '',
          location: res.data.location || '',
          industry: res.data.industry || '',
          logo: res.data.logo || '',
        });
      }
      setLoading(false);
    });
  }, [companyId]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await companyService.updateCompany(companyId, formData);
      if (res.success) {
        setMessage({ type: 'success', text: 'Company profile updated successfully!' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading company profile details..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Company Profile & Branding 🏢
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Customize your organization branding, website, industry, and overview
        </p>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center space-x-2.5 ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <Input
          label="Company Name *"
          name="name"
          value={formData.name}
          onChange={handleChange}
          icon={Building2}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Industry Domain"
            name="industry"
            placeholder="e.g. Enterprise Software & Cloud"
            value={formData.industry}
            onChange={handleChange}
          />

          <Input
            label="Headquarters Location"
            name="location"
            placeholder="e.g. San Francisco, CA"
            value={formData.location}
            onChange={handleChange}
            icon={MapPin}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Official Website URL"
            name="website"
            placeholder="https://company.com"
            value={formData.website}
            onChange={handleChange}
            icon={Globe}
          />

          <Input
            label="Logo Image URL"
            name="logo"
            placeholder="https://images.unsplash.com/..."
            value={formData.logo}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
            About Company / Mission Statement
          </label>
          <textarea
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 p-3.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <Button type="submit" variant="primary" loading={saving}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
