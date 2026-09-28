import { Product, Availability } from '@/types';
import { localStore } from '../store';
import { ApiException } from '../client';

export async function getAdminProducts(): Promise<Product[]> {
  return localStore.getProducts();
}

export async function createProduct(payload: Omit<Product, 'id' | 'created_at'>): Promise<Product> {
  const products = localStore.getProducts();
  const id = `prod-${Date.now()}`;
  const newProduct: Product = {
    ...payload,
    id,
    created_at: new Date().toISOString(),
  };

  products.unshift(newProduct);
  localStore.saveProducts(products);
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  const products = localStore.getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) {
    throw new ApiException('RESOURCE_NOT_FOUND', 'Product not found.', 404);
  }

  const updated: Product = {
    ...products[index],
    ...updates,
  };

  products[index] = updated;
  localStore.saveProducts(products);
  return updated;
}

export async function deleteProduct(id: string): Promise<void> {
  const products = localStore.getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) {
    throw new ApiException('RESOURCE_NOT_FOUND', 'Product not found.', 404);
  }

  // Soft delete / deactivate as required by LLD
  products[index].is_active = false;
  localStore.saveProducts(products);
}

export async function adjustStock(productId: string, newQuantity: number, lowStockThreshold?: number): Promise<Product> {
  const products = localStore.getProducts();
  const index = products.findIndex(p => p.id === productId);
  if (index === -1) {
    throw new ApiException('RESOURCE_NOT_FOUND', 'Product not found.', 404);
  }

  const prod = products[index];
  const threshold = lowStockThreshold !== undefined ? lowStockThreshold : prod.low_stock_threshold;
  let availability: Availability = 'in_stock';
  if (newQuantity <= 0) {
    availability = 'out_of_stock';
  } else if (newQuantity <= threshold) {
    availability = 'low_stock';
  }

  const updated: Product = {
    ...prod,
    stock_quantity: Math.max(0, newQuantity),
    low_stock_threshold: threshold,
    availability,
  };

  products[index] = updated;
  localStore.saveProducts(products);
  return updated;
}
