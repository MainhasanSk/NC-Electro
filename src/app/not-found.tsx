import React from 'react';
import Link from 'next/link';
import { StoreHeader } from '@/components/layout/StoreHeader';
import { StoreFooter } from '@/components/layout/StoreFooter';
import { Zap, ArrowLeft, Search, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      <StoreHeader />

      <main className="flex-1 flex items-center justify-center px-4 py-24 relative overflow-hidden">
        {/* Subtle Circuit / Glow Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

        <div className="max-w-xl w-full text-center relative z-10 space-y-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-600/10 border border-blue-500/20 text-blue-400 shadow-2xl shadow-blue-500/10">
            <Zap className="w-10 h-10 animate-pulse text-blue-500" />
          </div>

          <div className="space-y-3">
            <div className="text-xs font-mono font-bold tracking-widest text-blue-400 uppercase">
              Error 404 · Circuit Disconnected
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              Page Not Found
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
              The electronics specification or catalog resource you requested could not be located on the NC Electro network.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/25 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Storefront</span>
            </Link>

            <Link
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-800 transition-all"
            >
              <Compass className="w-4 h-4 text-blue-400" />
              <span>Explore All Products</span>
            </Link>
          </div>

          <div className="pt-8 border-t border-slate-900 text-xs text-slate-500">
            Need urgent assistance in Guwahati? Contact our technical team at{' '}
            <a href="tel:+919864012345" className="text-blue-400 hover:underline">
              +91 98640 12345
            </a>
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
