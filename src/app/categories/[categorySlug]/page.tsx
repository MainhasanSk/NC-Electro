'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight, ArrowLeft, ShieldCheck, Zap } from 'lucide-react';
import { StoreHeader } from '@/components/layout/StoreHeader';
import { StoreFooter } from '@/components/layout/StoreFooter';
import { ProductCard } from '@/components/product/ProductCard';
import { Category, Product } from '@/types';
import { getCategoryBySlug, getProducts } from '@/lib/api/products';

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = params.categorySlug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const cat = await getCategoryBySlug(slug);
        setCategory(cat);
        const prods = await getProducts({ category_slug: slug, page_size: 40 });
        setProducts(prods.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      loadData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <StoreHeader />
        <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse space-y-4">
          <div className="h-10 bg-slate-200 rounded w-1/3" />
          <div className="h-4 bg-slate-200 rounded w-2/3" />
        </div>
        <StoreFooter />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <StoreHeader />
        <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
          <h1 className="text-2xl font-black text-slate-900">Category Not Found</h1>
          <p className="text-sm text-slate-500">The requested category could not be found.</p>
          <Link href="/categories" className="inline-flex items-center gap-2 text-xs font-bold text-blue-600">
            <ArrowLeft className="w-4 h-4" /> Back to categories
          </Link>
        </div>
        <StoreFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <StoreHeader />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/categories" className="hover:text-blue-600">Categories</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">{category.name}</span>
          </nav>

          {/* Category Hero Banner */}
          <div className="bg-slate-950 text-white rounded-3xl p-8 sm:p-12 mb-10 relative overflow-hidden bg-grid-pattern-dark">
            <div className="relative z-10 max-w-2xl space-y-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 px-3 py-1 rounded-full border border-blue-500/30">
                <Zap className="w-3 h-3 fill-blue-400" />
                <span>{products.length} Products in Guwahati Stock</span>
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                {category.name}
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {category.description}
              </p>
            </div>
          </div>

          {/* Subcategory Pills */}
          {category.sub_categories.length > 0 && (
            <div className="mb-8">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Filter by Sub-Category
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/categories/${category.slug}`}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-sm"
                >
                  All {category.name}
                </Link>
                {category.sub_categories.map(sub => (
                  <Link
                    key={sub.id}
                    href={`/products?category_slug=${category.slug}&sub_category_slug=${sub.slug}`}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-colors"
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Product Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <p className="text-slate-600 text-sm">No active products currently found under this category.</p>
              <Link href="/products" className="text-xs font-bold text-blue-600">
                Browse full catalog →
              </Link>
            </div>
          )}

        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
