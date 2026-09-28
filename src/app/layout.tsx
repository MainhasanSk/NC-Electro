import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/components/providers/AppProviders';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NC Electro | Fast Delivery & Installation in Guwahati',
  description: 'Buy CCTV, Inverters, Batteries, and Electrical supplies in Guwahati, Assam with fast same-day local delivery and professional installation support.',
  keywords: ['NC Electro', 'CCTV Guwahati', 'Inverter battery Guwahati', 'Luminous inverter Assam', 'Hikvision CCTV', 'Electrical supplies Guwahati'],
  openGraph: {
    title: 'NC Electro — Guwahati\'s Modern Electronics Partner',
    description: 'Fast local delivery + professional installation for CCTV, inverters, batteries, and electrical materials in Guwahati.',
    type: 'website',
    locale: 'en_IN',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
        <AppProviders>
          {children}
          <MobileBottomNav />
        </AppProviders>
      </body>
    </html>
  );
}
