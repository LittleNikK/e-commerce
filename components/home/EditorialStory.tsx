import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Leaf } from 'lucide-react';

export default function EditorialStory() {
  return (
    <section className="py-20 md:py-28 bg-[#FAF7F2] border-b border-[#E8E2D8] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-4/5 rounded-sm overflow-hidden border border-[#D5CCC0] shadow-xl bg-stone-200">
              <Image
                src="https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=1200&q=80"
                alt="Vintage 90s Levi's 501 Selvedge Denim Fades"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-white text-xs font-serif-editorial italic">
                “Clothing made before planned obsolescence.”
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3D4A3C]">
              <Leaf className="w-3.5 h-3.5" />
              <span>The Philosophy of Second Story</span>
            </div>

            <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl text-[#1A1816] leading-[1.15]">
              Fast fashion was made to be discarded. <br />
              <span className="italic font-normal text-[#A34E36]">We preserve what was made to endure.</span>
            </h2>

            <p className="text-sm text-[#5C564E] leading-relaxed">
              In an era dominated by synthetic microplastics and fleeting algorithm-driven trends,
              vintage clothing represents rebellion. Heavyweight ring-spun cotton that gets softer with every wash.
              Pure indigo dyes that develop whisker patterns unique to how you sit, walk, and live.
            </p>

            <p className="text-sm text-[#5C564E] leading-relaxed">
              When you purchase from Second Story, you are not merely acquiring a garment.
              You become the custodian of its next chapter. No virgin water consumed. No dye dumped into rivers.
              Just timeless design, curated with utmost reverence.
            </p>

            <div className="pt-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#1A1816] hover:text-[#3D4A3C] border-b border-[#1A1816] pb-1 hover:border-[#3D4A3C] transition"
              >
                <span>Read The Archive Journal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
