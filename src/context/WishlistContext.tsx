'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { localStore } from '@/lib/api/store';
import { useToast } from './ToastContext';

interface WishlistContextType {
  wishlistIds: string[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string, productName?: string) => void;
  removeFromWishlist: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStore.getWishlist();
    setWishlistIds(saved || []);
  }, []);

  const saveIds = (ids: string[]) => {
    setWishlistIds(ids);
    localStore.saveWishlist(ids);
  };

  const isInWishlist = (productId: string) => {
    return wishlistIds.includes(productId);
  };

  const toggleWishlist = (productId: string, productName: string = 'Item') => {
    if (wishlistIds.includes(productId)) {
      const updated = wishlistIds.filter(id => id !== productId);
      saveIds(updated);
      toast(`${productName} removed from wishlist.`, 'info');
    } else {
      const updated = [...wishlistIds, productId];
      saveIds(updated);
      toast(`${productName} saved to wishlist.`, 'success');
    }
  };

  const removeFromWishlist = (productId: string) => {
    const updated = wishlistIds.filter(id => id !== productId);
    saveIds(updated);
    toast('Item removed from wishlist.', 'info');
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}
