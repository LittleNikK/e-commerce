import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { CartProvider } from '@/components/providers/CartProvider';
import { ToastProvider } from '@/components/providers/ToastProvider';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SECOND STORY — Curated Vintage & Archival Fashion',
  description: 'Pre-loved pieces. New stories. A curated online archive for handpicked 90s vintage graphic tees, selvedge denim, rare workwear, and Japanese designer pieces in India.',
  keywords: ['vintage clothing', 'thrift online', '90s single stitch', 'vintage denim', 'archive fashion India', 'sustainable fashion'],
  metadataBase: new URL(process.env.APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'SECOND STORY — Curated Vintage & Archival Fashion',
    description: 'Pre-loved pieces. New stories. Unique 1-of-1 vintage garments with complete transparent condition notes.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Second Story Vintage',
  },
};

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${jakarta.variable} scroll-smooth`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body
        className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1A1816]"
        suppressHydrationWarning
      >
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <AnnouncementBar />
              <Header />
              <div className="flex-1">
                {children}
              </div>
              <Footer />
              <CartDrawer />
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
