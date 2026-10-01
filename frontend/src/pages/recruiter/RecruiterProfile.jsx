import React, { useState, useEffect } from 'react';
import { User, Building2, Phone, Briefcase, CheckCircle2, AlertCircle } from 'lucide-react';
import { recruiterService } from '../../services/recruiterService';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const RecruiterProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    designation: '',
  });

  useEffect(() => {
    recruiterService.getProfile().then((res) => {
      if (res.success && res.data) {
        setProfile(res.data);
        setFormData({
          name: res.data.name || '',
          phone: res.data.phone || '',
          designation: res.data.designation || '',
        });
      }
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await recruiterService.updateProfile(formData);
      if (res.success) {
        setMessage({ type: 'success', text: 'Recruiter profile updated successfully!' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading recruiter profile..." />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Recruiter Profile 👤
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Manage your contact credentials and corporate recruitment designation
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

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            icon={User}
            required
          />
          <Input
            label="Email (Verified)"
            value={profile?.email || ''}
            disabled
            className="bg-slate-50 cursor-not-allowed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Designation / Title"
            value={formData.designation}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            icon={Briefcase}
            placeholder="e.g. Senior Technical Recruiter"
          />
          <Input
            label="Direct Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            icon={Phone}
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-slate-200 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">
              {profile?.companyName || 'Unassigned Organization'}
            </p>
            <p className="text-[11px] text-slate-500">
              Total Published Jobs: {profile?.postedJobsCount || 0}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <Button type="submit" variant="primary" loading={saving}>
            Save Profile
          </Button>
        </div>
      </form>
    </div>
  );
};
