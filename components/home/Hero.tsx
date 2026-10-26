import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative bg-[#FAF7F2] border-b border-[#E8E2D8] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 lg:pr-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D5CCC0] bg-white/80 backdrop-blur-xs text-[11px] font-medium tracking-widest uppercase text-[#3D4A3C]">
              <span>Archive Drop No. 04 Now Live</span>
            </div>

            <h1 className="font-serif-editorial text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#1A1816] leading-[1.08]">
              Pre-loved pieces. <br />
              <span className="italic font-normal text-[#3D4A3C]">New stories.</span>
            </h1>

            <p className="text-sm sm:text-base text-[#5C564E] leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
              A curated online archive for handpicked 90s graphic tees, single-stitch rarities,
              distressed workwear jackets, and Japanese designer pieces. Each garment is unique,
              fully measured, and authenticated.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/shop"
                className="w-full sm:w-auto px-8 py-4 bg-[#1A1816] text-[#FAF7F2] text-xs font-semibold tracking-widest uppercase hover:bg-[#3D4A3C] transition flex items-center justify-center gap-2 rounded-sm shadow-md"
              >
                <span>Shop The Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/shop?category=vintage-tees"
                className="w-full sm:w-auto px-8 py-4 border border-[#1A1816] text-[#1A1816] text-xs font-semibold tracking-widest uppercase hover:bg-[#FAF7F2] hover:border-[#3D4A3C] hover:text-[#3D4A3C] transition flex items-center justify-center rounded-sm"
              >
                <span>Explore 90s Tees</span>
              </Link>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-8 border-t border-[#E8E2D8] grid grid-cols-3 gap-6 text-center lg:text-left">
              <div>
                <p className="font-serif-editorial text-2xl font-semibold text-[#1A1816]">1-of-1</p>
                <p className="text-[11px] uppercase tracking-wider text-[#7A7268] mt-0.5">Unique Pieces</p>
              </div>
              <div>
                <p className="font-serif-editorial text-2xl font-semibold text-[#1A1816]">100%</p>
                <p className="text-[11px] uppercase tracking-wider text-[#7A7268] mt-0.5">Hand-Measured</p>
              </div>
              <div>
                <p className="font-serif-editorial text-2xl font-semibold text-[#1A1816]">0%</p>
                <p className="text-[11px] uppercase tracking-wider text-[#7A7268] mt-0.5">Fast Fashion Waste</p>
              </div>
            </div>
          </div>

          {/* Right Asymmetrical Editorial Image Grid */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Editorial Hero Image */}
              <div className="relative aspect-4/5 rounded-sm overflow-hidden border border-[#D5CCC0] shadow-xl bg-stone-200">
                <Image
                  src="https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=80"
                  alt="Curated Vintage Carhartt Detroit Jacket"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white p-3 bg-black/40 backdrop-blur-md rounded-xs border border-white/20">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-serif-editorial font-medium">1998 Carhartt J97 Detroit</span>
                    <span className="text-[#C99E68] font-semibold">₹14,800</span>
                  </div>
                  <p className="text-[10px] text-stone-300 mt-0.5">Faded Moss Green Canvas • Genuine Patina</p>
                </div>
              </div>

              {/* Overlapping Floating Polaroid Detail */}
              <div className="hidden sm:block absolute -bottom-6 -left-8 w-44 aspect-square rounded-sm overflow-hidden border-4 border-white shadow-2xl bg-white rotate-[-3deg]">
                <Image
                  src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80"
                  alt="Single Stitch Tour Graphic Tee"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
