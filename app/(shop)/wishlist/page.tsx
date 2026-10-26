'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useCart } from '@/components/providers/CartProvider';
import { useToast } from '@/components/providers/ToastProvider';

interface WishlistItem {
  _id: string;
  name: string;
  slug: string;
  brand: string;
  sizeLabel: string;
  sellingPrice: number;
  conditionGrade: string;
  image: string;
  stock: number;
  isOneOfOne: boolean;
}

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const { addItem } = useCart();
  const { success, error } = useToast();

  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchWishlist() {
      try {
        const res = await fetch('/api/wishlist');
        const data = await res.json();
        if (data.wishlist) {
          setItems(data.wishlist);
        }
      } catch {
        error('Failed to load wishlist');
      } finally {
        setLoading(false);
      }
    }

    fetchWishlist();
  }, [user, error]);

  const handleRemove = async (productId: string) => {
    try {
      await fetch(`/api/wishlist?productId=${productId}`, { method: 'DELETE' });
      setItems(prev => prev.filter(i => i._id !== productId));
      success('Removed from wishlist');
    } catch {
      error('Failed to remove item');
    }
  };

  const handleMoveToBag = (item: WishlistItem) => {
    // Create a product-like object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addItem(item as any);
    success(`"${item.name}" added to bag`);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FAF7F2]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#3D4A3C] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest text-[#7A7268]">Loading your saved pieces...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FAF7F2] px-4 py-16">
        <div className="max-w-md w-full bg-white p-8 rounded-sm border border-[#E8E2D8] text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center text-[#A34E36]">
            <Heart className="w-6 h-6" />
          </div>
          <h2 className="font-serif-editorial text-2xl text-[#1A1816]">Save Your Favorite Grails</h2>
          <p className="text-xs text-[#5C564E] leading-relaxed">
            Please log in or create an account to save one-of-one vintage items and track their availability.
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-block px-8 py-3 bg-[#1A1816] text-[#FAF7F2] text-xs font-semibold uppercase tracking-widest hover:bg-[#3D4A3C] transition rounded-sm"
            >
              Sign In / Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-[#E8E2D8] pb-6 mb-8 flex items-baseline justify-between">
          <div>
            <h1 className="font-serif-editorial text-3xl sm:text-4xl text-[#1A1816]">
              Your Saved Archive
            </h1>
            <p className="text-xs text-[#5C564E] mt-1">
              {items.length} {items.length === 1 ? 'garment' : 'garments'} saved in your wishlist
            </p>
          </div>
          <Link
            href="/shop"
            className="text-xs font-semibold uppercase tracking-wider text-[#3D4A3C] hover:underline flex items-center gap-1"
          >
            <span>Continue Browsing</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="bg-white border border-[#E8E2D8] p-12 text-center rounded-sm space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center text-stone-400">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-serif-editorial text-xl text-[#1A1816]">No saved garments yet</h3>
            <p className="text-xs text-[#7A7268] max-w-sm mx-auto leading-relaxed">
              Click the heart icon on any product card or detail page to save it for later.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-block px-6 py-2.5 bg-[#1A1816] text-white text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-[#3D4A3C] transition"
              >
                Explore The Archive
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map(item => (
              <div
                key={item._id}
                className="bg-white border border-[#E8E2D8] rounded-sm overflow-hidden flex flex-col justify-between"
              >
                <div className="relative aspect-3/4 bg-stone-100">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="absolute top-2 right-2 p-2 bg-white/90 rounded-full text-stone-500 hover:text-[#A34E36] transition shadow-xs"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  {item.stock <= 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="px-3 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-wider">
                        Sold Out
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#7A7268] font-medium">
                      {item.brand} • Size {item.sizeLabel}
                    </span>
                    <h3 className="font-serif-editorial text-sm font-medium text-[#1A1816] truncate mt-0.5">
                      <Link href={`/product/${item.slug}`}>{item.name}</Link>
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#E8E2D8]">
                    <span className="font-serif-editorial text-base font-semibold text-[#1A1816]">
                      ₹{item.sellingPrice.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => handleMoveToBag(item)}
                      disabled={item.stock <= 0}
                      className="px-3 py-1.5 bg-[#3D4A3C] text-white text-xs font-medium uppercase tracking-wider rounded-sm hover:bg-[#2F3B2E] transition disabled:opacity-40"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 inline mr-1" /> Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
