import { localStore } from '../store';

export interface DashboardStats {
  totalOrders: number;
  totalOrderValue: number; // strictly "order_value", not "paid_revenue"
  activeOrders: number;
  deliveredOrders: number;
  lowStockCount: number;
  outOfStockCount: number;
  unacceptedOrdersCount: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const orders = localStore.getOrders();
  const products = localStore.getProducts();

  // Exclude cancelled orders from total order value
  const nonCancelledOrders = orders.filter(o => o.status !== 'cancelled');
  const totalOrderValue = nonCancelledOrders.reduce((sum, o) => sum + o.total, 0);

  const activeOrders = orders.filter(o => !['delivered', 'cancelled', 'returned'].includes(o.status));
  const deliveredOrders = orders.filter(o => o.status === 'delivered');
  const unacceptedOrders = orders.filter(o => !o.accepted_by_id && o.status === 'order_placed');

  const lowStockCount = products.filter(p => p.availability === 'low_stock').length;
  const outOfStockCount = products.filter(p => p.availability === 'out_of_stock').length;

  return {
    totalOrders: orders.length,
    totalOrderValue,
    activeOrders: activeOrders.length,
    deliveredOrders: deliveredOrders.length,
    lowStockCount,
    outOfStockCount,
    unacceptedOrdersCount: unacceptedOrders.length,
  };
}

export async function getSalesTrends() {
  const orders = localStore.getOrders();
  // Group by date
  const map: Record<string, { date: string; order_count: number; order_value: number }> = {};

  orders.filter(o => o.status !== 'cancelled').forEach(o => {
    const day = o.created_at.slice(0, 10);
    if (!map[day]) {
      map[day] = { date: day, order_count: 0, order_value: 0 };
    }
    map[day].order_count += 1;
    map[day].order_value += o.total;
  });

  return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
}

export async function getCategoryPerformance() {
  const orders = localStore.getOrders();
  const map: Record<string, { category: string; units: number; order_value: number }> = {};

  orders.filter(o => o.status !== 'cancelled').forEach(o => {
    o.items.forEach(item => {
      const category = item.product_name.includes('CCTV') || item.product_name.includes('Camera') || item.product_name.includes('DVR')
        ? 'CCTV & Security'
        : item.product_name.includes('Inverter')
        ? 'Inverters & UPS'
        : item.product_name.includes('Battery')
        ? 'Batteries'
        : 'Electrical Materials';

      if (!map[category]) {
        map[category] = { category, units: 0, order_value: 0 };
      }
      map[category].units += item.quantity;
      map[category].order_value += item.line_total;
    });
  });

  return Object.values(map);
}

export async function getRewardsLedger() {
  return localStore.getRewards();
}
