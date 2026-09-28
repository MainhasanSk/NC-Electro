'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Zap, 
  ShieldCheck, 
  Truck, 
  Headphones, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Check, 
  Wrench,
  ChevronRight,
  Sparkles,
  Search,
  X
} from 'lucide-react';
import { StoreHeader } from '@/components/layout/StoreHeader';
import { StoreFooter } from '@/components/layout/StoreFooter';
import { ProductCard } from '@/components/product/ProductCard';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/lib/mockData';

export default function HomePage() {
  const router = useRouter();
  const [homeSearchQuery, setHomeSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');

  const filteredProducts = useMemo(() => {
    let list = MOCK_PRODUCTS.filter(p => p.is_active !== false);

    if (activeCategoryFilter !== 'all') {
      list = list.filter(p => p.category.slug === activeCategoryFilter);
    }

    if (homeSearchQuery.trim()) {
      const q = homeSearchQuery.toLowerCase().trim();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.name.toLowerCase().includes(q)
      );
    }

    return list.slice(0, 8);
  }, [homeSearchQuery, activeCategoryFilter]);

  const handleHomeSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (homeSearchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(homeSearchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <StoreHeader />

      <main className="flex-1">
        {/* ========================================================================= */}
        {/* SECTION 1: ART-DIRECTED HERO SECTION                                      */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden bg-slate-950 text-white pt-12 pb-20 lg:pt-20 lg:pb-32 bg-grid-pattern-dark">
          {/* Subtle Ambient Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 right-0 w-[450px] h-[450px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Column: Bold Editorial Content */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                  GUWAHATI&apos;S MODERN ELECTRONICS PARTNER
                </div>

                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-white">
                  POWER.<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-white">
                    SECURITY.
                  </span><br />
                  DELIVERED.
                </h1>

                <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                  Shop CCTV surveillance, pure sine wave inverters, tall tubular batteries, and essential electrical infrastructure with <strong className="text-white">fast local delivery</strong> and <strong className="text-white">professional installation support</strong> across Guwahati.
                </p>

                {/* Primary & Secondary CTAs */}
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    href="/products"
                    className="px-7 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm tracking-wide shadow-xl shadow-blue-600/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2 group"
                  >
                    <span>SHOP ELECTRONICS</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href="/categories"
                    className="px-7 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-sm tracking-wide border border-slate-700/80 hover:border-slate-600 transition-all"
                  >
                    EXPLORE CATEGORIES
                  </Link>
                </div>

                {/* Local Trust Micro-Metrics */}
                <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-6 sm:gap-10 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-900/40 text-blue-400 flex items-center justify-center font-bold">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white">Same-Day Local</div>
                      <div>Dispatch in Guwahati</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-900/40 text-emerald-400 flex items-center justify-center font-bold">
                      <Wrench className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white">On-site Support</div>
                      <div>Certified Technicians</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-900/40 text-indigo-400 flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white">Direct Warranty</div>
                      <div>100% Genuine Brands</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Layered 3D Electronics Composition with Real Delivery Photo */}
              <div className="lg:col-span-5 relative">
                <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] max-w-xl mx-auto">
                  {/* Backdrop Glow */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-600/25 via-sky-500/15 to-transparent border border-blue-500/30 shadow-2xl backdrop-blur-sm" />

                  {/* Main Hero Product Composite */}
                  <div className="absolute inset-2 sm:inset-3 rounded-2xl overflow-hidden bg-slate-900 border border-slate-700/80 shadow-2xl group">
                    <Image
                      src="/images/hero-delivery.jpg"
                      alt="NC Electro delivery technicians installing Luminous inverter and battery at customer home in Guwahati"
                      fill
                      priority
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    
                    <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 text-white">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-600/90 text-white text-[10px] font-black uppercase tracking-wider mb-1.5 backdrop-blur-sm shadow-sm">
                        <Zap className="w-3 h-3 fill-white" />
                        Live Guwahati On-Site Service
                      </div>
                      <div className="font-extrabold text-base sm:text-xl leading-snug">
                        Doorstep Delivery + Verified Setup
                      </div>
                      <div className="text-xs text-slate-300 mt-0.5">
                        Inverters, batteries & surveillance installed at customer residences across Guwahati
                      </div>
                    </div>
                  </div>

                  {/* Floating Card 1: Fast Local Delivery */}
                  <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-6 bg-slate-900/95 border border-blue-500/50 backdrop-blur-md text-white p-2.5 sm:p-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-float-slow z-20">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-md">
                      <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">Fast Local Delivery</div>
                      <div className="text-[10px] sm:text-[11px] text-slate-300">Direct to Doorstep in Guwahati</div>
                    </div>
                  </div>

                  {/* Floating Card 2: Professional Installation */}
                  <div className="absolute top-1/2 -right-3 sm:-right-6 bg-slate-900/95 border border-emerald-500/50 backdrop-blur-md text-white p-2.5 sm:p-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-float-reverse z-20">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-md">
                      <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">Installation Support</div>
                      <div className="text-[10px] sm:text-[11px] text-slate-300">Certified In-House Technicians</div>
                    </div>
                  </div>

                  {/* Floating Card 3: Guwahati Availability */}
                  <div className="absolute -bottom-3 left-6 sm:left-10 bg-slate-900/95 border border-slate-700 backdrop-blur-md text-white px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-2xl flex items-center gap-2 z-20">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] sm:text-xs font-semibold">Active in Greater Guwahati</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: SOPHISTICATED TRUST STRIP                                      */}
        {/* ========================================================================= */}
        <section className="bg-slate-100 py-10 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-blue-300 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Truck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Fast Local Delivery</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Same-day local dispatch for eligible orders across Guwahati with safe doorstep handling.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-blue-300 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Wrench className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Professional Installation</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Certified technicians ready to mount CCTVs, connect inverters, and verify electrical safety.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-blue-300 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5 fill-blue-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Quality Products</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Authorized brand inventory with genuine manufacturer warranties and zero grey market stock.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-blue-300 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Guwahati Service</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Direct local coordination from Zoo Road and GS Road fulfillment hubs.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: SHOP BY CATEGORY                                               */}
        {/* ========================================================================= */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
                  Product Categories
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                  SHOP BY CATEGORY
                </h2>
                <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-xl">
                  Everything you need to power, protect, and secure your residential or commercial space.
                </p>
              </div>

              <Link
                href="/categories"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 group"
              >
                <span>View all categories</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Editorial Category Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_CATEGORIES.map((cat, idx) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className={`group relative rounded-3xl overflow-hidden border border-slate-200/80 bg-slate-950 text-white min-h-[320px] flex flex-col justify-end p-6 hover:shadow-2xl hover:border-blue-400 transition-all duration-300 ${
                    idx === 0 ? 'sm:col-span-2 lg:col-span-1' : ''
                  }`}
                >
                  <Image
                    src={cat.image_url}
                    alt={cat.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                  <div className="relative z-10 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                      {cat.product_count} Products Available
                    </span>
                    <h3 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                    <div className="pt-2 flex items-center gap-2 text-xs font-bold text-white group-hover:text-blue-400">
                      <span>Explore products</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: FEATURED PRODUCTS WITH LIVE PRODUCT SEARCH                     */}
        {/* ========================================================================= */}
        <section className="py-20 bg-slate-50 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 mb-10">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
                    Guwahati Bestsellers &amp; Catalog
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                    POPULAR RIGHT NOW
                  </h2>
                  <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-xl">
                    High-demand security cameras, pure sine wave inverters, and battery backups in stock today.
                  </p>
                </div>

                {/* Product Search Bar in Home Page Product Section */}
                <form onSubmit={handleHomeSearchSubmit} className="relative w-full lg:w-96">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={homeSearchQuery}
                    onChange={e => setHomeSearchQuery(e.target.value)}
                    placeholder="Search products (CCTV, inverter, battery)..."
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-24 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-all"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {homeSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setHomeSearchQuery('')}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-600"
                        title="Clear"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors"
                    >
                      Search
                    </button>
                  </div>
                </form>
              </div>

              {/* Quick Category Chips for Fast Filtering */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/80">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <button
                    onClick={() => setActiveCategoryFilter('all')}
                    className={`px-3.5 py-1.5 rounded-full font-bold transition-all ${
                      activeCategoryFilter === 'all'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    All Products
                  </button>
                  <button
                    onClick={() => setActiveCategoryFilter('cctv')}
                    className={`px-3.5 py-1.5 rounded-full font-bold transition-all ${
                      activeCategoryFilter === 'cctv'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    CCTV &amp; Security
                  </button>
                  <button
                    onClick={() => setActiveCategoryFilter('inverters')}
                    className={`px-3.5 py-1.5 rounded-full font-bold transition-all ${
                      activeCategoryFilter === 'inverters'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    Inverters &amp; UPS
                  </button>
                  <button
                    onClick={() => setActiveCategoryFilter('batteries')}
                    className={`px-3.5 py-1.5 rounded-full font-bold transition-all ${
                      activeCategoryFilter === 'batteries'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    Batteries
                  </button>
                  <button
                    onClick={() => setActiveCategoryFilter('electrical-materials')}
                    className={`px-3.5 py-1.5 rounded-full font-bold transition-all ${
                      activeCategoryFilter === 'electrical-materials'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    Electrical &amp; Wires
                  </button>
                </div>

                <Link
                  href={homeSearchQuery ? `/search?q=${encodeURIComponent(homeSearchQuery)}` : '/products'}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 group"
                >
                  <span>{homeSearchQuery ? `Search "${homeSearchQuery}" in Catalog` : 'Explore complete catalog'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 max-w-md mx-auto my-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  No items found matching &quot;{homeSearchQuery}&quot;
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Try a different keyword or search our full Guwahati inventory database.
                </p>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    onClick={() => { setHomeSearchQuery(''); setActiveCategoryFilter('all'); }}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                  >
                    Reset Search
                  </button>
                  <Link
                    href={`/search?q=${encodeURIComponent(homeSearchQuery)}`}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Search Full Catalog
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: DELIVERY + INSTALLATION SECTION (EDITORIAL SPLIT)              */}
        {/* ========================================================================= */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Side: Visual Story */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-3xl overflow-hidden aspect-[4/5] bg-slate-900 shadow-2xl border border-slate-200">
                  <Image
                    src="https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=1000&q=80"
                    alt="NC Electro Installation Support"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Certified Local Technicians</span>
                    </div>
                    <h3 className="text-xl font-extrabold leading-snug">
                      We don&apos;t just drop boxes. We get your systems fully operational.
                    </h3>
                    <p className="text-xs text-slate-300">
                      From camera angle calibration to battery terminal safety audits.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side: 3-Step Process */}
              <div className="lg:col-span-7 space-y-8">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
                    Effortless Experience
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-tight">
                    DELIVERED TO YOUR DOOR.<br />
                    <span className="text-blue-600">INSTALLED WITH CONFIDENCE.</span>
                  </h2>
                  <p className="text-slate-600 text-base mt-4 leading-relaxed">
                    Most electrical shops leave you searching for random technicians. NC Electro delivers authentic components with optional professional installation coordinated by our Guwahati team.
                  </p>
                </div>

                <div className="space-y-6 pt-2">
                  <div className="flex items-start gap-5 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-400 transition-colors">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
                      01
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-950">Choose Your Products</h4>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                        Explore certified CCTV cameras, pure sine wave inverters, tall tubular batteries, and wiring materials tailored to your exact specifications.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-400 transition-colors">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white font-black text-lg flex items-center justify-center shrink-0">
                      02
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-950">Place Your Order in Seconds</h4>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                        No online payment hurdles in V1. Simply enter your delivery address in Guwahati and place the order directly with instant confirmation.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-400 transition-colors">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
                      03
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-950">Receive & Install</h4>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                        Our local operations coordinator arranges rapid dispatch and schedules certified technician installation on-site at your home or facility.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 font-bold text-sm text-blue-600 hover:text-blue-700"
                  >
                    <span>Read more about our installation services</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 6: PRODUCT CATEGORY STORYTELLING                                  */}
        {/* ========================================================================= */}
        <section className="py-20 bg-slate-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Tailored Solutions
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                ENGINEERED FOR GUWAHATI HOMES & ENTERPRISES
              </h2>
              <p className="text-sm text-slate-400">
                Precision hardware designed to handle heavy summer rains, humidity, and frequent power fluctuations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* CCTV Story */}
              <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 hover:border-blue-500/50 transition-all">
                <div className="text-blue-400 text-xs font-black tracking-wider uppercase">CCTV & SECURITY</div>
                <h3 className="text-2xl font-black text-white">SEE WHAT MATTERS.</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  24/7 crystal-clear recording with smart hybrid infrared & color night vision. Monitor residential perimeters or commercial premises directly from your smartphone.
                </p>
                <div className="pt-2">
                  <Link href="/categories/cctv" className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                    Explore Surveillance →
                  </Link>
                </div>
              </div>

              {/* Inverter Story */}
              <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 hover:border-blue-500/50 transition-all">
                <div className="text-blue-400 text-xs font-black tracking-wider uppercase">INVERTERS & UPS</div>
                <h3 className="text-2xl font-black text-white">POWER THAT KEEPS GOING.</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Pure sine wave output protects sensitive electronics like Smart TVs, desktop computers, and medical equipment with intelligent bypass switching.
                </p>
                <div className="pt-2">
                  <Link href="/categories/inverters" className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                    Explore Inverters →
                  </Link>
                </div>
              </div>

              {/* Battery Story */}
              <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 hover:border-blue-500/50 transition-all">
                <div className="text-blue-400 text-xs font-black tracking-wider uppercase">BATTERIES</div>
                <h3 className="text-2xl font-black text-white">BACKUP YOU CAN TRUST.</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Heavy tall tubular spine construction designed for deep discharge cycles during prolonged power outages. Extended 36-month warranties.
                </p>
                <div className="pt-2">
                  <Link href="/categories/batteries" className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                    Explore Batteries →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 7: GUWAHATI LOCAL PARTNER                                         */}
        {/* ========================================================================= */}
        <section className="py-20 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-xl overflow-hidden relative">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Serving All Guwahati Pincodes</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                    YOUR LOCAL ELECTRONICS PARTNER
                  </h2>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    Unlike distant marketplaces with unpredictable delivery dates, NC Electro operates localized supply hubs in Guwahati. From Zoo Road to Jalukbari, we bring fast delivery and friendly on-site support to your neighborhood.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 text-xs font-semibold text-slate-800">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                      <Check className="w-4 h-4 text-blue-600" />
                      <span>Zoo Road (781005)</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                      <Check className="w-4 h-4 text-blue-600" />
                      <span>GS Road (781005)</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                      <Check className="w-4 h-4 text-blue-600" />
                      <span>Paltan Bazar (781001)</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                      <Check className="w-4 h-4 text-blue-600" />
                      <span>Ganeshguri (781006)</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                      <Check className="w-4 h-4 text-blue-600" />
                      <span>Beltola (781028)</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                      <Check className="w-4 h-4 text-blue-600" />
                      <span>Jalukbari (781014)</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-gradient-to-br from-blue-900 to-slate-950 p-8 rounded-2xl text-white space-y-4 text-center lg:text-left shadow-lg">
                  <div className="text-xs font-bold uppercase tracking-wider text-blue-400">Guwahati Operations</div>
                  <h3 className="text-2xl font-black">Same-Day Dispatch & Technician Booking</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Have specific voltage requirements or camera placement doubts? Call our local helpline or place an order online.
                  </p>
                  <div className="pt-2">
                    <div className="text-lg font-black text-blue-400">+91 98640 12345</div>
                    <div className="text-[11px] text-slate-400">Monday - Saturday: 8:00 AM – 8:00 PM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 8: HOW IT WORKS                                                   */}
        {/* ========================================================================= */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Simple Customer Journey
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                HOW IT WORKS
              </h2>
              <p className="text-sm text-slate-500">
                Four clear steps from browsing our verified catalog to completed installation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {[
                { step: '01', title: 'Browse', desc: 'Explore genuine CCTV, inverters, batteries, and wires with real-time stock levels in Guwahati.' },
                { step: '02', title: 'Select', desc: 'Check specifications, warranties, and verify installation support eligibility.' },
                { step: '03', title: 'Order', desc: 'Review your items and confirm your delivery address. No upfront payment required in V1.' },
                { step: '04', title: 'Receive & Install', desc: 'Track order progress live as our Guwahati team dispatches items and sends technicians.' },
              ].map((item, i) => (
                <div key={item.step} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative group hover:border-blue-400 hover:bg-blue-50/30 transition-all">
                  <div className="text-3xl font-black text-blue-600">{item.step}</div>
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 9: FINAL DARK CTA                                                 */}
        {/* ========================================================================= */}
        <section className="py-24 bg-slate-950 text-white relative overflow-hidden bg-grid-pattern-dark border-t border-slate-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/40 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Get Started Today</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              NEED ELECTRONICS TODAY?
            </h2>

            <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Find the right backup power, security surveillance, and electrical supplies for your home or business in Guwahati.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/products"
                className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm tracking-wide shadow-xl shadow-blue-600/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <span>SHOP ELECTRONICS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="/contact"
                className="px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-sm tracking-wide border border-slate-700 transition-all"
              >
                CONTACT GUWAHATI DESK
              </Link>
            </div>
          </div>
        </section>
      </main>

      <StoreFooter />
    </div>
  );
}
