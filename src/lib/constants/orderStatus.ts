import { OrderStatus } from '@/types';

export interface OrderStatusMeta {
  key: OrderStatus;
  label: string;
  stepIndex: number;
  description: string;
  badgeClass: string;
  dotColor: string;
  customerMessage: string;
}

export const ORDER_LIFECYCLE_STEPS: OrderStatus[] = [
  'order_placed',
  'accepted',
  'processing',
  'ready_for_dispatch',
  'shipped',
  'out_for_delivery',
  'delivered',
];

export const ORDER_STATUS_CONFIG: Record<OrderStatus, OrderStatusMeta> = {
  order_placed: {
    key: 'order_placed',
    label: 'Order Placed',
    stepIndex: 0,
    description: 'Order successfully received in our system.',
    badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200',
    dotColor: 'bg-blue-600',
    customerMessage: 'We have received your order and are dispatching to our Guwahati team.',
  },
  accepted: {
    key: 'accepted',
    label: 'Order Accepted',
    stepIndex: 1,
    description: 'Assigned to a local fulfillment manager in Guwahati.',
    badgeClass: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    dotColor: 'bg-indigo-600',
    customerMessage: 'A dedicated Guwahati fulfillment manager has taken charge of your order.',
  },
  processing: {
    key: 'processing',
    label: 'Processing',
    stepIndex: 2,
    description: 'Items are being inspected and prepared from local inventory.',
    badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200',
    dotColor: 'bg-amber-500',
    customerMessage: 'Your items are being quality checked and prepped for dispatch.',
  },
  ready_for_dispatch: {
    key: 'ready_for_dispatch',
    label: 'Ready for Dispatch',
    stepIndex: 3,
    description: 'Packed and ready for delivery partner pickup.',
    badgeClass: 'bg-purple-50 text-purple-700 border border-purple-200',
    dotColor: 'bg-purple-600',
    customerMessage: 'Packed and staged for same-day delivery pickup.',
  },
  shipped: {
    key: 'shipped',
    label: 'In Transit / Shipped',
    stepIndex: 4,
    description: 'On route via local logistics.',
    badgeClass: 'bg-cyan-50 text-cyan-700 border border-cyan-200',
    dotColor: 'bg-cyan-600',
    customerMessage: 'Your package is on its way across Guwahati.',
  },
  out_for_delivery: {
    key: 'out_for_delivery',
    label: 'Out for Delivery',
    stepIndex: 5,
    description: 'Delivery technician is heading to your address.',
    badgeClass: 'bg-teal-50 text-teal-700 border border-teal-200',
    dotColor: 'bg-teal-600',
    customerMessage: 'Our delivery agent is out for delivery to your doorstep.',
  },
  delivered: {
    key: 'delivered',
    label: 'Delivered',
    stepIndex: 6,
    description: 'Successfully handed over to customer.',
    badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    dotColor: 'bg-emerald-600',
    customerMessage: 'Package delivered. Professional installation support is active.',
  },
  cancelled: {
    key: 'cancelled',
    label: 'Cancelled',
    stepIndex: -1,
    description: 'Order was cancelled.',
    badgeClass: 'bg-rose-50 text-rose-700 border border-rose-200',
    dotColor: 'bg-rose-600',
    customerMessage: 'This order has been cancelled.',
  },
  returned: {
    key: 'returned',
    label: 'Returned',
    stepIndex: -1,
    description: 'Item returned to warehouse.',
    badgeClass: 'bg-slate-100 text-slate-700 border border-slate-300',
    dotColor: 'bg-slate-500',
    customerMessage: 'This order has been marked as returned.',
  },
};

/**
 * Valid state transitions according to LLD state machine
 */
export const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  order_placed: ['accepted', 'cancelled'],
  accepted: ['processing', 'cancelled'],
  processing: ['ready_for_dispatch', 'cancelled'],
  ready_for_dispatch: ['shipped', 'cancelled'],
  shipped: ['out_for_delivery', 'cancelled'],
  out_for_delivery: ['delivered', 'cancelled'],
  delivered: ['returned'],
  cancelled: [],
  returned: [],
};
