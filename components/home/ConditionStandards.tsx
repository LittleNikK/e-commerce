import React from 'react';
import { Ruler, ShieldCheck, RefreshCw, Award } from 'lucide-react';

export default function ConditionStandards() {
  const standards = [
    {
      grade: 'New with tags',
      label: 'Deadstock Vintage',
      desc: 'Unworn vintage garment with original paper swing tags, store labels, or packaging intact. Never laundered.',
      pillClass: 'vintage-pill-new',
    },
    {
      grade: 'Excellent',
      label: 'Museum Grade',
      desc: 'Exceptionally well preserved. Fabric structure, elasticity, color density, and seams are pristine with near zero signs of age.',
      pillClass: 'vintage-pill-excellent',
    },
    {
      grade: 'Very good',
      label: 'Gently Worn',
      desc: 'Minor natural vintage wash wear or soft fading that enhances handfeel. No holes, tears, or structural faults.',
      pillClass: 'vintage-pill-verygood',
    },
    {
      grade: 'Good',
      label: 'Honest Character',
      desc: 'Authentic patina: light collar fraying, paint speckles, or honest distressing. All visible marks are photographed and disclosed.',
      pillClass: 'vintage-pill-good',
    },
    {
      grade: 'Fair',
      label: 'Heavy Patina',
      desc: 'Heavily weathered workwear or distressed skate/band grail. Significant wear that tells a genuine story.',
      pillClass: 'vintage-pill-fair',
    },
  ];

  return (
    <section id="standards" className="py-16 md:py-24 bg-[#F4EFEA] border-b border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3D4A3C]">
            The Second Story Guarantee
          </span>
          <h2 className="font-serif-editorial text-3xl sm:text-4xl text-[#1A1816]">
            Transparent Condition & Measurements
          </h2>
          <p className="text-xs sm:text-sm text-[#5C564E] leading-relaxed">
            Vintage sizing varies wildly across decades and brands. We never rely on tag size alone.
            Every item is measured flat and inspected under high-CRI lighting.
          </p>
        </div>

        {/* 5 Condition Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
          {standards.map(item => (
            <div
              key={item.grade}
              className="bg-[#FAF7F2] p-5 rounded-sm border border-[#E8E2D8] flex flex-col justify-between space-y-3 shadow-xs hover:border-[#3D4A3C] transition-colors"
            >
              <div>
                <span className={`editorial-badge ${item.pillClass} mb-2`}>
                  {item.grade}
                </span>
                <h3 className="font-serif-editorial text-sm font-semibold text-[#1A1816] mt-1">
                  {item.label}
                </h3>
                <p className="text-xs text-[#5C564E] mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-[#E8E2D8]">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center shrink-0 text-[#3D4A3C]">
              <Ruler className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-serif-editorial text-base font-semibold text-[#1A1816]">
                True Garment Measurements
              </h4>
              <p className="text-xs text-[#5C564E] leading-relaxed">
                Pit-to-pit, back length, shoulder width, and sleeve measurements are listed on every garment card.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center shrink-0 text-[#3D4A3C]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-serif-editorial text-base font-semibold text-[#1A1816]">
                Authenticity Guaranteed
              </h4>
              <p className="text-xs text-[#5C564E] leading-relaxed">
                Every tag, stitching method (single vs double stitch), zipper manufacturer, and RN code is verified.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center shrink-0 text-[#3D4A3C]">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-serif-editorial text-base font-semibold text-[#1A1816]">
                7-Day Hassle-Free Returns
              </h4>
              <p className="text-xs text-[#5C564E] leading-relaxed">
                Doesn’t fit like you expected? Return any qualifying vintage garment within 7 days in original condition.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
