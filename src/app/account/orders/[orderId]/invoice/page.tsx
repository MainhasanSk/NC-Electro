'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Printer, Download, ArrowLeft, Zap, ShieldCheck } from 'lucide-react';
import { Order } from '@/types';
import { getOrderById } from '@/lib/api/orders';

export default function InvoicePage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderId) {
      getOrderById(orderId).then(o => setOrder(o));
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="text-sm text-slate-500">Loading invoice document...</div>
      </div>
    );
  }

  const invoiceNumber = `INV-${order.order_number}`;

  return (
    <div className="min-h-screen bg-slate-100 py-8 sm:py-12 px-4 print:p-0 print:bg-white">
      {/* Top Action Bar (hidden in print) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          href={`/account/orders/${order.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Order Tracking</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Tax Invoice Document Paper */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-12 print:shadow-none print:border-none print:p-0">
        
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-8 border-b-2 border-slate-900 gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-950">NC ELECTRO</span>
            </div>
            <div className="text-xs text-slate-600">
              NC Electro Commercial Retail & Distribution LLP<br />
              GS Road Hub, Guwahati, Assam 781005<br />
              GSTIN: 18AABCN1234F1Z5 | PAN: AABCN1234F<br />
              contact@ncelectro.in | +91 98640 12345
            </div>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <div className="text-2xl font-black text-slate-950 uppercase tracking-wide">TAX INVOICE</div>
            <div className="text-xs font-mono font-bold text-blue-600">{invoiceNumber}</div>
            <div className="text-xs text-slate-500">
              Date: {new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
            <div className="text-xs text-slate-500 font-mono">Order: {order.order_number}</div>
          </div>
        </div>

        {/* Customer & Delivery Snapshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-6 border-b border-slate-200 text-xs">
          <div>
            <div className="font-bold text-slate-400 uppercase tracking-wider mb-1">Billed & Delivered To</div>
            <div className="font-bold text-sm text-slate-900">{order.address.recipient_name}</div>
            <div className="text-slate-600 leading-relaxed mt-0.5">
              {order.address.address_line1}, {order.address.city}<br />
              {order.address.state} — Pincode: <strong>{order.address.pincode}</strong><br />
              Phone: {order.address.phone} | Email: {order.customer_email}
            </div>
          </div>

          <div className="sm:text-right">
            <div className="font-bold text-slate-400 uppercase tracking-wider mb-1">Place of Supply</div>
            <div className="font-bold text-sm text-slate-900">Assam (State Code: 18)</div>
            <div className="text-slate-600 mt-1">
              Fulfillment Type: Fast Local Dispatch<br />
              Installation: <strong className={order.has_installation ? 'text-blue-600' : 'text-slate-600'}>{order.has_installation ? 'Requested (Technician Assigned)' : 'Doorstep Delivery Only'}</strong><br />
              Payment Mode: Non-Payment Invoice (V1 Scope)<br />
              Status: <span className="font-bold uppercase text-emerald-700">{order.status.replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="py-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-300 text-slate-500 uppercase tracking-wider">
                <th className="py-2 font-bold">#</th>
                <th className="py-2 font-bold">Description</th>
                <th className="py-2 font-bold">Brand / SKU</th>
                <th className="py-2 font-bold text-center">Qty</th>
                <th className="py-2 font-bold text-right">Unit Price</th>
                <th className="py-2 font-bold text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <tr key={item.id}>
                  <td className="py-3 text-slate-400 font-mono">{idx + 1}</td>
                  <td className="py-3 font-bold text-slate-900">{item.product_name}</td>
                  <td className="py-3 text-slate-500 font-mono text-[11px]">{item.brand} / {item.sku}</td>
                  <td className="py-3 text-center font-bold text-slate-800">{item.quantity}</td>
                  <td className="py-3 text-right text-slate-600">₹{item.price.toLocaleString('en-IN')}</td>
                  <td className="py-3 text-right font-bold text-slate-900">₹{item.line_total.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculation Totals */}
        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <div className="w-full sm:w-64 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-900">₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount:</span>
                <span className="font-semibold">-₹{order.discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Local Delivery:</span>
              <span className="font-semibold text-slate-900">
                {order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}
              </span>
            </div>
            {order.has_installation && (
              <div className="flex justify-between text-blue-600 font-semibold">
                <span>Installation Service:</span>
                <span>+₹{(order.installation_fee || 499).toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>CGST (9%):</span>
              <span className="font-semibold text-slate-900">₹{(order.tax / 2).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>SGST (9%):</span>
              <span className="font-semibold text-slate-900">₹{(order.tax / 2).toLocaleString('en-IN')}</span>
            </div>
            <div className="pt-2 border-t-2 border-slate-900 flex justify-between font-black text-sm text-slate-950">
              <span>Total Invoice Amount:</span>
              <span>₹{order.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="pt-10 mt-10 border-t border-slate-200 text-[11px] text-slate-500 space-y-2">
          <div className="font-bold text-slate-800">Terms & Conditions:</div>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Goods once sold are covered under authorized manufacturer warranty across Guwahati centers.</li>
            <li>On-site installation support is governed by certified NC Electro technician policies.</li>
            <li>This is a computer-generated tax document for NC Electro V1 operations.</li>
          </ol>
        </div>

      </div>
    </div>
  );
}
