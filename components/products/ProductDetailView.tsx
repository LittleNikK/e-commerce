'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Heart,
  Share2,
  Ruler,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Check,
  AlertCircle,
} from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/components/providers/CartProvider';
import { useToast } from '@/components/providers/ToastProvider';

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailView({ product, relatedProducts }: ProductDetailViewProps) {
  const { addItem } = useCart();
  const { success } = useToast();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const isSoldOut = product.stock <= 0;
  const images = product.images && product.images.length > 0
    ? product.images
    : [{ url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80', alt: product.name, isPrimary: true }];

  const currentImage = images[activeImageIndex] || images[0];

  const handleAddToCart = () => {
    if (isSoldOut) return;
    setIsAdding(true);
    addItem(product);
    success(`"${product.name}" added to your bag.`);
    setTimeout(() => setIsAdding(false), 600);
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      success('Link copied to clipboard');
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const handleWishlist = async () => {
    setIsWishlisted(!isWishlisted);
    try {
      await fetch('/api/wishlist', {
        method: isWishlisted ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id }),
      });
      success(isWishlisted ? 'Removed from wishlist' : 'Saved to your wishlist');
    } catch {
      setIsWishlisted(isWishlisted);
    }
  };

  const getConditionStyle = (grade: string) => {
    switch (grade) {
      case 'New with tags':
        return 'vintage-pill-new';
      case 'Excellent':
        return 'vintage-pill-excellent';
      case 'Very good':
        return 'vintage-pill-verygood';
      case 'Good':
        return 'vintage-pill-good';
      default:
        return 'vintage-pill-fair';
    }
  };

  return (
    <div className="bg-[#FAF7F2] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#7A7268] uppercase tracking-wider mb-8">
          <Link href="/" className="hover:text-[#1A1816]">Home</Link>
          <span>/</span>
          <Link href={`/shop?category=${product.category}`} className="hover:text-[#1A1816] capitalize">
            {product.category.replace('-', ' ')}
          </Link>
          <span>/</span>
          <span className="text-[#1A1816] font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Main Image */}
            <div className="relative aspect-4/5 rounded-sm overflow-hidden border border-[#E8E2D8] bg-stone-100 shadow-sm">
              <Image
                src={currentImage.url}
                alt={currentImage.alt || product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />

              {/* Condition Badge Overlay */}
              <div className="absolute top-4 left-4 z-10 flex gap-2">
                <span className={`editorial-badge ${getConditionStyle(product.conditionGrade)} shadow-sm`}>
                  {product.conditionGrade}
                </span>
                {product.isOneOfOne && (
                  <span className="editorial-badge bg-white/95 text-[#A34E36] border-[#E8E2D8] shadow-sm">
                    1-of-1 Piece
                  </span>
                )}
              </div>

              {/* Sold out overlay */}
              {isSoldOut && (
                <div className="absolute inset-0 bg-[#1A1816]/70 backdrop-blur-xs flex items-center justify-center z-20">
                  <span className="px-6 py-2 bg-[#FAF7F2] text-[#1A1816] text-xs font-semibold uppercase tracking-widest border border-stone-300 shadow-xl">
                    Archival Piece Sold
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={img.url + idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 aspect-square rounded-sm overflow-hidden border transition-all ${
                      activeImageIndex === idx
                        ? 'border-[#3D4A3C] ring-2 ring-[#3D4A3C]/20 shadow-xs'
                        : 'border-[#E8E2D8] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt || `Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Garment Information & Purchase */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs text-[#7A7268] tracking-widest uppercase font-medium mb-1.5">
                <span>{product.brand}</span>
                <span>Standard Size: {product.standardSize}</span>
              </div>

              <h1 className="font-serif-editorial text-2xl sm:text-3xl lg:text-4xl font-medium text-[#1A1816] leading-tight">
                {product.name}
              </h1>

              {/* Price & Reference */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="font-serif-editorial text-2xl sm:text-3xl font-semibold text-[#1A1816]">
                  ₹{product.sellingPrice.toLocaleString('en-IN')}
                </span>
                {product.referencePrice && product.referencePrice > product.sellingPrice && (
                  <span className="text-sm text-[#8E877D] line-through">
                    Est. Market Value: ₹{product.referencePrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-[11px] text-[#3D4A3C] font-medium bg-[#EBF3EA] px-2 py-0.5 rounded-xs">
                  Taxes Included
                </span>
              </div>
            </div>

            {/* One-of-one piece callout */}
            {product.isOneOfOne && !isSoldOut && (
              <div className="p-3.5 bg-[#F9ECE6] border border-[#EFCFC2] rounded-sm text-xs text-[#8C402B] flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#A34E36]" />
                <div>
                  <strong>Unique Archival Garment:</strong> We hold exactly one unit of this piece. Once purchased by a customer, it will not be restocked.
                </div>
              </div>
            )}

            {/* Description */}
            <div className="prose prose-stone text-xs sm:text-sm text-[#5C564E] leading-relaxed border-t border-b border-[#E8E2D8] py-4">
              <p>{product.description}</p>
            </div>

            {/* Garment Measurements Table */}
            <div className="space-y-3 bg-white p-4 rounded-sm border border-[#E8E2D8]">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1A1816]">
                <Ruler className="w-4 h-4 text-[#3D4A3C]" />
                <span>Laid-Flat Measurements</span>
              </div>
              <p className="text-[11px] text-[#7A7268]">
                Vintage tag reads &ldquo;{product.sizeLabel}&rdquo;. Fits modern <strong>{product.standardSize}</strong>.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#F4EFEA]">
                {Object.entries(product.measurements || {}).map(([key, val]) => {
                  if (!val) return null;
                  return (
                    <div key={key} className="flex justify-between py-1 border-b border-stone-100 last:border-b-0">
                      <span className="capitalize text-[#7A7268]">{key}:</span>
                      <span className="font-medium text-[#1A1816]">{val}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Condition Notes & Flaw Disclosures */}
            <div className="space-y-2 bg-[#FAF7F2] p-4 rounded-sm border border-[#E8E2D8]">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1A1816]">
                <ShieldCheck className="w-4 h-4 text-[#3D4A3C]" />
                <span>Condition Transparency</span>
              </div>
              <p className="text-xs text-[#5C564E] leading-relaxed">
                {product.conditionNotes}
              </p>
              {product.flaws && product.flaws.length > 0 && (
                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-[#8C402B] uppercase tracking-wider">
                    Noted Imperfections:
                  </span>
                  <ul className="list-disc list-inside text-xs text-[#5C564E] mt-1 space-y-0.5">
                    {product.flaws.map((flaw, idx) => (
                      <li key={idx}>{flaw}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* CTA Actions */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={isSoldOut || isAdding}
                className={`w-full py-4 text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-2 rounded-sm shadow-md transition-all ${
                  isSoldOut
                    ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    : 'bg-[#1A1816] text-[#FAF7F2] hover:bg-[#3D4A3C]'
                }`}
              >
                {isSoldOut ? (
                  'Sold Out'
                ) : isAdding ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Bag
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Add To Shopping Bag
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleWishlist}
                  className={`py-3 text-xs uppercase tracking-wider font-medium border rounded-sm flex items-center justify-center gap-2 transition ${
                    isWishlisted
                      ? 'bg-[#A34E36] text-white border-[#A34E36]'
                      : 'bg-white text-[#1A1816] border-[#E8E2D8] hover:border-[#3D4A3C]'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
                  <span>{isWishlisted ? 'Saved' : 'Wishlist'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="py-3 text-xs uppercase tracking-wider font-medium border border-[#E8E2D8] bg-white text-[#1A1816] hover:border-[#3D4A3C] rounded-sm flex items-center justify-center gap-2 transition"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedShare ? 'Copied' : 'Share'}</span>
                </button>
              </div>
            </div>

            {/* Shipping & Delivery Policies */}
            <div className="pt-4 border-t border-[#E8E2D8] space-y-2 text-xs text-[#5C564E]">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#3D4A3C]" />
                <span>Complimentary express shipping on orders over ₹2,999</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#3D4A3C]" />
                <span>7-Day Return Window (Original condition with tag attached)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Archive Garments */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[#E8E2D8]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif-editorial text-2xl text-[#1A1816]">
                More From The {product.category.replace('-', ' ').toUpperCase()} Archive
              </h2>
              <Link
                href={`/shop?category=${product.category}`}
                className="text-xs uppercase tracking-wider font-semibold text-[#1A1816] hover:text-[#3D4A3C]"
              >
                View Category
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(rel => (
                <div key={rel._id} className="bg-white p-3 rounded-sm border border-[#E8E2D8]">
                  <Link href={`/product/${rel.slug}`} className="block relative aspect-3/4 rounded-xs overflow-hidden mb-3">
                    <Image
                      src={rel.images?.[0]?.url || '/placeholder.png'}
                      alt={rel.name}
                      fill
                      className="object-cover img-zoom-hover"
                    />
                  </Link>
                  <p className="text-[10px] text-[#7A7268] uppercase tracking-wider">{rel.brand}</p>
                  <h4 className="font-serif-editorial text-sm font-medium text-[#1A1816] truncate mt-0.5">
                    <Link href={`/product/${rel.slug}`}>{rel.name}</Link>
                  </h4>
                  <p className="font-serif-editorial text-sm font-semibold text-[#1A1816] mt-1">
                    ₹{rel.sellingPrice.toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
