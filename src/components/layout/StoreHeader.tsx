'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  User as UserIcon, 
  Menu, 
  X, 
  Zap, 
  ShieldCheck, 
  MapPin, 
  ChevronDown,
  LayoutDashboard,
  LogOut,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { getProducts } from '@/lib/api/products';
import { Product } from '@/types';

export function StoreHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  
  // Direct Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  const pathname = usePathname();
  const router = useRouter();

  const { itemCount } = useCart();
  const { wishlistIds } = useWishlist();
  const { user, role, switchRole, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen for clicks outside to close search suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when mobile search opens
  useEffect(() => {
    if (mobileSearchOpen) {
      setTimeout(() => mobileSearchInputRef.current?.focus(), 50);
    }
  }, [mobileSearchOpen]);

  // Live product search suggestion debounce
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await getProducts({ q: trimmed, page_size: 4 });
        setSuggestions(res.data);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Error fetching search suggestions:', err);
      } finally {
        setIsSearching(false);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Submit direct search on Enter key or button click
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setShowSuggestions(false);
    setMobileSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/products' },
    { label: 'Categories', href: '/categories' },
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* Top Utility Bar */}
      <div className="bg-slate-950 text-slate-300 text-xs py-2 px-4 border-b border-slate-900">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="flex items-center gap-1.5 text-blue-400 font-medium">
              <Zap className="w-3.5 h-3.5 fill-blue-400 text-blue-400" />
              <span>Fast Local Delivery in Guwahati</span>
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Professional Installation Support</span>
            </span>
            <span className="hidden lg:flex items-center gap-1.5 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>Serving Kamrup Metro & Greater Guwahati</span>
            </span>
          </div>

          {/* Quick Role & Portal Switcher for evaluation & seamless testing */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-full px-2 py-0.5 text-[11px]">
              <span className="text-slate-400 hidden sm:inline">Active Mode:</span>
              <button
                onClick={() => switchRole('customer')}
                className={`px-1.5 py-0.5 rounded ${role === 'customer' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Customer
              </button>
              <button
                onClick={() => switchRole('sub_admin')}
                className={`px-1.5 py-0.5 rounded ${role === 'sub_admin' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                title="Sub-Admin order accept & dispatch role"
              >
                Sub-Admin
              </button>
              <button
                onClick={() => switchRole('super_admin')}
                className={`px-1.5 py-0.5 rounded ${role === 'super_admin' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                title="Full Super Admin management"
              >
                Admin
              </button>
            </div>

            {role !== 'customer' && (
              <Link
                href={role === 'sub_admin' ? '/sub-admin' : '/admin'}
                className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300"
              >
                <LayoutDashboard className="w-3 h-3" />
                <span>{role === 'sub_admin' ? 'Sub-Admin Operations' : 'Admin Panel'}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200/80 py-2.5'
            : 'bg-white border-b border-slate-100 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-700 hover:text-blue-600 rounded-lg"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5 fill-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                    NC ELECTRO
                  </span>
                  <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 tracking-wider">
                    PRO
                  </span>
                </div>
                <span className="text-[10px] tracking-widest text-slate-500 uppercase font-semibold -mt-1">
                  Guwahati, Assam
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map(link => {
              const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    active
                      ? 'text-blue-600 bg-blue-50/70 font-bold'
                      : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* DIRECT SEARCH BAR (Interactive Desktop & Tablet) */}
          <div ref={searchContainerRef} className="relative hidden md:flex flex-1 max-w-md mx-2">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="relative flex items-center w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchQuery.trim().length >= 2) setShowSuggestions(true);
                  }}
                  placeholder="Search CCTV, inverters, batteries, cables..."
                  className="w-full bg-slate-100 hover:bg-slate-100/90 focus:bg-white text-slate-900 placeholder:text-slate-400 pl-10 pr-20 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                />

                <div className="absolute right-2 flex items-center gap-1">
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSuggestions([]);
                        setShowSuggestions(false);
                      }}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    type="submit"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold shadow-sm transition-all"
                    title="Press Enter to search"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </form>

            {/* Live Autocomplete Dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 text-left animate-in fade-in zoom-in-95">
                <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    Products matching &quot;{searchQuery}&quot;
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Press ↵ Enter to view all</span>
                </div>

                <div className="py-1 divide-y divide-slate-50 max-h-80 overflow-y-auto">
                  {suggestions.length === 0 ? (
                    <div className="px-4 py-6 text-center text-xs text-slate-400">
                      No exact product match found for &quot;{searchQuery}&quot;. Press Enter to search catalog.
                    </div>
                  ) : (
                    suggestions.map(item => (
                      <Link
                        key={item.id}
                        href={`/products/${item.slug}`}
                        onClick={() => {
                          setShowSuggestions(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50/60 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-slate-100 relative overflow-hidden shrink-0 border border-slate-200">
                          <Image
                            src={item.primary_image}
                            alt={item.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 truncate">
                            {item.name}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                            <span className="text-slate-500">{item.brand}</span>
                            <span className="text-slate-300">•</span>
                            <span className="font-mono font-bold text-slate-900">
                              ₹{item.price.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 shrink-0 -translate-x-1 group-hover:translate-x-0 transition-all" />
                      </Link>
                    ))
                  )}
                </div>

                <div className="px-3 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleSearchSubmit()}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-blue-600 hover:text-blue-700 font-bold text-xs transition-colors"
                  >
                    <span>View all search results for &quot;{searchQuery}&quot;</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Mobile Search Button Toggle */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Open search input"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Icon */}
            <Link
              href="/account/wishlist"
              className="relative p-2.5 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistIds.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse-subtle">
                  {wishlistIds.length}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              href="/account/cart"
              className="relative p-2.5 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Profile / Portal Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-slate-800"
                aria-label="User Account"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                  {user?.full_name ? user.full_name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
                </div>
                <div className="hidden sm:flex flex-col text-left leading-tight">
                  <span className="text-xs font-bold text-slate-900 truncate max-w-[100px]">
                    {user?.full_name?.split(' ')[0] || 'Account'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium capitalize">
                    {role.replace('_', ' ')}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 text-sm animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <div className="font-bold text-slate-900 truncate">{user?.full_name}</div>
                      <div className="text-xs text-slate-500 truncate">{user?.email}</div>
                      <div className="mt-1 inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        {role}
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/account"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                      >
                        <UserIcon className="w-4 h-4" />
                        <span>Customer Dashboard</span>
                      </Link>
                      <Link
                        href="/account/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>My Orders</span>
                      </Link>
                      <Link
                        href="/account/addresses"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                      >
                        <MapPin className="w-4 h-4" />
                        <span>Delivery Addresses</span>
                      </Link>
                    </div>

                    {role === 'sub_admin' && (
                      <div className="py-1 border-t border-slate-100 bg-indigo-50/50">
                        <Link
                          href="/sub-admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-indigo-700 font-bold hover:bg-indigo-100/50"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Sub-Admin Portal</span>
                        </Link>
                      </div>
                    )}

                    {role === 'super_admin' && (
                      <div className="py-1 border-t border-slate-100 bg-purple-50/50">
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-purple-700 font-bold hover:bg-purple-100/50"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Super Admin Panel</span>
                        </Link>
                      </div>
                    )}

                    <div className="py-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 text-left font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Expandable Search Row */}
        {mobileSearchOpen && (
          <div className="md:hidden px-4 pt-2.5 pb-1 border-t border-slate-100 animate-in slide-in-from-top-2">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                ref={mobileSearchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products & enter keyword..."
                className="w-full bg-slate-100 text-slate-900 placeholder:text-slate-400 pl-9 pr-16 py-2 rounded-xl text-xs border border-slate-200 focus:border-blue-500 focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-1.5 px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold"
              >
                Go
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-2xl p-6 flex flex-col justify-between z-50">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                    <Zap className="w-4 h-4 fill-white" />
                  </div>
                  <span className="font-black text-lg text-slate-900 tracking-tight">NC ELECTRO</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Direct Search in Drawer */}
              <div className="mt-4">
                <form 
                  onSubmit={(e) => {
                    handleSearchSubmit(e);
                    setMobileMenuOpen(false);
                  }}
                  className="relative flex items-center w-full"
                >
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by keyword & enter..."
                    className="w-full bg-slate-100 text-slate-900 placeholder:text-slate-400 pl-9 pr-14 py-2 rounded-xl text-xs border border-slate-200 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-bold"
                  >
                    Go
                  </button>
                </form>
              </div>

              <div className="mt-4 flex flex-col gap-1">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-1">
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <span className="flex items-center gap-2.5">
                    <UserIcon className="w-4 h-4 text-slate-500" />
                    <span>My Account</span>
                  </span>
                </Link>
                <Link
                  href="/account/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <span className="flex items-center gap-2.5">
                    <ShoppingBag className="w-4 h-4 text-slate-500" />
                    <span>Orders & Tracking</span>
                  </span>
                </Link>
                <Link
                  href="/account/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <span className="flex items-center gap-2.5">
                    <Heart className="w-4 h-4 text-slate-500" />
                    <span>Wishlist</span>
                  </span>
                  {wishlistIds.length > 0 && (
                    <span className="text-xs bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full">
                      {wishlistIds.length}
                    </span>
                  )}
                </Link>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-1.5 text-blue-600 font-semibold mb-1">
                <Zap className="w-3.5 h-3.5" /> Fast Delivery in Guwahati
              </div>
              <p>Professional installation support by certified technicians.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
