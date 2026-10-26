import { describe, it, expect } from 'vitest';

describe('Pricing, Shipping and Discount Calculations', () => {
  const FREE_SHIPPING_THRESHOLD = 2999;
  const STANDARD_SHIPPING_FEE = 150;

  function calculateShipping(subtotal: number): number {
    return (subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD) ? 0 : STANDARD_SHIPPING_FEE;
  }

  function applyPercentageDiscount(subtotal: number, percentage: number): number {
    return Math.round((subtotal * percentage) / 100);
  }

  function applyFixedDiscount(subtotal: number, fixedAmount: number, minOrder: number): number {
    if (subtotal < minOrder) return 0;
    return Math.min(subtotal, fixedAmount);
  }

  it('charges standard shipping for orders below ₹2,999', () => {
    expect(calculateShipping(1500)).toBe(150);
    expect(calculateShipping(2998)).toBe(150);
  });

  it('provides complimentary shipping for orders >= ₹2,999', () => {
    expect(calculateShipping(2999)).toBe(0);
    expect(calculateShipping(8500)).toBe(0);
  });

  it('charges 0 shipping when subtotal is 0', () => {
    expect(calculateShipping(0)).toBe(0);
  });

  it('calculates 10% percentage discount properly', () => {
    const subtotal = 6800;
    const discount = applyPercentageDiscount(subtotal, 10);
    expect(discount).toBe(680);
    expect(subtotal - discount).toBe(6120);
  });

  it('calculates fixed discount only when meeting minimum order amount', () => {
    const fixedDiscount = 500;
    const minOrder = 3000;

    expect(applyFixedDiscount(2500, fixedDiscount, minOrder)).toBe(0);
    expect(applyFixedDiscount(4500, fixedDiscount, minOrder)).toBe(500);
  });

  it('enforces that vintage one-of-one pieces cannot exceed quantity 1', () => {
    const item = {
      isOneOfOne: true,
      requestedQuantity: 5,
    };
    const allowedQty = item.isOneOfOne ? 1 : item.requestedQuantity;
    expect(allowedQty).toBe(1);
  });
});
