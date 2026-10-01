import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Briefcase, CheckCircle2, Star, Sparkles } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      {/* Left Marketing Banner */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center space-x-2.5 group inline-flex">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              Career<span className="text-indigo-400">Sync</span>
            </span>
          </Link>
        </div>

        {/* Center Marketing Copy */}
        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-indigo-300 border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Powering Next-Gen Careers</span>
          </div>

          <h2 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            Connect talent with visionary companies worldwide.
          </h2>

          <p className="text-slate-300 text-sm leading-relaxed">
            Whether you are advancing your engineering career or scaling world-class product teams, CareerSync simplifies hiring, screening, and interview scheduling.
          </p>

          <div className="space-y-3 pt-4">
            <div className="flex items-center space-x-3 text-xs font-medium text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Real-time application workflow tracking & direct candidate alerts</span>
            </div>
            <div className="flex items-center space-x-3 text-xs font-medium text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Smart resume storage, skill matching & structured interviews</span>
            </div>
            <div className="flex items-center space-x-3 text-xs font-medium text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Role-based portal access for Candidates, Recruiters & Admins</span>
            </div>
          </div>
        </div>

        {/* Bottom Testimonial */}
        <div className="relative z-10 bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
          <div className="flex items-center space-x-1 text-amber-400 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
            ))}
          </div>
          <p className="text-xs text-slate-300 italic">
            "CareerSync streamlined our technical recruitment pipeline and reduced time-to-hire by 45%."
          </p>
          <p className="text-[11px] font-bold text-white mt-2">
            — Sarah Jenkins, Senior Tech Recruiter at TechCorp
          </p>
        </div>
      </div>

      {/* Right Form Container */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16">
        <div className="max-w-md w-full mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
