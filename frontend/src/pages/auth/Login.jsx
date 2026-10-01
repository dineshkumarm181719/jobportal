import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { DEMO_CREDENTIALS } from '../../utils/constants';

export const Login = () => {
  const { login, getDashboardPath } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const expired = new URLSearchParams(location.search).get('expired');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    try {
      const user = await login(formData);
      // Redirect based on role
      switch (user.role) {
        case 'CANDIDATE':
          navigate('/candidate/dashboard');
          break;
        case 'RECRUITER':
          navigate('/recruiter/dashboard');
          break;
        case 'COMPANY_ADMIN':
          navigate('/company/dashboard');
          break;
        case 'SYSTEM_ADMIN':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (cred) => {
    setFormData({ email: cred.email, password: cred.pass });
    setError('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Welcome Back 👋
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Sign in to your CareerSync account to manage applications and jobs
        </p>
      </div>

      {expired && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Your session has expired. Please sign in again.</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="name@example.com"
          value={formData.email}
          onChange={handleChange}
          icon={Mail}
          required
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="••••••••"
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

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center space-x-2 cursor-pointer text-slate-600">
            <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" />
            <span>Remember me</span>
          </label>
          <Link
            to="/forgot-password"
            className="font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          loading={loading}
          icon={LogIn}
        >
          Sign In
        </Button>
      </form>

      {/* Demo Credentials Quick-Switch Bar */}
      <div className="pt-4 border-t border-slate-200/80">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>1-Click Demo Login</span>
          </p>
          <span className="text-[10px] text-slate-400">Pre-seeded DB</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {DEMO_CREDENTIALS.map((cred, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleDemoFill(cred)}
              className="text-left p-2 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40 transition-all text-xs group"
            >
              <span className="font-bold text-slate-800 block text-[11px] group-hover:text-indigo-600 truncate">
                {cred.label}
              </span>
              <span className="text-[10px] text-slate-400 block truncate">
                Role: {cred.role}
              </span>
            </button>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-slate-500 pt-2">
        Don't have an account yet?{' '}
        <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-800">
          Create Account
        </Link>
      </p>
    </div>
  );
};
