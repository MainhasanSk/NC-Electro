import React from 'react';
import Link from 'next/link';
import { Zap, ShieldCheck, Truck, Headphones, MapPin, Mail, Phone } from 'lucide-react';

export function StoreFooter() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-24 md:pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Core Value Props Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-900">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-800/40 flex items-center justify-center text-blue-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Fast Local Delivery</h4>
              <p className="text-xs text-slate-400 mt-1">Same-day delivery across Guwahati for eligible in-stock items.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-800/40 flex items-center justify-center text-blue-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Professional Installation</h4>
              <p className="text-xs text-slate-400 mt-1">Skilled on-site setup for CCTV cameras, inverters, and battery systems.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-800/40 flex items-center justify-center text-blue-400 shrink-0">
              <Zap className="w-6 h-6 fill-blue-400" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">100% Genuine Products</h4>
              <p className="text-xs text-slate-400 mt-1">Direct from authorized brands: Hikvision, Luminous, Havells, Schneider.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-800/40 flex items-center justify-center text-blue-400 shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Dedicated Guwahati Support</h4>
              <p className="text-xs text-slate-400 mt-1">Local warranty assistance and post-installation service support.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
                <Zap className="w-5 h-5 fill-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                NC ELECTRO
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Guwahati&apos;s next-generation electronics commerce platform. We pair premium security, power backup, and electrical infrastructure with reliable local dispatch and certified installation technicians.
            </p>
            <div className="pt-2 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>GS Road & Paltan Bazar Operations Hub, Guwahati, Assam 781005</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+91 98640 12345 / 0361 2450099</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>contact@ncelectro.in</span>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h5 className="text-white font-bold text-sm mb-4 tracking-wider uppercase">Shop Electronics</h5>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/categories/cctv" className="hover:text-blue-400 transition-colors">CCTV & Surveillance</Link></li>
              <li><Link href="/categories/inverters" className="hover:text-blue-400 transition-colors">Pure Sine Wave Inverters</Link></li>
              <li><Link href="/categories/batteries" className="hover:text-blue-400 transition-colors">Tall Tubular Batteries</Link></li>
              <li><Link href="/categories/electrical-materials" className="hover:text-blue-400 transition-colors">Wires, Cables & MCBs</Link></li>
              <li><Link href="/categories/accessories" className="hover:text-blue-400 transition-colors">Trolleys & Connectors</Link></li>
              <li><Link href="/products" className="hover:text-blue-400 transition-colors">Browse Full Catalog</Link></li>
            </ul>
          </div>

          {/* Customer & Orders */}
          <div>
            <h5 className="text-white font-bold text-sm mb-4 tracking-wider uppercase">Customer Hub</h5>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/account" className="hover:text-blue-400 transition-colors">My Account</Link></li>
              <li><Link href="/account/orders" className="hover:text-blue-400 transition-colors">Track Your Order</Link></li>
              <li><Link href="/account/wishlist" className="hover:text-blue-400 transition-colors">Saved Wishlist</Link></li>
              <li><Link href="/account/cart" className="hover:text-blue-400 transition-colors">Shopping Cart</Link></li>
              <li><Link href="/account/addresses" className="hover:text-blue-400 transition-colors">Manage Addresses</Link></li>
              <li><Link href="/login" className="hover:text-blue-400 transition-colors">Sign In / Register</Link></li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h5 className="text-white font-bold text-sm mb-4 tracking-wider uppercase">Company</h5>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/about" className="hover:text-blue-400 transition-colors">About NC Electro</Link></li>
              <li><Link href="/services" className="hover:text-blue-400 transition-colors">Installation Services</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
              <li><Link href="/about#guwahati" className="hover:text-blue-400 transition-colors">Guwahati Service Areas</Link></li>
              <li><span className="text-slate-600">Privacy & Terms</span></li>
            </ul>
          </div>
        </div>

        {/* Local Service Localities Tag Cloud */}
        <div className="pt-8 pb-6 border-t border-slate-900 text-xs text-slate-500">
          <div className="font-semibold text-slate-400 mb-2">Delivering and installing across Guwahati localities:</div>
          <p className="leading-relaxed">
            Zoo Road • Christian Basti • Ganeshguri • Beltola • Six Mile • Dispur • Panbazar • Paltan Bazar • Ulubari • Bharalumukh • Jalukbari • Maligaon • Chandmari • Silpukhuri • Geetanagar • Hatigaon • Kahilipara • Khanapara • Noonmati • Borbari
          </p>
        </div>

        {/* Bottom Strip */}
        <div className="pt-6 border-t border-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} NC Electro. All rights reserved. Registered in Guwahati, Assam.
          </div>
          <div className="flex items-center gap-4">
            <span>Fast Delivery</span>
            <span>•</span>
            <span>Professional Installation</span>
            <span>•</span>
            <span>Genuine Quality Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
