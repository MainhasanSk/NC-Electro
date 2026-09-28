'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingBag, Check, ShieldCheck, Zap } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact';
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [added, setAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.availability === 'out_of_stock' || product.stock_quantity <= 0;

  // Clicking anywhere on the product box redirects to its detail page
  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) return;
    router.push(`/products/${product.slug}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id, product.name);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer select-none"
    >
      {/* Top Image Container */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden">
        <Image
          src={product.primary_image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.discount_percentage && product.discount_percentage > 0 && (
            <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-sm">
              {product.discount_percentage}% OFF
            </span>
          )}

          {product.availability === 'low_stock' && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 backdrop-blur-sm">
              Few Left
            </span>
          )}

          {isOutOfStock && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-20 ${
            isFavorited
              ? 'bg-rose-50 text-rose-600 shadow-sm'
              : 'bg-white/80 text-slate-500 hover:text-rose-600 hover:bg-white shadow-sm'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Fast Local Delivery Tag in Guwahati */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-slate-700 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200/60 shadow-sm pointer-events-none">
          <span className="flex items-center gap-1 font-semibold text-blue-700 truncate">
            <Zap className="w-3 h-3 fill-blue-600 text-blue-600 shrink-0" />
            <span>Guwahati Fast Dispatch</span>
          </span>
          {product.has_installation_support && (
            <span className="flex items-center gap-0.5 text-emerald-700 font-semibold shrink-0" title="Installation support available">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Installed</span>
            </span>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-bold uppercase tracking-wider text-blue-600">{product.brand}</span>
            <span className="truncate max-w-[120px] text-slate-400">{product.category.name}</span>
          </div>

          <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          {variant === 'default' && product.short_description && (
            <p className="text-xs text-slate-500 mt-1.5 line-clamp-1">
              {product.short_description}
            </p>
          )}
        </div>

        {/* Pricing & Add To Cart Button */}
        <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-base sm:text-lg font-black text-slate-950">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.original_price > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{product.original_price.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-400">Incl. of GST (Assam)</div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`relative z-20 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 shrink-0 ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : added
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 active:scale-95'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : isOutOfStock ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Full-bleed Stretched Link: covers entire card with z-10 so ANY click on card box navigates to PDP */}
      <Link 
        href={`/products/${product.slug}`} 
        className="absolute inset-0 z-10" 
        aria-label={`View details for ${product.name}`}
      />
    </div>
  );
}
