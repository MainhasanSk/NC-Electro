'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Warehouse, 
  Search, 
  Edit3, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  X,
  RotateCcw,
  Check
} from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Product } from '@/types';
import { getAdminProducts, adjustStock } from '@/lib/api/admin/inventory';
import { useToast } from '@/context/ToastContext';

export default function AdminStockPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newStock, setNewStock] = useState<number>(0);
  const [newThreshold, setNewThreshold] = useState<number>(5);

  const loadData = async () => {
    setLoading(true);
    try {
      const prods = await getAdminProducts();
      setProducts(prods);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAdjustModal = (p: Product) => {
    setEditingProduct(p);
    setNewStock(p.stock_quantity);
    setNewThreshold(p.low_stock_threshold);
  };

  const handleSaveStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      await adjustStock(editingProduct.id, newStock, newThreshold);
      toast(`Stock for "${editingProduct.name}" updated to ${newStock} units.`, 'success');
      setEditingProduct(null);
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
          title="Inventory & Stock Management" 
          subtitle="Monitor real-time warehouse inventory, reserved quantities, and reorder levels"
        />

        <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
          
          <div className="flex items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search stock by SKU, product, brand..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs outline-none focus:border-blue-500 shadow-xs"
              />
            </div>
          </div>

          {/* Stock Table (Spec Section 40) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="pb-3">Product Name</th>
                    <th className="pb-3">SKU</th>
                    <th className="pb-3 text-center">In Warehouse</th>
                    <th className="pb-3 text-center">Reserved</th>
                    <th className="pb-3 text-center">Available</th>
                    <th className="pb-3 text-center">Reorder Threshold</th>
                    <th className="pb-3">Stock Status</th>
                    <th className="pb-3 text-right">Adjustment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map(p => {
                    const available = Math.max(0, p.stock_quantity - p.reserved_quantity);
                    return (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3">
                          <div className="font-bold text-slate-900 line-clamp-1">{p.name}</div>
                          <div className="text-[10px] text-blue-600 font-bold uppercase">{p.brand}</div>
                        </td>
                        <td className="py-3 font-mono text-slate-600 font-medium">{p.sku}</td>
                        <td className="py-3 text-center font-bold text-slate-900">{p.stock_quantity}</td>
                        <td className="py-3 text-center font-mono text-slate-500">{p.reserved_quantity}</td>
                        <td className="py-3 text-center font-bold text-blue-600">{available}</td>
                        <td className="py-3 text-center font-mono text-slate-500">{p.low_stock_threshold}</td>
                        <td className="py-3">
                          {p.availability === 'in_stock' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                              <span>In Stock</span>
                            </span>
                          )}
                          {p.availability === 'low_stock' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-amber-50 text-amber-700 border border-amber-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              <span>Low Stock</span>
                            </span>
                          )}
                          {p.availability === 'out_of_stock' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-rose-50 text-rose-700 border border-rose-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                              <span>Out of Stock</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => openAdjustModal(p)}
                            className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 transition-colors flex items-center gap-1 ml-auto"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Adjust</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>

      {/* Adjust Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-black text-base text-slate-950">Adjust Inventory Level</h3>
                <div className="text-xs text-slate-500 truncate max-w-xs">{editingProduct.name}</div>
              </div>
              <button onClick={() => setEditingProduct(null)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleSaveStock} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">New Total Stock Units *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={newStock}
                  onChange={e => setNewStock(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-500 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Low-Stock Alert Threshold *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={newThreshold}
                  onChange={e => setNewThreshold(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-500 text-sm font-bold"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500">
                Notice: Reserved quantities from active customer checkout carts remain backend-governed and are decremented upon order dispatch.
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20"
                >
                  Save Stock Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
