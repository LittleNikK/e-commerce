import React from 'react';
import { getDb } from '@/lib/db/mongodb';
import DiscountsClient from '@/components/admin/DiscountsClient';
import { DiscountCode } from '@/types';

export default async function AdminDiscountsPage() {
  const db = await getDb();
  const docs = await db.collection('discount_codes').find({}).sort({ createdAt: -1 }).toArray();

  const formatted: DiscountCode[] = docs.map(d => ({
    _id: d._id.toString(),
    code: d.code,
    type: d.type,
    value: d.value,
    minOrderAmount: d.minOrderAmount || 0,
    maxUses: d.maxUses || 0,
    usedCount: d.usedCount || 0,
    expiresAt: d.expiresAt,
    isActive: Boolean(d.isActive),
    createdAt: d.createdAt,
  }));

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-[#E8E2D8]">
        <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#3D4A3C]">
          Promotions & Drops
        </span>
        <h1 className="font-serif-editorial text-3xl sm:text-4xl text-[#1A1816] mt-0.5">
          Vouchers & Discount Codes
        </h1>
        <p className="text-xs text-[#5C564E] mt-1">
          Manage promotional vouchers with minimum order limits, usage quotas, and expiration dates.
        </p>
      </div>

      <DiscountsClient initialDiscounts={formatted} />
    </div>
  );
}
