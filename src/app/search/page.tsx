'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, ChevronRight, Zap, ArrowRight } from 'lucide-react';
import { StoreHeader } from '@/components/layout/StoreHeader';
import { StoreFooter } from '@/components/layout/StoreFooter';
import { ProductCard } from '@/components/product/ProductCard';
import { Product } from '@/types';
import { getProducts } from '@/lib/api/products';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const qParam = searchParams.get('q') || '';

  const [query, setQuery] = useState(qParam);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQuery(qParam);
  }, [qParam]);

  useEffect(() => {
    async function performSearch() {
      if (!query.trim()) {
        setProducts([]);
        return;
      }
      setLoading(true);
      try {
        const res = await getProducts({ q: query, page_size: 40 });
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    performSearch();
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <StoreHeader />

      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">Search</span>
          </nav>

          {/* Search Header Bar */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm mb-10">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mb-4">
              Search NC Electro
            </h1>
            <form onSubmit={handleSearchSubmit} className="relative max-w-2xl">
              <Search className="w-5 h-5 text-blue-600 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search CCTV, inverters, batteries, cables in Guwahati..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-slate-900 text-sm font-medium transition-all"
              />
            </form>

            <div className="flex flex-wrap items-center gap-2 mt-4 text-xs">
              <span className="text-slate-400 font-semibold">Popular:</span>
              {['Hikvision', 'Luminous 150Ah', 'Pure Sine Wave', 'MCB', 'Dome Camera'].map(term => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Results Summary */}
          {query.trim() && (
            <div className="mb-6 flex items-center justify-between text-xs sm:text-sm text-slate-500">
              <div>
                Showing results for &ldquo;<strong className="text-slate-900">{query}</strong>&rdquo;
                {products.length > 0 && <span> ({products.length} products found)</span>}
              </div>
            </div>
          )}

          {/* Product Grid */}
          {loading ? (
            <div className="py-20 text-center text-slate-500 text-sm animate-pulse">
              Searching local Guwahati inventory...
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : query.trim() ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">We couldn&apos;t find that product</h3>
              <p className="text-xs text-slate-500">
                Try searching for general keywords like &ldquo;CCTV&rdquo;, &ldquo;Inverter&rdquo;, &ldquo;Battery&rdquo;, &ldquo;Wire&rdquo;, or &ldquo;Trolley&rdquo;.
              </p>
              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
                >
                  <span>Browse All Products</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400 text-xs">
              Type in the search box above to instantly query our products.
            </div>
          )}

        </div>
      </main>

      <StoreFooter />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading search...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
