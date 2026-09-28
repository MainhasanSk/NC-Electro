'use client';

import { 
  Product, 
  Category, 
  Order, 
  Address, 
  SellerSupplier, 
  RewardPoint, 
  User, 
  Invoice,
  CartItem,
  CartSummary,
  OrderStatus
} from '@/types';
import { 
  MOCK_PRODUCTS, 
  MOCK_CATEGORIES, 
  MOCK_ORDERS, 
  MOCK_ADDRESSES, 
  MOCK_SELLER_SUPPLIERS, 
  MOCK_REWARD_POINTS, 
  MOCK_USERS, 
  MOCK_INVOICES 
} from '@/lib/mockData';

const STORAGE_KEYS = {
  PRODUCTS: 'nc_products',
  CATEGORIES: 'nc_categories',
  ORDERS: 'nc_orders',
  ADDRESSES: 'nc_addresses',
  SUPPLIERS: 'nc_suppliers',
  REWARDS: 'nc_rewards',
  INVOICES: 'nc_invoices',
  CART: 'nc_cart',
  WISHLIST: 'nc_wishlist',
  CURRENT_USER: 'nc_current_user',
};

function getStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export const localStore = {
  getProducts(): Product[] {
    return getStorage<Product[]>(STORAGE_KEYS.PRODUCTS, MOCK_PRODUCTS);
  },
  saveProducts(products: Product[]) {
    setStorage(STORAGE_KEYS.PRODUCTS, products);
  },
  getCategories(): Category[] {
    return getStorage<Category[]>(STORAGE_KEYS.CATEGORIES, MOCK_CATEGORIES);
  },
  getOrders(): Order[] {
    return getStorage<Order[]>(STORAGE_KEYS.ORDERS, MOCK_ORDERS);
  },
  saveOrders(orders: Order[]) {
    setStorage(STORAGE_KEYS.ORDERS, orders);
  },
  getAddresses(): Address[] {
    return getStorage<Address[]>(STORAGE_KEYS.ADDRESSES, MOCK_ADDRESSES);
  },
  saveAddresses(addresses: Address[]) {
    setStorage(STORAGE_KEYS.ADDRESSES, addresses);
  },
  getSuppliers(): SellerSupplier[] {
    return getStorage<SellerSupplier[]>(STORAGE_KEYS.SUPPLIERS, MOCK_SELLER_SUPPLIERS);
  },
  saveSuppliers(suppliers: SellerSupplier[]) {
    setStorage(STORAGE_KEYS.SUPPLIERS, suppliers);
  },
  getRewards(): RewardPoint[] {
    return getStorage<RewardPoint[]>(STORAGE_KEYS.REWARDS, MOCK_REWARD_POINTS);
  },
  saveRewards(rewards: RewardPoint[]) {
    setStorage(STORAGE_KEYS.REWARDS, rewards);
  },
  getInvoices(): Invoice[] {
    return getStorage<Invoice[]>(STORAGE_KEYS.INVOICES, MOCK_INVOICES);
  },
  saveInvoices(invoices: Invoice[]) {
    setStorage(STORAGE_KEYS.INVOICES, invoices);
  },
  getCart(): CartItem[] {
    return getStorage<CartItem[]>(STORAGE_KEYS.CART, []);
  },
  saveCart(items: CartItem[]) {
    setStorage(STORAGE_KEYS.CART, items);
  },
  getWishlist(): string[] {
    return getStorage<string[]>(STORAGE_KEYS.WISHLIST, ['prod-cctv-hik-2mp']);
  },
  saveWishlist(ids: string[]) {
    setStorage(STORAGE_KEYS.WISHLIST, ids);
  },
  getCurrentUser(): User {
    return getStorage<User>(STORAGE_KEYS.CURRENT_USER, MOCK_USERS[0]);
  },
  saveCurrentUser(user: User) {
    setStorage(STORAGE_KEYS.CURRENT_USER, user);
  }
};

/**
 * Server-authoritative total calculation following LLD rules
 */
export function calculateServerCartTotals(items: CartItem[], hasInstallation: boolean = false): CartSummary {
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discount = subtotal > 10000 ? 500 : 0;
  // Free delivery for orders above ₹1000 in Guwahati, otherwise ₹150
  const shipping = subtotal === 0 || subtotal >= 1000 ? 0 : 150;
  // Standard electronics GST (18%) included/calculated
  const tax = Math.round(subtotal * 0.18);
  const installation_fee = hasInstallation ? 499 : 0;
  const total = subtotal - discount + shipping + tax + installation_fee;

  return {
    items,
    subtotal,
    discount,
    shipping,
    tax,
    has_installation: hasInstallation,
    installation_fee,
    total,
  };
}
