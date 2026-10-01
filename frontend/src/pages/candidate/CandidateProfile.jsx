import React, { useState, useEffect } from 'react';
import {
  User,
  MapPin,
  Briefcase,
  GraduationCap,
  FileText,
  UploadCloud,
  Trash2,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  Download,
} from 'lucide-react';
import { candidateService } from '../../services/candidateService';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { formatDate } from '../../utils/helpers';

export const CandidateProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [newSkill, setNewSkill] = useState('');
  const [skills, setSkills] = useState([]);
  const [resumeToDelete, setResumeToDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    profileSummary: '',
    location: '',
    experience: '',
    education: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await candidateService.getProfile();
      if (res.success && res.data) {
        setProfile(res.data);
        setFormData({
          name: res.data.name || '',
          phone: res.data.phone || '',
          profileSummary: res.data.profileSummary || '',
          location: res.data.location || '',
          experience: res.data.experience || '',
          education: res.data.education || '',
        });
        setSkills(res.data.skills || []);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load profile data' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    const trimmed = newSkill.trim();
    if (!skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await candidateService.updateProfile({
        ...formData,
        skills,
      });
      if (res.success) {
        setProfile(res.data);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update profile',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size exceeds 10MB limit.' });
      return;
    }

    setUploadingResume(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await candidateService.uploadResume(file);
      if (res.success) {
        setMessage({ type: 'success', text: 'Resume uploaded successfully!' });
        await fetchProfile();
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to upload resume',
      });
    } finally {
      setUploadingResume(false);
      e.target.value = '';
    }
  };

  const handleDeleteResume = async () => {
    if (!resumeToDelete) return;
    try {
      await candidateService.deleteResume(resumeToDelete.id);
      setMessage({ type: 'success', text: 'Resume deleted successfully.' });
      await fetchProfile();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete resume.' });
    } finally {
      setResumeToDelete(null);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading candidate profile..." />;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Candidate Profile & Documents 📄
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Keep your professional skills, work history, and resumes up to date for recruiters
        </p>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center space-x-2.5 animate-in fade-in ${
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Main Info Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSaveProfile} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Personal & Professional Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                icon={User}
                required
              />
              <Input
                label="Email (Read Only)"
                value={profile?.email || ''}
                disabled
                className="bg-slate-50 cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
              />
              <Input
                label="Current Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                icon={MapPin}
                placeholder="e.g. San Francisco, CA or Remote"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Total Experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                icon={Briefcase}
                placeholder="e.g. 5 years"
              />
              <Input
                label="Highest Education"
                name="education"
                value={formData.education}
                onChange={handleChange}
                icon={GraduationCap}
                placeholder="e.g. B.S. in Computer Science"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
                Professional Summary / Bio
              </label>
              <textarea
                rows={4}
                name="profileSummary"
                value={formData.profileSummary}
                onChange={handleChange}
                placeholder="Describe your engineering expertise, key accomplishments, tech leadership and what roles you are seeking..."
                className="block w-full rounded-2xl border border-slate-200 p-3.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent leading-relaxed"
              />
            </div>

            {/* Skills Tag Management */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
                Technical Skills & Domains
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill (e.g. Java, Docker, React)..."
                  className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(e);
                    }
                  }}
                />
                <Button type="button" variant="secondary" size="sm" onClick={handleAddSkill} icon={Plus}>
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1 min-h-[36px]">
                {skills.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">No skills added yet</span>
                ) : (
                  skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center space-x-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-xl text-xs font-semibold"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-indigo-400 hover:text-indigo-800 focus:outline-none"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button type="submit" variant="primary" loading={saving}>
                Save Profile Changes
              </Button>
            </div>
          </form>
        </div>

        {/* Right Col: Resumes Management */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Attached Resumes</span>
              <span className="text-xs font-semibold text-slate-400">
                {profile?.resumes?.length || 0} Files
              </span>
            </h3>

            {/* Upload Area */}
            <label className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-indigo-50/20 hover:bg-indigo-50/50 transition-all group">
              <UploadCloud className="w-8 h-8 text-indigo-500 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-indigo-700">
                {uploadingResume ? 'Uploading...' : 'Click to Upload Resume'}
              </span>
              <span className="text-[11px] text-slate-400 mt-1">
                Supports PDF, DOC, DOCX (Max 10MB)
              </span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                disabled={uploadingResume}
                className="hidden"
              />
            </label>

            {/* Resume File List */}
            <div className="space-y-3 pt-2">
              {profile?.resumes && profile.resumes.length > 0 ? (
                profile.resumes.map((r) => (
                  <div
                    key={r.id}
                    className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-800 truncate">{r.fileName}</p>
                        <p className="text-[10px] text-slate-400">
                          {formatDate(r.uploadedAt)} • {(r.fileSize / 1024).toFixed(0)} KB
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0 ml-2">
                      <a
                        href={r.filePath}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Download / View"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      <button
                        type="button"
                        onClick={() => setResumeToDelete(r)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete Resume"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-4">
                  No resume files uploaded yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!resumeToDelete}
        onClose={() => setResumeToDelete(null)}
        onConfirm={handleDeleteResume}
        title="Delete Resume"
        message={`Are you sure you want to remove '${resumeToDelete?.fileName}'? Any applications referencing this resume may still store historical records.`}
        confirmText="Delete File"
        variant="danger"
      />
    </div>
  );
};
