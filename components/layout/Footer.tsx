'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      if (res.ok) {
        setSubscribed(true);
        setNewsletterEmail('');
      }
    } catch {
      // Graceful error
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#1A1816] text-[#FAF7F2] border-t border-stone-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Manifesto */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-serif-editorial text-2xl tracking-tight text-[#FAF7F2]">
              SECOND STORY
            </span>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              We curate rare vintage garments, archival streetwear, and honest pre-loved pieces.
              Each garment carries history and craftsmanship designed to outlive trends.
              Every piece is hand-measured, graded with complete transparency, and sent in 100% plastic-free packaging.
            </p>
            <div className="pt-2 text-xs text-[#C99E68] font-medium tracking-wide">
              Mumbai • London • Tokyo Archives
            </div>
          </div>

          {/* Catalog Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-stone-300">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><Link href="/shop?category=vintage-tees" className="hover:text-white transition">Vintage Tees & Graphics</Link></li>
              <li><Link href="/shop?category=denim" className="hover:text-white transition">Selvedge & 501s</Link></li>
              <li><Link href="/shop?category=jackets" className="hover:text-white transition">Workwear & Jackets</Link></li>
              <li><Link href="/shop?category=sweatshirts" className="hover:text-white transition">Heavyweight Knitwear</Link></li>
              <li><Link href="/shop?category=archive" className="hover:text-white transition">Designer Archive</Link></li>
              <li><Link href="/shop" className="hover:text-white transition">All Recent Drops</Link></li>
            </ul>
          </div>

          {/* Ethics & Standards */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-stone-300">
              Transparency
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><Link href="/#standards" className="hover:text-white transition">Condition Grading Guide</Link></li>
              <li><Link href="/#standards" className="hover:text-white transition">Garment Measurement Guide</Link></li>
              <li><Link href="/#standards" className="hover:text-white transition">Authenticity & Provenance</Link></li>
              <li><Link href="/#standards" className="hover:text-white transition">Shipping & 7-Day Returns</Link></li>
              <li><Link href="/admin" className="hover:text-stone-300 text-stone-500 transition">Curator Admin Portal</Link></li>
            </ul>
          </div>

          {/* Newsletter Dispatch */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-stone-300">
              Archive Dispatch
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Subscribers receive 1-hour early access to Sunday archive drops and exclusive pieces.
            </p>
            {subscribed ? (
              <div className="p-3 bg-stone-900 border border-[#3D4A3C] text-xs text-[#FAF7F2] flex items-center gap-2">
                <Check className="w-4 h-4 text-[#C99E68]" />
                <span>You are on the private drop list.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={e => setNewsletterEmail(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C99E68] rounded-sm pr-10"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="absolute right-2 top-2 text-stone-400 hover:text-white transition"
                    aria-label="Subscribe to newsletter"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} SECOND STORY VINTAGE. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Prices displayed in INR (₹)</span>
            <span>Secure Razorpay Encrypted Checkout</span>
            <span>Plastic-Free Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
