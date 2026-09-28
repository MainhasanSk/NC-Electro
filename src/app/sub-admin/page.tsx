'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Truck, 
  UserCheck, 
  ArrowRight, 
  Award, 
  Package, 
  MapPin, 
  ArrowLeft,
  RefreshCw,
  Sliders,
  Check,
  Wrench
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Order, OrderStatus, SellerSupplier, RewardPoint } from '@/types';
import { getAdminOrders, acceptOrder, assignSellerSupplier, updateOrderStatus } from '@/lib/api/admin/orders';
import { getSellerSuppliers } from '@/lib/api/admin/suppliers';
import { getRewardsLedger } from '@/lib/api/admin/analytics';
import { ORDER_STATUS_CONFIG, ALLOWED_TRANSITIONS } from '@/lib/constants/orderStatus';

export default function SubAdminOperationsPage() {
  const { user, role, switchRole } = useAuth();
  const { toast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [suppliers, setSuppliers] = useState<SellerSupplier[]>([]);
  const [rewards, setRewards] = useState<RewardPoint[]>([]);
  const [loading, setLoading] = useState(true);

  // Acceptance conflict state
  const [conflictMessage, setConflictMessage] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Supplier selection map per order
  const [selectedSupplierMap, setSelectedSupplierMap] = useState<Record<string, string>>({});

  const loadData = async () => {
    setLoading(true);
    try {
      const [allOrders, allSuppliers, allRewards] = await Promise.all([
        getAdminOrders(),
        getSellerSuppliers(),
        getRewardsLedger(),
      ]);
      setOrders(allOrders);
      setSuppliers(allSuppliers);
      setRewards(allRewards);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentUserId = user?.id || 'user-subadmin-1';
  const currentUserName = user?.full_name || 'Pranab Saikia (Sub-Admin)';

  // Unaccepted orders waiting in queue
  const unacceptedOrders = orders.filter(o => !o.accepted_by_id && o.status === 'order_placed');

  // My active assigned orders
  const myAssignedOrders = orders.filter(o => o.accepted_by_id === currentUserId && !['delivered', 'cancelled', 'returned'].includes(o.status));

  // My delivered fulfilled orders
  const myDeliveredOrders = orders.filter(o => o.accepted_by_id === currentUserId && o.status === 'delivered');

  // My reward points total
  const myPointsTotal = rewards.filter(r => r.user_id === currentUserId).reduce((sum, r) => sum + r.points, 0);

  // Handle first-accept order with race condition handling
  const handleAccept = async (orderId: string) => {
    setProcessingId(orderId);
    setConflictMessage(null);
    try {
      const updated = await acceptOrder(orderId, currentUserId, currentUserName);
      toast(`Order ${updated.order_number} accepted! You are now responsible for fulfillment.`, 'success');
      loadData();
    } catch (err: any) {
      if (err.code === 'ORDER_ALREADY_ACCEPTED') {
        setConflictMessage(`ORDER ALREADY ACCEPTED: Another Sub-Admin manager accepted this order first. Your queue has been refreshed.`);
        toast('Another Sub-Admin accepted this order first.', 'warning');
      } else {
        toast(err.message || 'Failed to accept order.', 'error');
      }
      loadData();
    } finally {
      setProcessingId(null);
    }
  };

  // Handle seller/supplier internal attribution
  const handleAssignSupplier = async (orderId: string) => {
    const supplierId = selectedSupplierMap[orderId];
    if (!supplierId) {
      toast('Please choose a supplier from the list.', 'warning');
      return;
    }

    try {
      await assignSellerSupplier(orderId, supplierId, currentUserName);
      toast('Fulfillment stockist assigned successfully.', 'success');
      loadData();
    } catch (err: any) {
      toast(err.message || 'Failed to assign stockist.', 'error');
    }
  };

  // Handle sequential status transition
  const handleStatusTransition = async (orderId: string, toStatus: OrderStatus) => {
    try {
      const updated = await updateOrderStatus(orderId, toStatus, currentUserName);
      if (toStatus === 'delivered') {
        toast(`Order ${updated.order_number} marked DELIVERED! +1 Reward Point credited.`, 'success');
      } else {
        toast(`Order status moved to ${toStatus.replace('_', ' ')}.`, 'info');
      }
      loadData();
    } catch (err: any) {
      toast(err.message || 'Invalid status transition.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* Top Operations Header */}
      <header className="bg-slate-950 text-white px-6 py-4 border-b border-slate-900 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-slate-400 hover:text-white mr-2">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-white">NC ELECTRO</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-900/80 text-indigo-300 border border-indigo-700/50">
                  SUB-ADMIN OPERATIONS
                </span>
              </div>
              <div className="text-xs text-slate-400">Guwahati Fast-Dispatch Desk • Coordinator: {currentUserName}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800 transition-colors"
              title="Refresh Queue"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <Link
              href="/admin"
              className="text-xs font-bold text-purple-400 hover:text-purple-300 bg-purple-950/60 border border-purple-800/40 px-3 py-1.5 rounded-xl"
            >
              Switch to Super Admin
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Race Condition Conflict Banner */}
        {conflictMessage && (
          <div className="p-4 rounded-2xl bg-amber-500/15 border-2 border-amber-500 text-amber-900 flex items-start gap-3 animate-shake">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <strong className="font-bold text-sm text-amber-950">First-Accept Race Notice</strong>
              <p>{conflictMessage}</p>
            </div>
          </div>
        )}

        {/* Operational KPI Strip (Spec Section 38) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Unaccepted Queue</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-3xl font-black text-amber-600">
              {unacceptedOrders.length}
            </div>
            <div className="text-[11px] text-slate-400">Waiting for local coordinator acceptance</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">My Active Orders</span>
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-black text-blue-600">
              {myAssignedOrders.length}
            </div>
            <div className="text-[11px] text-slate-400">Under your fulfillment management</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">My Delivered Orders</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-emerald-600">
              {myDeliveredOrders.length}
            </div>
            <div className="text-[11px] text-slate-400">Completed deliveries across Guwahati</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1 bg-gradient-to-br from-white to-amber-50/50">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">My Reward Points</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-3xl font-black text-slate-950">
              {myPointsTotal} <span className="text-sm font-semibold text-amber-600">Pts</span>
            </div>
            <div className="text-[11px] text-slate-400">1 pt per order at Delivered stage</div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* UNACCEPTED ORDER QUEUE (ATOMIC FIRST-ACCEPT EXPERIENCE)                   */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-950">New Available Orders</h2>
                {unacceptedOrders.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold animate-pulse">
                    {unacceptedOrders.length} Ready
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Incoming customer orders. The first Sub-Admin to click Accept wins responsibility.
              </p>
            </div>
          </div>

          {unacceptedOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {unacceptedOrders.map(order => (
                <div
                  key={order.id}
                  className="p-5 rounded-2xl border-2 border-amber-200 bg-amber-50/30 hover:bg-amber-50/60 transition-all space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-200/80 text-amber-900 font-mono">
                        NEW ORDER
                      </span>
                      <div className="text-base font-black text-slate-950 font-mono mt-1">
                        #{order.order_number}
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        Customer: <strong className="text-slate-900">{order.customer_name}</strong> • Phone: {order.customer_phone}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-black text-blue-600">
                        ₹{order.total.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Pincode: <strong>{order.address.pincode}</strong>
                      </div>
                    </div>
                  </div>

                  {order.has_installation && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-blue-100/70 border border-blue-300 rounded-xl text-xs font-bold text-blue-900">
                      <Wrench className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                      <span>Installation Service Requested (+₹{order.installation_fee || 499}) — Technician Dispatch Required</span>
                    </div>
                  )}

                  <div className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200/80 space-y-1">
                    <div className="font-semibold text-slate-900">Items:</div>
                    {order.items.map(item => (
                      <div key={item.id} className="truncate">
                        • {item.quantity}x {item.product_name}
                      </div>
                    ))}
                    {order.customer_note && (
                      <div className="text-amber-800 italic pt-1 text-[11px]">
                        Note: &ldquo;{order.customer_note}&rdquo;
                      </div>
                    )}
                  </div>

                  {/* Atomic Accept Button (Spec Section 37) */}
                  <button
                    onClick={() => handleAccept(order.id)}
                    disabled={processingId === order.id}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {processingId === order.id ? (
                      <span>Validating with backend...</span>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 fill-slate-950" />
                        <span>ACCEPT ORDER (TAKE OWNERSHIP)</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-100">
              No new orders waiting. All incoming customer orders have been accepted by coordinators.
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* MY ACTIVE ASSIGNED ORDERS (DISPATCH, SUPPLIER & TRANSITIONS)              */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100 space-y-0.5">
            <h2 className="text-lg font-black text-slate-950">My Active Orders for Dispatch</h2>
            <p className="text-xs text-slate-500">
              Assign internal suppliers in Guwahati and advance orders along the authorized lifecycle.
            </p>
          </div>

          {myAssignedOrders.length > 0 ? (
            <div className="space-y-6">
              {myAssignedOrders.map(order => {
                const meta = ORDER_STATUS_CONFIG[order.status];
                const allowedTransitions = ALLOWED_TRANSITIONS[order.status] || [];

                return (
                  <div
                    key={order.id}
                    className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-base text-slate-950">{order.order_number}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${meta.badgeClass}`}>
                            {meta.label}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Assigned to you at {order.accepted_at ? new Date(order.accepted_at).toLocaleTimeString('en-IN') : 'recently'}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-base font-black text-slate-950">₹{order.total.toLocaleString('en-IN')}</div>
                        <div className="text-xs text-slate-500">Pincode: {order.address.pincode} ({order.address.city})</div>
                      </div>
                    </div>

                    {/* Customer & Address Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                        <div className="font-bold text-slate-700">Delivery Address:</div>
                        <div className="text-slate-900 font-semibold">{order.address.recipient_name} ({order.address.phone})</div>
                        <div className="text-slate-600">{order.address.address_line1}, {order.address.city} - {order.address.pincode}</div>
                        {order.has_installation && (
                          <div className="mt-1 flex items-center gap-1.5 text-blue-700 font-bold text-[11px]">
                            <Wrench className="w-3 h-3 text-blue-600" />
                            <span>Installation Service (+₹{order.installation_fee || 499})</span>
                          </div>
                        )}
                      </div>

                      {/* Internal Supplier Allocation (Spec Section 39 & 54) */}
                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                        <div className="font-bold text-slate-700 flex items-center justify-between">
                          <span>Allocated Stockist / Supplier:</span>
                          {order.seller_supplier_name && (
                            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                              Assigned
                            </span>
                          )}
                        </div>

                        {order.seller_supplier_name ? (
                          <div className="font-semibold text-slate-900 text-xs">
                            {order.seller_supplier_name}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <select
                              value={selectedSupplierMap[order.id] || ''}
                              onChange={e => setSelectedSupplierMap({ ...selectedSupplierMap, [order.id]: e.target.value })}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs outline-none bg-slate-50"
                            >
                              <option value="">Select Guwahati Stockist...</option>
                              {suppliers.map(s => (
                                <option key={s.id} value={s.id}>
                                  {s.business_name} ({s.city} - {s.pincode})
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleAssignSupplier(order.id)}
                              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-bold text-xs shrink-0"
                            >
                              Assign
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Operational Transition Buttons */}
                    <div className="pt-2 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 mr-2">Advance Stage:</span>
                      
                      {order.status === 'accepted' && (
                        <button
                          onClick={() => handleStatusTransition(order.id, 'processing')}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
                        >
                          → Move to Processing (Stock Allocated)
                        </button>
                      )}

                      {order.status === 'processing' && (
                        <button
                          onClick={() => handleStatusTransition(order.id, 'ready_for_dispatch')}
                          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
                        >
                          → Move to Ready for Dispatch
                        </button>
                      )}

                      {order.status === 'ready_for_dispatch' && (
                        <button
                          onClick={() => handleStatusTransition(order.id, 'shipped')}
                          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs"
                        >
                          → Handover to Courier / Fleet (Shipped)
                        </button>
                      )}

                      {order.status === 'shipped' && (
                        <button
                          onClick={() => handleStatusTransition(order.id, 'out_for_delivery')}
                          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
                        >
                          → Out for Delivery to Customer
                        </button>
                      )}

                      {order.status === 'out_for_delivery' && (
                        <button
                          onClick={() => handleStatusTransition(order.id, 'delivered')}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>Mark Delivered (Earn 1 Reward Point)</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              You currently have no active orders in your dispatch queue. Accept orders from the queue above.
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* MY REWARDS LEDGER (SPEC SECTION 62)                                       */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-950">Sub-Admin Rewards Ledger</h2>
              <p className="text-xs text-slate-500">
                1 reward point awarded automatically upon order reaching DELIVERED stage.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Total Points: </span>
              <strong className="text-lg font-black text-amber-600 font-mono">{myPointsTotal}</strong>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider">
                  <th className="py-2">Date</th>
                  <th className="py-2">Order #</th>
                  <th className="py-2">Reason</th>
                  <th className="py-2 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rewards.filter(r => r.user_id === currentUserId).map(r => (
                  <tr key={r.id}>
                    <td className="py-2.5 text-slate-500">
                      {new Date(r.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-2.5 font-mono font-bold text-slate-900">{r.order_number}</td>
                    <td className="py-2.5 text-slate-600">{r.reason}</td>
                    <td className="py-2.5 text-right font-black text-emerald-600 font-mono">+{r.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
}
