import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/login"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-4 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Login</span>
        </Link>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Reset Password 🔑
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Enter your registered email address and we'll send password reset instructions
        </p>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Check your inbox</h4>
          <p className="text-xs text-slate-600">
            If an account exists for <span className="font-semibold text-slate-900">{email}</span>, you will receive password reset instructions.
          </p>
          <Link
            to="/login"
            className="inline-block mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-800"
          >
            Return to Sign In →
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={Mail}
            required
          />

          <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
            Send Reset Link
          </Button>
        </form>
      )}
    </div>
  );
};
