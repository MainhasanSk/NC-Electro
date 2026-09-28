'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { 
  Heart, 
  ShoppingBag, 
  Check, 
  ShieldCheck, 
  Truck, 
  MapPin, 
  ChevronRight, 
  Zap, 
  Wrench, 
  Clock, 
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { StoreHeader } from '@/components/layout/StoreHeader';
import { StoreFooter } from '@/components/layout/StoreFooter';
import { ProductCard } from '@/components/product/ProductCard';
import { Product } from '@/types';
import { getProductBySlug, getProducts } from '@/lib/api/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const found = await getProductBySlug(slug);
        setProduct(found);
        if (found) {
          const relatedRes = await getProducts({ category_slug: found.category.slug, page_size: 4 });
          setRelatedProducts(relatedRes.data.filter(p => p.id !== found.id));
        }
      } catch (err) {
        console.error('Failed to load product', err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      loadProduct();
      setActiveImageIndex(0);
      setQuantity(1);
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <StoreHeader />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/3 mx-auto" />
          <div className="h-64 bg-slate-200 rounded-3xl max-w-xl mx-auto" />
        </div>
        <StoreFooter />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <StoreHeader />
        <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Product Not Found</h1>
          <p className="text-sm text-slate-500">
            The electronics item you are looking for is either inactive or does not exist in our Guwahati inventory.
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Catalog</span>
            </Link>
          </div>
        </div>
        <StoreFooter />
      </div>
    );
  }

  const isOutOfStock = product.availability === 'out_of_stock' || product.stock_quantity <= 0;
  const isFavorited = isInWishlist(product.id);
  const images = product.images.length > 0 ? product.images : [{ id: '1', url: product.primary_image, is_primary: true, sort_order: 1 }];

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const handleOrderNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <StoreHeader />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link href="/products" className="hover:text-blue-600">Products</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link href={`/categories/${product.category.slug}`} className="hover:text-blue-600 capitalize">
              {product.category.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-900 font-semibold truncate max-w-xs">{product.name}</span>
          </nav>

          {/* Product Launchpad Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            
            {/* Left: Product Media Gallery (up to 5 images) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-slate-50 border border-slate-200/90 shadow-sm group">
                <Image
                  src={images[activeImageIndex]?.url || product.primary_image}
                  alt={images[activeImageIndex]?.alt_text || product.name}
                  fill
                  priority
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  {product.discount_percentage && product.discount_percentage > 0 && (
                    <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-blue-600 text-white shadow-md">
                      {product.discount_percentage}% OFF
                    </span>
                  )}
                  {product.has_installation_support && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Installation Available
                    </span>
                  )}
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product.id, product.name)}
                  className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all shadow-md ${
                    isFavorited
                      ? 'bg-rose-50 text-rose-600'
                      : 'bg-white/90 text-slate-500 hover:text-rose-600'
                  }`}
                  aria-label="Wishlist toggle"
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              {/* Thumbnails Row */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                        activeImageIndex === idx
                          ? 'border-blue-600 shadow-md scale-105'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt="Thumbnail"
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Purchase Details */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Brand and SKU */}
              <div className="flex items-center justify-between text-xs">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-extrabold uppercase tracking-wider border border-blue-200">
                  {product.brand}
                </span>
                <span className="text-slate-400 font-mono">SKU: {product.sku}</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* Price Row */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-slate-950">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.original_price > product.price && (
                    <span className="text-base text-slate-400 line-through">
                      ₹{product.original_price.toLocaleString('en-IN')}
                    </span>
                  )}
                  {product.discount_percentage && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Save ₹{(product.original_price - product.price).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500">
                  Includes all applicable Indian GST (18%). No hidden checkout charges.
                </div>
              </div>

              {/* Stock Status Badge */}
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-slate-700">Availability:</span>
                {product.availability === 'in_stock' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    In Stock in Guwahati Warehouse ({product.stock_quantity} available)
                  </span>
                )}
                {product.availability === 'low_stock' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Limited Stock ({product.stock_quantity} units left)
                  </span>
                )}
                {isOutOfStock && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                    Currently Unavailable
                  </span>
                )}
              </div>

              {/* Installation Support Banner */}
              {product.has_installation_support && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-slate-900">Professional Installation Support</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Need hassle-free setup? NC Electro assigns a certified local technician in Guwahati to mount, wire, and configure your equipment safely.
                    </p>
                  </div>
                </div>
              )}

              {/* Delivery Guarantee Info */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Guwahati Delivery Information</span>
                </div>
                <p>
                  Same-Day dispatch for orders confirmed before 2:00 PM across Guwahati (Kamrup Metro). Handled by NC Electro fleet vans.
                </p>
              </div>

              {/* Quantity & CTA Buttons */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1 || isOutOfStock}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-slate-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                      disabled={quantity >= product.stock_quantity || isOutOfStock}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-xs text-slate-500">
                    Max {product.stock_quantity} units per order
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`flex-1 w-full py-4 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
                      isOutOfStock
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : added
                        ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/25 active:scale-98'
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span>Added to Cart</span>
                      </>
                    ) : isOutOfStock ? (
                      <span>Sold Out</span>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleOrderNow}
                    disabled={isOutOfStock}
                    className="flex-1 w-full py-4 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 border border-slate-800 shadow-md disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Order Now (Direct V1 Checkout)</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Grouped Specifications & Detailed Description */}
          <div className="mt-16 pt-12 border-t border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                Product Description & Features
              </h2>
              <div className="prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">NC Electro Guwahati Quality Guarantee</h3>
                <ul className="text-xs text-slate-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>100% Brand-Authorized Stock with original invoice & serial numbers.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Local technician on-site replacement assist if any DOA (Dead on Arrival) occurs.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Dedicated local customer helpline for wiring advice and battery maintenance.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                Technical Specifications
              </h2>

              <div className="rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 text-xs">
                {product.specifications.map((spec, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors">
                    <span className="font-semibold text-slate-600">{spec.key}</span>
                    <span className="font-bold text-slate-900 text-right">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="mt-20 pt-12 border-t border-slate-200">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-blue-600">Compatibility</div>
                  <h3 className="text-2xl font-black text-slate-950 tracking-tight">You May Also Need</h3>
                </div>
                <Link href={`/categories/${product.category.slug}`} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                  View category →
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {relatedProducts.map(rel => (
                  <ProductCard key={rel.id} product={rel} />
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
