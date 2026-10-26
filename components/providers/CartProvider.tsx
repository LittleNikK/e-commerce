'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, Product } from '@/types';

interface CartContextType {
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  discountCode: string;
  shippingFee: number;
  total: number;
  totalItemCount: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  applyDiscount: (code: string) => Promise<{ success: boolean; message: string }>;
  removeDiscount: () => void;
  clearCart: () => void;
  freeShippingProgress: number; // percentage towards ₹2,999 threshold
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const GUEST_ID_KEY = 'second_story_guest_id';
const CART_STORAGE_KEY = 'second_story_bag_items';
const FREE_SHIPPING_LIMIT = 2999;
const STANDARD_SHIPPING_FEE = 150;

function getOrCreateGuestId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem(GUEST_ID_KEY);
  if (!id) {
    id = `guest_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    localStorage.setItem(GUEST_ID_KEY, id);
  }
  return id;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [discountCode, setDiscountCode] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
      const storedDiscount = localStorage.getItem('second_story_discount');
      if (storedDiscount) {
        setDiscountCode(storedDiscount);
      }
    } catch {
      // Ignore parse errors
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage and sync with server
  const syncWithServer = useCallback(async (currentItems: CartItem[], code?: string) => {
    try {
      const guestId = getOrCreateGuestId();
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: currentItems.map(i => ({ productId: i.productId, quantity: i.quantity })),
          guestId,
          discountCode: code || undefined,
        }),
      });
    } catch {
      // Offline / error tolerance
    }
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    if (discountCode) {
      localStorage.setItem('second_story_discount', discountCode);
    } else {
      localStorage.removeItem('second_story_discount');
    }
    syncWithServer(items, discountCode);
  }, [items, discountCode, isInitialized, syncWithServer]);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const shippingFee = (subtotal === 0 || discountedSubtotal >= FREE_SHIPPING_LIMIT) ? 0 : STANDARD_SHIPPING_FEE;
  const total = discountedSubtotal + shippingFee;
  const totalItemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_LIMIT) * 100));

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addItem = (product: Product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.productId === product._id);
      if (existing) {
        // If one of one, cannot exceed 1
        if (product.isOneOfOne) return prev;
        const newQty = Math.min(product.stock, existing.quantity + quantity);
        return prev.map(item =>
          item.productId === product._id ? { ...item, quantity: newQty } : item
        );
      }

      const newItem: CartItem = {
        productId: product._id,
        name: product.name,
        slug: product.slug,
        brand: product.brand,
        sizeLabel: product.sizeLabel,
        price: product.sellingPrice,
        image: product.images?.[0]?.url || '/placeholder.png',
        conditionGrade: product.conditionGrade,
        isOneOfOne: product.isOneOfOne,
        quantity: product.isOneOfOne ? 1 : Math.min(product.stock, quantity),
        maxStock: product.stock,
      };

      return [...prev, newItem];
    });

    setIsCartOpen(true);
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(prev =>
      prev.map(item => {
        if (item.productId === productId) {
          if (item.isOneOfOne) return item; // One-of-one pieces are strictly locked to quantity 1
          return { ...item, quantity: Math.min(item.maxStock, quantity) };
        }
        return item;
      })
    );
  };

  const applyDiscount = async (code: string) => {
    if (!code.trim()) {
      return { success: false, message: 'Please enter a discount code' };
    }

    try {
      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
          discountCode: code.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.calculation) {
        return { success: false, message: data.error || 'Invalid promotional code' };
      }

      if (data.calculation.discountAmount > 0) {
        setDiscountCode(code.trim().toUpperCase());
        setDiscountAmount(data.calculation.discountAmount);
        return {
          success: true,
          message: `Code applied: Saved ₹${data.calculation.discountAmount.toLocaleString('en-IN')}`,
        };
      } else {
        return {
          success: false,
          message: 'Code is not eligible or minimum order amount has not been met.',
        };
      }
    } catch {
      return { success: false, message: 'Failed to apply coupon. Try again.' };
    }
  };

  const removeDiscount = () => {
    setDiscountCode('');
    setDiscountAmount(0);
  };

  const clearCart = () => {
    setItems([]);
    setDiscountCode('');
    setDiscountAmount(0);
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem('second_story_discount');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal,
        discountAmount,
        discountCode,
        shippingFee,
        total,
        totalItemCount,
        isCartOpen,
        openCart,
        closeCart,
        addItem,
        removeItem,
        updateQuantity,
        applyDiscount,
        removeDiscount,
        clearCart,
        freeShippingProgress,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
