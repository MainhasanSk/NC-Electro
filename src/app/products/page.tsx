'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Filter, 
  X, 
  ChevronRight, 
  RotateCcw, 
  SlidersHorizontal,
  Search,
  Check
} from 'lucide-react';
import { StoreHeader } from '@/components/layout/StoreHeader';
import { StoreFooter } from '@/components/layout/StoreFooter';
import { ProductCard } from '@/components/product/ProductCard';
import { Product, Category, Availability } from '@/types';
import { getProducts, getCategories } from '@/lib/api/products';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/lib/mockData';

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [loading, setLoading] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter states initialized from URL params
  const qParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category_slug') || '';
  const brandParam = searchParams.get('brand') || '';
  const availabilityParam = (searchParams.get('availability') as Availability) || undefined;
  const sortParam = (searchParams.get('sort') as any) || 'newest';
  const minPriceParam = searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined;
  const maxPriceParam = searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined;

  const [searchQuery, setSearchQuery] = useState(qParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedBrand, setSelectedBrand] = useState(brandParam);
  const [selectedAvailability, setSelectedAvailability] = useState<Availability | undefined>(availabilityParam);
  const [selectedSort, setSelectedSort] = useState(sortParam);
  const [minPrice, setMinPrice] = useState<number | undefined>(minPriceParam);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(maxPriceParam);

  // Sync state when URL searchParams change
  useEffect(() => {
    setSearchQuery(qParam);
    setSelectedCategory(categoryParam);
    setSelectedBrand(brandParam);
    setSelectedAvailability(availabilityParam);
    setSelectedSort(sortParam);
    setMinPrice(minPriceParam);
    setMaxPrice(maxPriceParam);
  }, [qParam, categoryParam, brandParam, availabilityParam, sortParam, minPriceParam, maxPriceParam]);

  // Load categories and products
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [cats, prodsRes] = await Promise.all([
          getCategories(),
          getProducts({
            q: searchQuery,
            category_slug: selectedCategory,
            brand: selectedBrand,
            availability: selectedAvailability,
            sort: selectedSort,
            min_price: minPrice,
            max_price: maxPrice,
          })
        ]);
        setCategories(cats);
        setProducts(prodsRes.data);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [searchQuery, selectedCategory, selectedBrand, selectedAvailability, selectedSort, minPrice, maxPrice]);

  // Update URL helper
  const updateUrl = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (val) {
        params.set(key, val);
      } else {
        params.delete(key);
      }
    });
    params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  };

  const handleCategoryChange = (slug: string) => {
    const newVal = selectedCategory === slug ? undefined : slug;
    setSelectedCategory(newVal || '');
    updateUrl({ category_slug: newVal });
  };

  const handleBrandChange = (brand: string) => {
    const newVal = selectedBrand === brand ? undefined : brand;
    setSelectedBrand(newVal || '');
    updateUrl({ brand: newVal });
  };

  const handleAvailabilityChange = (avail: Availability) => {
    const newVal = selectedAvailability === avail ? undefined : avail;
    setSelectedAvailability(newVal);
    updateUrl({ availability: newVal });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedSort(val);
    updateUrl({ sort: val });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl({ q: searchQuery.trim() || undefined });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedBrand('');
    setSelectedAvailability(undefined);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSelectedSort('newest');
    router.push('/products');
  };

  const brandsList = useMemo(() => {
    return ['Hikvision', 'CP PLUS', 'Luminous', 'Havells', 'Schneider Electric', 'Dahua', 'NC Electro Pro'];
  }, []);

  const hasActiveFilters = !!(searchQuery || selectedCategory || selectedBrand || selectedAvailability || minPrice || maxPrice);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <StoreHeader />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold">Shop Electronics</span>
            {selectedCategory && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-blue-600 font-semibold capitalize">{selectedCategory.replace('-', ' ')}</span>
              </>
            )}
          </nav>

          {/* Page Heading & Controls Bar */}
          <div className="flex flex-col gap-5 pb-6 border-b border-slate-200">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
                  {selectedCategory ? `${categories.find(c => c.slug === selectedCategory)?.name || 'Category'} in Guwahati` : 'All Electronics & Electricals'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Showing {products.length} verified products with local Guwahati dispatch & installation support.
                </p>
              </div>

              {/* Search & Sort Controls */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Dedicated Product Search Input in Shop Page */}
                <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        updateUrl({ q: searchQuery.trim() || undefined });
                      }
                    }}
                    placeholder="Search in catalog..."
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-9 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        updateUrl({ q: undefined });
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </form>

                {/* Mobile Filter Button */}
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-sm"
                >
                  <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                  <span>Filters {hasActiveFilters ? '(Active)' : ''}</span>
                </button>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm text-xs font-medium text-slate-700">
                  <span className="text-slate-400 hidden sm:inline">Sort:</span>
                  <select
                    value={selectedSort}
                    onChange={handleSortChange}
                    className="bg-transparent font-bold text-slate-900 outline-none cursor-pointer"
                  >
                    <option value="newest">Newest Arrivals</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="name_asc">Name: A to Z</option>
                    <option value="name_desc">Name: Z to A</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filter Chips / Pills */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-slate-400 font-medium">Active filters:</span>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                    <span>Search: &quot;{searchQuery}&quot;</span>
                    <button 
                      onClick={() => { 
                        setSearchQuery(''); 
                        updateUrl({ q: undefined }); 
                      }}
                      className="hover:text-blue-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-semibold border border-slate-200">
                    <span>Category: {categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}</span>
                    <button onClick={() => handleCategoryChange(selectedCategory)} className="hover:text-slate-950">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedBrand && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-semibold border border-slate-200">
                    <span>Brand: {selectedBrand}</span>
                    <button onClick={() => handleBrandChange(selectedBrand)} className="hover:text-slate-950">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedAvailability && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-semibold border border-slate-200">
                    <span>Stock: {selectedAvailability.replace('_', ' ')}</span>
                    <button onClick={() => handleAvailabilityChange(selectedAvailability)} className="hover:text-slate-950">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {(minPrice !== undefined || maxPrice !== undefined) && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-semibold border border-slate-200">
                    <span>Price: ₹{minPrice || 0} - ₹{maxPrice || '∞'}</span>
                    <button 
                      onClick={() => {
                        setMinPrice(undefined);
                        setMaxPrice(undefined);
                        updateUrl({ min_price: undefined, max_price: undefined });
                      }}
                      className="hover:text-slate-950"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-2 ml-1"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* Main Layout: Filters Sidebar + Products Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
            
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-6 sticky top-24">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2 font-bold text-slate-950 text-sm">
                    <Filter className="w-4 h-4 text-blue-600" />
                    <span>Filter Products</span>
                  </div>
                  {hasActiveFilters && (
                    <button
                      onClick={handleClearFilters}
                      className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>

                {/* Keyword Search in Sidebar */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Keyword Search
                  </h4>
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          updateUrl({ q: searchQuery.trim() || undefined });
                        }
                      }}
                      placeholder="e.g. Inverter, CCTV..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          updateUrl({ q: undefined });
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </form>
                </div>

                {/* Categories Filter */}
                <div className="pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Categories
                  </h4>
                  <div className="space-y-1.5">
                    {categories.map(cat => {
                      const isSelected = selectedCategory === cat.slug;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => handleCategoryChange(cat.slug)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                            isSelected
                              ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>{cat.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Brands Filter */}
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Brands
                  </h4>
                  <div className="space-y-1.5">
                    {brandsList.map(brand => {
                      const isSelected = selectedBrand === brand;
                      return (
                        <button
                          key={brand}
                          onClick={() => handleBrandChange(brand)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                            isSelected
                              ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>{brand}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Availability Filter */}
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Availability
                  </h4>
                  <div className="space-y-2">
                    {[
                      { label: 'In Stock in Guwahati', val: 'in_stock' as Availability },
                      { label: 'Limited Stock', val: 'low_stock' as Availability },
                    ].map(item => {
                      const isSelected = selectedAvailability === item.val;
                      return (
                        <label
                          key={item.val}
                          className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-slate-900"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleAvailabilityChange(item.val)}
                            className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                          />
                          <span>{item.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Price Range (₹)
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min ₹"
                      value={minPrice ?? ''}
                      onChange={e => {
                        const val = e.target.value ? Number(e.target.value) : undefined;
                        setMinPrice(val);
                        updateUrl({ min_price: val?.toString() });
                      }}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs outline-none focus:border-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Max ₹"
                      value={maxPrice ?? ''}
                      onChange={e => {
                        const val = e.target.value ? Number(e.target.value) : undefined;
                        setMaxPrice(val);
                        updateUrl({ max_price: val?.toString() });
                      }}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

              </div>
            </aside>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {loading && products.length === 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <div key={n} className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse space-y-4">
                      <div className="aspect-square bg-slate-200 rounded-xl" />
                      <div className="h-4 bg-slate-200 rounded w-2/3" />
                      <div className="h-4 bg-slate-200 rounded w-1/3" />
                    </div>
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 max-w-md mx-auto my-12">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">No electronics match your filters</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Try adjusting your brand, category or price range settings, or reset your filters to see the full Guwahati catalog.
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl p-6 flex flex-col justify-between z-50 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="font-black text-base text-slate-900">Filter Catalog</h3>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Mobile Drawer Keyword Search */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Search Products</h4>
                <form
                  onSubmit={e => {
                    handleSearchSubmit(e);
                    setMobileFilterOpen(false);
                  }}
                  className="relative"
                >
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search keywords..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        updateUrl({ q: undefined });
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </form>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Categories</h4>
                <div className="space-y-1">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                        selectedCategory === cat.slug ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Brands</h4>
                <div className="space-y-1">
                  {brandsList.map(brand => (
                    <button
                      key={brand}
                      onClick={() => handleBrandChange(brand)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                        selectedBrand === brand ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md"
              >
                Apply Filters ({products.length} Products)
              </button>
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    handleClearFilters();
                    setMobileFilterOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
                >
                  Reset All
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <StoreFooter />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading NC Electro Catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
