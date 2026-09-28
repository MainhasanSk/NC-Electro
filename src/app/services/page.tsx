import React from 'react';
import Link from 'next/link';
import { 
  Wrench, 
  ShieldCheck, 
  Zap, 
  Video, 
  BatteryCharging, 
  Check, 
  Phone, 
  Clock, 
  ArrowRight 
} from 'lucide-react';
import { StoreHeader } from '@/components/layout/StoreHeader';
import { StoreFooter } from '@/components/layout/StoreFooter';

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <StoreHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-slate-950 text-white py-20 sm:py-24 relative overflow-hidden bg-grid-pattern-dark">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/40 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Wrench className="w-3.5 h-3.5" />
              <span>Certified Technical Support</span>
            </span>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              PROFESSIONAL INSTALLATION SERVICES
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Fast, certified on-site setup for security cameras, inverters, and battery systems throughout Greater Guwahati.
            </p>
          </div>
        </section>

        {/* Services List */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Service 1: CCTV Installation */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-4 hover:border-blue-400 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Video className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-950">
                  CCTV & Surveillance System Setup
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Complete setup for residential apartments, independent houses, retail shops, and commercial offices.
                </p>
                <ul className="text-xs text-slate-700 space-y-2 pt-2 border-t border-slate-100">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Concealed weatherproof cabling & junction box mounting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>DVR / NVR hard disk configuration & recording schedule setup</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Remote live viewing configured on your iOS / Android smartphones</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Angle calibration for optimal day & night vision coverage</span>
                  </li>
                </ul>
              </div>

              {/* Service 2: Inverter & Battery Installation */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-4 hover:border-blue-400 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <BatteryCharging className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-950">
                  Inverter & Battery Power Backup Setup
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Safe interconnection of pure sine wave inverters and tall tubular batteries to protect domestic appliances.
                </p>
                <ul className="text-xs text-slate-700 space-y-2 pt-2 border-t border-slate-100">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Heavy-gauge battery terminal connections with anti-corrosion petroleum jelly</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Main distribution board phase separation and bypass switch wiring</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Trolley assembly and acid-spill containment basin verification</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Live load test on fans, lights, and appliances prior to handover</span>
                  </li>
                </ul>
              </div>

              {/* Service 3: Electrical Switchgear & MCBs */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-4 hover:border-blue-400 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Zap className="w-6 h-6 fill-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-950">
                  MCB, DB & Distribution Safety Audit
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Prevent short-circuit fire hazards with certified circuit protection and load balancing.
                </p>
                <ul className="text-xs text-slate-700 space-y-2 pt-2 border-t border-slate-100">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Double pole MCB and RCCB earth leakage trip verification</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Load audit to prevent line overloading and wire overheating</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Replacement of damaged switch plates and sockets</span>
                  </li>
                </ul>
              </div>

              {/* Service 4: Battery Health & Electrolyte Testing */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-4 hover:border-blue-400 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-950">
                  Preventive Maintenance & Warranty Assist
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Keep your backup systems running through long summer load sheddings with periodic checkups.
                </p>
                <ul className="text-xs text-slate-700 space-y-2 pt-2 border-t border-slate-100">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Electrolyte specific gravity test with hydrometer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Distilled water top-up assistance and level indicator calibration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Direct coordination with brand service centers for warranty claims</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* How to Book Support */}
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 text-center space-y-4 max-w-3xl mx-auto">
              <h3 className="text-2xl font-black text-slate-950">
                How to Book Installation Support
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                When you purchase products marked with <strong className="text-emerald-700">Installation Support Available</strong>, our Guwahati fulfillment manager automatically confirms your preferred installation timing during order dispatch.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/products"
                  className="px-6 py-3.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2"
                >
                  <span>Shop Verified Products</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all"
                >
                  Call Installation Desk
                </Link>
              </div>
            </div>

          </div>
        </section>
      </main>

      <StoreFooter />
    </div>
  );
}
