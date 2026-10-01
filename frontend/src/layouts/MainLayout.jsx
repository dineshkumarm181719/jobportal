import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Navbar } from '../components/navbar/Navbar';
import { Briefcase, Heart } from 'lucide-react';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-slate-200/80 py-10 mt-16 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="text-base font-black tracking-tight text-slate-900">
              Career<span className="text-indigo-600">Sync</span>
            </span>
          </div>

          <div className="flex items-center space-x-6 font-medium text-slate-600">
            <Link to="/jobs" className="hover:text-indigo-600 transition-colors">Find Jobs</Link>
            <Link to="/login" className="hover:text-indigo-600 transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-indigo-600 transition-colors">Post a Job</Link>
          </div>

          <p className="flex items-center space-x-1">
            <span>Built with Spring Boot & React</span>
          </p>
        </div>
      </footer>
    </div>
  );
};
