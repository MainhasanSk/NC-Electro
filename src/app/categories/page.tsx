'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronRight, Layers } from 'lucide-react';
import { StoreHeader } from '@/components/layout/StoreHeader';
import { StoreFooter } from '@/components/layout/StoreFooter';
import { MOCK_CATEGORIES } from '@/lib/mockData';

export default function CategoriesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <StoreHeader />

      <main className="flex-1 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">Categories</span>
          </nav>

          <div className="mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Full Catalog Taxonomy</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
              CATEGORIES
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
              Explore our core product divisions engineered for residential safety, high-demand commercial backup power, and heavy-duty electrical wiring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_CATEGORIES.map(cat => (
              <div
                key={cat.id}
                className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-400 transition-all flex flex-col justify-between group"
              >
                <div className="relative aspect-[16/10] w-full bg-slate-900 overflow-hidden">
                  <Image
                    src={cat.image_url}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                      {cat.product_count} Products
                    </span>
                    <h3 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors">
                      {cat.name}
                    </h3>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {cat.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Sub-Categories
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.sub_categories.map(sub => (
                        <Link
                          key={sub.id}
                          href={`/products?category_slug=${cat.slug}&sub_category_slug=${sub.slug}`}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-xs font-medium text-slate-700 transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      href={`/categories/${cat.slug}`}
                      className="w-full py-3 rounded-xl bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-2 group/btn"
                    >
                      <span>Explore {cat.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
