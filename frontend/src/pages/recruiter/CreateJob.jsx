import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Briefcase, ArrowLeft, Plus, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { jobService } from '../../services/jobService';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { EMPLOYMENT_TYPES, EXPERIENCE_LEVELS } from '../../utils/constants';

export const CreateJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [skills, setSkills] = useState(['Java', 'Spring Boot']);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    employmentType: 'FULL_TIME',
    experienceRequired: '3-5 years',
    salaryMin: '',
    salaryMax: '',
    deadline: '',
    status: 'OPEN',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
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

  const handleRemoveSkill = (skill) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
      setError('Please fill in all required job fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        salaryMin: formData.salaryMin ? Number(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? Number(formData.salaryMax) : null,
        skills,
      };

      const res = await jobService.createJob(payload);
      if (res.success) {
        navigate('/recruiter/jobs');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/recruiter/jobs"
        className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to My Jobs</span>
      </Link>

      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Post a New Job Opening 🚀
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Publish a position to attract top talent and start screening qualified candidates
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center space-x-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <Input
          label="Job Title *"
          name="title"
          placeholder="e.g. Senior Backend Engineer (Java & Spring Boot)"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Location *"
            name="location"
            placeholder="e.g. San Francisco, CA or Remote"
            value={formData.location}
            onChange={handleChange}
            required
          />

          <Select
            label="Employment Type *"
            name="employmentType"
            value={formData.employmentType}
            onChange={handleChange}
            options={EMPLOYMENT_TYPES}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Experience Required"
            name="experienceRequired"
            placeholder="e.g. 3-5 years"
            value={formData.experienceRequired}
            onChange={handleChange}
          />

          <Input
            label="Minimum Annual Salary ($)"
            type="number"
            name="salaryMin"
            placeholder="120000"
            value={formData.salaryMin}
            onChange={handleChange}
          />

          <Input
            label="Maximum Annual Salary ($)"
            type="number"
            name="salaryMax"
            placeholder="160000"
            value={formData.salaryMax}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Application Deadline"
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
          />

          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={[
              { value: 'OPEN', label: 'Open (Publish Immediately)' },
              { value: 'DRAFT', label: 'Draft' },
              { value: 'CLOSED', label: 'Closed' },
            ]}
          />
        </div>

        {/* Skills input */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
            Required Technical Skills
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Type skill (e.g. React, PostgreSQL) and press Add..."
              className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill(e);
                }
              }}
            />
            <Button type="button" variant="secondary" size="sm" onClick={handleAddSkill} icon={Plus}>
              Add Skill
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {skills.map((s, idx) => (
              <span
                key={idx}
                className="inline-flex items-center space-x-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-xl text-xs font-semibold"
              >
                <span>{s}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(s)}
                  className="text-indigo-400 hover:text-indigo-800"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
            Job Description & Responsibilities *
          </label>
          <textarea
            rows={5}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the role mission, team culture, daily tasks and technical projects..."
            className="w-full rounded-2xl border border-slate-200 p-3.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            required
          />
        </div>

        {/* Requirements */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
            Candidate Requirements & Qualifications
          </label>
          <textarea
            rows={4}
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            placeholder="- 4+ years building production services with Spring Boot and Java&#10;- Solid understanding of relational database schema design..."
            className="w-full rounded-2xl border border-slate-200 p-3.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
          <Link
            to="/recruiter/jobs"
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <Button type="submit" variant="primary" loading={loading}>
            Publish Job Listing
          </Button>
        </div>
      </form>
    </div>
  );
};
