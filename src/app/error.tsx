'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error internally if needed
    console.error('NC Electro Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 text-center relative z-10 space-y-6 shadow-2xl">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Connection Interrupted
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            An unexpected error occurred while communicating with the catalog or dispatch service.
          </p>
        </div>

        {error.digest && (
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-500">
            Error Digest: {error.digest}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-lg shadow-blue-500/25"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Connection</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all"
          >
            <Home className="w-4 h-4 text-slate-400" />
            <span>Back to Store</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
