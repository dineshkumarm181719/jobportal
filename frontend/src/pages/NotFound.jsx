import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-3xl mb-2 shadow-xs">
        404
      </div>
      <h2 className="text-2xl font-black text-slate-900 tracking-tight">Page Not Found</h2>
      <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
        The link you followed may be broken, or the page may have been moved.
      </p>
      <div className="pt-4">
        <Link to="/">
          <Button variant="primary" icon={Home}>
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};
