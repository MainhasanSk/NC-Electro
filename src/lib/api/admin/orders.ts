import { Order, OrderStatus, RewardPoint } from '@/types';
import { localStore } from '../store';
import { ApiException } from '../client';
import { ALLOWED_TRANSITIONS } from '../../constants/orderStatus';

export interface AdminOrderFilters {
  status?: OrderStatus;
  accepted?: boolean;
  accepted_by?: string;
  customer?: string;
  order_number?: string;
  pincode?: string;
  seller_supplier_id?: string;
  date_from?: string;
  date_to?: string;
}

export async function getAdminOrders(filters: AdminOrderFilters = {}): Promise<Order[]> {
  let orders = localStore.getOrders();

  if (filters.status) {
    orders = orders.filter(o => o.status === filters.status);
  }

  if (filters.accepted !== undefined) {
    if (filters.accepted) {
      orders = orders.filter(o => !!o.accepted_by_id);
    } else {
      orders = orders.filter(o => !o.accepted_by_id);
    }
  }

  if (filters.accepted_by) {
    orders = orders.filter(o => o.accepted_by_id === filters.accepted_by);
  }

  if (filters.pincode) {
    orders = orders.filter(o => o.address.pincode === filters.pincode);
  }

  if (filters.seller_supplier_id) {
    orders = orders.filter(o => o.seller_supplier_id === filters.seller_supplier_id);
  }

  if (filters.order_number) {
    const term = filters.order_number.toLowerCase();
    orders = orders.filter(o => o.order_number.toLowerCase().includes(term));
  }

  if (filters.customer) {
    const term = filters.customer.toLowerCase();
    orders = orders.filter(o => 
      o.customer_name.toLowerCase().includes(term) || 
      o.customer_phone.includes(term)
    );
  }

  return orders;
}

/**
 * Atomic first-accept order operation strictly implementing LLD section 5.4 & 9.5
 */
export async function acceptOrder(orderId: string, subAdminId: string, subAdminName: string): Promise<Order> {
  const orders = localStore.getOrders();
  const index = orders.findIndex(o => o.id === orderId);
  if (index === -1) {
    throw new ApiException('RESOURCE_NOT_FOUND', 'Order not found.', 404);
  }

  const order = orders[index];

  // Race check: If order has already been accepted by another sub-admin
  if (order.accepted_by_id && order.accepted_by_id !== subAdminId) {
    throw new ApiException(
      'ORDER_ALREADY_ACCEPTED',
      `Another Sub-Admin (${order.accepted_by_name || 'an operations manager'}) accepted this order first.`,
      409
    );
  }

  const now = new Date().toISOString();
  const updatedOrder: Order = {
    ...order,
    status: order.status === 'order_placed' ? 'accepted' : order.status,
    accepted_by_id: subAdminId,
    accepted_by_name: subAdminName,
    accepted_at: now,
    updated_at: now,
    status_history: [
      ...order.status_history,
      {
        id: `hist-${Date.now()}`,
        from_status: order.status,
        to_status: 'accepted',
        changed_by_name: subAdminName,
        note: `Order accepted by ${subAdminName}. Operations manager is now responsible for fulfillment.`,
        created_at: now,
      }
    ]
  };

  orders[index] = updatedOrder;
  localStore.saveOrders(orders);
  return updatedOrder;
}

/**
 * Assign internal Seller / Supplier record to order (V1 scope)
 */
export async function assignSellerSupplier(orderId: string, supplierId: string, managerName: string): Promise<Order> {
  const orders = localStore.getOrders();
  const index = orders.findIndex(o => o.id === orderId);
  if (index === -1) {
    throw new ApiException('RESOURCE_NOT_FOUND', 'Order not found.', 404);
  }

  const suppliers = localStore.getSuppliers();
  const supplier = suppliers.find(s => s.id === supplierId);
  if (!supplier) {
    throw new ApiException('RESOURCE_NOT_FOUND', 'Seller/Supplier record not found.', 404);
  }

  const order = orders[index];
  const now = new Date().toISOString();

  const updatedOrder: Order = {
    ...order,
    seller_supplier_id: supplier.id,
    seller_supplier_name: `${supplier.business_name} (${supplier.city} - ${supplier.pincode})`,
    seller_supplier_pincode: supplier.pincode,
    updated_at: now,
    status_history: [
      ...order.status_history,
      {
        id: `hist-${Date.now()}`,
        from_status: order.status,
        to_status: order.status,
        changed_by_name: managerName,
        note: `Assigned fulfillment stockist: ${supplier.business_name} (Pincode: ${supplier.pincode})`,
        created_at: now,
      }
    ]
  };

  orders[index] = updatedOrder;
  localStore.saveOrders(orders);
  return updatedOrder;
}

/**
 * Status mutation enforcing backend transition matrix and reward point credit on DELIVERED
 */
export async function updateOrderStatus(
  orderId: string, 
  toStatus: OrderStatus, 
  changedByName: string, 
  note?: string
): Promise<Order> {
  const orders = localStore.getOrders();
  const index = orders.findIndex(o => o.id === orderId);
  if (index === -1) {
    throw new ApiException('RESOURCE_NOT_FOUND', 'Order not found.', 404);
  }

  const order = orders[index];
  const allowed = ALLOWED_TRANSITIONS[order.status] || [];

  if (!allowed.includes(toStatus)) {
    throw new ApiException(
      'ORDER_INVALID_TRANSITION',
      `Cannot transition order from "${order.status}" to "${toStatus}". Allowed transitions: ${allowed.join(', ') || 'none'}.`,
      409
    );
  }

  const now = new Date().toISOString();
  const updatedOrder: Order = {
    ...order,
    status: toStatus,
    updated_at: now,
    status_history: [
      ...order.status_history,
      {
        id: `hist-${Date.now()}`,
        from_status: order.status,
        to_status: toStatus,
        changed_by_name: changedByName,
        note: note || `Order status updated to ${toStatus}`,
        created_at: now,
      }
    ]
  };

  orders[index] = updatedOrder;
  localStore.saveOrders(orders);

  // If transition reached DELIVERED, record 1 reward point in append-only ledger for the assigned Sub-Admin
  if (toStatus === 'delivered' && order.accepted_by_id) {
    const rewards = localStore.getRewards();
    const alreadyRewarded = rewards.some(r => r.order_id === order.id);
    if (!alreadyRewarded) {
      const newReward: RewardPoint = {
        id: `rew-${Date.now()}`,
        user_id: order.accepted_by_id,
        user_name: order.accepted_by_name || 'Sub-Admin',
        order_id: order.id,
        order_number: order.order_number,
        points: 1,
        reason: 'Order fulfilled at DELIVERED stage',
        created_at: now,
      };
      rewards.unshift(newReward);
      localStore.saveRewards(rewards);
    }
  }

  return updatedOrder;
}
