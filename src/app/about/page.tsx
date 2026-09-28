import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Zap, ShieldCheck, Truck, MapPin, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { StoreHeader } from '@/components/layout/StoreHeader';
import { StoreFooter } from '@/components/layout/StoreFooter';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <StoreHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-slate-950 text-white py-20 sm:py-28 relative overflow-hidden bg-grid-pattern-dark">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/50 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              <span>About NC Electro</span>
            </span>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              ELECTRONICS. DELIVERED. INSTALLED.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              We started NC Electro in Guwahati to fix a broken experience: buying heavy electronics online with unpredictable delivery, or visiting local shops with no installation accountability.
            </p>
          </div>
        </section>

        {/* Narrative & Proposition */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-16">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Our Origin</span>
                <h2 className="text-3xl font-black text-slate-950 tracking-tight leading-snug">
                  Built for Assam&apos;s unique electrical & surveillance demands.
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Guwahati experiences intense monsoon downpours, high humidity, and intermittent electrical voltage fluctuations. Ordinary generic electronics frequently fail without proper weatherproofing or pure sine wave protection.
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  NC Electro curates authorized hardware specifically tested for local conditions: IP67-rated weatherproof CCTV cameras, heavy tall tubular batteries, and intelligent DSP inverters.
                </p>
              </div>

              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 shadow-xl border border-slate-200">
                <Image
                  src="https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80"
                  alt="NC Electro Local Technician"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Core Values */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-slate-100">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <Truck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Same-Day Guwahati Fleet</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  We maintain strategic inventory in Zoo Road and GS Road to dispatch orders across Kamrup Metro without waiting for long-haul national couriers.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Certified Installation</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Every installation is handled by trained technicians who verify earthing, calibrate camera viewing angles, and conduct load tests.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900">100% Genuine Brands</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Direct partnerships with Hikvision, Luminous, CP Plus, Havells, and Schneider Electric guarantee valid manufacturer warranties.
                </p>
              </div>
            </div>

            {/* Local Commitment CTA */}
            <div className="bg-slate-950 text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-2xl font-black">Experience the NC Electro Difference</h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  Shop certified electronics or speak directly with our local support desk in Guwahati.
                </p>
              </div>

              <Link
                href="/products"
                className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/30 shrink-0"
              >
                Browse Catalog
              </Link>
            </div>

          </div>
        </section>
      </main>

      <StoreFooter />
    </div>
  );
}
