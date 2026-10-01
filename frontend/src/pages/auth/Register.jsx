import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, Briefcase, Eye, EyeOff, UserPlus, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { getPasswordStrength, isValidEmail } from '../../utils/validation';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'CANDIDATE',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const passwordStrength = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!isValidEmail(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const user = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      });

      if (user.role === 'CANDIDATE') {
        navigate('/candidate/dashboard');
      } else {
        navigate('/recruiter/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Create an Account
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Join CareerSync to discover job opportunities or recruit top candidates
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Role Selector Tabs */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
          I want to register as
        </label>
        <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100/80 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, role: 'CANDIDATE' }))}
            className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold transition-all ${formData.role === 'CANDIDATE'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <User className="w-4 h-4" />
            <span>Job Seeker</span>
          </button>
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, role: 'RECRUITER' }))}
            className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold transition-all ${formData.role === 'RECRUITER'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Recruiter</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          name="name"
          placeholder="e.g. Alex Turner"
          value={formData.name}
          onChange={handleChange}
          icon={User}
          required
        />

        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="alex@example.com"
          value={formData.email}
          onChange={handleChange}
          icon={Mail}
          required
        />

        <Input
          label="Phone Number (Optional)"
          type="tel"
          name="phone"
          placeholder="+1 (555) 000-0000"
          value={formData.phone}
          onChange={handleChange}
          icon={Phone}
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Min 6 characters"
            value={formData.password}
            onChange={handleChange}
            icon={Lock}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-8 text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {formData.password && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
              <span>Strength: {passwordStrength.text}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full ${passwordStrength.color} transition-all`}
                style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Re-enter password"
          value={formData.confirmPassword}
          onChange={handleChange}
          icon={Lock}
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          loading={loading}
          icon={UserPlus}
        >
          Create Account
        </Button>
      </form>

      <p className="text-center text-xs text-slate-500 pt-2">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-800">
          Sign In
        </Link>
      </p>
    </div>
  );
};
