'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  LayoutGrid, 
  ShoppingBag, 
  PackageCheck 
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  // Hide on admin, sub-admin, checkout and invoice screens
  if (
    pathname.startsWith('/admin') || 
    pathname.startsWith('/sub-admin') ||
    pathname.startsWith('/checkout') ||
    pathname.includes('/invoice')
  ) {
    return null;
  }

  const isHomeActive = pathname === '/';
  const isProductActive = pathname.startsWith('/products') || pathname.startsWith('/categories');
  const isCartActive = pathname.startsWith('/account/cart');
  const isOrdersActive = pathname.startsWith('/account/orders');

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      href: '/',
      icon: Home,
      isActive: isHomeActive,
    },
    {
      id: 'product',
      label: 'Product',
      href: '/products',
      icon: LayoutGrid,
      isActive: isProductActive,
    },
    {
      id: 'cart',
      label: 'Cart',
      href: '/account/cart',
      icon: ShoppingBag,
      isActive: isCartActive,
      badge: itemCount,
    },
    {
      id: 'orders',
      label: 'My Order',
      href: '/account/orders',
      icon: PackageCheck,
      isActive: isOrdersActive,
    },
  ];

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1 select-none"
    >
      <div className="max-w-md mx-auto px-4">
        <ul className="grid grid-cols-4 items-center justify-around h-14">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.isActive;

            return (
              <li key={item.id} className="relative flex justify-center">
                <Link
                  href={item.href}
                  className={`flex flex-col items-center justify-center w-full py-1 group active:scale-90 transition-all duration-150 relative ${
                    active ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {/* Icon with relative badge */}
                  <div className="relative flex items-center justify-center">
                    <Icon 
                      className={`w-5 h-5 transition-transform duration-200 ${
                        active 
                          ? 'scale-110 stroke-[2.4px] text-blue-600' 
                          : 'stroke-[1.8px] text-slate-500 group-hover:text-slate-800'
                      }`} 
                    />

                    {/* Live Cart Counter Badge */}
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="absolute -top-1.5 -right-2.5 min-w-[17px] h-[17px] px-1 rounded-full bg-blue-600 text-white font-mono font-black text-[10px] flex items-center justify-center shadow-sm ring-2 ring-white animate-in zoom-in-75">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </div>

                  {/* Tab Label */}
                  <span 
                    className={`text-[10px] tracking-tight mt-1 transition-colors ${
                      active ? 'font-black text-blue-600' : 'font-medium text-slate-500'
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Active Indicator Micro-pill */}
                  {active && (
                    <span className="absolute bottom-0 w-4 h-0.5 rounded-full bg-blue-600 animate-in fade-in zoom-in duration-200" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
