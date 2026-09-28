import { SellerSupplier } from '@/types';
import { localStore } from '../store';
import { ApiException } from '../client';

export async function getSellerSuppliers(): Promise<SellerSupplier[]> {
  return localStore.getSuppliers();
}

export async function createSellerSupplier(payload: Omit<SellerSupplier, 'id' | 'created_at'>): Promise<SellerSupplier> {
  const suppliers = localStore.getSuppliers();
  const id = `sup-${Date.now()}`;
  const newSupplier: SellerSupplier = {
    ...payload,
    id,
    created_at: new Date().toISOString(),
  };

  suppliers.unshift(newSupplier);
  localStore.saveSuppliers(suppliers);
  return newSupplier;
}

export async function updateSellerSupplier(id: string, updates: Partial<SellerSupplier>): Promise<SellerSupplier> {
  const suppliers = localStore.getSuppliers();
  const index = suppliers.findIndex(s => s.id === id);
  if (index === -1) {
    throw new ApiException('RESOURCE_NOT_FOUND', 'Seller/Supplier record not found.', 404);
  }

  const updated: SellerSupplier = {
    ...suppliers[index],
    ...updates,
  };

  suppliers[index] = updated;
  localStore.saveSuppliers(suppliers);
  return updated;
}
