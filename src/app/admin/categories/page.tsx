'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Layers, 
  Plus, 
  Search, 
  CheckCircle2, 
  Edit3, 
  Trash2,
  X
} from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Category } from '@/types';
import { getCategories } from '@/lib/api/products';
import { localStore } from '@/lib/api/store';
import { useToast } from '@/context/ToastContext';

export default function AdminCategoriesPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen flex bg-slate-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader 
          title="Product Categories & Taxonomy" 
          subtitle="Manage catalog groupings, sub-category hierarchy, and storefront navigation"
        />

        <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Slug</th>
                    <th className="pb-3">Sub-Categories</th>
                    <th className="pb-3 text-center">Sort Order</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categories.map(cat => (
                    <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 relative overflow-hidden shrink-0 border border-slate-200">
                            <Image
                              src={cat.image_url}
                              alt={cat.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{cat.name}</div>
                            <div className="text-[10px] text-slate-400 line-clamp-1">{cat.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 font-mono font-medium text-slate-600">{cat.slug}</td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-1">
                          {cat.sub_categories.map(sub => (
                            <span key={sub.id} className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                              {sub.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 text-center font-bold font-mono text-slate-900">{cat.sort_order}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
