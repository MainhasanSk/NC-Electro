'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Package, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  X,
  Layers,
  Wrench
} from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Product, Category } from '@/types';
import { getAdminProducts, createProduct, updateProduct, deleteProduct } from '@/lib/api/admin/inventory';
import { getCategories } from '@/lib/api/products';
import { useToast } from '@/context/ToastContext';

export default function AdminProductsPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [brand, setBrand] = useState('Hikvision');
  const [categorySlug, setCategorySlug] = useState('cctv');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(1999);
  const [originalPrice, setOriginalPrice] = useState(2499);
  const [stock, setStock] = useState(25);
  const [threshold, setThreshold] = useState(5);
  const [image1, setImage1] = useState('https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80');
  const [hasInstallation, setHasInstallation] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        getAdminProducts(),
        getCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku || price <= 0) {
      toast('Please enter valid product details.', 'error');
      return;
    }
    if (price > originalPrice) {
      toast('Discounted price cannot be greater than original price.', 'error');
      return;
    }

    const catObj = categories.find(c => c.slug === categorySlug) || {
      id: 'cat-cctv',
      name: 'CCTV & Security',
      slug: 'cctv',
    };

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const discountPct = Math.round(((originalPrice - price) / originalPrice) * 100);

    try {
      await createProduct({
        name,
        slug,
        sku,
        brand,
        description,
        price,
        original_price: originalPrice,
        discount_percentage: discountPct > 0 ? discountPct : undefined,
        stock_quantity: stock,
        reserved_quantity: 0,
        low_stock_threshold: threshold,
        availability: stock > threshold ? 'in_stock' : stock > 0 ? 'low_stock' : 'out_of_stock',
        category: { id: catObj.id, name: catObj.name, slug: catObj.slug },
        primary_image: image1,
        images: [{ id: '1', url: image1, is_primary: true, sort_order: 1 }],
        specifications: [
          { key: 'Warranty', value: '2 Years Manufacturer', group: 'General' },
          { key: 'Location Dispatch', value: 'Guwahati Warehouse', group: 'Logistics' },
        ],
        is_active: true,
        has_installation_support: hasInstallation,
      });

      toast(`Product "${name}" created successfully.`, 'success');
      setShowModal(false);
      loadData();
    } catch (err: any) {
      toast(err.message, 'error');
    }
  };

  const handleToggleActive = async (prod: Product) => {
    try {
      await updateProduct(prod.id, { is_active: !prod.is_active });
      toast(`Product status changed to ${!prod.is_active ? 'Active' : 'Inactive'}.`, 'info');
      loadData();
    } catch (err: any) {
      toast(err.message, 'error');
    }
  };

  const filtered = products.filter(p => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="min-h-screen flex bg-slate-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader 
          title="Product Catalog Management" 
          subtitle="Manage electronics inventory, specifications, and Guwahati stock states"
        />

        <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products by SKU or name..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs outline-none focus:border-blue-500 shadow-xs"
              />
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="pb-3">Product</th>
                    <th className="pb-3">SKU</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Price</th>
                    <th className="pb-3">Stock Level</th>
                    <th className="pb-3">Installation</th>
                    <th className="pb-3">State</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map(prod => (
                    <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 relative overflow-hidden shrink-0 border border-slate-200">
                            <Image
                              src={prod.primary_image}
                              alt={prod.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 line-clamp-1">{prod.name}</div>
                            <div className="text-[10px] text-blue-600 font-bold uppercase">{prod.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 font-mono font-medium text-slate-600">{prod.sku}</td>
                      <td className="py-3 text-slate-700">{prod.category.name}</td>
                      <td className="py-3">
                        <div className="font-bold text-slate-900">₹{prod.price.toLocaleString('en-IN')}</div>
                        {prod.original_price > prod.price && (
                          <div className="text-[10px] text-slate-400 line-through">₹{prod.original_price.toLocaleString('en-IN')}</div>
                        )}
                      </td>
                      <td className="py-3">
                        <div className="font-bold text-slate-900">{prod.stock_quantity} units</div>
                        <div className="text-[10px] text-slate-400">Min. {prod.low_stock_threshold}</div>
                      </td>
                      <td className="py-3">
                        {prod.has_installation_support ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <Wrench className="w-3 h-3" /> Yes
                          </span>
                        ) : (
                          <span className="text-slate-400">No</span>
                        )}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          prod.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {prod.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleToggleActive(prod)}
                          className={`text-xs font-semibold px-2 py-1 rounded ${
                            prod.is_active ? 'text-amber-700 hover:bg-amber-50' : 'text-emerald-700 hover:bg-emerald-50'
                          }`}
                        >
                          {prod.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>

      {/* Create Product Modal (Spec Section 56) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-black text-lg text-slate-950">Add New Electronics Product</h3>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. CP Plus 4MP Smart Dome"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={e => setSku(e.target.value)}
                    placeholder="e.g. CP-DOME-4MP-HD"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={e => setBrand(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={categorySlug}
                    onChange={e => setCategorySlug(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Original Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={originalPrice}
                    onChange={e => setOriginalPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={e => setStock(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Low-Stock Alert *</label>
                  <input
                    type="number"
                    required
                    value={threshold}
                    onChange={e => setThreshold(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary Image URL (Clean High-Res) *</label>
                <input
                  type="url"
                  required
                  value={image1}
                  onChange={e => setImage1(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Detailed technical specifications..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-500 leading-relaxed"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasInstallation}
                    onChange={e => setHasInstallation(e.target.checked)}
                    className="rounded text-blue-600 h-4 w-4"
                  />
                  <span className="font-semibold text-slate-700">Eligible for Professional Installation in Guwahati</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20"
                >
                  Save & Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
