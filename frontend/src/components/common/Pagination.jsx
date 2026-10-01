import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({
  currentPage = 0,
  totalPages = 1,
  onPageChange,
  totalElements,
  size = 10,
}) => {
  if (totalPages <= 1) return null;

  const start = currentPage * size + 1;
  const end = Math.min((currentPage + 1) * size, totalElements || totalPages * size);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 border-t border-slate-100 text-sm">
      <p className="text-slate-500 text-xs">
        Showing <span className="font-semibold text-slate-900">{start}</span> to{' '}
        <span className="font-semibold text-slate-900">{end}</span> of{' '}
        <span className="font-semibold text-slate-900">{totalElements}</span> results
      </p>

      <div className="flex items-center space-x-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum = i;
            if (totalPages > 5) {
              if (currentPage > 2 && currentPage < totalPages - 2) {
                pageNum = currentPage - 2 + i;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 5 + i;
              }
            }

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`min-w-[34px] h-[34px] text-xs font-semibold rounded-lg transition-all ${
                  currentPage === pageNum
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {pageNum + 1}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
