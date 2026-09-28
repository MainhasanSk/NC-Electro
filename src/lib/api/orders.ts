import { Order, OrderStatus, Address, OrderItem } from '@/types';
import { localStore, calculateServerCartTotals } from './store';
import { ApiException } from './client';
import { ALLOWED_TRANSITIONS } from '../constants/orderStatus';

export async function previewCheckout(addressId: string) {
  const addresses = localStore.getAddresses();
  const address = addresses.find(a => a.id === addressId);
  if (!address) {
    throw new ApiException('RESOURCE_NOT_FOUND', 'Selected delivery address not found.', 404);
  }

  const cart = localStore.getCart();
  if (cart.length === 0) {
    throw new ApiException('VALIDATION_FAILED', 'Your cart is empty.', 400);
  }

  const totals = calculateServerCartTotals(cart);
  return {
    address_preview: address,
    summary: totals,
    expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  };
}

export async function createOrder(payload: { address_id: string; customer_note?: string; has_installation?: boolean }, idempotencyKey?: string): Promise<Order> {
  const addresses = localStore.getAddresses();
  const address = addresses.find(a => a.id === payload.address_id);
  if (!address) {
    throw new ApiException('RESOURCE_NOT_FOUND', 'Invalid delivery address.', 404);
  }

  const cart = localStore.getCart();
  if (cart.length === 0) {
    throw new ApiException('VALIDATION_FAILED', 'Your cart is empty.', 400);
  }

  // Stock check
  const products = localStore.getProducts();
  for (const item of cart) {
    const prod = products.find(p => p.id === item.product_id);
    if (!prod || prod.stock_quantity < item.quantity) {
      throw new ApiException('INSUFFICIENT_STOCK', `Item "${item.product.name}" is no longer in stock in that quantity.`, 409);
    }
  }

  // Deduct stock and increment reserved
  const updatedProducts = products.map(p => {
    const cartItem = cart.find(ci => ci.product_id === p.id);
    if (cartItem) {
      return {
        ...p,
        stock_quantity: p.stock_quantity - cartItem.quantity,
        reserved_quantity: p.reserved_quantity + cartItem.quantity,
        availability: (p.stock_quantity - cartItem.quantity) <= 0 ? 'out_of_stock' : (p.stock_quantity - cartItem.quantity) <= p.low_stock_threshold ? 'low_stock' : 'in_stock'
      } as typeof p;
    }
    return p;
  });
  localStore.saveProducts(updatedProducts);

  const totals = calculateServerCartTotals(cart, !!payload.has_installation);
  const currentUser = localStore.getCurrentUser();

  const newOrderNumber = `NC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const orderId = `ord-${Date.now()}`;

  const orderItems: OrderItem[] = cart.map(item => ({
    id: `item-${Date.now()}-${item.product_id}`,
    product_id: item.product_id,
    product_name: item.product.name,
    sku: item.product.sku,
    brand: item.product.brand,
    price: item.product.price,
    quantity: item.quantity,
    line_total: item.product.price * item.quantity,
    image_url: item.product.primary_image,
  }));

  const now = new Date().toISOString();

  const newOrder: Order = {
    id: orderId,
    order_number: newOrderNumber,
    user_id: currentUser.id,
    customer_name: address.recipient_name || currentUser.full_name,
    customer_email: currentUser.email,
    customer_phone: address.phone || currentUser.phone,
    status: 'order_placed',
    address,
    items: orderItems,
    subtotal: totals.subtotal,
    discount: totals.discount,
    shipping: totals.shipping,
    tax: totals.tax,
    has_installation: !!payload.has_installation,
    installation_fee: totals.installation_fee,
    total: totals.total,
    customer_note: payload.customer_note,
    created_at: now,
    updated_at: now,
    status_history: [
      {
        id: `hist-${Date.now()}`,
        from_status: null,
        to_status: 'order_placed',
        changed_by_name: currentUser.full_name,
        note: payload.has_installation 
          ? 'Order placed with Professional On-Site Installation Service in Guwahati (+ ₹499)'
          : 'Order placed for doorstep delivery only (No installation requested)',
        created_at: now,
      }
    ]
  };

  const existingOrders = localStore.getOrders();
  localStore.saveOrders([newOrder, ...existingOrders]);

  // Create pending invoice record
  const invoices = localStore.getInvoices();
  invoices.unshift({
    id: `inv-${Date.now()}`,
    document_number: `INV-${newOrderNumber}`,
    order_id: orderId,
    order_number: newOrderNumber,
    customer_name: newOrder.customer_name,
    total_amount: newOrder.total,
    status: 'generated',
    file_url: `/invoices/INV-${newOrderNumber}.pdf`,
    created_at: now,
  });
  localStore.saveInvoices(invoices);

  // Clear customer cart
  localStore.saveCart([]);

  return newOrder;
}

export async function getCustomerOrders(userId: string): Promise<Order[]> {
  const all = localStore.getOrders();
  return all.filter(o => o.user_id === userId || o.customer_email === 'bhaskar.das@example.com');
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const all = localStore.getOrders();
  return all.find(o => o.id === orderId || o.order_number === orderId) || null;
}
