'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Product } from '@/types';
import { getProducts } from '@/lib/api/products';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await getProducts({ q: query, page_size: 5 });
        setResults(res.data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-md transition-opacity">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="relative flex items-center border-b border-slate-100 px-4 py-3.5">
          <Search className="w-5 h-5 text-blue-600 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search CCTV, inverters, batteries, cables in Guwahati..."
            className="w-full text-base sm:text-lg outline-none placeholder:text-slate-400 text-slate-900 bg-transparent"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-500 rounded hover:bg-slate-200"
          >
            ESC
          </button>
        </form>

        <div className="max-h-[60vh] overflow-y-auto p-4">
          {loading && (
            <div className="py-8 text-center text-sm text-slate-500 animate-pulse">
              Searching NC Electro Guwahati catalog...
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2">
                Products Matching &ldquo;{query}&rdquo;
              </div>
              <div className="divide-y divide-slate-100">
                {results.map(prod => (
                  <Link
                    key={prod.id}
                    href={`/products/${prod.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-blue-50/60 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-slate-100 relative overflow-hidden shrink-0 border border-slate-200">
                      <Image
                        src={prod.primary_image}
                        alt={prod.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-blue-600 font-semibold">{prod.brand}</div>
                      <div className="text-sm font-medium text-slate-900 truncate">{prod.name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-bold text-slate-900">₹{prod.price.toLocaleString('en-IN')}</span>
                        {prod.has_installation_support && (
                          <span className="text-emerald-600 flex items-center gap-0.5">
                            <ShieldCheck className="w-3 h-3" /> Installation
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
              <div className="pt-2 text-center">
                <button
                  onClick={handleSubmit}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 py-2 inline-flex items-center gap-1"
                >
                  View all results for &ldquo;{query}&rdquo; →
                </button>
              </div>
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-sm font-medium text-slate-900">No products found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-500 mt-1">Try keywords like &ldquo;Hikvision&rdquo;, &ldquo;Inverter&rdquo;, &ldquo;150Ah&rdquo;, or &ldquo;MCB&rdquo;.</p>
            </div>
          )}

          {!query && (
            <div className="space-y-4 py-2">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Popular Searches in Guwahati
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Hikvision CCTV 2MP', 'Luminous Zelio Inverter', '150Ah Tubular Battery', 'Havells 2.5mm Wire', 'Schneider MCB', '4-Channel DVR Kit'].map(tag => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center gap-1.5"
                    >
                      <Zap className="w-3 h-3 text-blue-600" />
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Explore by Core Category
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { name: 'CCTV Cameras', href: '/categories/cctv' },
                    { name: 'Inverters & UPS', href: '/categories/inverters' },
                    { name: 'Tall Tubular Batteries', href: '/categories/batteries' },
                    { name: 'Wires & Cables', href: '/categories/electrical-materials' },
                    { name: 'Inverter Accessories', href: '/categories/accessories' },
                    { name: 'All Products', href: '/products' },
                  ].map(cat => (
                    <Link
                      key={cat.name}
                      href={cat.href}
                      onClick={onClose}
                      className="p-2.5 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-xs font-medium text-slate-800 transition-all flex items-center justify-between"
                    >
                      <span>{cat.name}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
