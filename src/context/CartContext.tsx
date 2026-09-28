'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Product, CartItem, CartSummary } from '@/types';
import { localStore, calculateServerCartTotals } from '@/lib/api/store';
import { useToast } from './ToastContext';

interface CartContextType {
  items: CartItem[];
  summary: CartSummary;
  itemCount: number;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStore.getCart();
    setItems(saved || []);
  }, []);

  const saveAndSetItems = (newItems: CartItem[]) => {
    setItems(newItems);
    localStore.saveCart(newItems);
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    if (product.availability === 'out_of_stock' || product.stock_quantity <= 0) {
      toast('This item is currently out of stock.', 'error');
      return;
    }

    const existingIndex = items.findIndex(i => i.product_id === product.id);
    let updated: CartItem[];

    if (existingIndex > -1) {
      const currentQty = items[existingIndex].quantity;
      const newQty = currentQty + quantity;

      if (newQty > product.stock_quantity) {
        toast(`Only ${product.stock_quantity} units available in stock.`, 'warning');
        return;
      }

      updated = [...items];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: newQty,
        line_total: product.price * newQty,
      };
    } else {
      updated = [
        ...items,
        {
          product_id: product.id,
          product,
          quantity,
          line_total: product.price * quantity,
        }
      ];
    }

    saveAndSetItems(updated);
    toast(`${product.name} added to cart.`, 'success');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const target = items.find(i => i.product_id === productId);
    if (target && quantity > target.product.stock_quantity) {
      toast(`Only ${target.product.stock_quantity} units available.`, 'warning');
      return;
    }

    const updated = items.map(item => {
      if (item.product_id === productId) {
        return {
          ...item,
          quantity,
          line_total: item.product.price * quantity,
        };
      }
      return item;
    });

    saveAndSetItems(updated);
  };

  const removeFromCart = (productId: string) => {
    const item = items.find(i => i.product_id === productId);
    const updated = items.filter(i => i.product_id !== productId);
    saveAndSetItems(updated);
    if (item) {
      toast(`${item.product.name} removed from cart.`, 'info');
    }
  };

  const clearCart = () => {
    saveAndSetItems([]);
  };

  const summary = useMemo(() => {
    return calculateServerCartTotals(items);
  }, [items]);

  const itemCount = useMemo(() => {
    return items.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        summary,
        itemCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
