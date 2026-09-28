'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  MapPin, 
  UserCheck, 
  ShieldCheck, 
  FileText, 
  Truck, 
  AlertTriangle,
  XCircle,
  RotateCcw,
  Check,
  Wrench
} from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Order, OrderStatus, SellerSupplier } from '@/types';
import { getOrderById } from '@/lib/api/orders';
import { assignSellerSupplier, updateOrderStatus } from '@/lib/api/admin/orders';
import { getSellerSuppliers } from '@/lib/api/admin/suppliers';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ORDER_STATUS_CONFIG, ALLOWED_TRANSITIONS } from '@/lib/constants/orderStatus';

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const { user } = useAuth();
  const { toast } = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [suppliers, setSuppliers] = useState<SellerSupplier[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [transitionNote, setTransitionNote] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ord, sups] = await Promise.all([
        getOrderById(orderId),
        getSellerSuppliers(),
      ]);
      setOrder(ord);
      setSuppliers(sups);
      if (ord?.seller_supplier_id) {
        setSelectedSupplierId(ord.seller_supplier_id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      loadData();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex bg-slate-100">
        <AdminSidebar />
        <div className="flex-1 p-8 text-center text-sm text-slate-500">Loading order...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex bg-slate-100">
        <AdminSidebar />
        <div className="flex-1 p-8 text-center space-y-4">
          <h2 className="text-xl font-bold">Order Not Found</h2>
          <Link href="/admin/orders" className="text-blue-600 font-bold text-xs">Back to Orders</Link>
        </div>
      </div>
    );
  }

  const meta = ORDER_STATUS_CONFIG[order.status] || ORDER_STATUS_CONFIG['order_placed'];
  const allowed = ALLOWED_TRANSITIONS[order.status] || [];

  const handleSupplierAssign = async () => {
    if (!selectedSupplierId) {
      toast('Please choose a supplier to assign.', 'warning');
      return;
    }
    try {
      await assignSellerSupplier(order.id, selectedSupplierId, user?.full_name || 'Super Admin');
      toast('Fulfillment supplier updated.', 'success');
      loadData();
    } catch (err: any) {
      toast(err.message, 'error');
    }
  };

  const handleTransition = async (toStatus: OrderStatus) => {
    try {
      await updateOrderStatus(order.id, toStatus, user?.full_name || 'Super Admin', transitionNote || undefined);
      toast(`Order transitioned to ${toStatus.replace('_', ' ')}.`, 'success');
      setTransitionNote('');
      loadData();
    } catch (err: any) {
      toast(err.message, 'error');
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader 
          title={`Order Operations #${order.order_number}`}
          subtitle={`Customer: ${order.customer_name} • Guwahati Pincode: ${order.address.pincode}`}
        />

        <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto">
          
          <div className="flex items-center justify-between">
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Orders List</span>
            </Link>

            <Link
              href={`/account/orders/${order.id}/invoice`}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-xs hover:bg-slate-50 flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Open Invoice Document</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 8 Cols: Order items and history */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Order Status & Actions Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Current Stage</div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${meta.badgeClass}`}>
                        <span className={`w-2 h-2 rounded-full ${meta.dotColor}`} />
                        <span>{meta.label}</span>
                      </span>
                      {order.has_installation && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          <Wrench className="w-3 h-3 text-blue-600" />
                          <span>Installation Service (+₹{order.installation_fee || 499})</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Gross Value</div>
                    <div className="text-xl font-black text-slate-950 font-mono">₹{order.total.toLocaleString('en-IN')}</div>
                  </div>
                </div>

                {/* Transition Controls */}
                <div className="space-y-3 pt-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Advance Order Status
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Optional operational transition note (e.g. Technician dispatched)..."
                      value={transitionNote}
                      onChange={e => setTransitionNote(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-blue-500 mb-3"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {allowed.map(statusKey => {
                      const isCancel = statusKey === 'cancelled';
                      const isReturn = statusKey === 'returned';
                      return (
                        <button
                          key={statusKey}
                          onClick={() => handleTransition(statusKey)}
                          className={`px-4 py-2 rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 ${
                            isCancel
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                              : isReturn
                              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          <span>Move to {statusKey.replace('_', ' ').toUpperCase()}</span>
                        </button>
                      );
                    })}

                    {allowed.length === 0 && (
                      <span className="text-xs text-slate-400 italic">This order is at a terminal status ({order.status}).</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Items Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-950 text-base pb-3 border-b border-slate-100">
                  Line Items
                </h3>
                <div className="divide-y divide-slate-100">
                  {order.items.map(item => (
                    <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{item.product_name}</div>
                        <div className="text-slate-400 font-mono text-[11px] mt-0.5">Brand: {item.brand} • SKU: {item.sku}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900">₹{item.line_total.toLocaleString('en-IN')}</div>
                        <div className="text-slate-500">{item.quantity} units @ ₹{item.price.toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Financial Summary */}
                <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-slate-900">₹{order.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount:</span>
                      <span className="font-semibold">-₹{order.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery:</span>
                    <span className="font-semibold text-slate-900">{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
                  </div>
                  {order.has_installation && (
                    <div className="flex justify-between text-blue-600 font-medium">
                      <span>Installation Service (On-Site):</span>
                      <span className="font-semibold font-mono">+₹{(order.installation_fee || 499).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>GST (18% Included):</span>
                    <span className="font-semibold text-slate-900">₹{order.tax.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-sm text-slate-950">
                    <span>Total Order Amount:</span>
                    <span className="font-mono">₹{order.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Status Audit Log */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-950 text-base pb-3 border-b border-slate-100">
                  Lifecycle Audit History
                </h3>
                <div className="space-y-3">
                  {order.status_history.map(hist => (
                    <div key={hist.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-slate-900">{hist.changed_by_name}</div>
                        <div className="text-slate-600 mt-0.5">{hist.note}</div>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono shrink-0">
                        {new Date(hist.created_at).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right 4 Cols: Supplier allocation & customer details */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Internal Supplier Allocation (LLD Section 9.5) */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Seller / Supplier Record</span>
                </div>

                <div className="space-y-2 text-xs">
                  <label className="block text-slate-500 font-medium">Assign Guwahati Stockist:</label>
                  <select
                    value={selectedSupplierId}
                    onChange={e => setSelectedSupplierId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none bg-slate-50 font-medium"
                  >
                    <option value="">None Allocated</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.business_name} ({s.pincode})
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handleSupplierAssign}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                  >
                    Save Stockist Assignment
                  </button>
                  <p className="text-[10px] text-slate-400 italic">
                    Internal attribution only. No external message is transmitted in V1.
                  </p>
                </div>
              </div>

              {/* Sub-Admin Acceptance Attribution */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3 text-xs">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-slate-400 text-[11px]">
                  <UserCheck className="w-4 h-4 text-indigo-600" />
                  <span>Sub-Admin Acceptance</span>
                </div>
                {order.accepted_by_name ? (
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 text-sm">{order.accepted_by_name}</div>
                    <div className="text-slate-500">
                      Accepted at: {order.accepted_at ? new Date(order.accepted_at).toLocaleString('en-IN') : 'recently'}
                    </div>
                  </div>
                ) : (
                  <div className="text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200">
                    Order is currently unaccepted.
                  </div>
                )}
              </div>

              {/* Customer & Address Details */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3 text-xs">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-slate-400 text-[11px]">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Customer & Destination</span>
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-sm">{order.customer_name}</div>
                  <div className="text-slate-600">{order.customer_email}</div>
                  <div className="text-slate-600 font-mono">{order.customer_phone}</div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-slate-600 leading-relaxed">
                  <strong>Delivery Address:</strong><br />
                  {order.address.address_line1}, {order.address.city}, {order.address.state} — Pincode: <strong className="font-mono text-slate-900">{order.address.pincode}</strong>
                </div>

                {order.customer_note && (
                  <div className="pt-2 border-t border-slate-100 text-slate-600 italic">
                    Note: &ldquo;{order.customer_note}&rdquo;
                  </div>
                )}
              </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
